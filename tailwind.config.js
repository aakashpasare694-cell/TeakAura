/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teak: {
          50: '#FAF6F0',
          100: '#F4ECE1',
          200: '#E8D7C2',
          300: '#D5BC9C',
          400: '#B8966E',
          500: '#946E44',
          600: '#75522F',
          700: '#5A3D22',
          800: '#422C19',
          900: '#2C1B10',
          950: '#1A0E08',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4EDE0',
          300: '#EBE0CF',
          400: '#DFCDB8',
        },
        gold: {
          300: '#E4CF8E',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#B0883E',
          700: '#8C6727',
        },
        charcoal: {
          800: '#262422',
          900: '#1C1A18',
          950: '#121110',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(44, 27, 16, 0.08)',
        'warm-md': '0 8px 24px -4px rgba(44, 27, 16, 0.12)',
        'warm-lg': '0 16px 36px -6px rgba(44, 27, 16, 0.16)',
        'warm-xl': '0 24px 50px -10px rgba(44, 27, 16, 0.22)',
      },
      backgroundImage: {
        'wood-gradient': 'linear-gradient(to bottom, rgba(26, 14, 8, 0.4), rgba(26, 14, 8, 0.85))',
        'subtle-wood': 'linear-gradient(135deg, #FAF6F0 0%, #F4ECE1 100%)',
      }
    },
  },
  plugins: [],
};
