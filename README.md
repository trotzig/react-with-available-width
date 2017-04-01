# Truly responsive React components

Using media queries to style components differently depending on the screen width is great if you're only working in a single column. But let's say you have a multi-column layout where you want responsive components based on the available width in the current container? Or you want a component to be able to render in a lot of different contexts, with unknown widths? With regular media-queries, you can't do that.

`withAvailableWidth` is a [HOC](https://facebook.github.io/react/docs/higher-order-components.html) that will inject a `availableWidth` prop to the wrapped component. It will allow you to write components that render differently based on the currently available width. Here's an example -- a `ToggleButton` that collapses to a checkbox in narrow contexts.

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

What's great here is that we can reuse this component in many contexts. If it's rendered in a table for instance, it's likely to render as a checkbox. But if it's a standalone component in a wide container, it's probably going to show the regular, wider version.

## How does it work?

To figure out the available width in the current context, we drop an empty `<div>` in the DOM for a brief moment. As soon as the div is mounted, we measure its width, then re-render with the calculated width injected as `availableWidth` to the component. The component can then render things conditionally based on this number.

## Limitations

By default, `withAvailableWidth` will only recalculate the width when the window is resized. By injecting a [`ResizeObserver` polyfill](https://github.com/que-etc/resize-observer-polyfill), you can make it recalculate the width on DOM updates as well.

```jsx
import ResizeObserver from 'resize-observer-polyfill';

export default withAvailableWidth(ToggleButton, { ResizeObserver });
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for help on how to contribute.
