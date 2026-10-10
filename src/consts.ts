export const SITE_TITLE = "Galaxy Web — Diseño, desarrollo y streaming";
export const SITE_DESCRIPTION =
  "Hospedaje, diseño web, desarrollo responsive, apps Android y streaming de audio y video. Creamos tu presencia digital completa.";

export interface Service {
  title: string;
  desc: string;
  icon: string;
  tag: string;
}

export const SERVICES: Service[] = [
  {
    title: "Hospedaje web",
    desc: "Hosting rápido y seguro con SSL, copias y despliegue en Cloudflare. Tu web siempre online.",
    icon: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm2 0v10h12V5H6Zm3 3h6v2H9V8Z",
    tag: "Hosting",
  },
  {
    title: "Diseño web",
    desc: "Diseños modernos, limpios y centrados en conversión. De la idea al prototipo listo para desarrollar.",
    icon: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
    tag: "UI / UX",
  },
  {
    title: "Desarrollo web responsive",
    desc: "Webs ultrarrápidas con Astro + Tailwind, adaptadas a móvil, tablet y desktop. SEO incluido.",
    icon: "M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2v8h14V6H5Zm7 11h2v2h-2v-2Z",
    tag: "Astro",
  },
  {
    title: "Apps Android",
    desc: "Apps Android nativas e híbridas: publicación en Play Store, notificaciones y mantenimiento.",
    icon: "M7 2h2v3H7V2Zm10 0h-2v3h2V2ZM12 6c-3.3 0-6 2.4-6.5 5.5L4 19l2.5-.5L8 21l1.2-2.4c.9.3 1.8.4 2.8.4s1.9-.1 2.8-.4L16 21l1.5-2.5L20 19l-1.5-7.5C18 8.4 15.3 6 12 6Z",
    tag: "Android",
  },
  {
    title: "Streaming audio y video",
    desc: "Plataformas de streaming, radios online y video bajo demanda con baja latencia y alta disponibilidad.",
    icon: "M8 5v14l11-7L8 5Zm2 3.3 5.5 3.7L10 15.7V8.3Z",
    tag: "Streaming",
  },
];

export const CONTACT_EMAIL = "sales@galaxyweb.dev";
