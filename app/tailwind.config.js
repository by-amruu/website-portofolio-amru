/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace']
      },
      colors: {
        brutal: {
          bg: '#F4F0EA',       // Off-white retro brutalist canvas
          surface: '#FFFFFF',
          dark: '#121212',     // Stark contrast black
          yellow: '#FFE600',   // Neo-brutalist alert yellow
          lime: '#A3E635',     // Fresh vibrant green
          cyan: '#22D3EE',
          pink: '#F472B6'
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #121212',
        'brutal': '4px 4px 0px 0px #121212',
        'brutal-lg': '6px 6px 0px 0px #121212',
        'brutal-xl': '8px 8px 0px 0px #121212'
      },
      borderWidth: {
        '3': '3px'
      }
    }
  },
  plugins: []
}

