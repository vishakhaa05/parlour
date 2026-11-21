/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          bg: '#FFF8F6',
          blush: '#F7E5E9',
          rose: '#E8A0B1',
          primary: '#C65D7B',
          primaryHover: '#B24B68',
          text: '#29232A',
          muted: '#6E6270',
          border: '#F2DCE2',
          card: '#FFFFFF',
          dark: '#1E1920',
        },
        pinky: '#C65D7B',
        softGray: '#FFF8F6',
        darkGray: '#29232A',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'salon': '0 10px 30px -10px rgba(198, 93, 123, 0.12)',
        'salon-hover': '0 20px 35px -10px rgba(198, 93, 123, 0.2)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
};
