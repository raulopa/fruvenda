/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{js,jsx}"
  ],
  darkMode: ['selector'],
  theme: {
    extend: {
      fontFamily: {
        'outfit' : ['outfit', 'Segoe-UI', 'Arial'],
        'outfit-semibold' : ['outfit-semibold', 'Arial Black'],
        'outfit-bold' : ['outfit-bold', 'Arial Black']
      },
      'animation': {
        'gradient-x':'gradient-x 2s ease infinite',
        'gradient-y':'gradient-y 5s ease infinite',
        'gradient-xy':'gradient-xy 5s ease infinite',
        'fadeOut' : 'fadeOut 4s linear'
    },
    'keyframes': {
        'gradient-y': {
            '0%, 100%': {
                'background-size':'400% 400%',
                'background-position': 'center top'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'center center'
            }
        },
        'gradient-x': {
            '0%, 100%': {
                'background-size':'300% 300%',
                'background-position': 'left center'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'right center'
            }
        },
        'gradient-xy': {
            '0%, 100%': {
                'background-size':'400% 400%',
                'background-position': 'left center'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'right center'
            }
        },
        'fadeOut' : {
            '0%' : {
                'display': 'block',
                'opacity' : '0.25',
                'transform:' : 'translateY(0)'
            },
            '20%' : {
                'opacity' : '1',
            },
            '100%': {
                'opacity' : '0',
                'transform:' : 'translateY(15px)'
            }
        }
    },
    screens: {
        'smh': {'raw': '(max-height: 639px)'},
        'mdh': {'raw': '(min-height: 640px) and (max-height: 767px)'},
        'lgh': {'raw': '(min-height: 768px) and (max-height: 1023px)'},
        'xlh': {'raw': '(min-height: 1024px) and (max-height: 1279px)'},
        '2xlh': {'raw': '(min-height: 1280px) and (max-height: 1535px)'},
        '3xlh': {'raw': '(min-height: 1536px)'}
      }
    },
  },
  plugins: [],
}

