Anime.js V4 is currently available for **[GitHub Sponsors only](https://github.com/sponsors/juliangarnier)**.

<p align="center">
  <a href="https://github.com/sponsors/juliangarnier">
    <picture align="center">
      <source media="(prefers-color-scheme: dark)" srcset="https://julian.gr/anime/animejs-v4-logo-animation-dark.gif">
      <img align="center" alt="Anime.js V4 logo animation" src="https://julian.gr/anime/animejs-v4-logo-animation.gif" width="640">
    </picture>
  </a>
</p>

## Legend

* 🟢 *New feature*
* 🟠 *Breaking change*

## Internal changes

### Performance

A major focus of V4 development has been on improving performances and lowering the memory usage.
Benchmarks on my 2019 Intel MacBook Pro show a consistent 60 fps when animating 3K DOM elements' CSS transform positions (equivalent to 6K tweens) as well as 50K three.js Instanced Mesh position values (or 100K tweens).

### Improved Tween Composition

The tween system has undergone a revamp to better handle overlapping animations.
This addresses a multitude of issues, particularly when multiple animations affect the same property on the same target.

### Additive Animations

Blend multiple animations together using the new `composition: 'add'` parameter.

### Types

The library now comes with built-in types, thanks to internal use of JSDoc type annotations.

### Tests

More than 300 tests have been written to minimize the introduction of bugs and to make the development of new features easier.

## 🟢 GUI

A GUI interface to inspect and speed-up your animation workflow.

<p align="center">
  <img align="center" alt="Anime.js V4 GUI" src="https://julian.gr/anime/animejs-v4-gui.gif">
</p>

## 🟠 ES Module API

Every anime.js feature is now available as an ES Module.
This makes tree shaking more effective—you only have to include the parts of the library you actually use.
The entire library remains lightweight, clocking in at around `10K` gzipped.

The new API looks like this:

```javascript
import {
  animate,
  createTimer,
  createTimeline,
  engine,
  eases,
  spring,
  defaults,
  stagger,
  utils,
  svg,
} from 'animejs';
````

## Animation

### 🟠 Basic Animation

Here's a snapshot of the principal API changes for creating animations:

```javascript
// V3

import anime from 'animejs';

const animation = anime({
  targets: 'div',
  translateX: 100,
  translateY: { value: 50, ease: 'easeOutExpo' },
  direction: 'alternate',
  easing: 'easeOutQuad',
});
```

```javascript
// V4

import { animate } from 'animejs';

const animation = animate('div', {
  translateX: 100,
  translateY: { to: 50, ease: 'outExpo' },
  alternate: true,
  ease: 'outQuad',
});
```

### 🟠 `targets`

The `targets` parameter has been replaced with a designated function parameter: `animate(targets, parameters)`.

```javascript
// V3

const animation = anime({ targets: 'div', translateX: 100 });
```

```javascript
// V4

const animation = animate('div', { translateX: 100 });
```

## Properties

### 🟢 CSS Variables

You can now animate CSS variables asigned to a target just like any other property:

```javascript
// Animate the value of the CSS variable '--radius'
animate('#target', { '--radius': '20px' });
```

### 🟢 CSS Transforms shorthands

You can now set the translate properties `translateX`, `translateY` and `translateZ` with `x`, `y`, `z`.

```javascript
animate('#target', {
  x: '100px',
  y: '100px',
  z: '100px',
});
// Is equivalent to
animate('#target', {
  translateX: '100px',
  translateY: '100px',
  translateZ: '100px',
});
```

## Values

### 🟠 To

The `value` property of the old object syntax has been renamed to `to`:

```diff
- translateX: { value: 100 }
+ translateX: { to: 100 }
```

In V4, creating an animation with object syntax is almost like describing the action in plain English:

```javascript
animate('p', { opacity: { to: 0 } });
```

This is equivalent to:

```javascript
animate('p', { opacity: 0 });
```

Use the object syntax with the `to` property only when you need to define specific property parameters or use it within keyframes.

Specific property parameters example:

```javascript
animate('p', {
  opacity: {
    to: 0,
    duration: 400,
    ease: 'outExpo',
  },
  translateX: {
    to: 100,
    duration: 800,
    ease: 'outElastic',
  },
});
```

Keyframes example:

```javascript
animate('p', {
  opacity: [{
    to: 0,
    duration: 300,
    ease: 'inQuad',
  }, {
    to: 1,
    duration: 300,
    ease: 'outQuad',
  }],
});
```

### 🟢 From

Animate *from* a specific value.
For example, "animate the paragraph opacity starting from 0":

```javascript
animate('p', { opacity: { from: 0 } });
```

### From To

Although the `[from, to]` shortcut syntax is still valid in V4, you can also combine *from* and *to* properties like this:

For instance, "animate the paragraph opacity from 0 to 0.5":

```javascript
animate('p', { opacity: { from: 0, to: 0.5 } });
```

The properties keyframes system in V4 is similar to V3. Just swap in the `from` and `to` values.

```javascript
animate(targets, {
  prop1: [
    { from: x, to: y, duration: 500, endDelay: 250 },
    { to: z, duration: 250, delay: 400 },
    { to: w, duration: 500, ease: 'out' },
  ],
});
```

### 🟢 Colors

Added support for hex colors with an alpha channel, e.g., `'#F443'` or `'#FF444433'`.

## Animation Parameters

### 🟠 `duration`

Duration is now clamped between `1e-12` and `1e12` ms.
Setting the duration to `0` results in a `1e-12` ms animation, and setting it to `Infinity` results in a `1e12` ms animation (approximately 32 years).
This solves many edge cases and ensures the `.progress` property always returns a valid number instead of `NaN` for `0` ms duration or always `0` for infinite duration.

### 🟠 `ease`


The `easing` parameter is now `ease`.
The new default easing function is `'outQuad'` instead of `'easeOutElastic(1, .5)'`.

```diff
- easing: 'easeInOutExpo',
+ ease: 'inOutExpo',
```

The `ease` parameter no longer accepts function-based values, allowing you to pass ease functions directly.

```diff
- easing: () => myCustomEasing,
+ ease: myCustomEasing,
```

##### 🟠 spring

`'spring'` has been removed from the core and needs to be imported separately.
V4 fixes some duration calculation issues related to spring animation as well.

```diff
+ import { animate, spring } from 'animejs';

animate(target, {
  translateX: 100,
- easing: 'spring(1, 100, 15, 0)',
+ ease: createSpring({ stiffness: 15 }),
})
```

##### 🟢 in, out, inOut, outIn

New `'in'`, `'out'`, `'inOut'`, `'outIn'` eases with an optional *power* parameter (`'in(1.5)'`).
When called without a parameter, they're equivalent to the standard CSS eases like `'ease-in'`, `'ease-out'`, `'ease-in-out'`.

Power parameters can match Quad, Cubic, Quart, and Quint ease functions:
```
outQuad = out(2)
outCubic = out(3)
outQuart = out(4)
outQuint = out(5)
```

##### 🟢 `'linear()'`

The `'linear'` ease now accepts a series of values similar to [MDN's linear ease function](https://developer.mozilla.org/en-US/docs/Web/CSS/ease-function#linear_ease_function).
`'linear(0, 0.25, 75%, 1)'`
Note that `'linear'` without options behaves the same as in V3 (no easing).

##### 🟢 `'irregular(steps, strength)'`

The `'irregular'` ease creates an irregular easing curve, perfect to add randomness to linear animation, like typewriting animations.
`'irregular(16, 1.2)'`
The steps parameter defines how many steps are present in the curve. Default 10.
The strength parameter defines how big the irregularities are. A strength of 0 is equivalent to `'linear'`. Default 1.

### 🟢 `composition`

In V3, animations could overlap, leading to unexpected results when sharing the same targets and properties.
In V4, running animations are *cut* where the new one starts to avoid overlaps. This behavior can be configured using the new `composition` parameter.

- `composition: 'none'` Equivalent to V3, animations can overlap.
- `composition: 'replace'` New V4 default, running animations are cut and the new one takes over.
- `composition: 'add'` Additive animations combine the values of running animations with the new one.

The engine will switch to `composition: 'none'` when an animation with +1K targets is created for better performances.

### 🟠 `round` -> `modifier`

The `round` parameter has been replaced with a more flexible `modifier` parameter. This allows you to define custom functions that modify an animation's numerical value just before rendering.

```diff
- round: 100
+ modifier: utils.round(2)
```

You can also define your own modifier functions like so:

```javascript
animate(target, {
  translateX: 100,
  modifier: v => v % 10
});
```

## Playback parameters

### 🟠 `direction`

The `direction` parameter has been replaced with `alternate` and `reversed` parameters.
In V3, you couldn't combine `'reverse'` and `'alternate'`.
Having two separate parameters, in my opinion, is better than the `'alternate-reverse'` option of CSS animations.

```javascript
// V3
const animation = anime({
  targets: 'div',
  translateX: 100,
  direction: 'reverse',
  // direction: 'alternate' // It wasn't possible to combine reverse and alternate
});
```

```javascript
// V4
const animation = animate('div', {
  translateX: 100,
  reversed: true,
  alternate: true,
});
```

### 🟠 New `loop` behavior

In V3, the `loop` parameter defined the number of iterations with a default of `1`. In V4, it defines how many times the `Timer`, `Animation`, or `Timeline` loops, with a default of `0`.

### 🟢 `beginDelay`

The new `beginDelay` parameter lets you set the delay time in milliseconds before a `Timer`, `Animation`, or `Timeline` starts. It differs from the `delay` parameters

### 🟢 `frameRate`

The `frameRate` parameter sets the number of frames per second (fps) for a Timer, Animation, or Timeline.

### 🟢 `playbackRate`

Use the `playbackRate` parameter to control the speed of a Timer, Animation, or Timeline, either speeding up or slowing down as needed.

## 🟠 Callbacks

Callbacks have been simplified and are now prefixed with `on` for better readability.

```diff
animate('targets', {
  translateX: 100,
- begin: () => {},
+ onBegin: () => {},
- update: () => {},
+ onUpdate: () => {},
- change: () => {},
+ onRender: () => {},
- changeBegin: () => {},
- changeComplete: () => {},
- loopBegin: () => {},
- loopComplete: () => {},
+ onLoop: () => {},
- complete: () => {},
+ onComplete: () => {},
});
```

### 🟢 `onRender()`

The `onRender()` callback replaces `change()`, `changeBegin()`, and `changeComplete()`.
It's called every time an `Animation` or `Timeline` renders something on screen.

### 🟢 `onLoop()`

The new callback `onLoop()` replaces `loopBegin()` and `loopComplete()`.

### 🟠 Changes to `onUpdate()`

The `onUpdate()` callback is now influenced by the `frameRate` parameter.

```javascript
animate(target, {
  translateX: 100,
  frameRate: 30,
  onUpdate: () => { /* Called at 30 fps */ }
})
```

## Controls

V4 introduces three new control methods: `.cancel()`, `.revert()` and `.stretch()`.

### 🟢 `.cancel()`

Completely cancels an animation and frees up memory.

### 🟢 `.revert()`

Cancels an animation and reverts all changes made by it, even removes inline styles.

### 🟢 `.stretch(duration)`

Change the total duration of an animation or timeline.

## 🟢 Timers

In V3, you could create animations without targets and use them as timers:

```javascript
const timer = anime({
  duration: 500,
  complete: () => {
    // do something in 500 ms
  }
});
```

V4 introduces a dedicated `createTimer()` factory function for creating Timers:

```javascript
import { createTimer } from 'animejs';

const timer = createTimer({
  duration: 500,
  onComplete: () => {
    // do something in 500 ms
  }
});
```

`Timer` is internally the base `Class` extended by `Animation` and `Timeline`.
This means they share all the same properties, callbacks, and controls.
The only main difference is that `Timer` has a default `duration` of `Infinity` instead of `1000` for `Animation`.

```javascript
import { createTimer } from 'animejs';

const mainLoop = createTimer({
  frameRate: 60,
  onUpdate: () => {
    // do something on every frame at 60 fps
  }
});

mainLoop.pause(); // Pause the timer
mainLoop.play(); // Play the timer
```

## 🟢 Animatables

Animatables are an efficient way to manage repeated animations on the same target and properties by avoiding the redundancy of calling animate() or utils.set() multiple times.
This approach not only simplifies your code but also significantly boosts performance by recycling animations, rather than creating new ones each time a value changes.

### Registering properties

```javascript
const transforms = createAnimatable('span', {
  translateX: true, // Registered as animatable
  translateY: { duration: 350 }, // Registered as animatable with a specific duration
  rotate: false, // Registered as a setter without animation
  duration: 500 // Defines the global duration for the animated properties
});
```

### Animating / setting animatable property values

V4 introduces a dedicated `createTimer()` factory function for creating Timers:

```javascript
transforms.translateX.to(100); // Animate translateX to 100px in 500ms
transforms.translateY.from(50); // Animate translateY from 50px in 350ms
transforms.translateY.fromTo(50, 100); // Animate translateY from 50px to 100px in 350ms
```

## Timelines

On top of a lot of bug fixes and performances improvement, Timelines have received a ton of new features.

### 🟠 Default Child Parameters

Default parameters for child animations are now defined separatly into a dedicated `defaults` object.
This allow you to defines defaults children playback parameters while also configurating the playback of the timeline.

```javascript
// V3

import anime from 'animejs';

const tl = anime.timeline({
  ease: 'easeInOutQuad',
  duration: 800
});
```

```javascript
// V4

import { createTimeline } from 'animejs';

const tl = createTimeline({
  defaults: {
    ease: 'inOutQuad',
    duration: 800
  }
});
```

### 🟢 Child Playback Parameters

The `loop`, `alternate`, and `reversed` options now work for child animations and can be combined with the timeline parameters. In the example below, `'#target'` will alternate its `translateX` value between 0 and 100 six times (3 x 2 loops).

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  loop: 2 // The entire timeline will loop twice
});

tl.add('#target', {
  translateX: 100,
  loop: 3, // This particular animation will loop three times within each timeline loop
  alternate: true
});
```

### 🟢 Add Timers

You can add timers to your timeline by omitting the target parameter in the `.add()` method.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add({ duration: 500, onComplete: () => {} })
  .add({ duration: 100, onUpdate: () => {} }, '-=200')
```

### 🟢 Add Labels

Labels can now be added to your timeline to define time positions. Just pass a string label and time position to the `.add()` function.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add('LABEL NAME 01', 100)
  .add('LABEL NAME 02', 400)
  .add('#target', { translateX: 100 }, 'LABEL NAME 01')
  .add('LABEL NAME 03', '+=100') // Labels can also be defined later, like any other child
  .add('#target', { translateX: 200 }, 'LABEL NAME 02')
  .add('#target', { rotate: 50 }, 'LABEL NAME 03')
```

### 🟢 Add Functions

You can add function to your timeline by simply passing a function as only argument to the `.add()` method.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add({ duration: 500 })
  .add(() => { /* Do something */ }, '-=200')
```

### 🟢 More Time Position Options

V4 introduces new ways to specify the time position of timeline children:

- `'<='`: At the end of the last child animation
- `'<-=100'`: 100ms before the end of the last child
- `'<=+100'`: 100ms after the end of the last child
- `'<<'`: At the beginning of the last child
- `'<<-=100'`: 100ms before the beginning of the last child
- `'<<+=100'`: 100ms after the beginning of the last child
- `'LABEL_NAME-=100'`: 100ms before the label's time position
- `'LABEL_NAME+=100'`: 100ms after the label's time position

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add('#target', { translateX: 100, duration: 800 })
  .add('#target', { translateX: 200, duration: 400 }, '<<')
  .add('#target', { translateX: 100 }, '<=')
  .add('LABEL NAME 03', '+=100')
  .add('#target', { translateX: 200 }, 'LABEL NAME 02')
  .add('#target', { rotate: 50 }, 'LABEL NAME 03')
```

### 🟢 Set Values in Timeline

V4 also exposes the `.set()` utility method directly within timelines.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add('#target', { translateX: 100 })
  .set('#target', { translateX: 0 }) // Instantly sets the translateX value to 0
```

### 🟢 Stagger Child Position

Easily stagger multi-target animations within a timeline.

```javascript
import { createTimeline } from 'animejs';

const onComplete = $el => console.log($el);

const tl = createTimeline();
```

```diff
- tl.add('.target:nth-child(1)', { opacity: 0, onComplete }, 0)
-   .add('.target:nth-child(2)', { opacity: 0, onComplete }, 100)
-   .add('.target:nth-child(3)', { opacity: 0, onComplete }, 200)
-   .add('.target:nth-child(4)', { opacity: 0, onComplete }, 300)

+ tl.add('.target', { opacity: 0, onComplete }, stagger(100))
```

## Stagger

### 🟢 Units in staggered values

The stagger value now accepts units.

```javascript
import { animate, stagger } from 'animejs';

animate('.elements', { translateX: stagger('1rem') });

// 0rem, 1rem, 2rem, 3rem, 4rem
```

### 🟠 `direction` -> `reversed`

The stagger `direction` parameter has been renamed to `reversed` to better align with the new playback API.

```javascript
import { animate, stagger } from 'animejs';

animate('.elements', { translateX: stagger('1rem', { reversed: true }) });

// 4rem, 3rem, 2rem, 1rem, 0rem
```

## SVG

In V4, all SVG utility functions are exposed by the `svg` module.

```javascript
import { svg } from 'animejs';
```

### 🟢 `svg.morphTo()`

This method enables morphing between two shapes, even if they have a different number of points.

```javascript
svg.morphTo(shapeTarget, precision);
```

The optional `precision` parameters allows you to define the quality of the morphing.
The higher the better. If your two shapes have exactly the same number of points, passing `0` will not perform any points extrapolations and use the shapes points directly.

```javascript
// V3

import anime from 'animejs';

anime({
  targets: '#shape',
  points: '70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369',
});
```

```javascript
// V4

import { animate, svg } from 'animejs';

animate('#shape1', { points: svg.morphTo('#shape2') });
```

### 🟠 `svg.drawLine()`

This replaces `anime.setDashoffset` from V3 and adds the ability to define the direction of the line drawing animation.

```diff
- strokeDashoffset: [anime.setDashoffset, 0],
+ strokeDashoffset: svg.drawLine(),
```

```javascript
import { animate, svg } from 'animejs';

animate('path', {
  strokeDashoffset: [
    { to: svg.drawLine('in') },
    { to: svg.drawLine('out') },
  ],
});
```

### 🟠 `svg.createMotionPath()`

This replaces `anime.path` from V3.

```javascript
// V3

import anime from 'animejs';

const path = anime.path('path');

anime({
  targets: '#target',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
});
```

```javascript
// V4

import { animate, svg } from 'animejs';

const { x, y, angle } = svg.createMotionPath('path');

animate('#target', {
  translateX: x,
  translateY: y,
  rotate: angle,
});
```

## Utility functions

The new `utils` module combines all V3 utility functions, exposes several internal functions that were previously unavailable and add new ones.

```javascript
import { utils } from 'animejs';
```

### 🟠 utils.get()

This replaces the V3 `anime.get()` function.

##### 🟢 utils.get(target)

Returns an array of targets from an `Object` / `String` / `DOMNode` / `NodeList`.

```javascript
const $target = utils.get('#target'); // [$el];
const $targets = utils.get('.target'); // [$el, $el, $el, $el, $el];
```

##### 🟠 utils.get(target, property)

Passing both `target` and `property` returns the current property value of the specified target.

```javascript
const width = utils.get('#target', 'width'); // '80px'
```

##### 🟠 utils.get(target, property, unit)

Specifying a unit as the third parameter returns the property value in that unit.

```javascript
const widthInEm = utils.get('#target', 'width', 'em'); // '5em'
```

Passing `false` as the third parameter returns the value as a `Number`.

```javascript
const widthNumber = utils.get('#target', 'width', false); // 80
```

### 🟠 utils.set()

This is the new version of the V3 `anime.set()`.

```javascript
utils.set('#set .demo .square', {
  width: 80, // Will set the value in px
  height: '1rem', // Specify unit
  translateX: stagger('3rem', { start: 5, reversed: true, ease: 'in' }),
  color: 'var(--hex-red)', // Non-numeric values allowed
});
```

### 🟠 utils.remove()

This replaces the V3 `anime.remove()` and lets you specify which Animation or Timeline to remove the target from.

```javascript
utils.remove(targets, Animation | Timeline);
```

### 🟢 utils.cleanInlineStyles()

Removes all inline styles added by an Animation or Timeline.

```javascript
utils.cleanInlineStyles(Animation | Timeline);
```

### 🟠 utils.promisify()

In V4, animations no longer automatically return promises. Use `utils.promisify()` to enable this.

```diff
- anime({ targets: target, prop: x }).finished.then(doSomething);
+ utils.promisify(animate(target, { prop: x })).then(doSomething);
```

### 🟠 utils.random()

This function now allows you to specify the number of decimals for the returned value.

```javascript
utils.random(0, 100); // 45
utils.random(0, 100, 2); // 45.39
```

### 🟢 utils.randomPick()

Picks a random item from an `Array`, `NodeList`, or `String`.

```javascript
utils.randomPick(Array | NodeList | String);
```

### 🟢 utils.shuffle()

Shuffle an `Array`.

```javascript
utils.randomPick(Array | NodeList | String);
```

### 🟠 utils.round()

Replaces the V3 `round` animation parameter.
The `decimalLength` parameter now accept the number of decimals and is mandatory.

```javascript
utils.round(value, decimalLength);
```

### 🟢 utils.clamp()

Clamps a `Number` between specified *min* and *max* values.

```javascript
utils.clamp(value, min, max);
```

### 🟢 utils.snap()

Snaps a `Number` to the nearest specified increment.

```javascript
utils.snap(value, increment);
```

### 🟢 utils.wrap()

Wraps a `Number` between a defined *min* and *max* range.

```javascript
utils.wrap(value, min, max);
```

### 🟢 utils.mapRange()

Maps a `Number` from one range to another.

```javascript
utils.map(value, fromLow, fromHigh, toLow, toHigh);
```

### 🟢 utils.interpolate()

Interpolates between two numbers based on given progress.

```javascript
utils.interpolate(start, end, progress);
```

### 🟢 utils.roundPad()

Rounds a value to a specified decimal length and pads with zeros if needed.

```javascript
utils.roundPad(value, decimalLength);
```

### 🟢 utils.padStart()

Pads a `Number` from the start with a string until it reaches a given length.

```javascript
utils.padStart(value, totalLength, padString);
```

### 🟢 utils.padEnd()

Pads a `Number` from the end until it reaches a given length.

```javascript
utils.padEnd(value, totalLength, padString);
```

### 🟢 utils.lerp()

Performs linear interpolation between two values.

### 🟢 utils.degToRad()

Convert degrees to radians.

### 🟢 utils.RadToDeg()

Convert radians to degrees.

```javascript
utils.lerp(start, end, amount);
```

### 🟢 Chaining utility functions

Chain multiple transformations from the `utils` object. Each function in the chain processes the output from the previous function as its primary input.

```javascript
const chainedFunction = utils.func1(params).func2(params);
chainedFunction(value);
```

These are all the chain-able functions exposed by `utils`:

```javascript
clamp
round
snap
wrap
mapRange
interpolate
lerp
roundPad
padStart
padEnd
```

## 🟢 `engine`

```javascript
import { engine } from 'animejs';
```

The `engine` is the core of Anime.js. It controls the playback of all Timers, Animations, and Timelines.

### `engine.useDefaultMainLoop`

When set to `false`, this property tells the engine to not use its built-in main loop. This is especially useful if you want to integrate Anime.js with your custom main loop.

Example using Three.js built-in renderer animation loop:

```javascript
engine.useDefaultMainLoop = false; // Stops Anime.js from using its built-in loop

const render = () => {
  engine.tick(); // Manually advance the Anime.js engine
  renderer.render(scene, camera); // Render the Three.js scene
};

renderer.setAnimationLoop(render); // Invoke Three.js built-in animation loop
```

This replaces the less useful V3 method `animation.tick(time)`.

### `engine.pauseWhenHidden`

When set to `false`, this prevents the engine from automatically pausing when the browser tab is hidden.
Replaces the V3 global property `anime.suspendWhenDocumentHidden`.

### `engine.frameRate`

Get and set the global frame rate for animations. Note: individual animations cannot exceed this global frame rate.

### `engine.playbackRate`

This property controls the global playback rate for all running animations. Individual animations will have their playback rates adjusted relative to this global rate.
Replaces the V3 global property `anime.speed`.

### `engine.tick()`

This function allows you to manually advance the engine when `engine.useDefaultMainLoop` is set to `false`.
Returns a `Number`.

### `engine.suspend()`

Pauses all running animations by stopping the built-in main loop. This has no effect if `engine.useDefaultMainLoop` is set to `true`.
Returns `self`.

### `engine.resume()`

Resumes the built-in main loop and adjusts the current times of all paused animations accordingly. Has no effect if `engine.useDefaultMainLoop` is set to `true`.
Returns `self`.

## 🟢 Custom Global Defaults

You can now modify Anime.js default parameters by overriding the properties of the `defaults` object.

```javascript
import { defaults } from 'animejs';

defaults.playbackRate = 1;
defaults.frameRate = 120;
defaults.loop = 0;
defaults.reversed = false;
defaults.alternate = false;
defaults.autoplay = true;
defaults.beginDelay = 0;
defaults.duration = 1000;
defaults.delay = 0;
defaults.endDelay = 0;
defaults.ease = 'outQuad';
defaults.composition = 0;
defaults.modifier = v => v;
defaults.onBegin = () => {};
defaults.onUpdate = () => {};
defaults.onRender = () => {};
defaults.onLoop = () => {};
defaults.onComplete = () => {};
```

## [Get Anime.js V4](https://github.com/sponsors/juliangarnier)
Anime.js V4 is currently available for **[GitHub Sponsors only](https://github.com/sponsors/juliangarnier)**.

<p align="center">
  <a href="https://github.com/sponsors/juliangarnier">
    <picture align="center">
      <source media="(prefers-color-scheme: dark)" srcset="https://julian.gr/anime/animejs-v4-logo-animation-dark.gif">
      <img align="center" alt="Anime.js V4 logo animation" src="https://julian.gr/anime/animejs-v4-logo-animation.gif" width="640">
    </picture>
  </a>
</p>
