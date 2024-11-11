# Anime.js

<p align="center">
  <picture align="center">
    <source media="(prefers-color-scheme: dark)" srcset="./website/assets/images/readme/animejs-v4-logo-animation-dark.gif">
    <img align="center" alt="Anime.js V4 logo animation" src="./website/assets/images/readme/animejs-v4-logo-animation.gif" width="560">
  </picture>
</p>

<p align="center">
  <strong>
  <em>Anime.js</em> is a fast, multipurpose and lightweight JavaScript animation library with a simple, yet powerful API.<br>
  It works with CSS properties, SVG, DOM attributes and JavaScript Objects.
  </strong>
</p>

<p align="center">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/animejs?style=flat-square&logo=npm">
  <img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/animejs?style=flat-square&logo=jsdeliver">
  <img alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/juliangarnier?style=flat-square&logo=github">
</p>

<p align="center">
  <strong>
    <a href="#usage">Usage</a>&nbsp;/&nbsp;<a href="#npm-development-scripts">NPM development scripts</a>&nbsp;/&nbsp;<a href="#v4-api-breaking-changes-overview">V4 API breaking changes overview</a>
  </strong>
</p>

## Private Anime.js Discord
Join us on Discord by following this link https://discord.gg/N2vjsQsq9w

Please don't forget to **share your GitHub username** and **your Discord username** to julian@animejs.com so I can give you the sponsor role!!

## Installing Anime.js V4 private beta via NPM

In your project, create or edit the `.npmrc` file to include:
```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
@juliangarnierorg:registry=https://npm.pkg.github.com
```
(You can generate a GitHub personal access token with the scope `repo, write:packages` in the GitHub Developer settings page.)

This should allow you to install the package like this
```
npm install @juliangarnierorg/anime-beta
```

## Usage

Anime.js V4 works by importing ES modules like so:

<table>
<tr>
  <td>

```javascript
import {
  animate,
  stagger,
} from '@juliangarnierorg/anime-beta';

animate('.square', {
  translateX: 320,
  rotate: { from: -180 },
  duration: 1250,
  delay: stagger(65, { from: 'center' }),
  ease: 'inOutQuint',
  loop: true,
  alternate: true
});
```

  </td>
  <td>
    <img align="center" alt="Anime.js code example" src="./website/assets/images/readme/usage-example-result.gif">
  </td>
</tr>
</table>

## V4 Documentation

To access V4 docs, run `npm i` then `npm run docs`.

> [!IMPORTANT]
> Docs content still need some polish but it covers about 95% of the current beta codebase.<br>
> Full changelog can be find [here](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4)

## NPM development scripts

First, run `npm i` to install all the necessary packages.
Then, execute the following scripts with `npm run <script>`.

| script | action |
| ------ | ------ |
| `dev` | Watch any changes in `src/` and compiles the esm version to `lib/anime.esm.js` |
| `dev-types` | Same as `dev`, but also run TypeScript and generate the `types/index.d.ts` file |
| `build` | Generate types definition and compiles ESM / UMD / IIFE versions to `lib/` |
| `test-browser` | Start a local server and start all browser related tests |
| `test-node` | Start all Node related tests |
| `docs` | Start a local server to read the docs locally |
| `examples` | Start a local server to browse the examples locally |

## V4 API breaking changes overview

### Animations

```diff
- import anime from 'animejs';
+ import { animate, createSpring, utils } from 'animejs';

- anime({
-   targets: 'div',
+ animate('div', {
    translateX: 100,
      rotate: {
-     value: 360,
+     to: 360,
-     easing: 'spring(.7, 80, 10, .5)',
+     ease: createSpring({ mass: .7, damping: 80, stiffness: 10, velocity: .5}),
    },
-   easing: 'easeinOutExpo',
+   ease: 'inOutExpo',
-   easing: () => t => Math.cos(t),
+   ease: t => Math.cos(t),
-   direction: 'reverse',
+   reversed: true,
-   direction: 'alternate',
+   alternate: true,
-   loop: 1,
+   loop: 0,
-   round: 100,
+   modifier: utils.round(2),
-   begin: () => {},
+   onBegin: () => {},
-   update: () => {},
+   onUpdate: () => {},
-   change: () => {},
+   onRender: () => {},
-   changeBegin: () => {},
-   changeComplete: () => {},
-   loopBegin: () => {},
-   loopComplete: () => {},
+   onLoop: () => {},
-   complete: () => {},
+   onComplete: () => {},
  });
```

### Promises

```diff
- import anime from 'animejs';
+ import { animate, utils } from 'animejs';

- anime({ targets: target, prop: x }).finished.then(() => {});
+ animate(target, { prop: x }).then(() => {});
```

### Timers

```diff
- import anime from 'animejs';
+ import { createTimer } from 'animejs';

- anime({
+ createTimer({
-   duration: Infinity,
-   update: () => {},
+   onUpdate: () => {},
  });
```

### Timelines

```diff
- import anime from 'animejs';
+ import { createTimeline, stagger } from 'animejs';

- anime.timeline({
+ createTimeline({
-   duration: 500,
-   easing: 'easeInOutQuad',
+   defaults: {
+     duration: 500,
+     ease: 'inOutQuad',
+   }
-   loop: 2,
+   loop: 1,
- }).add({
-   targets: 'div',
+ }).add('div', {
    rotate: 90,
  })
- .add('.target:nth-child(1)', { opacity: 0, onComplete }, 0)
- .add('.target:nth-child(2)', { opacity: 0, onComplete }, 100)
- .add('.target:nth-child(3)', { opacity: 0, onComplete }, 200)
- .add('.target:nth-child(4)', { opacity: 0, onComplete }, 300)
+ .add('.target', { opacity: 0, onComplete }, stagger(100))
```

### Stagger

```diff
- import anime from 'animejs';
+ import { animate, stagger } from 'animejs';

- anime({
-   targets: 'div',
+ animate('div', {
-   translateX: anime.stagger(100),
+   translateX: stagger(100),
-   delay: anime.stagger(100, { direction: 'reversed' }),
+   translateX: stagger(100, { reversed: true }),
  });
```

### SVG

```diff
- import anime from 'animejs';
+ import { animate, svg } from 'animejs';

- const path = anime.path('path');
+ const { x, y, angle } = svg.createMotionPath('path');

- anime({
-   targets: '#shape1',
+ animate('#shape1', {
-   points: '70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369',
+   points: svg.morphTo('#shape2'),
-   strokeDashoffset: [anime.setDashoffset, 0],
+   strokeDashoffset: svg.drawLine(),
-   translateX: path('x'),
-   translateY: path('y'),
-   rotate: path('angle'),
+   translateX: x,
+   translateY: y,
+   rotate: angle,
  });
```

### Utils

```diff
- import anime from 'animejs';
+ import { utils } from 'animejs';

- const value = anime.get('#target1', 'translateX');
+ const value = utils.get('#target1', 'translateX');

- anime.set('#target1', { translateX: 100 });
+ utils.set('#target1', { translateX: 100 });

- anime.remove('#target1');
+ utils.remove('#target1');

- const rounded = anime.round(value);
+ const rounded = utils.round(value, 0);
```

### Engine

```diff
- import anime from 'animejs';
+ import { engine } from 'animejs';

- anime.suspendWhenDocumentHidden = false;
+ engine.pauseWhenHidden = false;

- anime.speed = .5;
+ engine.playbackRate = .5;
```


<!--
## [Documentation](https://animejs.com/documentation/)

* [Targets](https://animejs.com/documentation/#cssSelector)
* [Properties](https://animejs.com/documentation/#cssProperties)
* [Property parameters](https://animejs.com/documentation/#duration)
* [Animation parameters](https://animejs.com/documentation/#direction)
* [Values](https://animejs.com/documentation/#unitlessValue)
* [Keyframes](https://animejs.com/documentation/#animationKeyframes)
* [Staggering](https://animejs.com/documentation/#staggeringBasics)
* [Timeline](https://animejs.com/documentation/#timelineBasics)
* [Controls](https://animejs.com/documentation/#playPause)
* [Callbacks and promises](https://animejs.com/documentation/#update)
* [SVG Animations](https://animejs.com/documentation/#motionPath)
* [Easing functions](https://animejs.com/documentation/#linearEasing)
* [Helpers](https://animejs.com/documentation/#remove)

## [Demos and examples](http://codepen.io/collection/b392d3a52d6abf5b8d9fda4e4cab61ab/)

* [CodePen demos and examples](http://codepen.io/collection/b392d3a52d6abf5b8d9fda4e4cab61ab/)
* [juliangarnier.com](http://juliangarnier.com)
* [animejs.com](https://animejs.com)
* [Moving letters](http://tobiasahlin.com/moving-letters/) by [@tobiasahlin](https://twitter.com/tobiasahlin)
* [Gradient topography animation](https://tympanus.net/Development/GradientTopographyAnimation/) by [@crnacura](https://twitter.com/crnacura)
* [Organic shape animations](https://tympanus.net/Development/OrganicShapeAnimations/) by [@crnacura](https://twitter.com/crnacura)
* [Pieces slider](https://tympanus.net/Tutorials/PiecesSlider/) by [@lmgonzalves](https://twitter.com/lmgonzalves)
* [Staggering animations](https://codepen.io/juliangarnier/pen/4fe31bbe8579a256e828cd4d48c86182?editors=0100)
* [Easings animations](https://codepen.io/juliangarnier/pen/444ed909fd5de38e3a77cc6e95fc1884)
* [Sphere animation](https://codepen.io/juliangarnier/pen/b3bb8ca599ad0f9d00dd044e56cbdea5?editors=0010)
* [Layered animations](https://codepen.io/juliangarnier/pen/6ca836535cbea42157d1b8d56d00be84?editors=0010)
* [anime.js logo animation](https://codepen.io/juliangarnier/pen/d43e8ec355c30871cbe775193255d6f6?editors=0010)


## Browser support

| Chrome | Safari | IE / Edge | Firefox | Opera |
| --- | --- | --- | --- | --- |
| 24+ | 8+ | 11+ | 32+ | 15+ |

## <a href="https://animejs.com"><img src="/documentation/assets/img/animejs-v3-logo-animation.gif" width="150" alt="anime-js-v3-logo"/></a>

[Website](https://animejs.com/) | [Documentation](https://animejs.com/documentation/) | [Demos and examples](http://codepen.io/collection/b392d3a52d6abf5b8d9fda4e4cab61ab/) | [MIT License](LICENSE.md) | © 2019 [Julian Garnier](http://juliangarnier.com).
 -->
