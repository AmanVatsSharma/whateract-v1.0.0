/**
 * Tailwind CSS Configuration for WhatsApp Marketing Platform
 * 
 * Features:
 * - Modern color palette with gradients
 * - Custom animations and transitions
 * - Responsive breakpoints
 * - Glassmorphism and modern effects
 * - Extended utilities for better UX
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // Enable dark mode with class strategy
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    // Custom breakpoints for better mobile responsiveness
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    
    extend: {
      // Custom background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-warning': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-dark': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      
      // Consistent border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      
      // Extended color palette with semantic naming
      colors: {
        // Base colors from CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Card components
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        
        // Popovers and dropdowns
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        
        // Primary brand colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        
        // Muted backgrounds
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        
        // Accent colors
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        
        // Destructive/error states
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        
        // Border and input colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Chart colors
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        
        // Additional utility colors
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
      },
      
      // Custom keyframe animations
      keyframes: {
        // Accordion animations
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' }
        },
        
        // Slide animations
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        
        // Shimmer animation for loading states
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        
        // Pulse animation
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        
        // Bounce animation
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
      
      // Animation classes
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce-slow 3s infinite',
      },
      
      // Custom box shadows for depth
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'primary': '0 10px 40px rgba(102, 126, 234, 0.5)',
        'secondary': '0 10px 40px rgba(240, 147, 251, 0.5)',
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom z-index values
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Custom blur values
      blur: {
        xs: '2px',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    }
  },
  
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
