import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import withAvailableWidth from './withAvailableWidth';

const WrappedComponent = withAvailableWidth(
  function({ availableWidth }) {
    return (
      <div style={{ width: '100%' }}>
        <div
          className="example"
          style={{
            width: availableWidth,
          }}
        >
          w={availableWidth}
        </div>
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

        <h2>In an absolutely positioned element</h2>
        <p>
          The element is absolutely positioned at the bottom right edge.
          Try resizing to see how max-width comes into play.
        </p>
        <div className="relative-container">
          <div className="absolute-child">
            <WrappedComponent/>
            <Comparison/>
          </div>
        </div>
        <hr/>

        <h2>In a float-based layout</h2>
        <p>
        </p>
        <div className="float-layout">
          <div className="float-sidebar">
            <WrappedComponent/>
            <Comparison/>
          </div>
          <div className="float-main">
            <WrappedComponent/>
            <Comparison/>
          </div>
        </div>
        <hr/>


        <h2>In a balanced flexbox</h2>
        <p>
          This element should take up as much space as its siblings.
        </p>
        <div className="flexbox">
          <Comparison/>
          <Comparison/>
          <WrappedComponent/>
        </div>
        <hr/>

        <h2>In an unbalanced flexbox</h2>
        <p>
          This element should take up as much space as possible.
        </p>
        <div className="flexbox">
          <div style={{ width: 150, flexShrink: '0' }}>
            <Comparison/>
          </div>
          <div style={{ width: 100, flexShrink: '0' }}>
            <Comparison/>
          </div>
          <WrappedComponent/>
        </div>
        <hr/>

        <h2>In a table</h2>
        <p>
          Browsers ignore the width of elements, and use content to size
          the different columns. The available width here is what an empty
          div would be assigned in the same context.
        </p>
        <table style={{ width: '100%' }}>
          <tr>
            <th>One</th>
            <th>Two</th>
            <th>Three</th>
          </tr>
          <tbody>
            <tr>
              <td><Comparison/></td>
              <td><Comparison/></td>
              <td><WrappedComponent/></td>
            </tr>
            <tr>
              <td><Comparison/></td>
              <td><Comparison/></td>
              <td><WrappedComponent/></td>
            </tr>
          </tbody>
        </table>
        <hr/>

        <h2>In a table with fixed layout</h2>
        <p>
        </p>
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <tr>
            <th>One</th>
            <th>Two</th>
            <th>Three</th>
          </tr>
          <tbody>
            <tr>
              <td><Comparison/></td>
              <td><Comparison/></td>
              <td><WrappedComponent/></td>
            </tr>
            <tr>
              <td><Comparison/></td>
              <td><Comparison/></td>
              <td><WrappedComponent/></td>
            </tr>
          </tbody>
        </table>
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
