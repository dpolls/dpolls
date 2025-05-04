/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './.storybook/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#323232',
        'bg-primary': '#F5F5F5',
        'bg-secondary': '#D9D9D9',
        'bg-tertiary': '#F8F8F8',
        white: '#FFF',
        'text-primary': '#41484F',
        'text-secondary': '#97979B',
        'text-tertiary': '#FF7997',
        black: '#000000',
        'border-primary': '#D4D4D4',
        'border-secondary': '#838383',
      },
      fontSize: {
        xxs: '0.5rem' /* 8px */,
        xs: '0.625rem' /* 10px */,
        sm: '0.75rem' /* 12px */,
        md: '0.875rem' /* 14px */,
      },
    },
  },
  plugins: [],
}
