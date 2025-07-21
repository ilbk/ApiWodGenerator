import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Importa tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Añade tailwind como plugin
  ],
})
