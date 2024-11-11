/// <reference path='./types.js' />

import {
  isBrowser,
  win,
  doc,
} from './consts.js';

import {
  utils,
} from './utils.js';

import {
  svg,
} from './svg.js';

import {
  stagger,
} from './stagger.js';

import {
  eases,
} from './eases.js';

import {
  Spring,
  createSpring,
} from './spring.js';

import {
  onScroll,
  ScrollObserver,
  scrollContainers,
} from './scroll.js';

import {
  Clock,
} from './clock.js';

import {
  Engine,
  engine,
} from './engine.js';

import {
  Timer,
} from './timer.js';

import {
  Animation,
} from './animation.js';

import {
  Timeline,
} from './timeline.js';

import {
  Animatable,
} from './animatable.js';

import {
  Draggable,
  createDraggable,
} from './draggable.js';

import {
  Scope,
} from './scope.js';

// Main methods

/**
 * @param {TimerParams} [parameters]
 * @return {Timer}
 */
const createTimer = parameters => new Timer(parameters, null, 0).init();

/**
 * @param {TargetsParam} targets
 * @param {AnimationParams} parameters
 * @return {Animation}
 */
const animate = (targets, parameters) => new Animation(targets, parameters, null, 0, false).init();

/**
 * @param {TimelineParams} [parameters]
 * @return {Timeline}
 */
const createTimeline = parameters => new Timeline(parameters).init();

/**
 * @param {TargetsParam} targets
 * @param {AnimatableParams} parameters
 * @return {AnimatableObject}
 */
const createAnimatable = (targets, parameters) => /** @type {AnimatableObject} */(new Animatable(targets, parameters));

/**
 * @param {ScopeParams} [params]
 * @return {Scope}
 */
const createScope = params => new Scope(params);

// Global Object and visibility checks event register

if (isBrowser) {
  if (!win.AnimeJS) win.AnimeJS = [];
  win.AnimeJS.push({ version: '__packageVersion__', engine });
  doc.addEventListener('visibilitychange',
    () => engine.suspendWhenHidden ? doc.hidden ? engine.suspend() : engine.resume() : 0
  );
}

export {
  animate,
  createTimeline,
  createTimer,
  createAnimatable,
  createDraggable,
  createScope,
  onScroll,
  scrollContainers,
  engine,
  eases,
  createSpring,
  stagger,
  svg,
  utils,
  Clock,
  Engine,
  Timer,
  Animation,
  Timeline,
  Animatable,
  Draggable,
  ScrollObserver,
  Scope,
  Spring,
}
