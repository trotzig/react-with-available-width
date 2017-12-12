import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import withAvailableWidth from '../withAvailableWidth';

it('throws an error if observer does not return a method', () => {
  function render() {
    const Component = withAvailableWidth(() => <div />, () => true);
    return ReactTestUtils.renderIntoDocument(<Component />);
  }
  expect(render).toThrowError(/The observer did not provide a way to unobserve/);
});
