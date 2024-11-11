/**
 * anime.js - ES5 IIFE
 * @version v4.0.0-beta.102.2
 * @author Julian Garnier
 * @license MIT
 * @copyright (c) 2024 Julian Garnier
 * @see https://animejs.com
 */

var anime = (function (exports) {
  'use strict';

  function _callSuper(t, o, e) {
    return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (t) {}
    return (_isNativeReflectConstruct = function () {
      return !!t;
    })();
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }
    return object;
  }
  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get.bind();
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }
        return desc.value;
      };
    }
    return _get.apply(this, arguments);
  }
  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);
        var desc;
        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);
          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }
        desc = Object.getOwnPropertyDescriptor(receiver, property);
        if (desc) {
          if (!desc.writable) {
            return false;
          }
          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }
        return true;
      };
    }
    return set(target, property, value, receiver);
  }
  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
      throw new TypeError('failed to set property');
    }
    return value;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var isBrowser = typeof window !== 'undefined';
  var win = isBrowser ? window : null;
  var doc = isBrowser ? document : null;
  var tweenTypes = {
    INVALID: 0,
    OBJECT: 1,
    ATTRIBUTE: 2,
    CSS: 3,
    TRANSFORM: 4,
    CSS_VAR: 5
  };
  var valueTypes = {
    NUMBER: 0,
    UNIT: 1,
    COLOR: 2,
    COMPLEX: 3
  };
  var tickModes = {
    NONE: 0,
    AUTO: 1,
    FORCE: 2
  };
  var compositionTypes = {
    replace: 0,
    none: 1,
    blend: 2
  };
  var isRegisteredTargetSymbol = Symbol();
  var isDomSymbol = Symbol();
  var isSvgSymbol = Symbol();
  var transformsSymbol = Symbol();
  var morphPointsSymbol = Symbol();
  var draggableSymbol = Symbol();
  var proxyTargetSymbol = Symbol();
  var minValue = 1e-11;
  var maxValue = 1e12;
  var K = 1e3;
  var maxFps = 120;
  var emptyString = '';
  var shortTransforms = new Map();
  shortTransforms.set('x', 'translateX');
  shortTransforms.set('y', 'translateY');
  shortTransforms.set('z', 'translateZ');
  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];
  var transformsFragmentStrings = validTransforms.reduce(function (a, v) {
    return _objectSpread2(_objectSpread2({}, a), {}, _defineProperty({}, v, v + '('));
  }, {});
  var noop = function noop() {};
  var hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
  var rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
  var rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  var hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
  var hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  var digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
  var unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
  var lowerCaseRgx = /([a-z])([A-Z])/g;
  var transformsExecRgx = /(\w+)(\([^)]+\)+)/g;
  var relativeValuesExecRgx = /(\*=|\+=|-=)/;

  var defaults = {
    id: null,
    keyframes: null,
    playbackEase: null,
    playbackRate: 1,
    frameRate: maxFps,
    loop: 0,
    reversed: false,
    alternate: false,
    autoplay: true,
    duration: K,
    delay: 0,
    loopDelay: 0,
    ease: 'outQuad',
    composition: compositionTypes.replace,
    modifier: function modifier(v) {
      return v;
    },
    onBegin: noop,
    onUpdate: noop,
    onRender: noop,
    onLoop: noop,
    onComplete: noop
  };
  var globals = {
    defaults: defaults,
    root: doc,
    scope: null,
    precision: 4,
    timeScale: 1,
    tickThreshold: 200
  };

  var toLowerCase = function toLowerCase(str) {
    return str.replace(lowerCaseRgx, '$1-$2').toLowerCase();
  };
  var stringStartsWith = function stringStartsWith(str, sub) {
    return str.indexOf(sub) === 0;
  };
  var now = Date.now;
  var isArr = Array.isArray;
  var isObj = function isObj(a) {
    return a && a.constructor === Object;
  };
  var isNum = function isNum(a) {
    return typeof a === 'number' && !isNaN(a);
  };
  var isStr = function isStr(a) {
    return typeof a === 'string';
  };
  var isFnc = function isFnc(a) {
    return typeof a === 'function';
  };
  var isUnd = function isUnd(a) {
    return typeof a === 'undefined';
  };
  var isNil = function isNil(a) {
    return isUnd(a) || a === null;
  };
  var isSvg = function isSvg(a) {
    return isBrowser && a instanceof SVGElement;
  };
  var isHex = function isHex(a) {
    return hexTestRgx.test(a);
  };
  var isRgb = function isRgb(a) {
    return stringStartsWith(a, 'rgb');
  };
  var isHsl = function isHsl(a) {
    return stringStartsWith(a, 'hsl');
  };
  var isCol = function isCol(a) {
    return isHex(a) || isRgb(a) || isHsl(a);
  };
  var isKey = function isKey(a) {
    return !globals.defaults.hasOwnProperty(a);
  };
  var parseNumber = function parseNumber(str) {
    return isStr(str) ? parseFloat(str) : (str);
  };
  var pow = Math.pow;
  var sqrt = Math.sqrt;
  var sin = Math.sin;
  var cos = Math.cos;
  var abs = Math.abs;
  var exp = Math.exp;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var asin = Math.asin;
  var max = Math.max;
  var atan2 = Math.atan2;
  var PI = Math.PI;
  var _round = Math.round;
  var clamp = function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  };
  var round = function round(v, decimalLength) {
    if (decimalLength < 0) return v;
    var m = Math.pow(10, decimalLength);
    return _round(v * m) / m;
  };
  var snap = function snap(v, increment) {
    return isArr(increment) ? increment.reduce(function (closest, cv) {
      return abs(cv - v) < abs(closest - v) ? cv : closest;
    }) : increment ? _round(v / increment) * increment : v;
  };
  var interpolate = function interpolate(start, end, progress) {
    return start + (end - start) * progress;
  };
  var clampInfinity = function clampInfinity(v) {
    return v === Infinity ? maxValue : v === -Infinity ? -maxValue : v;
  };
  var clampZero = function clampZero(v) {
    return v < minValue ? minValue : v;
  };
  var cloneArray = function cloneArray(a) {
    return isArr(a) ? _toConsumableArray(a) : a;
  };
  var mergeObjects = function mergeObjects(o1, o2) {
    var merged = _objectSpread2({}, o1);
    for (var p in o2) {
      var o1p = o1[p];
      merged[p] = isUnd(o1p) ? o2[p] : o1p;
    }
    return merged;
  };
  var forEachChildren = function forEachChildren(parent, callback, reverse) {
    var prevProp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_prev';
    var nextProp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '_next';
    var next = parent._head;
    var adjustedNextProp = nextProp;
    if (reverse) {
      next = parent._tail;
      adjustedNextProp = prevProp;
    }
    while (next) {
      var currentNext = next[adjustedNextProp];
      callback(next);
      next = currentNext;
    }
  };
  var removeChild = function removeChild(parent, child) {
    var prevProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_prev';
    var nextProp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_next';
    var prev = child[prevProp];
    var next = child[nextProp];
    prev ? prev[nextProp] = next : parent._head = next;
    next ? next[prevProp] = prev : parent._tail = prev;
    child[prevProp] = null;
    child[nextProp] = null;
  };
  var addChild = function addChild(parent, child, sortMethod) {
    var prevProp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_prev';
    var nextProp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '_next';
    var prev = parent._tail;
    while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
    var next = prev ? prev[nextProp] : parent._head;
    prev ? prev[nextProp] = child : parent._head = child;
    next ? next[prevProp] = child : parent._tail = child;
    child[prevProp] = prev;
    child[nextProp] = next;
  };

  var Clock = function () {
    function Clock() {
      _classCallCheck(this, Clock);
      this.currentTime = 0;
      this.deltaTime = 0;
      this._elapsedTime = 0;
      this._startTime = 0;
      this._lastTime = 0;
      this._scheduledTime = 0;
      this._frameDuration = K / maxFps;
      this._fps = maxFps;
      this._speed = 1;
      this._hasChildren = false;
    }
    _createClass(Clock, [{
      key: "frameRate",
      get: function get() {
        return this._fps;
      },
      set: function set(frameRate) {
        var previousFrameDuration = this._frameDuration;
        var fr = +frameRate;
        var fps = fr < minValue ? minValue : fr;
        var frameDuration = K / fps;
        this._fps = fps;
        this._frameDuration = frameDuration;
        this._scheduledTime += frameDuration - previousFrameDuration;
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return this._speed;
      },
      set: function set(playbackRate) {
        var pbr = +playbackRate;
        this._speed = pbr < minValue ? minValue : pbr;
      }
    }, {
      key: "requestTick",
      value: function requestTick(time) {
        var scheduledTime = this._scheduledTime;
        var elapsedTime = this._elapsedTime;
        this._elapsedTime += time - elapsedTime;
        if (elapsedTime < scheduledTime) return tickModes.NONE;
        var frameDuration = this._frameDuration;
        var frameDelta = elapsedTime - scheduledTime;
        this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
        return tickModes.AUTO;
      }
    }, {
      key: "computeDeltaTime",
      value: function computeDeltaTime(time) {
        var delta = time - this._lastTime;
        this.deltaTime = delta;
        this._lastTime = time;
        return delta;
      }
    }]);
    return Clock;
  }();

  var render = function render(tickable, time, muteCallbacks, internalRender, tickMode) {
    var duration = tickable.duration;
    var currentTime = tickable.currentTime;
    var _currentIteration = tickable._currentIteration;
    var _iterationDuration = tickable._iterationDuration;
    var _iterationCount = tickable._iterationCount;
    var _loopDelay = tickable._loopDelay;
    var _reversed = tickable.reversed;
    var _alternate = tickable._alternate;
    var _hasChildren = tickable._hasChildren;
    var updateStartTime = tickable._delay;
    var updateEndTime = updateStartTime + _iterationDuration;
    var tickableTime = clamp(time - updateStartTime, -updateStartTime, duration);
    var deltaTime = tickableTime - currentTime;
    var isOverTime = tickableTime >= duration;
    var forceTick = tickMode === tickModes.FORCE;
    var autoTick = tickMode === tickModes.AUTO;
    var isManual = forceTick || (deltaTime < 0 ? deltaTime * -1 : deltaTime) >= globals.tickThreshold;
    var hasBegun = tickable.began;
    var isOdd = 0;
    var iterationElapsedTime = tickableTime;
    if (_iterationCount > 1) {
      var currentIteration = ~~(tickableTime / (_iterationDuration + (isOverTime ? 0 : _loopDelay)));
      tickable._currentIteration = clamp(currentIteration, 0, _iterationCount);
      if (isOverTime) {
        tickable._currentIteration--;
      }
      isOdd = tickable._currentIteration % 2;
      iterationElapsedTime = tickableTime % (_iterationDuration + _loopDelay);
    }
    var isReversed = _reversed ^ (_alternate && isOdd);
    var _ease = tickable._ease;
    var iterationTime = isOverTime ? isReversed ? 0 : duration : isReversed ? _iterationDuration - iterationElapsedTime : iterationElapsedTime;
    if (_ease) {
      iterationTime = _iterationDuration * _ease(iterationTime / _iterationDuration) || 0;
    }
    var isRunningBackwards = iterationTime < tickable._iterationTime;
    var seekMode = isManual ? isRunningBackwards ? 2 : 1 : 0;
    var precision = globals.precision;
    tickable._iterationTime = iterationTime;
    tickable._backwards = isRunningBackwards && !isReversed;
    if (!muteCallbacks && !hasBegun && tickableTime > 0) {
      hasBegun = tickable.began = true;
      tickable.onBegin(tickable);
    }
    tickable.currentTime = tickableTime;
    var hasRendered = 0;
    if (hasBegun && tickable._currentIteration !== _currentIteration) {
      if (!muteCallbacks) tickable.onLoop(tickable);
      if (_hasChildren) {
        forEachChildren(tickable, function (child) {
          return child.reset();
        }, true);
      }
    }
    if (forceTick || autoTick && (time >= updateStartTime && time <= updateEndTime || time <= updateStartTime && currentTime > 0 || time >= updateEndTime && currentTime !== duration) || iterationTime >= updateEndTime && currentTime !== duration || iterationTime <= updateStartTime && currentTime > 0 || time <= currentTime && currentTime === duration && tickable.completed) {
      if (hasBegun) {
        tickable.computeDeltaTime(currentTime);
        if (!muteCallbacks) tickable.onUpdate(tickable);
      }
      if (!_hasChildren) {
        var tween = tickable._head;
        var tweenTarget;
        var tweenStyle;
        var tweenTargetTransforms;
        var tweenTargetTransformsProperties;
        var tweenTransformsNeedUpdate = 0;
        var parent = tickable.parent;
        var absoluteTime = tickable._offset + (parent ? parent._offset : 0) + updateStartTime + iterationTime;
        while (tween) {
          var tweenComposition = tween._composition;
          var tweenCurrentTime = tween._currentTime;
          var tweenChangeDuration = tween._changeDuration;
          var tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
          var tweenNextRep = tween._nextRep;
          var tweenPrevRep = tween._prevRep;
          var tweenHasComposition = tweenComposition !== compositionTypes.none;
          if ((seekMode || (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) && (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)) && (!tweenHasComposition || !tween._isOverridden && (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) && (!tweenNextRep || tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime) && (!tweenPrevRep || tweenPrevRep._isOverridden || absoluteTime >= tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration + tween._delay))) {
            var tweenNewTime = tween._currentTime = clamp(iterationTime - tween._startTime, 0, tweenChangeDuration);
            var tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
            var tweenModifier = tween._modifier;
            var tweenValueType = tween._valueType;
            var tweenType = tween._tweenType;
            var tweenIsObject = tweenType === tweenTypes.OBJECT;
            var tweenIsNumber = tweenValueType === valueTypes.NUMBER;
            var tweenPrecision = tweenIsNumber && tweenIsObject || tweenProgress === 0 || tweenProgress === 1 ? -1 : precision;
            var value = void 0;
            var number = void 0;
            if (tweenIsNumber) {
              value = number = tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
            } else if (tweenValueType === valueTypes.UNIT) {
              number = tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
              value = "".concat(number).concat(tween._unit);
            } else if (tweenValueType === valueTypes.COLOR) {
              var fn = tween._fromNumbers;
              var tn = tween._toNumbers;
              var r = round(clamp(tweenModifier(interpolate(fn[0], tn[0], tweenProgress)), 0, 255), 0);
              var g = round(clamp(tweenModifier(interpolate(fn[1], tn[1], tweenProgress)), 0, 255), 0);
              var b = round(clamp(tweenModifier(interpolate(fn[2], tn[2], tweenProgress)), 0, 255), 0);
              var a = clamp(tweenModifier(round(interpolate(fn[3], tn[3], tweenProgress), tweenPrecision)), 0, 1);
              value = "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
              if (tweenHasComposition) {
                var ns = tween._numbers;
                ns[0] = r;
                ns[1] = g;
                ns[2] = b;
                ns[3] = a;
              }
            } else if (tweenValueType === valueTypes.COMPLEX) {
              value = tween._strings[0];
              for (var j = 0, l = tween._toNumbers.length; j < l; j++) {
                var n = tweenModifier(round(interpolate(tween._fromNumbers[j], tween._toNumbers[j], tweenProgress), tweenPrecision));
                var s = tween._strings[j + 1];
                value += "".concat(s ? n + s : n);
                if (tweenHasComposition) {
                  tween._numbers[j] = n;
                }
              }
            }
            if (tweenHasComposition) {
              tween._number = number;
            }
            if (!internalRender && tweenComposition !== compositionTypes.blend) {
              var tweenProperty = tween.property;
              tweenTarget = tween.target;
              if (tweenIsObject) {
                tweenTarget[tweenProperty] = value;
              } else if (tweenType === tweenTypes.ATTRIBUTE) {
                tweenTarget.setAttribute(tweenProperty, value);
              } else {
                tweenStyle = tweenTarget.style;
                if (tweenType === tweenTypes.TRANSFORM) {
                  if (tweenTarget !== tweenTargetTransforms) {
                    tweenTargetTransforms = tweenTarget;
                    tweenTargetTransformsProperties = tweenTarget[transformsSymbol];
                  }
                  tweenTargetTransformsProperties[tweenProperty] = value;
                  tweenTransformsNeedUpdate = 1;
                } else if (tweenType === tweenTypes.CSS) {
                  tweenStyle[tweenProperty] = value;
                } else if (tweenType === tweenTypes.CSS_VAR) {
                  tweenStyle.setProperty(tweenProperty, value);
                }
              }
              if (hasBegun) hasRendered = 1;
            } else {
              tween._value = value;
            }
          }
          if (tweenTransformsNeedUpdate && tween._renderTransforms) {
            var str = emptyString;
            for (var key in tweenTargetTransformsProperties) {
              str += "".concat(transformsFragmentStrings[key]).concat(tweenTargetTransformsProperties[key], ") ");
            }
            tweenStyle.transform = str;
            tweenTransformsNeedUpdate = 0;
          }
          tween = tween._next;
        }
        if (hasRendered && !muteCallbacks) {
          tickable.onRender(tickable);
        }
      }
    }
    if (hasBegun && isOverTime) {
      if (_iterationCount === Infinity) {
        tickable._startTime += tickable.duration;
      } else if (tickable._currentIteration >= _iterationCount - 1) {
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
    return hasRendered;
  };
  var tick = function tick(tickable, time, muteCallbacks, internalRender, tickMode) {
    render(tickable, time, muteCallbacks, internalRender, tickMode);
    if (tickable._hasChildren) {
      var hasRendered = 0;
      var childrenTime = internalRender ? time : tickable._iterationTime;
      var childrenTickTime = now();
      forEachChildren(tickable, function (child) {
        hasRendered += render(child, (childrenTime - child._offset) * child._speed, muteCallbacks, internalRender, child._fps < tickable._fps ? child.requestTick(childrenTickTime) : tickMode);
      }, tickable._backwards);
      if (tickable.began && hasRendered) {
        tickable.onRender(tickable);
      }
    }
  };

  var additive = {
    animation: null,
    update: noop
  };
  var addAdditiveAnimation = function addAdditiveAnimation(lookups) {
    var animation = additive.animation;
    if (!animation) {
      animation = {
        duration: minValue,
        _offset: 0,
        _delay: 0,
        _head: null,
        _tail: null
      };
      additive.animation = animation;
      additive.update = function () {
        lookups.forEach(function (propertyAnimation) {
          var _loop = function _loop() {
            var tweens = propertyAnimation[propertyName];
            var lookupTween = tweens._head;
            var additiveValues = lookupTween._valueType === valueTypes.COMPLEX ? cloneArray(lookupTween._fromNumbers) : null;
            var additiveValue = lookupTween._fromNumber;
            var tween = tweens._tail;
            while (tween && tween !== lookupTween) {
              if (additiveValues) {
                tween._numbers.forEach(function (value, i) {
                  return additiveValues[i] += value;
                });
              } else {
                additiveValue += tween._number;
              }
              tween = tween._prevAdd;
            }
            lookupTween._toNumber = additiveValue;
            lookupTween._toNumbers = additiveValues;
          };
          for (var propertyName in propertyAnimation) {
            _loop();
          }
        });
        render(animation, 1, 1, 0, tickModes.FORCE);
      };
    }
    return animation;
  };

  var engineTickMethod = isBrowser ? requestAnimationFrame : setImmediate;
  var engineCancelMethod = isBrowser ? cancelAnimationFrame : clearImmediate;
  var Engine = function (_Clock) {
    _inherits(Engine, _Clock);
    function Engine() {
      var _this;
      _classCallCheck(this, Engine);
      _this = _callSuper(this, Engine);
      var initTime = now();
      _this.currentTime = initTime;
      _this._elapsedTime = initTime;
      _this._startTime = initTime;
      _this._lastTime = initTime;
      _this.useDefaultMainLoop = true;
      _this.suspendWhenHidden = true;
      _this.defaults = defaults;
      _this._reqId = 0;
      _this._stopped = false;
      _this._suspended = false;
      _this._head = null;
      _this._tail = null;
      return _this;
    }
    _createClass(Engine, [{
      key: "update",
      value: function update() {
        var time = this.currentTime = now();
        if (this.requestTick(time)) {
          this.computeDeltaTime(time);
          var engineSpeed = this._speed;
          var engineFps = this._fps;
          var activeTickable = this._head;
          while (activeTickable) {
            var nextTickable = activeTickable._next;
            if (!activeTickable.paused) {
              tick(activeTickable, (time - activeTickable._startTime) * activeTickable._speed * engineSpeed, 0, 0, activeTickable._fps < engineFps ? activeTickable.requestTick(time) : tickModes.AUTO);
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
    }, {
      key: "stop",
      value: function stop() {
        this._stopped = true;
        return killEngine();
      }
    }, {
      key: "start",
      value: function start() {
        if (this._suspended || this._stopped) {
          forEachChildren(this, function (child) {
            return child.resetTime();
          });
          this._suspended = false;
          this._stopped = false;
        }
        if (this.useDefaultMainLoop && !this._reqId) {
          this._reqId = engineTickMethod(tickEngine);
        }
        return this;
      }
    }, {
      key: "suspend",
      value: function suspend() {
        this._suspended = true;
        return killEngine();
      }
    }, {
      key: "resume",
      value: function resume() {
        return this._stopped ? this : this.start();
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return _get(_getPrototypeOf(Engine.prototype), "playbackRate", this) * (globals.timeScale === 1 ? 1 : K);
      },
      set: function set(playbackRate) {
        _set(_getPrototypeOf(Engine.prototype), "playbackRate", playbackRate * globals.timeScale, this, true);
        forEachChildren(this, function (child) {
          return child.playbackRate = child._speed;
        });
      }
    }, {
      key: "timeUnit",
      get: function get() {
        return globals.timeScale === 1 ? 'ms' : 's';
      },
      set: function set(unit) {
        var S = 0.001;
        var isSecond = unit === 's';
        var newScale = isSecond ? S : 1;
        if (globals.timeScale !== newScale) {
          globals.timeScale = newScale;
          globals.tickThreshold = 200 * newScale;
          var scaleFactor = isSecond ? S : K;
          this.defaults.duration *= scaleFactor;
          this._speed *= scaleFactor;
        }
      }
    }, {
      key: "precision",
      get: function get() {
        return globals.precision;
      },
      set: function set(precision) {
        globals.precision = precision;
      }
    }]);
    return Engine;
  }(Clock);
  var engine = new Engine();
  var tickEngine = function tickEngine() {
    if (engine._head) {
      engine._reqId = engineTickMethod(tickEngine);
      engine.update();
    } else {
      engine._reqId = 0;
    }
  };
  var killEngine = function killEngine() {
    engineCancelMethod(engine._reqId);
    engine._reqId = 0;
    return engine;
  };

  function getNodeList(v) {
    var n = isStr(v) ? globals.root.querySelectorAll(v) : v;
    if (n instanceof NodeList || n instanceof HTMLCollection) return n;
  }
  function parseTargets(targets) {
    if (isNil(targets)) return [];
    if (isArr(targets)) {
      var flattened = targets.flat(Infinity);
      var parsed = [];
      for (var i = 0, l = flattened.length; i < l; i++) {
        var item = flattened[i];
        if (!isNil(item)) {
          var _nodeList = getNodeList(item);
          if (_nodeList) {
            for (var j = 0, jl = _nodeList.length; j < jl; j++) {
              var subItem = _nodeList[j];
              if (!isNil(subItem)) {
                var isDuplicate = false;
                for (var k = 0, kl = parsed.length; k < kl; k++) {
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
            var _isDuplicate = false;
            for (var _j = 0, _jl = parsed.length; _j < _jl; _j++) {
              if (parsed[_j] === item) {
                _isDuplicate = true;
                break;
              }
            }
            if (!_isDuplicate) {
              parsed.push(item);
            }
          }
        }
      }
      return parsed;
    }
    if (!isBrowser) return [targets];
    var nodeList = getNodeList(targets);
    if (nodeList) return Array.from(nodeList);
    return [targets];
  }
  function registerTargets(targets) {
    var parsedTargetsArray = parseTargets(targets);
    var parsedTargetsLength = parsedTargetsArray.length;
    if (parsedTargetsLength) {
      for (var i = 0; i < parsedTargetsLength; i++) {
        var target = parsedTargetsArray[i];
        if (!target[isRegisteredTargetSymbol]) {
          target[isRegisteredTargetSymbol] = true;
          var isSvgType = isSvg(target);
          var isDom = target.nodeType || isSvgType;
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

  var _easeInFunctions;
  var none = function none(t) {
    return t;
  };
  var calcBezier = function calcBezier(aT, aA1, aA2) {
    return (((1 - 3 * aA2 + 3 * aA1) * aT + (3 * aA2 - 6 * aA1)) * aT + 3 * aA1) * aT;
  };
  var binarySubdivide = function binarySubdivide(aX, mX1, mX2) {
    var aA = 0,
      aB = 1,
      currentX,
      currentT,
      i = 0;
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
  var cubicBezier = function cubicBezier() {
    var mX1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var mY1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var mX2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var mY2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
    return mX1 === mY1 && mX2 === mY2 ? none : function (t) {
      return t === 0 || t === 1 ? t : calcBezier(binarySubdivide(t, mX1, mX2), mY1, mY2);
    };
  };
  var steps = function steps() {
    var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var fromStart = arguments.length > 1 ? arguments[1] : undefined;
    var roundMethod = fromStart ? ceil : floor;
    return function (t) {
      return roundMethod(clamp(t, 0, 1) * steps) * (1 / steps);
    };
  };
  var halfPI = PI / 2;
  var doublePI = PI * 2;
  var easeInPower = function easeInPower() {
    var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.64;
    return function (t) {
      return pow(t, +p);
    };
  };
  var easeInFunctions = (_easeInFunctions = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_easeInFunctions, emptyString, easeInPower), "Quad", easeInPower(2)), "Cubic", easeInPower(3)), "Quart", easeInPower(4)), "Quint", easeInPower(5)), "Sine", function Sine(t) {
    return 1 - cos(t * halfPI);
  }), "Circ", function Circ(t) {
    return 1 - sqrt(1 - t * t);
  }), "Expo", function Expo(t) {
    return t ? pow(2, 10 * t - 10) : 0;
  }), "Bounce", function Bounce(t) {
    var pow2,
      b = 4;
    while (t < ((pow2 = pow(2, --b)) - 1) / 11);
    return 1 / pow(4, 3 - b) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2);
  }), "Back", function Back() {
    var overshoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.70158;
    return function (t) {
      return (+overshoot + 1) * t * t * t - +overshoot * t * t;
    };
  }), _defineProperty(_easeInFunctions, "Elastic", function Elastic() {
    var amplitude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var period = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : .3;
    var a = clamp(+amplitude, 1, 10);
    var p = clamp(+period, minValue, 2);
    var s = p / doublePI * asin(1 / a);
    var e = doublePI / p;
    return function (t) {
      return t === 0 || t === 1 ? t : -a * pow(2, -10 * (1 - t)) * sin((1 - t - s) * e);
    };
  }));
  var easeTypes = {
    "in": function _in(easeIn) {
      return function (t) {
        return easeIn(t);
      };
    },
    out: function out(easeIn) {
      return function (t) {
        return 1 - easeIn(1 - t);
      };
    },
    inOut: function inOut(easeIn) {
      return function (t) {
        return t < .5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2;
      };
    },
    outIn: function outIn(easeIn) {
      return function (t) {
        return t < .5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2;
      };
    }
  };
  var linear = function linear() {
    var argsLength = arguments.length;
    if (!argsLength) return none;
    var totalPoints = argsLength - 1;
    var firstArg = arguments.length <= 0 ? undefined : arguments[0];
    var lastArg = totalPoints < 0 || arguments.length <= totalPoints ? undefined : arguments[totalPoints];
    var xPoints = [0];
    var yPoints = [parseNumber(firstArg)];
    for (var i = 1; i < totalPoints; i++) {
      var arg = i < 0 || arguments.length <= i ? undefined : arguments[i];
      var splitValue = isStr(arg) ? arg.trim().split(' ') : [arg];
      var value = splitValue[0];
      var percent = splitValue[1];
      xPoints.push(!isUnd(percent) ? parseNumber(percent) / 100 : i / totalPoints);
      yPoints.push(parseNumber(value));
    }
    yPoints.push(parseNumber(lastArg));
    xPoints.push(1);
    return function easeLinear(t) {
      for (var _i = 1, l = xPoints.length; _i < l; _i++) {
        var currentX = xPoints[_i];
        if (t <= currentX) {
          var prevX = xPoints[_i - 1];
          var prevY = yPoints[_i - 1];
          return prevY + (yPoints[_i] - prevY) * (t - prevX) / (currentX - prevX);
        }
      }
      return yPoints[yPoints.length - 1];
    };
  };
  var irregular = function irregular() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var randomness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var values = [0];
    var total = length - 1;
    for (var i = 1; i < total; i++) {
      var previousValue = values[i - 1];
      var spacing = i / total;
      var segmentEnd = (i + 1) / total;
      var randomVariation = spacing + (segmentEnd - spacing) * Math.random();
      var randomValue = spacing * (1 - randomness) + randomVariation * randomness;
      values.push(clamp(randomValue, previousValue, 1));
    }
    values.push(1);
    return linear.apply(void 0, values);
  };
  var eases = {
    linear: linear,
    irregular: irregular,
    steps: steps,
    cubicBezier: cubicBezier
  };
  var easesLookups = {
    linear: none
  };
  for (var type in easeTypes) {
    var _loop = function _loop() {
      var easeIn = easeInFunctions[name];
      var easeType = easeTypes[type];
      var hasParams = name === emptyString || name === 'Back' || name === 'Elastic';
      var easeFactory = hasParams ? function (a, b) {
        return easeType(easeIn(a, b));
      } : easeType(easeIn);
      var easeName = type + name;
      eases[easeName] = easeFactory;
      easesLookups[easeName] = hasParams ? easeFactory() : easeFactory;
    };
    for (var name in easeInFunctions) {
      _loop();
    }
  }
  var parseEaseString = function parseEaseString(string) {
    if (string.indexOf('(') <= -1) return none;
    var split = string.slice(0, -1).split('(');
    var parsedFn = eases[split[0]];
    var result = parsedFn ? easesLookups[string] = parsedFn.apply(void 0, _toConsumableArray(split[1].split(','))) : none;
    return result;
  };
  var parseEasings = function parseEasings(ease) {
    return isFnc(ease) ? ease : isStr(ease) ? easesLookups[ease] ? easesLookups[ease] : parseEaseString(ease) : none;
  };

  var parseInlineTransforms = function parseInlineTransforms(target, propName, animationInlineStyles) {
    var inlineTransforms = target.style.transform;
    var inlinedStylesPropertyValue;
    if (inlineTransforms) {
      var cachedTransforms = target[transformsSymbol];
      var t;
      while (t = transformsExecRgx.exec(inlineTransforms)) {
        var inlinePropertyName = t[1];
        var inlinePropertyValue = t[2].slice(1, -1);
        cachedTransforms[inlinePropertyName] = inlinePropertyValue;
        if (inlinePropertyName === propName) {
          inlinedStylesPropertyValue = inlinePropertyValue;
          if (animationInlineStyles) {
            animationInlineStyles[propName] = inlinePropertyValue;
          }
        }
      }
    }
    return inlineTransforms && !isUnd(inlinedStylesPropertyValue) ? inlinedStylesPropertyValue : stringStartsWith(propName, 'scale') ? '1' : stringStartsWith(propName, 'rotate') || stringStartsWith(propName, 'skew') ? '0deg' : '0px';
  };

  var getPath = function getPath(path) {
    var parsedTargets = parseTargets(path);
    var $parsedSvg = parsedTargets[0];
    if (!$parsedSvg || !isSvg($parsedSvg)) return;
    return $parsedSvg;
  };
  var morphTo = function morphTo(path2) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : .33;
    return function ($path1) {
      var $path2 = getPath(path2);
      if (!$path2) return;
      var isPath = $path1.tagName === 'path';
      var separator = isPath ? ' ' : ',';
      var previousPoints = $path1[morphPointsSymbol];
      if (previousPoints) $path1.setAttribute(isPath ? 'd' : 'points', previousPoints);
      var v1 = '',
        v2 = '';
      if (!precision) {
        v1 = $path1.getAttribute(isPath ? 'd' : 'points');
        v2 = $path2.getAttribute(isPath ? 'd' : 'points');
      } else {
        var length1 = $path1.getTotalLength();
        var length2 = $path2.getTotalLength();
        var maxPoints = Math.max(Math.ceil(length1 * precision), Math.ceil(length2 * precision));
        for (var i = 0; i < maxPoints; i++) {
          var t = i / (maxPoints - 1);
          var pointOnPath1 = $path1.getPointAtLength(length1 * t);
          var pointOnPath2 = $path2.getPointAtLength(length2 * t);
          var prefix = isPath ? i === 0 ? 'M' : 'L' : '';
          v1 += prefix + round(pointOnPath1.x, 3) + separator + pointOnPath1.y + ' ';
          v2 += prefix + round(pointOnPath2.x, 3) + separator + pointOnPath2.y + ' ';
        }
      }
      $path1[morphPointsSymbol] = v2;
      return [v1, v2];
    };
  };
  function createDrawableProxy($el, start, end) {
    var strokeLineCap = getComputedStyle($el).strokeLinecap;
    var pathLength = 100000;
    var currentCap = strokeLineCap;
    var proxy = new Proxy($el, {
      get: function get(target, property) {
        var value = target[property];
        if (property === proxyTargetSymbol) return target;
        if (property === 'setAttribute') {
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            if (args[0] === 'draw') {
              var _value = args[1];
              var precision = globals.precision;
              var values = _value.split(' ');
              var v1 = round(+values[0], precision);
              var v2 = round(+values[1], precision);
              var os = round(v1 * -pathLength, 0);
              var d1 = round(v2 * pathLength + os, 0);
              var d2 = round(pathLength - d1, 0);
              if (strokeLineCap !== 'butt') {
                var newCap = v1 === v2 ? 'butt' : strokeLineCap;
                if (currentCap !== newCap) {
                  target.setAttribute('stroke-linecap', "".concat(newCap));
                  currentCap = newCap;
                }
              }
              target.setAttribute('stroke-dashoffset', "".concat(os));
              target.setAttribute('stroke-dasharray', "".concat(d1, " ").concat(d2));
            }
            return Reflect.apply(value, target, args);
          };
        }
        if (isFnc(value)) {
          return function () {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            return Reflect.apply(value, target, args);
          };
        } else {
          return value;
        }
      }
    });
    if ($el.getAttribute('pathLength') !== "".concat(pathLength)) {
      $el.setAttribute('pathLength', "".concat(pathLength));
      proxy.setAttribute('draw', "".concat(start, " ").concat(end));
    }
    return proxy;
  }
  var createDrawable = function createDrawable(selector) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var els = parseTargets(selector);
    els.forEach(function ($el, i) {
      return els[i] = createDrawableProxy($el, start, end);
    });
    return els;
  };
  var getPathPoint = function getPathPoint($path, progress) {
    var lookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return $path.getPointAtLength(progress + lookup >= 1 ? progress + lookup : 0);
  };
  var getPathProgess = function getPathProgess($path, pathProperty) {
    return function ($el) {
      var totalLength = +$path.getTotalLength();
      var inSvg = $el[isSvgSymbol];
      var ctm = $path.getCTM();
      return {
        from: 0,
        to: totalLength,
        modifier: function modifier(progress) {
          if (pathProperty === 'a') {
            var p0 = getPathPoint($path, progress, -1);
            var p1 = getPathPoint($path, progress, +1);
            return atan2(p1.y - p0.y, p1.x - p0.x) * 180 / PI;
          } else {
            var p = getPathPoint($path, progress, 0);
            return pathProperty === 'x' ? inSvg ? p.x : p.x * ctm.a + p.y * ctm.c + ctm.e : inSvg ? p.y : p.x * ctm.b + p.y * ctm.d + ctm.f;
          }
        }
      };
    };
  };
  var createMotionPath = function createMotionPath(path) {
    var $path = getPath(path);
    if (!$path) return;
    return {
      x: getPathProgess($path, 'x'),
      y: getPathProgess($path, 'y'),
      angle: getPathProgess($path, 'a')
    };
  };
  var cssReservedProperties = ['opacity', 'rotate', 'overflow', 'color'];
  var isValidSVGAttribute = function isValidSVGAttribute(el, propertyName) {
    if (cssReservedProperties.includes(propertyName)) return false;
    if (propertyName in el.style || propertyName in el) {
      if (propertyName === 'scale') {
        var elParentNode = el.parentNode;
        return elParentNode && elParentNode.tagName === 'filter';
      }
      return true;
    }
  };
  var svg = {
    morphTo: morphTo,
    createMotionPath: createMotionPath,
    createDrawable: createDrawable
  };

  var rgbToRgba = function rgbToRgba(rgbValue) {
    var rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
    var a = !isUnd(rgba[4]) ? +rgba[4] : 1;
    return [+rgba[1], +rgba[2], +rgba[3], a];
  };
  var hexToRgba = function hexToRgba(hexValue) {
    var hexLength = hexValue.length;
    var isShort = hexLength === 4 || hexLength === 5;
    return [+('0x' + hexValue[1] + hexValue[isShort ? 1 : 2]), +('0x' + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]), +('0x' + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]), hexLength === 5 || hexLength === 9 ? +(+('0x' + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1];
  };
  var hue2rgb = function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  var hslToRgba = function hslToRgba(hslValue) {
    var hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
    var h = +hsla[1] / 360;
    var s = +hsla[2] / 100;
    var l = +hsla[3] / 100;
    var a = !isUnd(hsla[4]) ? +hsla[4] : 1;
    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var q = l < .5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = round(hue2rgb(p, q, h + 1 / 3) * 255, 0);
      g = round(hue2rgb(p, q, h) * 255, 0);
      b = round(hue2rgb(p, q, h - 1 / 3) * 255, 0);
    }
    return [r, g, b, a];
  };
  var convertColorStringValuesToRgbaArray = function convertColorStringValuesToRgbaArray(colorString) {
    return isRgb(colorString) ? rgbToRgba(colorString) : isHex(colorString) ? hexToRgba(colorString) : isHsl(colorString) ? hslToRgba(colorString) : [0, 0, 0, 1];
  };

  var setValue = function setValue(targetValue, defaultValue) {
    return isUnd(targetValue) ? defaultValue : targetValue;
  };
  var getFunctionValue = function getFunctionValue(value, target, index, total, store) {
    if (isFnc(value)) {
      var func = function func() {
        var computed = value(target, index, total);
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
  var getTweenType = function getTweenType(target, prop) {
    var type = !target[isDomSymbol] ? tweenTypes.OBJECT : target[isSvgSymbol] && isValidSVGAttribute(target, prop) ? tweenTypes.ATTRIBUTE : validTransforms.includes(prop) || shortTransforms.get(prop) ? tweenTypes.TRANSFORM : stringStartsWith(prop, '--') ? tweenTypes.CSS_VAR : prop in target.style ? tweenTypes.CSS : !isNil(target.getAttribute(prop)) ? tweenTypes.ATTRIBUTE : !isUnd(target[prop]) ? tweenTypes.OBJECT : tweenTypes.INVALID;
    if (type === tweenTypes.INVALID) console.warn("Can't find property '".concat(prop, "' on target '").concat(target, "'."));
    return type;
  };
  var getCSSValue = function getCSSValue(target, propName, animationInlineStyles) {
    var inlineStyles = target.style[propName];
    if (inlineStyles && animationInlineStyles) {
      animationInlineStyles[propName] = inlineStyles;
    }
    var value = inlineStyles || getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(propName);
    return value === 'auto' ? '0' : value;
  };
  var getOriginalAnimatableValue = function getOriginalAnimatableValue(target, propName, tweenType, animationInlineStyles) {
    var type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
    return type === tweenTypes.OBJECT ? target[propName] || 0 : type === tweenTypes.ATTRIBUTE ? target.getAttribute(propName) : type === tweenTypes.TRANSFORM ? parseInlineTransforms(target, propName, animationInlineStyles) : type === tweenTypes.CSS_VAR ? getCSSValue(target, propName, animationInlineStyles).trimStart() : getCSSValue(target, propName, animationInlineStyles);
  };
  var getRelativeValue = function getRelativeValue(x, y, operator) {
    return operator === '-' ? x - y : operator === '+' ? x + y : x * y;
  };
  var createDecomposedValueTargetObject = function createDecomposedValueTargetObject() {
    return {
      t: valueTypes.NUMBER,
      n: 0,
      u: null,
      o: null,
      d: null,
      s: null
    };
  };
  var decomposeRawValue = function decomposeRawValue(rawValue, targetObject) {
    targetObject.t = valueTypes.NUMBER;
    targetObject.n = 0;
    targetObject.u = null;
    targetObject.o = null;
    targetObject.d = null;
    targetObject.s = null;
    if (!rawValue) return targetObject;
    var num = +rawValue;
    if (!isNaN(num)) {
      targetObject.n = num;
      return targetObject;
    } else {
      var str = rawValue;
      if (str[1] === '=') {
        targetObject.o = str[0];
        str = str.slice(2);
      }
      var unitMatch = str.includes(' ') ? false : unitsExecRgx.exec(str);
      if (unitMatch) {
        targetObject.t = valueTypes.UNIT;
        targetObject.n = +unitMatch[1];
        targetObject.u = unitMatch[2];
        return targetObject;
      } else if (targetObject.o) {
        targetObject.n = +str;
        return targetObject;
      } else if (isCol(str)) {
        targetObject.t = valueTypes.COLOR;
        targetObject.d = convertColorStringValuesToRgbaArray(str);
        return targetObject;
      } else {
        var matchedNumbers = str.match(digitWithExponentRgx);
        targetObject.t = valueTypes.COMPLEX;
        targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
        targetObject.s = str.split(digitWithExponentRgx) || [];
        return targetObject;
      }
    }
  };
  var decomposeTweenValue = function decomposeTweenValue(tween, targetObject) {
    targetObject.t = tween._valueType;
    targetObject.n = tween._toNumber;
    targetObject.u = tween._unit;
    targetObject.o = null;
    targetObject.d = cloneArray(tween._toNumbers);
    targetObject.s = cloneArray(tween._strings);
    return targetObject;
  };
  var decomposedOriginalValue = createDecomposedValueTargetObject();

  var propertyNamesCache = {};
  var sanitizePropertyName = function sanitizePropertyName(propertyName, target, tweenType) {
    if (tweenType === tweenTypes.TRANSFORM) {
      var t = shortTransforms.get(propertyName);
      return t ? t : propertyName;
    } else if (tweenType === tweenTypes.CSS || tweenType === tweenTypes.ATTRIBUTE && isSvg(target) && propertyName in target.style) {
      var cachedPropertyName = propertyNamesCache[propertyName];
      if (cachedPropertyName) {
        return cachedPropertyName;
      } else {
        var lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
        propertyNamesCache[propertyName] = lowerCaseName;
        return lowerCaseName;
      }
    } else {
      return propertyName;
    }
  };

  var angleUnitsMap = {
    'deg': 1,
    'rad': 180 / PI,
    'turn': 360
  };
  var convertedValuesCache = {};
  var convertValueUnit = function convertValueUnit(el, decomposedValue, unit) {
    var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var currentUnit = decomposedValue.u;
    var currentNumber = decomposedValue.n;
    if (decomposedValue.t === valueTypes.UNIT && currentUnit === unit) {
      return decomposedValue;
    }
    var cachedKey = currentNumber + currentUnit + unit;
    var cached = convertedValuesCache[cachedKey];
    if (!isUnd(cached) && !force) {
      decomposedValue.n = cached;
    } else {
      var convertedValue;
      if (currentUnit in angleUnitsMap) {
        convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
      } else {
        var baseline = 100;
        var tempEl = el.cloneNode();
        var parentNode = el.parentNode;
        var parentEl = parentNode && parentNode !== doc ? parentNode : doc.body;
        parentEl.appendChild(tempEl);
        var elStyle = tempEl.style;
        elStyle.width = baseline + currentUnit;
        var currentUnitWidth = tempEl.offsetWidth || baseline;
        elStyle.width = baseline + unit;
        var newUnitWidth = tempEl.offsetWidth || baseline;
        var factor = currentUnitWidth / newUnitWidth;
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

  var lookups = {
    _rep: new WeakMap(),
    _add: new Map()
  };
  var getTweenSiblings = function getTweenSiblings(target, property) {
    var lookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_rep';
    var lookupMap = lookups[lookup];
    var targetLookup = lookupMap.get(target);
    if (!targetLookup) {
      targetLookup = {};
      lookupMap.set(target, targetLookup);
    }
    return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
      _head: null,
      _tail: null
    };
  };
  var addTweenSortMethod = function addTweenSortMethod(p, c) {
    return p._isOverridden || p._absoluteStartTime > c._absoluteStartTime;
  };
  var overrideTween = function overrideTween(tween) {
    tween._isOverlapped = 1;
    tween._isOverridden = 1;
    tween._changeDuration = minValue;
    tween._currentTime = minValue;
  };
  var composeTween = function composeTween(tween, siblings) {
    var tweenCompositionType = tween._composition;
    if (tweenCompositionType === compositionTypes.replace) {
      var tweenAbsStartTime = tween._absoluteStartTime;
      addChild(siblings, tween, addTweenSortMethod, '_prevRep', '_nextRep');
      var prevSibling = tween._prevRep;
      if (prevSibling) {
        var prevParent = prevSibling.parent;
        var prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;
        if (tween.parent.id !== prevParent.id && prevParent._iterationCount > 1 && prevAbsEndTime + (prevParent.duration - prevParent._iterationDuration) > tweenAbsStartTime) {
          overrideTween(prevSibling);
          var prevPrevSibling = prevSibling._prevRep;
          while (prevPrevSibling && prevPrevSibling.parent.id === prevParent.id) {
            overrideTween(prevPrevSibling);
            prevPrevSibling = prevPrevSibling._prevRep;
          }
        }
        var absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;
        if (prevAbsEndTime > absoluteUpdateStartTime) {
          var prevChangeStartTime = prevSibling._startTime;
          var prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);
          prevSibling._changeDuration = absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime;
          prevSibling._currentTime = prevSibling._changeDuration;
          prevSibling._isOverlapped = 1;
          if (prevSibling._changeDuration < minValue) {
            overrideTween(prevSibling);
          }
        }
        var parentActiveAnimation = 0;
        forEachChildren(prevParent, function (t) {
          parentActiveAnimation -= t._isOverridden - 1;
        });
        if (parentActiveAnimation === 0) {
          prevParent.completed = true;
          prevParent.pause();
        }
      }
    } else if (tweenCompositionType === compositionTypes.blend) {
      var additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, '_add');
      var additiveAnimation = addAdditiveAnimation(lookups._add);
      var lookupTween = additiveTweenSiblings._head;
      if (!lookupTween) {
        lookupTween = _objectSpread2({}, tween);
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
      var toNumber = tween._toNumber;
      tween._fromNumber = lookupTween._fromNumber - toNumber;
      tween._toNumber = 0;
      tween._numbers = cloneArray(tween._fromNumbers);
      tween._number = 0;
      lookupTween._fromNumber = toNumber;
      if (tween._toNumbers) {
        var toNumbers = cloneArray(tween._toNumbers);
        if (toNumbers) {
          toNumbers.forEach(function (value, i) {
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
  var removeTweenSliblings = function removeTweenSliblings(tween) {
    var tweenComposition = tween._composition;
    if (tweenComposition !== compositionTypes.none) {
      var tweenTarget = tween.target;
      var tweenProperty = tween.property;
      var replaceTweensLookup = lookups._rep;
      var replaceTargetProps = replaceTweensLookup.get(tweenTarget);
      var tweenReplaceSiblings = replaceTargetProps[tweenProperty];
      removeChild(tweenReplaceSiblings, tween, '_prevRep', '_nextRep');
      if (tweenComposition === compositionTypes.blend) {
        var addTweensLookup = lookups._add;
        var addTargetProps = addTweensLookup.get(tweenTarget);
        if (!addTargetProps) return;
        var additiveTweenSiblings = addTargetProps[tweenProperty];
        var additiveAnimation = additive.animation;
        removeChild(additiveTweenSiblings, tween, '_prevAdd', '_nextAdd');
        var lookupTween = additiveTweenSiblings._head;
        if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
          removeChild(additiveTweenSiblings, lookupTween, '_prevAdd', '_nextAdd');
          removeChild(additiveAnimation, lookupTween);
          var shouldClean = true;
          for (var prop in addTargetProps) {
            if (addTargetProps[prop]._head) {
              shouldClean = false;
              break;
            }
          }
          if (shouldClean) {
            addTweensLookup["delete"](tweenTarget);
          }
        }
      }
    }
    return tween;
  };

  var resetTimerProperties = function resetTimerProperties(timer) {
    timer.paused = true;
    timer.began = false;
    timer.completed = false;
    return timer;
  };
  var reviveTimer = function reviveTimer(timer) {
    if (!timer._cancelled) return timer;
    if (timer._hasChildren) {
      forEachChildren(timer, reviveTimer);
    } else {
      forEachChildren(timer, function (tween) {
        if (tween._composition !== compositionTypes.none) {
          composeTween(tween, getTweenSiblings(tween.target, tween.property));
        }
      });
    }
    timer._cancelled = 0;
    return timer;
  };
  var timerId = 0;
  var Timer = function (_Clock) {
    _inherits(Timer, _Clock);
    function Timer() {
      var _this;
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var parentPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      _classCallCheck(this, Timer);
      _this = _callSuper(this, Timer);
      var id = parameters.id,
        delay = parameters.delay,
        duration = parameters.duration,
        reversed = parameters.reversed,
        alternate = parameters.alternate,
        loop = parameters.loop,
        loopDelay = parameters.loopDelay,
        autoplay = parameters.autoplay,
        frameRate = parameters.frameRate,
        playbackRate = parameters.playbackRate,
        onComplete = parameters.onComplete,
        onLoop = parameters.onLoop,
        onBegin = parameters.onBegin,
        onUpdate = parameters.onUpdate;
      if (globals.scope) globals.scope.revertibles.push(_assertThisInitialized(_this));
      var timerInitTime = parent ? 0 : engine._elapsedTime;
      var timerDefaults = parent ? parent.defaults : globals.defaults;
      var timerDelay = isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay;
      var timerDuration = isFnc(duration) || isUnd(duration) ? Infinity : +duration;
      var timerLoop = setValue(loop, timerDefaults.loop);
      var timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
      var timerIterationCount = timerLoop === true || timerLoop === Infinity || timerLoop < 0 ? Infinity : timerLoop + 1;
      _this.id = !isUnd(id) ? id : duration === minValue ? 0 : ++timerId;
      _this.parent = parent;
      _this.duration = clampInfinity((timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay) || minValue;
      _this.paused = true;
      _this.began = false;
      _this.completed = false;
      _this.reversed = +setValue(reversed, timerDefaults.reversed);
      _this.onBegin = onBegin || timerDefaults.onBegin;
      _this.onUpdate = onUpdate || timerDefaults.onUpdate;
      _this.onLoop = onLoop || timerDefaults.onLoop;
      _this.onComplete = onComplete || timerDefaults.onComplete;
      _this._autoplay = parent ? false : setValue(autoplay, timerDefaults.autoplay);
      _this._offset = parent ? parentPosition : engine._elapsedTime - engine._startTime;
      _this._delay = timerDelay;
      _this._loopDelay = timerLoopDelay;
      _this._iterationTime = 0;
      _this._iterationDuration = timerDuration;
      _this._iterationCount = timerIterationCount;
      _this._currentIteration = 0;
      _this._resolve = noop;
      _this._hasChildren = false;
      _this._running = false;
      _this._cancelled = 0;
      _this._reversed = _this.reversed;
      _this._alternate = setValue(alternate, timerDefaults.alternate);
      _this._backwards = false;
      _this._prev = null;
      _this._next = null;
      _this._elapsedTime = timerInitTime;
      _this._startTime = timerInitTime;
      _this._lastTime = timerInitTime;
      _this._fps = setValue(frameRate, timerDefaults.frameRate);
      _this._speed = setValue(playbackRate, timerDefaults.playbackRate);
      return _this;
    }
    _createClass(Timer, [{
      key: "progress",
      get: function get() {
        return round(this.currentTime / this.duration, 6);
      },
      set: function set(progress) {
        var paused = this.paused;
        this.pause().seek(this.duration * +progress);
        if (!paused) this.play();
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return _get(_getPrototypeOf(Timer.prototype), "playbackRate", this);
      },
      set: function set(playbackRate) {
        _set(_getPrototypeOf(Timer.prototype), "playbackRate", playbackRate, this, true);
        this.resetTime();
      }
    }, {
      key: "reset",
      value: function reset() {
        var internalRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        reviveTimer(this);
        if (!this._reversed !== !this.reversed) {
          this.reverse();
        }
        this._iterationTime = this._iterationDuration;
        tick(this, 0, 1, internalRender, tickModes.FORCE);
        resetTimerProperties(this);
        if (this._hasChildren) {
          forEachChildren(this, resetTimerProperties);
        }
        return this;
      }
    }, {
      key: "init",
      value: function init() {
        var internalRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.frameRate = this._fps;
        this.playbackRate = this._speed;
        if (!internalRender && this._hasChildren) {
          tick(this, this.duration, 1, internalRender, tickModes.FORCE);
        }
        var autoplay = this._autoplay;
        this.reset(internalRender);
        if (autoplay === true) {
          this.play();
        } else if (!internalRender && autoplay && !isUnd(autoplay.linked)) {
          autoplay.link(this);
        }
        return this;
      }
    }, {
      key: "resetTime",
      value: function resetTime() {
        var timeScale = 1 / (this._speed * engine._speed);
        this._startTime = now() - (this.currentTime + this._delay) * timeScale - 12;
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        if (this.paused) return this;
        this.paused = true;
        return this;
      }
    }, {
      key: "play",
      value: function play() {
        if (!this.paused) return this;
        this.paused = false;
        if (this.duration <= minValue) {
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
    }, {
      key: "restart",
      value: function restart() {
        return this.reset(0).play();
      }
    }, {
      key: "seek",
      value: function seek(time) {
        var muteCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var internalRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        reviveTimer(this);
        this.completed = false;
        var isPaused = this.paused;
        this.paused = true;
        tick(this, time + this._delay, ~~muteCallbacks, ~~internalRender, tickModes.AUTO);
        return isPaused ? this : this.play();
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var reversed = this.reversed;
        this.reversed = +(this._alternate && !(this._iterationCount % 2) ? reversed : !reversed);
        this.seek(this.duration - this.currentTime);
        this.resetTime();
        return this;
      }
    }, {
      key: "playForward",
      value: function playForward() {
        return this.reversed ? this.reverse().play() : this.play();
      }
    }, {
      key: "playBackward",
      value: function playBackward() {
        return !this.reversed ? this.reverse().play() : this.play();
      }
    }, {
      key: "cancel",
      value: function cancel() {
        if (this._hasChildren) {
          forEachChildren(this, function (child) {
            return child.cancel();
          }, true);
        } else {
          forEachChildren(this, removeTweenSliblings);
        }
        this._cancelled = 1;
        return this.pause();
      }
    }, {
      key: "stretch",
      value: function stretch(newDuration) {
        var currentDuration = this.duration;
        if (currentDuration === clampZero(newDuration)) return this;
        var timeScale = newDuration / currentDuration;
        this.duration = clampZero(clampInfinity(round(currentDuration * timeScale, 12)));
        this._iterationDuration = clampZero(clampInfinity(round(this._iterationDuration * timeScale, 12)));
        this._offset *= timeScale;
        this._delay *= timeScale;
        this._loopDelay *= timeScale;
        return this;
      }
    }, {
      key: "revert",
      value: function revert() {
        tick(this, 0, 1, 0, tickModes.FORCE);
        return this.cancel();
      }
    }, {
      key: "then",
      value: function then() {
        var _this2 = this;
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
        var then = this.then;
        var onResolve = function onResolve() {
          _this2.then = null;
          callback(_this2);
          _this2.then = then;
          _this2._resolve = noop;
        };
        return new Promise(function (r) {
          _this2._resolve = function () {
            return r(onResolve());
          };
          if (_this2.completed) _this2._resolve();
          return _this2;
        });
      }
    }]);
    return Timer;
  }(Clock);

  var cleanInlineStyles = function cleanInlineStyles(renderable) {
    if (renderable._hasChildren) {
      forEachChildren(renderable, cleanInlineStyles, true);
    } else {
      var animation = renderable;
      animation.pause();
      forEachChildren(animation, function (tween) {
        var tweenProperty = tween.property;
        var tweenTarget = tween.target;
        if (tweenTarget[isDomSymbol]) {
          var targetStyle = tweenTarget.style;
          var originalInlinedValue = animation._inlineStyles[tweenProperty];
          if (tween._tweenType === tweenTypes.TRANSFORM) {
            var cachedTransforms = tweenTarget[transformsSymbol];
            if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
              delete cachedTransforms[tweenProperty];
            } else {
              cachedTransforms[tweenProperty] = originalInlinedValue;
            }
            if (tween._renderTransforms) {
              if (!Object.keys(cachedTransforms).length) {
                targetStyle.removeProperty('transform');
              } else {
                var str = emptyString;
                for (var _key in cachedTransforms) {
                  str += transformsFragmentStrings[_key] + cachedTransforms[_key] + ') ';
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
            animation.targets.forEach(function (t) {
              if (t.getAttribute && t.getAttribute('style') === emptyString) {
                t.removeAttribute('style');
              }
            });
          }
        }
      });
    }
    return renderable;
  };
  var fromTargetObject = createDecomposedValueTargetObject();
  var toTargetObject = createDecomposedValueTargetObject();
  var toFunctionStore = {
    func: null
  };
  var keyframesTargetArray = [null];
  var fastSetValuesArray = [null, null];
  var keyObjectTarget = {
    to: null
  };
  var tweenId = 0;
  var keyframes;
  var key;
  var generateKeyframes = function generateKeyframes(keyframes, parameters) {
    var properties = {};
    if (isArr(keyframes)) {
      var _ref;
      var propertyNames = (_ref = []).concat.apply(_ref, _toConsumableArray(keyframes.map(function (key) {
        return Object.keys(key);
      }))).filter(isKey);
      var _loop = function _loop() {
        var propName = propertyNames[i];
        var propArray = keyframes.map(function (key) {
          var newKey = {};
          for (var p in key) {
            var keyValue = key[p];
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
        properties[propName] = propArray;
      };
      for (var i = 0, l = propertyNames.length; i < l; i++) {
        _loop();
      }
    } else {
      var totalDuration = setValue(parameters.duration, globals.defaults.duration);
      var keys = Object.keys(keyframes).map(function (key) {
        return {
          o: parseFloat(key) / 100,
          p: keyframes[key]
        };
      }).sort(function (a, b) {
        return a.o - b.o;
      });
      keys.forEach(function (key) {
        var offset = key.o;
        var prop = key.p;
        for (var name in prop) {
          if (isKey(name)) {
            var propArray = properties[name];
            if (!propArray) propArray = properties[name] = [];
            var duration = offset * totalDuration;
            var length = propArray.length;
            var prevKey = propArray[length - 1];
            var keyObj = {
              to: prop[name]
            };
            var durProgress = 0;
            for (var _i = 0; _i < length; _i++) {
              durProgress += propArray[_i].duration;
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
      for (var name in properties) {
        var propArray = properties[name];
        var prevEase = void 0;
        for (var _i2 = 0, _l = propArray.length; _i2 < _l; _i2++) {
          var prop = propArray[_i2];
          var currentEase = prop.ease;
          if (prevEase) prop.ease = prevEase;
          prevEase = currentEase;
        }
        if (!propArray[0].duration) {
          propArray.shift();
        }
      }
    }
    return properties;
  };
  var Animation = function (_Timer) {
    _inherits(Animation, _Timer);
    function Animation(targets, parameters, parent, parentPosition) {
      var _this;
      var fastSet = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var index = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var length = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      _classCallCheck(this, Animation);
      _this = _callSuper(this, Animation, [(parameters), parent, parentPosition]);
      _this._head = null;
      _this._tail = null;
      var parsedTargets = registerTargets(targets);
      var targetsLength = parsedTargets.length;
      var kfParams = parameters.keyframes;
      var params = kfParams ? mergeObjects(generateKeyframes(kfParams, parameters), parameters) : parameters;
      var delay = params.delay,
        duration = params.duration,
        ease = params.ease,
        playbackEase = params.playbackEase,
        modifier = params.modifier,
        composition = params.composition,
        onRender = params.onRender;
      var animDefaults = parent ? parent.defaults : globals.defaults;
      var animaPlaybackEase = setValue(playbackEase, animDefaults.playbackEase);
      var animEase = animaPlaybackEase ? parseEasings(animaPlaybackEase) : null;
      var hasSpring = !isUnd(ease) && !isUnd(ease.ease);
      var tEasing = hasSpring ? ease.ease : setValue(ease, animEase ? 'linear' : animDefaults.ease);
      var tDuration = hasSpring ? ease.duration : setValue(duration, animDefaults.duration);
      var tDelay = setValue(delay, animDefaults.delay);
      var tModifier = modifier || animDefaults.modifier;
      var tComposition = isUnd(composition) && targetsLength >= K ? compositionTypes.none : !isUnd(composition) ? composition : animDefaults.composition;
      var animInlineStyles = {};
      var absoluteOffsetTime = _this._offset + (parent ? parent._offset : 0);
      var iterationDuration = NaN;
      var iterationDelay = NaN;
      var animationAnimationLength = 0;
      var _loop2 = function _loop2() {
        var target = parsedTargets[targetIndex];
        var ti = index || targetIndex;
        var tl = length || targetsLength;
        var lastTransformGroupIndex = NaN;
        var lastTransformGroupLength = NaN;
        for (var p in params) {
          if (isKey(p)) {
            var tweenType = getTweenType(target, p);
            if (tweenType !== tweenTypes.INVALID) {
              var propName = sanitizePropertyName(p, target, tweenType);
              var propValue = params[p];
              if (fastSet) {
                fastSetValuesArray[0] = propValue;
                fastSetValuesArray[1] = propValue;
                propValue = fastSetValuesArray;
              }
              if (isArr(propValue)) {
                var arrayLength = propValue.length;
                var isNotObjectValue = !isObj(propValue[0]);
                if (arrayLength === 2 && isNotObjectValue) {
                  keyObjectTarget.to = propValue;
                  keyframesTargetArray[0] = keyObjectTarget;
                  keyframes = keyframesTargetArray;
                } else if (arrayLength > 2 && isNotObjectValue) {
                  keyframes = [];
                  propValue.forEach(function (v, i) {
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
                  keyframes = propValue;
                }
              } else {
                keyframesTargetArray[0] = propValue;
                keyframes = keyframesTargetArray;
              }
              var siblings = null;
              var prevTween = null;
              var firstTweenChangeStartTime = NaN;
              var lastTweenChangeEndTime = 0;
              var tweenIndex = 0;
              var _loop3 = function _loop3() {
                var keyframe = keyframes[tweenIndex];
                if (isObj(keyframe)) {
                  key = keyframe;
                } else {
                  keyObjectTarget.to = keyframe;
                  key = keyObjectTarget;
                }
                toFunctionStore.func = null;
                var computedToValue = getFunctionValue(key.to, target, ti, tl, toFunctionStore);
                var tweenToValue;
                if (isObj(computedToValue) && !isUnd(computedToValue.to)) {
                  key = computedToValue;
                  tweenToValue = computedToValue.to;
                } else {
                  tweenToValue = computedToValue;
                }
                var tweenFromValue = getFunctionValue(key.from, target, ti, tl);
                var keyEasing = key.ease;
                var hasSpring = !isUnd(keyEasing) && !isUnd(keyEasing.ease);
                var tweenEasing = hasSpring ? keyEasing.ease : keyEasing || tEasing;
                var tweenDuration = hasSpring ? keyEasing.duration : getFunctionValue(setValue(key.duration, l > 1 ? getFunctionValue(tDuration, target, ti, tl) / l : tDuration), target, ti, tl);
                var tweenDelay = getFunctionValue(setValue(key.delay, !tweenIndex ? tDelay : 0), target, ti, tl);
                var computedComposition = getFunctionValue(setValue(key.composition, tComposition), target, ti, tl);
                var tweenComposition = isNum(computedComposition) ? computedComposition : compositionTypes[computedComposition];
                var tweenModifier = key.modifier || tModifier;
                var isFromToArray = isArr(tweenToValue);
                var isFromToValue = isFromToArray || !isUnd(tweenFromValue) && !isUnd(tweenToValue);
                var tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
                var absoluteStartTime = absoluteOffsetTime + tweenStartTime;
                var prevSibling = prevTween;
                if (tweenComposition !== compositionTypes.none) {
                  if (!siblings) siblings = getTweenSiblings(target, propName);
                  var nextSibling = siblings._head;
                  while (nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime) {
                    prevSibling = nextSibling;
                    nextSibling = nextSibling._nextRep;
                    if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                      while (nextSibling) {
                        overrideTween(nextSibling);
                        nextSibling = nextSibling._nextRep;
                      }
                    }
                  }
                }
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
                      decomposeRawValue(getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), decomposedOriginalValue);
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
                      decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), toTargetObject);
                    }
                  }
                  if (!isUnd(tweenFromValue)) {
                    decomposeRawValue(tweenFromValue, fromTargetObject);
                  } else {
                    if (prevTween) {
                      decomposeTweenValue(prevTween, fromTargetObject);
                    } else {
                      decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), fromTargetObject);
                    }
                  }
                }
                if (fromTargetObject.o) {
                  fromTargetObject.n = getRelativeValue(!prevSibling ? decomposeRawValue(getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), decomposedOriginalValue).n : prevSibling._toNumber, fromTargetObject.n, fromTargetObject.o);
                }
                if (toTargetObject.o) {
                  toTargetObject.n = getRelativeValue(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
                }
                if (fromTargetObject.t !== toTargetObject.t) {
                  if (fromTargetObject.t === valueTypes.COMPLEX || toTargetObject.t === valueTypes.COMPLEX) {
                    var complexValue = fromTargetObject.t === valueTypes.COMPLEX ? fromTargetObject : toTargetObject;
                    var notComplexValue = fromTargetObject.t === valueTypes.COMPLEX ? toTargetObject : fromTargetObject;
                    notComplexValue.t = valueTypes.COMPLEX;
                    notComplexValue.s = cloneArray(complexValue.s);
                    notComplexValue.d = complexValue.d.map(function () {
                      return notComplexValue.n;
                    });
                  } else if (fromTargetObject.t === valueTypes.UNIT || toTargetObject.t === valueTypes.UNIT) {
                    var unitValue = fromTargetObject.t === valueTypes.UNIT ? fromTargetObject : toTargetObject;
                    var notUnitValue = fromTargetObject.t === valueTypes.UNIT ? toTargetObject : fromTargetObject;
                    notUnitValue.t = valueTypes.UNIT;
                    notUnitValue.u = unitValue.u;
                  } else if (fromTargetObject.t === valueTypes.COLOR || toTargetObject.t === valueTypes.COLOR) {
                    var colorValue = fromTargetObject.t === valueTypes.COLOR ? fromTargetObject : toTargetObject;
                    var notColorValue = fromTargetObject.t === valueTypes.COLOR ? toTargetObject : fromTargetObject;
                    notColorValue.t = valueTypes.COLOR;
                    notColorValue.s = colorValue.s;
                    notColorValue.d = [0, 0, 0, 1];
                  }
                }
                if (fromTargetObject.u !== toTargetObject.u) {
                  var valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
                  valueToConvert = convertValueUnit(target, valueToConvert, toTargetObject.u ? toTargetObject.u : fromTargetObject.u, false);
                }
                if (toTargetObject.d && fromTargetObject.d && toTargetObject.d.length !== fromTargetObject.d.length) {
                  var longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
                  var shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
                  shortestValue.d = longestValue.d.map(function (_, i) {
                    return isUnd(shortestValue.d[i]) ? 0 : shortestValue.d[i];
                  });
                  shortestValue.s = cloneArray(longestValue.s);
                }
                var tweenUpdateDuration = +tweenDuration || minValue;
                var tween = {
                  parent: _assertThisInitialized(_this),
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
                  _numbers: cloneArray(fromTargetObject.d),
                  _number: fromTargetObject.n,
                  _unit: toTargetObject.u,
                  _modifier: tweenModifier,
                  _currentTime: 0,
                  _startTime: tweenStartTime,
                  _delay: +tweenDelay,
                  _updateDuration: tweenUpdateDuration,
                  _changeDuration: tweenUpdateDuration,
                  _absoluteStartTime: absoluteStartTime,
                  _tweenType: tweenType,
                  _valueType: toTargetObject.t,
                  _composition: tweenComposition,
                  _isOverlapped: 0,
                  _isOverridden: 0,
                  _renderTransforms: 0,
                  _prevRep: null,
                  _nextRep: null,
                  _prevAdd: null,
                  _nextAdd: null,
                  _prev: null,
                  _next: null
                };
                if (tweenComposition !== compositionTypes.none) {
                  composeTween(tween, siblings);
                }
                if (isNaN(firstTweenChangeStartTime)) {
                  firstTweenChangeStartTime = tween._startTime;
                }
                lastTweenChangeEndTime = round(tweenStartTime + tweenUpdateDuration, 12);
                prevTween = tween;
                animationAnimationLength++;
                addChild(_assertThisInitialized(_this), tween);
              };
              for (var l = keyframes.length; tweenIndex < l; tweenIndex++) {
                _loop3();
              }
              if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
                iterationDelay = firstTweenChangeStartTime;
              }
              if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
                iterationDuration = lastTweenChangeEndTime;
              }
              if (tweenType === tweenTypes.TRANSFORM) {
                lastTransformGroupIndex = animationAnimationLength - tweenIndex;
                lastTransformGroupLength = animationAnimationLength;
              }
            }
          }
        }
        if (!isNaN(lastTransformGroupIndex)) {
          var i = 0;
          forEachChildren(_assertThisInitialized(_this), function (tween) {
            if (i >= lastTransformGroupIndex && i < lastTransformGroupLength) {
              tween._renderTransforms = 1;
              if (tween._composition === compositionTypes.blend) {
                forEachChildren(additive.animation, function (additiveTween) {
                  if (additiveTween.id === tween.id) {
                    additiveTween._renderTransforms = 1;
                  }
                });
              }
            }
            i++;
          });
        }
      };
      for (var targetIndex = 0; targetIndex < targetsLength; targetIndex++) {
        _loop2();
      }
      if (!targetsLength) {
        console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
      }
      if (iterationDelay) {
        forEachChildren(_assertThisInitialized(_this), function (tween) {
          if (!(tween._startTime - tween._delay)) {
            tween._delay -= iterationDelay;
          }
          tween._startTime -= iterationDelay;
        });
        iterationDuration -= iterationDelay;
      } else {
        iterationDelay = 0;
      }
      if (!iterationDuration) {
        iterationDuration = minValue;
        _this._iterationCount = 0;
      }
      _this.targets = parsedTargets;
      _this.duration = iterationDuration === minValue ? minValue : clampInfinity((iterationDuration + _this._loopDelay) * _this._iterationCount - _this._loopDelay) || minValue;
      _this.onRender = onRender || animDefaults.onRender;
      _this._ease = animEase;
      _this._delay = iterationDelay;
      _this._iterationDuration = iterationDuration;
      _this._inlineStyles = animInlineStyles;
      return _this;
    }
    _createClass(Animation, [{
      key: "stretch",
      value: function stretch(newDuration) {
        var currentDuration = this.duration;
        if (currentDuration === clampZero(newDuration)) return this;
        var timeScale = newDuration / currentDuration;
        forEachChildren(this, function (tween) {
          tween._updateDuration = clampZero(round(tween._updateDuration * timeScale, 12));
          tween._changeDuration = clampZero(round(tween._changeDuration * timeScale, 12));
          tween._currentTime *= timeScale;
          tween._startTime *= timeScale;
          tween._absoluteStartTime *= timeScale;
        });
        return _get(_getPrototypeOf(Animation.prototype), "stretch", this).call(this, newDuration);
      }
    }, {
      key: "refresh",
      value: function refresh() {
        forEachChildren(this, function (tween) {
          var ogValue = getOriginalAnimatableValue(tween.target, tween.property, tween._tweenType);
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
    }, {
      key: "revert",
      value: function revert() {
        _get(_getPrototypeOf(Animation.prototype), "revert", this).call(this);
        return cleanInlineStyles(this);
      }
    }, {
      key: "then",
      value: function then(callback) {
        return _get(_getPrototypeOf(Animation.prototype), "then", this).call(this, callback);
      }
    }]);
    return Animation;
  }(Timer);

  function getTargetValue(targetSelector, propName, unit) {
    var targets = registerTargets(targetSelector);
    if (!targets.length) return;
    var _targets = _slicedToArray(targets, 1),
      target = _targets[0];
    var tweenType = getTweenType(target, propName);
    var normalizePropName = sanitizePropertyName(propName, target, tweenType);
    var originalValue = getOriginalAnimatableValue(target, normalizePropName);
    if (isUnd(unit)) {
      return originalValue;
    } else {
      decomposeRawValue(originalValue, decomposedOriginalValue);
      if (decomposedOriginalValue.t === valueTypes.NUMBER || decomposedOriginalValue.t === valueTypes.UNIT) {
        if (unit === false) {
          return decomposedOriginalValue.n;
        } else {
          var convertedValue = convertValueUnit(target, decomposedOriginalValue, unit, false);
          return "".concat(round(convertedValue.n, globals.precision)).concat(convertedValue.u);
        }
      }
    }
  }
  var setTargetValues = function setTargetValues(targets, parameters) {
    if (isUnd(parameters)) return;
    parameters.duration = minValue;
    parameters.composition = setValue(parameters.composition, compositionTypes.none);
    return new Animation(targets, parameters, null, 0, true).play();
  };
  var removeTargetsFromAnimation = function removeTargetsFromAnimation(targetsArray, animation, propertyName) {
    var tweensMatchesTargets = false;
    forEachChildren(animation, function (tween) {
      var tweenTarget = tween.target;
      if (targetsArray.includes(tweenTarget)) {
        var tweenName = tween.property;
        var tweenType = tween._tweenType;
        var normalizePropName = sanitizePropertyName(propertyName, tweenTarget, tweenType);
        if (!normalizePropName || normalizePropName && normalizePropName === tweenName) {
          removeChild(animation, tween);
          removeTweenSliblings(tween);
          tweensMatchesTargets = true;
        }
      }
    }, true);
    return tweensMatchesTargets;
  };
  var remove = function remove(targets, renderable, propertyName) {
    var targetsArray = parseTargets(targets);
    var parent = renderable ? renderable : engine;
    var removeMatches;
    if (parent._hasChildren) {
      forEachChildren(parent, function (child) {
        if (!child._hasChildren) {
          removeMatches = removeTargetsFromAnimation(targetsArray, child, propertyName);
          if (removeMatches && !child._head) {
            child.cancel();
            removeChild(parent, child);
          }
        }
        if (child._head) {
          remove(targets, child);
        } else {
          child._hasChildren = false;
        }
      }, true);
    } else {
      removeMatches = removeTargetsFromAnimation(targetsArray, parent, propertyName);
    }
    if (removeMatches && !parent._head) {
      parent._hasChildren = false;
      if (parent.cancel) parent.cancel();
    }
    return targetsArray;
  };
  var random = function random(min, max, decimalLength) {
    var m = Math.pow(10, decimalLength || 0);
    return floor((Math.random() * (max - min + 1 / m) + min) * m) / m;
  };
  var randomPick = function randomPick(items) {
    return items[random(0, items.length - 1)];
  };
  var shuffle = function shuffle(items) {
    var m = items.length,
      t,
      i;
    while (m) {
      i = random(0, --m);
      t = items[m];
      items[m] = items[i];
      items[i] = t;
    }
    return items;
  };
  var roundPad = function roundPad(v, decimalLength) {
    return (+v).toFixed(decimalLength);
  };
  var padStart = function padStart(v, totalLength, padString) {
    return "".concat(v).padStart(totalLength, padString);
  };
  var padEnd = function padEnd(v, totalLength, padString) {
    return "".concat(v).padEnd(totalLength, padString);
  };
  var wrap = function wrap(v, min, max) {
    return ((v - min) % (max - min) + (max - min)) % (max - min) + min;
  };
  var mapRange = function mapRange(value, inLow, inHigh, outLow, outHigh) {
    return outLow + (value - inLow) / (inHigh - inLow) * (outHigh - outLow);
  };
  var degToRad = function degToRad(degrees) {
    return degrees * PI / 180;
  };
  var radToDeg = function radToDeg(radians) {
    return radians * 180 / PI;
  };
  var lerp = function lerp(start, end, amount, renderable) {
    var dt = K / globals.defaults.frameRate;
    if (renderable !== false) {
      var ticker = renderable || engine._hasChildren && engine;
      if (ticker && ticker.deltaTime) {
        dt = ticker.deltaTime;
      }
    }
    var t = 1 - Math.exp(-amount * dt * .1);
    return !amount ? start : amount === 1 ? end : (1 - t) * start + t * end;
  };
  var curry = function curry(fn) {
    var last = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return last ? function (v) {
        return fn.apply(void 0, args.concat([v]));
      } : function (v) {
        return fn.apply(void 0, [v].concat(args));
      };
    };
  };
  var chain = function chain(fn) {
    return function () {
      var result = fn.apply(void 0, arguments);
      return new Proxy(noop, {
        apply: function apply(_, __, _ref) {
          var _ref2 = _slicedToArray(_ref, 1),
            v = _ref2[0];
          return result(v);
        },
        get: function get(_, prop) {
          return chain(function () {
            var nextResult = utils[prop].apply(utils, arguments);
            return function (v) {
              return nextResult(result(v));
            };
          });
        }
      });
    };
  };
  var makeChainable = function makeChainable(fn) {
    var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return function () {
      return (arguments.length < fn.length ? chain(curry(fn, right)) : fn).apply(void 0, arguments);
    };
  };
  var utils = {
    $: registerTargets,
    get: getTargetValue,
    set: setTargetValues,
    remove: remove,
    cleanInlineStyles: cleanInlineStyles,
    random: random,
    randomPick: randomPick,
    shuffle: shuffle,
    lerp: lerp,
    clamp: (makeChainable(clamp)),
    round: (makeChainable(round)),
    snap: (makeChainable(snap)),
    wrap: (makeChainable(wrap)),
    interpolate: (makeChainable(interpolate, 1)),
    mapRange: (makeChainable(mapRange)),
    roundPad: (makeChainable(roundPad)),
    padStart: (makeChainable(padStart)),
    padEnd: (makeChainable(padEnd)),
    degToRad: (makeChainable(degToRad)),
    radToDeg: (makeChainable(radToDeg))
  };

  var getPrevChildOffset = function getPrevChildOffset(timeline, timePosition) {
    if (stringStartsWith(timePosition, '<')) {
      var goToPrevAnimationOffset = timePosition[1] === '<';
      var prevAnimation = timeline._tail;
      var prevOffset = prevAnimation ? prevAnimation._offset + prevAnimation._delay : 0;
      return goToPrevAnimationOffset ? prevOffset : prevOffset + prevAnimation.duration;
    }
  };
  var parseTimelinePosition = function parseTimelinePosition(timeline, timePosition) {
    var tlDuration = timeline._iterationDuration;
    if (tlDuration === minValue) tlDuration = 0;
    if (isUnd(timePosition)) return tlDuration;
    if (isNum(+timePosition)) return +timePosition;
    var timePosStr = timePosition;
    var tlLabels = timeline ? timeline.labels : null;
    var hasLabels = !isNil(tlLabels);
    var prevOffset = getPrevChildOffset(timeline, timePosStr);
    var hasSibling = !isUnd(prevOffset);
    var matchedRelativeOperator = relativeValuesExecRgx.exec(timePosStr);
    if (matchedRelativeOperator) {
      var fullOperator = matchedRelativeOperator[0];
      var split = timePosStr.split(fullOperator);
      var labelOffset = hasLabels && split[0] ? tlLabels[split[0]] : tlDuration;
      var parsedOffset = hasSibling ? prevOffset : hasLabels ? labelOffset : tlDuration;
      var parsedNumericalOffset = +split[1];
      return getRelativeValue(parsedOffset, parsedNumericalOffset, fullOperator[0]);
    } else {
      return hasSibling ? prevOffset : hasLabels ? !isUnd(tlLabels[timePosStr]) ? tlLabels[timePosStr] : tlDuration : tlDuration;
    }
  };
  function addTlChild(childParams, tl, parsedTLPosition, targets, index, length) {
    var TLPosition = isNum(childParams.duration) && childParams.duration <= minValue ? parsedTLPosition - minValue : parsedTLPosition;
    tick(tl, TLPosition, 1, 1, tickModes.AUTO);
    var tlChild = targets ? new Animation(targets, childParams, tl, TLPosition, false, index, length) : new Timer(childParams, tl, TLPosition);
    tlChild.init(1);
    addChild(tl, tlChild);
    forEachChildren(tl, function (child) {
      var childTLOffset = child._offset + child._delay;
      var childDur = childTLOffset + child.duration;
      if (childDur > tl._iterationDuration) {
        tl._iterationDuration = childDur;
      }
    });
    tl.duration = clampInfinity((tl._iterationDuration + tl._loopDelay) * tl._iterationCount - tl._loopDelay) || minValue;
    return tl;
  }
  var Timeline = function (_Timer) {
    _inherits(Timeline, _Timer);
    function Timeline() {
      var _this;
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Timeline);
      _this = _callSuper(this, Timeline, [(parameters), null, 0]);
      _this.duration = 0;
      _this.labels = {};
      var defaultsParams = parameters.defaults;
      var globalDefaults = globals.defaults;
      _this.defaults = defaultsParams ? mergeObjects(defaultsParams, globalDefaults) : globalDefaults;
      _this.onRender = parameters.onRender || globalDefaults.onRender;
      var tlPlaybackEase = setValue(parameters.playbackEase, globalDefaults.playbackEase);
      _this._ease = tlPlaybackEase ? parseEasings(tlPlaybackEase) : null;
      _this._iterationDuration = 0;
      _this._head = null;
      _this._tail = null;
      return _this;
    }
    _createClass(Timeline, [{
      key: "add",
      value: function add(a1, a2, a3) {
        var _this2 = this;
        var isAnim = isObj(a2);
        var isTimer = isObj(a1);
        var isFunc = isFnc(a1);
        if (isAnim || isTimer || isFunc) {
          this._hasChildren = true;
          if (isAnim) {
            var childParams = a2;
            if (isFnc(a3)) {
              var staggeredPosition = a3;
              var parsedTargetsArray = parseTargets(a1);
              var tlDuration = this.duration;
              var tlIterationDuration = this._iterationDuration;
              var id = childParams.id;
              var i = 0;
              var parsedLength = parsedTargetsArray.length;
              parsedTargetsArray.forEach(function (target) {
                var staggeredChildParams = _objectSpread2({}, childParams);
                _this2.duration = tlDuration;
                _this2._iterationDuration = tlIterationDuration;
                if (!isUnd(id)) staggeredChildParams.id = id + '-' + i;
                addTlChild(staggeredChildParams, _this2, staggeredPosition(target, i, parsedLength, _this2), target, i, parsedLength);
                i++;
              });
            } else {
              addTlChild(childParams, this, parseTimelinePosition(this, a3), a1);
            }
          } else {
            addTlChild(isTimer ? a1 : {
              onComplete: a1,
              duration: minValue
            }, this, parseTimelinePosition(this, a2));
          }
          this.init(1);
          return this._autoplay === true ? this.play() : this;
        } else if (isStr(a1)) {
          this.labels[a1] = parseTimelinePosition(this, a2);
          return this;
        }
      }
    }, {
      key: "set",
      value: function set(targets, parameters, position) {
        if (isUnd(parameters)) return this;
        parameters.duration = minValue;
        parameters.composition = compositionTypes.replace;
        return this.add(targets, parameters, position);
      }
    }, {
      key: "stretch",
      value: function stretch(newDuration) {
        var currentDuration = this.duration;
        if (currentDuration === clampZero(newDuration)) return this;
        var timeScale = newDuration / currentDuration;
        var labels = this.labels;
        forEachChildren(this, function (child) {
          child.stretch(child.duration * timeScale);
        });
        for (var labelName in labels) {
          labels[labelName] *= timeScale;
        }
        return _get(_getPrototypeOf(Timeline.prototype), "stretch", this).call(this, newDuration);
      }
    }, {
      key: "refresh",
      value: function refresh() {
        forEachChildren(this, function (child) {
          if (child.refresh) child.refresh();
        });
        return this;
      }
    }, {
      key: "revert",
      value: function revert() {
        _get(_getPrototypeOf(Timeline.prototype), "revert", this).call(this);
        forEachChildren(this, function (child) {
          return child.revert;
        }, true);
        return cleanInlineStyles(this);
      }
    }, {
      key: "then",
      value: function then(callback) {
        return _get(_getPrototypeOf(Timeline.prototype), "then", this).call(this, callback);
      }
    }]);
    return Timeline;
  }(Timer);

  var stagger = function stagger(val) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var values = [];
    var maxValue = 0;
    var from = params.from;
    var reversed = params.reversed;
    var ease = params.ease;
    var hasEasing = !isUnd(ease);
    var hasSpring = hasEasing && !isUnd(ease.ease);
    var staggerEase = hasSpring ? ease.ease : hasEasing ? parseEasings(ease) : null;
    var grid = params.grid;
    var axis = params.axis;
    var fromFirst = isUnd(from) || from === 0 || from === 'first';
    var fromCenter = from === 'center';
    var fromLast = from === 'last';
    var isRange = isArr(val);
    var val1 = isRange ? parseNumber(val[0]) : parseNumber(val);
    var val2 = isRange ? parseNumber(val[1]) : 0;
    var unitMatch = unitsExecRgx.exec((isRange ? val[1] : val) + emptyString);
    var start = params.start || 0 + (isRange ? val1 : 0);
    var fromIndex = fromFirst ? 0 : isNum(from) ? from : 0;
    return function (_, i, t, tl) {
      if (fromCenter) fromIndex = (t - 1) / 2;
      if (fromLast) fromIndex = t - 1;
      if (!values.length) {
        for (var index = 0; index < t; index++) {
          if (!grid) {
            values.push(abs(fromIndex - index));
          } else {
            var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = !fromCenter ? floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
            var toX = index % grid[0];
            var toY = floor(index / grid[0]);
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
            var value = sqrt(distanceX * distanceX + distanceY * distanceY);
            if (axis === 'x') value = -distanceX;
            if (axis === 'y') value = -distanceY;
            values.push(value);
          }
          maxValue = max.apply(void 0, _toConsumableArray(values));
        }
        if (staggerEase) values = values.map(function (val) {
          return staggerEase(val / maxValue) * maxValue;
        });
        if (reversed) values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : abs(maxValue - val);
        });
      }
      var spacing = isRange ? (val2 - val1) / maxValue : val1;
      var offset = tl ? parseTimelinePosition(tl, isUnd(params.start) ? tl._iterationDuration : start) : (start);
      var output = offset + (spacing * round(values[i], 2) || 0);
      if (params.modifier) output = params.modifier(output);
      if (unitMatch) output = "".concat(output).concat(unitMatch[2]);
      return output;
    };
  };

  var Spring = function () {
    function Spring() {
      var _this = this;
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Spring);
      this.timeStep = .02;
      this.restThreshold = .0005;
      this.restDuration = 200;
      this.maxDuration = 60000;
      this.maxRestSteps = this.restDuration / this.timeStep / K;
      this.maxIterations = this.maxDuration / this.timeStep / K;
      this.m = clamp(setValue(parameters.mass, 1), 0, K);
      this.s = clamp(setValue(parameters.stiffness, 100), 1, K);
      this.d = clamp(setValue(parameters.damping, 10), .1, K);
      this.v = clamp(setValue(parameters.velocity, 0), 0, K);
      this.w0 = 0;
      this.zeta = 0;
      this.wd = 0;
      this.b = 0;
      this.solverDuration = 0;
      this.duration = 0;
      this.compute();
      this.ease = function (t) {
        return t === 0 || t === 1 ? t : _this.solve(t * _this.solverDuration);
      };
    }
    _createClass(Spring, [{
      key: "solve",
      value: function solve(time) {
        var zeta = this.zeta,
          w0 = this.w0,
          wd = this.wd,
          b = this.b;
        var t = time;
        if (zeta < 1) {
          t = exp(-t * zeta * w0) * (1 * cos(wd * t) + b * sin(wd * t));
        } else {
          t = (1 + b * t) * exp(-t * w0);
        }
        return 1 - t;
      }
    }, {
      key: "compute",
      value: function compute() {
        var maxRestSteps = this.maxRestSteps,
          maxIterations = this.maxIterations,
          restThreshold = this.restThreshold,
          timeStep = this.timeStep,
          m = this.m,
          d = this.d,
          s = this.s,
          v = this.v;
        var w0 = this.w0 = clamp(sqrt(s / m), minValue, K);
        var zeta = this.zeta = d / (2 * sqrt(s * m));
        var wd = this.wd = zeta < 1 ? w0 * sqrt(1 - zeta * zeta) : 0;
        this.b = zeta < 1 ? (zeta * w0 + -v) / wd : -v + w0;
        var solverTime = 0;
        var restSteps = 0;
        var iterations = 0;
        while (restSteps < maxRestSteps && iterations < maxIterations) {
          if (abs(1 - this.solve(solverTime)) < restThreshold) {
            restSteps++;
          } else {
            restSteps = 0;
          }
          this.solverDuration = solverTime;
          solverTime += timeStep;
          iterations++;
        }
        this.duration = round(this.solverDuration * K, 0) * globals.timeScale;
      }
    }, {
      key: "mass",
      get: function get() {
        return this.m;
      },
      set: function set(v) {
        this.m = clamp(setValue(v, 1), 0, K);
        this.compute();
      }
    }, {
      key: "stiffness",
      get: function get() {
        return this.s;
      },
      set: function set(v) {
        this.s = clamp(setValue(v, 100), 1, K);
        this.compute();
      }
    }, {
      key: "damping",
      get: function get() {
        return this.d;
      },
      set: function set(v) {
        this.d = clamp(setValue(v, 10), .1, K);
        this.compute();
      }
    }, {
      key: "velocity",
      get: function get() {
        return this.v;
      },
      set: function set(v) {
        this.v = clamp(setValue(v, 0), 0, K);
        this.compute();
      }
    }]);
    return Spring;
  }();
  var createSpring = function createSpring(parameters) {
    return new Spring(parameters);
  };

  var getMaxViewHeight = function getMaxViewHeight() {
    var $el = document.createElement('div');
    doc.body.appendChild($el);
    $el.style.height = '100lvh';
    var height = $el.offsetHeight;
    doc.body.removeChild($el);
    return height;
  };
  var parseScrollObserverFunctionParameter = function parseScrollObserverFunctionParameter(value, scroller) {
    return value && isFnc(value) ? value(scroller) : value;
  };
  var scrollContainers = new Map();
  var ScrollContainer = function () {
    function ScrollContainer($el) {
      var _this = this;
      _classCallCheck(this, ScrollContainer);
      this.element = $el;
      this.useWin = this.element === doc.body;
      this.winWidth = 0;
      this.winHeight = 0;
      this.width = 0;
      this.height = 0;
      this.left = 0;
      this.top = 0;
      this.zIndex = 0;
      this.scrollX = 0;
      this.scrollY = 0;
      this.prevScrollX = 0;
      this.prevScrollY = 0;
      this.scrollWidth = 0;
      this.scrollHeight = 0;
      this.velocity = 0;
      this.backwardX = false;
      this.backwardY = false;
      this.scrollTicker = new Timer({
        autoplay: false,
        onBegin: function onBegin() {
          return _this.dataTimer.play();
        },
        onUpdate: function onUpdate() {
          forEachChildren(_this, function (child) {
            return child.handleScroll();
          });
        },
        onComplete: function onComplete() {
          return _this.dataTimer.pause();
        }
      }).init();
      this.dataTimer = new Timer({
        autoplay: false,
        frameRate: 30,
        onUpdate: function onUpdate(self) {
          var dt = self.deltaTime;
          var px = _this.prevScrollX;
          var py = _this.prevScrollY;
          var nx = _this.scrollX;
          var ny = _this.scrollY;
          var dx = px - nx;
          var dy = py - ny;
          _this.prevScrollX = nx;
          _this.prevScrollY = ny;
          if (dx) _this.backwardX = px > nx;
          if (dy) _this.backwardY = py > ny;
          _this.velocity = round(dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0, 5);
        }
      }).init();
      this.resizeTicker = new Timer({
        autoplay: false,
        duration: 250 * globals.timeScale,
        onComplete: function onComplete() {
          _this.updateWindowBounds();
          _this.refreshScrollObservers();
          _this.handleScroll();
        }
      }).init();
      this.wakeTicker = new Timer({
        autoplay: false,
        duration: 66 * globals.timeScale,
        onBegin: function onBegin() {
          _this.scrollTicker.play();
        },
        onComplete: function onComplete() {
          _this.scrollTicker.pause();
        }
      }).init();
      this._head = null;
      this._tail = null;
      this.updateScrollCoords();
      this.updateWindowBounds();
      this.updateBounds();
      this.refreshScrollObservers();
      this.handleScroll();
      this.resizeObserver = new ResizeObserver(function () {
        return _this.resizeTicker.restart();
      });
      this.resizeObserver.observe(this.element);
      (this.useWin ? win : this.element).addEventListener('scroll', this, false);
    }
    _createClass(ScrollContainer, [{
      key: "updateScrollCoords",
      value: function updateScrollCoords() {
        var useWin = this.useWin;
        var $el = this.element;
        this.scrollX = round(useWin ? win.scrollX : $el.scrollLeft, 0);
        this.scrollY = round(useWin ? win.scrollY : $el.scrollTop, 0);
      }
    }, {
      key: "updateWindowBounds",
      value: function updateWindowBounds() {
        this.winWidth = win.innerWidth;
        this.winHeight = getMaxViewHeight();
      }
    }, {
      key: "updateBounds",
      value: function updateBounds() {
        var style = getComputedStyle(this.element);
        var $el = this.element;
        this.scrollWidth = $el.scrollWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        this.scrollHeight = $el.scrollHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        this.updateWindowBounds();
        var width, height;
        if (this.useWin) {
          width = this.winWidth;
          height = this.winHeight;
        } else {
          var elRect = $el.getBoundingClientRect();
          width = elRect.width;
          height = elRect.height;
          this.top = elRect.top;
          this.left = elRect.left;
        }
        this.width = width;
        this.height = height;
      }
    }, {
      key: "refreshScrollObservers",
      value: function refreshScrollObservers() {
        forEachChildren(this, function (child) {
          if (child._debug) {
            child.removeDebug();
          }
        });
        this.updateBounds();
        forEachChildren(this, function (child) {
          child.refresh();
          if (child._debug) {
            child.debug();
          }
        });
      }
    }, {
      key: "refresh",
      value: function refresh() {
        this.updateWindowBounds();
        this.updateBounds();
        this.refreshScrollObservers();
        this.handleScroll();
      }
    }, {
      key: "handleScroll",
      value: function handleScroll() {
        this.updateScrollCoords();
        this.wakeTicker.restart();
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
        switch (e.type) {
          case 'scroll':
            this.handleScroll();
            break;
        }
      }
    }, {
      key: "revert",
      value: function revert() {
        this.scrollTicker.cancel();
        this.dataTimer.cancel();
        this.resizeTicker.cancel();
        this.wakeTicker.cancel();
        this.resizeObserver.unobserve(this.element);
        (this.useWin ? win : this.element).removeEventListener('scroll', this);
        scrollContainers["delete"](this.element);
      }
    }]);
    return ScrollContainer;
  }();
  var registerAndGetScrollContainer = function registerAndGetScrollContainer(target) {
    var $el = target ? parseTargets(target)[0] || doc.body : doc.body;
    var scrollContainer = scrollContainers.get($el);
    if (!scrollContainer) {
      scrollContainer = new ScrollContainer($el);
      scrollContainers.set($el, scrollContainer);
    }
    return scrollContainer;
  };
  var convertValueToPx = function convertValueToPx($el, v, size, under, over) {
    var clampMin = v === 'min';
    var clampMax = v === 'max';
    var value = v === 'top' || v === 'left' || v === 'start' || clampMin ? 0 : v === 'bottom' || v === 'right' || v === 'end' || clampMax ? '100%' : v === 'center' ? '50%' : v;
    var _decomposeRawValue = decomposeRawValue(value, decomposedOriginalValue),
      n = _decomposeRawValue.n,
      u = _decomposeRawValue.u;
    var px = n;
    if (u === '%') {
      px = n / 100 * size;
    } else if (u) {
      px = convertValueUnit($el, decomposedOriginalValue, 'px', true).n;
    }
    if (clampMax && under < 0) px += under;
    if (clampMin && over > 0) px += over;
    return px;
  };
  var parseBoundValue = function parseBoundValue($el, v, size, under, over) {
    var value;
    if (isStr(v)) {
      var matchedOperator = relativeValuesExecRgx.exec(v);
      if (matchedOperator) {
        var splitter = matchedOperator[0];
        var operator = splitter[0];
        var splitted = v.split(splitter);
        var clampMin = splitted[0] === 'min';
        var clampMax = splitted[0] === 'max';
        var valueAPx = convertValueToPx($el, splitted[0], size, under, over);
        var valueBPx = convertValueToPx($el, splitted[1], size, under, over);
        if (clampMin) {
          var min = getRelativeValue(convertValueToPx($el, 'min', size), valueBPx, operator);
          value = min < valueAPx ? valueAPx : min;
        } else if (clampMax) {
          var max = getRelativeValue(convertValueToPx($el, 'max', size), valueBPx, operator);
          value = max > valueAPx ? valueAPx : max;
        } else {
          value = getRelativeValue(valueAPx, valueBPx, operator);
        }
      } else {
        value = convertValueToPx($el, v, size, under, over);
      }
    } else {
      value = v;
    }
    return round(value, 0);
  };
  var getAnimationDomTarget = function getAnimationDomTarget(linked) {
    var $linkedTarget;
    var linkedTargets = linked.targets;
    for (var i = 0, l = linkedTargets.length; i < l; i++) {
      var target = linkedTargets[i];
      if (target[isDomSymbol]) {
        $linkedTarget = target;
        break;
      }
    }
    return $linkedTarget;
  };
  var scrollerIndex = 0;
  var debugColors = ['#FF4B4B', '#FF971B', '#FFC730', '#F9F640', '#7AFF5A', '#18FF74', '#17E09B', '#3CFFEC', '#05DBE9', '#33B3F1', '#638CF9', '#C563FE', '#FF4FCF', '#F93F8A'];
  var ScrollObserver = function () {
    function ScrollObserver() {
      var _this2 = this;
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, ScrollObserver);
      if (globals.scope) globals.scope.revertibles.push(this);
      var sync = setValue(parameters.sync, 'play pause');
      var ease = sync ? parseEasings(sync) : null;
      var isLinear = sync && (sync === 'linear' || sync === none);
      var isEase = sync && !(ease === none && !isLinear);
      var isSmooth = sync && (isNum(sync) || sync === true || isLinear);
      var isMethods = sync && isStr(sync) && !isEase && !isSmooth;
      var syncMethods = isMethods ? sync.split(' ').map(function (m) {
        return function () {
          var linked = _this2.linked;
          return linked && linked[m] ? linked[m]() : null;
        };
      }) : null;
      var biDirSync = isMethods && syncMethods.length > 2;
      this.index = scrollerIndex++;
      this.id = !isUnd(parameters.id) ? parameters.id : this.index;
      this.container = registerAndGetScrollContainer(parameters.container);
      this.target = null;
      this.linked = null;
      this.repeat = null;
      this.horizontal = null;
      this.enter = null;
      this.leave = null;
      this.sync = isEase || isSmooth || !!syncMethods;
      this.syncEase = isEase ? ease : null;
      this.syncSmooth = isSmooth ? sync === true || isLinear ? 1 : (sync) : null;
      this.onSyncEnter = syncMethods && !biDirSync && syncMethods[0] ? syncMethods[0] : noop;
      this.onSyncLeave = syncMethods && !biDirSync && syncMethods[1] ? syncMethods[1] : noop;
      this.onSyncEnterForward = syncMethods && biDirSync && syncMethods[0] ? syncMethods[0] : noop;
      this.onSyncLeaveForward = syncMethods && biDirSync && syncMethods[1] ? syncMethods[1] : noop;
      this.onSyncEnterBackward = syncMethods && biDirSync && syncMethods[2] ? syncMethods[2] : noop;
      this.onSyncLeaveBackward = syncMethods && biDirSync && syncMethods[3] ? syncMethods[3] : noop;
      this.onEnter = parameters.onEnter || noop;
      this.onLeave = parameters.onLeave || noop;
      this.onEnterForward = parameters.onEnterForward || noop;
      this.onLeaveForward = parameters.onLeaveForward || noop;
      this.onEnterBackward = parameters.onEnterBackward || noop;
      this.onLeaveBackward = parameters.onLeaveBackward || noop;
      this.onUpdate = parameters.onUpdate || noop;
      this.onSyncComplete = parameters.onSyncComplete || noop;
      this.completed = false;
      this.began = false;
      this.isInView = false;
      this.forceEnter = false;
      this.hasEntered = false;
      this.offsets = [];
      this.offset = 0;
      this.offsetStart = 0;
      this.offsetEnd = 0;
      this.distance = 0;
      this.thresholds = ['start', 'end', 'end', 'start'];
      this.coords = [0, 0, 0, 0];
      this.debugStyles = null;
      this.$debug = null;
      this._params = parameters;
      this._debug = setValue(parameters.debug, false);
      this._next = null;
      this._prev = null;
      requestAnimationFrame(function () {
        if (!_this2.target) {
          var target = parseTargets(parameters.target)[0];
          _this2.target = target || doc.body;
          _this2.refresh();
        }
        if (_this2._debug) _this2.debug();
        addChild(_this2.container, _this2);
      });
    }
    _createClass(ScrollObserver, [{
      key: "link",
      value: function link(linked) {
        if (linked) {
          linked.pause();
          this.linked = linked;
          if (!this._params.target) {
            var $linkedTarget;
            if (!isUnd(linked.targets)) {
              $linkedTarget = getAnimationDomTarget(linked);
            } else {
              forEachChildren(linked, function (child) {
                if (child.targets && !$linkedTarget) {
                  $linkedTarget = getAnimationDomTarget(child);
                }
              });
            }
            this.target = $linkedTarget || doc.body;
            this.refresh();
          }
        }
        return this;
      }
    }, {
      key: "velocity",
      get: function get() {
        return this.container.velocity;
      }
    }, {
      key: "backward",
      get: function get() {
        return this.horizontal ? this.container.backwardX : this.container.backwardY;
      }
    }, {
      key: "scroll",
      get: function get() {
        return this.horizontal ? this.container.scrollX : this.container.scrollY;
      }
    }, {
      key: "progress",
      get: function get() {
        var p = (this.scroll - this.offsetStart) / this.distance;
        return p === Infinity || isNaN(p) ? 0 : round(clamp(p, 0, 1), 6);
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var params = this._params;
        this.repeat = setValue(parseScrollObserverFunctionParameter(params.repeat, this), true);
        this.horizontal = setValue(parseScrollObserverFunctionParameter(params.axis, this), 'y') === 'x';
        this.enter = setValue(parseScrollObserverFunctionParameter(params.enter, this), 'start end');
        this.leave = setValue(parseScrollObserverFunctionParameter(params.leave, this), 'end start');
        this.updateBounds();
        this.handleScroll();
        return this;
      }
    }, {
      key: "removeDebug",
      value: function removeDebug() {
        if (this.$debug) {
          this.$debug.parentNode.removeChild(this.$debug);
          this.$debug = null;
        }
        if (this.debugStyles) {
          this.debugStyles.revert();
          this.$debug = null;
        }
      }
    }, {
      key: "debug",
      value: function debug() {
        var _this3 = this;
        this.removeDebug();
        var container = this.container;
        var isHori = this.horizontal;
        var $existingDebug = container.element.querySelector(':scope > .animejs-onscroll-debug');
        var $debug = doc.createElement('div');
        var $thresholds = doc.createElement('div');
        var $triggers = doc.createElement('div');
        var color = debugColors[this.index % debugColors.length];
        var useWin = container.useWin;
        var containerWidth = useWin ? container.winWidth : container.width;
        var containerHeight = useWin ? container.winHeight : container.height;
        var scrollWidth = container.scrollWidth;
        var scrollHeight = container.scrollHeight;
        var size = this.container.width > 360 ? 320 : 260;
        var offLeft = isHori ? 0 : 10;
        var offTop = isHori ? 10 : 0;
        var half = isHori ? 24 : size / 2;
        var labelHeight = isHori ? half : 15;
        var labelWidth = isHori ? 60 : half;
        var labelSize = isHori ? labelWidth : labelHeight;
        var repeat = isHori ? 'repeat-x' : 'repeat-y';
        var gradientOffset = function gradientOffset(v) {
          return isHori ? '0px ' + v + 'px' : v + 'px' + ' 2px';
        };
        var lineCSS = function lineCSS(c) {
          return "linear-gradient(".concat(isHori ? 90 : 0, "deg, ").concat(c, " 2px, transparent 1px)");
        };
        var baseCSS = function baseCSS(p, l, t, w, h) {
          return "position:".concat(p, ";left:").concat(l, "px;top:").concat(t, "px;width:").concat(w, "px;height:").concat(h, "px;");
        };
        $debug.style.cssText = "".concat(baseCSS('absolute', offLeft, offTop, isHori ? scrollWidth : size, isHori ? size : scrollHeight), "\n      pointer-events: none;\n      z-index: ").concat(this.container.zIndex++, ";\n      display: flex;\n      flex-direction: ").concat(isHori ? 'column' : 'row', ";\n      filter: drop-shadow(0px 1px 0px rgba(0,0,0,.75));\n    ");
        $thresholds.style.cssText = "".concat(baseCSS('sticky', 0, 0, isHori ? containerWidth : half, isHori ? half : containerHeight));
        if (!$existingDebug) {
          $thresholds.style.cssText += "background:\n        ".concat(lineCSS('#FFFF')).concat(gradientOffset(half - 10), " / ").concat(isHori ? '100px 100px' : '100px 100px', " ").concat(repeat, ",\n        ").concat(lineCSS('#FFF8')).concat(gradientOffset(half - 10), " / ").concat(isHori ? '10px 10px' : '10px 10px', " ").concat(repeat, ";\n      ");
        }
        $triggers.style.cssText = "".concat(baseCSS('relative', 0, 0, isHori ? scrollWidth : half, isHori ? half : scrollHeight));
        if (!$existingDebug) {
          $triggers.style.cssText += "background:\n        ".concat(lineCSS('#FFFF')).concat(gradientOffset(0), " / ").concat(isHori ? '100px 10px' : '10px 100px', " ").concat(repeat, ",\n        ").concat(lineCSS('#FFF8')).concat(gradientOffset(0), " / ").concat(isHori ? '10px 0px' : '0px 10px', " ").concat(repeat, ";\n      ");
        }
        var labels = [' enter: ', ' leave: '];
        this.coords.forEach(function (v, i) {
          var isView = i > 1;
          var value = (isView ? 0 : _this3.offset) + v;
          var isTail = i % 2;
          var isFirst = value < labelSize;
          var isOver = value > (isView ? isHori ? containerWidth : containerHeight : isHori ? scrollWidth : scrollHeight) - labelSize;
          var isFlip = (isView ? isTail && !isFirst : !isTail && !isFirst) || isOver;
          var $label = doc.createElement('div');
          var $text = doc.createElement('div');
          var dirProp = isHori ? isFlip ? 'right' : 'left' : isFlip ? 'bottom' : 'top';
          var flipOffset = isFlip ? (isHori ? labelWidth : labelHeight) + (!isView ? isHori ? -1 : -2 : isHori ? -1 : isOver ? 0 : -2) : !isView ? isHori ? 1 : 0 : isHori ? 1 : 0;
          $text.innerHTML = "".concat(_this3.id).concat(labels[isTail]).concat(_this3.thresholds[i]);
          $label.style.cssText = "".concat(baseCSS('absolute', 0, 0, labelWidth, labelHeight), "\n        display: flex;\n        flex-direction: ").concat(isHori ? 'column' : 'row', ";\n        justify-content: flex-").concat(isView ? 'start' : 'end', ";\n        align-items: flex-").concat(isFlip ? 'end' : 'start', ";\n        border-").concat(dirProp, ": 2px ").concat(isTail ? 'solid' : 'solid', " ").concat(color, ";\n      ");
          $text.style.cssText = "\n        overflow: hidden;\n        max-width: ".concat(size / 2 - 10, "px;\n        height: ").concat(labelHeight, ";\n        margin-").concat(isHori ? isFlip ? 'right' : 'left' : isFlip ? 'bottom' : 'top', ": -2px;\n        padding: 1px;\n        font-family: ui-monospace, monospace;\n        font-size: 10px;\n        letter-spacing: -.025em;\n        line-height: 9px;\n        font-weight: 600;\n        text-align: ").concat(isHori && isFlip || !isHori && !isView ? 'right' : 'left', ";\n        white-space: pre;\n        text-overflow: ellipsis;\n        color: ").concat(isTail ? color : 'rgba(0,0,0,.75)', ";\n        background-color: ").concat(isTail ? 'rgba(0,0,0,.65)' : color, ";\n        border: 2px solid ").concat(isTail ? color : 'transparent', ";\n        border-").concat(isHori ? isFlip ? 'top-left' : 'top-right' : isFlip ? 'top-left' : 'bottom-left', "-radius: 5px;\n        border-").concat(isHori ? isFlip ? 'bottom-left' : 'bottom-right' : isFlip ? 'top-right' : 'bottom-right', "-radius: 5px;\n      ");
          $label.appendChild($text);
          var position = value - flipOffset + (isHori ? 1 : 0);
          $label.style[isHori ? 'left' : 'top'] = "".concat(position, "px");
          (isView ? $thresholds : $triggers).appendChild($label);
        });
        $debug.appendChild($thresholds);
        $debug.appendChild($triggers);
        container.element.appendChild($debug);
        if (!$existingDebug) $debug.classList.add('animejs-onscroll-debug');
        this.$debug = $debug;
        var containerPosition = getTargetValue(container.element, 'position');
        if (containerPosition === 'static') {
          this.debugStyles = setTargetValues(container.element, {
            position: 'relative '
          });
        }
      }
    }, {
      key: "updateBounds",
      value: function updateBounds() {
        if (this._debug) {
          this.removeDebug();
        }
        var stickys;
        var $target = this.target;
        var container = this.container;
        var isHori = this.horizontal;
        var linked = this.linked;
        var linkedTime;
        var $el = $target;
        var offsetX = 0;
        var offsetY = 0;
        var $offsetParent = $el;
        if (linked) {
          linkedTime = linked.currentTime;
          linked.seek(0, true);
        }
        var isContainerStatic = getTargetValue(container.element, 'position') === 'static' ? setTargetValues(container.element, {
          position: 'relative '
        }) : false;
        while ($el && $el !== container.element && $el !== doc.body) {
          var isSticky = getTargetValue($el, 'position') === 'sticky' ? setTargetValues($el, {
            position: 'static'
          }) : false;
          if ($el === $offsetParent) {
            offsetX += $el.offsetLeft || 0;
            offsetY += $el.offsetTop || 0;
            $offsetParent = $el.offsetParent;
          }
          $el = $el.parentElement;
          if (isSticky) {
            if (!stickys) stickys = [];
            stickys.push(isSticky);
          }
        }
        if (isContainerStatic) isContainerStatic.revert();
        var offset = isHori ? offsetX : offsetY;
        var targetSize = isHori ? $target.offsetWidth : $target.offsetHeight;
        var containerSize = isHori ? container.width : container.height;
        var scrollSize = isHori ? container.scrollWidth : container.scrollHeight;
        var maxScroll = scrollSize - containerSize;
        var enter = this.enter;
        var leave = this.leave;
        var enterTarget = 'start';
        var leaveTarget = 'end';
        var enterContainer = 'end';
        var leaveContainer = 'start';
        if (isStr(enter)) {
          var splitted = enter.split(' ');
          enterTarget = splitted[0];
          enterContainer = splitted.length > 1 ? splitted[1] : splitted[0];
        } else if (isObj(enter)) {
          var e = enter;
          if (!isUnd(e.target)) enterTarget = e.target;
          if (!isUnd(e.container)) enterContainer = e.container;
        } else if (isNum(enter)) {
          enterContainer = enter;
        }
        if (isStr(leave)) {
          var _splitted = leave.split(' ');
          leaveTarget = _splitted[0];
          leaveContainer = _splitted.length > 1 ? _splitted[1] : _splitted[0];
        } else if (isObj(leave)) {
          var t = leave;
          if (!isUnd(t.target)) leaveTarget = t.target;
          if (!isUnd(t.container)) leaveContainer = t.container;
        } else if (isNum(leave)) {
          leaveContainer = leave;
        }
        var parsedEnterTarget = parseBoundValue($target, enterTarget, targetSize);
        var parsedLeaveTarget = parseBoundValue($target, leaveTarget, targetSize);
        var under = parsedEnterTarget + offset - containerSize;
        var over = parsedLeaveTarget + offset - maxScroll;
        var parsedEnterContainer = parseBoundValue($target, enterContainer, containerSize, under, over);
        var parsedLeaveContainer = parseBoundValue($target, leaveContainer, containerSize, under, over);
        var offsetStart = parsedEnterTarget + offset - parsedEnterContainer;
        var offsetEnd = parsedLeaveTarget + offset - parsedLeaveContainer;
        var scrollDelta = offsetEnd - offsetStart;
        this.offsets[0] = offsetX;
        this.offsets[1] = offsetY;
        this.offset = offset;
        this.offsetStart = offsetStart;
        this.offsetEnd = offsetEnd;
        this.distance = scrollDelta <= 0 ? 0 : scrollDelta;
        this.thresholds = [enterTarget, leaveTarget, enterContainer, leaveContainer];
        this.coords = [parsedEnterTarget, parsedLeaveTarget, parsedEnterContainer, parsedLeaveContainer];
        if (stickys) {
          stickys.forEach(function (sticky) {
            return sticky.revert();
          });
        }
        if (linked) {
          linked.seek(linkedTime, true);
        }
        if (this._debug) {
          this.debug();
        }
      }
    }, {
      key: "handleScroll",
      value: function handleScroll() {
        var linked = this.linked;
        var sync = this.sync;
        var syncEase = this.syncEase;
        var syncSmooth = this.syncSmooth;
        var shouldSeek = linked && (syncEase || syncSmooth);
        var isHori = this.horizontal;
        var container = this.container;
        var scroll = this.scroll;
        var isBefore = scroll <= this.offsetStart;
        var isAfter = scroll >= this.offsetEnd;
        var isInView = !isBefore && !isAfter;
        var isOnTheEdge = scroll === this.offsetStart || scroll === this.offsetEnd;
        var forceEnter = !this.hasEntered && isOnTheEdge;
        var $debug = this._debug && this.$debug;
        var hasUpdated = false;
        var syncCompleted = false;
        var p = this.progress;
        if (isBefore && this.began) {
          this.began = false;
        }
        if (p > 0 && !this.began) {
          this.began = true;
        }
        if (shouldSeek) {
          var lp = linked.progress;
          if (syncSmooth && isNum(syncSmooth)) {
            if (syncSmooth < 1) {
              var step = 0.0001;
              var snap = lp < p && p === 1 ? step : lp > p && !p ? -step : 0;
              p = round(lerp(lp, p, interpolate(.01, .2, syncSmooth), false) + snap, 6);
            }
          } else if (syncEase) {
            p = syncEase(p);
          }
          hasUpdated = p !== lp;
          syncCompleted = lp === 1;
          if (hasUpdated && !syncCompleted && syncSmooth && lp) {
            container.wakeTicker.restart();
          }
        }
        if ($debug) {
          var sticky = isHori ? container.scrollY : container.scrollX;
          $debug.style[isHori ? 'top' : 'left'] = sticky + 10 + 'px';
        }
        if (isInView && !this.isInView || forceEnter && !this.forceEnter && !this.hasEntered) {
          if (isInView) this.isInView = true;
          if (!this.forceEnter || !this.hasEntered) {
            if ($debug && isInView) $debug.style.zIndex = "".concat(this.container.zIndex++);
            this.onSyncEnter(this);
            this.onEnter(this);
            if (this.backward) {
              this.onSyncEnterBackward(this);
              this.onEnterBackward(this);
            } else {
              this.onSyncEnterForward(this);
              this.onEnterForward(this);
            }
            this.hasEntered = true;
            if (forceEnter) this.forceEnter = true;
          } else if (isInView) {
            this.forceEnter = false;
          }
        }
        if (isInView || !isInView && this.isInView) {
          hasUpdated = true;
        }
        if (hasUpdated) {
          if (shouldSeek) linked.seek(linked.duration * p);
          this.onUpdate(this);
        }
        if (!isInView && this.isInView) {
          this.isInView = false;
          this.onSyncLeave(this);
          this.onLeave(this);
          if (this.backward) {
            this.onSyncLeaveBackward(this);
            this.onLeaveBackward(this);
          } else {
            this.onSyncLeaveForward(this);
            this.onLeaveForward(this);
          }
          if (sync && !syncSmooth) {
            syncCompleted = true;
          }
        }
        if (p >= 1 && this.began && !this.completed && (sync && syncCompleted || !sync)) {
          if (sync) {
            this.onSyncComplete(this);
          }
          this.completed = true;
          if (!this.repeat && !linked || !this.repeat && linked && linked.completed) {
            this.revert();
          }
        }
        if (p < 1 && this.completed) {
          this.completed = false;
        }
      }
    }, {
      key: "revert",
      value: function revert() {
        var container = this.container;
        removeChild(container, this);
        if (!container._head) {
          container.revert();
        }
        if (this._debug) {
          this.removeDebug();
        }
        return this;
      }
    }]);
    return ScrollObserver;
  }();
  var onScroll = function onScroll() {
    var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new ScrollObserver(parameters);
  };

  var Animatable = function () {
    function Animatable(targets, parameters) {
      var _this = this;
      _classCallCheck(this, Animatable);
      if (globals.scope) globals.scope.revertibles.push(this);
      var globalParams = {};
      var properties = {};
      this.targets = [];
      this.animations = {};
      if (isUnd(targets) || isUnd(parameters)) return;
      for (var propName in parameters) {
        var paramValue = parameters[propName];
        if (isKey(propName)) {
          properties[propName] = paramValue;
        } else {
          globalParams[propName] = paramValue;
        }
      }
      var _loop = function _loop() {
        var _this$targets;
        var propValue = properties[_propName];
        var isObjValue = isObj(propValue);
        var propParams = {};
        var to = '+=0';
        if (isObjValue) {
          var unit = propValue.unit;
          if (isStr(unit)) to += unit;
        } else {
          propParams.duration = propValue;
        }
        propParams[_propName] = isObjValue ? mergeObjects({
          to: to
        }, propValue) : to;
        var animParams = mergeObjects(globalParams, propParams);
        animParams.composition = compositionTypes.replace;
        animParams.autoplay = false;
        var animation = _this.animations[_propName] = new Animation(targets, animParams, null, 0, false).init();
        if (!_this.targets.length) (_this$targets = _this.targets).push.apply(_this$targets, _toConsumableArray(animation.targets));
        _this[_propName] = function (to, duration, ease) {
          var tween = animation._head;
          if (isUnd(to)) {
            var numbers = tween._numbers;
            if (numbers && numbers.length) {
              return numbers;
            } else {
              return tween._modifier(tween._number);
            }
          } else {
            forEachChildren(animation, function (tween) {
              if (isArr(to)) {
                for (var i = 0, l = to.length; i < l; i++) {
                  if (!isUnd(tween._numbers[i])) {
                    tween._fromNumbers[i] = tween._modifier(tween._numbers[i]);
                    tween._toNumbers[i] = to[i];
                  }
                }
              } else {
                tween._fromNumber = tween._modifier(tween._number);
                tween._toNumber = to;
              }
              if (!isUnd(ease)) tween._ease = parseEasings(ease);
              tween._currentTime = 0;
            });
            if (!isUnd(duration)) animation.stretch(duration);
            animation.reset(1).play();
            return _this;
          }
        };
      };
      for (var _propName in properties) {
        _loop();
      }
    }
    _createClass(Animatable, [{
      key: "revert",
      value: function revert() {
        for (var propName in this.animations) {
          this[propName] = noop;
          this.animations[propName].revert();
        }
        this.animations = {};
        this.targets.length = 0;
        return this;
      }
    }]);
    return Animatable;
  }();

  var DOMProxy = function () {
    function DOMProxy(el) {
      _classCallCheck(this, DOMProxy);
      this.el = el;
      this.zIndex = 0;
      this.parentElement = null;
      this.classList = {
        add: noop,
        remove: noop
      };
    }
    _createClass(DOMProxy, [{
      key: "x",
      get: function get() {
        return this.el.x || 0;
      },
      set: function set(v) {
        this.el.x = v;
      }
    }, {
      key: "y",
      get: function get() {
        return this.el.y || 0;
      },
      set: function set(v) {
        this.el.y = v;
      }
    }, {
      key: "width",
      get: function get() {
        return this.el.width || 0;
      },
      set: function set(v) {
        this.el.width = v;
      }
    }, {
      key: "height",
      get: function get() {
        return this.el.height || 0;
      },
      set: function set(v) {
        this.el.height = v;
      }
    }, {
      key: "getBoundingClientRect",
      value: function getBoundingClientRect() {
        return {
          top: this.y,
          right: this.x,
          bottom: this.y + this.height,
          left: this.x + this.width
        };
      }
    }]);
    return DOMProxy;
  }();
  var Transforms = function () {
    function Transforms($el) {
      _classCallCheck(this, Transforms);
      this.$el = $el;
      this.inlineTransforms = [];
      this.point = new DOMPoint();
      this.inversedMatrix = this.getMatrix().inverse();
    }
    _createClass(Transforms, [{
      key: "normalizePoint",
      value: function normalizePoint(x, y) {
        this.point.x = x;
        this.point.y = y;
        return this.point.matrixTransform(this.inversedMatrix);
      }
    }, {
      key: "traverseUp",
      value: function traverseUp(cb) {
        var $el = this.$el.parentElement,
          i = 0;
        while ($el && $el !== doc) {
          cb($el, i);
          $el = $el.parentElement;
          i++;
        }
      }
    }, {
      key: "getMatrix",
      value: function getMatrix() {
        var matrix = new DOMMatrix();
        this.traverseUp(function ($el) {
          var elMatrix = new DOMMatrix(getTargetValue($el, 'transform'));
          matrix.preMultiplySelf(elMatrix);
        });
        return matrix;
      }
    }, {
      key: "remove",
      value: function remove() {
        var _this = this;
        this.traverseUp(function ($el, i) {
          _this.inlineTransforms[i] = $el.style.transform;
          $el.style.transform = 'none';
        });
      }
    }, {
      key: "revert",
      value: function revert() {
        var _this2 = this;
        this.traverseUp(function ($el, i) {
          var ct = _this2.inlineTransforms[i];
          if (ct === '') {
            $el.style.removeProperty('transform');
          } else {
            $el.style.transform = ct;
          }
        });
      }
    }]);
    return Transforms;
  }();
  var parseDraggableFunctionParameter = function parseDraggableFunctionParameter(value, draggable) {
    return value && isFnc(value) ? value(draggable) : value;
  };
  var zIndex = 0;
  var Draggable = function () {
    function Draggable(target) {
      var _this3 = this;
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Draggable);
      if (!target) return;
      if (globals.scope) globals.scope.revertibles.push(this);
      var paramX = parameters.x;
      var paramY = parameters.y;
      var trigger = parameters.trigger;
      var modifier = parameters.modifier;
      var ease = parameters.releaseEase;
      var customEase = ease && parseEasings(ease);
      var hasSpring = !isUnd(ease) && !isUnd(ease.ease);
      var xProp = isObj(paramX) && !isUnd(paramX.mapTo) ? paramX.mapTo : 'x';
      var yProp = isObj(paramY) && !isUnd(paramY.mapTo) ? paramY.mapTo : 'y';
      var container = parseDraggableFunctionParameter(parameters.container, this);
      this.containerArray = isArr(container) ? container : null;
      this.$container = container && !this.containerArray ? parseTargets(container)[0] : doc.body;
      this.useWin = this.$container === doc.body;
      this.$scrollContainer = this.useWin ? win : this.$container;
      this.$target = isObj(target) ? new DOMProxy(target) : parseTargets(target)[0];
      this.$trigger = parseTargets(trigger ? trigger : target)[0];
      this.fixed = getTargetValue(this.$target, 'position') === 'fixed';
      this.isFinePointer = true;
      this.containerPadding = [0, 0, 0, 0];
      this.containerFriction = 0;
      this.snapX = 0;
      this.snapY = 0;
      this.scrollSpeed = 0;
      this.scrollThreshold = 0;
      this.dragSpeed = 0;
      this.maxVelocity = 0;
      this.minVelocity = 0;
      this.velocityMultiplier = 0;
      this.cursor = false;
      this.releaseSpring = hasSpring ? (ease) : createSpring({
        mass: setValue(parameters.releaseMass, 1),
        stiffness: setValue(parameters.releaseStiffness, 80),
        damping: setValue(parameters.releaseDamping, 20)
      });
      this.releaseEase = hasSpring ? this.releaseSpring.ease : customEase || eases.outQuint;
      this.hasReleaseSpring = hasSpring;
      this.onGrab = parameters.onGrab || noop;
      this.onDrag = parameters.onDrag || noop;
      this.onRelease = parameters.onRelease || noop;
      this.onUpdate = parameters.onUpdate || noop;
      this.onSettle = parameters.onSettle || noop;
      this.onSnap = parameters.onSnap || noop;
      this.onResize = parameters.onResize || noop;
      this.onAfterResize = parameters.onAfterResize || noop;
      this.disabled = [0, 0];
      var animatableParams = {};
      if (modifier) animatableParams.modifier = modifier;
      if (isUnd(paramX) || paramX === true) {
        animatableParams[xProp] = 0;
      } else if (isObj(paramX)) {
        var paramXObject = paramX;
        var animatableXParams = {};
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
        var paramYObject = paramY;
        var animatableYParams = {};
        if (paramYObject.modifier) animatableYParams.modifier = paramYObject.modifier;
        if (paramYObject.composition) animatableYParams.composition = paramYObject.composition;
        animatableParams[yProp] = animatableYParams;
      } else if (paramY === false) {
        animatableParams[yProp] = 0;
        this.disabled[1] = 1;
      }
      this.animate = new Animatable(this.$target, animatableParams);
      this.xProp = xProp;
      this.yProp = yProp;
      this.destX = 0;
      this.destY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.progresses = [0, 0];
      this.scroll = {
        x: 0,
        y: 0
      };
      this.coords = [this.x, this.y, 0, 0];
      this.snapped = [0, 0];
      this.pointer = [0, 0, 0, 0];
      this.scrollView = [0, 0];
      this.dragArea = [0, 0, 0, 0];
      this.containerBounds = [-maxValue, maxValue, maxValue, -maxValue];
      this.scrollBounds = [0, 0, 0, 0];
      this.targetBounds = [0, 0, 0, 0];
      this.window = [0, 0];
      this.pointerVelocity = 0;
      this.pointerAngle = 0;
      this.velocity = 0;
      this.angle = 0;
      this.cursorStyles = null;
      this.triggerStyles = null;
      this.bodyStyles = null;
      this.targetStyles = null;
      this.transforms = new Transforms(this.$target);
      this.overshootCoords = {
        x: 0,
        y: 0
      };
      this.overshootTicker = new Timer({
        autoplay: false
      }, null, 0).init();
      this.updateTicker = new Timer({
        autoplay: false
      }, null, 0).init();
      this.overshootTicker.onUpdate = function () {
        _this3.updated = true;
        _this3.manual = true;
        if (!_this3.disabled[0]) _this3.animate[_this3.xProp](_this3.overshootCoords.x, 0);
        if (!_this3.disabled[1]) _this3.animate[_this3.yProp](_this3.overshootCoords.y, 0);
      };
      this.overshootTicker.onComplete = function () {
        _this3.manual = false;
        if (!_this3.disabled[0]) _this3.animate[_this3.xProp](_this3.overshootCoords.x, 0);
        if (!_this3.disabled[1]) _this3.animate[_this3.yProp](_this3.overshootCoords.y, 0);
      };
      this.updateTicker.onUpdate = function (self) {
        return _this3.update(self);
      };
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
      this.animate.animations[this.activeProp].onRender = function () {
        var hasUpdated = _this3.updated;
        var hasMoved = _this3.grabbed && hasUpdated;
        var hasReleased = !hasMoved && _this3.released;
        var x = _this3.x;
        var y = _this3.y;
        var dx = x - _this3.coords[2];
        var dy = y - _this3.coords[3];
        var dt = engine.deltaTime / globals.timeScale;
        var vMul = _this3.velocityMultiplier;
        var minV = _this3.minVelocity;
        var maxV = _this3.maxVelocity;
        _this3.deltaX = dx;
        _this3.deltaY = dy;
        _this3.coords[2] = x;
        _this3.coords[3] = y;
        _this3.progresses[0] = round(mapRange(x, _this3.containerBounds[3], _this3.containerBounds[1], 0, 1), globals.precision);
        _this3.progresses[1] = round(mapRange(y, _this3.containerBounds[0], _this3.containerBounds[2], 0, 1), globals.precision);
        _this3.velocity = round(clamp((dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0) * vMul, minV, maxV), 5);
        _this3.angle = Math.atan2(dy, dx);
        if (hasUpdated) {
          _this3.onUpdate(_this3);
        }
        if (!hasReleased) {
          _this3.updated = false;
        }
      };
      this.animate.animations[this.activeProp].onComplete = function () {
        if (!_this3.grabbed && _this3.released) {
          _this3.released = false;
        }
        if (!_this3.manual) {
          _this3.deltaX = 0;
          _this3.deltaY = 0;
          _this3.velocity = 0;
          _this3.onSettle(_this3);
        }
      };
      this.resizeTicker = new Timer({
        autoplay: false,
        duration: 150 * globals.timeScale,
        onComplete: function onComplete() {
          _this3.onResize(_this3);
          _this3.refresh();
          _this3.onAfterResize(_this3);
        }
      }).init();
      this.parameters = parameters;
      this.resizeObserver = new ResizeObserver(function () {
        if (_this3.initialized) {
          _this3.resizeTicker.restart();
        } else {
          _this3.initialized = true;
        }
      });
      this.enable();
      this.refresh();
      this.resizeObserver.observe(this.$container);
      if (!isObj(target)) this.resizeObserver.observe(this.$target);
    }
    _createClass(Draggable, [{
      key: "setX",
      value: function setX(x) {
        var muteUpdateCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (this.disabled[0]) return;
        var v = round(x, 5);
        this.manual = true;
        this.updated = !muteUpdateCallback;
        this.destX = v;
        this.snapped[0] = snap(v, this.snapX);
        this.animate[this.xProp](v, 0);
        this.manual = false;
        return this;
      }
    }, {
      key: "setY",
      value: function setY(y) {
        var muteUpdateCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (this.disabled[1]) return;
        var v = round(y, 5);
        this.manual = true;
        this.updated = !muteUpdateCallback;
        this.destY = v;
        this.snapped[1] = snap(v, this.snapY);
        this.animate[this.yProp](v, 0);
        this.manual = false;
        return this;
      }
    }, {
      key: "x",
      get: function get() {
        return round(this.animate[this.xProp](), globals.precision);
      },
      set: function set(x) {
        this.setX(x, false);
      }
    }, {
      key: "y",
      get: function get() {
        return round(this.animate[this.yProp](), globals.precision);
      },
      set: function set(y) {
        this.setY(y, false);
      }
    }, {
      key: "progressX",
      get: function get() {
        return this.progresses[0];
      },
      set: function set(x) {
        this.progresses[0] = x;
        this.setX(mapRange(x, 0, 1, this.containerBounds[3], this.containerBounds[1]), false);
      }
    }, {
      key: "progressY",
      get: function get() {
        return this.progresses[1];
      },
      set: function set(y) {
        this.progresses[1] = y;
        this.setY(mapRange(y, 0, 1, this.containerBounds[0], this.containerBounds[2]), false);
      }
    }, {
      key: "updateScrollCoords",
      value: function updateScrollCoords() {
        var sx = round(this.useWin ? win.scrollX : this.$container.scrollLeft, 0);
        var sy = round(this.useWin ? win.scrollY : this.$container.scrollTop, 0);
        var _this$containerPaddin = _slicedToArray(this.containerPadding, 4),
          cpt = _this$containerPaddin[0],
          cpr = _this$containerPaddin[1],
          cpb = _this$containerPaddin[2],
          cpl = _this$containerPaddin[3];
        var threshold = this.scrollThreshold;
        this.scroll.x = sx;
        this.scroll.y = sy;
        this.scrollBounds[0] = sy - this.targetBounds[0] + cpt - threshold;
        this.scrollBounds[1] = sx - this.targetBounds[1] - cpr + threshold;
        this.scrollBounds[2] = sy - this.targetBounds[2] - cpb + threshold;
        this.scrollBounds[3] = sx - this.targetBounds[3] + cpl - threshold;
      }
    }, {
      key: "updateBoundingValues",
      value: function updateBoundingValues() {
        var cx = this.x;
        var cy = this.y;
        var cx2 = this.coords[2];
        var cy2 = this.coords[3];
        this.coords[2] = 0;
        this.coords[3] = 0;
        this.setX(0, true);
        this.setY(0, true);
        this.transforms.remove();
        var iw = this.window[0] = win.innerWidth;
        var ih = this.window[1] = win.innerHeight;
        var uw = this.useWin;
        var sw = this.$container.scrollWidth;
        var sh = this.$container.scrollHeight;
        var fx = this.fixed;
        var transformContainerRect = this.$container.getBoundingClientRect();
        var _this$containerPaddin2 = _slicedToArray(this.containerPadding, 4),
          cpt = _this$containerPaddin2[0],
          cpr = _this$containerPaddin2[1],
          cpb = _this$containerPaddin2[2],
          cpl = _this$containerPaddin2[3];
        this.dragArea[0] = uw ? 0 : transformContainerRect.left;
        this.dragArea[1] = uw ? 0 : transformContainerRect.top;
        this.scrollView[0] = uw ? clamp(sw, iw, sw) : sw;
        this.scrollView[1] = uw ? clamp(sh, ih, sh) : sh;
        this.updateScrollCoords();
        var _this$$container$getB = this.$container.getBoundingClientRect(),
          width = _this$$container$getB.width,
          height = _this$$container$getB.height,
          left = _this$$container$getB.left,
          top = _this$$container$getB.top,
          right = _this$$container$getB.right,
          bottom = _this$$container$getB.bottom;
        this.dragArea[2] = round(uw ? clamp(width, iw, iw) : width, 0);
        this.dragArea[3] = round(uw ? clamp(height, ih, ih) : height, 0);
        this.canScroll = fx ? false : (sw > this.dragArea[2] + cpl - cpr || sh > this.dragArea[3] + cpt - cpb) && (!this.containerArray || this.containerArray && !isArr(this.containerArray)) && this.contained;
        if (this.contained) {
          var sx = this.scroll.x;
          var sy = this.scroll.y;
          var canScroll = this.canScroll;
          var targetRect = this.$target.getBoundingClientRect();
          var hiddenLeft = canScroll ? uw ? 0 : this.$container.scrollLeft : 0;
          var hiddenTop = canScroll ? uw ? 0 : this.$container.scrollTop : 0;
          var hiddenRight = canScroll ? this.scrollView[0] - hiddenLeft - width : 0;
          var hiddenBottom = canScroll ? this.scrollView[1] - hiddenTop - height : 0;
          this.targetBounds[0] = round(targetRect.top + sy - (uw ? 0 : top), 0);
          this.targetBounds[1] = round(targetRect.right + sx - (uw ? iw : right), 0);
          this.targetBounds[2] = round(targetRect.bottom + sy - (uw ? ih : bottom), 0);
          this.targetBounds[3] = round(targetRect.left + sx - (uw ? 0 : left), 0);
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
          this.progresses[0] = round(mapRange(cx, this.containerBounds[3], this.containerBounds[1], 0, 1), globals.precision) || 0;
          this.progresses[1] = round(mapRange(cy, this.containerBounds[0], this.containerBounds[2], 0, 1), globals.precision) || 0;
        }
        this.transforms.revert();
        this.coords[2] = cx2;
        this.coords[3] = cy2;
        this.setX(cx, true);
        this.setY(cy, true);
      }
    }, {
      key: "isOutOfBounds",
      value: function isOutOfBounds(bounds, x, y) {
        if (!this.contained) return 0;
        var _bounds = _slicedToArray(bounds, 4),
          bt = _bounds[0],
          br = _bounds[1],
          bb = _bounds[2],
          bl = _bounds[3];
        var _this$disabled = _slicedToArray(this.disabled, 2),
          dx = _this$disabled[0],
          dy = _this$disabled[1];
        var obx = !dx && x < bl || !dx && x > br;
        var oby = !dy && y < bt || !dy && y > bb;
        return obx && !oby ? 1 : !obx && oby ? 2 : obx && oby ? 3 : 0;
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var params = this.parameters;
        var paramX = params.x;
        var paramY = params.y;
        var container = parseDraggableFunctionParameter(params.container, this);
        var cp = parseDraggableFunctionParameter(params.containerPadding, this) || 0;
        var containerPadding = isArr(cp) ? cp : [cp, cp, cp, cp];
        var cx = this.x;
        var cy = this.y;
        var parsedCursorStyles = parseDraggableFunctionParameter(params.cursor, this);
        var cursorStyles = {
          onHover: 'grab',
          onGrab: 'grabbing'
        };
        if (parsedCursorStyles) {
          var onHover = (parsedCursorStyles).onHover,
            onGrab = (parsedCursorStyles).onGrab;
          if (onHover) cursorStyles.onHover = onHover;
          if (onGrab) cursorStyles.onGrab = onGrab;
        }
        this.containerArray = isArr(container) ? container : null;
        this.$container = container && !this.containerArray ? parseTargets(container)[0] : doc.body;
        this.useWin = this.$container === doc.body;
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
        this.cursor = parsedCursorStyles === false ? false : cursorStyles;
        this.updateBoundingValues();
        var _this$containerBounds = _slicedToArray(this.containerBounds, 4),
          bt = _this$containerBounds[0],
          br = _this$containerBounds[1],
          bb = _this$containerBounds[2],
          bl = _this$containerBounds[3];
        this.setX(clamp(cx, bl, br), true);
        this.setY(clamp(cy, bt, bb), true);
      }
    }, {
      key: "update",
      value: function update(timer) {
        this.updateScrollCoords();
        var _this$disabled2 = _slicedToArray(this.disabled, 2),
          nx = _this$disabled2[0],
          ny = _this$disabled2[1];
        if (this.canScroll) {
          var _this$containerPaddin3 = _slicedToArray(this.containerPadding, 4),
            cpt = _this$containerPaddin3[0],
            cpr = _this$containerPaddin3[1],
            cpb = _this$containerPaddin3[2],
            cpl = _this$containerPaddin3[3];
          var _this$scrollView = _slicedToArray(this.scrollView, 2),
            sw = _this$scrollView[0],
            sh = _this$scrollView[1];
          var daw = this.dragArea[2];
          var dah = this.dragArea[3];
          var csx = this.scroll.x;
          var csy = this.scroll.y;
          var nsw = this.$container.scrollWidth;
          var nsh = this.$container.scrollHeight;
          var csw = this.useWin ? clamp(nsw, this.window[0], nsw) : nsw;
          var csh = this.useWin ? clamp(nsh, this.window[1], nsh) : nsh;
          var swd = sw - csw;
          var shd = sh - csh;
          if (this.dragged && swd > 0) {
            this.coords[0] -= swd;
            this.scrollView[0] = csw;
          }
          if (this.dragged && shd > 0) {
            this.coords[1] -= shd;
            this.scrollView[1] = csh;
          }
          var s = this.scrollSpeed * 10;
          var threshold = this.scrollThreshold;
          var _this$coords = _slicedToArray(this.coords, 2),
            x = _this$coords[0],
            y = _this$coords[1];
          var _this$scrollBounds = _slicedToArray(this.scrollBounds, 4),
            st = _this$scrollBounds[0],
            sr = _this$scrollBounds[1],
            sb = _this$scrollBounds[2],
            sl = _this$scrollBounds[3];
          var t = round(clamp((y - st + cpt) / threshold, -1, 0) * s, 0);
          var r = round(clamp((x - sr - cpr) / threshold, 0, 1) * s, 0);
          var b = round(clamp((y - sb - cpb) / threshold, 0, 1) * s, 0);
          var l = round(clamp((x - sl + cpl) / threshold, -1, 0) * s, 0);
          if (t || b || l || r) {
            var scrollX = csx;
            var scrollY = csy;
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
        var _this$containerBounds2 = _slicedToArray(this.containerBounds, 4),
          ct = _this$containerBounds2[0],
          cr = _this$containerBounds2[1],
          cb = _this$containerBounds2[2],
          cl = _this$containerBounds2[3];
        var _this$pointer = _slicedToArray(this.pointer, 4),
          px = _this$pointer[0],
          py = _this$pointer[1],
          px2 = _this$pointer[2],
          py2 = _this$pointer[3];
        var dx = px - px2;
        var dy = py - py2;
        var dt = timer.deltaTime / globals.timeScale;
        var vMul = this.velocityMultiplier;
        var minV = this.minVelocity;
        var maxV = this.maxVelocity;
        var v = round(clamp((dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0) * vMul, minV, maxV), 5);
        this.pointerVelocity = v;
        this.pointerAngle = Math.atan2(dy, dx);
        this.coords[0] += dx * this.dragSpeed;
        this.coords[1] += dy * this.dragSpeed;
        this.pointer[2] = px;
        this.pointer[3] = py;
        var _this$coords2 = _slicedToArray(this.coords, 2),
          cx = _this$coords2[0],
          cy = _this$coords2[1];
        var _this$snapped = _slicedToArray(this.snapped, 2),
          sx = _this$snapped[0],
          sy = _this$snapped[1];
        var cf = (1 - this.containerFriction) * this.dragSpeed;
        this.setX(cx > cr ? cr + (cx - cr) * cf : cx < cl ? cl + (cx - cl) * cf : cx, false);
        this.setY(cy > cb ? cb + (cy - cb) * cf : cy < ct ? ct + (cy - ct) * cf : cy, false);
        var _this$snapped2 = _slicedToArray(this.snapped, 2),
          nsx = _this$snapped2[0],
          nsy = _this$snapped2[1];
        if (nsx !== sx && this.snapX || nsy !== sy && this.snapY) {
          this.onSnap(this);
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        this.updateTicker.pause();
        this.overshootTicker.pause();
        for (var prop in this.animate.animations) this.animate.animations[prop].pause();
        remove(this, null, 'x');
        remove(this, null, 'y');
        remove(this, null, 'progressX');
        remove(this, null, 'progressY');
        remove(this.scroll);
        remove(this.overshootCoords);
        return this;
      }
    }, {
      key: "scrollInView",
      value: function scrollInView(duration) {
        var _this4 = this;
        var gap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var ease = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : eases.inOutQuad;
        this.updateScrollCoords();
        var x = this.destX;
        var y = this.destY;
        var scroll = this.scroll;
        var scrollBounds = this.scrollBounds;
        var canScroll = this.canScroll;
        if (!this.containerArray && this.isOutOfBounds(scrollBounds, x, y)) {
          var _scrollBounds = _slicedToArray(scrollBounds, 4),
            st = _scrollBounds[0],
            sr = _scrollBounds[1],
            sb = _scrollBounds[2],
            sl = _scrollBounds[3];
          var t = round(clamp(y - st, -maxValue, 0), 0);
          var r = round(clamp(x - sr, 0, maxValue), 0);
          var b = round(clamp(y - sb, 0, maxValue), 0);
          var l = round(clamp(x - sl, -maxValue, 0), 0);
          new Animation(scroll, {
            x: round(scroll.x + (l ? l - gap : r ? r + gap : 0), 0),
            y: round(scroll.y + (t ? t - gap : b ? b + gap : 0), 0),
            duration: isUnd(duration) ? 350 * globals.timeScale : duration,
            ease: ease,
            onUpdate: function onUpdate() {
              _this4.canScroll = false;
              _this4.$scrollContainer.scrollTo(scroll.x, scroll.y);
            }
          }).init().then(function () {
            _this4.canScroll = canScroll;
          });
        }
        return this;
      }
    }, {
      key: "handleHover",
      value: function handleHover() {
        if (this.isFinePointer && this.cursor && !this.cursorStyles) {
          this.cursorStyles = setTargetValues(this.$trigger, {
            cursor: this.cursor.onHover
          });
        }
      }
    }, {
      key: "animateInView",
      value: function animateInView(duration) {
        var gap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var ease = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : eases.inOutQuad;
        this.stop();
        this.updateBoundingValues();
        var x = this.x;
        var y = this.y;
        var _this$containerPaddin4 = _slicedToArray(this.containerPadding, 4),
          cpt = _this$containerPaddin4[0],
          cpr = _this$containerPaddin4[1],
          cpb = _this$containerPaddin4[2],
          cpl = _this$containerPaddin4[3];
        var bt = this.scroll.y - this.targetBounds[0] + cpt + gap;
        var br = this.scroll.x - this.targetBounds[1] - cpr - gap;
        var bb = this.scroll.y - this.targetBounds[2] - cpb - gap;
        var bl = this.scroll.x - this.targetBounds[3] + cpl + gap;
        var ob = this.isOutOfBounds([bt, br, bb, bl], x, y);
        if (ob) {
          var _this$disabled3 = _slicedToArray(this.disabled, 2),
            disabledX = _this$disabled3[0],
            disabledY = _this$disabled3[1];
          var destX = clamp(snap(x, this.snapX), bl, br);
          var destY = clamp(snap(y, this.snapY), bt, bb);
          var dur = isUnd(duration) ? 350 * globals.timeScale : duration;
          if (!disabledX && (ob === 1 || ob === 3)) this.animate[this.xProp](destX, dur, ease);
          if (!disabledY && (ob === 2 || ob === 3)) this.animate[this.yProp](destY, dur, ease);
        }
        return this;
      }
    }, {
      key: "handleDown",
      value: function handleDown(e) {
        var $eTarget = e.target;
        if (this.grabbed || $eTarget.type === 'range' || $eTarget[draggableSymbol] && $eTarget !== this.$trigger) return;
        this.grabbed = true;
        this.released = false;
        this.stop();
        this.updateBoundingValues();
        var _this$containerBounds3 = _slicedToArray(this.containerBounds, 4),
          ct = _this$containerBounds3[0],
          cr = _this$containerBounds3[1],
          cb = _this$containerBounds3[2],
          cl = _this$containerBounds3[3];
        var _this$transforms$norm = this.transforms.normalizePoint(e.clientX, e.clientY),
          x = _this$transforms$norm.x,
          y = _this$transforms$norm.y;
        var cf = (1 - this.containerFriction) * this.dragSpeed;
        var cx = this.x;
        var cy = this.y;
        this.coords[0] = this.coords[2] = !cf ? cx : cx > cr ? cr + (cx - cr) / cf : cx < cl ? cl + (cx - cl) / cf : cx;
        this.coords[1] = this.coords[3] = !cf ? cy : cy > cb ? cb + (cy - cb) / cf : cy < ct ? ct + (cy - ct) / cf : cy;
        this.pointer[2] = x;
        this.pointer[3] = y;
        this.deltaX = 0;
        this.deltaY = 0;
        this.pointerVelocity = 0;
        this.pointerAngle = 0;
        this.velocity = 0;
        this.angle = 0;
        if (this.targetStyles) {
          this.targetStyles.revert();
          this.targetStyles = null;
        }
        var z = getTargetValue(this.$target, 'zIndex', false);
        zIndex = (z > zIndex ? z : zIndex) + 1;
        this.targetStyles = setTargetValues(this.$target, {
          zIndex: zIndex
        });
        if (this.triggerStyles) {
          this.triggerStyles.revert();
          this.triggerStyles = null;
        }
        if (this.cursorStyles) {
          this.cursorStyles.revert();
          this.cursorStyles = null;
        }
        if (this.isFinePointer && this.cursor) {
          this.bodyStyles = setTargetValues(doc.body, {
            cursor: this.cursor.onGrab
          });
        }
        this.scrollInView(100, 0, eases.out(3));
        this.onGrab(this);
        doc.addEventListener('pointermove', this, false);
        doc.addEventListener('pointerup', this, false);
        doc.addEventListener('pointercancel', this, false);
        doc.addEventListener('selectstart', this, false);
      }
    }, {
      key: "handleMove",
      value: function handleMove(e) {
        if (!this.grabbed) return;
        e.preventDefault();
        if (!this.triggerStyles) {
          this.triggerStyles = setTargetValues(this.$trigger, {
            pointerEvents: 'none'
          });
        }
        var _this$transforms$norm2 = this.transforms.normalizePoint(e.clientX, e.clientY),
          x = _this$transforms$norm2.x,
          y = _this$transforms$norm2.y;
        this.updateTicker.play();
        this.pointer[0] = x;
        this.pointer[1] = y;
        this.dragged = true;
        this.released = false;
        this.onDrag(this);
      }
    }, {
      key: "handleUp",
      value: function handleUp() {
        if (!this.grabbed) return;
        this.updateTicker.pause();
        if (this.triggerStyles) {
          this.triggerStyles.revert();
          this.triggerStyles = null;
        }
        if (this.bodyStyles) {
          this.bodyStyles.revert();
          this.bodyStyles = null;
        }
        var _this$disabled4 = _slicedToArray(this.disabled, 2),
          disabledX = _this$disabled4[0],
          disabledY = _this$disabled4[1];
        var _this$containerBounds4 = _slicedToArray(this.containerBounds, 4),
          ct = _this$containerBounds4[0],
          cr = _this$containerBounds4[1],
          cb = _this$containerBounds4[2],
          cl = _this$containerBounds4[3];
        var _this$snapped3 = _slicedToArray(this.snapped, 2),
          sx = _this$snapped3[0],
          sy = _this$snapped3[1];
        var spring = this.releaseSpring;
        var releaseEase = this.releaseEase;
        var hasReleaseSpring = this.hasReleaseSpring;
        var overshootCoords = this.overshootCoords;
        var cx = this.x;
        var cy = this.y;
        var pv = this.pointerVelocity;
        var ds = pv * 200;
        var cf = (1 - this.containerFriction) * this.dragSpeed;
        var nx = cx + Math.cos(this.pointerAngle) * ds;
        var ny = cy + Math.sin(this.pointerAngle) * ds;
        var bx = nx > cr ? cr + (nx - cr) * cf : nx < cl ? cl + (nx - cl) * cf : nx;
        var by = ny > cb ? cb + (ny - cb) * cf : ny < ct ? ct + (ny - ct) * cf : ny;
        var dx = this.destX = clamp(snap(bx, this.snapX), cl, cr);
        var dy = this.destY = clamp(snap(by, this.snapY), ct, cb);
        var ob = this.isOutOfBounds(this.containerBounds, nx, ny);
        spring.velocity = round(pv, 5);
        overshootCoords.x = cx;
        overshootCoords.y = cy;
        var mass = spring.mass,
          stiffness = spring.stiffness,
          damping = spring.damping,
          duration = spring.duration,
          restDuration = spring.restDuration;
        var releaseDuration = cx === dx && cy === dy ? 0 : hasReleaseSpring ? duration : duration - restDuration * globals.timeScale;
        if (ob && cf && duration) {
          var composition = compositionTypes.blend;
          new Animation(overshootCoords, {
            x: bx,
            y: by,
            composition: composition,
            duration: hasReleaseSpring ? releaseDuration : releaseDuration * .65,
            ease: releaseEase
          }).init();
          new Animation(overshootCoords, {
            x: dx,
            y: dy,
            composition: composition,
            duration: releaseDuration,
            ease: hasReleaseSpring ? createSpring({
              mass: mass,
              stiffness: stiffness,
              damping: damping,
              velocity: 0
            }) : releaseEase
          }).init();
          this.overshootTicker.stretch(releaseDuration).restart();
        } else {
          if (!disabledX) this.animate[this.xProp](dx, releaseDuration, releaseEase);
          if (!disabledY) this.animate[this.yProp](dy, releaseDuration, releaseEase);
        }
        this.scrollInView(releaseDuration, this.scrollThreshold, releaseEase);
        var hasSnapped = false;
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
        this.updated = true;
        this.released = true;
        this.onRelease(this);
        doc.removeEventListener('pointermove', this);
        doc.removeEventListener('pointerup', this);
        doc.removeEventListener('pointercancel', this);
        doc.removeEventListener('selectstart', this);
        doc.removeEventListener('selectionchange', this);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.stop();
        this.resizeTicker.pause();
        this.grabbed = false;
        this.dragged = false;
        this.updated = false;
        this.released = false;
        this.canScroll = false;
        this.setX(0, true);
        this.setY(0, true);
        this.coords[0] = 0;
        this.coords[1] = 0;
        this.pointer[0] = 0;
        this.pointer[1] = 0;
        this.pointer[2] = 0;
        this.pointer[3] = 0;
        this.pointerVelocity = 0;
        this.pointerAngle = 0;
        this.velocity = 0;
        this.angle = 0;
        return this;
      }
    }, {
      key: "enable",
      value: function enable() {
        if (!this.enabled) {
          this.enabled = true;
          this.$trigger[draggableSymbol] = true;
          this.$target.classList.remove('is-disabled');
          this.touchActionStyles = setTargetValues(this.$trigger, {
            touchAction: this.disabled[0] ? 'pan-x' : this.disabled[1] ? 'pan-y' : 'none'
          });
          this.$trigger.addEventListener('pointerdown', this);
          this.$trigger.addEventListener('mouseenter', this);
        }
        return this;
      }
    }, {
      key: "disable",
      value: function disable() {
        this.enabled = false;
        this.grabbed = false;
        this.dragged = false;
        this.updated = false;
        this.released = false;
        this.canScroll = false;
        this.$trigger[draggableSymbol] = false;
        this.touchActionStyles.revert();
        if (this.cursorStyles) {
          this.cursorStyles.revert();
          this.cursorStyles = null;
        }
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
        this.stop();
        this.$target.classList.add('is-disabled');
        this.$trigger.removeEventListener('pointerdown', this);
        this.$trigger.removeEventListener('mouseenter', this);
        doc.removeEventListener('pointermove', this);
        doc.removeEventListener('pointerup', this);
        doc.removeEventListener('pointercancel', this);
        doc.removeEventListener('selectstart', this);
        return this;
      }
    }, {
      key: "revert",
      value: function revert() {
        this.reset();
        this.disable();
        this.$target.classList.remove('is-disabled');
        this.updateTicker.revert();
        this.overshootTicker.revert();
        this.resizeTicker.revert();
        return this;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
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
          case 'pointercancel':
            this.handleUp();
            break;
          case 'mouseenter':
            this.handleHover();
            break;
          case 'selectstart':
            e.preventDefault();
            break;
        }
      }
    }]);
    return Draggable;
  }();
  var createDraggable = function createDraggable(target, parameters) {
    return new Draggable(target, parameters);
  };

  var Scope = function () {
    function Scope() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Scope);
      if (globals.scope) globals.scope.revertibles.push(this);
      var parsedRoot = parseTargets(parameters.root);
      var scopeDefaults = parameters.defaults;
      var globalDefault = globals.defaults;
      var mediaQueries = parameters.mediaQueries;
      this.defaults = scopeDefaults ? mergeObjects(scopeDefaults, globalDefault) : globalDefault;
      this.root = parsedRoot[0] || doc;
      this.constructors = [];
      this.revertConstructors = [];
      this.revertibles = [];
      this.methods = {};
      this.matches = {};
      this.mediaQueryLists = {};
      this.data = {};
      if (mediaQueries) {
        for (var mq in mediaQueries) {
          var _mq = win.matchMedia(mediaQueries[mq]);
          this.mediaQueryLists[mq] = _mq;
          _mq.addEventListener('change', this);
        }
      }
    }
    _createClass(Scope, [{
      key: "execute",
      value: function execute(cb) {
        var activeScope = globals.scope;
        var activeRoot = globals.root;
        var activeDefaults = globals.defaults;
        globals.scope = this;
        globals.root = this.root;
        globals.defaults = this.defaults;
        var mqs = this.mediaQueryLists;
        for (var mq in mqs) this.matches[mq] = mqs[mq].matches;
        var returned = cb(this);
        globals.scope = activeScope;
        globals.root = activeRoot;
        globals.defaults = activeDefaults;
        return returned;
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var _this = this;
        this.execute(function () {
          var i = _this.revertibles.length;
          var y = _this.revertConstructors.length;
          while (i--) _this.revertibles[i].revert();
          while (y--) _this.revertConstructors[y](_this);
          _this.revertibles.length = 0;
          _this.revertConstructors.length = 0;
          _this.constructors.forEach(function (constructor) {
            var revertConstructor = constructor(_this);
            if (revertConstructor) {
              _this.revertConstructors.push(revertConstructor);
            }
          });
        });
        return this;
      }
    }, {
      key: "add",
      value: function add(a1, a2) {
        var _this2 = this;
        if (isFnc(a1)) {
          var _constructor = a1;
          this.constructors.push(_constructor);
          this.execute(function () {
            var revertConstructor = _constructor(_this2);
            if (revertConstructor) {
              _this2.revertConstructors.push(revertConstructor);
            }
          });
        } else {
          this.methods[(a1)] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            return _this2.execute(function () {
              return a2.apply(void 0, args);
            });
          };
        }
        return this;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
        switch (e.type) {
          case 'change':
            this.refresh();
            break;
        }
      }
    }, {
      key: "revert",
      value: function revert() {
        var revertibles = this.revertibles;
        var revertConstructors = this.revertConstructors;
        var mqs = this.mediaQueryLists;
        var i = revertibles.length;
        var y = revertConstructors.length;
        while (i--) revertibles[i].revert();
        while (y--) revertConstructors[y](this);
        for (var mq in mqs) mqs[mq].removeEventListener('change', this);
        revertibles.length = 0;
        revertConstructors.length = 0;
        this.constructors.length = 0;
        this.matches = {};
        this.methods = {};
        this.mediaQueryLists = {};
        this.data = {};
      }
    }]);
    return Scope;
  }();

  var createTimer = function createTimer(parameters) {
    return new Timer(parameters, null, 0).init();
  };
  var animate = function animate(targets, parameters) {
    return new Animation(targets, parameters, null, 0, false).init();
  };
  var createTimeline = function createTimeline(parameters) {
    return new Timeline(parameters).init();
  };
  var createAnimatable = function createAnimatable(targets, parameters) {
    return new Animatable(targets, parameters);
  };
  var createScope = function createScope(params) {
    return new Scope(params);
  };
  if (isBrowser) {
    if (!win.AnimeJS) win.AnimeJS = [];
    win.AnimeJS.push({
      version: '4.0.0-beta.102.2',
      engine: engine
    });
    doc.addEventListener('visibilitychange', function () {
      return engine.suspendWhenHidden ? doc.hidden ? engine.suspend() : engine.resume() : 0;
    });
  }

  exports.Animatable = Animatable;
  exports.Animation = Animation;
  exports.Clock = Clock;
  exports.Draggable = Draggable;
  exports.Engine = Engine;
  exports.Scope = Scope;
  exports.ScrollObserver = ScrollObserver;
  exports.Spring = Spring;
  exports.Timeline = Timeline;
  exports.Timer = Timer;
  exports.animate = animate;
  exports.createAnimatable = createAnimatable;
  exports.createDraggable = createDraggable;
  exports.createScope = createScope;
  exports.createSpring = createSpring;
  exports.createTimeline = createTimeline;
  exports.createTimer = createTimer;
  exports.eases = eases;
  exports.engine = engine;
  exports.onScroll = onScroll;
  exports.scrollContainers = scrollContainers;
  exports.stagger = stagger;
  exports.svg = svg;
  exports.utils = utils;

  return exports;

})({});
