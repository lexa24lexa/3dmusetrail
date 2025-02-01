import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    open: true,
    host: true
  },
  build: {
    outDir: "dist"
  }
});
