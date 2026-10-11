export const prerender = false;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_MAIL_URL = "https://platform.cyberpersons.com/email/v1/send";
// Test keys de Cloudflare (solo para dev, siempre pasan). En prod usa tus keys reales.
const TEST_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";

const ALLOWED_SERVICES = [
  "Hospedaje web",
  "Diseño web",
  "Desarrollo web",
  "App Android",
  "Streaming audio / video",
  "Proyecto completo",
];

// Rate-limit best-effort en memoria (por isolate): 5 envíos / hora / IP
const hits = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= 5) return true;
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

function getEnv(locals: unknown, key: string, fallback = ""): string {
  const runtimeEnv = (locals as Record<string, unknown> | undefined)?.["runtime"] as
    | { env?: Record<string, string> }
    | undefined;
  if (runtimeEnv?.env?.[key]) return runtimeEnv.env[key] as string;
  try {
    const v = (import.meta as unknown as { env?: Record<string, string> }).env?.[key];
    if (v) return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST({
  request,
  locals,
  clientAddress,
}: {
  request: Request;
  locals: unknown;
  clientAddress?: string;
}) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Petición inválida." }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const email = String(body.email ?? "").trim();
  const servicio = String(body.servicio ?? "").trim();
  const mensaje = String(body.mensaje ?? "").trim();
  const turnstileToken = String(body.turnstileToken ?? "").trim();

  if (nombre.length < 2 || nombre.length > 100)
    return Response.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return Response.json({ error: "Escribe un email válido." }, { status: 400 });
  if (!ALLOWED_SERVICES.includes(servicio))
    return Response.json({ error: "Selecciona un servicio válido." }, { status: 400 });
  if (mensaje.length < 10 || mensaje.length > 5000)
    return Response.json({ error: "Cuéntanos un poco más (10-5000 caracteres)." }, { status: 400 });
  if (!turnstileToken)
    return Response.json({ error: "Completa la verificación anti-spam." }, { status: 403 });

  const ip =
    clientAddress ||
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";
  if (isRateLimited(ip))
    return Response.json(
      { error: "Demasiados envíos. Inténtalo de nuevo en una hora." },
      { status: 429 }
    );

  const turnstileSecret = getEnv(locals, "TURNSTILE_SECRET", TEST_TURNSTILE_SECRET);
  if (!turnstileSecret)
    return Response.json({ error: "Falta configuración anti-spam." }, { status: 500 });

  // 1. Verificar Turnstile (obligatorio antes de tocar tu API SMTP)
  try {
    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
        remoteip: ip,
      }),
    });
    const verify = (await verifyRes.json()) as { success?: boolean };
    if (!verify.success)
      return Response.json({ error: "Verificación anti-spam fallida." }, { status: 403 });
  } catch {
    return Response.json({ error: "No se pudo verificar el captcha." }, { status: 502 });
  }

  // 2. Enviar email vía tu API (la key solo vive en el Worker, nunca en el front)
  const mailApiUrl = getEnv(locals, "MAIL_API_URL", DEFAULT_MAIL_URL);
  const mailApiKey = getEnv(locals, "MAIL_API_KEY", "");
  const mailFrom = getEnv(locals, "MAIL_FROM", "website@galaxyweb.dev");
  const mailTo = getEnv(locals, "MAIL_TO", "sales@galaxyweb.dev");
  if (!mailApiKey)
    return Response.json({ error: "Falta configuración de correo." }, { status: 500 });

  const subject = `[Galaxy Web] ${servicio} — ${nombre}`;
  const html = `<h2>Nuevo presupuesto — Galaxy Web</h2><p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Servicio:</strong> ${escapeHtml(servicio)}</p><p><strong>Mensaje:</strong></p><p>${escapeHtml(mensaje).replaceAll("\n", "<br />")}</p>`;

  try {
    const mailRes = await fetch(mailApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mailApiKey}`,
      },
      body: JSON.stringify({ from: mailFrom, to: mailTo, subject, html }),
    });
    if (!mailRes.ok) {
      const text = await mailRes.text().catch(() => "");
      console.error("Mail API error:", mailRes.status, text.slice(0, 500));
      return Response.json({ error: "No se pudo enviar. Inténtalo más tarde." }, { status: 502 });
    }
  } catch (e) {
    console.error("Mail API fetch failed:", e);
    return Response.json({ error: "No se pudo enviar. Inténtalo más tarde." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
