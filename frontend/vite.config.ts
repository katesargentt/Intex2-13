import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com; " +
        "img-src 'self' data:; " +
        "frame-ancestors 'none'; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "connect-src 'self' http://localhost:5002 https://localhost:5000 https://accounts.google.com https://oauth2.googleapis.com; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com;", // ✅ Allow OAuth login popups
    },
  },
});
