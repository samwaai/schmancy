/// <reference path='./types.js' />

import {
  globals,
} from './globals.js';

import {
  Animation,
} from './animation.js';

import {
  Animatable,
} from './animatable.js';

import {
  win,
  doc,
  maxValue,
  noop,
  draggableSymbol,
  compositionTypes,
} from './consts.js';

import {
  parseTargets,
} from './targets.js';

import {
  snap,
  clamp,
  round,
  isObj,
  isUnd,
  isArr,
  isFnc,
} from './helpers.js';

import {
  getTargetValue,
  setTargetValues,
  remove,
  mapRange,
} from './utils.js';

import {
  Timer,
} from './timer.js';

import {
  setValue,
} from './values.js';

import {
  eases,
  parseEasings,
} from './eases.js';

import {
  createSpring,
} from './spring.js';

function canScroll(el, scrollAxis) {
    if (0 === el[scrollAxis]) {
        el[scrollAxis] = 1;
        if (1 === el[scrollAxis]) {
            el[scrollAxis] = 0;
            return true;
        }
    } else {
        return true;
    }
    return false;
}

function isScrollableX(el) {
    return (el.scrollWidth > el.clientWidth) && canScroll(el, 'scrollLeft') && ('hidden' !== getComputedStyle(el).overflowX);
}

function isScrollableY(el) {
    return (el.scrollHeight > el.clientHeight) && canScroll(el, 'scrollTop') && ('hidden' !== getComputedStyle(el).overflowY);
}

function isScrollable(el) {
    return isScrollableX(el) || isScrollableY(el);
}

class DOMProxy {
  /** @param {Object} el */
  constructor(el) {
    this.el = el;
    this.zIndex = 0;
    this.parentElement = null;
    this.classList = {
      add: noop,
      remove: noop,
    }
  }

  get x() { return this.el.x || 0 };
  set x(v) { this.el.x = v };

  get y() { return this.el.y || 0 };
  set y(v) { this.el.y = v };

  get width() { return this.el.width || 0 };
  set width(v) { this.el.width = v };

  get height() { return this.el.height || 0 };
  set height(v) { this.el.height = v };

  getBoundingClientRect() {
    return {
      top: this.y,
      right: this.x,
      bottom: this.y + this.height,
      left: this.x + this.width,
    }
  }
}

class Transforms {
  /**
   * @param {DOMTarget|DOMProxy} $el
   */
  constructor($el) {
    this.$el = $el;
    this.inlineTransforms = [];
    this.point = new DOMPoint();
    this.inversedMatrix = this.getMatrix().inverse();
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {DOMPoint}
   */
  normalizePoint(x, y) {
    this.point.x = x;
    this.point.y = y;
    return this.point.matrixTransform(this.inversedMatrix);
  }

  /**
   * @callback TraverseParentsCallback
   * @param {DOMTarget} $el
   * @param {Number} i
   */

  /**
   * @param {TraverseParentsCallback} cb
   */
  traverseUp(cb) {
    let $el = /** @type {DOMTarget|Document} */(this.$el.parentElement), i = 0;
    while ($el && $el !== doc) {
      cb(/** @type {DOMTarget} */($el), i);
      $el = /** @type {DOMTarget} */($el.parentElement);
      i++;
    }
  }

  getMatrix() {
    const matrix = new DOMMatrix();
    this.traverseUp($el => {
      const elMatrix = new DOMMatrix(/** @type {String} */(getTargetValue($el, 'transform')));
      matrix.preMultiplySelf(elMatrix);
    });
    return matrix;
  }

  remove() {
    this.traverseUp(($el, i) => {
      this.inlineTransforms[i] = $el.style.transform;
      $el.style.transform = 'none';
    });
  }

  revert() {
    this.traverseUp(($el, i) => {
      const ct = this.inlineTransforms[i];
      if (ct === '') {
        $el.style.removeProperty('transform');
      } else {
        $el.style.transform = ct;
      }
    });
  }
}

/**
 * @template {Array<Number>|DOMTargetSelector|String|Number|Boolean|Function} T
 * @param {T | ((draggable: Draggable) => T)} value
 * @param {Draggable} draggable
 * @return {T}
 */
const parseDraggableFunctionParameter = (value, draggable) => value && isFnc(value) ? /** @type {Function} */(value)(draggable) : value;

let zIndex = 0;

/**
 * @callback DraggableCallback
 * @param {Draggable} self
 * @return any
 */

/**
 * @typedef {Object} DraggableAxisParam
 * @property {String} [mapTo]
 * @property {TweenModifier} [modifier]
 * @property {TweenComposition} [composition]
 * @property {Number|Array<Number>|((draggable: Draggable) => Number|Array<Number>)} [snap]
 */

/**
 * @typedef {Object} DraggableParams
 * @property {DOMTargetSelector} [trigger]
 * @property {DOMTargetSelector|Array<Number>|((draggable: Draggable) => DOMTargetSelector|Array<Number>)} [container]
 * @property {Boolean|DraggableAxisParam} [x]
 * @property {Boolean|DraggableAxisParam} [y]
 * @property {TweenModifier} [modifier]
 * @property {Number|Array<Number>|((draggable: Draggable) => Number|Array<Number>)} [snap]
 * @property {Number|Array<Number>|((draggable: Draggable) => Number|Array<Number>)} [containerPadding]
 * @property {Number|((draggable: Draggable) => Number)} [containerFriction]
 * @property {Number|((draggable: Draggable) => Number)} [dragSpeed]
 * @property {Number|((draggable: Draggable) => Number)} [scrollSpeed]
 * @property {Number|((draggable: Draggable) => Number)} [scrollThreshold]
 * @property {Number|((draggable: Draggable) => Number)} [minVelocity]
 * @property {Number|((draggable: Draggable) => Number)} [maxVelocity]
 * @property {Number|((draggable: Draggable) => Number)} [velocityMultiplier]
 * @property {Number} [releaseMass]
 * @property {Number} [releaseStiffness]
 * @property {Number} [releaseDamping]
 * @property {EasingParam} [releaseEase]
 * @property {DraggableCallback} [onGrab]
 * @property {DraggableCallback} [onDrag]
 * @property {DraggableCallback} [onRelease]
 * @property {DraggableCallback} [onUpdate]
 * @property {DraggableCallback} [onSettle]
 * @property {DraggableCallback} [onSnap]
 */

export class Draggable {
  /**
   * @param {TargetsParam} target
   * @param {DraggableParams} [parameters]
   */
  constructor(target, parameters = {}) {
    if (!target) return;
    if (globals.scope) globals.scope.revertibles.push(this);
    const paramX = parameters.x;
    const paramY = parameters.y;
    const trigger = parameters.trigger;
    const modifier = parameters.modifier;
    const ease = parameters.releaseEase;
    const customEase = ease && parseEasings(ease);
    const hasSpring = !isUnd(ease) && !isUnd(/** @type {Spring} */(ease).ease);
    const xProp = /** @type {String} */(isObj(paramX) && !isUnd(/** @type {Object} */(paramX).mapTo) ? /** @type {Object} */(paramX).mapTo : 'x');
    const yProp = /** @type {String} */(isObj(paramY) && !isUnd(/** @type {Object} */(paramY).mapTo) ? /** @type {Object} */(paramY).mapTo : 'y');
    const container = parseDraggableFunctionParameter(parameters.container, this);
    this.containerArray = isArr(container) ? container : null;
    this.$container = /** @type {HTMLElement} */(container && !this.containerArray ? parseTargets(/** @type {DOMTarget} */(container))[0] : doc.body);
    this.useWin = this.$container === doc.body;
    /** @type {Window | HTMLElement} */
    this.$scrollContainer = this.useWin ? win : this.$container;
    this.$target = /** @type {HTMLElement} */(isObj(target) ? new DOMProxy(target) : parseTargets(target)[0]);
    this.$trigger = /** @type {HTMLElement} */(parseTargets(trigger ? trigger : target)[0]);
    this.fixed = getTargetValue(this.$target, 'position') === 'fixed';
    // Refreshable parameters
    this.isFinePointer = true;
    /** @type {[Number, Number, Number, Number]} */
    this.containerPadding = [0, 0, 0, 0];
    /** @type {Number} */
    this.containerFriction = 0;
    /** @type {Number|Array<Number>} */
    this.snapX = 0;
    /** @type {Number|Array<Number>} */
    this.snapY = 0;
    /** @type {Number} */
    this.scrollSpeed = 0;
    /** @type {Number} */
    this.scrollThreshold = 0;
    /** @type {Number} */
    this.dragSpeed = 0;
    /** @type {Number} */
    this.maxVelocity = 0;
    /** @type {Number} */
    this.minVelocity = 0;
    /** @type {Number} */
    this.velocityMultiplier = 0;
    this.releaseSpring = hasSpring ? /** @type {Spring} */(ease) : createSpring({
      mass: setValue(parameters.releaseMass, 1),
      stiffness: setValue(parameters.releaseStiffness, 80),
      damping: setValue(parameters.releaseDamping, 20),
    });
    this.releaseEase = hasSpring ? this.releaseSpring.ease : customEase || eases.outQuint;
    this.hasReleaseSpring = hasSpring;
    this.onGrab = parameters.onGrab || noop;
    this.onDrag = parameters.onDrag || noop;
    this.onRelease = parameters.onRelease || noop;
    this.onUpdate = parameters.onUpdate || noop;
    this.onSettle = parameters.onSettle || noop;
    this.onSnap = parameters.onSnap || noop;
    this.disabled = [0, 0];
    /** @type {AnimatableParams} */
    const animatableParams = {};
    if (modifier) animatableParams.modifier = modifier;
    if (isUnd(paramX) || paramX === true) {
      animatableParams[xProp] = 0;
    } else if (isObj(paramX)) {
      const paramXObject = /** @type {DraggableAxisParam} */(paramX);
      const animatableXParams = {};
      if (paramXObject.modifier) animatableXParams.modifier = paramXObject.modifier;
      if (paramXObject.composition) animatableXParams.composition = paramXObject.composition;
      animatableParams[xProp] = animatableXParams;
    } else if (paramX === false) {
      animatableParams[xProp] = 0;
      this.disabled[0] = 1;
    }
    if (isUnd(paramY) || paramY === true) {
      animatableParams[yProp] = 0;
    } else if (isObj(paramY)) {
      const paramYObject = /** @type {DraggableAxisParam} */(paramY);
      const animatableYParams = {};
      if (paramYObject.modifier) animatableYParams.modifier = paramYObject.modifier;
      if (paramYObject.composition) animatableYParams.composition = paramYObject.composition;
      animatableParams[yProp] = animatableYParams;
    } else if (paramY === false) {
      animatableParams[yProp] = 0;
      this.disabled[1] = 1;
    }
    /** @type {AnimatableObject} */
    this.animate = /** @type {AnimatableObject} */(new Animatable(this.$target, animatableParams));
    // Internal props
    this.xProp = xProp;
    this.yProp = yProp;
    this.destX = 0;
    this.destY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    /** @type {[Number, Number]} */
    this.progresses = [0, 0]; // x, y
    this.scroll = {x: 0, y: 0};
    /** @type {[Number, Number, Number, Number]} */
    this.coords = [this.x, this.y, 0, 0]; // x, y, temp x, temp y
    /** @type {[Number, Number]} */
    this.snapped = [0, 0]; // x, y
    /** @type {[Number, Number, Number, Number]} */
    this.pointer = [0, 0, 0, 0]; // x, y, temp x, temp y
    /** @type {[Number, Number]} */
    this.scrollView = [0, 0]; // w, h
    /** @type {[Number, Number, Number, Number]} */
    this.dragArea = [0, 0, 0, 0]; // x, y, w, h
    /** @type {[Number, Number, Number, Number]} */
    this.containerBounds = [-maxValue, maxValue, maxValue, -maxValue]; // t, r, b, l
    /** @type {[Number, Number, Number, Number]} */
    this.scrollBounds = [0, 0, 0, 0]; // t, r, b, l
    /** @type {[Number, Number, Number, Number]} */
    this.targetBounds = [0, 0, 0, 0]; // t, r, b, l
    /** @type {[Number, Number]} */
    this.window = [0, 0]; // w, h
    this.pointerVelocity = 0;
    this.pointerAngle = 0;
    this.velocity = 0;
    this.angle = 0;
    /** @type {Animation} */
    this.triggerStyles = null;
    /** @type {Animation} */
    this.bodyStyles = null;
    /** @type {Animation} */
    this.targetStyles = null;
    this.transforms = new Transforms(this.$target);
    this.overshootCoords = { x: 0, y: 0 };
    this.overshootTicker = new Timer({ autoplay: false }, null, 0).init();
    this.updateTicker = new Timer({ autoplay: false }, null, 0).init();
    this.overshootTicker.onUpdate = () => {
      this.updated = true;
      this.manual = true;
      if (!this.disabled[0]) this.animate[this.xProp](this.overshootCoords.x, 0);
      if (!this.disabled[1]) this.animate[this.yProp](this.overshootCoords.y, 0);
    }
    this.overshootTicker.onComplete = () => {
      this.manual = false;
      if (!this.disabled[0]) this.animate[this.xProp](this.overshootCoords.x, 0);
      if (!this.disabled[1]) this.animate[this.yProp](this.overshootCoords.y, 0);
    }
    this.updateTicker.onUpdate = self => this.update(self);
    this.contained = !isUnd(container);
    this.manual = false;
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.enabled = false;
    this.initialized = false;
    this.activeProp = this.disabled[0] ? yProp : xProp;
    this.animate.animations[this.activeProp].onRender = () => {
      const hasUpdated = this.updated;
      const hasMoved = this.grabbed && hasUpdated;
      const hasReleased = !hasMoved && this.released;
      if (hasMoved || hasReleased) {
        const x = this.x;
        const y = this.y;
        const dx = x - this.coords[2];
        const dy = y - this.coords[3];
        const dt = this.updateTicker.deltaTime;
        this.deltaX = dx;
        this.deltaY = dy;
        this.coords[2] = x;
        this.coords[3] = y;
        this.progresses[0] = mapRange(x, this.containerBounds[3], this.containerBounds[1], 0, 1);
        this.progresses[1] = mapRange(y, this.containerBounds[0], this.containerBounds[2], 0, 1);
        this.velocity = round(clamp((dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0) * this.velocityMultiplier, this.minVelocity, this.maxVelocity), 5);
        this.angle = Math.atan2(dy, dx);
      } else {
        // Make sure delta are properly reset outside of manual move
        this.deltaX = 0;
        this.deltaY = 0;
        this.velocity = 0;
      }
      if (hasUpdated) {
        this.onUpdate(this);
        this.updated = false;
      }
      if (hasMoved) {
        this.onDrag(this);
      }
      if (hasReleased) {
        this.onUpdate(this);
      }
    }
    this.animate.animations[this.activeProp].onComplete = () => {
      // if ((!this.grabbed && this.released)) {
      //   // Set eleased to false before calling onSettle to avoid recursion
      //   this.released = false;
      // }
      if (!this.manual) {
        this.deltaX = 0;
        this.deltaY = 0;
        this.velocity = 0;
        this.onSettle(this);
      }
    };
    this.resizeTicker = new Timer({
      autoplay: false,
      duration: 50 * globals.timeScale,
      onComplete: () => { this.refresh(); },
    }).init();
    this.parameters = parameters;
    this.resizeObserver = new ResizeObserver(() => {
      if (this.initialized) {
        this.resizeTicker.restart();
      } else {
        this.initialized = true;
      }
    });
    this.enable();
    this.refresh();
    this.resizeObserver.observe(this.$container);
    if (!isObj(target)) this.resizeObserver.observe(this.$target);
  }

  get x() {
    return round(/** @type {Number} */(this.animate[this.xProp]()), globals.precision);
  }

  set x(x) {
    if (this.disabled[0]) return;
    const v = round(x, 5);
    this.manual = true;
    this.destX = v;
    this.snapped[0] = snap(v, this.snapX);
    this.animate[this.xProp](v, 0);
    this.manual = false;
  }

  get y() {
    return round(/** @type {Number} */(this.animate[this.yProp]()), globals.precision);
  }

  set y(y) {
    if (this.disabled[1]) return;
    const v = round(y, 5);
    this.manual = true;
    this.destY = v;
    this.snapped[1] = snap(v, this.snapY);
    this.animate[this.yProp](v, 0);
    this.manual = false;
  }

  get progressX() {
    return this.progresses[0];
  }

  set progressX(x) {
    this.updated = true;
    this.progresses[0] = x;
    this.x = mapRange(x, 0, 1, this.containerBounds[3], this.containerBounds[1]);
  }

  get progressY() {
    return this.progresses[1];
  }

  set progressY(y) {
    this.updated = true;
    this.progresses[1] = y;
    this.y = mapRange(y, 0, 1, this.containerBounds[0], this.containerBounds[2]);
  }

  refresh() {
    const params = this.parameters;
    const paramX = params.x;
    const paramY = params.y;
    const container = parseDraggableFunctionParameter(params.container, this);
    const cp = parseDraggableFunctionParameter(params.containerPadding, this) || 0;
    const containerPadding = /** @type {[Number, Number, Number, Number]} */(isArr(cp) ? cp : [cp, cp, cp, cp]);
    const cx = this.x;
    const cy = this.y;
    const px = this.progressX;
    const py = this.progressY;
    this.containerArray = isArr(container) ? container : null;
    this.$container = /** @type {HTMLElement} */(container && !this.containerArray ? parseTargets(/** @type {DOMTarget} */(container))[0] : doc.body);
    this.useWin = this.$container === doc.body;
    /** @type {Window | HTMLElement} */
    this.$scrollContainer = this.useWin ? win : this.$container;
    this.isFinePointer = matchMedia('(pointer:fine)').matches;
    this.containerPadding = setValue(containerPadding, [0, 0, 0, 0]);
    this.containerFriction = clamp(0, setValue(parseDraggableFunctionParameter(params.containerFriction, this), .8), 1);
    this.snapX = parseDraggableFunctionParameter(isObj(paramX) && !isUnd(paramX.snap) ? paramX.snap : params.snap, this);
    this.snapY = parseDraggableFunctionParameter(isObj(paramY) && !isUnd(paramY.snap) ? paramY.snap : params.snap, this);
    this.scrollSpeed = setValue(parseDraggableFunctionParameter(params.scrollSpeed, this), 1.5);
    this.scrollThreshold = setValue(parseDraggableFunctionParameter(params.scrollThreshold, this), 20);
    this.dragSpeed = setValue(parseDraggableFunctionParameter(params.dragSpeed, this), 1);
    this.minVelocity = setValue(parseDraggableFunctionParameter(params.minVelocity, this), 0);
    this.maxVelocity = setValue(parseDraggableFunctionParameter(params.maxVelocity, this), 20);
    this.velocityMultiplier = setValue(parseDraggableFunctionParameter(params.velocityMultiplier, this), 1);
    this.updateBoundingValues();

    // const ob = this.isOutOfBounds(this.containerBounds, this.x, this.y);
    // if (ob === 1 || ob === 3) this.progressX = px;
    // if (ob === 2 || ob === 3) this.progressY = py;

    const [ bt, br, bb, bl ] = this.containerBounds;
    const ob = this.isOutOfBounds(this.containerBounds, cx, cy);
    if (ob === 1 || ob === 3) this.x = clamp(cx, bl, br);
    if (ob === 2 || ob === 3) this.y = clamp(cy, bt, bb);

    // if (this.initialized && this.contained) {
    //   if (this.progressX !== px) this.progressX = px;
    //   if (this.progressY !== py) this.progressY = py;
    // }
  }

  updateScrollCoords() {
    const sx = round(this.useWin ? win.scrollX : this.$container.scrollLeft, 0);
    const sy = round(this.useWin ? win.scrollY : this.$container.scrollTop, 0);
    const [ cpt, cpr, cpb, cpl ] = this.containerPadding;
    const threshold = this.scrollThreshold;
    this.scroll.x = sx;
    this.scroll.y = sy;
    this.scrollBounds[0] = sy - this.targetBounds[0] + cpt - threshold;
    this.scrollBounds[1] = sx - this.targetBounds[1] - cpr + threshold;
    this.scrollBounds[2] = sy - this.targetBounds[2] - cpb + threshold;
    this.scrollBounds[3] = sx - this.targetBounds[3] + cpl - threshold;
  }

  updateBoundingValues() {
    // Store the current position and set it to x: 0, y: 0
    // to prevent interfering with the scroll area in cases the target is outside of the container
    const cx = this.x;
    const cy = this.y;
    this.x = 0;
    this.y = 0;
    this.transforms.remove();
    const iw = this.window[0] = win.innerWidth;
    const ih = this.window[1] = win.innerHeight;
    const uw = this.useWin;
    const sw = this.$container.scrollWidth;
    const sh = this.$container.scrollHeight;
    const fx = this.fixed;
    const transformContainerRect = this.$container.getBoundingClientRect();
    const [ cpt, cpr, cpb, cpl ] = this.containerPadding;
    this.dragArea[0] = uw ? 0 : transformContainerRect.left;
    this.dragArea[1] = uw ? 0 : transformContainerRect.top;
    this.scrollView[0] = uw ? clamp(sw, iw, sw) : sw;
    this.scrollView[1] = uw ? clamp(sh, ih, sh) : sh;
    this.updateScrollCoords();
    const { width, height, left, top, right, bottom } = this.$container.getBoundingClientRect();
    this.dragArea[2] = round(uw ? clamp(width, iw, iw) : width, 0);
    this.dragArea[3] = round(uw ? clamp(height, ih, ih) : height, 0);
    this.canScroll = fx ? false :
      (sw > this.dragArea[2] + cpl - cpr || sh > this.dragArea[3] + cpt - cpb) &&
      (!this.containerArray || (this.containerArray && !isArr(this.containerArray))) &&
      this.contained;
    if (this.contained) {
      const sx = this.scroll.x;
      const sy = this.scroll.y;
      const canScroll = this.canScroll;
      const targetRect = this.$target.getBoundingClientRect();
      const hiddenLeft = canScroll ? uw ? 0 : this.$container.scrollLeft : 0;
      const hiddenTop = canScroll ? uw ? 0 : this.$container.scrollTop : 0;
      const hiddenRight = canScroll ? this.scrollView[0] - hiddenLeft - width : 0;
      const hiddenBottom = canScroll ? this.scrollView[1] - hiddenTop - height : 0;
      this.targetBounds[0] = round((targetRect.top + sy) - (uw ? 0 : top), 0);
      this.targetBounds[1] = round((targetRect.right + sx) - (uw ? iw : right), 0);
      this.targetBounds[2] = round((targetRect.bottom + sy) - (uw ? ih : bottom), 0);
      this.targetBounds[3] = round((targetRect.left + sx) - (uw ? 0 : left), 0);
      if (this.containerArray) {
        this.containerBounds[0] = this.containerArray[0] + cpt;
        this.containerBounds[1] = this.containerArray[1] - cpr;
        this.containerBounds[2] = this.containerArray[2] - cpb;
        this.containerBounds[3] = this.containerArray[3] + cpl;
      } else {
        this.containerBounds[0] = -round(targetRect.top - (fx ? clamp(top, 0, ih) : top) + hiddenTop - cpt, 0);
        this.containerBounds[1] = -round(targetRect.right - (fx ? clamp(right, 0, iw) : right) - hiddenRight + cpr, 0);
        this.containerBounds[2] = -round(targetRect.bottom - (fx ? clamp(bottom, 0, ih) : bottom) - hiddenBottom + cpb, 0);
        this.containerBounds[3] = -round(targetRect.left - (fx ? clamp(left, 0, iw) : left) + hiddenLeft - cpl, 0);
      }
      // this.progresses[0] = mapRange(cx, this.containerBounds[3], this.containerBounds[1], 0, 1) || 0;
      // this.progresses[1] = mapRange(cy, this.containerBounds[0], this.containerBounds[2], 0, 1) || 0;
    }
    this.transforms.revert();
    this.x = cx;
    this.y = cy;
  }

  /**
   * Returns 0 if not OB, 1 if x is OB, 2 if y is OB, 3 if both x and y are OB
   *
   * @param  {Array} bounds
   * @param  {Number} x
   * @param  {Number} y
   * @return {Number}
   */
  isOutOfBounds(bounds, x, y) {
    if (!this.contained) return 0;
    const [ bt, br, bb, bl ] = bounds;
    const [ dx, dy ] = this.disabled;
    const obx = !dx && x < bl || !dx && x > br;
    const oby = !dy && y < bt || !dy && y > bb;
    return obx && !oby ? 1 : !obx && oby ? 2 : obx && oby ? 3 : 0;
  }

  /**
   * @param {Timer} timer
   */
  update(timer) {
    this.updateScrollCoords();
    const [nx, ny] = this.disabled;
    if (this.canScroll) {
      const [ cpt, cpr, cpb, cpl ] = this.containerPadding;
      const [ sw, sh ] = this.scrollView;
      const daw = this.dragArea[2];
      const dah = this.dragArea[3];
      const csx = this.scroll.x;
      const csy = this.scroll.y;
      const nsw = this.$container.scrollWidth;
      const nsh = this.$container.scrollHeight;
      const csw = this.useWin ? clamp(nsw, this.window[0], nsw) : nsw;
      const csh = this.useWin ? clamp(nsh, this.window[1], nsh) : nsh;
      const swd = sw - csw;
      const shd = sh - csh;
      // Handle cases where the scrollarea dimensions changes during drag
      if (this.dragged && swd > 0) {
        this.coords[0] -= swd;
        this.scrollView[0] = csw;
      }
      if (this.dragged && shd > 0) {
        this.coords[1] -= shd;
        this.scrollView[1] = csh;
      }
      // Handle autoscroll when target is at the edges of the scroll bounds
      const s = this.scrollSpeed * 10;
      const threshold = this.scrollThreshold;
      const [ x, y ] = this.coords;
      const [ st, sr, sb, sl ] = this.scrollBounds;
      const t = round(clamp((y - st + cpt) / threshold, -1, 0) * s, 0);
      const r = round(clamp((x - sr - cpr) / threshold, 0, 1) * s, 0);
      const b = round(clamp((y - sb - cpb) / threshold, 0, 1) * s, 0);
      const l = round(clamp((x - sl + cpl) / threshold, -1, 0) * s, 0);
      if (t || b || l || r) {
        let scrollX = csx;
        let scrollY = csy;
        if (!nx) {
          scrollX = round(clamp(csx + (l || r), 0, sw - daw), 0);
          this.coords[0] -= csx - scrollX;
        }
        if (!ny) {
          scrollY = round(clamp(csy + (t || b), 0, sh - dah), 0);
          this.coords[1] -= csy - scrollY;
        }
        this.$scrollContainer.scrollTo(scrollX, scrollY);
      }
    }
    const [ px, py, px2, py2 ] = this.pointer;
    const dx = px - px2;
    const dy = py - py2;
    const dt = timer.deltaTime;
    const previousVelocity = this.pointerVelocity;
    let v = round(clamp((dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0) * this.velocityMultiplier, this.minVelocity, this.maxVelocity), 5);
    if (v === 0 && previousVelocity > 3) {
      v = previousVelocity;
    } else {
      this.pointerVelocity = v;
      this.pointerAngle = Math.atan2(dy, dx);
      this.coords[0] += dx * this.dragSpeed;
      this.coords[1] += dy * this.dragSpeed;
      this.pointer[2] = px;
      this.pointer[3] = py;
    }
    const [ cx, cy ] = this.coords;
    const [ sx, sy ] = this.snapped;
    const [ ct, cr, cb, cl ] = this.containerBounds;
    const cf = (1 - this.containerFriction) * this.dragSpeed;
    this.x = cx > cr ? cr + (cx - cr) * cf : cx < cl ? cl + (cx - cl) * cf : cx;
    this.y = cy > cb ? cb + (cy - cb) * cf : cy < ct ? ct + (cy - ct) * cf : cy;
    const [ nsx, nsy ] = this.snapped;
    if (nsx !== sx && this.snapX || nsy !== sy && this.snapY) {
      this.onSnap(this);
    }
  }

  /**
   * @param {Number} gap
   * @param {Number} [duration]
   * @param {EasingParam} [ease]
   * @return {void}
   */
  scrollInView(gap, duration, ease = eases.inOutQuad) {
    this.updateScrollCoords();
    const x = this.destX;
    const y = this.destY;
    const scroll = this.scroll;
    const scrollBounds = this.scrollBounds;
    const canScroll = this.canScroll;
    if (!this.containerArray && this.isOutOfBounds(scrollBounds, x, y)) {
      const [ st, sr, sb, sl ] = scrollBounds;
      const t = round(clamp(y - st, -maxValue, 0), 0);
      const r = round(clamp(x - sr, 0, maxValue), 0);
      const b = round(clamp(y - sb, 0, maxValue), 0);
      const l = round(clamp(x - sl, -maxValue, 0), 0);
      new Animation(scroll, {
        x: round(scroll.x + (l ? l - gap : r ? r + gap : 0), 0),
        y: round(scroll.y + (t ? t - gap : b ? b + gap : 0), 0),
        duration: isUnd(duration) ? 100 * globals.timeScale : duration,
        ease,
        onUpdate: () => {
          this.canScroll = false;
          this.$scrollContainer.scrollTo(scroll.x, scroll.y);
        }
      }).init().then(() => {
        this.canScroll = canScroll;
      })
    }
  }

  handleHover() {
    if (this.isFinePointer && !this.triggerStyles) {
      this.triggerStyles = setTargetValues(this.$trigger, { cursor: 'grab' });
    }
  }

  /**
   * @param  {Number} duration
   * @param  {EasingParam} ease
   * @return {this}
   */
  animateInView(duration, ease = eases.out(5)) {
    this.updateBoundingValues();
    const x = this.x;
    const y = this.y;
    const [ cpt, cpr, cpb, cpl ] = this.containerPadding;
    const bt = this.scroll.y - this.targetBounds[0] + cpt;
    const br = this.scroll.x - this.targetBounds[1] - cpr;
    const bb = this.scroll.y - this.targetBounds[2] - cpb;
    const bl = this.scroll.x - this.targetBounds[3] + cpl;
    if (this.isOutOfBounds([bt, br, bb, bl], x, y)) {
      const [ disabledX, disabledY ] = this.disabled;
      const destX = clamp(snap(x, this.snapX), bl, br);
      const destY = clamp(snap(y, this.snapY), bt, bb);
      const dur = isUnd(duration) ? 350 * globals.timeScale : duration;
      if (!disabledX) this.animate[this.xProp](destX, dur, ease);
      if (!disabledY) this.animate[this.yProp](destY, dur, ease);
    }
    return this;
  }

  /**
   * @param {PointerEvent} e
   */
  handleDown(e) {
    const $eTarget = /** @type {HTMLElement} */(e.target);
    if (
      this.grabbed || /** @type {HTMLInputElement}  */($eTarget).type === 'range'
      || ($eTarget[draggableSymbol] && $eTarget !== this.$trigger)
    ) return;
    this.grabbed = true;
    this.released = false;
    this.overshootTicker.pause(); // Pauses the overshoot ticker from updating
    remove(this, null, 'x');
    remove(this, null, 'y');
    remove(this, null, 'progressX');
    remove(this, null, 'progressY');
    remove(this.scroll); // Removes any active animations on the container scroll
    remove(this.overshootCoords); // Removes active overshoot animations
    this.updateBoundingValues();
    const [ ct, cr, cb, cl ] = this.containerBounds;
    const { x, y } = this.transforms.normalizePoint(e.clientX, e.clientY);
    const cf = (1 - this.containerFriction) * this.dragSpeed;
    const cx = this.x;
    const cy = this.y;
    this.coords[0] = this.coords[2] = !cf ? cx : cx > cr ? cr + (cx - cr) / cf : cx < cl ? cl + (cx - cl) / cf : cx;
    this.coords[1] = this.coords[3] = !cf ? cy : cy > cb ? cb + (cy - cb) / cf : cy < ct ? ct + (cy - ct) / cf : cy;
    this.pointer[2] = x;
    this.pointer[3] = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.pointerVelocity = 0;
    this.pointerAngle = 0;
    if (this.targetStyles) {
      this.targetStyles.revert();
      this.targetStyles = null;
    }
    const z = /** @type {Number} */(getTargetValue(this.$target, 'zIndex', false));
    zIndex = (z > zIndex ? z : zIndex) + 1;
    this.targetStyles = setTargetValues(this.$target, { zIndex });
    if (this.isFinePointer) {
      if (this.triggerStyles) {
        this.triggerStyles.revert();
        this.targetStyles = null;
      }
      this.bodyStyles = setTargetValues(doc.body, { cursor: 'grabbing' });
    }
    this.scrollInView(0);
    this.onGrab(this);
    doc.addEventListener('pointermove', this, false);
    doc.addEventListener('pointerup', this, false);
    doc.addEventListener('pointercancel', this, false);
    win.addEventListener('selectstart', this, false);
  }

  /**
   * @param {PointerEvent} e
   */
  handleMove(e) {
    const { x, y } = this.transforms.normalizePoint(e.clientX, e.clientY);

    this.pointer[0] = x;
    this.pointer[1] = y;

    const [ px, py, px2, py2 ] = this.pointer;
    const dx = px - px2;
    const dy = py - py2;

    let $scrollableY;

    // if (!this.dragged) {
    //   const $eTarget = /** @type {HTMLElement} */(e.target);
    //   let $parent = $eTarget;
    //   if (!this.isFinePointer) {
    //     while ($parent && $parent !== this.$container) {
    //       if (isScrollableY($parent)) {
    //         const scrollTop = Math.ceil($parent.scrollTop);
    //         const maxScroll = $parent.scrollHeight - $parent.offsetHeight;
    //         if (scrollTop === 0 && dy < 0 || scrollTop === maxScroll && dy > 0) {
    //           $scrollableY = $parent;
    //         }
    //         break;
    //       }
    //       $parent = $parent.parentElement;
    //     }
    //   }
    // }

    if (!this.grabbed || $scrollableY) return;

    e.preventDefault();

    if (!this.triggerStyles) {
      this.triggerStyles = setTargetValues(this.$trigger, { pointerEvents: 'none' });
    }

    this.updateTicker.play();

    this.dragged = true;
    this.updated = true;
    this.released = false;
  }

  handleUp() {
    if (!this.grabbed) return;

    this.updateTicker.pause();

    if (this.triggerStyles) {
      this.triggerStyles.revert();
      this.triggerStyles = null;
    }

    if (this.isFinePointer && this.bodyStyles) {
      this.bodyStyles.revert();
      this.bodyStyles = null;
    }

    const [ disabledX, disabledY ] = this.disabled;
    const [ ct, cr, cb, cl ] = this.containerBounds;
    const [ sx, sy ] = this.snapped;
    const spring = this.releaseSpring;
    const releaseEase = this.releaseEase;
    const hasReleaseSpring = this.hasReleaseSpring;
    const overshootCoords = this.overshootCoords;
    const cx = this.x;
    const cy = this.y;
    const pv = this.pointerVelocity * globals.timeScale; // Velocity needs to be adjusted to be properly calculated when using seconds as timeUnit
    const ds = pv * 200;
    const cf = (1 - this.containerFriction) * this.dragSpeed;
    const nx = cx + (Math.cos(this.pointerAngle) * ds);
    const ny = cy + (Math.sin(this.pointerAngle) * ds);
    const bx = nx > cr ? cr + (nx - cr) * cf : nx < cl ? cl + (nx - cl) * cf : nx;
    const by = ny > cb ? cb + (ny - cb) * cf : ny < ct ? ct + (ny - ct) * cf : ny;
    const dx = this.destX = clamp(snap(bx, this.snapX), cl, cr);
    const dy = this.destY = clamp(snap(by, this.snapY), ct, cb);
    const ob = this.isOutOfBounds(this.containerBounds, nx, ny);

    spring.velocity = round(pv, 5);
    overshootCoords.x = cx;
    overshootCoords.y = cy;

    const { mass, stiffness, damping, duration, restDuration } = spring;
    const releaseDuration = cx === dx && cy === dy ? 0 : hasReleaseSpring ? duration : duration - restDuration;

    if (ob && cf && duration) {

      // Out of bounds overshoot animation

      const composition = compositionTypes.blend;

      // Note: Investigate duration based on distance travelled instead of spring for non spring easing.
      // Math.abs((cx - bx) * 10)
      // Math.abs((cy - by) * 10)

      new Animation(overshootCoords, {
        x: bx,
        y: by,
        composition,
        duration: hasReleaseSpring ? releaseDuration : releaseDuration * .65,
        ease: releaseEase,
      }).init();

      new Animation(overshootCoords, {
        x: dx,
        y: dy,
        composition,
        duration: releaseDuration,
        ease: hasReleaseSpring ? createSpring({ mass, stiffness, damping, velocity: 0 }) : releaseEase,
      }).init();

      this.overshootTicker.stretch(releaseDuration).restart();

    } else {

      // In bounds animation

      if (!disabledX) this.animate[this.xProp](dx, releaseDuration, releaseEase);
      if (!disabledY) this.animate[this.yProp](dy, releaseDuration, releaseEase);

    }

    this.scrollInView(this.scrollThreshold, releaseDuration, releaseEase);
    this.onRelease(this);

    let hasSnapped = false;

    if (dx !== sx) {
      this.snapped[0] = dx;
      if (this.snapX) hasSnapped = true;
    }

    if (dy !== sy && this.snapY) {
      this.snapped[1] = dy;
      if (this.snapY) hasSnapped = true;
    }

    if (hasSnapped) this.onSnap(this);

    this.grabbed = false;
    this.dragged = false;
    this.released = true;

    doc.removeEventListener('pointermove', this);
    doc.removeEventListener('pointerup', this);
    doc.removeEventListener('pointercancel', this);
    win.removeEventListener('selectstart', this);
  }

  reset() {
    remove(this.scroll);
    remove(this.overshootCoords);
    this.overshootTicker.pause();
    this.updateTicker.pause();
    this.resizeTicker.pause();
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.x = 0;
    this.y = 0;
    this.coords[0] = 0;
    this.coords[1] = 0;
    this.pointer[0] = 0;
    this.pointer[1] = 0;
    this.pointer[2] = 0;
    this.pointer[3] = 0;
    this.pointerVelocity = 0;
    this.pointerAngle = 0;
    return this;
  }

  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.$target[draggableSymbol] = true;
      this.$target.classList.remove('is-disabled');
      this.touchActionStyles = setTargetValues(this.$trigger, {
        touchAction: this.disabled[0] ? 'pan-x' : this.disabled[1] ? 'pan-y' : 'none'
      });
      this.$trigger.addEventListener('pointerdown', this);
      this.$trigger.addEventListener('mouseenter', this);
    }
    return this;
  }

  disable() {
    this.enabled = false;
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.$target[draggableSymbol] = false;
    this.touchActionStyles.revert();
    if (this.triggerStyles) {
      this.triggerStyles.revert();
      this.triggerStyles = null;
    }
    if (this.bodyStyles) {
      this.bodyStyles.revert();
      this.bodyStyles = null;
    }
    if (this.targetStyles) {
      this.targetStyles.revert();
      this.targetStyles = null;
    }
    remove(this.scroll);
    remove(this.overshootCoords);
    this.overshootTicker.pause();
    this.updateTicker.pause();
    this.$target.classList.add('is-disabled');
    this.$trigger.removeEventListener('pointerdown', this);
    this.$trigger.removeEventListener('mouseenter', this);
    doc.removeEventListener('pointermove', this);
    doc.removeEventListener('pointerup', this);
    doc.removeEventListener('pointercancel', this);
    win.removeEventListener('selectstart', this);
    return this;
  }

  revert() {
    this.reset();
    this.disable();
    this.$target.classList.remove('is-disabled');
    this.updateTicker.revert();
    this.overshootTicker.revert();
    this.resizeTicker.revert();
    return this;
  }

  /**
   * @param {PointerEvent} e
   */
  handleEvent(e) {
    switch (e.type) {
      case 'pointerdown':
        this.handleDown(e);
        break;
      case 'pointermove':
        this.handleMove(e);
        break;
      case 'pointerup':
        this.handleUp();
        break;
      // case 'pointercancel':
      //   this.handleUp();
      //   break;
      case 'mouseenter':
        this.handleHover();
        break;
      case 'selectstart':
        e.preventDefault();
        break;
    }
  }
}

/**
 * @param {TargetsParam} target
 * @param {DraggableParams} [parameters]
 * @return {Draggable}
 */
export const createDraggable = (target, parameters) => new Draggable(target, parameters);
