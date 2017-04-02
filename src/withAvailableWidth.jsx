/* eslint-disable comma-dangle, no-underscore-dangle */
import React, { PureComponent } from 'react';

const INITIAL_STATE = {
  availableWidth: undefined,
};

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
      this.state = INITIAL_STATE;
      this._handleDivRef = this._handleDivRef.bind(this);
    }

    componentDidMount() {
      this._unobserve = observer(this._containerElement, () => {
        if (this._containerElement.offsetWidth ===
          this._lastKnownContainerWidth) {
          return; // Nothing changed
        }
        this.setState(INITIAL_STATE);
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

    _handleDivRef(domElement) {
      if (!domElement) {
        return;
      }
      this._containerElement = domElement.parentNode;
      this._lastKnownContainerWidth = this._containerElement.offsetWidth;

      this.setState({
        availableWidth: domElement.offsetWidth,
      });
    }

    render() {
      if (typeof this.state.availableWidth === 'undefined') {
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
          availableWidth={this.state.availableWidth}
          {...this.props}
        />
      );
    }
  };
}
