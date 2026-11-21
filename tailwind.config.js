/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#3d4268', // dusk indigo field
        'ground-deep': '#2f3456',
        night: '#1c2035', // darkest mountain plane / ink on cream
        cream: '#eeebe2', // floating bars and mats
        sand: '#cfccbb',
        tan: '#a39d7b',
        peri: '#95a0da',
        'peri-deep': '#4d5584',
        mist: '#c9cce6', // secondary text on ground (tinted from periwinkle)
        paper: '#e4e1d4', // reading text on the ground
        action: '#38406a',
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
