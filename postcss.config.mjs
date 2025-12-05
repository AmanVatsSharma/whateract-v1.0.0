/**
 * PostCSS Configuration for Tailwind CSS v4
 * 
 * Tailwind v4 requires @tailwindcss/postcss plugin instead of tailwindcss directly.
 * The theme is defined in CSS using the @theme directive in globals.css.
 * 
 * @see https://tailwindcss.com/docs/v4-beta
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
