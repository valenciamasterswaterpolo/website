import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Mediterranean Sunset palette
        // Brand Primaries
        'valencia-purple': '#73326D',
        'valencia-purple-hover': '#AE4371',
        'ocean-blue': '#196CA0',

        // Accents (use sparingly)
        'neon-coral': '#FE6E81',
        'electric-cyan': '#70BECF',
        'sunset-peach': '#FDC4A7',

        // Neutrals / Surfaces
        'cream': '#FCFBD9',
        'sand': '#FBD7AF',
        'sea-mist': '#CEECE2',
        'soft-slate': '#83B2BB',
        'aqua-wash': '#9ED2D5',
        'peach-wash': '#FDC4A7',

        // Text
        'deep-navy': '#0E2433',

        // Dark mode surfaces
        'dark-bg': '#0E2433',
        'dark-surface': '#1a3444',
        'dark-card': '#243d4d',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'body': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(180deg, #86D1D9 0%, #9ED2D5 35%, #FDC4A7 75%, #FDCEAF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #73326D, #196CA0)',
        'gradient-sunset': 'linear-gradient(90deg, #FE6E81, #FDC4A7)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(14, 36, 51, 0.2), rgba(14, 36, 51, 0.6))',
        'grid-pattern': 'linear-gradient(rgba(131, 178, 187, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(131, 178, 187, 0.08) 1px, transparent 1px)'
      },
      backgroundSize: {
        'grid': '50px 50px'
      },
      boxShadow: {
        'neon-coral': '0 0 10px rgba(254, 110, 129, 0.3), 0 0 20px rgba(254, 110, 129, 0.15)',
        'neon-cyan': '0 0 10px rgba(112, 190, 207, 0.3), 0 0 20px rgba(112, 190, 207, 0.15)',
        'neon-purple': '0 0 10px rgba(115, 50, 109, 0.3), 0 0 20px rgba(115, 50, 109, 0.15)',
        'neon-subtle': '0 0 8px rgba(112, 190, 207, 0.25)',
        'card': '0 4px 20px rgba(14, 36, 51, 0.1)',
        'card-hover': '0 8px 30px rgba(14, 36, 51, 0.15)',
        'btn-primary': '0 4px 15px rgba(115, 50, 109, 0.3)',
        'btn-glow': '0 0 18px rgba(112, 190, 207, 0.25), 0 0 22px rgba(254, 110, 129, 0.18)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        // Premium reveal animations
        'reveal-up': 'revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-down': 'revealDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-left': 'revealLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-right': 'revealRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-scale': 'revealScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-fade': 'revealFade 0.6s ease-out forwards',
        'blur-in': 'blurIn 0.8s ease-out forwards',
        'counter': 'counter 2s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(112, 190, 207, 0.3)' },
          '100%': { boxShadow: '0 0 15px rgba(112, 190, 207, 0.4), 0 0 30px rgba(112, 190, 207, 0.2)' }
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' }
        },
        // Premium reveal keyframes
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        revealDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        revealLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        revealRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        revealScale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        revealFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' }
        },
        counter: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)'
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms'
      }
    }
  },
  plugins: []
} satisfies Config
