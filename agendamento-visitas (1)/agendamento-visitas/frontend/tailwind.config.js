/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cor principal da identidade visual.
        // brand-600 = #0F2568 é a cor pedida; os demais tons são
        // variações para hover, focus ring e backgrounds claros.
        brand: {
          50: '#EEF1FA',
          100: '#D5DCEF',
          200: '#ABB9DE',
          300: '#7E91CB',
          400: '#4F66B0',
          500: '#1F3A8A',
          600: '#0F2568', // cor principal
          700: '#0B1C4F',
          800: '#081538',
          900: '#040B20',
        },
      },
    },
  },
  plugins: [],
};
