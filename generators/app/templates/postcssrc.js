module.exports = {
  parser: false,
  plugins: {<% if (props.css === 'postcss-preset-env') { %>
    'postcss-preset-env': {
      stage: 0,
      browsers: [
        '> 1%',
        'Android >= 4.4',
        'IOS >= 7',
        'ie >= 9'
      ]
    }<% } %>
  }
};
