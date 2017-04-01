import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

class TestApp extends PureComponent {
  render() {
    return <div>hello world</div>;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDOM.render(<TestApp/>, root);
});
