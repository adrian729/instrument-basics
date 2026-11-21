import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "./", // (served from a sub-path on GitHub Pages)
  build: { target: "es2022", assetsInlineLimit: 0 },
  server: { port: 5174, strictPort: true },
  preview: { port: 8899, strictPort: true },
});
