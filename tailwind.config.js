module.exports = {
  purge: ['./*.njk', './*.html', './_includes/*.njk'],
  theme: {
    extend: {
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' }
      },
      colors: {
        white: '#F9F9F9'
      }
    }
  }
};
