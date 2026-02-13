/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pitch: {
          bg: '#0f172a',
          dark: '#0a0f1a',
          grass: '#1a3d2e',
          line: '#2dd4bf',
          neon: '#00ff9d',
          blue: '#00d4ff',
          gold: '#ffd700',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        condensed: ['Roboto Condensed', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 255, 157, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        card: '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'metal': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        'card-gold': 'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #8b6914 100%)',
        'card-silver': 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #808080 100%)',
        'card-bronze': 'linear-gradient(135deg, #cd7f32 0%, #8b4513 50%, #654321 100%)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 157, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.8)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 157, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
