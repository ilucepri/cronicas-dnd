import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// URLs limpias (BrowserRouter, sin #): los assets se referencian desde la base
// para que funcionen también en rutas anidadas como /oro/sesion/90.
// base configurable por entorno:
//  - local / hosting en dominio raíz (Netlify, Cloudflare): '/'
//  - GitHub Pages de proyecto: '/cronicas-dnd/' (via VITE_BASE en el workflow)
// Requiere fallback SPA (public/_redirects para Netlify/Cloudflare; 404.html
// que genera el workflow para GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
