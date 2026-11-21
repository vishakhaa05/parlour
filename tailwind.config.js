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
          bg: '#FFF9FA',
          blush: '#FFF0F5',
          rose: '#F9A8D4',
          primary: '#FA4D89',
          primaryHover: '#E11D74',
          text: '#1F2937',
          muted: '#4B5563',
          border: '#FCE7F0',
          card: '#FFFFFF',
          dark: '#111827',
          slate: '#4B5563',
        },
        pinky: '#FA4D89',
        softGray: '#FFF9FA',
        darkGray: '#1F2937',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'salon': '0 10px 30px -10px rgba(250, 77, 137, 0.18)',
        'salon-hover': '0 20px 35px -10px rgba(250, 77, 137, 0.28)',
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
