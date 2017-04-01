import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ResizeObserverPolyfill from 'resize-observer-polyfill';

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
  },
  { ResizeObserver: ResizeObserverPolyfill },
);

function Comparison() {
  return (
    <div className="example comparison">
      [comparison]
    </div>
  );
}

class TestApp extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        delayDone: true,
      });
    }, 100);
  }

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
        <div className="relative-container container">
          <div className="absolute-child container">
            <WrappedComponent/>
            <Comparison/>
          </div>
        </div>
        <hr/>

        <h2>In a float-based layout</h2>
        <p>
        </p>
        <div className="float-layout container">
          <div className="float-sidebar container">
            <WrappedComponent/>
            <Comparison/>
          </div>
          <div className="float-main container">
            <WrappedComponent/>
            <Comparison/>
          </div>
        </div>
        <hr/>


        <h2>In a balanced flexbox</h2>
        <p>
          This element should take up as much space as its siblings.
        </p>
        <div className="flexbox container">
          <Comparison/>
          <Comparison/>
          <WrappedComponent/>
        </div>
        <hr/>

        <h2>In an unbalanced flexbox</h2>
        <p>
          This element should take up as much space as possible.
        </p>
        <div className="flexbox container">
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
        <table
          className="container"
          style={{ width: '100%' }}
        >
          <thead>
            <tr>
              <th>One</th>
              <th>Two</th>
              <th>Three</th>
            </tr>
          </thead>
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
        <table
          className="container"
          style={{ width: '100%', tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              <th>One</th>
              <th>Two</th>
              <th>Three</th>
            </tr>
          </thead>
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

        <h2>When styling is applied asynchronous</h2>
        <p>
          Some setups will render the DOM once without any css, then apply
          styling. This isn't too common, but we need to handle it gracefully.
        </p>
        <div
          className="container"
          style={{ width: this.state.delayDone ? 200 : '100%' }}
        >
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
