<% if (props.react) {%>import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';<% } %>
import '../../common/now';
import '../../common/style';

console.log('🐶🐶🐶');<% if (props.react) {%>
ReactDOM.render(
  <div>
    <h1>Hello, world!</h1>
    <Header />
  </div>,
  document.getElementById('root')
);<% } %>
