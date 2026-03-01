// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontshare(),
        name: "General Sans",
        cssVariable: "--font-general-sans",
        weights: [400, 500, 600, 700],
        styles: ["normal", "italic"],
        fallbacks: ["sans-serif"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Playfair Display",
        cssVariable: "--font-playfair",
        weights: [400, 500, 600, 700],
        styles: ["normal", "italic"],
        fallbacks: ["serif"],
      },
    ],
  },
});
