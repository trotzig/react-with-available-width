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
      this._instanceId = `waw-${Math.random().toString(36).substring(7)}`;
      this.state = {
        dirty: true,
        dirtyCount: 0,
        availableWidth: undefined,
      };
      this._handleDivRef = this._handleDivRef.bind(this);
    }

    componentDidMount() {
      this._unobserve = observer(this._containerElement, () => {
        this.setState({
          dirty: true,
          dirtyCount: this.state.dirtyCount + 1,
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

    _handleDivRef(domElement) {
      if (!domElement) {
        return;
      }
      this._containerElement = domElement.parentNode;

      this.setState({
        availableWidth: domElement.offsetWidth,
        dirty: false,
      });
    }

    render() {
      const { availableWidth, dirty, dirtyCount } = this.state;

      return (
        <React.Fragment>
          {dirty &&
            <style
              type="text/css"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `#${this._instanceId} + * { display: none !important; }`,
              }}
            />
          }
          <div
            id={this._instanceId}
            key={dirtyCount}
            ref={this._handleDivRef}
            style={{
              display: dirty ? 'block' : 'none',
              flexGrow: '1',
              width: '100%',
            }}
          />
          {typeof availableWidth !== 'undefined' && (
            <Component
              availableWidth={availableWidth}
              {...this.props}
            />
          )}
        </React.Fragment>
      );
    }
  };
}
