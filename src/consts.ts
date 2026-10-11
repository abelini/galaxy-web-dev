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
    icon: "fa-solid fa-database",
    tag: "Hosting",
  },
  {
    title: "Diseño web",
    desc: "Diseños modernos, limpios y centrados en conversión. De la idea al prototipo listo para desarrollar.",
    icon: "fa-solid fa-wand-magic-sparkles",
    tag: "UI / UX",
  },
  {
    title: "Desarrollo web",
    desc: "Webs ultrarrápidas con Astro + Tailwind, adaptadas a móvil, tablet y desktop. SEO incluido.",
    icon: "fa-solid fa-laptop-code",
    tag: "Astro",
  },
  {
    title: "Apps Android",
    desc: "Apps Android nativas e híbridas: publicación en Play Store, notificaciones y mantenimiento.",
    icon: "fa-brands fa-android",
    tag: "Android",
  },
  {
    title: "Streaming audio y video",
    desc: "Plataformas de streaming, radios online y video bajo demanda con baja latencia y alta disponibilidad.",
    icon: "fa-solid fa-play",
    tag: "Streaming",
  },
  {
    title: "WordPress ultrarrápido",
    desc: "Servidores LiteSpeed con LSCache: tu WordPress carga en milisegundos. SSL gratis, copias diarias y seguridad reforzada.",
    icon: "fa-brands fa-wordpress-simple",
    tag: "WordPress",
  },
];

export const CONTACT_EMAIL = "sales@galaxyweb.dev";
