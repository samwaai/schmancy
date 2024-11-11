/**
 * anime.js GUI - ESM
 * @version v4.0.0-beta.102.2
 * @author Julian Garnier
 * @license MIT
 * @copyright (c) 2024 Julian Garnier
 * @see https://animejs.com
 */

/** @typedef {Animation} $Animation */
/** @typedef {Animatable} $Animatable */
/** @typedef {$Animation|Timeline} Renderable */
/** @typedef {Timer|Renderable} Tickable */
/** @typedef {Tickable|$Animatable|Draggable|ScrollObserver|Scope} Revertible */

/**
 * @callback EasingFunction
 * @param {Number} time
 * @return {Number}
 */

/**
 * @typedef {('linear'|'linear(x1, x2 25%, x3)'|'in'|'out'|'inOut'|'outIn'|'inQuad'|'outQuad'|'inOutQuad'|'outInQuad'|'inCubic'|'outCubic'|'inOutCubic'|'outInCubic'|'inQuart'|'outQuart'|'inOutQuart'|'outInQuart'|'inQuint'|'outQuint'|'inOutQuint'|'outInQuint'|'inSine'|'outSine'|'inOutSine'|'outInSine'|'inCirc'|'outCirc'|'inOutCirc'|'outInCirc'|'inExpo'|'outExpo'|'inOutExpo'|'outInExpo'|'inBounce'|'outBounce'|'inOutBounce'|'outInBounce'|'inBack'|'outBack'|'inOutBack'|'outInBack'|'inElastic'|'outElastic'|'inOutElastic'|'outInElastic'|'irregular'|'cubicBezier'|'steps'|'in(p = 1.675)'|'out(p = 1.675)'|'inOut(p = 1.675)'|'outIn(p = 1.675)'|'inBack(overshoot = 1.70158)'|'outBack(overshoot = 1.70158)'|'inOutBack(overshoot = 1.70158)'|'outInBack(overshoot = 1.70158)'|'inElastic(amplitude = 1, period = .3)'|'outElastic(amplitude = 1, period = .3)'|'inOutElastic(amplitude = 1, period = .3)'|'outInElastic(amplitude = 1, period = .3)'|'irregular(length = 10, randomness = 1)'|'cubicBezier(x1, y1, x2, y2)'|'steps(steps = 10)')} EaseStringParamNames
 */

// A hack to get both ease names suggestions AND allow any strings
// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-460346421
/** @typedef {(String & {})|EaseStringParamNames|EasingFunction|Spring} EasingParam */

/** @typedef {HTMLElement|SVGElement} DOMTarget */
/** @typedef {Record<String, any>} JSTarget */
/** @typedef {DOMTarget|JSTarget} Target */
/** @typedef {Target|NodeList|String} TargetSelector */
/** @typedef {DOMTarget|NodeList|String} DOMTargetSelector */
/** @typedef {Array.<DOMTargetSelector>|DOMTargetSelector} DOMTargetsParam */
/** @typedef {Array.<DOMTarget>} DOMTargetsArray */
/** @typedef {Array.<JSTarget>|JSTarget} JSTargetsParam */
/** @typedef {Array.<JSTarget>} JSTargetsArray */
/** @typedef {Array.<TargetSelector>|TargetSelector} TargetsParam */
/** @typedef {Array.<Target>} TargetsArray */

/**
 * @callback FunctionValue
 * @param {Target} target - The animated target
 * @param {Number} index - The target index
 * @param {Number} length - The total number of animated targets
 * @return {Number|String|TweenObjectValue|Array.<Number|String|TweenObjectValue>}
 */

/**
 * @callback TweenModifier
 * @param {Number} value - The animated value
 * @return {Number|String}
 */

/** @typedef {[Number, Number, Number, Number]} ColorArray */

/**
 * @typedef {Object} Tween
 * @property {Number} id
 * @property {Animation} parent
 * @property {String} property
 * @property {Target} target
 * @property {String|Number} _value
 * @property {Function|null} _func
 * @property {EasingFunction} _ease
 * @property {Array.<Number>} _fromNumbers
 * @property {Array.<Number>} _toNumbers
 * @property {Array.<String>} _strings
 * @property {Number} _fromNumber
 * @property {Number} _toNumber
 * @property {Array.<Number>} _numbers
 * @property {Number} _number
 * @property {String} _unit
 * @property {TweenModifier} _modifier
 * @property {Number} _currentTime
 * @property {Number} _delay
 * @property {Number} _updateDuration
 * @property {Number} _startTime
 * @property {Number} _changeDuration
 * @property {Number} _absoluteStartTime
 * @property {tweenTypes} _tweenType
 * @property {valueTypes} _valueType
 * @property {Number} _composition
 * @property {Number} _isOverlapped
 * @property {Number} _isOverridden
 * @property {Number} _renderTransforms
 * @property {Tween} _prevRep
 * @property {Tween} _nextRep
 * @property {Tween} _prevAdd
 * @property {Tween} _nextAdd
 * @property {Tween} _prev
 * @property {Tween} _next
 */

/**
 * @typedef TweenDecomposedValue
 * @property {Number} t - Type
 * @property {Number} n - Single number value
 * @property {String} u - Value unit
 * @property {String} o - Value operator
 * @property {Array.<Number>} d - Array of Numbers (in case of complex value type)
 * @property {Array.<String>} s - Strings (in case of complex value type)
 */

/** @typedef {{_head: null|Tween, _tail: null|Tween}} TweenPropertySiblings */
/** @typedef {Record<String, TweenPropertySiblings>} TweenLookups */
/** @typedef {WeakMap.<Target, TweenLookups>} TweenReplaceLookups */
/** @typedef {Map.<Target, TweenLookups>} TweenAdditiveLookups */

/**
 * @typedef {Object} TimerOptions
 * @property {Number|String} [id]
 * @property {TweenParamValue} [duration]
 * @property {TweenParamValue} [delay]
 * @property {Number} [loopDelay]
 * @property {Boolean} [reversed]
 * @property {Boolean} [alternate]
 * @property {Boolean|Number} [loop]
 * @property {Boolean|ScrollObserver} [autoplay]
 * @property {Number} [frameRate]
 * @property {Number} [playbackRate]
 */

/**
 * @callback TimerCallback
 * @param {Timer} self - Returns itself
 * @return *
 */

/**
 * @typedef {Object} TimerCallbacks
 * @property {TimerCallback} [onComplete]
 * @property {TimerCallback} [onLoop]
 * @property {TimerCallback} [onBegin]
 * @property {TimerCallback} [onUpdate]
 */

/**
 * @typedef {TimerOptions & TimerCallbacks} TimerParams
 */

/**
 * @typedef {Number|String|FunctionValue} TweenParamValue
 */

/**
 * @typedef {TweenParamValue|[TweenParamValue, TweenParamValue]} TweenPropValue
 */

/**
 * @typedef {(String & {})|'none'|'replace'|'blend'|compositionTypes} TweenComposition
 */

/**
 * @typedef {Object} TweenParamsOptions
 * @property {TweenParamValue} [duration]
 * @property {TweenParamValue} [delay]
 * @property {EasingParam} [ease]
 * @property {TweenModifier} [modifier]
 * @property {TweenComposition} [composition]
 */

/**
 * @typedef {Object} TweenValues
 * @property {TweenParamValue} [from]
 * @property {TweenPropValue} [to]
 * @property {TweenPropValue} [fromTo]
 */

/**
 * @typedef {TweenParamsOptions & TweenValues} TweenKeyValue
 */

/**
 * @typedef {Array.<TweenKeyValue|TweenPropValue>} ArraySyntaxValue
 */

/**
 * @typedef {TweenParamValue|ArraySyntaxValue|TweenKeyValue} TweenOptions
 */

/**
 * @typedef {Partial<{to: TweenParamValue|Array.<TweenParamValue>; from: TweenParamValue|Array.<TweenParamValue>; fromTo: TweenParamValue|Array.<TweenParamValue>;}>} TweenObjectValue
 */

/**
 * @typedef {Object} PercentageKeyframeOptions
 * @property {EasingParam} [ease]
 */

/**
 * @typedef {Record<String, TweenParamValue>} PercentageKeyframeParams
 */

/**
 * @typedef {Record<String, PercentageKeyframeParams & PercentageKeyframeOptions>} PercentageKeyframes
 */

/**
 * @typedef {Array<Record<String, TweenOptions | TweenModifier | boolean> & TweenParamsOptions>} DurationKeyframes
 */

/**
 * @typedef {Object} AnimationOptions
 * @property {PercentageKeyframes|DurationKeyframes} [keyframes]
 * @property {EasingParam} [playbackEase]
 */

/**
 * @callback AnimationCallback
 * @param {Animation} self - Returns itself
 * @return *
 */

/**
 * @typedef {Object} AnimationCallbacks
 * @property {AnimationCallback} [onComplete]
 * @property {AnimationCallback} [onLoop]
 * @property {AnimationCallback} [onRender]
 * @property {AnimationCallback} [onBegin]
 * @property {AnimationCallback} [onUpdate]
 */

// TODO: Currently setting TweenModifier to the intersected Record<> makes the FunctionValue type target param any if only one parameter is set
/**
 * @typedef {Record<String, TweenOptions | AnimationCallback | TweenModifier | boolean | PercentageKeyframes | DurationKeyframes | ScrollObserver> & TimerOptions & AnimationOptions & TweenParamsOptions & AnimationCallbacks} AnimationParams
 */

/**
 * @typedef {TimerOptions & AnimationOptions & TweenParamsOptions & TimerCallbacks & AnimationCallbacks & TimelineCallbacks} DefaultsParams
 */

/**
 * @typedef {Object} TimelineOptions
 * @property {DefaultsParams} [defaults]
 * @property {EasingParam} [playbackEase]
 */

/**
 * @callback TimelineCallback
 * @param {Timeline} self - Returns itself
 * @return {*}
 */

/**
 * @typedef {Object} TimelineCallbacks
 * @property {TimelineCallback} [onComplete]
 * @property {TimelineCallback} [onLoop]
 * @property {TimelineCallback} [onRender]
 * @property {TimelineCallback} [onBegin]
 * @property {TimelineCallback} [onUpdate]
 */

/**
 * @typedef {TimerOptions & TimelineOptions & TimelineCallbacks} TimelineParams
 */

/**
 * @typedef {Object} ScopeParams
 * @property {DOMTargetSelector} [root]
 * @property {DefaultsParams} [defaults]
 * @property {Record<String, String>} [mediaQueries]
 */

/**
 * @callback AnimatablePropertySetter
 * @param  {Number|Array.<Number>} to
 * @param  {Number} [duration]
 * @param  {EasingParam} [ease]
 * @return {AnimatableObject}
 */

/**
 * @callback AnimatablePropertyGetter
 * @return {Number|Array.<Number>}
 */

/**
 * @typedef {AnimatablePropertySetter & AnimatablePropertyGetter} AnimatableProperty
 */

/**
 * @typedef {Animatable & Record<String, AnimatableProperty>} AnimatableObject
 */

/**
 * @typedef {Object} AnimatablePropertyParamsOptions
 * @property {String} [unit]
 * @property {TweenParamValue} [duration]
 * @property {EasingParam} [ease]
 * @property {TweenModifier} [modifier]
 * @property {TweenComposition} [composition]
 */

/**
 * @typedef {Record<String, TweenParamValue | EasingParam | TweenModifier | TweenComposition | AnimatablePropertyParamsOptions> & AnimatablePropertyParamsOptions} AnimatableParams
 */


// Environments

// TODO: Do we need to check if we're running inside a worker ?
const isBrowser = typeof window !== 'undefined';

/** @type {Object|Null} */
const win = isBrowser ? window : null;

/** @type {Document} */
const doc = isBrowser ? document : null;

// Enums

/** @enum {Number} */
const tweenTypes = {
  INVALID: 0,
  OBJECT: 1,
  ATTRIBUTE: 2,
  CSS: 3,
  TRANSFORM: 4,
  CSS_VAR: 5,
};

/** @enum {Number} */
const valueTypes = {
  NUMBER: 0,
  UNIT: 1,
  COLOR: 2,
  COMPLEX: 3,
};

/** @enum {Number} */
const tickModes = {
  NONE: 0,
  AUTO: 1,
  FORCE: 2,
};

/** @enum {Number} */
const compositionTypes = {
  replace: 0,
  none: 1,
  blend: 2,
};

// Cache symbols

const isRegisteredTargetSymbol = Symbol();
const isDomSymbol = Symbol();
const isSvgSymbol = Symbol();
const transformsSymbol = Symbol();
const morphPointsSymbol = Symbol();
const proxyTargetSymbol = Symbol();

// Numbers

const minValue = 1e-11;
const maxValue = 1e12;
const K = 1e3;
const maxFps = 120;

// Strings

const emptyString = '';
const shortTransforms = new Map();

shortTransforms.set('x', 'translateX');
shortTransforms.set('y', 'translateY');
shortTransforms.set('z', 'translateZ');

const validTransforms = [
  'translateX',
  'translateY',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'skew',
  'skewX',
  'skewY',
  'perspective',
  'matrix',
  'matrix3d',
];

const transformsFragmentStrings = validTransforms.reduce((a, v) => ({...a, [v]: v + '('}), {});

// Functions

/** @return {void} */
const noop = () => {};

// Regex

const hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
const rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
const rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
const hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
const hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
// export const digitWithExponentRgx = /[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g;
const digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
// export const unitsExecRgx = /^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)+([a-z]+|%)$/i;
const unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
const lowerCaseRgx = /([a-z])([A-Z])/g;
const transformsExecRgx = /(\w+)(\([^)]+\)+)/g; // Match inline transforms with cacl() values, returns the value wrapped in ()
const relativeValuesExecRgx = /(\*=|\+=|-=)/;




/** @type {DefaultsParams} */
const defaults = {
  /** @type {Number|String} */
  id: null,
  /** @type {PercentageKeyframes|DurationKeyframes} */
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: maxFps,
  /** @type {Number|Boolean} */
  loop: 0,
  reversed: false,
  alternate: false,
  autoplay: true,
  duration: K,
  delay: 0,
  loopDelay: 0,
  /** @type {EasingParam} */
  ease: 'outQuad',
  /** @type {'none'|'replace'|'blend'|compositionTypes} */
  composition: compositionTypes.replace,
  /** @type {TweenModifier} */
  modifier: v => v,
  onBegin: noop,
  onUpdate: noop,
  onRender: noop,
  onLoop: noop,
  onComplete: noop,
};

const globals = {
  /** @type {DefaultsParams} */
  defaults,
  /** @type {Document|DOMTarget} */
  root: doc,
  /** @type {Scope} */
  scope: null,
  precision: 4,
  timeScale: 1,
  tickThreshold: 200,
};

// Strings

/**
 * @param  {String} str
 * @return {String}
 */
const toLowerCase = str => str.replace(lowerCaseRgx, '$1-$2').toLowerCase();

/**
 * Prioritize this method instead of regex when possible
 * @param  {String} str
 * @param  {String} sub
 * @return {Boolean}
 */
const stringStartsWith = (str, sub) => str.indexOf(sub) === 0;

// Time
// Note: Date.now is used instead of performance.now since it is precise enough for timings calculations, performs slightly faster and works in Node.js environement.
const now = Date.now;

// Types checkers

const isArr = Array.isArray;
/**@param {any} a @return {a is Record<String, any>} */
const isObj = a => a && a.constructor === Object;
/**@param {any} a @return {a is Number} */
const isNum = a => typeof a === 'number' && !isNaN(a);
/**@param {any} a @return {a is String} */
const isStr = a => typeof a === 'string';
/**@param {any} a @return {a is Function} */
const isFnc = a => typeof a === 'function';
/**@param {any} a @return {a is undefined} */
const isUnd = a => typeof a === 'undefined';
/**@param {any} a @return {a is null | undefined} */
const isNil = a => isUnd(a) || a === null;
/**@param {any} a @return {a is SVGElement} */
const isSvg = a => isBrowser && a instanceof SVGElement;
/**@param {any} a @return {Boolean} */
const isHex = a => hexTestRgx.test(a);
/**@param {any} a @return {Boolean} */
const isRgb = a => stringStartsWith(a, 'rgb');
/**@param {any} a @return {Boolean} */
const isHsl = a => stringStartsWith(a, 'hsl');
/**@param {any} a @return {Boolean} */
const isCol = a => isHex(a) || isRgb(a) || isHsl(a);
/**@param {any} a @return {Boolean} */
const isKey = a => !globals.defaults.hasOwnProperty(a);

// Number

/**
 * @param  {Number|String} str
 * @return {Number}
 */
const parseNumber = str => isStr(str) ?
  parseFloat(/** @type {String} */(str)) :
  /** @type {Number} */(str);

// Math

const pow = Math.pow;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
const ceil = Math.ceil;
const floor = Math.floor;
const asin = Math.asin;
const atan2 = Math.atan2;
const PI = Math.PI;
const _round = Math.round;

/**
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
const clamp = (v, min, max) => v < min ? min : v > max ? max : v;

/**
 * @param  {Number} v
 * @param  {Number} decimalLength
 * @return {Number}
 */
const round = (v, decimalLength) => {
  if (decimalLength < 0) return v;
  const m = 10 ** decimalLength;
  return _round(v * m) / m;
};

/**
 * @param  {Number} v
 * @param  {Number|Array<Number>} increment
 * @return {Number}
 */
const snap = (v, increment) => isArr(increment) ? increment.reduce((closest, cv) => (abs(cv - v) < abs(closest - v) ? cv : closest)) : increment ? _round(v / increment) * increment : v;

/**
 * @param  {Number} start
 * @param  {Number} end
 * @param  {Number} progress
 * @return {Number}
 */
const interpolate = (start, end, progress) => start + (end - start) * progress;

/**
 * @param  {Number} v
 * @return {Number}
 */
const clampInfinity = v => v === Infinity ? maxValue : v === -Infinity ? -maxValue : v;

/**
 * @param  {Number} v
 * @return {Number}
 */
const clampZero = v => v < minValue ? minValue : v;

// Arrays

/**
 * @template T
 * @param {T[]} a
 * @return {T[]}
 */
const cloneArray = a => isArr(a) ? [ ...a ] : a;

// Objects

/**
 * @template T
 * @template U
 * @param {T} o1
 * @param {U} o2
 * @return {T & U}
 */
const mergeObjects = (o1, o2) => {
  const merged = /** @type {T & U} */({ ...o1 });
  for (let p in o2) {
    const o1p = /** @type {T & U} */(o1)[p];
    merged[p] = isUnd(o1p) ? /** @type {T & U} */(o2)[p] : o1p;
  }  return merged;
};

// Linked lists

/**
 * @param {Object} parent
 * @param {Function} callback
 * @param {Boolean} [reverse]
 * @param {String} [prevProp]
 * @param {String} [nextProp]
 * @return {void}
 */
const forEachChildren = (parent, callback, reverse, prevProp = '_prev', nextProp = '_next') => {
  let next = parent._head;
  let adjustedNextProp = nextProp;
  if (reverse) {
    next = parent._tail;
    adjustedNextProp = prevProp;
  }
  while (next) {
    const currentNext = next[adjustedNextProp];
    callback(next);
    next = currentNext;
  }
};

/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {String} [prevProp]
 * @param  {String} [nextProp]
 * @return {void}
 */
const removeChild = (parent, child, prevProp = '_prev', nextProp = '_next') => {
  const prev = child[prevProp];
  const next = child[nextProp];
  prev ? prev[nextProp] = next : parent._head = next;
  next ? next[prevProp] = prev : parent._tail = prev;
  child[prevProp] = null;
  child[nextProp] = null;
};

/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {Function} [sortMethod]
 * @param  {String} prevProp
 * @param  {String} nextProp
 * @return {void}
 */
const addChild = (parent, child, sortMethod, prevProp = '_prev', nextProp = '_next') => {
  let prev = parent._tail;
  while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
  const next = prev ? prev[nextProp] : parent._head;
  prev ? prev[nextProp] = child : parent._head = child;
  next ? next[prevProp] = child : parent._tail = child;
  child[prevProp] = prev;
  child[nextProp] = next;
};

/*
 * Base class to control framerate and playback rate.
 * Inherited by Engine, Timer, Animation and Timeline.
 */
class Clock {

  constructor() {
    /** @type {Number} */
    this.currentTime = 0;
    /** @type {Number} */
    this.deltaTime = 0;
    /** @type {Number} */
    this._elapsedTime = 0;
    /** @type {Number} */
    this._startTime = 0;
    /** @type {Number} */
    this._lastTime = 0;
    /** @type {Number} */
    this._scheduledTime = 0;
    /** @type {Number} */
    this._frameDuration = K / maxFps;
    /** @type {Number} */
    this._fps = maxFps;
    /** @type {Number} */
    this._speed = 1;
    /** @type {Boolean} */
    this._hasChildren = false;
  }

  get frameRate() {
    return this._fps;
  }

  set frameRate(frameRate) {
    const previousFrameDuration = this._frameDuration;
    const fr = +frameRate;
    const fps = fr < minValue ? minValue : fr;
    const frameDuration = K / fps;
    this._fps = fps;
    this._frameDuration = frameDuration;
    this._scheduledTime += frameDuration - previousFrameDuration;
  }

  get playbackRate() {
    return this._speed;
  }

  set playbackRate(playbackRate) {
    const pbr = +playbackRate;
    this._speed = pbr < minValue ? minValue : pbr;
  }

  /**
   * @param  {Number} time
   * @return {tickModes}
   */
  requestTick(time) {
    const scheduledTime = this._scheduledTime;
    const elapsedTime = this._elapsedTime;
    this._elapsedTime += (time - elapsedTime);
    // If the elapsed time is lower than the scheduled time
    // this means not enough time has passed to hit one frameDuration
    // so skip that frame
    if (elapsedTime < scheduledTime) return tickModes.NONE;
    const frameDuration = this._frameDuration;
    const frameDelta = elapsedTime - scheduledTime;
    // Ensures that _scheduledTime progresses in steps of at least 1 frameDuration.
    // Skips ahead if the actual elapsed time is higher.
    this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
    return tickModes.AUTO;
  }

  /**
   * @param  {Number} time
   * @return {Number}
   */
  computeDeltaTime(time) {
    const delta = time - this._lastTime;
    this.deltaTime = delta;
    this._lastTime = time;
    return delta;
  }

}




/**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {tickModes} tickMode
 * @return {Number}
 */
const render = (tickable, time, muteCallbacks, internalRender, tickMode) => {

  const duration = tickable.duration;
  const currentTime = tickable.currentTime;
  const _currentIteration = tickable._currentIteration;
  const _iterationDuration = tickable._iterationDuration;
  const _iterationCount = tickable._iterationCount;
  const _loopDelay = tickable._loopDelay;
  const _reversed = tickable.reversed;
  const _alternate = tickable._alternate;
  const _hasChildren = tickable._hasChildren;

  const updateStartTime = tickable._delay;
  const updateEndTime = updateStartTime + _iterationDuration;
  const tickableTime = clamp(time - updateStartTime, -updateStartTime, duration);
  const deltaTime = tickableTime - currentTime;
  const isOverTime = tickableTime >= duration;
  const forceTick = tickMode === tickModes.FORCE;
  const autoTick = tickMode === tickModes.AUTO;
  // Time has jumped more than 200ms so consider this tick manual
  // NOTE: the manual abs is faster than Math.abs()
  const isManual = forceTick || (deltaTime < 0 ? deltaTime * -1 : deltaTime) >= globals.tickThreshold;

  let hasBegun = tickable.began;
  let isOdd = 0;
  let iterationElapsedTime = tickableTime;

  // Execute the "expensive" iterations calculations only when necessary
  if (_iterationCount > 1) {
    // bitwise NOT operator seems to be generally faster than Math.floor() across browsers
    const currentIteration = ~~(tickableTime / (_iterationDuration + (isOverTime ? 0 : _loopDelay)));
    tickable._currentIteration = clamp(currentIteration, 0, _iterationCount);
    // Prevent the iteration count to go above the max iterations when reaching the end of the animation
    if (isOverTime) {
      tickable._currentIteration--;
    }
    isOdd = tickable._currentIteration % 2;
    iterationElapsedTime = tickableTime % (_iterationDuration + _loopDelay);
  }

  // Checks if exactly one of _reversed and (_alternate && isOdd) is true
  const isReversed = _reversed ^ (_alternate && isOdd);
  const _ease = /** @type {Renderable} */(tickable)._ease;
  let iterationTime = isOverTime ? isReversed ? 0 : duration : isReversed ? _iterationDuration - iterationElapsedTime : iterationElapsedTime;
  if (_ease) {
    iterationTime =_iterationDuration * _ease(iterationTime / _iterationDuration) || 0;
  }
  const isRunningBackwards = iterationTime < tickable._iterationTime;
  const seekMode = isManual ? isRunningBackwards ? 2 : 1 : 0; // 0 = automatic, 1 = manual forward, 2 = manual backward
  const precision = globals.precision;

  tickable._iterationTime = iterationTime;
  tickable._backwards = isRunningBackwards && !isReversed;

  if (!muteCallbacks && !hasBegun && tickableTime > 0) {
    hasBegun = tickable.began = true;
    tickable.onBegin(tickable);
  }

  // Update animation.currentTime only after the children have been updated to prevent wrong seek direction calculatiaon
  tickable.currentTime = tickableTime;

  // Render checks
  // Used to also check if the children have rendered in order to trigger the onRender callback on the parent timer
  let hasRendered = 0;

 if (hasBegun && tickable._currentIteration !== _currentIteration) {
    if (!muteCallbacks) tickable.onLoop(tickable);
    // Reset all children on loop to get the callbacks working and initial proeprties properly set on each iteration
    if (_hasChildren) {
      forEachChildren(tickable, (/** @type {$Animation} */child) => child.reset(), true);
    }
  }

  if (
    forceTick ||
    autoTick && (
      time >= updateStartTime && time <= updateEndTime || // Normal render
      time <= updateStartTime && currentTime > 0 || // Playhead is before the animation start time so make sure the animation is at its initial state
      time >= updateEndTime && currentTime !== duration // Playhead is after the animation end time so make sure the animation is at its end state
    ) ||
    iterationTime >= updateEndTime && currentTime !== duration ||
    iterationTime <= updateStartTime && currentTime > 0 ||
    time <= currentTime && currentTime === duration && tickable.completed // Force a render if a seek occurs on an completed animation
  ) {

    if (hasBegun) {
      // Trigger onUpdate callback before rendering
      tickable.computeDeltaTime(currentTime);
      if (!muteCallbacks) tickable.onUpdate(tickable);
    }

    // Start tweens rendering
    if (!_hasChildren) {

      // Only Animtion can have tweens, Timer returns undefined
      let tween = /** @type {Tween} */(/** @type {$Animation} */(tickable)._head);
      let tweenTarget;
      let tweenStyle;
      let tweenTargetTransforms;
      let tweenTargetTransformsProperties;
      let tweenTransformsNeedUpdate = 0;

      // const absoluteTime = tickable._offset + updateStartTime + iterationTime;
      // TODO: Check if tickable._offset can be replaced by the absoluteTime value to avoid avinf to compute it in the render loop
      const parent = tickable.parent;
      const absoluteTime = tickable._offset + (parent ? parent._offset : 0) + updateStartTime + iterationTime;

      while (tween) {

        const tweenComposition = tween._composition;
        const tweenCurrentTime = tween._currentTime;
        const tweenChangeDuration = tween._changeDuration;
        const tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
        const tweenNextRep = tween._nextRep;
        const tweenPrevRep = tween._prevRep;
        const tweenHasComposition = tweenComposition !== compositionTypes.none;

        if ((seekMode || (
            (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) &&
            (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)
          )) && (!tweenHasComposition || (
            !tween._isOverridden &&
            (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) &&
            (!tweenNextRep || (tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime)) &&
            (!tweenPrevRep || (tweenPrevRep._isOverridden || (absoluteTime >= (tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration) + tween._delay)))
          ))
        ) {

          const tweenNewTime = tween._currentTime = clamp(iterationTime - tween._startTime, 0, tweenChangeDuration);
          const tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
          const tweenModifier = tween._modifier;
          const tweenValueType = tween._valueType;
          const tweenType = tween._tweenType;
          const tweenIsObject = tweenType === tweenTypes.OBJECT;
          const tweenIsNumber = tweenValueType === valueTypes.NUMBER;
          // Skip rounding for number values on property object
          // Otherwise if the final value is a string, round the in-between frames values
          const tweenPrecision = (tweenIsNumber && tweenIsObject) || tweenProgress === 0 || tweenProgress === 1 ? -1 : precision;

          // Recompose tween value
          /** @type {String|Number} */
          let value;
          /** @type {Number} */
          let number;

          if (tweenIsNumber) {
            value = number = /** @type {Number} */(tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber,  tweenProgress), tweenPrecision )));
          } else if (tweenValueType === valueTypes.UNIT) {
            // Rounding the values speed up string composition
            number = /** @type {Number} */(tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber,  tweenProgress), tweenPrecision)));
            value = `${number}${tween._unit}`;
          } else if (tweenValueType === valueTypes.COLOR) {
            const fn = tween._fromNumbers;
            const tn = tween._toNumbers;
            const r = round(clamp(/** @type {Number} */(tweenModifier(interpolate(fn[0], tn[0], tweenProgress))), 0, 255), 0);
            const g = round(clamp(/** @type {Number} */(tweenModifier(interpolate(fn[1], tn[1], tweenProgress))), 0, 255), 0);
            const b = round(clamp(/** @type {Number} */(tweenModifier(interpolate(fn[2], tn[2], tweenProgress))), 0, 255), 0);
            const a = clamp(/** @type {Number} */(tweenModifier(round(interpolate(fn[3], tn[3], tweenProgress), tweenPrecision))), 0, 1);
            value = `rgba(${r},${g},${b},${a})`;
            if (tweenHasComposition) {
              const ns = tween._numbers;
              ns[0] = r;
              ns[1] = g;
              ns[2] = b;
              ns[3] = a;
            }
          } else if (tweenValueType === valueTypes.COMPLEX) {
            value = tween._strings[0];
            for (let j = 0, l = tween._toNumbers.length; j < l; j++) {
              const n = /** @type {Number} */(tweenModifier(round(interpolate(tween._fromNumbers[j], tween._toNumbers[j], tweenProgress), tweenPrecision)));
              const s = tween._strings[j + 1];
              value += `${s ? n + s : n}`;
              if (tweenHasComposition) {
                tween._numbers[j] = n;
              }
            }
          }

          // For additive tweens and Animatables
          if (tweenHasComposition) {
            tween._number = number;
          }

          if (!internalRender && tweenComposition !== compositionTypes.blend) {

            const tweenProperty = tween.property;
            tweenTarget = tween.target;

            if (tweenIsObject) {
              tweenTarget[tweenProperty] = value;
            } else if (tweenType === tweenTypes.ATTRIBUTE) {
              /** @type {DOMTarget} */(tweenTarget).setAttribute(tweenProperty, /** @type {String} */(value));
            } else {
              tweenStyle = /** @type {DOMTarget} */(tweenTarget).style;
              if (tweenType === tweenTypes.TRANSFORM) {
                if (tweenTarget !== tweenTargetTransforms) {
                  tweenTargetTransforms = tweenTarget;
                  // NOTE: Referencing the cachedTransforms in the tween property directly can be a little bit faster but appears to increase memory usage.
                  tweenTargetTransformsProperties = tweenTarget[transformsSymbol];
                }
                tweenTargetTransformsProperties[tweenProperty] = value;
                tweenTransformsNeedUpdate = 1;
              } else if (tweenType === tweenTypes.CSS) {
                tweenStyle[tweenProperty] = value;
              } else if (tweenType === tweenTypes.CSS_VAR) {
                tweenStyle.setProperty(tweenProperty,/** @type {String} */(value));
              }
            }

            if (hasBegun) hasRendered = 1;

          } else {
            // Used for composing timeline tweens without having to do a real render
            tween._value = value;
          }

        }

        // NOTE: Possible improvement: Use translate(x,y) / translate3d(x,y,z) syntax
        // to reduce memory usage on string composition
        if (tweenTransformsNeedUpdate && tween._renderTransforms) {
          let str = emptyString;
          for (let key in tweenTargetTransformsProperties) {
            str += `${transformsFragmentStrings[key]}${tweenTargetTransformsProperties[key]}) `;
          }
          tweenStyle.transform = str;
          tweenTransformsNeedUpdate = 0;
        }

        tween = tween._next;
      }

      if (hasRendered && !muteCallbacks) {
        /** @type {$Animation} */(tickable).onRender(/** @type {$Animation} */(tickable));
      }
    }

  }

  // End tweens rendering

  // Start onComplete callback and resolve Promise

  if (hasBegun && isOverTime) {
    if (_iterationCount === Infinity) {
      // Offset the tickable _startTime with its duration to reset currentTime to 0 and continue the infinite timer
      tickable._startTime += tickable.duration;
    } else if (tickable._currentIteration >= _iterationCount - 1) {
      // By setting paused to true, we tell the engine loop to not render this tickable and removes it from the list
      tickable.paused = true;
      if (!tickable.completed) {
        tickable.completed = true;
        if (!muteCallbacks) {
          tickable.onComplete(tickable);
          tickable._resolve(tickable);
        }
      }
    }
  }

  // TODO: return hasRendered * direction (negative for backwards) this way we can remove the tickable._backwards property completly
  return hasRendered;
};

/**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {Number} tickMode
 * @return {void}
 */
const tick = (tickable, time, muteCallbacks, internalRender, tickMode) => {
  render(tickable, time, muteCallbacks, internalRender, tickMode);
  if (tickable._hasChildren) {
    let hasRendered = 0;
    // Don't use the iteration time with internalRender
    // otherwise it will be converted twice further down the line
    const childrenTime = internalRender ? time : tickable._iterationTime;
    const childrenTickTime = now();
    forEachChildren(tickable, (/** @type {$Animation} */child) => {
      hasRendered += render(
        child,
        (childrenTime - child._offset) * child._speed,
        muteCallbacks,
        internalRender,
        child._fps < tickable._fps ? child.requestTick(childrenTickTime) : tickMode
      );
    }, tickable._backwards);

    if (tickable.began && hasRendered) {
      /** @type {Timeline} */(tickable).onRender(/** @type {Timeline} */(tickable));
    }
  }
};




const additive = {
  animation: null,
  update: noop,
};

/**
 * @typedef AdditiveAnimation
 * @property {Number} duration
 * @property {Number} _offset
 * @property {Number} _delay
 * @property {Tween} _head
 * @property {Tween} _tail
 */

/**
 * @param  {TweenAdditiveLookups} lookups
 * @return {AdditiveAnimation}
 */
const addAdditiveAnimation = lookups => {
  let animation = additive.animation;
  if (!animation) {
    animation = {
      duration: minValue,
      _offset: 0,
      _delay: 0,
      _head: null,
      _tail: null,
    };
    additive.animation = animation;
    additive.update = () => {
      lookups.forEach(propertyAnimation => {
        for (let propertyName in propertyAnimation) {
          const tweens = propertyAnimation[propertyName];
          const lookupTween = tweens._head;
          const additiveValues = lookupTween._valueType === valueTypes.COMPLEX ? cloneArray(lookupTween._fromNumbers) : null;
          let additiveValue = lookupTween._fromNumber;
          let tween = tweens._tail;
          while (tween && tween !== lookupTween) {
            if (additiveValues) {
              tween._numbers.forEach((value, i) => additiveValues[i] += value);
            } else {
              additiveValue += tween._number;
            }
            tween = tween._prevAdd;
          }
          lookupTween._toNumber = additiveValue;
          lookupTween._toNumbers = additiveValues;
        }
      });
      // TODO: Avoid polymorphism here, idealy the additive animation should be a regular animation with a higher priority in the render loop
      render(animation, 1, 1, 0, tickModes.FORCE);
    };
  }
  return animation;
};




/**
 * @type {Function}
 * @return {Number}
 */
const engineTickMethod = isBrowser ? requestAnimationFrame : setImmediate;

/**
 * @type {Function}
 * @return {Number}
 */
const engineCancelMethod = isBrowser ? cancelAnimationFrame : clearImmediate;

class Engine extends Clock {
  constructor() {
    super();

    // Clock's parameters
    const initTime = now();
    this.currentTime = initTime;
    this._elapsedTime = initTime;
    this._startTime = initTime;
    this._lastTime = initTime;

    // Engine's parameters
    this.useDefaultMainLoop = true;
    this.suspendWhenHidden = true;
    this.defaults = defaults;
    this._reqId = 0;
    this._stopped = false;
    this._suspended = false;
    /** @type {Tickable} */
    this._head = null;
    /** @type {Tickable} */
    this._tail = null;
  }

  update() {
    const time = this.currentTime = now();
    if (this.requestTick(time)) {
      this.computeDeltaTime(time);
      const engineSpeed = this._speed;
      const engineFps = this._fps;
      let activeTickable = this._head;
      while (activeTickable) {
        const nextTickable = activeTickable._next;
        if (!activeTickable.paused) {
          tick(
            activeTickable,
            (time - activeTickable._startTime) * activeTickable._speed * engineSpeed,
            0, // !muteCallbacks
            0, // !internalRender
            // Only process the tick of the child clock if its frameRate is lower than the engine
            activeTickable._fps < engineFps ? activeTickable.requestTick(time) : tickModes.AUTO
          );
        } else {
          removeChild(engine, activeTickable);
          this._hasChildren = !!this._tail;
          activeTickable._running = false;
          if (activeTickable.completed && !activeTickable._cancelled) {
            activeTickable.cancel();
          }
        }
        activeTickable = nextTickable;
      }
      additive.update();
    }
  }

  stop() {
    this._stopped = true;
    return killEngine();
  }

  start() {
    if (this._suspended || this._stopped) {
      forEachChildren(this, (/** @type {Tickable} */child) => child.resetTime());
      this._suspended = false;
      this._stopped = false;
    }
    if (this.useDefaultMainLoop && !this._reqId) {
      this._reqId = engineTickMethod(tickEngine);
    }
    return this;
  }

  suspend() {
    this._suspended = true;
    return killEngine();
  }

  resume() {
    return this._stopped ? this : this.start();
  }

  get playbackRate() {
    return super.playbackRate * (globals.timeScale === 1 ? 1 : K);
  }

  set playbackRate(playbackRate) {
    super.playbackRate = playbackRate * globals.timeScale;
    // Forces children time to reset by reseting their playbackRate
    forEachChildren(this, (/** @type {Tickable} */child) => child.playbackRate = child._speed);
  }

  get timeUnit() {
    return globals.timeScale === 1 ? 'ms' : 's';
  }

  set timeUnit(unit) {
    const S = 0.001;
    const isSecond = unit === 's';
    const newScale = isSecond ? S : 1;
    if (globals.timeScale !== newScale) {
      globals.timeScale = newScale;
      globals.tickThreshold = 200 * newScale;
      const scaleFactor = isSecond ? S : K;
      /** @type {Number} */
      (this.defaults.duration) *= scaleFactor;
      this._speed *= scaleFactor;
    }
  }

  get precision() {
    return globals.precision;
  }

  set precision(precision) {
    globals.precision = precision;
  }

}

const engine = new Engine();

const tickEngine = () => {
  if (engine._head) {
    engine._reqId = engineTickMethod(tickEngine);
    engine.update();
  } else {
    engine._reqId = 0;
  }
};

const killEngine = () => {
  engineCancelMethod(engine._reqId);
  engine._reqId = 0;
  return engine;
};




/**
 * @param  {DOMTargetsParam|TargetsParam} v
 * @return {NodeList|HTMLCollection}
 */
function getNodeList(v) {
  const n = isStr(v) ? globals.root.querySelectorAll(v) : v;
  if (n instanceof NodeList || n instanceof HTMLCollection) return n;
}

/**
 * @overload
 * @param  {DOMTargetsParam} targets
 * @return {DOMTargetsArray}
 *
 * @overload
 * @param  {JSTargetsParam} targets
 * @return {JSTargetsArray}
 *
 * @overload
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 *
 * @param  {DOMTargetsParam|JSTargetsParam|TargetsParam} targets
 */
function parseTargets(targets) {
  if (isNil(targets)) return /** @type {TargetsArray} */([]);
  if (isArr(targets)) {
    const flattened = targets.flat(Infinity);
    /** @type {TargetsArray} */
    const parsed = [];
    for (let i = 0, l = flattened.length; i < l; i++) {
      const item = flattened[i];
      if (!isNil(item)) {
        const nodeList = getNodeList(item);
        if (nodeList) {
          for (let j = 0, jl = nodeList.length; j < jl; j++) {
            const subItem = nodeList[j];
            if (!isNil(subItem)) {
              let isDuplicate = false;
              for (let k = 0, kl = parsed.length; k < kl; k++) {
                if (parsed[k] === subItem) {
                  isDuplicate = true;
                  break;
                }
              }
              if (!isDuplicate) {
                parsed.push(subItem);
              }
            }
          }
        } else {
          let isDuplicate = false;
          for (let j = 0, jl = parsed.length; j < jl; j++) {
            if (parsed[j] === item) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            parsed.push(item);
          }
        }
      }
    }
    return parsed;
  }
  if (!isBrowser) return /** @type {JSTargetsArray} */([targets]);
  const nodeList = getNodeList(targets);
  if (nodeList) return /** @type {DOMTargetsArray} */(Array.from(nodeList));
  return /** @type {TargetsArray} */([targets]);
}

/**
 * @overload
 * @param  {DOMTargetsParam} targets
 * @return {DOMTargetsArray}
 *
 * @overload
 * @param  {JSTargetsParam} targets
 * @return {JSTargetsArray}
 *
 * @overload
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 *
 * @param  {DOMTargetsParam|JSTargetsParam|TargetsParam} targets
 */
function registerTargets(targets) {
  const parsedTargetsArray = parseTargets(targets);
  const parsedTargetsLength = parsedTargetsArray.length;
  if (parsedTargetsLength) {
    for (let i = 0; i < parsedTargetsLength; i++) {
      const target = parsedTargetsArray[i];
      if (!target[isRegisteredTargetSymbol]) {
        target[isRegisteredTargetSymbol] = true;
        const isSvgType = isSvg(target);
        const isDom = /** @type {DOMTarget} */(target).nodeType || isSvgType;
        if (isDom) {
          target[isDomSymbol] = true;
          target[isSvgSymbol] = isSvgType;
          target[transformsSymbol] = {};
        }
      }
    }
  }
  return parsedTargetsArray;
}




/** @type {EasingFunction} */
const none = t => t;

// Cubic Bezier solver adapted from https://github.com/gre/bezier-ease
// © Gaëtan Renaudeau

/**
 * @param  {Number} aT
 * @param  {Number} aA1
 * @param  {Number} aA2
 * @return {Number}
 */
const calcBezier = (aT, aA1, aA2) => (((1 - 3 * aA2 + 3 * aA1) * aT + (3 * aA2 - 6 * aA1)) * aT + (3 * aA1)) * aT;

/**
 * @param  {Number} aX
 * @param  {Number} mX1
 * @param  {Number} mX2
 * @return {Number}
 */
const binarySubdivide = (aX, mX1, mX2) => {
  let aA = 0, aB = 1, currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (abs(currentX) > .0000001 && ++i < 100);
  return currentT;
};

/**
 * @param  {Number} [mX1]
 * @param  {Number} [mY1]
 * @param  {Number} [mX2]
 * @param  {Number} [mY2]
 * @return {EasingFunction}
 */

const cubicBezier = (mX1 = 0.5, mY1 = 0.0, mX2 = 0.5, mY2 = 1.0) => (mX1 === mY1 && mX2 === mY2) ? none :
  t => t === 0 || t === 1 ? t :
  calcBezier(binarySubdivide(t, mX1, mX2), mY1, mY2);

/**
 * Steps ease implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function
 * Only covers 'end' and 'start' jumpterms
 * @param  {Number} steps
 * @param  {Boolean} [fromStart]
 * @return {EasingFunction}
 */
const steps = (steps = 10, fromStart) => {
  const roundMethod = fromStart ? ceil : floor;
  return t => roundMethod(clamp(t, 0, 1) * steps) * (1 / steps);
};

// Robert Penner's ease functions adapted from http://www.robertpenner.com/ease

/**
 * @callback PowerEasing
 * @param {Number} [power=1.675]
 * @return {EasingFunction}
 */

/**
 * @callback BackEasing
 * @param {Number} [overshoot=1.70158]
 * @return {EasingFunction}
 */

/**
 * @callback ElasticEasing
 * @param {Number} [amplitude=1]
 * @param {Number} [period=.3]
 * @return {EasingFunction}
 */

/**
 * @callback EaseFactory
 * @param {Number} [paramA]
 * @param {Number} [paramB]
 * @return {EasingFunction|Number}
 */

/** @typedef {PowerEasing|BackEasing|ElasticEasing} EasesFactory */

const halfPI = PI / 2;
const doublePI = PI * 2;
/** @type {PowerEasing} */
const easeInPower = (p = 1.64) => t => pow(t, +p);

/** @type {Record<String, EasesFactory|EasingFunction>} */
const easeInFunctions = {
  [emptyString]: easeInPower,
  Quad: easeInPower(2),
  Cubic: easeInPower(3),
  Quart: easeInPower(4),
  Quint: easeInPower(5),
  /** @type {EasingFunction} */
  Sine: t => 1 - cos(t * halfPI),
  /** @type {EasingFunction} */
  Circ: t => 1 - sqrt(1 - t * t),
  /** @type {EasingFunction} */
  Expo: t => t ? pow(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: t => {
    let pow2, b = 4;
    while (t < ((pow2 = pow(2, --b)) - 1) / 11);
    return 1 / pow(4, 3 - b) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (overshoot = 1.70158) => t => (+overshoot + 1) * t * t * t - +overshoot * t * t,
  /** @type {ElasticEasing} */
  Elastic: (amplitude = 1, period = .3) => {
    const a = clamp(+amplitude, 1, 10);
    const p = clamp(+period, minValue, 2);
    const s = (p / doublePI) * asin(1 / a);
    const e = doublePI / p;
    return t => t === 0 || t === 1 ? t : -a * pow(2, -10 * (1 - t)) * sin(((1 - t) - s) * e);
  }
};

/**
 * @callback EaseType
 * @param {EasingFunction} Ease
 * @return {EasingFunction}
 */

/** @type {Record<String, EaseType>} */
const easeTypes = {
  in: easeIn => t => easeIn(t),
  out: easeIn => t => 1 - easeIn(1 - t),
  inOut: easeIn => t => t < .5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2,
  outIn: easeIn => t => t < .5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2,
};

/**
 * Without parameters, the linear function creates a non-eased transition.
 * Parameters, if used, creates a piecewise linear easing by interpolating linearly between the specified points.
 * @param  {...String|Number} [args] - Points
 * @return {EasingFunction}
 */
const linear = (...args) => {
  const argsLength = args.length;
  if (!argsLength) return none;
  const totalPoints = argsLength - 1;
  const firstArg = args[0];
  const lastArg = args[totalPoints];
  const xPoints = [0];
  const yPoints = [parseNumber(firstArg)];
  for (let i = 1; i < totalPoints; i++) {
    const arg = args[i];
    const splitValue = isStr(arg) ?
    /** @type {String} */(arg).trim().split(' ') :
    [arg];
    const value = splitValue[0];
    const percent = splitValue[1];
    xPoints.push(!isUnd(percent) ? parseNumber(percent) / 100 : i / totalPoints);
    yPoints.push(parseNumber(value));
  }
  yPoints.push(parseNumber(lastArg));
  xPoints.push(1);
  return function easeLinear(t) {
    for (let i = 1, l = xPoints.length; i < l; i++) {
      const currentX = xPoints[i];
      if (t <= currentX) {
        const prevX = xPoints[i - 1];
        const prevY = yPoints[i - 1];
        return prevY + (yPoints[i] - prevY) * (t - prevX) / (currentX - prevX);
      }
    }
    return yPoints[yPoints.length - 1];
  }
};

/**
 * Generate random steps
 * @param  {Number} [length] - The number of steps
 * @param  {Number} [randomness] - How strong the randomness is
 * @return {EasingFunction}
 */
const irregular = (length = 10, randomness = 1) => {
  const values = [0];
  const total = length - 1;
  for (let i = 1; i < total; i++) {
    const previousValue = values[i - 1];
    const spacing = i / total;
    const segmentEnd = (i + 1) / total;
    const randomVariation = spacing + (segmentEnd - spacing) * Math.random();
    // Mix the even spacing and random variation based on the randomness parameter
    const randomValue = spacing * (1 - randomness) + randomVariation * randomness;
    values.push(clamp(randomValue, previousValue, 1));
  }
  values.push(1);
  return linear(...values);
};

/**
 * @typedef  {Object} EasesFunctions
 * @property {typeof linear} [linear]
 * @property {typeof irregular} [irregular]
 * @property {typeof steps} [steps]
 * @property {typeof cubicBezier} [cubicBezier]
 * @property {PowerEasing} [in]
 * @property {PowerEasing} [out]
 * @property {PowerEasing} [inOut]
 * @property {PowerEasing} [outIn]
 * @property {EasingFunction} [inQuad]
 * @property {EasingFunction} [outQuad]
 * @property {EasingFunction} [inOutQuad]
 * @property {EasingFunction} [outInQuad]
 * @property {EasingFunction} [inCubic]
 * @property {EasingFunction} [outCubic]
 * @property {EasingFunction} [inOutCubic]
 * @property {EasingFunction} [outInCubic]
 * @property {EasingFunction} [inQuart]
 * @property {EasingFunction} [outQuart]
 * @property {EasingFunction} [inOutQuart]
 * @property {EasingFunction} [outInQuart]
 * @property {EasingFunction} [inQuint]
 * @property {EasingFunction} [outQuint]
 * @property {EasingFunction} [inOutQuint]
 * @property {EasingFunction} [outInQuint]
 * @property {EasingFunction} [inSine]
 * @property {EasingFunction} [outSine]
 * @property {EasingFunction} [inOutSine]
 * @property {EasingFunction} [outInSine]
 * @property {EasingFunction} [inCirc]
 * @property {EasingFunction} [outCirc]
 * @property {EasingFunction} [inOutCirc]
 * @property {EasingFunction} [outInCirc]
 * @property {EasingFunction} [inExpo]
 * @property {EasingFunction} [outExpo]
 * @property {EasingFunction} [inOutExpo]
 * @property {EasingFunction} [outInExpo]
 * @property {EasingFunction} [inBounce]
 * @property {EasingFunction} [outBounce]
 * @property {EasingFunction} [inOutBounce]
 * @property {EasingFunction} [outInBounce]
 * @property {BackEasing} [inBack]
 * @property {BackEasing} [outBack]
 * @property {BackEasing} [inOutBack]
 * @property {BackEasing} [outInBack]
 * @property {ElasticEasing} [inElastic]
 * @property {ElasticEasing} [outElastic]
 * @property {ElasticEasing} [inOutElastic]
 * @property {ElasticEasing} [outInElastic]
 */

/** @type {EasesFunctions} */
const eases = { linear, irregular, steps, cubicBezier };
const easesLookups = { linear: none };

for (let type in easeTypes) {
  for (let name in easeInFunctions) {
    const easeIn = easeInFunctions[name];
    const easeType = easeTypes[type];
    const hasParams = name === emptyString || name === 'Back' || name === 'Elastic';
    /** @type {EasesFactory|EasingFunction} */
    const easeFactory = hasParams ?
      (a, b) => easeType(/** @type {EasesFactory} */(easeIn)(a, b)) :
      easeType(/** @type {EasingFunction} */(easeIn));
    const easeName = type + name;
    eases[easeName] = easeFactory;
    // Apply default parameters for built-in eases so they can be called without '()'
    /** @type {EaseFactory} */
    easesLookups[easeName] = hasParams ? /** @type {EasesFactory} */(easeFactory)() : easeFactory;
  }
}

/**
 * @param  {String} string
 * @return {EasingFunction}
 */
const parseEaseString = string => {
  if (string.indexOf('(') <= -1) return none;
  const split = string.slice(0, -1).split('(');
  const parsedFn = eases[split[0]];
  const result = parsedFn ? easesLookups[string] = parsedFn(...split[1].split(',')) : none;
  return result;
};

/**
 * @param  {EasingParam} ease
 * @return {EasingFunction}
 */
const parseEasings = ease => isFnc(ease) ? ease :
  isStr(ease) ? easesLookups[ease] ? easesLookups[ease] :
  parseEaseString(/** @type {String} */(ease)) : none;




/**
 * @param  {DOMTarget} target
 * @param  {String} propName
 * @param  {Object} animationInlineStyles
 * @return {String}
 */
const parseInlineTransforms = (target, propName, animationInlineStyles) => {
  const inlineTransforms = target.style.transform;
  let inlinedStylesPropertyValue;
  if (inlineTransforms) {
    const cachedTransforms = target[transformsSymbol];
    let t; while (t = transformsExecRgx.exec(inlineTransforms)) {
      const inlinePropertyName = t[1];
      // const inlinePropertyValue = t[2];
      const inlinePropertyValue = t[2].slice(1, -1);
      cachedTransforms[inlinePropertyName] = inlinePropertyValue;
      if (inlinePropertyName === propName) {
        inlinedStylesPropertyValue = inlinePropertyValue;
        // Store the new parsed inline styles if animationInlineStyles is provided
        if (animationInlineStyles) {
          animationInlineStyles[propName] = inlinePropertyValue;
        }
      }
    }
  }
  return inlineTransforms && !isUnd(inlinedStylesPropertyValue) ? inlinedStylesPropertyValue :
    stringStartsWith(propName, 'scale') ? '1' :
    stringStartsWith(propName, 'rotate') || stringStartsWith(propName, 'skew') ? '0deg' : '0px';
};




/**
 * @param  {TargetsParam} path
 * @return {SVGGeometryElement|undefined}
 */
const getPath = path => {
  const parsedTargets = parseTargets(path);
  const $parsedSvg = /** @type {SVGGeometryElement} */(parsedTargets[0]);
  if (!$parsedSvg || !isSvg($parsedSvg)) return;
  return $parsedSvg;
};

/**
 * @param  {TargetsParam} path2
 * @param  {Number} [precision]
 * @return {FunctionValue}
 */
const morphTo = (path2, precision = .33) => ($path1) => {
  const $path2 = /** @type {SVGGeometryElement} */(getPath(path2));
  if (!$path2) return;
  const isPath = $path1.tagName === 'path';
  const separator = isPath ? ' ' : ',';
  const previousPoints = $path1[morphPointsSymbol];
  if (previousPoints) $path1.setAttribute(isPath ? 'd' : 'points', previousPoints);

  let v1 = '', v2 = '';

  if (!precision) {
    v1 = $path1.getAttribute(isPath ? 'd' : 'points');
    v2 = $path2.getAttribute(isPath ? 'd' : 'points');
  } else {
    const length1 = /** @type {SVGGeometryElement} */($path1).getTotalLength();
    const length2 = $path2.getTotalLength();
    const maxPoints = Math.max(Math.ceil(length1 * precision), Math.ceil(length2 * precision));
    for (let i = 0; i < maxPoints; i++) {
      const t = i / (maxPoints - 1);
      const pointOnPath1 = /** @type {SVGGeometryElement} */($path1).getPointAtLength(length1 * t);
      const pointOnPath2 = $path2.getPointAtLength(length2 * t);
      const prefix = isPath ? (i === 0 ? 'M' : 'L') : '';
      v1 += prefix + round(pointOnPath1.x, 3) + separator + pointOnPath1.y + ' ';
      v2 += prefix + round(pointOnPath2.x, 3) + separator + pointOnPath2.y + ' ';
    }
  }

  $path1[morphPointsSymbol] = v2;

  return [v1, v2];
};

/**
 * @param {SVGGeometryElement} $el
 * @param {Number} start
 * @param {Number} end
 * @return {Proxy}
 */
function createDrawableProxy($el, start, end) {
  const strokeLineCap = getComputedStyle($el).strokeLinecap;
  const pathLength = 100000;
  let currentCap = strokeLineCap;
  const proxy = new Proxy($el, {
    get(target, property) {
      const value = target[property];
      if (property === proxyTargetSymbol) return target;
      if (property === 'setAttribute') {
        /** @param {any[]} args */
        return (...args) => {
          if (args[0] === 'draw') {
            const value = args[1];
            const precision = globals.precision;
            const values = value.split(' ');
            const v1 = round(+values[0], precision);
            const v2 = round(+values[1], precision);

            // TOTO: Benchmark if performing two slices is more performant than one split

            // const spaceIndex = value.indexOf(' ');
            // const v1 = round(+value.slice(0, spaceIndex), precision);
            // const v2 = round(+value.slice(spaceIndex + 1), precision);

            const os = round((v1 * -pathLength), 0);
            const d1 = round((v2 * pathLength) + os, 0);
            const d2 = round(pathLength - d1, 0);
            // Handle cases where the cap is still visible when the line is completly hidden
            if (strokeLineCap !== 'butt') {
              const newCap = v1 === v2 ? 'butt' : strokeLineCap;
              if (currentCap !== newCap) {
                target.setAttribute('stroke-linecap', `${newCap}`);
                currentCap = newCap;
              }
            }
            target.setAttribute('stroke-dashoffset', `${os}`);
            target.setAttribute('stroke-dasharray', `${d1} ${d2}`);
          }
          return Reflect.apply(value, target, args);
        };
      }
      if (isFnc(value)) {
        /** @param {any[]} args */
        return (...args) => Reflect.apply(value, target, args);
      } else {
        return value;
      }
    }
  });
  if ($el.getAttribute('pathLength') !== `${pathLength}`) {
    $el.setAttribute('pathLength', `${pathLength}`);
    proxy.setAttribute('draw', `${start} ${end}`);
  }
  return /** @type {typeof Proxy} */(/** @type {unknown} */(proxy));
}

/**
 * @param {TargetsParam} selector
 * @param {Number} [start=0]
 * @param {Number} [end=0]
 * @return {Array.<Proxy>}
 */
const createDrawable = (selector, start = 0, end = 0) => {
  const els = /** @type {Array.<Proxy>} */((/** @type {unknown} */(parseTargets(selector))));
  els.forEach(($el, i) => els[i] = createDrawableProxy(/** @type {SVGGeometryElement} */(/** @type {unknown} */($el)), start, end));
  return els;
};

// Motion path animation

/**
 * @param {SVGGeometryElement} $path
 * @param {Number} progress
 * @param {Number}lookup
 * @return {DOMPoint}
 */
const getPathPoint = ($path, progress, lookup = 0) => {
  return $path.getPointAtLength(progress + lookup >= 1 ? progress + lookup : 0);
};

/**
 * @param {SVGGeometryElement} $path
 * @param {String} pathProperty
 * @return {FunctionValue}
 */
const getPathProgess = ($path, pathProperty) => {
  return $el => {
    const totalLength = +($path.getTotalLength());
    const inSvg = $el[isSvgSymbol];
    const ctm = $path.getCTM();
    /** @type {TweenObjectValue} */
    return {
      from: 0,
      to: totalLength,
      /** @type {TweenModifier} */
      modifier: progress => {
        if (pathProperty === 'a') {
          const p0 = getPathPoint($path, progress, -1);
          const p1 = getPathPoint($path, progress, +1);
          return atan2(p1.y - p0.y, p1.x - p0.x) * 180 / PI;
        } else {
          const p = getPathPoint($path, progress, 0);
          return pathProperty === 'x' ?
            inSvg ? p.x : p.x * ctm.a + p.y * ctm.c + ctm.e :
            inSvg ? p.y : p.x * ctm.b + p.y * ctm.d + ctm.f
        }
      }
    }
  }
};

/**
 * @param {TargetsParam} path
 */
const createMotionPath = path => {
  const $path = getPath(path);
  if (!$path) return;
  return {
    x: getPathProgess($path, 'x'),
    y: getPathProgess($path, 'y'),
    angle: getPathProgess($path, 'a'),
  }
};

// Check for valid SVG attribute

const cssReservedProperties = ['opacity', 'rotate', 'overflow', 'color'];

/**
 * @param  {Target} el
 * @param  {String} propertyName
 * @return {Boolean}
 */
const isValidSVGAttribute = (el, propertyName) => {
  // Return early and use CSS opacity animation instead (already better default values (opacity: 1 instead of 0)) and rotate should be considered a transform
  if (cssReservedProperties.includes(propertyName)) return false;
  if (propertyName in /** @type {DOMTarget} */(el).style || propertyName in el) {
    if (propertyName === 'scale') { // Scale
      const elParentNode = /** @type {SVGGeometryElement} */(/** @type {DOMTarget} */(el).parentNode);
      // Only consider scale as a valid SVG attribute on filter element
      return elParentNode && elParentNode.tagName === 'filter';
    }
    return true;
  }
};

const svg = {
  morphTo,
  createMotionPath,
  createDrawable,
};




/**
 * RGB / RGBA Color value string -> RGBA values array
 * @param  {String} rgbValue
 * @return {ColorArray}
 */
const rgbToRgba = rgbValue => {
  const rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
  const a = !isUnd(rgba[4]) ? +rgba[4] : 1;
  return [
    +rgba[1],
    +rgba[2],
    +rgba[3],
    a
  ]
};

/**
 * HEX3 / HEX3A / HEX6 / HEX6A Color value string -> RGBA values array
 * @param  {String} hexValue
 * @return {ColorArray}
 */
const hexToRgba = hexValue => {
  const hexLength = hexValue.length;
  const isShort = hexLength === 4 || hexLength === 5;
  return [
    +('0x' + hexValue[1] + hexValue[isShort ? 1 : 2]),
    +('0x' + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]),
    +('0x' + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]),
    ((hexLength === 5 || hexLength === 9) ? +(+('0x' + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1)
  ]
};

/**
 * @param  {Number} p
 * @param  {Number} q
 * @param  {Number} t
 * @return {Number}
 */
const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  return t < 1 / 6 ? p + (q - p) * 6 * t :
         t < 1 / 2 ? q :
         t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 :
         p;
};

/**
 * HSL / HSLA Color value string -> RGBA values array
 * @param  {String} hslValue
 * @return {ColorArray}
 */
const hslToRgba = hslValue => {
  const hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
  const h = +hsla[1] / 360;
  const s = +hsla[2] / 100;
  const l = +hsla[3] / 100;
  const a = !isUnd(hsla[4]) ? +hsla[4] : 1;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < .5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = round(hue2rgb(p, q, h + 1 / 3) * 255, 0);
    g = round(hue2rgb(p, q, h) * 255, 0);
    b = round(hue2rgb(p, q, h - 1 / 3) * 255, 0);
  }
  return [r, g, b, a];
};

/**
 * All in one color converter that converts a color string value into an array of RGBA values
 * @param  {String} colorString
 * @return {ColorArray}
 */
const convertColorStringValuesToRgbaArray = colorString => {
  return isRgb(colorString) ? rgbToRgba(colorString) :
         isHex(colorString) ? hexToRgba(colorString) :
         isHsl(colorString) ? hslToRgba(colorString) :
         [0, 0, 0, 1];
};




/**
 * @template T, D
 * @param {T|undefined} targetValue
 * @param {D} defaultValue
 * @return {T|D}
 */
const setValue = (targetValue, defaultValue) => {
  return isUnd(targetValue) ? defaultValue : targetValue;
};

/**
 * @param  {TweenPropValue} value
 * @param  {Target} target
 * @param  {Number} index
 * @param  {Number} total
 * @param  {Object} [store]
 * @return {any}
 */
const getFunctionValue = (value, target, index, total, store) => {
  if (isFnc(value)) {
    const func = () => {
      const computed = /** @type {Function} */(value)(target, index, total);
      // Fallback to 0 if the function returns undefined / NaN / null / false / 0
      return !isNaN(+computed) ? +computed : computed || 0;
    };
    if (store) {
      store.func = func;
    }
    return func();
  } else {
    return value;
  }
};

/**
 * @param  {Target} target
 * @param  {String} prop
 * @return {tweenTypes}
 */
const getTweenType = (target, prop) => {
  const type = !target[isDomSymbol] ? tweenTypes.OBJECT :
    // Handle SVG attributes
    target[isSvgSymbol] && isValidSVGAttribute(target, prop) ? tweenTypes.ATTRIBUTE :
    // Handle CSS Transform properties differently than CSS to allow individual animations
    validTransforms.includes(prop) || shortTransforms.get(prop) ? tweenTypes.TRANSFORM :
    // CSS variables
    stringStartsWith(prop, '--') ? tweenTypes.CSS_VAR :
    // All other CSS properties
    prop in /** @type {DOMTarget} */(target).style ? tweenTypes.CSS :
    // Handle DOM Attributes
    !isNil(/** @type {DOMTarget} */(target).getAttribute(prop)) ? tweenTypes.ATTRIBUTE :
    !isUnd(target[prop]) ? tweenTypes.OBJECT : tweenTypes.INVALID;
    if (type === tweenTypes.INVALID) console.warn(`Can't find property '${prop}' on target '${target}'.`);
  return type;
};

/**
 * @param  {DOMTarget} target
 * @param  {String} propName
 * @param  {Object} animationInlineStyles
 * @return {String}
 */
const getCSSValue = (target, propName, animationInlineStyles) => {
  const inlineStyles = target.style[propName];
  if (inlineStyles && animationInlineStyles) {
    animationInlineStyles[propName] = inlineStyles;
  }
  const value = inlineStyles || getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(propName);
  return value === 'auto' ? '0' : value;
};

/**
 * @param {Target} target
 * @param {String} propName
 * @param {tweenTypes} [tweenType]
 * @param {Object|void} [animationInlineStyles]
 * @return {String|Number}
 */
const getOriginalAnimatableValue = (target, propName, tweenType, animationInlineStyles) => {
  const type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
  return type === tweenTypes.OBJECT ? target[propName] || 0 :
         type === tweenTypes.ATTRIBUTE ? /** @type {DOMTarget} */(target).getAttribute(propName) :
         type === tweenTypes.TRANSFORM ? parseInlineTransforms(/** @type {DOMTarget} */(target), propName, animationInlineStyles) :
         type === tweenTypes.CSS_VAR ? getCSSValue(/** @type {DOMTarget} */(target), propName, animationInlineStyles).trimStart() :
         getCSSValue(/** @type {DOMTarget} */(target), propName, animationInlineStyles);
};

/**
 * @param  {Number} x
 * @param  {Number} y
 * @param  {String} operator
 * @return {Number}
 */
const getRelativeValue = (x, y, operator) => {
  return operator === '-' ? x - y :
         operator === '+' ? x + y :
         x * y;
};

/** @return {TweenDecomposedValue} */
const createDecomposedValueTargetObject = () => {
  return {
    /** @type {valueTypes} */
    t: valueTypes.NUMBER,
    n: 0,
    u: null,
    o: null,
    d: null,
    s: null,
  }
};

/**
 * @param  {String|Number} rawValue
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */
const decomposeRawValue = (rawValue, targetObject) => {
  /** @type {valueTypes} */
  targetObject.t = valueTypes.NUMBER;
  targetObject.n = 0;
  targetObject.u = null;
  targetObject.o = null;
  targetObject.d = null;
  targetObject.s = null;
  if (!rawValue) return targetObject;
  const num = +rawValue;
  if (!isNaN(num)) {
    // It's a number
    targetObject.n = num;
    return targetObject;
  } else {
    // let str = /** @type {String} */(rawValue).trim();
    let str = /** @type {String} */(rawValue);
    // Parsing operators (+=, -=, *=) manually is much faster than using regex here
    if (str[1] === '=') {
      targetObject.o = str[0];
      str = str.slice(2);
    }
    // Skip exec regex if the value type is complex or color to avoid long regex backtracking
    const unitMatch = str.includes(' ') ? false : unitsExecRgx.exec(str);
    if (unitMatch) {
      // Has a number and a unit
      targetObject.t = valueTypes.UNIT;
      targetObject.n = +unitMatch[1];
      targetObject.u = unitMatch[2];
      return targetObject;
    } else if (targetObject.o) {
      // Has an operator (+=, -=, *=)
      targetObject.n = +str;
      return targetObject;
    } else if (isCol(str)) {
      // Is a color
      targetObject.t = valueTypes.COLOR;
      targetObject.d = convertColorStringValuesToRgbaArray(str);
      return targetObject;
    } else {
      // Is a more complex string (generally svg coords, calc() or filters CSS values)
      const matchedNumbers = str.match(digitWithExponentRgx);
      targetObject.t = valueTypes.COMPLEX;
      targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
      targetObject.s = str.split(digitWithExponentRgx) || [];
      return targetObject;
    }
  }
};

/**
 * @param  {Tween} tween
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */
const decomposeTweenValue = (tween, targetObject) => {
  targetObject.t = tween._valueType;
  targetObject.n = tween._toNumber;
  targetObject.u = tween._unit;
  targetObject.o = null;
  targetObject.d = cloneArray(tween._toNumbers);
  targetObject.s = cloneArray(tween._strings);
  return targetObject;
};

const decomposedOriginalValue = createDecomposedValueTargetObject();




const propertyNamesCache = {};

/**
 * @param  {String} propertyName
 * @param  {Target} target
 * @param  {tweenTypes} tweenType
 * @return {String}
 */
const sanitizePropertyName = (propertyName, target, tweenType) => {
  if (tweenType === tweenTypes.TRANSFORM) {
    const t = shortTransforms.get(propertyName);
    return t ? t : propertyName;
  } else if (
    tweenType === tweenTypes.CSS ||
    // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
    // but properties like "baseFrequency" should stay in lowerCamelCase
    (tweenType === tweenTypes.ATTRIBUTE && (isSvg(target) && propertyName in /** @type {DOMTarget} */(target).style))
  ) {
    const cachedPropertyName = propertyNamesCache[propertyName];
    if (cachedPropertyName) {
      return cachedPropertyName;
    } else {
      const lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
      propertyNamesCache[propertyName] = lowerCaseName;
      return lowerCaseName;
    }
  } else {
    return propertyName;
  }
};




const angleUnitsMap = { 'deg': 1, 'rad': 180 / PI, 'turn': 360 };
const convertedValuesCache = {};

/**
 * @param  {DOMTarget} el
 * @param  {TweenDecomposedValue} decomposedValue
 * @param  {String} unit
 * @param  {Boolean} [force]
 * @return {TweenDecomposedValue}
 */
const convertValueUnit = (el, decomposedValue, unit, force = false) => {
  const currentUnit = decomposedValue.u;
  const currentNumber = decomposedValue.n;
  if (decomposedValue.t === valueTypes.UNIT && currentUnit === unit) { // TODO: Check if checking against the same unit string is necessary
    return decomposedValue;
  }
  const cachedKey = currentNumber + currentUnit + unit;
  const cached = convertedValuesCache[cachedKey];
  if (!isUnd(cached) && !force) {
    decomposedValue.n = cached;
  } else {
    let convertedValue;
    if (currentUnit in angleUnitsMap) {
      convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
    } else {
      const baseline = 100;
      const tempEl = /** @type {DOMTarget} */(el.cloneNode());
      const parentNode = el.parentNode;
      const parentEl = (parentNode && (parentNode !== doc)) ? parentNode : doc.body;
      parentEl.appendChild(tempEl);
      const elStyle = tempEl.style;
      elStyle.width = baseline + currentUnit;
      const currentUnitWidth = /** @type {HTMLElement} */(tempEl).offsetWidth || baseline;
      elStyle.width = baseline + unit;
      const newUnitWidth = /** @type {HTMLElement} */(tempEl).offsetWidth || baseline;
      const factor = currentUnitWidth / newUnitWidth;
      parentEl.removeChild(tempEl);
      convertedValue = factor * currentNumber;
    }
    decomposedValue.n = convertedValue;
    convertedValuesCache[cachedKey] = convertedValue;
  }
  decomposedValue.t === valueTypes.UNIT;
  decomposedValue.u = unit;
  return decomposedValue;
};




const lookups = {
  /** @type {TweenReplaceLookups} */
  _rep: new WeakMap(),
  /** @type {TweenAdditiveLookups} */
  _add: new Map(),
};

/**
 * @param  {Target} target
 * @param  {String} property
 * @param  {String} lookup
 * @return {TweenPropertySiblings}
 */
const getTweenSiblings = (target, property, lookup = '_rep') => {
  const lookupMap = lookups[lookup];
  let targetLookup = lookupMap.get(target);
  if (!targetLookup) {
    targetLookup = {};
    lookupMap.set(target, targetLookup);
  }
  return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
    _head: null,
    _tail: null,
  }
};

/**
 * @param  {Tween} p
 * @param  {Tween} c
 * @return {Number|Boolean}
 */
const addTweenSortMethod = (p, c) => {
  return p._isOverridden || p._absoluteStartTime > c._absoluteStartTime;
};

/**
 * @param {Tween} tween
 */
const overrideTween = tween => {
  tween._isOverlapped = 1;
  tween._isOverridden = 1;
  tween._changeDuration = minValue;
  tween._currentTime = minValue;
};

/**
 * @param  {Tween} tween
 * @param  {TweenPropertySiblings} siblings
 * @return {Tween}
 */
const composeTween = (tween, siblings) => {

  const tweenCompositionType = tween._composition;

  // Handle replaced tweens

  if (tweenCompositionType === compositionTypes.replace) {

    const tweenAbsStartTime = tween._absoluteStartTime;

    addChild(siblings, tween, addTweenSortMethod, '_prevRep', '_nextRep');

    const prevSibling = tween._prevRep;

    // Update the previous siblings for composition replace tweens

    if (prevSibling) {

      const prevParent = prevSibling.parent;
      const prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;

      // Handle looped animations tween

      if (
        // Check if the previous tween is from a different animation
        tween.parent.id !== prevParent.id &&
        // Check if the animation has loops
        prevParent._iterationCount > 1 &&
        // Check if _absoluteChangeEndTime of last loop overlaps the current tween
        prevAbsEndTime + (prevParent.duration - prevParent._iterationDuration) > tweenAbsStartTime
      ) {

        // TODO: Find a way to only override the iterations overlapping with the tween
        overrideTween(prevSibling);

        let prevPrevSibling = prevSibling._prevRep;

        // If the tween was part of a set of keyframes, override its siblings
        while (prevPrevSibling && prevPrevSibling.parent.id === prevParent.id) {
          overrideTween(prevPrevSibling);
          prevPrevSibling = prevPrevSibling._prevRep;
        }

      }

      const absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;

      if (prevAbsEndTime > absoluteUpdateStartTime) {

        const prevChangeStartTime = prevSibling._startTime;
        const prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);

        // prevSibling._absoluteEndTime = absoluteUpdateStartTime;
        prevSibling._changeDuration = absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime;
        prevSibling._currentTime = prevSibling._changeDuration;
        prevSibling._isOverlapped = 1;

        if (prevSibling._changeDuration < minValue) {
          overrideTween(prevSibling);
          // removeChild(siblings, prevSibling, '_prevRep', '_nextRep');
          // addChild(siblings, tween, addTweenSortMethod, '_prevRep', '_nextRep');
        }
      }

      // Pause (and cancel) the parent if it only contains overriden tweens

      let parentActiveAnimation = 0;

      forEachChildren(prevParent, (/** @type Tween */t) => {
        parentActiveAnimation -= t._isOverridden - 1;
      });

      if (parentActiveAnimation === 0) {
        // Calling .cancel() on a TL child might alter the other children render order
        // So instead, we mark it as completed + .pause()
        // This way we let the engine taking care of removing it safely
        prevParent.completed = true;
        prevParent.pause();
      }

    }

    // let nextSibling = tween._nextRep;

    // // All the next siblings are automatically overridden

    // if (nextSibling && nextSibling._absoluteStartTime >= tweenAbsStartTime) {
    //   while (nextSibling) {
    //     overrideTween(nextSibling);
    //     nextSibling = nextSibling._nextRep;
    //   }
    // }

    // if (nextSibling && nextSibling._absoluteStartTime < tweenAbsStartTime) {
    //   while (nextSibling) {
    //     overrideTween(nextSibling);
    //     console.log(tween.id, nextSibling.id);
    //     nextSibling = nextSibling._nextRep;
    //   }
    // }

  // Handle additive tweens composition

  } else if (tweenCompositionType === compositionTypes.blend) {

    const additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, '_add');
    const additiveAnimation = addAdditiveAnimation(lookups._add);

    let lookupTween = additiveTweenSiblings._head;

    if (!lookupTween) {
      lookupTween = { ...tween };
      lookupTween._composition = compositionTypes.replace;
      lookupTween._updateDuration = minValue;
      lookupTween._startTime = 0;
      lookupTween._numbers = cloneArray(tween._fromNumbers);
      lookupTween._number = 0;
      lookupTween._next = null;
      lookupTween._prev = null;
      addChild(additiveTweenSiblings, lookupTween);
      addChild(additiveAnimation, lookupTween);
    }

    // Convert the values of TO to FROM and set TO to 0

    const toNumber = tween._toNumber;
    tween._fromNumber = lookupTween._fromNumber - toNumber;
    tween._toNumber = 0;
    tween._numbers = cloneArray(tween._fromNumbers);
    tween._number = 0;
    lookupTween._fromNumber = toNumber;

    if (tween._toNumbers) {
      const toNumbers = cloneArray(tween._toNumbers);
      if (toNumbers) {
        toNumbers.forEach((value, i) => {
          tween._fromNumbers[i] = lookupTween._fromNumbers[i] - value;
          tween._toNumbers[i] = 0;
        });
      }
      lookupTween._fromNumbers = toNumbers;
    }

    addChild(additiveTweenSiblings, tween, null, '_prevAdd', '_nextAdd');

  }

  return tween;

};

/**
 * @param  {Tween} tween
 * @return {Tween}
 */
const removeTweenSliblings = tween => {
  const tweenComposition = tween._composition;
  if (tweenComposition !== compositionTypes.none) {
    const tweenTarget = tween.target;
    const tweenProperty = tween.property;
    const replaceTweensLookup = lookups._rep;
    const replaceTargetProps = replaceTweensLookup.get(tweenTarget);
    const tweenReplaceSiblings = replaceTargetProps[tweenProperty];
    removeChild(tweenReplaceSiblings, tween, '_prevRep', '_nextRep');
    if (tweenComposition === compositionTypes.blend) {
      const addTweensLookup = lookups._add;
      const addTargetProps = addTweensLookup.get(tweenTarget);
      if (!addTargetProps) return;
      const additiveTweenSiblings = addTargetProps[tweenProperty];
      const additiveAnimation = additive.animation;
      removeChild(additiveTweenSiblings, tween, '_prevAdd', '_nextAdd');
      // If only one tween is left in the additive lookup, it's the tween lookup
      const lookupTween = additiveTweenSiblings._head;
      if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
        removeChild(additiveTweenSiblings, lookupTween, '_prevAdd', '_nextAdd');
        removeChild(additiveAnimation, lookupTween);
        let shouldClean = true;
        for (let prop in addTargetProps) {
          if (addTargetProps[prop]._head) {
            shouldClean = false;
            break;
          }
        }
        if (shouldClean) {
          addTweensLookup.delete(tweenTarget);
        }
      }
    }
  }
  return tween;
};




/**
 * @param  {Timer} timer
 * @return {Timer}
 */
const resetTimerProperties = timer => {
  timer.paused = true;
  timer.began = false;
  timer.completed = false;
  return timer;
};

/**
 * @param  {Timer} timer
 * @return {Timer}
 */
const reviveTimer = timer => {
  if (!timer._cancelled) return timer;
  if (timer._hasChildren) {
    forEachChildren(timer, reviveTimer);
  } else {
    forEachChildren(timer, (/** @type {Tween} tween*/tween) => {
      if (tween._composition !== compositionTypes.none) {
        composeTween(tween, getTweenSiblings(tween.target, tween.property));
      }
    });
  }
  timer._cancelled = 0;
  return timer;
};

let timerId = 0;

/**
 * Base class used to create Timers, Animations and Timelines
 */
class Timer extends Clock {
  /**
   * @param {TimerParams} [parameters]
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   */
  constructor(parameters = {}, parent = null, parentPosition = 0) {

    super();

    const {
      id,
      delay,
      duration,
      reversed,
      alternate,
      loop,
      loopDelay,
      autoplay,
      frameRate,
      playbackRate,
      onComplete,
      onLoop,
      onBegin,
      onUpdate,
    } = parameters;
    const timerInitTime = parent ? 0 : engine._elapsedTime;
    const timerDefaults = parent ? parent.defaults : globals.defaults;
    const timerDelay = /** @type {Number} */(isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay);
    const timerDuration = isFnc(duration) || isUnd(duration) ? Infinity : +duration;
    const timerLoop = setValue(loop, timerDefaults.loop);
    const timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
    const timerIterationCount = timerLoop === true ||
                                timerLoop === Infinity ||
                                /** @type {Number} */(timerLoop) < 0 ? Infinity :
                                /** @type {Number} */(timerLoop) + 1;

    // Timer's parameters
    this.id = !isUnd(id) ? id : duration === minValue ? 0 : ++timerId;
    /** @type {Timeline} */
    this.parent = parent;
    // Total duration of the timer
    this.duration = clampInfinity(((timerDuration + timerLoopDelay) * timerIterationCount) - timerLoopDelay) || minValue;
    /** @type {Boolean} */
    this.paused = true;
    /** @type {Boolean} */
    this.began = false;
    /** @type {Boolean} */
    this.completed = false;
    /** @type {Number} */
    this.reversed = +setValue(reversed, timerDefaults.reversed);
    /** @type {TimerCallback} */
    this.onBegin = onBegin || timerDefaults.onBegin;
    /** @type {TimerCallback} */
    this.onUpdate = onUpdate || timerDefaults.onUpdate;
    /** @type {TimerCallback} */
    this.onLoop = onLoop || timerDefaults.onLoop;
    /** @type {TimerCallback} */
    this.onComplete = onComplete || timerDefaults.onComplete;
    /** @type {Boolean|ScrollObserver} */
    this._autoplay = parent ? false : setValue(autoplay, timerDefaults.autoplay);
    /** @type {Number} */
    this._offset = parent ? parentPosition : engine._elapsedTime - engine._startTime;
    /** @type {Number} */
    this._delay = timerDelay;
    /** @type {Number} */
    this._loopDelay = timerLoopDelay;
    /** @type {Number} */
    this._iterationTime = 0;
    /** @type {Number} */
    this._iterationDuration = timerDuration; // Duration of one loop
    /** @type {Number} */
    this._iterationCount = timerIterationCount; // Number of loops
    /** @type {Number} */
    this._currentIteration = 0; // Current loop index
    /** @type {Function} */
    this._resolve = noop; // Used by .then()
    /** @type {Boolean} */
    this._hasChildren = false;
    /** @type {Boolean} */
    this._running = false;
    /** @type {Number} */
    this._cancelled = 0;
    /** @type {Number} */
    this._reversed = this.reversed;
    /** @type {Boolean} */
    this._alternate = setValue(alternate, timerDefaults.alternate);
    /** @type {Boolean} */
    this._backwards = false;
    /** @type {Renderable} */
    this._prev = null;
    /** @type {Renderable} */
    this._next = null;

    // Clock's parameters
    /** @type {Number} */
    this._elapsedTime = timerInitTime;
    /** @type {Number} */
    this._startTime = timerInitTime;
    /** @type {Number} */
    this._lastTime = timerInitTime;
    /** @type {Number} */
    this._fps = setValue(frameRate, timerDefaults.frameRate);
    /** @type {Number} */
    this._speed = setValue(playbackRate, timerDefaults.playbackRate);
  }

  get progress() {
    return round(this.currentTime / this.duration, 6);
  }

  set progress(progress) {
    const paused = this.paused;
    // Pausing the timer is necessary to avoid time jumps
    this.pause().seek(this.duration * +progress);
    if (!paused) this.play();
  }

  // get currentTime() {
  //   return this._time;
  // }

  // set currentTime(time) {
  //   this.seek(+time);
  // }

  get playbackRate() {
    return super.playbackRate;
  }

  set playbackRate(playbackRate) {
    super.playbackRate = playbackRate;
    this.resetTime();
  }

  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  reset(internalRender = 0) {
    // If cancelled, revive the timer before rendering in order to have propertly composed tweens siblings
    reviveTimer(this);
    if (!this._reversed !== !this.reversed) {
      this.reverse();
    }
    // Rendering before updating the completed parameter to prevent skips and to make sure the properties are not overridden
    // Setting the iterationTime at the end to force the rendering to happend backwards, otherwise calling .reset() on Timelines might not render children in the right order
    // NOTE: This is only required for Timelines and might be better to move to the Timeline class?
    this._iterationTime = this._iterationDuration;
    // Set tickMode to tickModes.FORCE to force rendering
    tick(this, 0, 1, internalRender, tickModes.FORCE);
    // Reset timer properties after revive / render to make sure the props are not updated again
    resetTimerProperties(this);
    // Also reset children properties
    if (this._hasChildren) {
      forEachChildren(this, resetTimerProperties);
    }
    return this;
  }

  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  init(internalRender = 0) {
    this.frameRate = this._fps;
    this.playbackRate = this._speed;
    // Manually calling .init() on timelines should render all children intial state
    // Forces all children to render once then render to 0 when reseted
    if (!internalRender && this._hasChildren) {
      tick(this, this.duration, 1, internalRender, tickModes.FORCE);
    }
    // Make sure to set autoplay to false if timer has a parent
    const autoplay = this._autoplay;
    this.reset(internalRender);
    if (autoplay === true) {
      this.play();
    } else if (!internalRender && autoplay && !isUnd(autoplay.linked)) {
      autoplay.link(this);
    }
    // const forcedAutoplay = autoplay === true;
    // this.reset(forcedAutoplay ? 1 : 0);
    // if (forcedAutoplay) {
    //   this.play();
    // } else if (!internalRender && autoplay && !isUnd(autoplay.linked)) {
    //   autoplay.link(this);
    // }
    return this;
  }

  /**
   * @return {this}
   */
  resetTime() {
    const timeScale = 1 / (this._speed * engine._speed);
    // Offset by 12 ms to reduce the lag between the initialization and the rendering of the first frame
    this._startTime = now() - (this.currentTime + this._delay) * timeScale - 12;
    return this;
  }

  /**
   * @return {this}
   */
  pause() {
    if (this.paused) return this;
    this.paused = true;
    return this;
  }

  /**
   * @return {this}
   */
  play() {
    if (!this.paused) return this;
    this.paused = false;
    if (this.duration <= minValue) {
      // timer, time = minValue, muteCallbacks = 0, internalRendering = 0, tickMode = 0
      tick(this, minValue, 0, 0, tickModes.FORCE);
    } else {
      if (!this._running) {
        addChild(engine, this);
        engine._hasChildren = true;
        this._running = true;
      }
      this.resetTime();
      engine.resume();
    }
    return this;
  }

  /**
   * @return {this}
   */
  restart() {
    return this.reset(0).play();
  }

  /**
   * @param  {Number} time
   * @param  {Boolean|Number} [muteCallbacks]
   * @param  {Boolean|Number} [internalRender]
   * @return {this}
   */
  seek(time, muteCallbacks = 0, internalRender = 0) {
    // Recompose the tween siblings in case the timer has been cancelled
    reviveTimer(this);
    // If you seek a completed animation, otherwise the next play will starts at 0
    this.completed = false;
    const isPaused = this.paused;
    this.paused = true;
    // timer, time, muteCallbacks, internalRender, tickMode
    tick(this, time + this._delay, ~~muteCallbacks, ~~internalRender, tickModes.AUTO);
    return isPaused ? this : this.play();
  }

  /**
   * @return {this}
   */
  reverse() {
    const reversed = this.reversed;
    this.reversed = +(this._alternate && !(this._iterationCount % 2) ? reversed : !reversed);
    this.seek(this.duration - this.currentTime);
    this.resetTime();
    return this;
  }

  playForward() {
    return this.reversed ? this.reverse().play() : this.play();
  }

  playBackward() {
    return !this.reversed ? this.reverse().play() : this.play();
  }

  // TODO: Move all the animation / tweens / children related code to Animation / Timeline

  /**
   * @return {this}
   */
  cancel() {
    if (this._hasChildren) {
      forEachChildren(this, (/** @type {Renderable} */child) => child.cancel(), true);
    } else {
      forEachChildren(this, removeTweenSliblings);
    }
    this._cancelled = 1;
    // Pausing the timer removes it from the engine
    return this.pause();
  }

  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    this.duration = clampZero(clampInfinity(round(currentDuration * timeScale, 12)));
    this._iterationDuration = clampZero(clampInfinity(round(this._iterationDuration * timeScale, 12)));
    this._offset *= timeScale;
    this._delay *= timeScale;
    this._loopDelay *= timeScale;
    return this;
  }

 /**
   * Cancel the timer by seeking it back to 0 and reverting the attached scroller if necessary
   * @return {this}
   */
  revert() {
    tick(this, 0, 1, 0, tickModes.FORCE);
    // this.cancel();
    return this.cancel();
  }

  /**
   * @param  {TimerCallback} [callback]
   * @return {Promise}
   */
  then(callback = noop) {
    const then = this.then;
    const onResolve = () => {
      // this.then = null prevents infinite recursion if returned by an async function
      // https://github.com/juliangarnierorg/anime-beta/issues/26
      this.then = null;
      callback(this);
      this.then = then;
      this._resolve = noop;
    };
    return new Promise(r => {
      this._resolve = () => r(onResolve());
      // Make sure to resolve imediatly if the timer has already completed
      if (this.completed) this._resolve();
      return this;
    });
  }

}




/**
 * @template {Renderable} T
 * @param {T} renderable
 * @return {T}
 */
const cleanInlineStyles = renderable => {
  // Allow cleanInlineStyles() to be called on timelines
  if (renderable._hasChildren) {
    forEachChildren(renderable, cleanInlineStyles, true);
  } else {
    const animation = /** @type {Animation} */(renderable);
    animation.pause();
    forEachChildren(animation, (/** @type {Tween} */tween) => {
      const tweenProperty = tween.property;
      const tweenTarget = tween.target;
      if (tweenTarget[isDomSymbol]) {
        const targetStyle = /** @type {DOMTarget} */(tweenTarget).style;
        const originalInlinedValue = animation._inlineStyles[tweenProperty];
        if (tween._tweenType === tweenTypes.TRANSFORM) {
          const cachedTransforms = tweenTarget[transformsSymbol];
          if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
            delete cachedTransforms[tweenProperty];
          } else {
            cachedTransforms[tweenProperty] = originalInlinedValue;
          }
          if (tween._renderTransforms) {
            if (!Object.keys(cachedTransforms).length) {
              targetStyle.removeProperty('transform');
            } else {
              let str = emptyString;
              for (let key in cachedTransforms) {
                str += transformsFragmentStrings[key] + cachedTransforms[key] + ') ';
              }
              targetStyle.transform = str;
            }
          }
        } else {
          if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
            targetStyle.removeProperty(tweenProperty);
          } else {
            targetStyle[tweenProperty] = originalInlinedValue;
          }
        }
        if (animation._tail === tween) {
          animation.targets.forEach(t => {
            if (t.getAttribute && t.getAttribute('style') === emptyString) {
              t.removeAttribute('style');
            }          });
        }
      }
    });
  }
  return renderable;
};

// Defines decomposed values target objects only once and mutate their properties later to avoid GC
// TODO: Maybe move the objects creation to values.js and use the decompose function to create the base object
const fromTargetObject = createDecomposedValueTargetObject();
const toTargetObject = createDecomposedValueTargetObject();
const toFunctionStore = { func: null };
const keyframesTargetArray = [null];
const fastSetValuesArray = [null, null];
/** @type {TweenKeyValue} */
const keyObjectTarget = { to: null };

let tweenId = 0;
let keyframes;
/** @type {TweenParamsOptions & TweenValues} */
let key;

/**
 * @param {DurationKeyframes | PercentageKeyframes} keyframes
 * @param {AnimationParams} parameters
 * @return {AnimationParams}
 */
const generateKeyframes = (keyframes, parameters) => {
  /** @type {AnimationParams} */
  const properties = {};
  if (isArr(keyframes)) {
    const propertyNames = [].concat(.../** @type {DurationKeyframes} */(keyframes).map(key => Object.keys(key))).filter(isKey);
    for (let i = 0, l = propertyNames.length; i < l; i++) {
      const propName = propertyNames[i];
      const propArray = /** @type {DurationKeyframes} */(keyframes).map(key => {
        /** @type {TweenKeyValue} */
        const newKey = {};
        for (let p in key) {
          const keyValue = /** @type {TweenPropValue} */(key[p]);
          if (isKey(p)) {
            if (p === propName) {
              newKey.to = keyValue;
            }
          } else {
            newKey[p] = keyValue;
          }
        }
        return newKey;
      });
      properties[propName] = /** @type {ArraySyntaxValue} */(propArray);
    }

  } else {
    const totalDuration = /** @type {Number} */(setValue(parameters.duration, globals.defaults.duration));
    const keys = Object.keys(keyframes)
    .map(key => { return {o: parseFloat(key) / 100, p: keyframes[key]} })
    .sort((a, b) => a.o - b.o);
    keys.forEach(key => {
      const offset = key.o;
      const prop = key.p;
      for (let name in prop) {
        if (isKey(name)) {
          let propArray = /** @type {Array} */(properties[name]);
          if (!propArray) propArray = properties[name] = [];
          const duration = offset * totalDuration;
          let length = propArray.length;
          let prevKey = propArray[length - 1];
          const keyObj = { to: prop[name] };
          let durProgress = 0;
          for (let i = 0; i < length; i++) {
            durProgress += propArray[i].duration;
          }
          if (length === 1) {
            keyObj.from = prevKey.to;
          }
          if (prop.ease) {
            keyObj.ease = prop.ease;
          }
          keyObj.duration = duration - (length ? durProgress : 0);
          propArray.push(keyObj);
        }
      }
      return key;
    });

    for (let name in properties) {
      const propArray = /** @type {Array} */(properties[name]);
      let prevEase;
      // let durProgress = 0
      for (let i = 0, l = propArray.length; i < l; i++) {
        const prop = propArray[i];
        const currentEase = prop.ease;
        if (prevEase) prop.ease = prevEase;
        prevEase = currentEase;
        // durProgress += prop.duration;
        // if (i === l - 1 && durProgress !== totalDuration) {
        //   propArray.push({ from: prop.to, ease: prop.ease, duration: totalDuration - durProgress })
        // }
      }
      if (!propArray[0].duration) {
        propArray.shift();
      }
    }
  }

  return properties;
};

class Animation extends Timer {
  /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   * @param {Boolean} [fastSet=false]
   * @param {Number} [index=0]
   * @param {Number} [length=0]
   */
  constructor(
    targets,
    parameters,
    parent,
    parentPosition,
    fastSet = false,
    index = 0,
    length = 0
  ) {

    super(/** @type {TimerParams} */(parameters), parent, parentPosition);

    /** @type {Tween} */
    this._head = null;
    /** @type {Tween} */
    this._tail = null;

    const parsedTargets = registerTargets(targets);
    const targetsLength = parsedTargets.length;

    // If the parameters object contains a "keyframes" property, convert all the keyframes values to regular properties

    const kfParams = /** @type {AnimationParams} */(parameters).keyframes;
    const params = /** @type {AnimationParams} */(kfParams ? mergeObjects(generateKeyframes(/** @type {DurationKeyframes} */(kfParams), parameters), parameters) : parameters);

    const { delay, duration, ease, playbackEase, modifier, composition, onRender } = params;

    const animDefaults = parent ? parent.defaults : globals.defaults;
    const animaPlaybackEase = setValue(playbackEase, animDefaults.playbackEase);
    const animEase = animaPlaybackEase ? parseEasings(animaPlaybackEase) : null;
    const hasSpring = !isUnd(ease) && !isUnd(/** @type {Spring} */(ease).ease);
    const tEasing = hasSpring ? /** @type {Spring} */(ease).ease : setValue(ease, animEase ? 'linear' : animDefaults.ease);
    const tDuration = hasSpring ? /** @type {Spring} */(ease).duration : setValue(duration, animDefaults.duration);
    const tDelay = setValue(delay, animDefaults.delay);
    const tModifier = modifier || animDefaults.modifier;
    // If no composition is defined and the targets length is high (>= 1000) set the composition to 'none' (0) for faster tween creation
    const tComposition = isUnd(composition) && targetsLength >= K ? compositionTypes.none : !isUnd(composition) ? composition : animDefaults.composition;
    // TODO: Do not create an empty object until we know the animation will generate inline styles
    const animInlineStyles = {};
    // const absoluteOffsetTime = this._offset;
    const absoluteOffsetTime = this._offset + (parent ? parent._offset : 0);

    let iterationDuration = NaN;
    let iterationDelay = NaN;
    let animationAnimationLength = 0;

    for (let targetIndex = 0; targetIndex < targetsLength; targetIndex++) {

      const target = parsedTargets[targetIndex];
      const ti = index || targetIndex;
      const tl = length || targetsLength;

      let lastTransformGroupIndex = NaN;
      let lastTransformGroupLength = NaN;

      for (let p in params) {

        if (isKey(p)) {

          const tweenType = getTweenType(target, p);

          if (tweenType !== tweenTypes.INVALID) {

            const propName = sanitizePropertyName(p, target, tweenType);

            let propValue = params[p];

            if (fastSet) {
              fastSetValuesArray[0] = propValue;
              fastSetValuesArray[1] = propValue;
              propValue = fastSetValuesArray;
            }

            // Normalize property values to valid keyframe syntax:
            // [x, y] to [{to: [x, y]}] or {to: x} to [{to: x}] or keep keys syntax [{}, {}, {}...]
            // const keyframes = isArr(propValue) ? propValue.length === 2 && !isObj(propValue[0]) ? [{ to: propValue }] : propValue : [propValue];
            if (isArr(propValue)) {
              const arrayLength = /** @type {Array} */(propValue).length;
              const isNotObjectValue = !isObj(propValue[0]);
              // Convert [x, y] to [{to: [x, y]}]
              if (arrayLength === 2 && isNotObjectValue) {
                keyObjectTarget.to = /** @type {TweenParamValue} */(/** @type {unknown} */(propValue));
                keyframesTargetArray[0] = keyObjectTarget;
                keyframes = keyframesTargetArray;
              // Convert [x, y, z] to [[x, y], z]
              } else if (arrayLength > 2 && isNotObjectValue) {
                keyframes = [];
                /** @type {Array.<Number>} */(propValue).forEach((v, i) => {
                  if (!i) {
                    fastSetValuesArray[0] = v;
                  } else if (i === 1) {
                    fastSetValuesArray[1] = v;
                    keyframes.push(fastSetValuesArray);
                  } else {
                    keyframes.push(v);
                  }
                });
              } else {
                keyframes = /** @type {Array.<TweenKeyValue>} */(propValue);
              }
            } else {
              keyframesTargetArray[0] = propValue;
              keyframes = keyframesTargetArray;
            }

            let siblings = null;
            let prevTween = null;
            let firstTweenChangeStartTime = NaN;
            let lastTweenChangeEndTime = 0;
            let tweenIndex = 0;

            for (let l = keyframes.length; tweenIndex < l; tweenIndex++) {

              const keyframe = keyframes[tweenIndex];

              if (isObj(keyframe)) {
                key = keyframe;
              } else {
                keyObjectTarget.to = /** @type {TweenParamValue} */(keyframe);
                key = keyObjectTarget;
              }

              toFunctionStore.func = null;

              const computedToValue = getFunctionValue(key.to, target, ti, tl, toFunctionStore);
              let tweenToValue;
              // Allows function based values to return an object syntax value ({to: v})
              if (isObj(computedToValue) && !isUnd(computedToValue.to)) {
                key = computedToValue;
                tweenToValue = computedToValue.to;
              } else {
                tweenToValue = computedToValue;
              }
              const tweenFromValue = getFunctionValue(key.from, target, ti, tl);
              const keyEasing = key.ease;
              const hasSpring = !isUnd(keyEasing) && !isUnd(/** @type {Spring} */(keyEasing).ease);
              // Easing are treated differently and don't accept function based value to prevent having to pass a function wrapper that returns an other function all the time
              const tweenEasing = hasSpring ? /** @type {Spring} */(keyEasing).ease : keyEasing || tEasing;
              // Calculate default individual keyframe duration by dividing the tl of keyframes
              const tweenDuration = hasSpring ? /** @type {Spring} */(keyEasing).duration : getFunctionValue(setValue(key.duration, (l > 1 ? getFunctionValue(tDuration, target, ti, tl) / l : tDuration)), target, ti, tl);
              // Default delay value should only be applied to the first tween
              const tweenDelay = getFunctionValue(setValue(key.delay, (!tweenIndex ? tDelay : 0)), target, ti, tl);
              const computedComposition = getFunctionValue(setValue(key.composition, tComposition), target, ti, tl);
              const tweenComposition = isNum(computedComposition) ? computedComposition : compositionTypes[computedComposition];
              // Modifiers are treated differently and don't accept function based value to prevent having to pass a function wrapper
              const tweenModifier = key.modifier || tModifier;
              const isFromToArray = isArr(tweenToValue);
              const isFromToValue = isFromToArray || (!isUnd(tweenFromValue) && !isUnd(tweenToValue));
              const tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
              const absoluteStartTime = absoluteOffsetTime + tweenStartTime;

              let prevSibling = prevTween;

              if (tweenComposition !== compositionTypes.none) {
                if (!siblings) siblings = getTweenSiblings(target, propName);
                let nextSibling = siblings._head;
                // Iterate trough all the next siblings until we find a sibling with an equal or inferior start time
                while (nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime) {
                  prevSibling = nextSibling;
                  nextSibling = nextSibling._nextRep;
                  // Overrides all the next siblings if the next sibling starts at the same time of after as the new tween start time
                  if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                    while (nextSibling) {
                      overrideTween(nextSibling);
                      // This will ends both the current while loop and the upper one once all the next sibllings have been overriden
                      nextSibling = nextSibling._nextRep;
                    }
                  }
                }
              }

              // Decompose values
              if (isFromToValue) {
                decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[0], target, ti, tl) : tweenFromValue, fromTargetObject);
                decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[1], target, ti, tl, toFunctionStore) : tweenToValue, toTargetObject);
                if (fromTargetObject.t === valueTypes.NUMBER) {
                  if (prevSibling) {
                    if (prevSibling._valueType === valueTypes.UNIT) {
                      fromTargetObject.t = valueTypes.UNIT;
                      fromTargetObject.u = prevSibling._unit;
                    }
                  } else {
                    decomposeRawValue(
                      getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles),
                      decomposedOriginalValue
                    );
                    if (decomposedOriginalValue.t === valueTypes.UNIT) {
                      fromTargetObject.t = valueTypes.UNIT;
                      fromTargetObject.u = decomposedOriginalValue.u;
                    }
                  }
                }
              } else {
                if (!isUnd(tweenToValue)) {
                  decomposeRawValue(tweenToValue, toTargetObject);
                } else {
                  if (prevTween) {
                    decomposeTweenValue(prevTween, toTargetObject);
                  } else {
                    // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                    decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value :
                    getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), toTargetObject);
                  }
                }
                if (!isUnd(tweenFromValue)) {
                  decomposeRawValue(tweenFromValue, fromTargetObject);
                } else {
                  if (prevTween) {
                    decomposeTweenValue(prevTween, fromTargetObject);
                  } else {
                    decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value :
                    // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                    getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), fromTargetObject);
                  }
                }
              }

              // Apply operators
              if (fromTargetObject.o) {
                fromTargetObject.n = getRelativeValue(
                  !prevSibling ? decomposeRawValue(
                    getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles),
                    decomposedOriginalValue
                  ).n : prevSibling._toNumber,
                  fromTargetObject.n,
                  fromTargetObject.o
                );
              }

              if (toTargetObject.o) {
                toTargetObject.n = getRelativeValue(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
              }

              // Values omogenisation in cases of type difference between "from" and "to"
              if (fromTargetObject.t !== toTargetObject.t) {
                if (fromTargetObject.t === valueTypes.COMPLEX || toTargetObject.t === valueTypes.COMPLEX) {
                  const complexValue = fromTargetObject.t === valueTypes.COMPLEX ? fromTargetObject : toTargetObject;
                  const notComplexValue = fromTargetObject.t === valueTypes.COMPLEX ? toTargetObject : fromTargetObject;
                  notComplexValue.t = valueTypes.COMPLEX;
                  notComplexValue.s = cloneArray(complexValue.s);
                  notComplexValue.d = complexValue.d.map(() => notComplexValue.n);
                } else if (fromTargetObject.t === valueTypes.UNIT || toTargetObject.t === valueTypes.UNIT) {
                  const unitValue = fromTargetObject.t === valueTypes.UNIT ? fromTargetObject : toTargetObject;
                  const notUnitValue = fromTargetObject.t === valueTypes.UNIT ? toTargetObject : fromTargetObject;
                  notUnitValue.t = valueTypes.UNIT;
                  notUnitValue.u = unitValue.u;
                } else if (fromTargetObject.t === valueTypes.COLOR || toTargetObject.t === valueTypes.COLOR) {
                  const colorValue = fromTargetObject.t === valueTypes.COLOR ? fromTargetObject : toTargetObject;
                  const notColorValue = fromTargetObject.t === valueTypes.COLOR ? toTargetObject : fromTargetObject;
                  notColorValue.t = valueTypes.COLOR;
                  notColorValue.s = colorValue.s;
                  notColorValue.d = [0, 0, 0, 1];
                }
              }

              // Unit conversion
              if (fromTargetObject.u !== toTargetObject.u) {
                let valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
                valueToConvert = convertValueUnit(/** @type {DOMTarget} */(target), valueToConvert, toTargetObject.u ? toTargetObject.u : fromTargetObject.u, false);
                // TODO:
                // convertValueUnit(target, to.u ? from : to, to.u ? to.u : from.u);
              }

              // Fill in non existing complex values
              if (toTargetObject.d && fromTargetObject.d && (toTargetObject.d.length !== fromTargetObject.d.length)) {
                const longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
                const shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
                // TODO: Check if n should be used instead of 0 for default complex values
                shortestValue.d = longestValue.d.map((_, i) => isUnd(shortestValue.d[i]) ? 0 : shortestValue.d[i]);
                shortestValue.s = cloneArray(longestValue.s);
              }

              // Tween factory

              const tweenUpdateDuration = +tweenDuration || minValue;

              /** @type {Tween} */
              const tween = {
                parent: this,
                id: tweenId++,
                property: propName,
                target: target,
                _value: null,
                _func: toFunctionStore.func,
                _ease: parseEasings(tweenEasing),
                _fromNumbers: cloneArray(fromTargetObject.d),
                _toNumbers: cloneArray(toTargetObject.d),
                _strings: cloneArray(toTargetObject.s),
                _fromNumber: fromTargetObject.n,
                _toNumber: toTargetObject.n,
                _numbers: cloneArray(fromTargetObject.d), // For additive tween and animatables
                _number: fromTargetObject.n, // For additive tween and animatables
                _unit: toTargetObject.u,
                _modifier: tweenModifier,
                _currentTime: 0,
                _startTime: tweenStartTime,
                _delay: +tweenDelay,
                _updateDuration: tweenUpdateDuration,
                _changeDuration: tweenUpdateDuration,
                _absoluteStartTime: absoluteStartTime,
                // NOTE: Investigate bit packing to stores ENUM / BOOL
                _tweenType: tweenType,
                _valueType: toTargetObject.t,
                _composition: tweenComposition,
                _isOverlapped: 0,
                _isOverridden: 0,
                _renderTransforms: 0,
                _prevRep: null, // For replaced tween
                _nextRep: null, // For replaced tween
                _prevAdd: null, // For additive tween
                _nextAdd: null, // For additive tween
                _prev: null,
                _next: null,
              };

              if (tweenComposition !== compositionTypes.none) {
                composeTween(tween, siblings);
              }

              if (isNaN(firstTweenChangeStartTime)) {
                firstTweenChangeStartTime = tween._startTime;
              }
              // Rounding is necessary here to minimize floating point errors
              lastTweenChangeEndTime = round(tweenStartTime + tweenUpdateDuration, 12);
              prevTween = tween;
              animationAnimationLength++;

              addChild(this, tween);

            }

            // Update animation timings with the added tweens properties

            if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
              iterationDelay = firstTweenChangeStartTime;
            }

            if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
              iterationDuration = lastTweenChangeEndTime;
            }

            // TODO: Find a way to inline tween._renderTransforms = 1 here
            if (tweenType === tweenTypes.TRANSFORM) {
              lastTransformGroupIndex = animationAnimationLength - tweenIndex;
              lastTransformGroupLength = animationAnimationLength;
            }

          }

        }

      }

      // Set _renderTransforms to last transform property to correctly render the transforms list
      if (!isNaN(lastTransformGroupIndex)) {
        let i = 0;
        forEachChildren(this, (/** @type {Tween} */tween) => {
          if (i >= lastTransformGroupIndex && i < lastTransformGroupLength) {
            tween._renderTransforms = 1;
            if (tween._composition === compositionTypes.blend) {
              forEachChildren(additive.animation, (/** @type {Tween} */additiveTween) => {
                if (additiveTween.id === tween.id) {
                  additiveTween._renderTransforms = 1;
                }
              });
            }
          }
          i++;
        });
      }

    }

    if (!targetsLength) {
      console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
    }

    if (iterationDelay) {
      forEachChildren(this, (/** @type {Tween} */tween) => {
        // If (startTime - delay) equals 0, this means the tween is at the begining of the animation so we need to trim the delay too
        if (!(tween._startTime - tween._delay)) {
          tween._delay -= iterationDelay;
        }
        tween._startTime -= iterationDelay;
      });
      iterationDuration -= iterationDelay;
    } else {
      iterationDelay = 0;
    }

    // Prevents iterationDuration to be NaN if no valid animatable props have been provided
    // Prevents _iterationCount to be NaN if no valid animatable props have been provided
    if (!iterationDuration) {
      iterationDuration = minValue;
      this._iterationCount = 0;
    }
    /** @type {TargetsArray} */
    this.targets = parsedTargets;
    this.duration = iterationDuration === minValue ? minValue : clampInfinity(((iterationDuration + this._loopDelay) * this._iterationCount) - this._loopDelay) || minValue;
    /** @type {AnimationCallback} */
    this.onRender = onRender || animDefaults.onRender;
        /** @type {EasingFunction} */
    this._ease = animEase;
    this._delay = iterationDelay;
    // NOTE: I'm keeping delay values separated from offsets in timelines because delays can override previous tweens and it could be confusing to debug a timeline with overridden tweens and no associated visible delays.
    // this._delay = parent ? 0 : iterationDelay;
    // this._offset += parent ? iterationDelay : 0;
    this._iterationDuration = iterationDuration;
    this._inlineStyles = animInlineStyles;
  }

  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    forEachChildren(this, (/** @type {Tween} */tween) => {
      // Rounding is necessary here to minimize floating point errors
      tween._updateDuration = clampZero(round(tween._updateDuration * timeScale, 12));
      tween._changeDuration = clampZero(round(tween._changeDuration * timeScale, 12));
      tween._currentTime *= timeScale;
      tween._startTime *= timeScale;
      tween._absoluteStartTime *= timeScale;
    });
    return super.stretch(newDuration);
  }

  /**
   * @return {this}
   */
  refresh() {
    forEachChildren(this, (/** @type {Tween} */tween) => {
      const ogValue = getOriginalAnimatableValue(tween.target, tween.property, tween._tweenType);
      decomposeRawValue(ogValue, decomposedOriginalValue);
      tween._fromNumbers = cloneArray(decomposedOriginalValue.d);
      tween._fromNumber = decomposedOriginalValue.n;
      if (tween._func) {
        decomposeRawValue(tween._func(), toTargetObject);
        tween._toNumbers = cloneArray(toTargetObject.d);
        tween._strings = cloneArray(toTargetObject.s);
        tween._toNumber = toTargetObject.n;
      }
    });
    return this;
  }

  /**
   * Cancel the animation and revert all the values affected by this animation to their original state
   * @return {this}
   */
  revert() {
    super.revert();
    return cleanInlineStyles(this);
  }

  /**
   * @param  {AnimationCallback} [callback]
   * @return {Promise}
   */
  then(callback) {
    return super.then(/** @type {TimerCallback} */(callback));
  }

}




/**
 * @overload
 * @param  {DOMTargetSelector} targetSelector
 * @param  {String}            propName
 * @return {String}
 *
 * @overload
 * @param  {JSTargetsParam} targetSelector
 * @param  {String}         propName
 * @return {Number|String}
 *
 * @overload
 * @param  {DOMTargetsParam} targetSelector
 * @param  {String}          propName
 * @param  {String}          unit
 * @return {String}
 *
 * @overload
 * @param  {TargetsParam} targetSelector
 * @param  {String}       propName
 * @param  {Boolean}      unit
 * @return {Number}
 *
 * @param  {TargetsParam}   targetSelector
 * @param  {String}         propName
 * @param  {String|Boolean} [unit]
 */
function getTargetValue(targetSelector, propName, unit) {
  const targets = registerTargets(targetSelector);
  if (!targets.length) return;
  const [ target ] = targets;
  const tweenType = getTweenType(target, propName);
  const normalizePropName = sanitizePropertyName(propName, target, tweenType);
  let originalValue = getOriginalAnimatableValue(target, normalizePropName);
  if (isUnd(unit)) {
    return originalValue;
  } else {
    decomposeRawValue(originalValue, decomposedOriginalValue);
    if (decomposedOriginalValue.t === valueTypes.NUMBER || decomposedOriginalValue.t === valueTypes.UNIT) {
      if (unit === false) {
        return decomposedOriginalValue.n;
      } else {
        const convertedValue = convertValueUnit(/** @type {DOMTarget} */(target), decomposedOriginalValue, /** @type {String} */(unit), false);
        return `${round(convertedValue.n, globals.precision)}${convertedValue.u}`;
      }
    }
  }
}

/**
 * @param  {TargetsParam}    targets
 * @param  {AnimationParams} parameters
 * @return {Animation}
 */
const setTargetValues = (targets, parameters) => {
  if (isUnd(parameters)) return;
  parameters.duration = minValue;
  // Do not overrides currently active tweens by default
  parameters.composition = setValue(parameters.composition, compositionTypes.none);
  // Skip init() and force rendering by playing the animation
  return new Animation(targets, parameters, null, 0, true).play();
};

/**
 * @param  {TargetsArray} targetsArray
 * @param  {Animation}    animation
 * @param  {String}       [propertyName]
 * @return {Boolean}
 */
const removeTargetsFromAnimation = (targetsArray, animation, propertyName) => {
  let tweensMatchesTargets = false;
  forEachChildren(animation, (/**@type {Tween} */tween) => {
    const tweenTarget = tween.target;
    if (targetsArray.includes(tweenTarget)) {
      const tweenName = tween.property;
      const tweenType = tween._tweenType;
      const normalizePropName = sanitizePropertyName(propertyName, tweenTarget, tweenType);
      if (!normalizePropName || normalizePropName && normalizePropName === tweenName) {
        // Removes the tween from the selected animation
        removeChild(animation, tween);
        // Detach the tween from its siblings to make sure blended tweens are correctlly removed
        removeTweenSliblings(tween);
        tweensMatchesTargets = true;
      }
    }
  }, true);
  return tweensMatchesTargets;
};

/**
 * @param  {TargetsParam} targets
 * @param  {Renderable}   [renderable]
 * @param  {String}       [propertyName]
 * @return {TargetsArray}
 */
const remove = (targets, renderable, propertyName) => {
  const targetsArray = parseTargets(targets);
  const parent = renderable ? renderable : engine;
  let removeMatches;
  if (parent._hasChildren) {
    forEachChildren(parent, (/** @type {Renderable} */child) => {
      if (!child._hasChildren) {
        removeMatches = removeTargetsFromAnimation(targetsArray, /** @type {Animation} */(child), propertyName);
        // Remove the child from its parent if no tweens and no children left after the removal
        if (removeMatches && !child._head) {
          // TODO: Call child.onInterupt() here when implemented
          child.cancel();
          removeChild(parent, child);
        }
      }
      // Make sure to also remove engine's children targets
      // NOTE: Avoid recursion?
      if (child._head) {
        remove(targets, child);
      } else {
        child._hasChildren = false;
      }
    }, true);
  } else {
    removeMatches = removeTargetsFromAnimation(
      targetsArray,
      /** @type {Animation} */(parent),
      propertyName
    );
  }

  if (removeMatches && !parent._head) {
    parent._hasChildren = false;
    // TODO: Call child.onInterupt() here when implemented
    // Cancel the parent if there are no tweens and no children left after the removal
    // We have to check if the .cancel() method exist to handle cases where the parent is the engine itself
    if (/** @type {Renderable} */(parent).cancel) /** @type {Renderable} */(parent).cancel();
  }

  return targetsArray;
};

/**
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} [decimalLength]
 * @return {Number}
 */
const random = (min, max, decimalLength) => { const m = 10 ** (decimalLength || 0); return floor((Math.random() * (max - min + (1 / m)) + min) * m) / m };

/**
 * @param  {String|Array} items
 * @return {any}
 */
const randomPick = items => items[random(0, items.length - 1)];

/**
 * Adapted from https://bost.ocks.org/mike/shuffle/
 * @param  {Array} items
 * @return {Array}
 */
const shuffle = items => {
  let m = items.length, t, i;
  while (m) { i = random(0, --m); t = items[m]; items[m] = items[i]; items[i] = t; }
  return items;
};

/**
 * @param  {Number|String} v
 * @param  {Number} decimalLength
 * @return {String}
 */
const roundPad = (v, decimalLength) => (+v).toFixed(decimalLength);

/**
 * @param  {Number} v
 * @param  {Number} totalLength
 * @param  {String} padString
 * @return {String}
 */
const padStart = (v, totalLength, padString) => `${v}`.padStart(totalLength, padString);

/**
 * @param  {Number} v
 * @param  {Number} totalLength
 * @param  {String} padString
 * @return {String}
 */
const padEnd = (v, totalLength, padString) => `${v}`.padEnd(totalLength, padString);

/**
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
const wrap = (v, min, max) => (((v - min) % (max - min) + (max - min)) % (max - min)) + min;

/**
 * @param  {Number} value
 * @param  {Number} inLow
 * @param  {Number} inHigh
 * @param  {Number} outLow
 * @param  {Number} outHigh
 * @return {Number}
 */
const mapRange = (value, inLow, inHigh, outLow, outHigh) => outLow + ((value - inLow) / (inHigh - inLow)) * (outHigh - outLow);

/**
 * @param  {Number} degrees
 * @return {Number}
 */
const degToRad = degrees => degrees * PI / 180;

/**
 * @param  {Number} radians
 * @return {Number}
 */
const radToDeg = radians => radians * 180 / PI;

/**
 * https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
 * @param  {Number} start
 * @param  {Number} end
 * @param  {Number} amount
 * @param  {Renderable|Boolean} [renderable]
 * @return {Number}
 */
const lerp = (start, end, amount, renderable) => {
  let dt = K / globals.defaults.frameRate;
  if (renderable !== false) {
    const ticker = /** @type Renderable */
                   (renderable) ||
                   (engine._hasChildren && engine);
    if (ticker && ticker.deltaTime) {
      dt = ticker.deltaTime;
    }
  }
  const t = 1 - Math.exp(-amount * dt * .1);
  return !amount ? start : amount === 1 ? end : (1 - t) * start + t * end;
};

// Chain-able utilities

/**
 * @callback UtilityFunction
 * @param {...*} args
 * @return {Number|String}
 *
 * @param {UtilityFunction} fn
 * @param {Number} [last=0]
 * @return {function(...(Number|String)): function(Number|String): (Number|String)}
 */
const curry = (fn, last = 0) => (...args) => last ? v => fn(...args, v) : v => fn(v, ...args);

/**
 * @param {Function} fn
 * @return {function(...(Number|String))}
 */
const chain = fn => {
   return (...args) => {
    const result = fn(...args);
    return new Proxy(noop, {
      apply: (_, __, [v]) => result(v),
      get: (_, prop) => chain(/**@param {...Number|String} nextArgs */(...nextArgs) => {
        const nextResult = utils[prop](...nextArgs);
        return (/**@type {Number|String} */v) => nextResult(result(v));
      })
    });
  }
};

/**
 * @param {UtilityFunction} fn
 * @param {Number} [right]
 * @return {function(...(Number|String)): UtilityFunction}
 */
const makeChainable = (fn, right = 0) => (...args) => (args.length < fn.length ? chain(curry(fn, right)) : fn)(...args);

/**
 * @callback ChainedUtilsResult
 * @param {Number} value
 * @return {Number}
 *
 * @typedef {Object} ChainableUtils
 * @property {ChainedClamp} clamp
 * @property {ChainedRound} round
 * @property {ChainedSnap} snap
 * @property {ChainedWrap} wrap
 * @property {ChainedInterpolate} interpolate
 * @property {ChainedMapRange} mapRange
 * @property {ChainedRoundPad} roundPad
 * @property {ChainedPadStart} padStart
 * @property {ChainedPadEnd} padEnd
 * @property {ChainedDegToRad} degToRad
 * @property {ChainedRadToDeg} radToDeg
 *
 * @typedef {ChainableUtils & ChainedUtilsResult} ChainableUtil
 *
 * @callback ChainedClamp
 * @param {Number} min
 * @param {Number} max
 * @return {ChainableUtil}
 *
 * @callback ChainedRound
 * @param {Number} decimalLength
 * @return {ChainableUtil}
 *
 * @callback ChainedSnap
 * @param {Number} increment
 * @return {ChainableUtil}
 *
 * @callback ChainedWrap
 * @param {Number} min
 * @param {Number} max
 * @return {ChainableUtil}
 *
 * @callback ChainedInterpolate
 * @param {Number} start
 * @param {Number} end
 * @return {ChainableUtil}
 *
 * @callback ChainedMapRange
 * @param {Number} inLow
 * @param {Number} inHigh
 * @param {Number} outLow
 * @param {Number} outHigh
 * @return {ChainableUtil}
 *
 * @callback ChainedRoundPad
 * @param {Number} decimalLength
 * @return {ChainableUtil}
 *
 * @callback ChainedPadStart
 * @param {Number} totalLength
 * @param {String} padString
 * @return {ChainableUtil}
 *
 * @callback ChainedPadEnd
 * @param {Number} totalLength
 * @param {String} padString
 * @return {ChainableUtil}
 *
 * @callback ChainedDegToRad
 * @return {ChainableUtil}
 *
 * @callback ChainedRadToDeg
 * @return {ChainableUtil}
 */

const utils = {
  $: registerTargets,
  get: getTargetValue,
  set: setTargetValues,
  remove,
  cleanInlineStyles,
  random,
  randomPick,
  shuffle,
  lerp,
  clamp: /** @type {typeof clamp & ChainedClamp} */(makeChainable(clamp)),
  round: /** @type {typeof round & ChainedRound} */(makeChainable(round)),
  snap: /** @type {typeof snap & ChainedSnap} */(makeChainable(snap)),
  wrap: /** @type {typeof wrap & ChainedWrap} */(makeChainable(wrap)),
  interpolate: /** @type {typeof interpolate & ChainedInterpolate} */(makeChainable(interpolate, 1)),
  mapRange: /** @type {typeof mapRange & ChainedMapRange} */(makeChainable(mapRange)),
  roundPad: /** @type {typeof roundPad & ChainedRoundPad} */(makeChainable(roundPad)),
  padStart: /** @type {typeof padStart & ChainedPadStart} */(makeChainable(padStart)),
  padEnd: /** @type {typeof padEnd & ChainedPadEnd} */(makeChainable(padEnd)),
  degToRad: /** @type {typeof degToRad & ChainedDegToRad} */(makeChainable(degToRad)),
  radToDeg: /** @type {typeof radToDeg & ChainedRadToDeg} */(makeChainable(radToDeg)),
};




/**
 * @typedef {Number|String|Function} TimePosition
 */

/**
 * Timeline's children offsets positions parser
 * @param  {Timeline} timeline
 * @param  {String} timePosition
 * @return {Number}
 */
const getPrevChildOffset = (timeline, timePosition) => {
  if (stringStartsWith(timePosition, '<')) {
    const goToPrevAnimationOffset = timePosition[1] === '<';
    const prevAnimation = timeline._tail;
    const prevOffset = prevAnimation ? prevAnimation._offset + prevAnimation._delay : 0;
    return goToPrevAnimationOffset ? prevOffset : prevOffset + prevAnimation.duration;
  }
};

/**
 * @param  {Timeline} timeline
 * @param  {TimePosition} [timePosition]
 * @return {Number}
 */
const parseTimelinePosition = (timeline, timePosition) => {
  let tlDuration = timeline._iterationDuration;
  if (tlDuration === minValue) tlDuration = 0;
  if (isUnd(timePosition)) return tlDuration;
  if (isNum(+timePosition)) return +timePosition;
  const timePosStr = /** @type {String} */(timePosition);
  const tlLabels = timeline ? timeline.labels : null;
  const hasLabels = !isNil(tlLabels);
  const prevOffset = getPrevChildOffset(timeline, timePosStr);
  const hasSibling = !isUnd(prevOffset);
  const matchedRelativeOperator = relativeValuesExecRgx.exec(timePosStr);
  if (matchedRelativeOperator) {
    const fullOperator = matchedRelativeOperator[0];
    const split = timePosStr.split(fullOperator);
    const labelOffset = hasLabels && split[0] ? tlLabels[split[0]] : tlDuration;
    const parsedOffset = hasSibling ? prevOffset : hasLabels ? labelOffset : tlDuration;
    const parsedNumericalOffset = +split[1];
    return getRelativeValue(parsedOffset, parsedNumericalOffset, fullOperator[0]);
  } else {
    return hasSibling ? prevOffset :
           hasLabels ? !isUnd(tlLabels[timePosStr]) ? tlLabels[timePosStr] :
           tlDuration : tlDuration;
  }
};

/**
 * @overload
 * @param  {TimerParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @return {Timeline}
 *
 * @overload
 * @param  {AnimationParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @param  {TargetsParam} targets
 * @param  {Number} [index]
 * @param  {Number} [length]
 * @return {Timeline}
 *
 * @param  {TimerParams|AnimationParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @param  {TargetsParam} [targets]
 * @param  {Number} [index]
 * @param  {Number} [length]
 */
function addTlChild(childParams, tl, parsedTLPosition, targets, index, length) {
  // Offset the tl position with -minValue for 0 duration animations or .set() calls in order to align their end value with the defined position
  const TLPosition = isNum(childParams.duration) && /** @type {Number} */(childParams.duration) <= minValue ? parsedTLPosition - minValue : parsedTLPosition;
  tick(tl, TLPosition, 1, 1, tickModes.AUTO);
  const tlChild = targets ?
    new Animation(targets,/** @type {AnimationParams} */(childParams), tl, TLPosition, false, index, length) :
    new Timer(/** @type {TimerParams} */(childParams), tl, TLPosition);
  tlChild.init(1);
  // TODO: Might be better to insert at a position relative to startTime?
  addChild(tl, tlChild);
  forEachChildren(tl, (/** @type {Renderable} */child) => {
    const childTLOffset = child._offset + child._delay;
    const childDur = childTLOffset + child.duration;
    if (childDur > tl._iterationDuration) {
      tl._iterationDuration = childDur;
    }
  });
  tl.duration = clampInfinity(((tl._iterationDuration + tl._loopDelay) * tl._iterationCount) - tl._loopDelay) || minValue;
  return tl;
}

class Timeline extends Timer {

  /**
   * @param {TimelineParams} [parameters]
   */
  constructor(parameters = {}) {
    super(/** @type {TimerParams} */(parameters), null, 0);
    this.duration = 0; // TL duration starts at 0 and grows when adding children
    this.labels = {}; // TODO: Do not create an Object until we actually add a label
    /** @type {DefaultsParams} */
    const defaultsParams = parameters.defaults;
    const globalDefaults = globals.defaults;
    this.defaults = defaultsParams ? mergeObjects(defaultsParams, globalDefaults) : globalDefaults;
    /** @type {TimelineCallback} */
    this.onRender = /** @type {TimelineCallback} */(parameters.onRender || globalDefaults.onRender);
    const tlPlaybackEase = setValue(parameters.playbackEase, globalDefaults.playbackEase);
    this._ease = tlPlaybackEase ? parseEasings(tlPlaybackEase) : null;
    /** @type {Number} */
    this._iterationDuration = 0;
    /** @type {Renderable} */
    this._head = null;
    /** @type {Renderable} */
    this._tail = null;
  }

  /**
   * @overload
   * @param {TargetsParam} a1
   * @param {AnimationParams} a2
   * @param {TimePosition} [a3]
   * @return {this}
   *
   * @overload
   * @param {TimerParams} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @overload
   * @param {String} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @overload
   * @param {TimerCallback} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @param {TargetsParam|TimerParams|String|TimerCallback} a1
   * @param {AnimationParams|TimePosition} a2
   * @param {TimePosition} [a3]
   */
  add(a1, a2, a3) {
    const isAnim = isObj(a2);
    const isTimer = isObj(a1);
    const isFunc = isFnc(a1);
    if (isAnim || isTimer || isFunc) {
      this._hasChildren = true;
      if (isAnim) {
        const childParams = /** @type {AnimationParams} */(a2);
        // Check for function for children stagger positions
        if (isFnc(a3)) {
          const staggeredPosition = /** @type {Function} */(a3);
          const parsedTargetsArray = parseTargets(/** @type {TargetsParam} */(a1));
          // Store initial duration before adding new children that will change the duration
          const tlDuration = this.duration;
          // Store initial _iterationDuration before adding new children that will change the duration
          const tlIterationDuration = this._iterationDuration;
          // Store the original id in order to add specific indexes to the new animations ids
          const id = childParams.id;
          let i = 0;
          const parsedLength = parsedTargetsArray.length;
          parsedTargetsArray.forEach((/** @type {Target} */target) => {
            // Create a new parameter object for each staggered children
            const staggeredChildParams = { ...childParams };
            // Reset the duration of the timeline iteration before each stagger to prevent wrong start value calculation
            this.duration = tlDuration;
            this._iterationDuration = tlIterationDuration;
            if (!isUnd(id)) staggeredChildParams.id = id + '-' + i;
            addTlChild(
              staggeredChildParams,
              this,
              staggeredPosition(target, i, parsedLength, this),
              target,
              i,
              parsedLength
            );
            i++;
          });
        } else {
          addTlChild(
            childParams,
            this,
            parseTimelinePosition(this, a3),
            /** @type {TargetsParam} */(a1),
          );
        }
      } else {
        // It's a Timer or a Function
        addTlChild(
          /** @type TimerParams */(isTimer ? a1 : { onComplete: a1, duration: minValue }),
          this,
          parseTimelinePosition(this,/** @type TimePosition */(a2)),
        );
      }
      this.init(1); // 1 = internalRender
      return this._autoplay === true ? this.play() : this;
    } else if (isStr(a1)) {
      this.labels[a1] = parseTimelinePosition(this,/** @type TimePosition */(a2));
      return this;
    }
  }

  /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {TimePosition} [position]
   * @return {this}
   */
  set(targets, parameters, position) {
    if (isUnd(parameters)) return this;
    parameters.duration = minValue;
    parameters.composition = compositionTypes.replace;
    return this.add(targets, parameters, position);
  }

  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    const labels = this.labels;
    forEachChildren(this, (/** @type {Animation} */child) => {
      child.stretch(child.duration * timeScale);
    });
    for (let labelName in labels) {
      labels[labelName] *= timeScale;
    }
    return super.stretch(newDuration);
  }

  /**
   * @return {this}
   */
  refresh() {
    forEachChildren(this, (/** @type {Animation} */child) => {
      if (child.refresh) child.refresh();
    });
    return this;
  }

  /**
   * @return {this}
   */
  revert() {
    super.revert();
    forEachChildren(this, (/** @type {Animation} */child) => child.revert, true);
    return cleanInlineStyles(this);
  }

  /**
   * @param  {TimelineCallback} [callback]
   * @return {Promise}
   */
  then(callback) {
    return super.then(/** @type {TimerCallback} */(callback));
  }
}

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

// Global Object and visibility checks event register

if (isBrowser) {
  if (!win.AnimeJS) win.AnimeJS = [];
  win.AnimeJS.push({ version: '4.0.0-beta.102.2', engine });
  doc.addEventListener('visibilitychange',
    () => engine.suspendWhenHidden ? doc.hidden ? engine.suspend() : engine.resume() : 0
  );
}

const icons = {
  toggle: `
    <polygon fill="currentColor" points="29 18 23 12 17 18"/>
    <polygon fill="currentColor" points="29 23 17 23 17 20 29 20"/>
  `,
  play: `
    <polygon fill="currentColor" fill-rule="nonzero" points="17 10 17 26 32 18"/>
  `,
  pause: `
    <rect width="5" height="14" x="17" y="11" fill="currentColor" fill-rule="nonzero"/>
    <rect width="5" height="14" x="24" y="11" fill="currentColor" fill-rule="nonzero"/>
  `,
  back: `
    <polygon fill="currentColor" points="28 12 22 18 28 24"/>
    <polygon fill="currentColor" points="21 12 21 24 18 24 18 12"/>
  `,
  settings: `<path fill="currentColor" fill-rule="nonzero" d="M24.455 10v2.178a5.964 5.964 0 0 1 1.633.676l1.54-1.54 2.057 2.058-1.54 1.54c.302.502.532 1.05.677 1.633H31v2.91h-2.178a5.964 5.964 0 0 1-.676 1.633l1.54 1.54-2.058 2.057-1.54-1.54a5.964 5.964 0 0 1-1.633.677V26h-2.91v-2.178a5.964 5.964 0 0 1-1.633-.676l-1.54 1.54-2.057-2.058 1.54-1.54a5.964 5.964 0 0 1-.677-1.633H15v-2.91h2.178a5.964 5.964 0 0 1 .676-1.633l-1.54-1.54 2.058-2.057 1.54 1.54a5.964 5.964 0 0 1 1.633-.677V10h2.91zM23 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
  `,
  clamp: `<path fill="currentColor" d="M15 25a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h15a2 2 0 0 1 1.995 1.85L32 14v9a2 2 0 0 1-1.85 1.995L30 25H15zm13-12H17v11h11V13z"/>
  `,
};

const sideBarWidth = 212;
const toolbarHeight = 56;
const toolbarItemHeight = 36;
const thumbWidth = 8;
const tlScrubberHeight = 16;
const tlLineHeight = 14;

const instances = [];

const parameters = {
  active: null,
  $container: document.body,
  highlightSiblings: true,
  showTweenId: true,
  startTime: 0,
  endTime: null,
  time: 0,
  speed: 1,
  loop: false,
  scrollX: 0,
  scrollY: 0,
  height: toolbarHeight,
  minified: window.innerHeight * .4,
  clamped: false,
};

function getActiveInstance() {
  return instances[parameters.active];
}

const url = new URL(window.location.href);

const urlParams = url.searchParams;

function getParsedParameter(paramName, userParams) {
  const fromUrl = urlParams.get(paramName);
  const fromUser = userParams[paramName];
  let param;
  if (!isUnd(fromUrl)) {
    param = fromUrl;
  } else if (!isUnd(fromUser)) {
    urlParams.set(paramName, fromUser);
    param = fromUser;
  }
  if (param === 'true') {
    param = true;
  } else if (param === 'false') {
    param = false;
  } else {
    const numParam = parseFloat(param);
    if (isNum(numParam)) {
      param = numParam;
    }
  }
  return param;
}

function parseParameters(userParams) {
  for (let paramName in parameters) {
    const parsedParam = getParsedParameter(paramName, userParams);
    if (!isNil(parsedParam)) {
      parameters[paramName] = parsedParam;
    }
  }
}

let setUrlParamTimeout;

function setParameter(param, value) {
  parameters[param] = value;
  url.searchParams.set(param, value);
  clearTimeout(setUrlParamTimeout);
  setUrlParamTimeout = setTimeout(() => {
    window.history.replaceState(null, '', url);
  }, 66);
}

function msToEm(ms) {
  return ms / 125 + 'em';
}

const prefix = 'anime-gui-';

const dot = '.';
const classPrefix = dot + prefix;
const prefixRgx = /\.-?[_a-zA-Z\-]+[\w\-:\[\]]*/gm;
const commentsRgx = /\/\*.*?\*\//g;
const spacesRgx = /\s{3,}/g;

function prefixCSS(styles) {
  let prefixed = styles;
  styles.match(prefixRgx).forEach(match => prefixed = prefixed.replace(match, match.replace(dot, classPrefix)));
  return prefixed;
}

function minifyCSS(styles) {
  return styles.replace(commentsRgx, '').replace(spacesRgx, ''); // Remove comments then remove 3 or more consecutive spaces
}

function appendStyles(styles) {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', prefix + 'styles');
  styleEl.innerHTML = minifyCSS(prefixCSS(styles));
  document.head.appendChild(styleEl);
}

function createBlock(className, css) {
  var $el = document.createElement('div');
  $el.classList.add(prefix + 'block');
  if (Array.isArray(className)) {
    for (let i = 0, l = className.length; i < l; i++) {
      $el.classList.add(prefix + className[i]);
    }
  } else {
    $el.classList.add(prefix + className);
  }
  if (css) $el.style.cssText = css;
  return $el;
}

function getIconCode(name) {
  return `<svg viewBox="0 0 45 36"><g fill-rule="evenodd">${icons[name]}</g></svg>`;
}

function createProgressBar() {
  const $el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  $el.classList.add(`${prefix}progress-circle`);
  utils.set($el, { viewBox: '0 0 14 14'} );
  $el.innerHTML = `<g fill="none" fill-rule="evenodd"><circle cx="7" cy="7" r="6" stroke="#FFFFFF" stroke-width="2" opacity=".2"/><path stroke="#FFFFFF" stroke-width="2" d="M7 1a6 6 0 1 1-.023 0"/></g>`;
  return $el;
}

function createButton(className, innerHTML = '') {
  const $el = document.createElement('button');
  $el.classList.add(`${prefix}${className}`);
  $el.classList.add(`${prefix}sidebar-item`);
  $el.classList.add(`${prefix}sidebar-button`);
  $el.innerHTML = innerHTML;
  return $el;
}

function createSpeedButton() {
  const $el = document.createElement('select');
  const options = [2, 1.8, 1.5, 1.2, 1, .8, .5, .2, .1];
  $el.classList.add(`${prefix}speed-button`);
  $el.classList.add(`${prefix}sidebar-item`);
  $el.classList.add(`${prefix}sidebar-button`);
  for (let i = 0; i < options.length; i++) {
    const $option = document.createElement('option');
    $option.value = options[i];
    $option.text = options[i] + '×';
    $el.appendChild($option);
  }
  $el.value = 1;
  return $el;
}

function createScrubberInput(className) {
  const $input = document.createElement('input');
  $input.classList.add(`${prefix}scrubber`);
  $input.classList.add(`${prefix}${className}`);
  utils.set($input, { type: 'range', min: '0', max: '1', value: '0' });
  return $input;
}

function createScrubberBlock(className) {
  const $scrubber = createBlock(className);
  const tlScrubber = createScrubberInput('time-scrubber');
  const tlMinScrubber = createScrubberInput('min-scrubber');
  const tlMaxScrubber = createScrubberInput('max-scrubber');
  $scrubber.appendChild(tlScrubber);
  $scrubber.appendChild(tlMinScrubber);
  $scrubber.appendChild(tlMaxScrubber);
  return $scrubber;
}

function initDOM() {
  const $wrapper = createBlock('wrapper');
  const $tlWrapper = createBlock('tl-wrapper');
  const $toolbar = createBlock('toolbar');
  const $resizer = createBlock('resizer');
  const $sidebarLeft = createBlock('sidebar');
  const $sidebarRight = createBlock('sidebar');
  const $toggleButton = createButton('toggle-button', getIconCode('toggle'));
  const $playbackButton = createButton('playback-button', getIconCode('play'));
  const $backButton = createButton('back-button', getIconCode('back'));
  const $speedButton = createSpeedButton();
  const $clampButton = createButton('clamp-button', getIconCode('clamp'));
  const $mm = createBlock('mm');
  const $clock = createBlock(['clock', 'sidebar-item']);
  const $currentTime = createBlock('current-time');
  const $currentTimeShadow = createBlock(['current-time', 'current-time-shadow']);
  const $totalDuration = createBlock('total-duration');
  const $totalTime = createBlock('total-time');
  const $progressBar = createProgressBar();
  const $tl = createBlock(['tl', 'ruller-bg']);
  const $tlScrubber = createScrubberBlock('tl-scrubber');
  const $mmScrubber = createScrubberBlock('mm-scrubber');
  const $mmBox = createBlock('mm-box');

  $totalTime.appendChild($totalDuration);
  $clock.appendChild($currentTimeShadow);
  $clock.appendChild($currentTime);
  $clock.appendChild($totalTime);
  $clock.appendChild($progressBar);
  $mmScrubber.appendChild($mmBox);
  $mm.appendChild($mmScrubber);
  $tl.appendChild($tlScrubber);
  $sidebarLeft.appendChild($playbackButton);
  $sidebarLeft.appendChild($backButton);
  $sidebarLeft.appendChild($speedButton);
  $sidebarLeft.appendChild($clampButton);
  $sidebarRight.appendChild($clock);
  $sidebarRight.appendChild($toggleButton);
  $toolbar.appendChild($sidebarLeft);
  $toolbar.appendChild($mm);
  $toolbar.appendChild($resizer);
  $toolbar.appendChild($sidebarRight);
  $wrapper.appendChild($toolbar);
  $wrapper.appendChild($tlWrapper);
  $tlWrapper.appendChild($tl);

  return {
    $wrapper,
    $tlWrapper,
    $tl,
    $tlScrubber,
    $resizer,
    $mmScrubber,
    $mmBox,
    $speedButton,
    $clampButton,
    $currentTimeShadow,
    $currentTime,
    $totalDuration,
  }
}

const blackColor = '#1B1B1B';
const whiteColor = '#F6F4F2';
const whiteAlpha1Color = 'rgba(246, 244, 242, .05)';
const whiteAlpha2Color = 'rgba(246, 244, 242, .5)';
const whiteAlpha3Color = 'rgba(246, 244, 242, .75)';
const blackAlpha1Color = 'rgba(46, 44, 44, .75)';
const blackAlpha2Color = 'rgba(46, 44, 44, .9)';

const colors = ['#FF4B4B','#FF8F42','#FFC730','#F6FF56','#A4FF4F','#18FF74','#00D672','#3CFFEC','#61C3FF','#5A87FF','#8453E3','#C26EFF','#FB89FB'];
// const colors = [...Array(32)].map((c, i) => 'hsl(' + Math.round(360 / 32 * i) + ', 88%, 62%)');
const colorLength = colors.length;
const colorIds = {};
let colorIndex = 0;

function getNextColor() {
  const color = colors[colorIndex++];
  if (colorIndex > colorLength - 1) colorIndex = 0;
  return color;
}

function getColor(id) {
  if (id) {
    const idColor = colorIds[id];
    if (idColor) {
      return idColor;
    } else {
      return colorIds[id] = getNextColor();
    }
  } else {
    return getNextColor();
  }
}

const styles = `
  .wrapper,
  .wrapper *,
  .wrapper *:before,
  .wrapper *:after {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    position: relative;
    user-select: none;
    font-variant-numeric: tabular-nums;
  }
  .wrapper {
    position: fixed;
    z-index: 999999;
    right: 0;
    bottom: 0;
    width: 100%;
    height: var(--anime-gui-height);
    font-family: sans-serif;
    background-color: ${blackColor};
  }
  .tl-wrapper {
    position: absolute;
    left: 0;
    top: ${toolbarHeight}px;
    overflow: auto;
    flex-direction: column;
    width: 100%;
    height: var(--anime-gui-tl-height);
    background-color: ${blackColor};
  }
  .toolbar {
    position: sticky;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    height: ${toolbarHeight}px;
    padding: 10px;
    background-color: ${blackColor};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, .04),
                inset 0 -1px 0 0 rgba(0, 0, 0, .4);
  }
  .resizer {
    position: absolute;
    z-index: 9999;
    left: 0;
    top: -5px;
    width: 100%;
    height: 15px;
    cursor: row-resize;
  }
  .sidebar {
    overflow: hidden;
    flex-wrap: nowrap;
    width: ${sideBarWidth - 30}px;
    border-radius: 4px;
    background-color: ${whiteAlpha1Color};
    color: rgba(255,255,255,.65);
  }
  .sidebar:first-child {
    margin-right: 20px;
  }
  .sidebar:last-child {
    margin-left: 20px;
  }
  .sidebar-item {
    width: 100%;
    flex-shrink: 1;
    height: ${toolbarItemHeight}px;
    background-color: transparent;
    color: currentColor;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, .025),
                inset 0 -1px 0 0 rgba(0, 0, 0, .4);
  }
  .sidebar-item.is-active {
    background-color: rgba(0, 0, 0, .5);
    color: #FFF;
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, .4),
                inset 0 -1px 0 0 rgba(255, 255, 255, .085);
  }
  .sidebar-button {
    overflow: hidden;
    cursor: pointer;
  }
  .sidebar > *:first-child {
    border-radius: 4px 0 0 4px;
  }
  .sidebar > *:last-child {
    border-radius: 0 4px 4px 0;
  }
  .sidebar > *:first-child:last-child {
    border-radius: 4px;
  }
  .sidebar-button:not(:first-child) {
    border-left: 1px solid ${blackColor};
  }
  .sidebar-button:not(.is-active):hover {
    color: rgba(255,255,255,.85);
    background-color: rgba(255,255,255,.1);
  }
  @keyframes focus {
    from {
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25),
                  inset 0 0 0 0 rgba(255, 255, 255, .25);
    }
  }
  .sidebar-button:focus {
    outline: none;
    animation: focus 1s linear forwards;
  }
  .sidebar-button svg {
    width: 100%;
    height: 100%;
  }
  .speed-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: center;
  }
  .mm {
    width: calc(100% - ${sideBarWidth * 2}px + 20px);
    height: ${toolbarItemHeight}px;
    background-color: rgba(0, 0, 0, .25);
    border-radius: 4px;
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, .4),
                inset 0 -1px 0 0 rgba(255, 255, 255, .085);
  }
  .ruller-bg {
    background-repeat: repeat-x;
    background-position: left bottom 0px;
    background-image: linear-gradient(
      to right, ${whiteAlpha1Color} 1px, transparent 1px
    );
    background-size: ${msToEm(500)} 100%;
  }
  .scrubber {
    -webkit-appearance: none;
    position: absolute;

    width: calc(100% + ${thumbWidth}px);
    margin-left: -${thumbWidth / 2}px;

    background: transparent;
    cursor: col-resize;
  }
  .time-scrubber {
    z-index: 1;
    top: 0;
  }
  .min-scrubber,
  .max-scrubber {
    z-index: 2;
    top: 0;
  }
  .scrubber:focus {
   outline: none;
  }
  .scrubber::-webkit-slider-runnable-track {
    -webkit-appearance: none;
  }
  .scrubber.time-scrubber::-webkit-slider-runnable-track {
    z-index: 99;
    height: ${tlScrubberHeight}px;
    border-radius: 10px;
  }
  .scrubber.min-scrubber::-webkit-slider-runnable-track,
  .scrubber.max-scrubber::-webkit-slider-runnable-track {
    z-index: 1;
    height: 0px;
    background-color: red;
  }
  .scrubber::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: col-resize;
    width: ${thumbWidth}px;
  }
  .scrubber.time-scrubber::-webkit-slider-thumb {
    z-index: 1;
    height: var(--anime-gui-tl-height);
    background-color: transparent;
    background-image: linear-gradient(
      90deg,
      rgba(27,26,26,0.00) 25%, #1B1A1A 25.5%,
      #1B1A1A 37.5%, #FFFFFF 38%,
      #FFFFFF 62%, #1B1A1A 62.5%,
      #1B1A1A 74.5%, rgba(27,26,26,0.00) 75%
    );
  }
  .is-playing .scrubber.time-scrubber::-webkit-slider-thumb {
    pointer-events: none;
  }
  .scrubber.min-scrubber::-webkit-slider-thumb,
  .scrubber.max-scrubber::-webkit-slider-thumb,
  .mm-box:before,
  .mm-box:after {
    z-index: 2;
    position: relative;
    height: ${tlScrubberHeight}px;
    height: var(--anime-gui-tl-height);
    background-color: ${whiteAlpha2Color};
    filter: saturate(2);
    backdrop-filter: blur(8px);
    cursor: ew-resize;
  }
  .scrubber.min-scrubber::-webkit-slider-thumb:hover,
  .scrubber.max-scrubber::-webkit-slider-thumb:hover {
    background-color: ${whiteAlpha3Color};
  }
  .scrubber.min-scrubber::-webkit-slider-thumb {
    transform: translateX(calc(-${thumbWidth / 2}px - 2px));
    border-radius: 4px 0 0 4px;
  }
  .scrubber.max-scrubber::-webkit-slider-thumb {
    transform: translateX(calc(${thumbWidth / 2}px + 2px));
    border-radius: 0 4px 4px 0;
  }
  .mm-tl {
    overflow: hidden;
    width: 100%;
    height: calc(100% - 6px);
    margin-top: 3px;
  }
  .mm-tl-scroll {
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .mm-tl-line {
    height: 100%;
    max-height: 4px;
    flex-shrink: 1;
    background-color: currentColor;
    box-shadow: 0 0 0 .25px currentColor;
    border-radius: 4px;
  }
  .mm-box {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .mm-box:before,
  .mm-box:after {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    height: 2px;
  }
  .mm-box:before { top: 0; }
  .mm-box:after { bottom: 0; }
  .mm-scrubber .scrubber.time-scrubber {
    height: ${toolbarItemHeight - 6}px;
    margin-top: 3px;
  }
  .mm-scrubber {
    width: 100%;
  }
  .mm-scrubber .scrubber.time-scrubber::-webkit-slider-thumb {
    height: ${toolbarItemHeight - 6}px;
    margin-top: -7px;
  }
  .mm-scrubber .scrubber.min-scrubber::-webkit-slider-thumb,
  .mm-scrubber .scrubber.max-scrubber::-webkit-slider-thumb {
    height: ${toolbarItemHeight}px;
  }
  .wrapper:not(.is-clamped) .min-scrubber,
  .wrapper:not(.is-clamped) .max-scrubber,
  .wrapper:not(.is-clamped) .mm-box {
    display: none;
  }
  .tl {
    flex-direction: column;
    left: ${sideBarWidth}px;
    padding-right: ${sideBarWidth}px;
    color: ${whiteColor};
    backface-visibility: hidden;
    font-size: 40px;
  }
  .tl-scrubber {
    position: sticky;
    z-index: 3;
    top: 0;
    align-items: flex-start;
    height: ${tlScrubberHeight}px;
  }
  .clock {
    width: 140px;
    flex-shrink: 0;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    align-items: center;
  }
  .current-time {
    justify-content: flex-end;
    position: absolute;
    left: 14px;
    top: 9px;
    width: 6ch;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    text-align: right;
  }
  .current-time-shadow {
    opacity: .2;
  }
  .total-time {
    position: absolute;
    left: 67px;
    top: 9px;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0.5px;
    text-align: left;
  }
  .total-duration {
    opacity: .75;
    margin-top: 4px;
    margin-left: 3px;
    font-weight: bold;
    font-size: 8px;
    letter-spacing: 0.5px;
    line-height: 6px;
    border-left: 1px solid currentColor;
    padding-left: 4px;
  }
  .progress-circle {
    opacity: .7;
    width: 14px;
    height: 14px;
    margin-left: 10px;
  }
  .time-ruller {
    overflow: hidden;
    pointer-events: none;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    top: 0;
    left: 0;
    height: ${tlScrubberHeight}px;
    color: ${whiteAlpha3Color};
    background-color: ${blackColor}AA;
    backdrop-filter: blur(8px);
  }
  .time-ruller-digit {
    justify-content: flex-start;
    width: ${msToEm(500)};
    height: ${tlScrubberHeight}px;
    padding-left: 4px;
    text-align: center;
  }
  .time-ruller-digit span {
    font-weight: bold;
    font-size: 10px;
    margin-top: 2px;
  }
  .timeline-block {
    flex-direction: column;
  }
  .animation-block {
    flex-direction: column;
  }
  .iterations-block {
    flex-direction: row;
    align-items: flex-start;
  }
  .iteration-block {
    flex-direction: column;
  }
  .iteration-block.is-reversed {
    transform: scaleX(-1);
  }
  .iteration-block.is-reversed .label-block {
    transform: scaleX(-1);
  }
  .iteration-block.is-reversed .iteration-label {
    right: 0;
    transform: translateX(100%);
  }
  .line-block {
    height: ${tlLineHeight}px;
    margin-top: 1px;
    margin-bottom: 1px;
    opacity: .87;
    cursor: pointer;
  }
  .line-block:hover {
    opacity: 1;
    filter: saturate(1.2);
  }
  .line-block:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: -1px;
    right: 0;
    bottom: -1px;
    background-color: transparent;
  }
  .iteration-line-block {
    border-radius: 4px;
    background-color: currentColor;
  }
  .iteration-background-block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${blackAlpha1Color};
    border-radius: 3px;
  }
  .iteration-delay-block {
    border-radius: 3px 0 0 3px;
  }
  .iteration-duration-block {
    justify-content: space-between;
    background-color: currentColor;
    border-radius: 3px;
  }
  .iteration-endDelay-block {
    border-radius: 0 3px 3px 0;
  }
  .tween-line-block {
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-block {
    background-color: currentColor;
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-block-item {
    height: ${tlLineHeight}px;
  }
  .tween-background-block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${blackAlpha1Color};
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-duration-block {
    overflow: hidden;
    justify-content: space-between;
    background-color: currentColor;
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-skipped-duration-block {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 7px 7px 0px;
    background-image: linear-gradient(
      45deg,
      transparent  25%, ${blackAlpha2Color} 25%, ${blackAlpha2Color} 50%,
      transparent  50%, transparent  75%, ${blackAlpha2Color} 75%,
      ${blackAlpha2Color} 100%
    );
    background-size: 3px 3px;
  }
  .label-block {
    pointer-events: none;
    z-index: 1;
    align-items: center;
    height: 100%;
    margin-top: 0px;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: .05em;
    white-space: pre;
  }
  .tl-label-block {
    pointer-events: auto;
    position: absolute;
    z-index: 1;
    top: 0px;
    height: 100%;
    background-color: ${colors[0]}77;
    backdrop-filter: blur(8px);
    cursor: pointer;
  }
  .tl-label-block:after {
    pointer-events: none;
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: -1px;
    width: 0px;
    height: var(--anime-gui-tl-height);
    border-left: 1px dotted ${colors[0]}77;
  }
  .tl-label-block .label-block {
    color: ${whiteAlpha3Color};
  }
  .tl-label-block:hover .label-block {
    color: ${whiteColor};
  }
  .tween-line-block .label-block {
    opacity: 0;
  }
  .tween-block-item > .label-block {
    color: ${blackColor};
  }
  .iteration-line-block > .label-block,
  .tween-block > .label-block {
    opacity: .4;
    position: absolute;
    left: 0;
    top: 0;
    color: currentColor;
    transform: translateX(calc(-100% + 4px));
  }
  .iterations-block:first-child:hover > .iteration-block-item > .iteration-line-block .label-block,
  .animation-block:hover > .iterations-block:first-child .tween-line-block:hover .label-block,
  .tween-line-block:hover .label-block {
    opacity: 1!important;
    transition-duration: 0s;
  }
  .iteration-block:before {
    content: "";
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: currentColor;
    transition: opacity .25s ease-out;
  }
  .is-highlighted {
    filter: brightness(2);
  }
  .highlight {
    opacity: 0;
    position: absolute;
    zIndex: 9999;
    box-shadow: 0 0 0 1px #0008, 0 0 0 3px currentColor, 0 0 0 4px #0008;
    border-radius: 2px;
  }
  .highlight:before {
    content: "";
    opacity: .25;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    zIndex: 9999;
    border-radius: 3px;
    background-color: currentColor;
  }
`;

const dom = initDOM();
const targetsIdMap = new Map();
const idsTargetMap = new Map();

let targetId = 0;

function registerTarget($target) {
  const id = targetsIdMap.get($target);
  if (id !== undefined) {
    return id;
  } else {
    targetsIdMap.set($target, ++targetId);
    idsTargetMap.set(targetId, $target);
    return targetId;
  }
}

function highlightTarget(targetId, color) {
  const $target = idsTargetMap.get(targetId);
  if (!$target) return;
  const { left, top, width, height } = $target.getBoundingClientRect();
  if (width + height === 0) return;
  let $highlight = utils.$(`.${prefix}highlight.${prefix}${targetId}`)[0];
  if (!$highlight) {
    $highlight = createBlock(['highlight', targetId]);
    document.body.appendChild($highlight);
  }
  utils.set($highlight, { left, top, width, height, opacity: 1, color: color });
}

function clearHighlight() {
  utils.$(`.${prefix}highlight`).forEach($highlight => $highlight.remove());
}

function createLabel(text, css) {
  const el = createBlock('label-block', css);
  el.innerHTML = text;
  return el;
}

function createTweenBlock(tween, previousTweenEl, animationEl, isFirstIteration) {
  const el = createBlock(['line-block', 'tween-line-block']);
  const tweenEl = createBlock(['tween-block']);
  const backgroundEl = createBlock(['tween-background-block']);
  const delayEl = createBlock(['tween-delay-block', 'tween-block-item']);
  const durationEl = createBlock(['tween-duration-block', 'tween-block-item']);
  const skippedDurationEl = createBlock(['tween-skipped-duration-block', 'tween-block-item']);
  const fromValueLabelEl = createLabel(tween._fromNumbers ? tween._fromNumbers[0] : tween._fromNumber, `padding-right: 1px;`);
  const fromToLabelEl = createLabel(tween._toNumbers ? tween._toNumbers[0] : tween._toNumber, `padding-left: 1px;`);
  tweenEl.setAttribute('data-tween', tween.id);
  if (tween._prevRep) tweenEl.setAttribute('data-previous-tween', tween._prevRep.id);
  if (tween._nextRep) tweenEl.setAttribute('data-next-tween', tween._nextRep.id);
  if (tween._isOverridden) tweenEl.style.opacity = `${.5}`;
  durationEl.appendChild(fromValueLabelEl);
  if (parameters.showTweenId) durationEl.appendChild(createLabel(tween.id, `justify-content: center; position: absolute; left: 0; right: 0; text-align: center;`));
  durationEl.appendChild(fromToLabelEl);
  tweenEl.appendChild(backgroundEl);
  // const tweenDelay = (tween.parent._offset + tween._startTime) - tween._absoluteStartTime;
  const tweenDelay = tween._delay;
  if (tweenDelay || tween.parent._delay) {
    delayEl.style.width = msToEm(previousTweenEl ? tweenDelay : tween.parent._delay + tweenDelay);
    tweenEl.appendChild(delayEl);
  }
  // if (tween._changeDuration) {
    durationEl.style.width = msToEm(tween._updateDuration);
    if (tween._updateDuration <= minValue) {
      durationEl.style.width = msToEm(10);
    }
    skippedDurationEl.style.width = msToEm(tween._updateDuration - tween._changeDuration);
    durationEl.appendChild(skippedDurationEl);
    tweenEl.appendChild(durationEl);
  // }
  if (tween._head) {
    tweenEl.style.filter = 'saturate(200%)';
    const tweenHeadEl = animationEl.querySelector(`.${prefix}tween-block[data-tween="${tween._head.id}"]`) || tweenEl;
    tweenHeadEl.style.filter = 'saturate(50%)';
  }
  if (!previousTweenEl) {
    if (isFirstIteration) {
      const propertyLabelEl = createLabel(tween.property + '—');
      tweenEl.appendChild(propertyLabelEl);
    }
    el.appendChild(tweenEl);
    return el;
  } else {
    previousTweenEl.appendChild(tweenEl);
    return previousTweenEl;
  }
}

function createTimelineLabel(labels, name, tlOffset) {
  const startTime = tlOffset + labels[name];
  const el = createBlock('tl-label-block', `left: ${msToEm(startTime)};`);
  el.dataset.startTime = startTime;
  el.appendChild(createLabel(name));
  return el;
}

function createIterationBlock(animation, i, iterationsEl, color, $tlScrubber) {
  const { _reversed, _alternate, _delay, _loopDelay, _iterationDuration, _offset, labels } = animation;
  const isFirstIteration = !i;
  // const isOdd = i % 2;
  // const isInverted = _direction > 0 && (_direction === 1 || _direction === 2 && isOdd || _direction === 3 && !isOdd);
  const isOdd = i % 2;
  // const isInverted = ~~(_direction === -1 || _direction === 2 && isOdd || _direction === -2 && !isOdd);
  const isReversed = _reversed ^ (_alternate && isOdd);
  const iterationEl = createBlock(['iteration-block', 'iteration-block-item']);
  const iterationLineEl = createBlock(['line-block', 'iteration-line-block']);
  const backgroundEl = createBlock(['iteration-background-block']);
  const delayEl = createBlock(['iteration-delay-block', 'iteration-block-item']);
  const durationEl = createBlock(['iteration-duration-block', 'iteration-block-item']);
  const loopDelayEl = createBlock(['iteration-loopDelay-block', 'iteration-block-item']);
  iterationLineEl.appendChild(backgroundEl);
  if (isFirstIteration) {
    const labelPrefix = isNaN(+animation.id) ? '' : animation._hasChildren ? 'Timeline ' : 'Animation ';
    const labelEl = createLabel(labelPrefix + animation.id + '—');
    iterationLineEl.appendChild(labelEl);
  }
  if (_delay) {
    delayEl.style.width = msToEm(_delay);
    iterationLineEl.appendChild(delayEl);
  }
  const isSet = _iterationDuration <= minValue;
  // TODO: REMOVE?
  if (_iterationDuration === Infinity || _iterationDuration === maxValue) {
    // durationEl.style.width = msToEm(_iterationDuration);
    durationEl.appendChild(createLabel('∞', `
      font-size: 16px;
      margin-left: auto;
      margin-right: auto;
    `));
  } else if (isSet) {
    durationEl.style.width = msToEm(10);
  } else {
    durationEl.style.width = msToEm(_iterationDuration);
  }
  iterationLineEl.appendChild(durationEl);
  if (_loopDelay) {
    loopDelayEl.style.width = msToEm(_loopDelay);
    iterationLineEl.appendChild(loopDelayEl);
  }

  if (isSet) {
    iterationEl.style.width = msToEm(10);
  } else {
    iterationEl.style.width = msToEm(animation._iterationDuration + animation._loopDelay);
  }

  // if (!animation._hasChildren) {
  //   iterationEl.appendChild(iterationLineEl);
  // }

  iterationEl.appendChild(iterationLineEl);

  if (isReversed) {
    iterationEl.classList.add(`${prefix}is-reversed`);
  }

  if (!animation._hasChildren) {
    let currentTarget;
    let currentProperty;
    let previousTargetTweenEl;
    forEachChildren(animation, tween => {
      const target = tween.target;
      const property = tween.property;
      let hasPreviousTween = (property === currentProperty && currentTarget === target);
      if (currentTarget !== target) {
        currentTarget = target;
      }
      const tweenBLockEl = createTweenBlock(tween, hasPreviousTween ? previousTargetTweenEl : false, iterationsEl, isFirstIteration);
      previousTargetTweenEl = tweenBLockEl;
      currentProperty = property;
      tweenBLockEl.dataset.color = color;
      tweenBLockEl.dataset.targetId = registerTarget(target);
      iterationEl.appendChild(tweenBLockEl);
    });
  }

  if (labels) {
    for (let name in labels) {
      const timelineLabelEl = createTimelineLabel(labels, name, _offset);
      $tlScrubber.appendChild(timelineLabelEl);
    }
  }

  return iterationEl;
}

function createIterationsBlock(animation, color) {
  const { $tlScrubber } = dom;
  const $el = createBlock('iterations-block');
  // const iterationCount = 1;
  const iterationCount = animation._iterationCount === Infinity ? 1 : animation._iterationCount;
  const visualOffsetMs = animation._offset;
  for (let i = 0; i < iterationCount; i++) {
    const iterationEl = createIterationBlock(animation, i, $el, color, $tlScrubber);
    if (animation._hasChildren) {
      forEachChildren(animation, child => {
        // Do not display tl.set() animations
        // if (child.duration > 1) {
          const childAnimationEl = createAnimationBlock(child);
          childAnimationEl.style.marginLeft = msToEm(-visualOffsetMs);
          iterationEl.appendChild(childAnimationEl);
        // }
      });
    }
    $el.appendChild(iterationEl);
  }
  $el.style.marginLeft = msToEm(visualOffsetMs);
  $el.dataset.startTime = visualOffsetMs;
  $el.dataset.endTime = visualOffsetMs + animation.duration;
  $el.dataset.color = color;
  return $el;
}

function createAnimationBlock(animation) {
  const color = getColor(animation.id);
  const el = createBlock('animation-block', `color: ${color};`);
  const iterationsBLockEl = createIterationsBlock(animation, color);
  el.setAttribute('data-animation', animation.id);
  el.appendChild(iterationsBLockEl);
  return el;
}

function clearHighlightTweens() {
  const $tweens = dom.$wrapper.querySelectorAll(`.${prefix}tween-block`);
  for (let i = 0, l = $tweens.length; i < l; i++) {
    $tweens[i].classList.remove(`${prefix}is-highlighted`);
  }
}

function highlightSiblings($tween) {
  clearHighlightTweens();
  const nextId = $tween.getAttribute('data-next-tween');
  const prevId = $tween.getAttribute('data-previous-tween');
  if (nextId) {
    const $nextTween = dom.$wrapper.querySelector(`.${prefix}tween-block[data-tween="${nextId}"]`);
    if ($nextTween) $nextTween.classList.add(`${prefix}is-highlighted`);
  }
  if (prevId) {
    const $prevTween = dom.$wrapper.querySelector(`.${prefix}tween-block[data-tween="${prevId}"]`);
    if ($prevTween) $prevTween.classList.add(`${prefix}is-highlighted`);
  }
}

function updateCurrentTimeParam() {
  const activeInstance = getActiveInstance();
  setParameter('time', utils.round(activeInstance.currentTime, 0));
}

function generateScrubberTL(progressAnimation) {
  const activeInstance = getActiveInstance();
  const { duration } = activeInstance;
  const { clamped } = parameters;
  const scrubberDuration = clamped ? parameters.endTime - parameters.startTime : duration;
  const scrubberStart = clamped ? parameters.startTime : 0;
  const scrubberEnd = clamped ? parameters.endTime : duration;
  const minProgress = clamped ? scrubberStart / duration : 0;
  const maxProgress = clamped ? scrubberEnd / duration : 1;

  const tl = createTimeline({
    autoplay: false,
    onBegin: () => setPlaybackStatus(false),
    onComplete: () => setPlaybackStatus(true),
    playbackRate: parameters.speed,
    loop: parameters.loop,
    defaults: {
      duration: scrubberDuration,
      ease: 'linear',
    },
  })
  .add({
    frameRate: 1,
    duration: scrubberDuration,
    onUpdate: updateCurrentTimeParam,
  }, 0)
  .add([activeInstance, progressAnimation], {
    progress: [minProgress, maxProgress],
    // onUpdate: () => {
    //   console.log(activeInstance.progress, progressAnimation.progress);
    // }
  }, 0)
  .add(`.${prefix}time-scrubber`, {
    value: [minProgress, maxProgress],
  }, 0)
  .add(dom.$currentTime, {
    innerHTML: [scrubberStart, scrubberEnd],
    modifier: utils.round(0)
  }, 0)
  .add(dom.$currentTimeShadow, {
    innerHTML: [scrubberStart, scrubberEnd],
    modifier: utils.round(0).padStart(6, '0')
  }, 0);

  return tl.seek(parameters.time);
}

function createMMMap($tlBlock, duration, loopDelay) {
  const $map = createBlock('mm-tl');
  const $tlIterationsBlock = $tlBlock.querySelector(`:scope > .${prefix}iterations-block`);
  const $tlIterationBlocks = $tlIterationsBlock.querySelectorAll(`:scope > .${prefix}iteration-block`);
  const totalIterations = $tlIterationBlocks.length;
  const iterationTotalDuration = (duration + loopDelay) / totalIterations;
  const loopDelayScale = iterationTotalDuration / (duration / totalIterations) * 100;
  const iterationLoopDelayPercent = (loopDelay * totalIterations) / (duration + loopDelay);
  const iterationDurationPercent = 1 - iterationLoopDelayPercent;

  $tlIterationBlocks.forEach(($iterationBlock, i) => {
    const $tlIterationsBlocks = $iterationBlock.querySelectorAll(`.${prefix}iterations-block`);
    const isReversed = $iterationBlock.classList.contains(`${prefix}is-reversed`);
    const $mmScroll = createBlock('mm-tl-scroll', `
      width: ${((iterationDurationPercent / totalIterations) * loopDelayScale)}%;
      margin-right: ${ totalIterations - 1 === i ? 0 : ((iterationLoopDelayPercent / totalIterations) * loopDelayScale)}%;
      transform: scaleX(${isReversed ? -1 : 1});
    `);
    const $iterationEl = createBlock('mm-tl-line', `
      left: 0%;
      width: 100%;
      color: ${$tlIterationsBlock.dataset.color};
    `);
    $mmScroll.appendChild($iterationEl);
    $tlIterationsBlocks.forEach($block => {
      const startTime = ((+$block.dataset.startTime / (duration - (loopDelay * (totalIterations - 1)))) * totalIterations) * 100;
      const endTime = ((+$block.dataset.endTime / (duration - (loopDelay * (totalIterations - 1)))) * totalIterations) * 100;
      const $el = createBlock('mm-tl-line', `
        left: ${startTime}%;
        width: ${(endTime - startTime)}%;
        color: ${$block.dataset.color};
      `);
      $mmScroll.appendChild($el);
    });
    $map.appendChild($mmScroll);
  });
  return $map;
}

function cteateTimeRuller(duration) {
  const $timeRuller = createBlock(['time-ruller', 'ruller-bg'], `
    width: ${msToEm(duration)}
  `);

  for (let i = 0, l = utils.round(duration / 500, 0) + 1; i < l; i++) {
    const timeRullerDigitEl = createBlock('time-ruller-digit');
    timeRullerDigitEl.innerHTML = `<span>${i / 2}</span>`;
    $timeRuller.appendChild(timeRullerDigitEl);
  }

  return $timeRuller;
}

function renderTL() {
  const activeInstance = getActiveInstance();
  const { $tl, $mmScrubber, $tlScrubber, $totalDuration } = dom;
  let duration = activeInstance.duration;
  // TODO: REMOVE?
  if (duration === maxValue) {
    duration = activeInstance._iterationDuration;
  }
  const $tlBlock = createAnimationBlock(activeInstance);
  const $timeRuller = cteateTimeRuller(duration);
  const $mmMap = createMMMap($tlBlock, duration, activeInstance._loopDelay);

  $tlScrubber.appendChild($timeRuller);
  $tl.appendChild($tlBlock);
  $mmScrubber.appendChild($mmMap);

  utils.set(`.${prefix}scrubber`, { step: utils.round(1 / duration, 8) });
  utils.set($tl, { width: `calc(${msToEm(duration)} + ${sideBarWidth}px)` });
  utils.set($totalDuration, { innerHTML: `${duration}<br>ms` });
  utils.set(`.${prefix}toggle-button svg`, { rotate: parameters.minified !== false ? 0 : 180 });

  // Events

  const $iterationLines = $tlBlock.querySelectorAll(`.${prefix}iteration-line-block`);
  const $tweenLines = $tlBlock.querySelectorAll(`.${prefix}tween-line-block`);
  const $tweens = $tlBlock.querySelectorAll(`.${prefix}tween-block`);

  $iterationLines.forEach($iterationLine => {
    $iterationLine.onmouseenter = () => {
      const $tweenLines = $iterationLine.parentNode.querySelectorAll(`.${prefix}tween-line-block`);
      $tweenLines.forEach($tweenLine => {
        const iterationColor = utils.get($tweenLine.parentNode, 'color');
        highlightTarget(+$tweenLine.dataset.targetId, iterationColor);
      });
    };
    $iterationLine.onmouseleave = clearHighlight;
  });

  $tweenLines.forEach($tweenLine => {
    const { targetId, color } = $tweenLine.dataset;
    $tweenLine.onmouseenter = () => highlightTarget(+targetId, color);
    $tweenLine.onmouseleave = clearHighlight;
  });

  if (parameters.highlightSiblings) {
    for (let i = 0, l = $tweens.length; i < l; i++) {
      const $tween = $tweens[i];
      $tween.onmouseenter = () => highlightSiblings($tween);
      $tween.onmouseleave = () => highlightSiblings($tween);
    }
  }

  return $tlBlock;
}

function appendDOM($wrapper) {
  utils.set(parameters.$container, {
    '--anime-gui-height': `${parameters.height}px`,
    '--anime-gui-tl-height': `calc(var(--anime-gui-height) - ${toolbarHeight}px)`,
    paddingBottom: 'var(--anime-gui-height)',
  });
  parameters.$container.appendChild($wrapper);
}

let wrapperWasOpen;

function setWrapperSize(newH) {
  const height = utils.clamp(toolbarHeight, window.innerHeight).round(0)(newH);
  const isOpen = height > toolbarHeight;
  setParameter('height', height);
  utils.set(parameters.$container, { '--anime-gui-height': height + 'px' });
  if (wrapperWasOpen !== isOpen) {
    animate(`.${prefix}toggle-button svg`, { rotate: !wrapperWasOpen ? 180 : 0, duration: 250 });
  }
  wrapperWasOpen = isOpen;
}

function resizeSrubberRange(duration) {
  const { startTime, endTime } = parameters;
  utils.set(dom.$mmBox, {
    left: `calc(${(startTime / duration) * 100}% - 3px)`,
    right: `calc(${((duration - endTime) / duration) * 100}% - 3px)`,
    modifier: utils.round(1),
  });
}

function setPlaybackStatus(paused) {
  const playbackMode = paused ? 'play' : 'pause';
  const classMode = paused ? 'remove' : 'add';
  utils.set(`.${prefix}playback-button`, { innerHTML: getIconCode(playbackMode) });
  document.body.classList[classMode](`${prefix}is-playing`);
  updateCurrentTimeParam();
}

function togglePlayback(scrubberTL) {
  const { paused } = scrubberTL;
  scrubberTL[paused ? 'play' : 'pause']();
  setPlaybackStatus(!paused);
}

function inspect(instance, userParams = {}) {
  instance.pause();
  if (instance._iterationCount === Infinity) {
    instance._iterationCount = 1;
    instance.duration = instance._iterationDuration;
    parameters.loop = true;
  }
  parseParameters(userParams);
  instances.push(instance);
  const { height } = parameters;
  if (isNil(parameters.endTime)) parameters.endTime = instance.duration;
  if (isNil(parameters.active)) parameters.active = instances.length - 1;
  if (isNil(parameters.minified)) parameters.minified = height === toolbarHeight ? false : height;
  dom.$speedButton.value = parameters.speed;

  appendStyles(styles);
  appendDOM(dom.$wrapper);
  renderTL();

  const progressAnimation = animate(svg.createDrawable(`.${prefix}progress-circle path`), {
    draw: '0 1',
    ease: 'linear',
    autoplay: false
  });

  let scrubberTL = generateScrubberTL(progressAnimation);

  function updateClamp() {
    const { clamped } = parameters;
    const { paused } = scrubberTL;
    const { currentTime } = instance;
    const className = clamped ? 'add' : 'remove';
    dom.$clampButton.classList[className](`${prefix}is-active`);
    dom.$wrapper.classList[className](`${prefix}is-clamped`);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(clamped ? 0 : currentTime);
    if (!paused) scrubberTL.play();
  }

  function toggleClamp() {
    parameters.clamped = !parameters.clamped;
    setParameter('clamped', parameters.clamped);
    updateClamp();
  }

  setPlaybackStatus(scrubberTL.paused);
  updateClamp();

  function updateTimeScrubberValue(timeValue, duration) {
    clearHighlight();
    updateCurrentTimeParam();
    const minProgress = parameters.clamped ? parameters.startTime / duration : 0;
    const maxProgress = parameters.clamped ? parameters.endTime / duration : 1;
    const value = utils.clamp(timeValue, minProgress, maxProgress);
    utils.set(`.${prefix}time-scrubber`, { value });
    scrubberTL.completed = false;
    scrubberTL.progress = utils.mapRange(value, minProgress, maxProgress, 0, 1);
  }

  function seekToRange(startTime, endTime) {
    if (parameters.clamped) {
      setParameter('startTime', startTime);
      setParameter('endTime', endTime);
      scrubberTL.cancel();
      scrubberTL = generateScrubberTL(progressAnimation);
      createTimeline({ defaults: { duration: 250, ease: 'out(3)', composition: 'add' } })
      .add(`.${prefix}min-scrubber`, { value: startTime / instance.duration }, 0)
      .add(`.${prefix}max-scrubber`, { value: endTime / instance.duration }, 0)
      .add(dom.$mmBox, {
        left: `calc(${(startTime / instance.duration) * 100}% - 3px)`,
        right: `calc(${((instance.duration-endTime) / instance.duration) * 100}% - 3px)`,
        modifier: utils.round(1),
      }, 0);
      updateTimeScrubberValue(startTime, instance.duration);
      resizeSrubberRange(instance.duration);
      scrubberTL.play();
    } else {
      scrubberTL.pause().seek(startTime).play();
    }
  }

  const $timeScrubbers = utils.$(`.${prefix}time-scrubber`);
  const $minScrubbers = utils.$(`.${prefix}min-scrubber`);
  const $maxScrubbers = utils.$(`.${prefix}max-scrubber`);

  utils.set($timeScrubbers, { value: parameters.time / instance.duration });
  utils.set($minScrubbers, { value: parameters.startTime / instance.duration });
  utils.set($maxScrubbers, { value: parameters.endTime / instance.duration });

  resizeSrubberRange(instance.duration);

  $timeScrubbers.forEach($timeScrubber => {
    $timeScrubber.onmousedown = () => {
      scrubberTL.pause();
      setPlaybackStatus(scrubberTL.paused);
    };
    $timeScrubber.oninput = () => updateTimeScrubberValue($timeScrubber.value, instance.duration);
  });

  const onMinScrubberInput = function() {
    const startTime = utils
      .clamp(0, parameters.endTime).round(0)
      (this.value * instance.duration);
    setParameter('startTime', startTime);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(0);
    setPlaybackStatus(scrubberTL.paused);
    utils.set($minScrubbers, { value: startTime / instance.duration });
    resizeSrubberRange(instance.duration);
  };

  const onMaxScrubberInput = function() {
    const endTime = utils
      .clamp(parameters.startTime, instance.duration).round(0)
      (this.value * instance.duration);
    setParameter('endTime', endTime);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(scrubberTL.duration);
    setPlaybackStatus(scrubberTL.paused);
    utils.set($maxScrubbers, { value: endTime / instance.duration });
    resizeSrubberRange(instance.duration);
  };

  $minScrubbers.forEach($scrubber => $scrubber.oninput = onMinScrubberInput);
  $maxScrubbers.forEach($scrubber => $scrubber.oninput = onMaxScrubberInput);

  dom.$speedButton.addEventListener('change', () => {
    const speed = dom.$speedButton.value;
    setParameter('speed', dom.$speedButton.value);
    scrubberTL.playbackRate = speed;
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayback(scrubberTL);
    }
    if (e.code === 'KeyB') {
      scrubberTL.progress = 0;
    }
    if (e.code === 'KeyR') {
      scrubberTL.progress = 0;
      scrubberTL.play();
    }
  });

  document.addEventListener('click', (e) => {
    const $closestIterationsBlock = e.target.closest(`.${prefix}iterations-block`);
    if ($closestIterationsBlock) {
      const startTime = utils.round($closestIterationsBlock.dataset.startTime, 0);
      const endTime = utils.round($closestIterationsBlock.dataset.endTime, 0);
      seekToRange(startTime, endTime);
    }
    const $closestTlLabelBlock = e.target.closest(`.${prefix}tl-label-block`);
    if ($closestTlLabelBlock) {
      const $nextSlibling = $closestTlLabelBlock.nextElementSibling ? $closestTlLabelBlock.nextElementSibling.matches(`.${prefix}tl-label-block`) ? $closestTlLabelBlock.nextElementSibling : null : null;
      const startTime = utils.round($closestTlLabelBlock.dataset.startTime, 0);
      const endTime = $nextSlibling ? utils.round($nextSlibling.dataset.startTime, 0) : parameters.endTime <= startTime ? instance.duration : parameters.endTime;
      seekToRange(startTime, endTime);
    }
    const $closestToggleButton = e.target.closest(`.${prefix}toggle-button`);
    if ($closestToggleButton) {
      const isOpen = parameters.minified === false;
      createTimeline({
        onRender: () => setWrapperSize(parameters.height),
        defaults: { duration: 350, ease: 'out(4)' },
      })
      .add(parameters, { height: isOpen ? toolbarHeight : parameters.minified }, 0);
      setParameter('minified', isOpen ? parameters.height : false);
    }
    const $closestPlaybackButton = e.target.closest(`.${prefix}playback-button`);
    if ($closestPlaybackButton) {
      togglePlayback(scrubberTL);
    }
    const $closestBackButton = e.target.closest(`.${prefix}back-button`);
    if ($closestBackButton) {
      scrubberTL.progress = 0;
    }
    const $closestClampButton = e.target.closest(`.${prefix}clamp-button`);
    if ($closestClampButton) {
      toggleClamp();
    }
  });

  dom.$tlWrapper.scrollLeft = parameters.scrollX;
  dom.$tlWrapper.scrollTop = parameters.scrollY;

  dom.$tlWrapper.addEventListener('scroll', () => {
    setParameter('scrollX', dom.$tlWrapper.scrollLeft);
    setParameter('scrollY', dom.$tlWrapper.scrollTop);
  });

  // Resize

  let startY = 0;
  let startHeight = window.innerHeight;

  function resizeWrapper(diffY) {
    const newH = parameters.height + diffY;
    setWrapperSize(newH);
    setParameter('minified', newH > toolbarHeight ? false : utils.round(window.innerHeight * .33, 0));
  }

  function onWrapperResize(e) {
    const diffY = startY - e.y;
    resizeWrapper(diffY);
    startY = e.y;
  }

  function onWindowResize() {
    const diffY = window.innerHeight - startHeight;
    resizeWrapper(diffY);
    startHeight = window.innerHeight;
  }

  dom.$resizer.addEventListener('mousedown', e => {
    startY = e.y;
    document.addEventListener('mousemove', onWrapperResize, false);
  }, false);

  dom.$mmScrubber.addEventListener('wheel', e => {
    e.preventDefault();
    const speed = instance.duration / scrubberTL.duration / 10000;
    scrubberTL.progress += e.deltaY * speed;
    scrubberTL.progress += e.deltaX * -speed;
  }, {passive: false});

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onWrapperResize, false);
  }, false);

  window.onresize = onWindowResize;

  // Play if the active instance has autplay defined

  scrubberTL[instance._autoplay ? 'play' : 'pause']();

}

export { inspect };
