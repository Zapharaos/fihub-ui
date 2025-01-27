/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary-color)',
        'muted': 'var(--p-text-muted-color)',
      }
    },
  },
  plugins: [
    require('tailwindcss-primeui'),
    require('tailwind-scrollbar')({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
  ]
}

