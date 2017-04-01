import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import withAvailableWidth from './withAvailableWidth';

const WrappedComponent = withAvailableWidth(
  function({ availableWidth }) {
    return (
      <div
        className="example"
        style={{
          width: availableWidth,
        }}
      >
        w={availableWidth}
      </div>
    );
  }
);

function Comparison() {
  return (
    <div className="example comparison">
      [comparison]
    </div>
  );
}

class TestApp extends PureComponent {
  render() {
    return (
      <div>
        <h1>Test page</h1>
        <p>
          This page lists components wrapped in
          {' '}
          <code>withAvailableWidth</code>
          {' '}
          in a number of contexts. Each example has a comparison rendered
          in light blue. This element is not using the HOC.
        </p>
        <hr />

        <h2>Full width</h2>
        <p>
          This element should span the entire width of the document.
          Try resizing the window to make sure it updates.
        </p>
        <WrappedComponent/>
        <Comparison/>
        <hr/>

        <h2>In a flexbox</h2>
        <p>
          This element should take up as much space as its siblings.
        </p>
        <div className="flexbox">
          <Comparison/>
          <Comparison/>
          <WrappedComponent/>
        </div>
        <hr/>
      </div>
    );
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDOM.render(<TestApp />, root);
});
