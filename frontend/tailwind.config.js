/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Añadimos el plugin aquí
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
