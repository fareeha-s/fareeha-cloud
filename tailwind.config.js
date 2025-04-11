/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'ios-spring': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'bounce-in': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '50': '50ms',
        '75': '75ms',
      },
      animation: {
        'ios-appear': 'ios-appear 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards',
        'ios-disappear': 'ios-disappear 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards',
      },
      keyframes: {
        'ios-appear': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'ios-disappear': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.96)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};