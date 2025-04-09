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
        "img-src 'self' data: https://cinenicheimages.blob.core.windows.net; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "connect-src 'self' http://localhost:5000 https://localhost:5000 http://localhost:5002 https://accounts.google.com https://oauth2.googleapis.com; " + // ✅ FIXED THIS LINE
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "object-src 'none';",
    },
  },
});
