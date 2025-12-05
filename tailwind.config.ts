/**
 * Tailwind CSS v4 Configuration for WhatsApp Marketing Platform
 * 
 * Tailwind v4 uses CSS-based configuration via @theme directive in globals.css
 * This file is kept for compatibility and TypeScript support
 * 
 * Main configuration is now in: src/app/globals.css
 * 
 * Features:
 * - Modern light theme with professional aesthetics
 * - CSS-based theming (Tailwind v4 approach)
 * - Custom animations and transitions
 * - Responsive breakpoints
 * - Modern effects and utilities
 * 
 * @see https://tailwindcss.com/docs/v4-beta
 */

import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind v4 uses CSS-based dark mode via @media (prefers-color-scheme)
  // or class-based via next-themes
  darkMode: "class",
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Most configuration is now done in globals.css using @theme directive
  // This provides better performance and simpler configuration
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
