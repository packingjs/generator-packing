module.exports = {
  parser: false,
  plugins: {<% if (props.css === 'cssnext') { %>
    'postcss-cssnext': {}<% } %>
  }
};
