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
        // Or chaud — couleur principale alignée sur le logo
        primary: {
          50:  '#FAF8F5',
          100: '#F2EBE0',
          200: '#E3D4BE',
          300: '#E5C97A',
          400: '#D4A853',
          500: '#C9A14A',
          600: '#B08030',
          700: '#8B6225',
          800: '#1C1814',
          900: '#0F0C0A',
        },
        // Accent or — identique pour rétrocompatibilité des classes accent-*
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
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:  '0 2px 12px rgba(0,0,0,0.06)',
        hover: '0 6px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
