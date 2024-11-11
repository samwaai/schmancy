import { animate, createTimeline, utils, stagger, svg, spring } from '../../lib/anime.esm.js';

const path = svg.createMotionPath('#noSpecifiedWidth');

animate(['.no-specified-width .dom-el', '.no-specified-width .rect-el'], {
  translateX: path.x,
  translateY: path.y,
  rotate: path.angle,
  duration: 3000,
  loop: true,
  ease: 'linear'
});

const specifiedWidthPath = svg.createMotionPath('#specifiedWidth');
animate(['.specified-width .dom-el', '.specified-width .rect-el'], {
  translateX: specifiedWidthPath.x,
  translateY: specifiedWidthPath.y,
  rotate: specifiedWidthPath.angle,
  duration: 3000,
  loop: true,
  ease: 'linear'
});

const preserveAspectRatioPath = svg.createMotionPath('#preserveAspectRatio');
animate(['.preserveAspectRatio .dom-el', '.preserveAspectRatio .rect-el'], {
  translateX: preserveAspectRatioPath.x,
  translateY: preserveAspectRatioPath.y,
  rotate: preserveAspectRatioPath.angle,
  duration: 3000,
  loop: true,
  ease: 'linear'
});
