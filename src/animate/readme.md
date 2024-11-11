Here’s a README documentation template for the `schmancy-animate` component:

---

# `schmancy-animate`

The `schmancy-animate` component provides an easy way to apply animations to its slotted elements. It allows for a range of properties to be set, such as opacity, delay, duration, and translation effects, with support for staggered animations.

## Import

To use the `schmancy-animate` component, import it as follows:

```javascript
import '@mhmo91/schmancy/animate'
```

## Usage

### Basic Example

```html
<schmancy-animate opacity="[0, 1]" translateY="[10, 0]" duration="500" easing="easeInOut">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
</schmancy-animate>
```

### Properties

| Property     | Type            | Description                           | Default   |
| ------------ | --------------- | ------------------------------------- | --------- |
| `opacity`    | `Array<number>` | Starting and ending opacity values    | `[]`      |
| `delay`      | `number`        | Delay in milliseconds                 | `0`       |
| `duration`   | `number`        | Duration of animation in milliseconds | `300`     |
| `translateX` | `Array<number>` | Horizontal translation in px          | `[0, 0]`  |
| `translateY` | `Array<number>` | Vertical translation in px            | `[0, 0]`  |
| `easing`     | `string`        | Easing function                       | `outExpo` |
| `stagger`    | `boolean`       | Whether to stagger animation          | `false`   |

### Detailed Property Descriptions

- **opacity**: Defines the starting and ending opacity values for the animation.
- **delay**: Sets the delay before the animation starts, in milliseconds. Can be staggered if `stagger` is set to `true`.
- **duration**: Duration of the animation, in milliseconds.
- **translateX**: Defines the horizontal translation values (start and end) for animating movement along the X-axis.
- **translateY**: Defines the vertical translation values (start and end) for animating movement along the Y-axis.
- **easing**: Specifies the easing function for the animation. Defaults to `outExpo`.
- **stagger**: When set to `true`, the animation delay will be staggered across child elements.

### Methods and Lifecycle

The `firstUpdated()` method initializes the animation on all slotted elements using the specified animation properties.

### Example with Staggered Animation

```html
<schmancy-animate opacity="[0, 1]" translateY="[20, 0]" duration="600" delay="100" stagger>
	<div>Item A</div>
	<div>Item B</div>
	<div>Item C</div>
</schmancy-animate>
```

This example will stagger the animation for each child element, with a delay of 100ms between each element's animation.

## Dependencies

- [`@juliangarnierorg/anime-beta`](https://github.com/juliangarnier/anime): For handling animations.
- [`@schmancy/mixin/lit`](https://github.com/mhmo91/lit-mixins): Provides base class `$LitElement` with custom styles.
- [`lit`](https://lit.dev/): For web component and rendering support.

## Styling

The component inherits display, height, and width properties from its parent by default.

---

By following this template, you can create detailed documentation for each component in the Schmancy library, ensuring users have clear guidance on using each feature effectively.
