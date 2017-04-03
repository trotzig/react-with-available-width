# Truly responsive React components

Using media queries to style components differently depending on the screen
width is great if you're only working in a single column. But let's say you
have a multi-column layout where you want responsive components based on the
available width in the current container? Or you want a component to be able to
render in a lot of different contexts, with unknown widths? With regular
media-queries, you can't do that.

`withAvailableWidth` is a
[HOC](https://facebook.github.io/react/docs/higher-order-components.html) that
will inject a `availableWidth` prop to the wrapped component. It will allow you
to write components that render differently based on the currently available
width. Here's an example -- a `ToggleButton` that collapses to a checkbox in
narrow contexts.

```jsx
function ToggleButton({
  downLabel,
  upLabel,
  isDown,
  availableWidth,
 }) {
  if (availableWidth < 50) {
    return <input type="checkbox" value={isDown} />;
  }
  return (
    <div>
      <button disabled={isDown}>{downLabel}</button>
      <button disabled={!isDown}>{upLabel}</button>
    </div>
  );
}
export default withAvailableWidth(ToggleButton);
```

What's great here is that we can reuse this component in many contexts. If it's
rendered in a table for instance, it's likely to render as a checkbox. But if
it's a standalone component in a wide container, it's probably going to show
the regular, wider version.

## Similar solutions

[react-measure](https://github.com/souporserious/react-measure) is a great
general tool for computing dimensions. But it suffers from having to render
components twice in order to get the width and react to it.

[react-measure-it](https://github.com/plusacht/react-measure-it) is also a HOC
with roughly the same idea as `withAvailableWidth`. But it gives you the
dimensions of the container, not the available width inside the container.

## How does it work?

To figure out the available width in the current context, we drop an empty
`<div>` in the DOM for a brief moment. As soon as the div is mounted, we
measure its width, then re-render with the calculated width injected as
`availableWidth` to the component. The component can then render things
conditionally based on this number.

## Reacting to size changes

By default, `withAvailableWidth` will only recalculate the width when the
window is resized. If you need more fine-grained control, you can provide your
own observer by passing in a function as the second argument to the HOC. Here's
an example using [`ResizeObserver`
](https://github.com/que-etc/resize-observer-polyfill):

```jsx
import ResizeObserver from 'resize-observer-polyfill';

export default withAvailableWidth(
  ToggleButton,
  (domElement, notify) => {
    const observer = new ResizeObserver(() => notify());
    observer.observe(domElement);
    return () => observer.unobserve(domElement);
  }
);
```

The observer function is called once from the HOC, with two arguments:
- `domElement`: the parent element of the wrapped component
- `notify`: a function to call on every size change

You need to return a function that will clean out the observer. This function
will get called when the HOC is unmounted to clean up possible event listeners.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for help on how to contribute.
