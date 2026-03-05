import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#ecefe5',
          200: '#d4dbc7',
          300: '#bcc7a8',
          400: '#a3b38a',
          500: '#8a9f6d',
          600: '#6e8157'
        },
        gold: {
          100: '#f3ead4',
          300: '#d8c48a'
        },
        warm: {
          700: '#5b5249',
          600: '#6f655b'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'serif']
      },
      boxShadow: {
        soft: '0 12px 30px rgba(90, 84, 74, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
