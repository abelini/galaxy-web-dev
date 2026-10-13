# Galaxy Web

Landing page de **Galaxy Web**: hospedaje, diseño y desarrollo web, apps Android, streaming de audio y video y WordPress ultrarrápido en LiteSpeed. Con formulario de contacto para pedir presupuesto.

- Producción: <https://galaxyweb.dev>
- Subdominio Cloud (landing estático aparte, ver `cloud/`): <https://cloud.galaxyweb.dev>

## Stack

- **Astro 7** con render en servidor (SSR) y adapter para **Cloudflare Workers** (`@astrojs/cloudflare`)
- **Tailwind CSS 4** (vía plugin de Vite)
- **TypeScript** estricto (`astro/tsconfigs/strict`)
- **Wrangler** para tipos, dev y deploy
- Sin framework JS en el cliente: el formulario usa un `<script>` vanilla y Cloudflare Turnstile

## Estructura

```text
src/
  pages/
    index.astro        # Landing principal (Hero + Servicios + Proceso + WhyGalaxy + ContactForm)
    api/contact.ts     # Endpoint POST /api/contact (prerender = false)
  layouts/
    LandingLayout.astro # <html>, fondo espacial, Navbar + Footer
  components/
    BaseHead.astro      # Meta, OG/Twitter, fuentes, Font Awesome
    landing/
      Hero.astro        # Portada + stats + mockup de terminal
      Services.astro    # Grid de 6 servicios + card CTA
      Process.astro     # Proceso en 4 pasos
      WhyGalaxy.astro   # Diferenciadores
      ContactForm.astro # Formulario con Turnstile y envío por fetch
      Navbar.astro / Footer.astro / SectionHeading.astro
  consts.ts             # SITE_TITLE, SITE_DESCRIPTION, SERVICES, CONTACT_EMAIL
  styles/tailwind.css   # Tema (colores void/panel/neon/grape, fuentes)
public/
  assets/logo.png       # Logo
  favicon-32x32.png / apple-touch-icon.png
cloud/
  index.html            # Landing minimalista de cloud.galaxyweb.dev (estático, sin build)
  logo.png              # Copia del logo para ese landing
```

## Requisitos

- Node.js >= 22
- npm (hay `package-lock.json`)

## Puesta en marcha

```bash
npm install
cp .env.example .env
cp .dev.vars.example .dev.vars
npm run dev
```

### Variables de entorno

Públicas (van al HTML, archivo `.env`):

| Variable | Descripción | Valor de dev |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Sitekey de Cloudflare Turnstile | `1x00000000000000000000AA` (key de test, siempre pasa) |

Secretas (solo Worker, archivo `.dev.vars`, nunca en git):

| Variable | Descripción |
|---|---|
| `TURNSTILE_SECRET` | Secreto de Turnstile para verificar el token en el servidor |
| `MAIL_API_KEY` | Bearer token de la API de correo |
| `MAIL_API_URL` | Endpoint de envío (defecto en `wrangler.json`) |
| `MAIL_FROM` / `MAIL_TO` | Remitente y destinatario |

En producción los secretos se configuran con:

```bash
wrangler secret put TURNSTILE_SECRET
wrangler secret put MAIL_API_KEY
```

Y las públicas (`MAIL_API_URL`, `MAIL_FROM`, `MAIL_TO`) están como `vars` en `wrangler.json`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo Astro |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Build + `wrangler dev` local |
| `npm run deploy` | Despliegue a Cloudflare Workers |
| `npm run check` | `astro build` + `tsc` + `wrangler deploy --dry-run` |
| `npm run cf-typegen` | Regenera `worker-configuration.d.ts` |

## Formulario de contacto (`POST /api/contact`)

Flujo: validación en cliente (`ContactForm.astro`) → `fetch /api/contact` → validación en servidor → verificación Turnstile → envío de email vía API externa → `{ ok: true }`.

Validaciones del servidor (`src/pages/api/contact.ts`):

- Nombre 2–100 caracteres, email válido (máx. 254)
- Servicio dentro de la lista cerrada (`Hospedaje web`, `WordPress ultrarrápido`, `Diseño web`, `Desarrollo web`, `App Android`, `Streaming audio / video`, `Proyecto completo`)
- Mensaje 10–5000 caracteres, escapado a HTML antes de componer el correo
- Token Turnstile obligatorio; se verifica contra `https://challenges.cloudflare.com/turnstile/v0/siteverify` **antes** de llamar a la API de correo
- Rate-limit en memoria: 5 envíos / hora / IP (best-effort por isolate)

La key del correo (`MAIL_API_KEY`) solo existe en el Worker, nunca llega al front.

### Anti-spam y anti-crawlers

- Turnstile de Cloudflare (en dev, keys de test que siempre pasan; en prod pon tus keys reales)
- El email del `mailto` va **invertido en el HTML** (`.email-rev` con `direction: rtl`) y el JS lo reconstruye al cargar, para que los crawlers no lo cosechen

## Despliegue (landing principal)

1. `npm run build` para verificar que compila
2. `wrangler secret put TURNSTILE_SECRET` y `wrangler secret put MAIL_API_KEY`
3. Revisa las `vars` de `wrangler.json` (`MAIL_API_URL`, `MAIL_FROM`, `MAIL_TO`)
4. `npm run deploy`

El Worker sirve `dist/` como assets y ejecuta el SSR + `/api/contact`. Requiere Node compat (`nodejs_compat`) y fecha de compatibilidad `2026-10-01` (ver `wrangler.json`).

## Personalización

- **Servicios**: edita `SERVICES` en `src/consts.ts` (título, descripción, icono Font Awesome y etiqueta). El `<select>` del formulario usa la misma lista; si añades un servicio, añádelo también a `ALLOWED_SERVICES` en `src/pages/api/contact.ts`
- **Colores/fuentes**: tema en `src/styles/tailwind.css` (`--color-void`, `--color-panel`, `--color-neon`, `--color-grape`; `--font-display`, `--font-body`). Las fuentes Google se cargan en `BaseHead.astro`
- **Secciones**: se componen en `src/pages/index.astro`; cada bloque es un componente independiente en `src/components/landing/`
- **Textos SEO**: `SITE_TITLE` / `SITE_DESCRIPTION` en `src/consts.ts`, dominio en `site` de `astro.config.mjs`
