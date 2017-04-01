import { addEventListener, removeEventListener } from 'consolidated-events';
import React, { PureComponent } from 'react';

const INITIAL_STATE = {
  availableWidth: undefined,
}
/**
 * HoC that injects a `availableWidth` prop to the component, equal to the
 * available width in the current context
 *
 * @param {Object} Component
 * @return {Object} a wrapped Component
 */
export default function withAvailableWidth(Component, { ResizeObserver }) {
  return class extends PureComponent {
    constructor() {
      super();
      this.state = INITIAL_STATE;
      this._handleDivRef = this._handleDivRef.bind(this);

      this._resizeHandle = addEventListener(
        window,
        'resize',
        () => this.setState(INITIAL_STATE),
        { passive: true },
      );
    }

    componentWillUnmount() {
      removeEventListener(this._resizeHandle);
      if (this._unobserveResize) {
        this._unobserveResize();
      }
    }

    _handleDivRef(domElement) {
      if (!domElement) {
        return;
      }
      this.setState({
        availableWidth: domElement.offsetWidth,
      });
      if (!this._unobserveResize && ResizeObserver) {
        const ro = new ResizeObserver(() => this.setState(INITIAL_STATE));
        this._unobserveResize = () => {
          ro.unobserve(domElement.parentNode);
        };
       ro.observe(domElement.parentNode);
      }
    }

    render() {
      if (typeof this.state.availableWidth === 'undefined') {
        // This div will live in the document for a brief moment, just long
        // enough for it to mount. We then use it to calculate its width, and
        // replace it immediately with the underlying component.
        return (
          <div
            style={{ flexGrow: '1', width: '100%', }}
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
