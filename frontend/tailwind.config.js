import typography from '@tailwindcss/typography'

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};