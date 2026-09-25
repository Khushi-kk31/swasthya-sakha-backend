/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['Inter','ui-sans-serif','system-ui','sans-serif'] },
    boxShadow: { soft: '0 10px 30px rgba(15, 23, 42, .06)' },
    colors: { ink:'#102A43', muted:'#627D98', brand:'#0F766E', brandLight:'#E6FFFA', navy:'#12355B' }
  } },
  plugins: []
}
