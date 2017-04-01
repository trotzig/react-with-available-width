import { addEventListener, removeEventListener } from 'consolidated-events';
import React, { PureComponent } from 'react';

/**
 * HoC that injects a `availableWidth` prop to the component, equal to the
 * available width in the current context
 *
 * @param {Object} Component
 * @return {Object} a wrapped Component
 */
export default function withAvailableWidth(Component) {
  return class extends PureComponent {
    constructor() {
      super();
      const initialState = {
        availableWidth: undefined,
      };
      this.state = initialState;
      this._handleDivRef = this._handleDivRef.bind(this);

      this._resizeHandle = addEventListener(
        window,
        'resize',
        () => this.setState(initialState),
        { passive: true },
      );
    }

    componentWillUnmount() {
      removeEventListener(this._resizeHandle);
    }

    _handleDivRef(domElement) {
      if (!domElement) {
        return;
      }
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
