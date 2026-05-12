module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Medical professional palette
        primary: '#0284c7',      // Sky blue - professional healthcare
        secondary: '#059669',    // Green - health & wellness
        danger: '#dc2626',       // Red - alerts
        warning: '#f59e0b',      // Amber - warnings
        medical: {
          light: '#f0f9ff',
          lighter: '#e0f2fe',
          main: '#0284c7',
          dark: '#075985',
        },
        clinical: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        section: '3rem',
        card: '1.5rem',
      },
      borderRadius: {
        medical: '0.75rem',
      },
      boxShadow: {
        medical: '0 4px 20px rgba(15, 23, 42, 0.08)',
        'medical-lg': '0 10px 40px rgba(15, 23, 42, 0.12)',
        'medical-hover': '0 8px 32px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
};
