/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#fbf9f4',
        brand: {
          50: '#f7f3ff',
          100: '#ece4ff',
          500: '#6d28d9',
          700: '#4310aa',
          900: '#2b007a',
        },
        lime: { 400: '#c8ff19', 500: '#b5f000' },
        text: { primary: '#160a3a', secondary: '#665e75' },
      },
      borderRadius: {
        card: '24px',
        btn: '9999px',
        input: '12px',
      },
    },
  },
  plugins: [],
}
