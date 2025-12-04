/**
 * PostCSS Configuration for Tailwind CSS v4
 * 
 * Tailwind v4 simplifies PostCSS configuration
 * Only tailwindcss plugin is needed - it handles everything internally
 * 
 * @see https://tailwindcss.com/docs/v4-beta
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
