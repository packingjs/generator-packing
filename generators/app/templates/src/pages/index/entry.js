<% if (props.react) {%>import React from 'react';
import ReactDOM from 'react-dom';
<%if (props.typescript) {%>import Header from './Header';<% } %><% } %>
import '../../common/now';
import '../../common/style';

console.log('🐶🐶🐶');<% if (props.react) {%>
ReactDOM.render(
  <div>
    <h1>Hello, world!</h1><%if (props.typescript) {%>
    <Header /><% } %>
  </div>,
  document.getElementById('root')
);<% } %>
