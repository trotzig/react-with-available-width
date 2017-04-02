import React from 'react';
import ReactAddonsTestUtils from 'react-addons-test-utils';

import withAvailableWidth from '../withAvailableWidth';

it('throws an error if observer does not return a method', () => {
  function render() {
    const Component = withAvailableWidth(() => <div/>, () => true);
    return ReactAddonsTestUtils.renderIntoDocument(<Component/>);
  }
  expect(render).toThrowError(/The observer did not provide a way to unobserve/);
});
