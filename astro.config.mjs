// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://galaxyweb.dev",
	// Astro 7 default es 'jsx'; se fija explícito para documentar la
	// decisión de adoptar el nuevo manejo de whitespace.
	compressHTML: "jsx",
	vite: {
		plugins: [tailwindcss()],
	},
	adapter: cloudflare(),
});
