/// <reference path='./types.js' />

import {
  globals,
} from './globals.js';

import {
  K,
  isSvgSymbol,
  morphPointsSymbol,
  proxyTargetSymbol,
} from './consts.js';

import {
  round,
  isSvg,
  atan2,
  PI,
  isFnc,
} from './helpers.js';

import {
  parseTargets
} from './targets.js';

/**
 * @param  {TargetsParam} path
 * @return {SVGGeometryElement|undefined}
 */
const getPath = path => {
  const parsedTargets = parseTargets(path);
  const $parsedSvg = /** @type {SVGGeometryElement} */(parsedTargets[0]);
  if (!$parsedSvg || !isSvg($parsedSvg)) return;
  return $parsedSvg;
}

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
}

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
}

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
}

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
}

// Check for valid SVG attribute

const cssReservedProperties = ['opacity', 'rotate', 'overflow', 'color'];

/**
 * @param  {Target} el
 * @param  {String} propertyName
 * @return {Boolean}
 */
export const isValidSVGAttribute = (el, propertyName) => {
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
}

export const svg = {
  morphTo,
  createMotionPath,
  createDrawable,
}
