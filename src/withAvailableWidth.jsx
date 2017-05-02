/* eslint-disable comma-dangle, no-underscore-dangle */
import React, { PureComponent } from 'react';

function defaultObserver(_domElement, notify) {
  window.addEventListener('resize', notify, { passive: true });
  return () => {
    window.removeEventListener('resize', notify, { passive: true });
  };
}

/**
 * HoC that injects a `availableWidth` prop to the component, equal to the
 * available width in the current context
 *
 * @param {Object} Component
 * @return {Object} a wrapped Component
 */
export default function withAvailableWidth(
  Component,
  observer = defaultObserver
) {
  return class extends PureComponent {
    constructor() {
      super();
      this.state = {
        availableWidth: undefined,
      };
      this._handleDivRef = this._handleDivRef.bind(this);
    }

    componentDidMount() {
      this._unobserve = observer(this._containerElement, () => {
        if (this._containerElement.offsetWidth ===
          this._lastKnownContainerWidth) {
          return; // Nothing changed
        }
        this.setState({
          availableWidth: this._getAvailableWidth(),
        });
      });
      if (typeof this._unobserve !== 'function') {
        throw new Error(
          'The observer did not provide a way to unobserve. ' +
          'This will likely lead to memory leaks.'
        );
      }
    }

    componentWillUnmount() {
      this._unobserve();
    }

    _getAvailableWidth() {
      const domElement = this._containerElement.children[this._elementIndex];
      return domElement.offsetWidth;
    }

    _handleDivRef(domElement) {
      if (!domElement) {
        return;
      }
      this._containerElement = domElement.parentNode;
      this._lastKnownContainerWidth = this._containerElement.offsetWidth;

      // Find the child index amongst its siblings. This is so that we can reuse
      // this index when having to re-measure.
      this._elementIndex = 0;
      let child = domElement;

      while ((child = child.previousSibling) !== null) { // eslint-disable-line
        this._elementIndex += 1;
      }

      this.setState({
        availableWidth: this._getAvailableWidth(),
      });
    }

    render() {
      const { availableWidth } = this.state;

      if (typeof availableWidth === 'undefined') {
        // This div will live in the document for a brief moment, just long
        // enough for it to mount. We then use it to calculate its width, and
        // replace it immediately with the underlying component.
        return (
          <div
            style={{ flexGrow: '1', width: '100%' }}
            ref={this._handleDivRef}
          />
        );
      }

      return (
        <Component
          availableWidth={availableWidth}
          {...this.props}
        />
      );
    }
  };
}
