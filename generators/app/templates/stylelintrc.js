module.exports = {<%if (props.css === 'scss') {%>
  extends: 'stylelint-config-recommended',
  plugins: ['stylelint-scss']<% } else { %>
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-empty-line-before': null,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global']
    }],
    'font-family-no-missing-generic-family-keyword': null
  }<% } %>
};
