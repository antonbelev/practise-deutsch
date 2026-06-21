import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "/" in CI (GitHub Pages at /practise-deutsch/), "./" locally.
export default defineConfig({
  base: process.env.CI ? "/practise-deutsch/" : "./",
  plugins: [react()],
});
