/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Or chaud — accent principal
        primary: {
          50:  '#FAF8F5',
          100: '#F2EBE0',
          200: '#E3D4BE',
          300: '#E5C97A',
          400: '#D4A853',
          500: '#C9A14A',
          600: '#B08030',
          700: '#8B6225',
          800: '#143D2C',  // vert forêt — headings & dark bg
          900: '#0A2618',  // vert forêt profond — hero & footer
        },
        // Vert forêt — couleur identitaire tropicale
        forest: {
          50:  '#F0F7F4',
          100: '#DCEDE5',
          200: '#B5D9C7',
          300: '#7CBFA0',
          400: '#47A07B',
          500: '#2E8060',
          600: '#206649',
          700: '#1A5039',
          800: '#143D2C',
          900: '#0A2618',
          950: '#061710',
        },
        // Terre cuite — badges promo & urgence
        terra: {
          400: '#ED6E3E',
          500: '#C4622D',
          600: '#A34E24',
        },
        // Crème naturelle — sections alternées
        cream: {
          50:  '#FDFCF9',
          100: '#F9F5EE',
          200: '#F2EBD9',
          300: '#E8DBBE',
          400: '#D9C79A',
        },
        accent: {
          50:  '#FAF8F5',
          100: '#F2EBE0',
          400: '#D4A853',
          500: '#C9A14A',
          600: '#A07B30',
          700: '#7A5D25',
        },
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script:  ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:   '0 2px 14px rgba(0,0,0,0.06)',
        hover:  '0 10px 38px rgba(0,0,0,0.14)',
        gold:   '0 4px 22px rgba(201,161,74,0.38)',
        forest: '0 6px 28px rgba(10,38,24,0.35)',
        'inner-sm': 'inset 0 1px 4px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
