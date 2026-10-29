/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        'gamer-red': {
          400: '#ff4d6d',
          500: '#ff1e42',
          600: '#e50926',
          700: '#b8051b',
        },
        'gamer-dark': {
          950: '#07080b',
          900: '#0c0e14',
          850: '#12151f',
          800: '#181d2a',
          700: '#232a3d',
          600: '#353e54',
        }
      },
      boxShadow: {
        'glow-red': '0 0 25px -4px rgba(255, 30, 66, 0.45)',
        'glow-red-sm': '0 0 15px -3px rgba(255, 30, 66, 0.35)',
        'glow-red-lg': '0 0 45px -5px rgba(255, 30, 66, 0.6)',
        'gamer-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 30, 66, 0.08) 1px, transparent 1px)",
        'radial-gradient': "radial-gradient(circle at 50% 0%, rgba(255, 30, 66, 0.15) 0%, transparent 65%)",
      }
    },
  },
  plugins: [],
}
