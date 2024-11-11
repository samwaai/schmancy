/// <reference path='./types.js' />

import {
  globals,
} from './globals.js';

import {
  tweenTypes,
  valueTypes,
  tickModes,
  compositionTypes,
  emptyString,
  transformsFragmentStrings,
  transformsSymbol,
} from './consts.js';

import {
  now,
  clamp,
  round,
  interpolate,
  forEachChildren,
} from './helpers.js';

/**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {tickModes} tickMode
 * @return {Number}
 */
export const render = (tickable, time, muteCallbacks, internalRender, tickMode) => {

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
}

/**
 * @param  {Tickable} tickable
 * @param  {Number} time
 * @param  {Number} muteCallbacks
 * @param  {Number} internalRender
 * @param  {Number} tickMode
 * @return {void}
 */
export const tick = (tickable, time, muteCallbacks, internalRender, tickMode) => {
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
}
