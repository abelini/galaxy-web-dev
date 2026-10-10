// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://galaxy-web.dev",
	vite: {
		plugins: [tailwindcss()],
	},
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
