import { i as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./provide-Disc6_zz.js";
import { t as n } from "./decorate-D_utPUsC.js";
import { t as r } from "./litElement.mixin-Mi8bar6B.js";
import "./mixins.js";
import { n as i } from "./sound.service-cdkw3Wkv.js";
import { n as a, t as o } from "./theme.events-Bw3mYjUA.js";
import "./theme.service-_qP5WvB9.js";
import "./theme.interface-Cyqv5XWY.js";
import { Observable as s, Subject as c, debounceTime as l, fromEvent as u, of as d, switchMap as f, takeUntil as p, tap as m } from "rxjs";
import { customElement as h, property as g, state as _ } from "lit/decorators.js";
import { css as v, html as y, unsafeCSS as b } from "lit";
import { when as x } from "lit/directives/when.js";
function S(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function C(e, t, n) {
	return (1 - n) * e + n * t;
}
function w(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function T(e) {
	return (e %= 360) < 0 && (e += 360), e;
}
function E(e) {
	return (e %= 360) < 0 && (e += 360), e;
}
function ee(e, t) {
	return 180 - Math.abs(Math.abs(e - t) - 180);
}
function te(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
var D = [
	[
		.41233895,
		.35762064,
		.18051042
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.01932141,
		.11916382,
		.95034478
	]
], ne = [
	[
		3.2413774792388685,
		-1.5376652402851851,
		-.49885366846268053
	],
	[
		-.9691452513005321,
		1.8758853451067872,
		.04156585616912061
	],
	[
		.05562093689691305,
		-.20395524564742123,
		1.0571799111220335
	]
], O = [
	95.047,
	100,
	108.883
];
function re(e, t, n) {
	return (255 << 24 | (255 & e) << 16 | (255 & t) << 8 | 255 & n) >>> 0;
}
function ie(e) {
	return re(ue(e[0]), ue(e[1]), ue(e[2]));
}
function ae(e) {
	return e >> 16 & 255;
}
function oe(e) {
	return e >> 8 & 255;
}
function se(e) {
	return 255 & e;
}
function ce(e) {
	let t = function(e) {
		return te([
			A(ae(e)),
			A(oe(e)),
			A(se(e))
		], D);
	}(e)[1];
	return 116 * de(t / 100) - 16;
}
function k(e) {
	return 100 * function(e) {
		let t = e * e * e;
		return t > .008856451679035631 ? t : (116 * e - 16) / 903.2962962962963;
	}((e + 16) / 116);
}
function le(e) {
	return 116 * de(e / 100) - 16;
}
function A(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : 100 * ((t + .055) / 1.055) ** 2.4;
}
function ue(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, r = 0, i = 255, (a = Math.round(255 * n)) < r ? r : a > i ? i : a;
	var r, i, a;
}
function de(e) {
	return e > 216 / 24389 ? e ** (1 / 3) : (24389 / 27 * e + 16) / 116;
}
var j = class e {
	static make(t = function() {
		return O;
	}(), n = 200 / Math.PI * k(50) / 100, r = 50, i = 2, a = !1) {
		let o = t, s = .401288 * o[0] + .650173 * o[1] + -.051461 * o[2], c = -.250268 * o[0] + 1.204414 * o[1] + .045854 * o[2], l = -.002079 * o[0] + .048952 * o[1] + .953127 * o[2], u = .8 + i / 10, d = u >= .9 ? C(.59, .69, 10 * (u - .9)) : C(.525, .59, 10 * (u - .8)), f = a ? 1 : u * (1 - 1 / 3.6 * Math.exp((-n - 42) / 92));
		f = f > 1 ? 1 : f < 0 ? 0 : f;
		let p = u, m = [
			100 / s * f + 1 - f,
			100 / c * f + 1 - f,
			100 / l * f + 1 - f
		], h = 1 / (5 * n + 1), g = h * h * h * h, _ = 1 - g, v = g * n + .1 * _ * _ * Math.cbrt(5 * n), y = k(r) / t[1], b = 1.48 + Math.sqrt(y), x = .725 / y ** .2, S = x, w = [
			(v * m[0] * s / 100) ** .42,
			(v * m[1] * c / 100) ** .42,
			(v * m[2] * l / 100) ** .42
		], T = [
			400 * w[0] / (w[0] + 27.13),
			400 * w[1] / (w[1] + 27.13),
			400 * w[2] / (w[2] + 27.13)
		];
		return new e(y, (2 * T[0] + T[1] + .05 * T[2]) * x, x, S, d, p, m, v, v ** .25, b);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
j.DEFAULT = j.make();
var M = class e {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(t) {
		return e.fromIntInViewingConditions(t, j.DEFAULT);
	}
	static fromIntInViewingConditions(t, n) {
		let r = (65280 & t) >> 8, i = 255 & t, a = A((16711680 & t) >> 16), o = A(r), s = A(i), c = .41233895 * a + .35762064 * o + .18051042 * s, l = .2126 * a + .7152 * o + .0722 * s, u = .01932141 * a + .11916382 * o + .95034478 * s, d = .401288 * c + .650173 * l - .051461 * u, f = -.250268 * c + 1.204414 * l + .045854 * u, p = -.002079 * c + .048952 * l + .953127 * u, m = n.rgbD[0] * d, h = n.rgbD[1] * f, g = n.rgbD[2] * p, _ = (n.fl * Math.abs(m) / 100) ** .42, v = (n.fl * Math.abs(h) / 100) ** .42, y = (n.fl * Math.abs(g) / 100) ** .42, b = 400 * S(m) * _ / (_ + 27.13), x = 400 * S(h) * v / (v + 27.13), C = 400 * S(g) * y / (y + 27.13), w = (11 * b + -12 * x + C) / 11, T = (b + x - 2 * C) / 9, ee = (20 * b + 20 * x + 21 * C) / 20, te = (40 * b + 20 * x + C) / 20, D = E(180 * Math.atan2(T, w) / Math.PI), ne = D * Math.PI / 180, O = 100 * (te * n.nbb / n.aw) ** +(n.c * n.z), re = 4 / n.c * Math.sqrt(O / 100) * (n.aw + 4) * n.fLRoot, ie = D < 20.14 ? D + 360 : D, ae = (5e4 / 13 * (.25 * (Math.cos(ie * Math.PI / 180 + 2) + 3.8)) * n.nc * n.ncb * Math.sqrt(w * w + T * T) / (ee + .305)) ** .9 * (1.64 - .29 ** n.n) ** .73, oe = ae * Math.sqrt(O / 100), se = oe * n.fLRoot, ce = 50 * Math.sqrt(ae * n.c / (n.aw + 4)), k = 1.7000000000000002 * O / (1 + .007 * O), le = 1 / .0228 * Math.log(1 + .0228 * se);
		return new e(D, oe, O, re, se, ce, k, le * Math.cos(ne), le * Math.sin(ne));
	}
	static fromJch(t, n, r) {
		return e.fromJchInViewingConditions(t, n, r, j.DEFAULT);
	}
	static fromJchInViewingConditions(t, n, r, i) {
		let a = 4 / i.c * Math.sqrt(t / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(t / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = 1.7000000000000002 * t / (1 + .007 * t), d = 1 / .0228 * Math.log(1 + .0228 * o);
		return new e(r, n, t, a, o, c, u, d * Math.cos(l), d * Math.sin(l));
	}
	static fromUcs(t, n, r) {
		return e.fromUcsInViewingConditions(t, n, r, j.DEFAULT);
	}
	static fromUcsInViewingConditions(t, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(.0228 * s) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = t / (1 - .007 * (t - 100));
		return e.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(j.DEFAULT);
	}
	viewed(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = S(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = S(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = S(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], C = v / e.rgbD[1], w = b / e.rgbD[2];
		return function(e, t, n) {
			let r = ne, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
			return re(ue(i), ue(a), ue(o));
		}(1.86206786 * x - 1.01125463 * C + .14918677 * w, .38752654 * x + .62144744 * C - .00897398 * w, -.0158415 * x - .03412294 * C + 1.04996444 * w);
	}
	static fromXyzInViewingConditions(t, n, r, i) {
		let a = .401288 * t + .650173 * n - .051461 * r, o = -.250268 * t + 1.204414 * n + .045854 * r, s = -.002079 * t + .048952 * n + .953127 * r, c = i.rgbD[0] * a, l = i.rgbD[1] * o, u = i.rgbD[2] * s, d = (i.fl * Math.abs(c) / 100) ** .42, f = (i.fl * Math.abs(l) / 100) ** .42, p = (i.fl * Math.abs(u) / 100) ** .42, m = 400 * S(c) * d / (d + 27.13), h = 400 * S(l) * f / (f + 27.13), g = 400 * S(u) * p / (p + 27.13), _ = (11 * m + -12 * h + g) / 11, v = (m + h - 2 * g) / 9, y = (20 * m + 20 * h + 21 * g) / 20, b = (40 * m + 20 * h + g) / 20, x = 180 * Math.atan2(v, _) / Math.PI, C = x < 0 ? x + 360 : x >= 360 ? x - 360 : x, w = C * Math.PI / 180, T = 100 * (b * i.nbb / i.aw) ** +(i.c * i.z), E = 4 / i.c * Math.sqrt(T / 100) * (i.aw + 4) * i.fLRoot, ee = C < 20.14 ? C + 360 : C, te = (5e4 / 13 * (1 / 4 * (Math.cos(ee * Math.PI / 180 + 2) + 3.8)) * i.nc * i.ncb * Math.sqrt(_ * _ + v * v) / (y + .305)) ** .9 * (1.64 - .29 ** i.n) ** .73, D = te * Math.sqrt(T / 100), ne = D * i.fLRoot, O = 50 * Math.sqrt(te * i.c / (i.aw + 4)), re = 1.7000000000000002 * T / (1 + .007 * T), ie = Math.log(1 + .0228 * ne) / .0228;
		return new e(C, D, T, E, ne, O, re, ie * Math.cos(w), ie * Math.sin(w));
	}
	xyzInViewingConditions(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = S(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = S(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = S(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], C = v / e.rgbD[1], w = b / e.rgbD[2];
		return [
			1.86206786 * x - 1.01125463 * C + .14918677 * w,
			.38752654 * x + .62144744 * C - .00897398 * w,
			-.0158415 * x - .03412294 * C + 1.04996444 * w
		];
	}
}, N = class e {
	static sanitizeRadians(e) {
		return (e + 8 * Math.PI) % (2 * Math.PI);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, 255 * n;
	}
	static chromaticAdaptation(e) {
		let t = Math.abs(e) ** .42;
		return 400 * S(e) * t / (t + 27.13);
	}
	static hueOf(t) {
		let n = te(t, e.SCALED_DISCOUNT_FROM_LINRGB), r = e.chromaticAdaptation(n[0]), i = e.chromaticAdaptation(n[1]), a = e.chromaticAdaptation(n[2]), o = (11 * r + -12 * i + a) / 11, s = (r + i - 2 * a) / 9;
		return Math.atan2(s, o);
	}
	static areInCyclicOrder(t, n, r) {
		return e.sanitizeRadians(n - t) < e.sanitizeRadians(r - t);
	}
	static intercept(e, t, n) {
		return (t - e) / (n - e);
	}
	static lerpPoint(e, t, n) {
		return [
			e[0] + (n[0] - e[0]) * t,
			e[1] + (n[1] - e[1]) * t,
			e[2] + (n[2] - e[2]) * t
		];
	}
	static setCoordinate(t, n, r, i) {
		let a = e.intercept(t[i], n, r[i]);
		return e.lerpPoint(t, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(t, n) {
		let r = e.Y_FROM_LINRGB[0], i = e.Y_FROM_LINRGB[1], a = e.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (t - n * i - c * a) / r;
			return e.isBounded(l) ? [
				l,
				n,
				c
			] : [
				-1,
				-1,
				-1
			];
		}
		if (n < 8) {
			let n = o, c = s, l = (t - c * r - n * a) / i;
			return e.isBounded(l) ? [
				c,
				l,
				n
			] : [
				-1,
				-1,
				-1
			];
		}
		{
			let n = o, c = s, l = (t - n * r - c * i) / a;
			return e.isBounded(l) ? [
				n,
				c,
				l
			] : [
				-1,
				-1,
				-1
			];
		}
	}
	static bisectToSegment(t, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = e.nthVertex(t, l);
			if (u[0] < 0) continue;
			let d = e.hueOf(u);
			s ? (c || e.areInCyclicOrder(a, d, o)) && (c = !1, e.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d)) : (r = u, i = u, a = d, o = d, s = !0);
		}
		return [r, i];
	}
	static midpoint(e, t) {
		return [
			(e[0] + t[0]) / 2,
			(e[1] + t[1]) / 2,
			(e[2] + t[2]) / 2
		];
	}
	static criticalPlaneBelow(e) {
		return Math.floor(e - .5);
	}
	static criticalPlaneAbove(e) {
		return Math.ceil(e - .5);
	}
	static bisectToLimit(t, n) {
		let r = e.bisectToSegment(t, n), i = r[0], a = e.hueOf(i), o = r[1];
		for (let t = 0; t < 3; t++) if (i[t] !== o[t]) {
			let r = -1, s = 255;
			i[t] < o[t] ? (r = e.criticalPlaneBelow(e.trueDelinearized(i[t])), s = e.criticalPlaneAbove(e.trueDelinearized(o[t]))) : (r = e.criticalPlaneAbove(e.trueDelinearized(i[t])), s = e.criticalPlaneBelow(e.trueDelinearized(o[t])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = e.CRITICAL_PLANES[c], u = e.setCoordinate(i, l, o, t), d = e.hueOf(u);
				e.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return e.midpoint(i, o);
	}
	static inverseChromaticAdaptation(e) {
		let t = Math.abs(e), n = Math.max(0, 27.13 * t / (400 - t));
		return S(e) * n ** (1 / .42);
	}
	static findResultByJ(t, n, r) {
		let i = 11 * Math.sqrt(r), a = j.DEFAULT, o = 1 / (1.64 - .29 ** a.n) ** .73, s = .25 * (Math.cos(t + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, c = Math.sin(t), l = Math.cos(t);
		for (let t = 0; t < 5; t++) {
			let u = i / 100, d = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(u)) * o) ** (1 / .9), f = a.aw * u ** (1 / a.c / a.z) / a.nbb, p = 23 * (f + .305) * d / (23 * s + 11 * d * l + 108 * d * c), m = p * l, h = p * c, g = (460 * f + 451 * m + 288 * h) / 1403, _ = (460 * f - 891 * m - 261 * h) / 1403, v = (460 * f - 220 * m - 6300 * h) / 1403, y = te([
				e.inverseChromaticAdaptation(g),
				e.inverseChromaticAdaptation(_),
				e.inverseChromaticAdaptation(v)
			], e.LINRGB_FROM_SCALED_DISCOUNT);
			if (y[0] < 0 || y[1] < 0 || y[2] < 0) return 0;
			let b = e.Y_FROM_LINRGB[0], x = e.Y_FROM_LINRGB[1], S = e.Y_FROM_LINRGB[2], C = b * y[0] + x * y[1] + S * y[2];
			if (C <= 0) return 0;
			if (t === 4 || Math.abs(C - r) < .002) return y[0] > 100.01 || y[1] > 100.01 || y[2] > 100.01 ? 0 : ie(y);
			i -= (C - r) * i / (2 * C);
		}
		return 0;
	}
	static solveToInt(t, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return function(e) {
			let t = ue(k(e));
			return re(t, t, t);
		}(r);
		let i = (t = E(t)) / 180 * Math.PI, a = k(r), o = e.findResultByJ(i, n, a);
		return o === 0 ? ie(e.bisectToLimit(a, i)) : o;
	}
	static solveToCam(t, n, r) {
		return M.fromInt(e.solveToInt(t, n, r));
	}
};
N.SCALED_DISCOUNT_FROM_LINRGB = [
	[
		.001200833568784504,
		.002389694492170889,
		.0002795742885861124
	],
	[
		.0005891086651375999,
		.0029785502573438758,
		.0003270666104008398
	],
	[
		.00010146692491640572,
		.0005364214359186694,
		.0032979401770712076
	]
], N.LINRGB_FROM_SCALED_DISCOUNT = [
	[
		1373.2198709594231,
		-1100.4251190754821,
		-7.278681089101213
	],
	[
		-271.815969077903,
		559.6580465940733,
		-32.46047482791194
	],
	[
		1.9622899599665666,
		-57.173814538844006,
		308.7233197812385
	]
], N.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], N.CRITICAL_PLANES = [
	.015176349177441876,
	.045529047532325624,
	.07588174588720938,
	.10623444424209313,
	.13658714259697685,
	.16693984095186062,
	.19729253930674434,
	.2276452376616281,
	.2579979360165119,
	.28835063437139563,
	.3188300904430532,
	.350925934958123,
	.3848314933096426,
	.42057480301049466,
	.458183274052838,
	.4976837250274023,
	.5391024159806381,
	.5824650784040898,
	.6277969426914107,
	.6751227633498623,
	.7244668422128921,
	.775853049866786,
	.829304845476233,
	.8848452951698498,
	.942497089126609,
	1.0022825574869039,
	1.0642236851973577,
	1.1283421258858297,
	1.1946592148522128,
	1.2631959812511864,
	1.3339731595349034,
	1.407011200216447,
	1.4823302800086415,
	1.5599503113873272,
	1.6398909516233677,
	1.7221716113234105,
	1.8068114625156377,
	1.8938294463134073,
	1.9832442801866852,
	2.075074464868551,
	2.1693382909216234,
	2.2660538449872063,
	2.36523901573795,
	2.4669114995532007,
	2.5710888059345764,
	2.6777882626779785,
	2.7870270208169257,
	2.898822059350997,
	3.0131901897720907,
	3.1301480604002863,
	3.2497121605402226,
	3.3718988244681087,
	3.4967242352587946,
	3.624204428461639,
	3.754355295633311,
	3.887192587735158,
	4.022731918402185,
	4.160988767090289,
	4.301978482107941,
	4.445716283538092,
	4.592217266055746,
	4.741496401646282,
	4.893568542229298,
	5.048448422192488,
	5.20615066083972,
	5.3666897647573375,
	5.5300801301023865,
	5.696336044816294,
	5.865471690767354,
	6.037501145825082,
	6.212438385869475,
	6.390297286737924,
	6.571091626112461,
	6.7548350853498045,
	6.941541251256611,
	7.131223617812143,
	7.323895587840543,
	7.5195704746346665,
	7.7182615035334345,
	7.919981813454504,
	8.124744458384042,
	8.332562408825165,
	8.543448553206703,
	8.757415699253682,
	8.974476575321063,
	9.194643831691977,
	9.417930041841839,
	9.644347703669503,
	9.873909240696694,
	10.106627003236781,
	10.342513269534024,
	10.58158024687427,
	10.8238400726681,
	11.069304815507364,
	11.317986476196008,
	11.569896988756009,
	11.825048221409341,
	12.083451977536606,
	12.345119996613247,
	12.610063955123938,
	12.878295467455942,
	13.149826086772048,
	13.42466730586372,
	13.702830557985108,
	13.984327217668513,
	14.269168601521828,
	14.55736596900856,
	14.848930523210871,
	15.143873411576273,
	15.44220572664832,
	15.743938506781891,
	16.04908273684337,
	16.35764934889634,
	16.66964922287304,
	16.985093187232053,
	17.30399201960269,
	17.62635644741625,
	17.95219714852476,
	18.281524751807332,
	18.614349837764564,
	18.95068293910138,
	19.290534541298456,
	19.633915083172692,
	19.98083495742689,
	20.331304511189067,
	20.685334046541502,
	21.042933821039977,
	21.404114048223256,
	21.76888489811322,
	22.137256497705877,
	22.50923893145328,
	22.884842241736916,
	23.264076429332462,
	23.6469514538663,
	24.033477234264016,
	24.42366364919083,
	24.817520537484558,
	25.21505769858089,
	25.61628489293138,
	26.021211842414342,
	26.429848230738664,
	26.842203703840827,
	27.258287870275353,
	27.678110301598522,
	28.10168053274597,
	28.529008062403893,
	28.96010235337422,
	29.39497283293396,
	29.83362889318845,
	30.276079891419332,
	30.722335150426627,
	31.172403958865512,
	31.62629557157785,
	32.08401920991837,
	32.54558406207592,
	33.010999283389665,
	33.4802739966603,
	33.953417292456834,
	34.430438229418264,
	34.911345834551085,
	35.39614910352207,
	35.88485700094671,
	36.37747846067349,
	36.87402238606382,
	37.37449765026789,
	37.87891309649659,
	38.38727753828926,
	38.89959975977785,
	39.41588851594697,
	39.93615253289054,
	40.460400508064545,
	40.98864111053629,
	41.520882981230194,
	42.05713473317016,
	42.597404951718396,
	43.141702194811224,
	43.6900349931913,
	44.24241185063697,
	44.798841244188324,
	45.35933162437017,
	45.92389141541209,
	46.49252901546552,
	47.065252796817916,
	47.64207110610409,
	48.22299226451468,
	48.808024568002054,
	49.3971762874833,
	49.9904556690408,
	50.587870934119984,
	51.189430279724725,
	51.79514187861014,
	52.40501387947288,
	53.0190544071392,
	53.637271562750364,
	54.259673423945976,
	54.88626804504493,
	55.517063457223934,
	56.15206766869424,
	56.79128866487574,
	57.43473440856916,
	58.08241284012621,
	58.734331877617365,
	59.39049941699807,
	60.05092333227251,
	60.715611475655585,
	61.38457167773311,
	62.057811747619894,
	62.7353394731159,
	63.417162620860914,
	64.10328893648692,
	64.79372614476921,
	65.48848194977529,
	66.18756403501224,
	66.89098006357258,
	67.59873767827808,
	68.31084450182222,
	69.02730813691093,
	69.74813616640164,
	70.47333615344107,
	71.20291564160104,
	71.93688215501312,
	72.67524319850172,
	73.41800625771542,
	74.16517879925733,
	74.9167682708136,
	75.67278210128072,
	76.43322770089146,
	77.1981124613393,
	77.96744375590167,
	78.74122893956174,
	79.51947534912904,
	80.30219030335869,
	81.08938110306934,
	81.88105503125999,
	82.67721935322541,
	83.4778813166706,
	84.28304815182372,
	85.09272707154808,
	85.90692527145302,
	86.72564993000343,
	87.54890820862819,
	88.3767072518277,
	89.2090541872801,
	90.04595612594655,
	90.88742016217518,
	91.73345337380438,
	92.58406282226491,
	93.43925555268066,
	94.29903859396902,
	95.16341895893969,
	96.03240364439274,
	96.9059996312159,
	97.78421388448044,
	98.6670533535366,
	99.55452497210776
];
var P = class e {
	static from(t, n, r) {
		return new e(N.solveToInt(t, n, r));
	}
	static fromInt(t) {
		return new e(t);
	}
	toInt() {
		return this.argb;
	}
	get hue() {
		return this.internalHue;
	}
	set hue(e) {
		this.setInternalState(N.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(N.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(N.solveToInt(this.internalHue, this.internalChroma, e));
	}
	setValue(e, t) {
		this[e] = t;
	}
	toString() {
		return `HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`;
	}
	static isBlue(e) {
		return e >= 250 && e < 270;
	}
	static isYellow(e) {
		return e >= 105 && e < 125;
	}
	static isCyan(e) {
		return e >= 170 && e < 207;
	}
	constructor(e) {
		this.argb = e;
		let t = M.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = ce(e), this.argb = e;
	}
	setInternalState(e) {
		let t = M.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = ce(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = M.fromInt(this.toInt()).xyzInViewingConditions(t), r = M.fromXyzInViewingConditions(n[0], n[1], n[2], j.make());
		return e.from(r.hue, r.chroma, le(n[1]));
	}
}, fe = class e {
	static harmonize(e, t) {
		let n = P.fromInt(e), r = P.fromInt(t), i = ee(n.hue, r.hue), a = Math.min(.5 * i, 15), o = E(n.hue + a * (s = n.hue, E(r.hue - s) <= 180 ? 1 : -1));
		var s;
		return P.from(o, n.chroma, n.tone).toInt();
	}
	static hctHue(t, n, r) {
		let i = e.cam16Ucs(t, n, r), a = M.fromInt(i), o = M.fromInt(t);
		return P.from(a.hue, o.chroma, ce(t)).toInt();
	}
	static cam16Ucs(e, t, n) {
		let r = M.fromInt(e), i = M.fromInt(t), a = r.jstar, o = r.astar, s = r.bstar, c = a + (i.jstar - a) * n, l = o + (i.astar - o) * n, u = s + (i.bstar - s) * n;
		return M.fromUcs(c, l, u).toInt();
	}
}, F = class e {
	static ratioOfTones(t, n) {
		return t = w(0, 100, t), n = w(0, 100, n), e.ratioOfYs(k(t), k(n));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t;
		return (n + 5) / ((n === t ? e : t) + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = k(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = le(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = k(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = le(i) - .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static lighterUnsafe(t, n) {
		let r = e.lighter(t, n);
		return r < 0 ? 100 : r;
	}
	static darkerUnsafe(t, n) {
		let r = e.darker(t, n);
		return r < 0 ? 0 : r;
	}
}, pe = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? P.from(t.hue, t.chroma, 70) : t;
	}
};
function I(e, t, n) {
	return function(e, t, n) {
		if (e.name !== n.name) throw Error(`Attempting to extend color ${e.name} with color ${n.name} of different name for spec version ${t}.`);
		if (e.isBackground !== n.isBackground) throw Error(`Attempting to extend color ${e.name} as a ${e.isBackground ? "background" : "foreground"} with color ${n.name} as a ${n.isBackground ? "background" : "foreground"} for spec version ${t}.`);
	}(e, t, n), L.fromPalette({
		name: e.name,
		palette: (r) => r.specVersion === t ? n.palette(r) : e.palette(r),
		tone: (r) => r.specVersion === t ? n.tone(r) : e.tone(r),
		isBackground: e.isBackground,
		chromaMultiplier: (r) => {
			let i = r.specVersion === t ? n.chromaMultiplier : e.chromaMultiplier;
			return i === void 0 ? 1 : i(r);
		},
		background: (r) => {
			let i = r.specVersion === t ? n.background : e.background;
			return i === void 0 ? void 0 : i(r);
		},
		secondBackground: (r) => {
			let i = r.specVersion === t ? n.secondBackground : e.secondBackground;
			return i === void 0 ? void 0 : i(r);
		},
		contrastCurve: (r) => {
			let i = r.specVersion === t ? n.contrastCurve : e.contrastCurve;
			return i === void 0 ? void 0 : i(r);
		},
		toneDeltaPair: (r) => {
			let i = r.specVersion === t ? n.toneDeltaPair : e.toneDeltaPair;
			return i === void 0 ? void 0 : i(r);
		}
	});
}
var L = class e {
	static fromPalette(t) {
		return new e(t.name ?? "", t.palette, t.tone ?? e.getInitialToneFromBackground(t.background), t.isBackground ?? !1, t.chromaMultiplier, t.background, t.secondBackground, t.contrastCurve, t.toneDeltaPair);
	}
	static getInitialToneFromBackground(e) {
		return e === void 0 ? (e) => 50 : (t) => e(t) ? e(t).getTone(t) : 50;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		if (this.name = e, this.palette = t, this.tone = n, this.isBackground = r, this.chromaMultiplier = i, this.background = a, this.secondBackground = o, this.contrastCurve = s, this.toneDeltaPair = c, this.hctCache = /* @__PURE__ */ new Map(), !a && o) throw Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);
		if (!a && s) throw Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);
		if (a && !s) throw Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`);
	}
	clone() {
		return e.fromPalette({
			name: this.name,
			palette: this.palette,
			tone: this.tone,
			isBackground: this.isBackground,
			chromaMultiplier: this.chromaMultiplier,
			background: this.background,
			secondBackground: this.secondBackground,
			contrastCurve: this.contrastCurve,
			toneDeltaPair: this.toneDeltaPair
		});
	}
	clearCache() {
		this.hctCache.clear();
	}
	getArgb(e) {
		return this.getHct(e).toInt();
	}
	getHct(e) {
		let t = this.hctCache.get(e);
		if (t != null) return t;
		let n = ge(e.specVersion).getHct(e, this);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, n), n;
	}
	getTone(e) {
		return ge(e.specVersion).getTone(e, this);
	}
	static foregroundTone(t, n) {
		let r = F.lighterUnsafe(t, n), i = F.darkerUnsafe(t, n), a = F.ratioOfTones(r, t), o = F.ratioOfTones(i, t);
		if (e.tonePrefersLightForeground(t)) {
			let e = Math.abs(a - o) < .1 && a < n && o < n;
			return a >= n || a >= o || e ? r : i;
		}
		return o >= n || o >= a ? i : r;
	}
	static tonePrefersLightForeground(e) {
		return Math.round(e) < 60;
	}
	static toneAllowsLightForeground(e) {
		return Math.round(e) <= 49;
	}
	static enableLightForeground(t) {
		return e.tonePrefersLightForeground(t) && !e.toneAllowsLightForeground(t) ? 49 : t;
	}
}, me = new class {
	getHct(e, t) {
		let n = t.getTone(e);
		return t.palette(e).getHct(n);
	}
	getTone(e, t) {
		let n = e.contrastLevel < 0, r = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (r) {
			let i = r.roleA, a = r.roleB, o = r.delta, s = r.polarity, c = r.stayTogether, l = s === "nearer" || s === "lighter" && !e.isDark || s === "darker" && e.isDark, u = l ? i : a, d = l ? a : i, f = t.name === u.name, p = e.isDark ? 1 : -1, m = u.tone(e), h = d.tone(e);
			if (t.background && u.contrastCurve && d.contrastCurve) {
				let r = t.background(e), i = u.contrastCurve(e), a = d.contrastCurve(e);
				if (r && i && a) {
					let t = r.getTone(e), o = i.get(e.contrastLevel), s = a.get(e.contrastLevel);
					F.ratioOfTones(t, m) < o && (m = L.foregroundTone(t, o)), F.ratioOfTones(t, h) < s && (h = L.foregroundTone(t, s)), n && (m = L.foregroundTone(t, o), h = L.foregroundTone(t, s));
				}
			}
			return (h - m) * p < o && (h = w(0, 100, m + o * p), (h - m) * p >= o || (m = w(0, 100, h - o * p))), 50 <= m && m < 60 ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : 50 <= h && h < 60 && (c ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : h = p > 0 ? 60 : 49), f ? m : h;
		}
		{
			let r = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return r;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (F.ratioOfTones(i, r) >= a || (r = L.foregroundTone(i, a)), n && (r = L.foregroundTone(i, a)), t.isBackground && 50 <= r && r < 60 && (r = F.ratioOfTones(49, i) >= a ? 49 : 60), t.secondBackground == null || t.secondBackground(e) === void 0) return r;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (F.ratioOfTones(u, r) >= a && F.ratioOfTones(d, r) >= a) return r;
			let f = F.lighter(u, a), p = F.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), L.tonePrefersLightForeground(c) || L.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}(), he = new class {
	getHct(e, t) {
		let n = t.palette(e), r = t.getTone(e), i = n.hue, a = n.chroma * (t.chromaMultiplier ? t.chromaMultiplier(e) : 1);
		return P.from(i, a, r);
	}
	getTone(e, t) {
		let n = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (n) {
			let r = n.roleA, i = n.roleB, a = n.polarity, o = n.constraint, s = a === "darker" || a === "relative_lighter" && e.isDark || a === "relative_darker" && !e.isDark ? -n.delta : n.delta, c = t.name === r.name, l = c ? i : r, u = (c ? r : i).tone(e), d = l.getTone(e), f = s * (c ? 1 : -1);
			if (o === "exact" ? u = w(0, 100, d + f) : o === "nearer" ? u = w(0, 100, f > 0 ? w(d, d + f, u) : w(d + f, d, u)) : o === "farther" && (u = f > 0 ? w(d + f, 100, u) : w(0, d + f, u)), t.background && t.contrastCurve) {
				let n = t.background(e), r = t.contrastCurve(e);
				if (n && r) {
					let t = n.getTone(e), i = r.get(e.contrastLevel);
					u = F.ratioOfTones(t, u) >= i && e.contrastLevel >= 0 ? u : L.foregroundTone(t, i);
				}
			}
			return t.isBackground && !t.name.endsWith("_fixed_dim") && (u = u >= 57 ? w(65, 100, u) : w(0, 49, u)), u;
		}
		{
			let n = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return n;
			let r = t.background(e).getTone(e), i = t.contrastCurve(e).get(e.contrastLevel);
			if (n = F.ratioOfTones(r, n) >= i && e.contrastLevel >= 0 ? n : L.foregroundTone(r, i), t.isBackground && !t.name.endsWith("_fixed_dim") && (n = n >= 57 ? w(65, 100, n) : w(0, 49, n)), t.secondBackground == null || t.secondBackground(e) === void 0) return n;
			let [a, o] = [t.background, t.secondBackground], [s, c] = [a(e).getTone(e), o(e).getTone(e)], [l, u] = [Math.max(s, c), Math.min(s, c)];
			if (F.ratioOfTones(l, n) >= i && F.ratioOfTones(u, n) >= i) return n;
			let d = F.lighter(l, i), f = F.darker(u, i), p = [];
			return d !== -1 && p.push(d), f !== -1 && p.push(f), L.tonePrefersLightForeground(s) || L.tonePrefersLightForeground(c) ? d < 0 ? 100 : d : p.length === 1 ? p[0] : f < 0 ? 0 : f;
		}
	}
}();
function ge(e) {
	return e === "2025" ? he : me;
}
var R, z = class e {
	static fromInt(t) {
		let n = P.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		return new e(t, n, new _e(t, n).create());
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = e == 99 && P.isYellow(this.hue) ? this.averageArgb(this.tone(98), this.tone(100)) : P.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return P.fromInt(this.tone(e));
	}
	averageArgb(e, t) {
		let n = e >>> 16 & 255, r = e >>> 8 & 255, i = 255 & e, a = t >>> 16 & 255, o = t >>> 8 & 255, s = 255 & t;
		return (255 << 24 | (255 & Math.round((n + a) / 2)) << 16 | (255 & Math.round((r + o) / 2)) << 8 | 255 & Math.round((i + s) / 2)) >>> 0;
	}
}, _e = class {
	constructor(e, t) {
		this.hue = e, this.requestedChroma = t, this.chromaCache = /* @__PURE__ */ new Map(), this.maxChromaValue = 200;
	}
	create() {
		let e = 0, t = 100;
		for (; e < t;) {
			let n = Math.floor((e + t) / 2), r = this.maxChroma(n) < this.maxChroma(n + 1);
			if (this.maxChroma(n) >= this.requestedChroma - .01) if (Math.abs(e - 50) < Math.abs(t - 50)) t = n;
			else {
				if (e === n) return P.from(this.hue, this.requestedChroma, e);
				e = n;
			}
			else r ? e = n + 1 : t = n;
		}
		return P.from(this.hue, this.requestedChroma, e);
	}
	maxChroma(e) {
		if (this.chromaCache.has(e)) return this.chromaCache.get(e);
		let t = P.from(this.hue, this.maxChromaValue, e).chroma;
		return this.chromaCache.set(e, t), t;
	}
}, ve = class e {
	constructor(e) {
		this.input = e, this.hctsByTempCache = [], this.hctsByHueCache = [], this.tempsByHctCache = /* @__PURE__ */ new Map(), this.inputRelativeTemperatureCache = -1, this.complementCache = null;
	}
	get hctsByTemp() {
		if (this.hctsByTempCache.length > 0) return this.hctsByTempCache;
		let e = this.hctsByHue.concat([this.input]), t = this.tempsByHct;
		return e.sort((e, n) => t.get(e) - t.get(n)), this.hctsByTempCache = e, e;
	}
	get warmest() {
		return this.hctsByTemp[this.hctsByTemp.length - 1];
	}
	get coldest() {
		return this.hctsByTemp[0];
	}
	analogous(e = 5, t = 12) {
		let n = Math.round(this.input.hue), r = this.hctsByHue[n], i = this.relativeTemperature(r), a = [r], o = 0;
		for (let e = 0; e < 360; e++) {
			let t = T(n + e), r = this.hctsByHue[t], a = this.relativeTemperature(r), s = Math.abs(a - i);
			i = a, o += s;
		}
		let s = 1, c = o / t, l = 0;
		for (i = this.relativeTemperature(r); a.length < t;) {
			let e = T(n + s), r = this.hctsByHue[e], o = this.relativeTemperature(r);
			l += Math.abs(o - i);
			let u = l >= a.length * c, d = 1;
			for (; u && a.length < t;) a.push(r), u = l >= (a.length + d) * c, d++;
			if (i = o, s++, s > 360) {
				for (; a.length < t;) a.push(r);
				break;
			}
		}
		let u = [this.input], d = Math.floor((e - 1) / 2);
		for (let e = 1; e < d + 1; e++) {
			let t = 0 - e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.splice(0, 0, a[t]);
		}
		let f = e - d - 1;
		for (let e = 1; e < f + 1; e++) {
			let t = e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.push(a[t]);
		}
		return u;
	}
	get complement() {
		if (this.complementCache != null) return this.complementCache;
		let t = this.coldest.hue, n = this.tempsByHct.get(this.coldest), r = this.warmest.hue, i = this.tempsByHct.get(this.warmest) - n, a = e.isBetween(this.input.hue, t, r), o = a ? r : t, s = a ? t : r, c = 1e3, l = this.hctsByHue[Math.round(this.input.hue)], u = 1 - this.inputRelativeTemperature;
		for (let t = 0; t <= 360; t += 1) {
			let r = E(o + 1 * t);
			if (!e.isBetween(r, o, s)) continue;
			let a = this.hctsByHue[Math.round(r)], d = (this.tempsByHct.get(a) - n) / i, f = Math.abs(u - d);
			f < c && (c = f, l = a);
		}
		return this.complementCache = l, this.complementCache;
	}
	relativeTemperature(e) {
		let t = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest), n = this.tempsByHct.get(e) - this.tempsByHct.get(this.coldest);
		return t === 0 ? .5 : n / t;
	}
	get inputRelativeTemperature() {
		return this.inputRelativeTemperatureCache >= 0 || (this.inputRelativeTemperatureCache = this.relativeTemperature(this.input)), this.inputRelativeTemperatureCache;
	}
	get tempsByHct() {
		if (this.tempsByHctCache.size > 0) return this.tempsByHctCache;
		let t = this.hctsByHue.concat([this.input]), n = /* @__PURE__ */ new Map();
		for (let r of t) n.set(r, e.rawTemperature(r));
		return this.tempsByHctCache = n, n;
	}
	get hctsByHue() {
		if (this.hctsByHueCache.length > 0) return this.hctsByHueCache;
		let e = [];
		for (let t = 0; t <= 360; t += 1) {
			let n = P.from(t, this.input.chroma, this.input.tone);
			e.push(n);
		}
		return this.hctsByHueCache = e, this.hctsByHueCache;
	}
	static isBetween(e, t, n) {
		return t < n ? t <= e && e <= n : t <= e || e <= n;
	}
	static rawTemperature(e) {
		let t = function(e) {
			let t = A(ae(e)), n = A(oe(e)), r = A(se(e)), i = D, a = i[0][0] * t + i[0][1] * n + i[0][2] * r, o = i[1][0] * t + i[1][1] * n + i[1][2] * r, s = i[2][0] * t + i[2][1] * n + i[2][2] * r, c = o / O[1], l = s / O[2], u = de(a / O[0]), d = de(c);
			return [
				116 * d - 16,
				500 * (u - d),
				200 * (d - de(l))
			];
		}(e.toInt()), n = E(180 * Math.atan2(t[2], t[1]) / Math.PI);
		return .02 * Math.sqrt(t[1] * t[1] + t[2] * t[2]) ** 1.07 * Math.cos(E(n - 50) * Math.PI / 180) - .5;
	}
}, B = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	get(e) {
		return e <= -1 ? this.low : e < 0 ? C(this.low, this.normal, (e - -1) / 1) : e < .5 ? C(this.normal, this.medium, (e - 0) / .5) : e < 1 ? C(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, V = class {
	constructor(e, t, n, r, i, a) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i, this.constraint = a, this.constraint = a ?? "exact";
	}
};
function ye(e) {
	return e.variant === R.FIDELITY || e.variant === R.CONTENT;
}
function H(e) {
	return e.variant === R.MONOCHROME;
}
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD";
})(R ||= {});
var be = class {
	primaryPaletteKeyColor() {
		return L.fromPalette({
			name: "primary_palette_key_color",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.primaryPalette.keyColor.tone
		});
	}
	secondaryPaletteKeyColor() {
		return L.fromPalette({
			name: "secondary_palette_key_color",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.secondaryPalette.keyColor.tone
		});
	}
	tertiaryPaletteKeyColor() {
		return L.fromPalette({
			name: "tertiary_palette_key_color",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.tertiaryPalette.keyColor.tone
		});
	}
	neutralPaletteKeyColor() {
		return L.fromPalette({
			name: "neutral_palette_key_color",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.neutralPalette.keyColor.tone
		});
	}
	neutralVariantPaletteKeyColor() {
		return L.fromPalette({
			name: "neutral_variant_palette_key_color",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.neutralVariantPalette.keyColor.tone
		});
	}
	errorPaletteKeyColor() {
		return L.fromPalette({
			name: "error_palette_key_color",
			palette: (e) => e.errorPalette,
			tone: (e) => e.errorPalette.keyColor.tone
		});
	}
	background() {
		return L.fromPalette({
			name: "background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	onBackground() {
		return L.fromPalette({
			name: "on_background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.background(),
			contrastCurve: (e) => new B(3, 3, 4.5, 7)
		});
	}
	surface() {
		return L.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	surfaceDim() {
		return L.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : new B(87, 87, 80, 75).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceBright() {
		return L.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(24, 24, 29, 34).get(e.contrastLevel) : 98,
			isBackground: !0
		});
	}
	surfaceContainerLowest() {
		return L.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(4, 4, 2, 0).get(e.contrastLevel) : 100,
			isBackground: !0
		});
	}
	surfaceContainerLow() {
		return L.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(10, 10, 11, 12).get(e.contrastLevel) : new B(96, 96, 96, 95).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainer() {
		return L.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(12, 12, 16, 20).get(e.contrastLevel) : new B(94, 94, 92, 90).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHigh() {
		return L.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(17, 17, 21, 25).get(e.contrastLevel) : new B(92, 92, 88, 85).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHighest() {
		return L.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(22, 22, 26, 30).get(e.contrastLevel) : new B(90, 90, 84, 80).get(e.contrastLevel),
			isBackground: !0
		});
	}
	onSurface() {
		return L.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	surfaceVariant() {
		return L.fromPalette({
			name: "surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0
		});
	}
	onSurfaceVariant() {
		return L.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 80 : 30,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	inverseSurface() {
		return L.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 20,
			isBackground: !0
		});
	}
	inverseOnSurface() {
		return L.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 20 : 95,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	outline() {
		return L.fromPalette({
			name: "outline",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 60 : 50,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1.5, 3, 4.5, 7)
		});
	}
	outlineVariant() {
		return L.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 80,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5)
		});
	}
	shadow() {
		return L.fromPalette({
			name: "shadow",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	scrim() {
		return L.fromPalette({
			name: "scrim",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	surfaceTint() {
		return L.fromPalette({
			name: "surface_tint",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0
		});
	}
	primary() {
		return L.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	primaryDim() {}
	onPrimary() {
		return L.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.primary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	primaryContainer() {
		return L.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => ye(e) ? e.sourceColorHct.tone : H(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	onPrimaryContainer() {
		return L.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => ye(e) ? L.foregroundTone(this.primaryContainer().tone(e), 4.5) : H(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 30,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	inversePrimary() {
		return L.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 40 : 80,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new B(3, 4.5, 7, 7)
		});
	}
	secondary() {
		return L.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	secondaryDim() {}
	onSecondary() {
		return L.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => H(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
			background: (e) => this.secondary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	secondaryContainer() {
		return L.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = e.isDark ? 30 : 90;
				return H(e) ? e.isDark ? 30 : 85 : ye(e) ? function(e, t, n, r) {
					let i = n, a = P.from(e, t, n);
					if (a.chroma < t) {
						let n = a.chroma;
						for (; a.chroma < t;) {
							i += r ? -1 : 1;
							let o = P.from(e, t, i);
							if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
							Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
						}
					}
					return i;
				}(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark) : t;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	onSecondaryContainer() {
		return L.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => H(e) ? e.isDark ? 90 : 10 : ye(e) ? L.foregroundTone(this.secondaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	tertiary() {
		return L.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	tertiaryDim() {}
	onTertiary() {
		return L.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	tertiaryContainer() {
		return L.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				if (H(e)) return e.isDark ? 60 : 49;
				if (!ye(e)) return e.isDark ? 30 : 90;
				let t = e.tertiaryPalette.getHct(e.sourceColorHct.tone);
				return pe.fixIfDisliked(t).tone;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	onTertiaryContainer() {
		return L.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? e.isDark ? 0 : 100 : ye(e) ? L.foregroundTone(this.tertiaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	error() {
		return L.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	errorDim() {}
	onError() {
		return L.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 20 : 100,
			background: (e) => this.error(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	errorContainer() {
		return L.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	onErrorContainer() {
		return L.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => H(e) ? e.isDark ? 90 : 10 : e.isDark ? 90 : 30,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	primaryFixed() {
		return L.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	primaryFixedDim() {
		return L.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	onPrimaryFixed() {
		return L.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? 100 : 10,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onPrimaryFixedVariant() {
		return L.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e) ? 90 : 30,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	secondaryFixed() {
		return L.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => H(e) ? 80 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	secondaryFixedDim() {
		return L.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => H(e) ? 70 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	onSecondaryFixed() {
		return L.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => 10,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onSecondaryFixedVariant() {
		return L.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			tone: (e) => H(e) ? 25 : 30,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	tertiaryFixed() {
		return L.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	tertiaryFixedDim() {
		return L.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	onTertiaryFixed() {
		return L.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? 100 : 10,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onTertiaryFixedVariant() {
		return L.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => H(e) ? 90 : 30,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	highestSurface(e) {
		return e.isDark ? this.surfaceBright() : this.surfaceDim();
	}
};
function U(e, t = 0, n = 100, r = 1) {
	return w(t, n, xe(e.hue, e.chroma * r, 100, !0));
}
function W(e, t = 0, n = 100) {
	return w(t, n, xe(e.hue, e.chroma, 0, !1));
}
function xe(e, t, n, r) {
	let i = n, a = P.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = P.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function G(e) {
	return e === 1.5 ? new B(1.5, 1.5, 3, 5.5) : e === 3 ? new B(3, 3, 4.5, 7) : e === 4.5 ? new B(4.5, 4.5, 7, 11) : e === 6 ? new B(6, 6, 7, 11) : e === 7 ? new B(7, 7, 11, 21) : e === 9 ? new B(9, 9, 11, 21) : e === 11 ? new B(11, 11, 21, 21) : e === 21 ? new B(21, 21, 21, 21) : new B(e, e, 7, 21);
}
var K = class e {
	constructor() {
		this.allColors = [
			this.background(),
			this.onBackground(),
			this.surface(),
			this.surfaceDim(),
			this.surfaceBright(),
			this.surfaceContainerLowest(),
			this.surfaceContainerLow(),
			this.surfaceContainer(),
			this.surfaceContainerHigh(),
			this.surfaceContainerHighest(),
			this.onSurface(),
			this.onSurfaceVariant(),
			this.outline(),
			this.outlineVariant(),
			this.inverseSurface(),
			this.inverseOnSurface(),
			this.primary(),
			this.primaryDim(),
			this.onPrimary(),
			this.primaryContainer(),
			this.onPrimaryContainer(),
			this.primaryFixed(),
			this.primaryFixedDim(),
			this.onPrimaryFixed(),
			this.onPrimaryFixedVariant(),
			this.inversePrimary(),
			this.secondary(),
			this.secondaryDim(),
			this.onSecondary(),
			this.secondaryContainer(),
			this.onSecondaryContainer(),
			this.secondaryFixed(),
			this.secondaryFixedDim(),
			this.onSecondaryFixed(),
			this.onSecondaryFixedVariant(),
			this.tertiary(),
			this.tertiaryDim(),
			this.onTertiary(),
			this.tertiaryContainer(),
			this.onTertiaryContainer(),
			this.tertiaryFixed(),
			this.tertiaryFixedDim(),
			this.onTertiaryFixed(),
			this.onTertiaryFixedVariant(),
			this.error(),
			this.errorDim(),
			this.onError(),
			this.errorContainer(),
			this.onErrorContainer()
		].filter((e) => e !== void 0);
	}
	highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
	primaryPaletteKeyColor() {
		return e.colorSpec.primaryPaletteKeyColor();
	}
	secondaryPaletteKeyColor() {
		return e.colorSpec.secondaryPaletteKeyColor();
	}
	tertiaryPaletteKeyColor() {
		return e.colorSpec.tertiaryPaletteKeyColor();
	}
	neutralPaletteKeyColor() {
		return e.colorSpec.neutralPaletteKeyColor();
	}
	neutralVariantPaletteKeyColor() {
		return e.colorSpec.neutralVariantPaletteKeyColor();
	}
	errorPaletteKeyColor() {
		return e.colorSpec.errorPaletteKeyColor();
	}
	background() {
		return e.colorSpec.background();
	}
	onBackground() {
		return e.colorSpec.onBackground();
	}
	surface() {
		return e.colorSpec.surface();
	}
	surfaceDim() {
		return e.colorSpec.surfaceDim();
	}
	surfaceBright() {
		return e.colorSpec.surfaceBright();
	}
	surfaceContainerLowest() {
		return e.colorSpec.surfaceContainerLowest();
	}
	surfaceContainerLow() {
		return e.colorSpec.surfaceContainerLow();
	}
	surfaceContainer() {
		return e.colorSpec.surfaceContainer();
	}
	surfaceContainerHigh() {
		return e.colorSpec.surfaceContainerHigh();
	}
	surfaceContainerHighest() {
		return e.colorSpec.surfaceContainerHighest();
	}
	onSurface() {
		return e.colorSpec.onSurface();
	}
	surfaceVariant() {
		return e.colorSpec.surfaceVariant();
	}
	onSurfaceVariant() {
		return e.colorSpec.onSurfaceVariant();
	}
	outline() {
		return e.colorSpec.outline();
	}
	outlineVariant() {
		return e.colorSpec.outlineVariant();
	}
	inverseSurface() {
		return e.colorSpec.inverseSurface();
	}
	inverseOnSurface() {
		return e.colorSpec.inverseOnSurface();
	}
	shadow() {
		return e.colorSpec.shadow();
	}
	scrim() {
		return e.colorSpec.scrim();
	}
	surfaceTint() {
		return e.colorSpec.surfaceTint();
	}
	primary() {
		return e.colorSpec.primary();
	}
	primaryDim() {
		return e.colorSpec.primaryDim();
	}
	onPrimary() {
		return e.colorSpec.onPrimary();
	}
	primaryContainer() {
		return e.colorSpec.primaryContainer();
	}
	onPrimaryContainer() {
		return e.colorSpec.onPrimaryContainer();
	}
	inversePrimary() {
		return e.colorSpec.inversePrimary();
	}
	primaryFixed() {
		return e.colorSpec.primaryFixed();
	}
	primaryFixedDim() {
		return e.colorSpec.primaryFixedDim();
	}
	onPrimaryFixed() {
		return e.colorSpec.onPrimaryFixed();
	}
	onPrimaryFixedVariant() {
		return e.colorSpec.onPrimaryFixedVariant();
	}
	secondary() {
		return e.colorSpec.secondary();
	}
	secondaryDim() {
		return e.colorSpec.secondaryDim();
	}
	onSecondary() {
		return e.colorSpec.onSecondary();
	}
	secondaryContainer() {
		return e.colorSpec.secondaryContainer();
	}
	onSecondaryContainer() {
		return e.colorSpec.onSecondaryContainer();
	}
	secondaryFixed() {
		return e.colorSpec.secondaryFixed();
	}
	secondaryFixedDim() {
		return e.colorSpec.secondaryFixedDim();
	}
	onSecondaryFixed() {
		return e.colorSpec.onSecondaryFixed();
	}
	onSecondaryFixedVariant() {
		return e.colorSpec.onSecondaryFixedVariant();
	}
	tertiary() {
		return e.colorSpec.tertiary();
	}
	tertiaryDim() {
		return e.colorSpec.tertiaryDim();
	}
	onTertiary() {
		return e.colorSpec.onTertiary();
	}
	tertiaryContainer() {
		return e.colorSpec.tertiaryContainer();
	}
	onTertiaryContainer() {
		return e.colorSpec.onTertiaryContainer();
	}
	tertiaryFixed() {
		return e.colorSpec.tertiaryFixed();
	}
	tertiaryFixedDim() {
		return e.colorSpec.tertiaryFixedDim();
	}
	onTertiaryFixed() {
		return e.colorSpec.onTertiaryFixed();
	}
	onTertiaryFixedVariant() {
		return e.colorSpec.onTertiaryFixedVariant();
	}
	error() {
		return e.colorSpec.error();
	}
	errorDim() {
		return e.colorSpec.errorDim();
	}
	onError() {
		return e.colorSpec.onError();
	}
	errorContainer() {
		return e.colorSpec.errorContainer();
	}
	onErrorContainer() {
		return e.colorSpec.onErrorContainer();
	}
	static highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
};
K.contentAccentToneDelta = 15, K.colorSpec = new class extends be {
	surface() {
		let e = L.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => (super.surface().tone(e), e.platform === "phone" ? e.isDark ? 4 : P.isYellow(e.neutralPalette.hue) ? 99 : e.variant === R.VIBRANT ? 97 : 98 : 0),
			isBackground: !0
		});
		return I(super.surface(), "2025", e);
	}
	surfaceDim() {
		let e = L.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 4 : P.isYellow(e.neutralPalette.hue) ? 90 : e.variant === R.VIBRANT ? 85 : 87,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (!e.isDark) {
					if (e.variant === R.NEUTRAL) return 2.5;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === R.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return I(super.surfaceDim(), "2025", e);
	}
	surfaceBright() {
		let e = L.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 18 : P.isYellow(e.neutralPalette.hue) ? 99 : e.variant === R.VIBRANT ? 97 : 98,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.isDark) {
					if (e.variant === R.NEUTRAL) return 2.5;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === R.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return I(super.surfaceBright(), "2025", e);
	}
	surfaceContainerLowest() {
		let e = L.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 0 : 100,
			isBackground: !0
		});
		return I(super.surfaceContainerLowest(), "2025", e);
	}
	surfaceContainerLow() {
		let e = L.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 6 : P.isYellow(e.neutralPalette.hue) ? 98 : e.variant === R.VIBRANT ? 95 : 96 : 15,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 1.3;
					if (e.variant === R.TONAL_SPOT) return 1.25;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? 1.3 : 1.15;
					if (e.variant === R.VIBRANT) return 1.08;
				}
				return 1;
			}
		});
		return I(super.surfaceContainerLow(), "2025", e);
	}
	surfaceContainer() {
		let e = L.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 9 : P.isYellow(e.neutralPalette.hue) ? 96 : e.variant === R.VIBRANT ? 92 : 94 : 20,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 1.6;
					if (e.variant === R.TONAL_SPOT) return 1.4;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? 1.6 : 1.3;
					if (e.variant === R.VIBRANT) return 1.15;
				}
				return 1;
			}
		});
		return I(super.surfaceContainer(), "2025", e);
	}
	surfaceContainerHigh() {
		let e = L.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 12 : P.isYellow(e.neutralPalette.hue) ? 94 : e.variant === R.VIBRANT ? 90 : 92 : 25,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 1.9;
					if (e.variant === R.TONAL_SPOT) return 1.5;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? 1.95 : 1.45;
					if (e.variant === R.VIBRANT) return 1.22;
				}
				return 1;
			}
		});
		return I(super.surfaceContainerHigh(), "2025", e);
	}
	surfaceContainerHighest() {
		let e = L.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 15 : P.isYellow(e.neutralPalette.hue) ? 92 : e.variant === R.VIBRANT ? 88 : 90,
			isBackground: !0,
			chromaMultiplier: (e) => e.variant === R.NEUTRAL ? 2.2 : e.variant === R.TONAL_SPOT ? 1.7 : e.variant === R.EXPRESSIVE ? P.isYellow(e.neutralPalette.hue) ? 2.3 : 1.6 : e.variant === R.VIBRANT ? 1.29 : 1
		});
		return I(super.surfaceContainerHighest(), "2025", e);
	}
	onSurface() {
		let e = L.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === R.VIBRANT ? U(e.neutralPalette, 0, 100, 1.1) : L.getInitialToneFromBackground((e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh())(e),
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 2.2;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.isDark && e.platform === "phone" ? G(11) : G(9)
		});
		return I(super.onSurface(), "2025", e);
	}
	onSurfaceVariant() {
		let e = L.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 2.2;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? e.isDark ? G(6) : G(4.5) : G(7)
		});
		return I(super.onSurfaceVariant(), "2025", e);
	}
	outline() {
		let e = L.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 2.2;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(3) : G(4.5)
		});
		return I(super.outline(), "2025", e);
	}
	outlineVariant() {
		let e = L.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === R.NEUTRAL) return 2.2;
					if (e.variant === R.TONAL_SPOT) return 1.7;
					if (e.variant === R.EXPRESSIVE) return P.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(1.5) : G(3)
		});
		return I(super.outlineVariant(), "2025", e);
	}
	inverseSurface() {
		let e = L.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			isBackground: !0
		});
		return I(super.inverseSurface(), "2025", e);
	}
	inverseOnSurface() {
		let e = L.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => G(7)
		});
		return I(super.inverseOnSurface(), "2025", e);
	}
	primary() {
		let e = L.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === R.NEUTRAL ? e.platform === "phone" ? e.isDark ? 80 : 40 : 90 : e.variant === R.TONAL_SPOT ? e.platform === "phone" ? e.isDark ? 80 : U(e.primaryPalette) : U(e.primaryPalette, 0, 90) : e.variant === R.EXPRESSIVE ? e.platform === "phone" ? U(e.primaryPalette, 0, P.isYellow(e.primaryPalette.hue) ? 25 : P.isCyan(e.primaryPalette.hue) ? 88 : 98) : U(e.primaryPalette) : e.platform === "phone" ? U(e.primaryPalette, 0, P.isCyan(e.primaryPalette.hue) ? 88 : 98) : U(e.primaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return I(super.primary(), "2025", e);
	}
	primaryDim() {
		return L.fromPalette({
			name: "primary_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === R.NEUTRAL ? 85 : e.variant === R.TONAL_SPOT ? U(e.primaryPalette, 0, 90) : U(e.primaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new V(this.primaryDim(), this.primary(), 5, "darker", !0, "farther")
		});
	}
	onPrimary() {
		let e = L.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => e.platform === "phone" ? this.primary() : this.primaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onPrimary(), "2025", e);
	}
	primaryContainer() {
		let e = L.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === R.NEUTRAL ? e.isDark ? 30 : 90 : e.variant === R.TONAL_SPOT ? e.isDark ? W(e.primaryPalette, 35, 93) : U(e.primaryPalette, 0, 90) : e.variant === R.EXPRESSIVE ? e.isDark ? U(e.primaryPalette, 30, 93) : U(e.primaryPalette, 78, P.isCyan(e.primaryPalette.hue) ? 88 : 90) : e.isDark ? W(e.primaryPalette, 66, 93) : U(e.primaryPalette, 66, P.isCyan(e.primaryPalette.hue) ? 88 : 93),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "phone" ? void 0 : new V(this.primaryContainer(), this.primaryDim(), 10, "darker", !0, "farther"),
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.primaryContainer(), "2025", e);
	}
	onPrimaryContainer() {
		let e = L.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onPrimaryContainer(), "2025", e);
	}
	primaryFixed() {
		let e = L.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.primaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.primaryFixed(), "2025", e);
	}
	primaryFixedDim() {
		let e = L.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact")
		});
		return I(super.primaryFixedDim(), "2025", e);
	}
	onPrimaryFixed() {
		let e = L.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return I(super.onPrimaryFixed(), "2025", e);
	}
	onPrimaryFixedVariant() {
		let e = L.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return I(super.onPrimaryFixedVariant(), "2025", e);
	}
	inversePrimary() {
		let e = L.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e.primaryPalette),
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.inversePrimary(), "2025", e);
	}
	secondary() {
		let e = L.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === R.NEUTRAL ? 90 : U(e.secondaryPalette, 0, 90) : e.variant === R.NEUTRAL ? e.isDark ? W(e.secondaryPalette, 0, 98) : U(e.secondaryPalette) : e.variant === R.VIBRANT ? U(e.secondaryPalette, 0, e.isDark ? 90 : 98) : e.isDark ? 80 : U(e.secondaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return I(super.secondary(), "2025", e);
	}
	secondaryDim() {
		return L.fromPalette({
			name: "secondary_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.variant === R.NEUTRAL ? 85 : U(e.secondaryPalette, 0, 90),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new V(this.secondaryDim(), this.secondary(), 5, "darker", !0, "farther")
		});
	}
	onSecondary() {
		let e = L.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => e.platform === "phone" ? this.secondary() : this.secondaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onSecondary(), "2025", e);
	}
	secondaryContainer() {
		let e = L.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === R.VIBRANT ? e.isDark ? W(e.secondaryPalette, 30, 40) : U(e.secondaryPalette, 84, 90) : e.variant === R.EXPRESSIVE ? e.isDark ? 15 : U(e.secondaryPalette, 90, 95) : e.isDark ? 25 : 90,
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.secondaryContainer(), this.secondaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.secondaryContainer(), "2025", e);
	}
	onSecondaryContainer() {
		let e = L.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onSecondaryContainer(), "2025", e);
	}
	secondaryFixed() {
		let e = L.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.secondaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.secondaryFixed(), "2025", e);
	}
	secondaryFixedDim() {
		let e = L.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact")
		});
		return I(super.secondaryFixedDim(), "2025", e);
	}
	onSecondaryFixed() {
		let e = L.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return I(super.onSecondaryFixed(), "2025", e);
	}
	onSecondaryFixedVariant() {
		let e = L.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return I(super.onSecondaryFixedVariant(), "2025", e);
	}
	tertiary() {
		let e = L.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === R.TONAL_SPOT ? U(e.tertiaryPalette, 0, 90) : U(e.tertiaryPalette) : e.variant === R.EXPRESSIVE || e.variant === R.VIBRANT ? U(e.tertiaryPalette, 0, P.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 98 : 100) : e.isDark ? U(e.tertiaryPalette, 0, 98) : U(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return I(super.tertiary(), "2025", e);
	}
	tertiaryDim() {
		return L.fromPalette({
			name: "tertiary_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.variant === R.TONAL_SPOT ? U(e.tertiaryPalette, 0, 90) : U(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new V(this.tertiaryDim(), this.tertiary(), 5, "darker", !0, "farther")
		});
	}
	onTertiary() {
		let e = L.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => e.platform === "phone" ? this.tertiary() : this.tertiaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onTertiary(), "2025", e);
	}
	tertiaryContainer() {
		let e = L.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === R.TONAL_SPOT ? U(e.tertiaryPalette, 0, 90) : U(e.tertiaryPalette) : e.variant === R.NEUTRAL ? e.isDark ? U(e.tertiaryPalette, 0, 93) : U(e.tertiaryPalette, 0, 96) : e.variant === R.TONAL_SPOT ? U(e.tertiaryPalette, 0, e.isDark ? 93 : 100) : e.variant === R.EXPRESSIVE ? U(e.tertiaryPalette, 75, P.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 93 : 100) : e.isDark ? U(e.tertiaryPalette, 0, 93) : U(e.tertiaryPalette, 72, 100),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.tertiaryContainer(), this.tertiaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.tertiaryContainer(), "2025", e);
	}
	onTertiaryContainer() {
		let e = L.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onTertiaryContainer(), "2025", e);
	}
	tertiaryFixed() {
		let e = L.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.tertiaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.tertiaryFixed(), "2025", e);
	}
	tertiaryFixedDim() {
		let e = L.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact")
		});
		return I(super.tertiaryFixedDim(), "2025", e);
	}
	onTertiaryFixed() {
		let e = L.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return I(super.onTertiaryFixed(), "2025", e);
	}
	onTertiaryFixedVariant() {
		let e = L.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return I(super.onTertiaryFixedVariant(), "2025", e);
	}
	error() {
		let e = L.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? W(e.errorPalette, 0, 98) : U(e.errorPalette) : W(e.errorPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return I(super.error(), "2025", e);
	}
	errorDim() {
		return L.fromPalette({
			name: "error_dim",
			palette: (e) => e.errorPalette,
			tone: (e) => W(e.errorPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new V(this.errorDim(), this.error(), 5, "darker", !0, "farther")
		});
	}
	onError() {
		let e = L.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => e.platform === "phone" ? this.error() : this.errorDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return I(super.onError(), "2025", e);
	}
	errorContainer() {
		let e = L.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.isDark ? W(e.errorPalette, 30, 93) : U(e.errorPalette, 0, 90),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.errorContainer(), this.errorDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return I(super.errorContainer(), "2025", e);
	}
	onErrorContainer() {
		let e = L.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7)
		});
		return I(super.onErrorContainer(), "2025", e);
	}
	surfaceVariant() {
		let e = Object.assign(this.surfaceContainerHighest().clone(), { name: "surface_variant" });
		return I(super.surfaceVariant(), "2025", e);
	}
	surfaceTint() {
		let e = Object.assign(this.primary().clone(), { name: "surface_tint" });
		return I(super.surfaceTint(), "2025", e);
	}
	background() {
		let e = Object.assign(this.surface().clone(), { name: "background" });
		return I(super.background(), "2025", e);
	}
	onBackground() {
		let e = Object.assign(this.onSurface().clone(), {
			name: "on_background",
			tone: (e) => e.platform === "watch" ? 100 : this.onSurface().getTone(e)
		});
		return I(super.onBackground(), "2025", e);
	}
}(), K.primaryPaletteKeyColor = K.colorSpec.primaryPaletteKeyColor(), K.secondaryPaletteKeyColor = K.colorSpec.secondaryPaletteKeyColor(), K.tertiaryPaletteKeyColor = K.colorSpec.tertiaryPaletteKeyColor(), K.neutralPaletteKeyColor = K.colorSpec.neutralPaletteKeyColor(), K.neutralVariantPaletteKeyColor = K.colorSpec.neutralVariantPaletteKeyColor(), K.background = K.colorSpec.background(), K.onBackground = K.colorSpec.onBackground(), K.surface = K.colorSpec.surface(), K.surfaceDim = K.colorSpec.surfaceDim(), K.surfaceBright = K.colorSpec.surfaceBright(), K.surfaceContainerLowest = K.colorSpec.surfaceContainerLowest(), K.surfaceContainerLow = K.colorSpec.surfaceContainerLow(), K.surfaceContainer = K.colorSpec.surfaceContainer(), K.surfaceContainerHigh = K.colorSpec.surfaceContainerHigh(), K.surfaceContainerHighest = K.colorSpec.surfaceContainerHighest(), K.onSurface = K.colorSpec.onSurface(), K.surfaceVariant = K.colorSpec.surfaceVariant(), K.onSurfaceVariant = K.colorSpec.onSurfaceVariant(), K.inverseSurface = K.colorSpec.inverseSurface(), K.inverseOnSurface = K.colorSpec.inverseOnSurface(), K.outline = K.colorSpec.outline(), K.outlineVariant = K.colorSpec.outlineVariant(), K.shadow = K.colorSpec.shadow(), K.scrim = K.colorSpec.scrim(), K.surfaceTint = K.colorSpec.surfaceTint(), K.primary = K.colorSpec.primary(), K.onPrimary = K.colorSpec.onPrimary(), K.primaryContainer = K.colorSpec.primaryContainer(), K.onPrimaryContainer = K.colorSpec.onPrimaryContainer(), K.inversePrimary = K.colorSpec.inversePrimary(), K.secondary = K.colorSpec.secondary(), K.onSecondary = K.colorSpec.onSecondary(), K.secondaryContainer = K.colorSpec.secondaryContainer(), K.onSecondaryContainer = K.colorSpec.onSecondaryContainer(), K.tertiary = K.colorSpec.tertiary(), K.onTertiary = K.colorSpec.onTertiary(), K.tertiaryContainer = K.colorSpec.tertiaryContainer(), K.onTertiaryContainer = K.colorSpec.onTertiaryContainer(), K.error = K.colorSpec.error(), K.onError = K.colorSpec.onError(), K.errorContainer = K.colorSpec.errorContainer(), K.onErrorContainer = K.colorSpec.onErrorContainer(), K.primaryFixed = K.colorSpec.primaryFixed(), K.primaryFixedDim = K.colorSpec.primaryFixedDim(), K.onPrimaryFixed = K.colorSpec.onPrimaryFixed(), K.onPrimaryFixedVariant = K.colorSpec.onPrimaryFixedVariant(), K.secondaryFixed = K.colorSpec.secondaryFixed(), K.secondaryFixedDim = K.colorSpec.secondaryFixedDim(), K.onSecondaryFixed = K.colorSpec.onSecondaryFixed(), K.onSecondaryFixedVariant = K.colorSpec.onSecondaryFixedVariant(), K.tertiaryFixed = K.colorSpec.tertiaryFixed(), K.tertiaryFixedDim = K.colorSpec.tertiaryFixedDim(), K.onTertiaryFixed = K.colorSpec.onTertiaryFixed(), K.onTertiaryFixedVariant = K.colorSpec.onTertiaryFixedVariant();
var q = class e {
	static maybeFallbackSpecVersion(e, t) {
		switch (t) {
			case R.EXPRESSIVE:
			case R.VIBRANT:
			case R.TONAL_SPOT:
			case R.NEUTRAL: return e;
			default: return "2021";
		}
	}
	constructor(t) {
		this.sourceColorArgb = t.sourceColorHct.toInt(), this.variant = t.variant, this.contrastLevel = t.contrastLevel, this.isDark = t.isDark, this.platform = t.platform ?? "phone", this.specVersion = e.maybeFallbackSpecVersion(t.specVersion ?? "2021", this.variant), this.sourceColorHct = t.sourceColorHct, this.primaryPalette = t.primaryPalette ?? Te(this.specVersion).getPrimaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.secondaryPalette = t.secondaryPalette ?? Te(this.specVersion).getSecondaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.tertiaryPalette = t.tertiaryPalette ?? Te(this.specVersion).getTertiaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralPalette = t.neutralPalette ?? Te(this.specVersion).getNeutralPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralVariantPalette = t.neutralVariantPalette ?? Te(this.specVersion).getNeutralVariantPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.errorPalette = t.errorPalette ?? Te(this.specVersion).getErrorPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel) ?? z.fromHueAndChroma(25, 84), this.colors = new K();
	}
	toString() {
		return `Scheme: variant=${R[this.variant]}, mode=${this.isDark ? "dark" : "light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`;
	}
	static getPiecewiseHue(e, t, n) {
		let r = Math.min(t.length - 1, n.length), i = e.hue;
		for (let e = 0; e < r; e++) if (i >= t[e] && i < t[e + 1]) return E(n[e]);
		return i;
	}
	static getRotatedHue(t, n, r) {
		let i = e.getPiecewiseHue(t, n, r);
		return Math.min(n.length - 1, r.length) <= 0 && (i = 0), E(t.hue + i);
	}
	getArgb(e) {
		return e.getArgb(this);
	}
	getHct(e) {
		return e.getHct(this);
	}
	get primaryPaletteKeyColor() {
		return this.getArgb(this.colors.primaryPaletteKeyColor());
	}
	get secondaryPaletteKeyColor() {
		return this.getArgb(this.colors.secondaryPaletteKeyColor());
	}
	get tertiaryPaletteKeyColor() {
		return this.getArgb(this.colors.tertiaryPaletteKeyColor());
	}
	get neutralPaletteKeyColor() {
		return this.getArgb(this.colors.neutralPaletteKeyColor());
	}
	get neutralVariantPaletteKeyColor() {
		return this.getArgb(this.colors.neutralVariantPaletteKeyColor());
	}
	get errorPaletteKeyColor() {
		return this.getArgb(this.colors.errorPaletteKeyColor());
	}
	get background() {
		return this.getArgb(this.colors.background());
	}
	get onBackground() {
		return this.getArgb(this.colors.onBackground());
	}
	get surface() {
		return this.getArgb(this.colors.surface());
	}
	get surfaceDim() {
		return this.getArgb(this.colors.surfaceDim());
	}
	get surfaceBright() {
		return this.getArgb(this.colors.surfaceBright());
	}
	get surfaceContainerLowest() {
		return this.getArgb(this.colors.surfaceContainerLowest());
	}
	get surfaceContainerLow() {
		return this.getArgb(this.colors.surfaceContainerLow());
	}
	get surfaceContainer() {
		return this.getArgb(this.colors.surfaceContainer());
	}
	get surfaceContainerHigh() {
		return this.getArgb(this.colors.surfaceContainerHigh());
	}
	get surfaceContainerHighest() {
		return this.getArgb(this.colors.surfaceContainerHighest());
	}
	get onSurface() {
		return this.getArgb(this.colors.onSurface());
	}
	get surfaceVariant() {
		return this.getArgb(this.colors.surfaceVariant());
	}
	get onSurfaceVariant() {
		return this.getArgb(this.colors.onSurfaceVariant());
	}
	get inverseSurface() {
		return this.getArgb(this.colors.inverseSurface());
	}
	get inverseOnSurface() {
		return this.getArgb(this.colors.inverseOnSurface());
	}
	get outline() {
		return this.getArgb(this.colors.outline());
	}
	get outlineVariant() {
		return this.getArgb(this.colors.outlineVariant());
	}
	get shadow() {
		return this.getArgb(this.colors.shadow());
	}
	get scrim() {
		return this.getArgb(this.colors.scrim());
	}
	get surfaceTint() {
		return this.getArgb(this.colors.surfaceTint());
	}
	get primary() {
		return this.getArgb(this.colors.primary());
	}
	get primaryDim() {
		let e = this.colors.primaryDim();
		if (e === void 0) throw Error("`primaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onPrimary() {
		return this.getArgb(this.colors.onPrimary());
	}
	get primaryContainer() {
		return this.getArgb(this.colors.primaryContainer());
	}
	get onPrimaryContainer() {
		return this.getArgb(this.colors.onPrimaryContainer());
	}
	get primaryFixed() {
		return this.getArgb(this.colors.primaryFixed());
	}
	get primaryFixedDim() {
		return this.getArgb(this.colors.primaryFixedDim());
	}
	get onPrimaryFixed() {
		return this.getArgb(this.colors.onPrimaryFixed());
	}
	get onPrimaryFixedVariant() {
		return this.getArgb(this.colors.onPrimaryFixedVariant());
	}
	get inversePrimary() {
		return this.getArgb(this.colors.inversePrimary());
	}
	get secondary() {
		return this.getArgb(this.colors.secondary());
	}
	get secondaryDim() {
		let e = this.colors.secondaryDim();
		if (e === void 0) throw Error("`secondaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onSecondary() {
		return this.getArgb(this.colors.onSecondary());
	}
	get secondaryContainer() {
		return this.getArgb(this.colors.secondaryContainer());
	}
	get onSecondaryContainer() {
		return this.getArgb(this.colors.onSecondaryContainer());
	}
	get secondaryFixed() {
		return this.getArgb(this.colors.secondaryFixed());
	}
	get secondaryFixedDim() {
		return this.getArgb(this.colors.secondaryFixedDim());
	}
	get onSecondaryFixed() {
		return this.getArgb(this.colors.onSecondaryFixed());
	}
	get onSecondaryFixedVariant() {
		return this.getArgb(this.colors.onSecondaryFixedVariant());
	}
	get tertiary() {
		return this.getArgb(this.colors.tertiary());
	}
	get tertiaryDim() {
		let e = this.colors.tertiaryDim();
		if (e === void 0) throw Error("`tertiaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onTertiary() {
		return this.getArgb(this.colors.onTertiary());
	}
	get tertiaryContainer() {
		return this.getArgb(this.colors.tertiaryContainer());
	}
	get onTertiaryContainer() {
		return this.getArgb(this.colors.onTertiaryContainer());
	}
	get tertiaryFixed() {
		return this.getArgb(this.colors.tertiaryFixed());
	}
	get tertiaryFixedDim() {
		return this.getArgb(this.colors.tertiaryFixedDim());
	}
	get onTertiaryFixed() {
		return this.getArgb(this.colors.onTertiaryFixed());
	}
	get onTertiaryFixedVariant() {
		return this.getArgb(this.colors.onTertiaryFixedVariant());
	}
	get error() {
		return this.getArgb(this.colors.error());
	}
	get errorDim() {
		let e = this.colors.errorDim();
		if (e === void 0) throw Error("`errorDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onError() {
		return this.getArgb(this.colors.onError());
	}
	get errorContainer() {
		return this.getArgb(this.colors.errorContainer());
	}
	get onErrorContainer() {
		return this.getArgb(this.colors.onErrorContainer());
	}
};
q.DEFAULT_SPEC_VERSION = "2021", q.DEFAULT_PLATFORM = "phone";
var Se = class {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.CONTENT:
			case R.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma);
			case R.FRUIT_SALAD: return z.fromHueAndChroma(E(t.hue - 50), 48);
			case R.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, 12);
			case R.RAINBOW: return z.fromHueAndChroma(t.hue, 48);
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 36);
			case R.EXPRESSIVE: return z.fromHueAndChroma(E(t.hue + 240), 40);
			case R.VIBRANT: return z.fromHueAndChroma(t.hue, 200);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.CONTENT:
			case R.FIDELITY: return z.fromHueAndChroma(t.hue, Math.max(t.chroma - 32, .5 * t.chroma));
			case R.FRUIT_SALAD: return z.fromHueAndChroma(E(t.hue - 50), 36);
			case R.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, 8);
			case R.RAINBOW:
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 16);
			case R.EXPRESSIVE: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				45,
				95,
				45,
				20,
				45,
				90,
				45,
				45,
				45
			]), 24);
			case R.VIBRANT: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				18,
				15,
				10,
				12,
				15,
				18,
				15,
				12,
				12
			]), 24);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.CONTENT: return z.fromHct(pe.fixIfDisliked(new ve(t).analogous(3, 6)[2]));
			case R.FIDELITY: return z.fromHct(pe.fixIfDisliked(new ve(t).complement));
			case R.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 36);
			case R.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, 16);
			case R.RAINBOW:
			case R.TONAL_SPOT: return z.fromHueAndChroma(E(t.hue + 60), 24);
			case R.EXPRESSIVE: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				120,
				120,
				20,
				45,
				20,
				15,
				20,
				120,
				120
			]), 32);
			case R.VIBRANT: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				35,
				30,
				20,
				25,
				30,
				35,
				30,
				25,
				25
			]), 32);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralPalette(e, t, n, r, i) {
		switch (e) {
			case R.CONTENT:
			case R.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma / 8);
			case R.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 10);
			case R.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, 2);
			case R.RAINBOW: return z.fromHueAndChroma(t.hue, 0);
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 6);
			case R.EXPRESSIVE: return z.fromHueAndChroma(E(t.hue + 15), 8);
			case R.VIBRANT: return z.fromHueAndChroma(t.hue, 10);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralVariantPalette(e, t, n, r, i) {
		switch (e) {
			case R.CONTENT:
			case R.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case R.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 16);
			case R.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, 2);
			case R.RAINBOW: return z.fromHueAndChroma(t.hue, 0);
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 8);
			case R.EXPRESSIVE: return z.fromHueAndChroma(E(t.hue + 15), 12);
			case R.VIBRANT: return z.fromHueAndChroma(t.hue, 12);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getErrorPalette(e, t, n, r, i) {}
}, Ce = new Se(), we = new class e extends Se {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, r === "phone" ? P.isBlue(t.hue) ? 12 : 8 : P.isBlue(t.hue) ? 16 : 12);
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, r === "phone" && n ? 26 : 32);
			case R.EXPRESSIVE: return z.fromHueAndChroma(t.hue, r === "phone" ? n ? 36 : 48 : 40);
			case R.VIBRANT: return z.fromHueAndChroma(t.hue, r === "phone" ? 74 : 56);
			default: return super.getPrimaryPalette(e, t, n, r, i);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.NEUTRAL: return z.fromHueAndChroma(t.hue, r === "phone" ? P.isBlue(t.hue) ? 6 : 4 : P.isBlue(t.hue) ? 10 : 6);
			case R.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 16);
			case R.EXPRESSIVE: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-160,
				155,
				-100,
				96,
				-96,
				-156,
				-165,
				-160
			]), r === "phone" && n ? 16 : 24);
			case R.VIBRANT: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				38,
				105,
				140,
				333,
				360
			], [
				-14,
				10,
				-14,
				10,
				-14
			]), r === "phone" ? 56 : 36);
			default: return super.getSecondaryPalette(e, t, n, r, i);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case R.NEUTRAL: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				38,
				105,
				161,
				204,
				278,
				333,
				360
			], [
				-32,
				26,
				10,
				-39,
				24,
				-15,
				-32
			]), r === "phone" ? 20 : 36);
			case R.TONAL_SPOT: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				20,
				71,
				161,
				333,
				360
			], [
				-40,
				48,
				-32,
				40,
				-32
			]), r === "phone" ? 28 : 32);
			case R.EXPRESSIVE: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-165,
				160,
				-105,
				101,
				-101,
				-160,
				-170,
				-165
			]), 48);
			case R.VIBRANT: return z.fromHueAndChroma(q.getRotatedHue(t, [
				0,
				38,
				71,
				105,
				140,
				161,
				253,
				333,
				360
			], [
				-72,
				35,
				24,
				-24,
				62,
				50,
				62,
				-72
			]), 56);
			default: return super.getTertiaryPalette(e, t, n, r, i);
		}
	}
	static getExpressiveNeutralHue(e) {
		return q.getRotatedHue(e, [
			0,
			71,
			124,
			253,
			278,
			300,
			360
		], [
			10,
			0,
			10,
			0,
			10,
			0
		]);
	}
	static getExpressiveNeutralChroma(t, n, r) {
		let i = e.getExpressiveNeutralHue(t);
		return r === "phone" ? n ? P.isYellow(i) ? 6 : 14 : 18 : 12;
	}
	static getVibrantNeutralHue(e) {
		return q.getRotatedHue(e, [
			0,
			38,
			105,
			140,
			333,
			360
		], [
			-14,
			10,
			-14,
			10,
			-14
		]);
	}
	static getVibrantNeutralChroma(t, n) {
		let r = e.getVibrantNeutralHue(t);
		return n === "phone" || P.isBlue(r) ? 28 : 20;
	}
	getNeutralPalette(t, n, r, i, a) {
		switch (t) {
			case R.NEUTRAL: return z.fromHueAndChroma(n.hue, i === "phone" ? 1.4 : 6);
			case R.TONAL_SPOT: return z.fromHueAndChroma(n.hue, i === "phone" ? 5 : 10);
			case R.EXPRESSIVE: return z.fromHueAndChroma(e.getExpressiveNeutralHue(n), e.getExpressiveNeutralChroma(n, r, i));
			case R.VIBRANT: return z.fromHueAndChroma(e.getVibrantNeutralHue(n), e.getVibrantNeutralChroma(n, i));
			default: return super.getNeutralPalette(t, n, r, i, a);
		}
	}
	getNeutralVariantPalette(t, n, r, i, a) {
		switch (t) {
			case R.NEUTRAL: return z.fromHueAndChroma(n.hue, 2.2 * (i === "phone" ? 1.4 : 6));
			case R.TONAL_SPOT: return z.fromHueAndChroma(n.hue, 1.7 * (i === "phone" ? 5 : 10));
			case R.EXPRESSIVE:
				let o = e.getExpressiveNeutralHue(n), s = e.getExpressiveNeutralChroma(n, r, i);
				return z.fromHueAndChroma(o, s * (o >= 105 && o < 125 ? 1.6 : 2.3));
			case R.VIBRANT:
				let c = e.getVibrantNeutralHue(n), l = e.getVibrantNeutralChroma(n, i);
				return z.fromHueAndChroma(c, 1.29 * l);
			default: return super.getNeutralVariantPalette(t, n, r, i, a);
		}
	}
	getErrorPalette(e, t, n, r, i) {
		let a = q.getPiecewiseHue(t, [
			0,
			3,
			13,
			23,
			33,
			43,
			153,
			273,
			360
		], [
			12,
			22,
			32,
			12,
			22,
			32,
			22,
			12
		]);
		switch (e) {
			case R.NEUTRAL: return z.fromHueAndChroma(a, r === "phone" ? 50 : 40);
			case R.TONAL_SPOT: return z.fromHueAndChroma(a, r === "phone" ? 60 : 48);
			case R.EXPRESSIVE: return z.fromHueAndChroma(a, r === "phone" ? 64 : 48);
			case R.VIBRANT: return z.fromHueAndChroma(a, r === "phone" ? 80 : 60);
			default: return super.getErrorPalette(e, t, n, r, i);
		}
	}
}();
function Te(e) {
	return e === "2025" ? we : Ce;
}
var Ee = class e {
	static of(t) {
		return new e(t, !1);
	}
	static contentOf(t) {
		return new e(t, !0);
	}
	static fromColors(t) {
		return e.createPaletteFromColors(!1, t);
	}
	static contentFromColors(t) {
		return e.createPaletteFromColors(!0, t);
	}
	static createPaletteFromColors(t, n) {
		let r = new e(n.primary, t);
		return n.secondary && (r.a2 = new e(n.secondary, t).a1), n.tertiary && (r.a3 = new e(n.tertiary, t).a1), n.error && (r.error = new e(n.error, t).a1), n.neutral && (r.n1 = new e(n.neutral, t).n1), n.neutralVariant && (r.n2 = new e(n.neutralVariant, t).n2), r;
	}
	constructor(e, t) {
		let n = P.fromInt(e), r = n.hue, i = n.chroma;
		t ? (this.a1 = z.fromHueAndChroma(r, i), this.a2 = z.fromHueAndChroma(r, i / 3), this.a3 = z.fromHueAndChroma(r + 60, i / 2), this.n1 = z.fromHueAndChroma(r, Math.min(i / 12, 4)), this.n2 = z.fromHueAndChroma(r, Math.min(i / 6, 8))) : (this.a1 = z.fromHueAndChroma(r, Math.max(48, i)), this.a2 = z.fromHueAndChroma(r, 16), this.a3 = z.fromHueAndChroma(r + 60, 24), this.n1 = z.fromHueAndChroma(r, 4), this.n2 = z.fromHueAndChroma(r, 8)), this.error = z.fromHueAndChroma(25, 84);
	}
}, De = class e {
	get primary() {
		return this.props.primary;
	}
	get onPrimary() {
		return this.props.onPrimary;
	}
	get primaryContainer() {
		return this.props.primaryContainer;
	}
	get onPrimaryContainer() {
		return this.props.onPrimaryContainer;
	}
	get secondary() {
		return this.props.secondary;
	}
	get onSecondary() {
		return this.props.onSecondary;
	}
	get secondaryContainer() {
		return this.props.secondaryContainer;
	}
	get onSecondaryContainer() {
		return this.props.onSecondaryContainer;
	}
	get tertiary() {
		return this.props.tertiary;
	}
	get onTertiary() {
		return this.props.onTertiary;
	}
	get tertiaryContainer() {
		return this.props.tertiaryContainer;
	}
	get onTertiaryContainer() {
		return this.props.onTertiaryContainer;
	}
	get error() {
		return this.props.error;
	}
	get onError() {
		return this.props.onError;
	}
	get errorContainer() {
		return this.props.errorContainer;
	}
	get onErrorContainer() {
		return this.props.onErrorContainer;
	}
	get background() {
		return this.props.background;
	}
	get onBackground() {
		return this.props.onBackground;
	}
	get surface() {
		return this.props.surface;
	}
	get onSurface() {
		return this.props.onSurface;
	}
	get surfaceVariant() {
		return this.props.surfaceVariant;
	}
	get onSurfaceVariant() {
		return this.props.onSurfaceVariant;
	}
	get outline() {
		return this.props.outline;
	}
	get outlineVariant() {
		return this.props.outlineVariant;
	}
	get shadow() {
		return this.props.shadow;
	}
	get scrim() {
		return this.props.scrim;
	}
	get inverseSurface() {
		return this.props.inverseSurface;
	}
	get inverseOnSurface() {
		return this.props.inverseOnSurface;
	}
	get inversePrimary() {
		return this.props.inversePrimary;
	}
	static light(t) {
		return e.lightFromCorePalette(Ee.of(t));
	}
	static dark(t) {
		return e.darkFromCorePalette(Ee.of(t));
	}
	static lightContent(t) {
		return e.lightFromCorePalette(Ee.contentOf(t));
	}
	static darkContent(t) {
		return e.darkFromCorePalette(Ee.contentOf(t));
	}
	static lightFromCorePalette(t) {
		return new e({
			primary: t.a1.tone(40),
			onPrimary: t.a1.tone(100),
			primaryContainer: t.a1.tone(90),
			onPrimaryContainer: t.a1.tone(10),
			secondary: t.a2.tone(40),
			onSecondary: t.a2.tone(100),
			secondaryContainer: t.a2.tone(90),
			onSecondaryContainer: t.a2.tone(10),
			tertiary: t.a3.tone(40),
			onTertiary: t.a3.tone(100),
			tertiaryContainer: t.a3.tone(90),
			onTertiaryContainer: t.a3.tone(10),
			error: t.error.tone(40),
			onError: t.error.tone(100),
			errorContainer: t.error.tone(90),
			onErrorContainer: t.error.tone(10),
			background: t.n1.tone(99),
			onBackground: t.n1.tone(10),
			surface: t.n1.tone(99),
			onSurface: t.n1.tone(10),
			surfaceVariant: t.n2.tone(90),
			onSurfaceVariant: t.n2.tone(30),
			outline: t.n2.tone(50),
			outlineVariant: t.n2.tone(80),
			shadow: t.n1.tone(0),
			scrim: t.n1.tone(0),
			inverseSurface: t.n1.tone(20),
			inverseOnSurface: t.n1.tone(95),
			inversePrimary: t.a1.tone(80)
		});
	}
	static darkFromCorePalette(t) {
		return new e({
			primary: t.a1.tone(80),
			onPrimary: t.a1.tone(20),
			primaryContainer: t.a1.tone(30),
			onPrimaryContainer: t.a1.tone(90),
			secondary: t.a2.tone(80),
			onSecondary: t.a2.tone(20),
			secondaryContainer: t.a2.tone(30),
			onSecondaryContainer: t.a2.tone(90),
			tertiary: t.a3.tone(80),
			onTertiary: t.a3.tone(20),
			tertiaryContainer: t.a3.tone(30),
			onTertiaryContainer: t.a3.tone(90),
			error: t.error.tone(80),
			onError: t.error.tone(20),
			errorContainer: t.error.tone(30),
			onErrorContainer: t.error.tone(80),
			background: t.n1.tone(10),
			onBackground: t.n1.tone(90),
			surface: t.n1.tone(10),
			onSurface: t.n1.tone(90),
			surfaceVariant: t.n2.tone(30),
			onSurfaceVariant: t.n2.tone(80),
			outline: t.n2.tone(60),
			outlineVariant: t.n2.tone(30),
			shadow: t.n1.tone(0),
			scrim: t.n1.tone(0),
			inverseSurface: t.n1.tone(90),
			inverseOnSurface: t.n1.tone(20),
			inversePrimary: t.a1.tone(40)
		});
	}
	constructor(e) {
		this.props = e;
	}
	toJSON() {
		return { ...this.props };
	}
}, Oe = {
	desired: 4,
	fallbackColorARGB: 4282549748,
	filter: !0
};
function ke(e, t) {
	return e.score > t.score ? -1 : +(e.score < t.score);
}
var Ae = class e {
	constructor() {}
	static score(t, n) {
		let { desired: r, fallbackColorARGB: i, filter: a } = {
			...Oe,
			...n
		}, o = [], s = Array(360).fill(0), c = 0;
		for (let [e, n] of t.entries()) {
			let t = P.fromInt(e);
			o.push(t), s[Math.floor(t.hue)] += n, c += n;
		}
		let l = Array(360).fill(0);
		for (let e = 0; e < 360; e++) {
			let t = s[e] / c;
			for (let n = e - 14; n < e + 16; n++) l[T(n)] += t;
		}
		let u = [];
		for (let t of o) {
			let n = l[T(Math.round(t.hue))];
			if (a && (t.chroma < e.CUTOFF_CHROMA || n <= e.CUTOFF_EXCITED_PROPORTION)) continue;
			let r = 100 * n * e.WEIGHT_PROPORTION, i = t.chroma < e.TARGET_CHROMA ? e.WEIGHT_CHROMA_BELOW : e.WEIGHT_CHROMA_ABOVE, o = r + (t.chroma - e.TARGET_CHROMA) * i;
			u.push({
				hct: t,
				score: o
			});
		}
		u.sort(ke);
		let d = [];
		for (let e = 90; e >= 15; e--) {
			d.length = 0;
			for (let { hct: t } of u) if (d.find((n) => ee(t.hue, n.hue) < e) || d.push(t), d.length >= r) break;
			if (d.length >= r) break;
		}
		let f = [];
		d.length === 0 && f.push(i);
		for (let e of d) f.push(e.toInt());
		return f;
	}
};
function je(e) {
	let t = (e = e.replace("#", "")).length === 3, n = e.length === 6, r = e.length === 8;
	if (!t && !n && !r) throw Error("unexpected hex " + e);
	let i = 0, a = 0, o = 0;
	return t ? (i = J(e.slice(0, 1).repeat(2)), a = J(e.slice(1, 2).repeat(2)), o = J(e.slice(2, 3).repeat(2))) : n ? (i = J(e.slice(0, 2)), a = J(e.slice(2, 4)), o = J(e.slice(4, 6))) : r && (i = J(e.slice(2, 4)), a = J(e.slice(4, 6)), o = J(e.slice(6, 8))), (255 << 24 | (255 & i) << 16 | (255 & a) << 8 | 255 & o) >>> 0;
}
function J(e) {
	return parseInt(e, 16);
}
function Me(e, t = []) {
	let n = Ee.of(e);
	return {
		source: e,
		schemes: {
			light: De.light(e),
			dark: De.dark(e)
		},
		palettes: {
			primary: n.a1,
			secondary: n.a2,
			tertiary: n.a3,
			neutral: n.n1,
			neutralVariant: n.n2,
			error: n.error
		},
		customColors: t.map((t) => function(e, t) {
			let n = t.value, r = n, i = e;
			t.blend && (n = fe.harmonize(r, i));
			let a = Ee.of(n).a1;
			return {
				color: t,
				value: n,
				light: {
					color: a.tone(40),
					onColor: a.tone(100),
					colorContainer: a.tone(90),
					onColorContainer: a.tone(10)
				},
				dark: {
					color: a.tone(80),
					onColor: a.tone(20),
					colorContainer: a.tone(30),
					onColorContainer: a.tone(90)
				}
			};
		}(e, t))
	};
}
function Y(e) {
	return function(e) {
		let t = ae(e), n = oe(e), r = se(e), i = [
			t.toString(16),
			n.toString(16),
			r.toString(16)
		];
		for (let [e, t] of i.entries()) t.length === 1 && (i[e] = "0" + t);
		return "#" + i.join("");
	}(e);
}
function X(e) {
	let t = P.fromInt(e), n = z.fromHueAndChroma(t.hue, t.chroma);
	return {
		0: Y(n.tone(0)),
		10: Y(n.tone(10)),
		20: Y(n.tone(20)),
		30: Y(n.tone(30)),
		40: Y(n.tone(40)),
		50: Y(n.tone(50)),
		60: Y(n.tone(60)),
		70: Y(n.tone(70)),
		80: Y(n.tone(80)),
		90: Y(n.tone(90)),
		95: Y(n.tone(95)),
		99: Y(n.tone(99)),
		100: Y(n.tone(100))
	};
}
function Ne(e, t = !1, n) {
	let r = t ? e.schemes.dark : e.schemes.light, i = z.fromHueAndChroma(e.palettes.primary.hue, e.palettes.primary.chroma), a = z.fromHueAndChroma(e.palettes.secondary.hue, e.palettes.secondary.chroma), o = z.fromHueAndChroma(e.palettes.tertiary.hue, e.palettes.tertiary.chroma), s = z.fromHueAndChroma(e.palettes.neutral.hue, e.palettes.neutral.chroma), c = z.fromHueAndChroma(e.palettes.neutralVariant.hue, e.palettes.neutralVariant.chroma), l = z.fromHueAndChroma(e.palettes.error.hue, e.palettes.error.chroma), u = X(n?.success ? n.success : je("#00C853")), d = X(n?.warning ? n.warning : je("#FFCA28")), f = X(n?.info ? n.info : je("#2979FF")), p = {
		primary: t ? 80 : 40,
		onPrimary: t ? 20 : 100,
		primaryContainer: t ? 30 : 90,
		onPrimaryContainer: t ? 90 : 10,
		primaryFixed: 90,
		primaryFixedDim: 80,
		onPrimaryFixed: 10,
		onPrimaryFixedVariant: 30,
		inversePrimary: t ? 40 : 80,
		secondary: t ? 80 : 40,
		onSecondary: t ? 20 : 100,
		secondaryContainer: t ? 30 : 90,
		onSecondaryContainer: t ? 90 : 10,
		secondaryFixed: 90,
		secondaryFixedDim: 80,
		onSecondaryFixed: 10,
		onSecondaryFixedVariant: 30,
		tertiary: t ? 80 : 40,
		onTertiary: t ? 20 : 100,
		tertiaryContainer: t ? 30 : 90,
		onTertiaryContainer: t ? 90 : 10,
		tertiaryFixed: 90,
		tertiaryFixedDim: 80,
		onTertiaryFixed: 10,
		onTertiaryFixedVariant: 30,
		error: t ? 50 : 40,
		onError: 100,
		errorContainer: t ? 30 : 90,
		onErrorContainer: t ? 90 : 10,
		surface: t ? 6 : 98,
		surfaceDim: t ? 6 : 87,
		surfaceBright: t ? 24 : 98,
		surfaceContainerLowest: t ? 4 : 100,
		surfaceContainerLow: t ? 10 : 96,
		surfaceContainer: t ? 12 : 94,
		surfaceContainerHigh: t ? 17 : 92,
		surfaceContainerHighest: t ? 22 : 90,
		onSurface: t ? 90 : 10,
		onSurfaceVariant: t ? 80 : 30,
		surfaceTint: t ? 80 : 40,
		inverseSurface: t ? 90 : 20,
		inverseOnSurface: t ? 20 : 95,
		outline: t ? 60 : 50,
		outlineVariant: t ? 15 : 80,
		shadow: 0,
		scrim: 0
	};
	return {
		sys: {
			color: {
				scrim: Y(r.scrim),
				outline: Y(c.tone(p.outline)),
				outlineVariant: Y(c.tone(p.outlineVariant)),
				shadow: Y(s.tone(p.shadow)),
				surface: {
					default: Y(s.tone(p.surface)),
					dim: Y(s.tone(p.surfaceDim)),
					bright: Y(s.tone(p.surfaceBright)),
					container: Y(s.tone(p.surfaceContainer)),
					containerLow: Y(s.tone(p.surfaceContainerLow)),
					containerLowest: Y(s.tone(p.surfaceContainerLowest)),
					containerHigh: Y(s.tone(p.surfaceContainerHigh)),
					containerHighest: Y(s.tone(p.surfaceContainerHighest)),
					on: Y(s.tone(p.onSurface)),
					onVariant: Y(c.tone(p.onSurfaceVariant)),
					tint: Y(i.tone(p.surfaceTint)),
					inverse: Y(s.tone(p.inverseSurface)),
					inverseOn: Y(s.tone(p.inverseOnSurface)),
					low: Y(s.tone(p.surfaceContainerLow)),
					high: Y(s.tone(p.surfaceContainerHigh)),
					highest: Y(s.tone(p.surfaceContainerHighest)),
					lowest: Y(s.tone(p.surfaceContainerLowest))
				},
				primary: {
					default: Y(i.tone(p.primary)),
					on: Y(i.tone(p.onPrimary)),
					container: Y(i.tone(p.primaryContainer)),
					onContainer: Y(i.tone(p.onPrimaryContainer)),
					fixed: Y(i.tone(p.primaryFixed)),
					fixedDim: Y(i.tone(p.primaryFixedDim)),
					onFixed: Y(i.tone(p.onPrimaryFixed)),
					onFixedVariant: Y(i.tone(p.onPrimaryFixedVariant)),
					inverse: Y(i.tone(p.inversePrimary))
				},
				secondary: {
					default: Y(a.tone(p.secondary)),
					on: Y(a.tone(p.onSecondary)),
					container: Y(a.tone(p.secondaryContainer)),
					onContainer: Y(a.tone(p.onSecondaryContainer)),
					fixed: Y(a.tone(p.secondaryFixed)),
					fixedDim: Y(a.tone(p.secondaryFixedDim)),
					onFixed: Y(a.tone(p.onSecondaryFixed)),
					onFixedVariant: Y(a.tone(p.onSecondaryFixedVariant))
				},
				tertiary: {
					default: Y(o.tone(p.tertiary)),
					on: Y(o.tone(p.onTertiary)),
					container: Y(o.tone(p.tertiaryContainer)),
					onContainer: Y(o.tone(p.onTertiaryContainer)),
					fixed: Y(o.tone(p.tertiaryFixed)),
					fixedDim: Y(o.tone(p.tertiaryFixedDim)),
					onFixed: Y(o.tone(p.onTertiaryFixed)),
					onFixedVariant: Y(o.tone(p.onTertiaryFixedVariant))
				},
				error: {
					default: Y(l.tone(p.error)),
					on: Y(l.tone(p.onError)),
					container: Y(l.tone(p.errorContainer)),
					onContainer: Y(l.tone(p.onErrorContainer))
				},
				success: {
					default: u[t ? "80" : "40"],
					on: u[100],
					container: u[t ? "30" : "90"],
					onContainer: u[t ? "90" : "10"]
				},
				warning: {
					default: d[t ? "80" : "40"],
					on: d[100],
					container: d[t ? "30" : "90"],
					onContainer: d[t ? "90" : "10"]
				},
				info: {
					default: f[t ? "80" : "40"],
					on: f[100],
					container: f[t ? "30" : "90"],
					onContainer: f[t ? "90" : "10"]
				}
			},
			typography: {
				display: {
					large: "display-large",
					medium: "display-medium",
					small: "display-small"
				},
				headline: {
					large: "headline-large",
					medium: "headline-medium",
					small: "headline-small"
				},
				title: {
					large: "title-large",
					medium: "title-medium",
					small: "title-small"
				},
				body: {
					large: "body-large",
					medium: "body-medium",
					small: "body-small"
				},
				label: {
					large: "label-large",
					medium: "label-medium",
					small: "label-small"
				}
			},
			shape: { corner: {
				none: "0",
				extraSmall: "4px",
				small: "8px",
				medium: "12px",
				large: "16px",
				extraLarge: "28px",
				full: "9999px"
			} },
			elevation: {
				0: "0 0 0 0 rgba(0, 0, 0, 0)",
				1: `0 2px 12px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) ${t ? "18%" : "15%"}, transparent)`,
				2: `0 4px 20px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) ${t ? "26%" : "22%"}, transparent)`,
				3: `0 8px 32px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) ${t ? "32%" : "28%"}, transparent)`,
				4: `0 12px 44px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) ${t ? "40%" : "35%"}, transparent)`,
				5: `0 20px 60px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) ${t ? "48%" : "42%"}, transparent)`
			},
			motion: {
				easing: {
					emphasized: "cubic-bezier(0.2, 0.0, 0, 1.0)",
					emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
					emphasizedAccelerate: "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
					standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
					standardDecelerate: "cubic-bezier(0, 0, 0, 1)",
					standardAccelerate: "cubic-bezier(0.3, 0, 1, 1)",
					legacy: "cubic-bezier(0.4, 0, 0.2, 1)",
					linear: "linear"
				},
				duration: {
					short1: "50ms",
					short2: "100ms",
					short3: "150ms",
					short4: "200ms",
					medium1: "250ms",
					medium2: "300ms",
					medium3: "350ms",
					medium4: "400ms",
					long1: "450ms",
					long2: "500ms",
					long3: "550ms",
					long4: "600ms",
					extraLong1: "700ms",
					extraLong2: "800ms",
					extraLong3: "900ms",
					extraLong4: "1000ms"
				}
			},
			state: { opacity: {
				hover: "0.08",
				focus: "0.12",
				pressed: "0.12",
				dragged: "0.16",
				disabled: "0.38",
				disabledContainer: "0.12"
			} },
			spacing: {
				0: "0",
				1: "4px",
				2: "8px",
				3: "12px",
				4: "16px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px"
			},
			outline: { 1: "1px" }
		},
		ref: { palette: {
			primary: X(i.tone(40)),
			secondary: X(a.tone(40)),
			tertiary: X(o.tone(40)),
			neutral: X(s.tone(40)),
			neutralVariant: X(c.tone(40)),
			error: X(l.tone(40))
		} }
	};
}
function Pe(e, t) {
	let n = z.fromHueAndChroma(e, t);
	return {
		cLowest: n.tone(100),
		cLow: n.tone(96),
		c: n.tone(94),
		cHigh: n.tone(92),
		cHighest: n.tone(90),
		sDim: n.tone(87),
		s: n.tone(98),
		sBright: n.tone(100)
	};
}
function Fe(e, t) {
	let n = z.fromHueAndChroma(e, t);
	return {
		cLowest: n.tone(4),
		cLow: n.tone(10),
		c: n.tone(12),
		cHigh: n.tone(17),
		cHighest: n.tone(22),
		sDim: n.tone(6),
		s: n.tone(6),
		sBright: n.tone(24)
	};
}
Ae.TARGET_CHROMA = 48, Ae.WEIGHT_PROPORTION = .7, Ae.WEIGHT_CHROMA_ABOVE = .3, Ae.WEIGHT_CHROMA_BELOW = .1, Ae.CUTOFF_CHROMA = 5, Ae.CUTOFF_EXCITED_PROPORTION = .01;
var Ie = b(":host,:root{--md-ref-typeface-brand:var(--schmancy-font-family,sans-serif);--md-ref-typeface-plain:var(--schmancy-font-family,sans-serif);--md-sys-color-primary:var(--schmancy-sys-color-primary-default);--md-sys-color-secondary:var(--schmancy-sys-color-secondary-default);--default-font-family:var(--schmancy-font-family);--border-style:solid;--spacing:.25rem;--color-scrim:var(--schmancy-sys-color-scrim);--color-shadow:var(--schmancy-sys-color-shadow);--color-outline:var(--schmancy-sys-color-outline);--color-outlineVariant:var(--schmancy-sys-color-outlineVariant);--color-outline-variant:var(--schmancy-sys-color-outlineVariant);--color-surface-default:var(--schmancy-sys-color-surface-default);--color-surface-dim:var(--schmancy-sys-color-surface-dim);--color-surface-bright:var(--schmancy-sys-color-surface-bright);--color-surface-container:var(--schmancy-sys-color-surface-container);--color-surface-low:var(--schmancy-sys-color-surface-low);--color-surface-high:var(--schmancy-sys-color-surface-high);--color-surface-highest:var(--schmancy-sys-color-surface-highest);--color-surface-lowest:var(--schmancy-sys-color-surface-lowest);--color-surface-containerLow:var(--schmancy-sys-color-surface-containerLow);--color-surface-containerHigh:var(--schmancy-sys-color-surface-containerHigh);--color-surface-containerLowest:var(--schmancy-sys-color-surface-containerLowest);--color-surface-containerHighest:var(--schmancy-sys-color-surface-containerHighest);--color-surface-on:var(--schmancy-sys-color-surface-on);--color-surface-onVariant:var(--schmancy-sys-color-surface-onVariant);--color-surface-on-variant:var(--schmancy-sys-color-surface-onVariant);--color-surface-tint:var(--schmancy-sys-color-surface-tint);--color-surface-inverse:var(--schmancy-sys-color-inverse-surface);--color-surface-inverseOn:var(--schmancy-sys-color-inverse-onSurface);--color-inverse-surface:var(--schmancy-sys-color-inverse-surface);--color-inverse-on-surface:var(--schmancy-sys-color-inverse-onSurface);--color-primary-default:var(--schmancy-sys-color-primary-default);--color-primary-on:var(--schmancy-sys-color-primary-on);--color-primary-container:var(--schmancy-sys-color-primary-container);--color-primary-onContainer:var(--schmancy-sys-color-primary-onContainer);--color-primary-on-container:var(--schmancy-sys-color-primary-onContainer);--color-primary-fixed:var(--schmancy-sys-color-primary-fixed);--color-primary-fixedDim:var(--schmancy-sys-color-primary-fixedDim);--color-primary-fixed-dim:var(--schmancy-sys-color-primary-fixedDim);--color-primary-onFixed:var(--schmancy-sys-color-primary-onFixed);--color-primary-on-fixed:var(--schmancy-sys-color-primary-onFixed);--color-primary-onFixedVariant:var(--schmancy-sys-color-primary-onFixedVariant);--color-primary-on-fixed-variant:var(--schmancy-sys-color-primary-onFixedVariant);--color-primary-inverse:var(--schmancy-sys-color-inverse-primary);--color-inverse-primary:var(--schmancy-sys-color-inverse-primary);--color-secondary-default:var(--schmancy-sys-color-secondary-default);--color-secondary-on:var(--schmancy-sys-color-secondary-on);--color-secondary-container:var(--schmancy-sys-color-secondary-container);--color-secondary-onContainer:var(--schmancy-sys-color-secondary-onContainer);--color-secondary-on-container:var(--schmancy-sys-color-secondary-onContainer);--color-secondary-fixed:var(--schmancy-sys-color-secondary-fixed);--color-secondary-fixedDim:var(--schmancy-sys-color-secondary-fixedDim);--color-secondary-fixed-dim:var(--schmancy-sys-color-secondary-fixedDim);--color-secondary-onFixed:var(--schmancy-sys-color-secondary-onFixed);--color-secondary-on-fixed:var(--schmancy-sys-color-secondary-onFixed);--color-secondary-onFixedVariant:var(--schmancy-sys-color-secondary-onFixedVariant);--color-secondary-on-fixed-variant:var(--schmancy-sys-color-secondary-onFixedVariant);--color-tertiary-default:var(--schmancy-sys-color-tertiary-default);--color-tertiary-on:var(--schmancy-sys-color-tertiary-on);--color-tertiary-container:var(--schmancy-sys-color-tertiary-container);--color-tertiary-onContainer:var(--schmancy-sys-color-tertiary-onContainer);--color-tertiary-on-container:var(--schmancy-sys-color-tertiary-onContainer);--color-tertiary-fixed:var(--schmancy-sys-color-tertiary-fixed);--color-tertiary-fixedDim:var(--schmancy-sys-color-tertiary-fixedDim);--color-tertiary-fixed-dim:var(--schmancy-sys-color-tertiary-fixedDim);--color-tertiary-onFixed:var(--schmancy-sys-color-tertiary-onFixed);--color-tertiary-on-fixed:var(--schmancy-sys-color-tertiary-onFixed);--color-tertiary-onFixedVariant:var(--schmancy-sys-color-tertiary-onFixedVariant);--color-tertiary-on-fixed-variant:var(--schmancy-sys-color-tertiary-onFixedVariant);--color-error-default:var(--schmancy-sys-color-error-default);--color-error-on:var(--schmancy-sys-color-error-on);--color-error-container:var(--schmancy-sys-color-error-container);--color-error-onContainer:var(--schmancy-sys-color-error-onContainer);--color-error-on-container:var(--schmancy-sys-color-error-onContainer);--color-success-default:var(--schmancy-sys-color-success-default);--color-success-on:var(--schmancy-sys-color-success-on);--color-success-container:var(--schmancy-sys-color-success-container);--color-success-onContainer:var(--schmancy-sys-color-success-onContainer);--color-success-on-container:var(--schmancy-sys-color-success-onContainer);--color-warning-default:var(--schmancy-sys-color-warning-default);--color-warning-on:var(--schmancy-sys-color-warning-on);--color-warning-container:var(--schmancy-sys-color-warning-container);--color-warning-onContainer:var(--schmancy-sys-color-warning-onContainer);--color-warning-on-container:var(--schmancy-sys-color-warning-onContainer);--color-info-default:var(--schmancy-sys-color-info-default);--color-info-on:var(--schmancy-sys-color-info-on);--color-info-container:var(--schmancy-sys-color-info-container);--color-info-onContainer:var(--schmancy-sys-color-info-onContainer);--color-info-on-container:var(--schmancy-sys-color-info-onContainer);--shadow-xs:0 1px 2px 0 #0000000d;--shadow-sm:0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;--shadow-md:0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;--shadow-lg:0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a;--shadow-xl:0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;--shadow-2xl:var(--schmancy-sys-elevation-5);--outline-1:var(--schmancy-sys-outline-1);--font-sans:ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-serif:ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif;--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-red-50:oklch(97.1% .013 17.38);--color-red-100:oklch(93.6% .032 17.717);--color-red-200:oklch(88.5% .062 18.334);--color-red-300:oklch(80.8% .114 19.571);--color-red-400:oklch(70.4% .191 22.216);--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-red-700:oklch(50.5% .213 27.518);--color-red-800:oklch(44.4% .177 26.899);--color-red-900:oklch(39.6% .141 25.723);--color-red-950:oklch(25.8% .092 26.042);--color-orange-50:oklch(98% .016 73.684);--color-orange-100:oklch(95.4% .038 75.164);--color-orange-200:oklch(90.1% .076 70.697);--color-orange-300:oklch(83.7% .128 66.29);--color-orange-400:oklch(75% .183 55.934);--color-orange-500:oklch(70.5% .213 47.604);--color-orange-600:oklch(64.6% .222 41.116);--color-orange-700:oklch(55.3% .195 38.402);--color-orange-800:oklch(47% .157 37.304);--color-orange-900:oklch(40.8% .123 38.172);--color-orange-950:oklch(26.6% .079 36.259);--color-amber-50:oklch(98.7% .022 95.277);--color-amber-100:oklch(96.2% .059 95.617);--color-amber-200:oklch(92.4% .12 95.746);--color-amber-300:oklch(87.9% .169 91.605);--color-amber-400:oklch(82.8% .189 84.429);--color-amber-500:oklch(76.9% .188 70.08);--color-amber-600:oklch(66.6% .179 58.318);--color-amber-700:oklch(55.5% .163 48.998);--color-amber-800:oklch(47.3% .137 46.201);--color-amber-900:oklch(41.4% .112 45.904);--color-amber-950:oklch(27.9% .077 45.635);--color-yellow-50:oklch(98.7% .026 102.212);--color-yellow-100:oklch(97.3% .071 103.193);--color-yellow-200:oklch(94.5% .129 101.54);--color-yellow-300:oklch(90.5% .182 98.111);--color-yellow-400:oklch(85.2% .199 91.936);--color-yellow-500:oklch(79.5% .184 86.047);--color-yellow-600:oklch(68.1% .162 75.834);--color-yellow-700:oklch(55.4% .135 66.442);--color-yellow-800:oklch(47.6% .114 61.907);--color-yellow-900:oklch(42.1% .095 57.708);--color-yellow-950:oklch(28.6% .066 53.813);--color-lime-50:oklch(98.6% .031 120.757);--color-lime-100:oklch(96.7% .067 122.328);--color-lime-200:oklch(93.8% .127 124.321);--color-lime-300:oklch(89.7% .196 126.665);--color-lime-400:oklch(84.1% .238 128.85);--color-lime-500:oklch(76.8% .233 130.85);--color-lime-600:oklch(64.8% .2 131.684);--color-lime-700:oklch(53.2% .157 131.589);--color-lime-800:oklch(45.3% .124 130.933);--color-lime-900:oklch(40.5% .101 131.063);--color-lime-950:oklch(27.4% .072 132.109);--color-green-50:oklch(98.2% .018 155.826);--color-green-100:oklch(96.2% .044 156.743);--color-green-200:oklch(92.5% .084 155.995);--color-green-300:oklch(87.1% .15 154.449);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-green-600:oklch(62.7% .194 149.214);--color-green-700:oklch(52.7% .154 150.069);--color-green-800:oklch(44.8% .119 151.328);--color-green-900:oklch(39.3% .095 152.535);--color-green-950:oklch(26.6% .065 152.934);--color-emerald-50:oklch(97.9% .021 166.113);--color-emerald-100:oklch(95% .052 163.051);--color-emerald-200:oklch(90.5% .093 164.15);--color-emerald-300:oklch(84.5% .143 164.978);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-500:oklch(69.6% .17 162.48);--color-emerald-600:oklch(59.6% .145 163.225);--color-emerald-700:oklch(50.8% .118 165.612);--color-emerald-800:oklch(43.2% .095 166.913);--color-emerald-900:oklch(37.8% .077 168.94);--color-emerald-950:oklch(26.2% .051 172.552);--color-teal-50:oklch(98.4% .014 180.72);--color-teal-100:oklch(95.3% .051 180.801);--color-teal-200:oklch(91% .096 180.426);--color-teal-300:oklch(85.5% .138 181.071);--color-teal-400:oklch(77.7% .152 181.912);--color-teal-500:oklch(70.4% .14 182.503);--color-teal-600:oklch(60% .118 184.704);--color-teal-700:oklch(51.1% .096 186.391);--color-teal-800:oklch(43.7% .078 188.216);--color-teal-900:oklch(38.6% .063 188.416);--color-teal-950:oklch(27.7% .046 192.524);--color-cyan-50:oklch(98.4% .019 200.873);--color-cyan-100:oklch(95.6% .045 203.388);--color-cyan-200:oklch(91.7% .08 205.041);--color-cyan-300:oklch(86.5% .127 207.078);--color-cyan-400:oklch(78.9% .154 211.53);--color-cyan-500:oklch(71.5% .143 215.221);--color-cyan-600:oklch(60.9% .126 221.723);--color-cyan-700:oklch(52% .105 223.128);--color-cyan-800:oklch(45% .085 224.283);--color-cyan-900:oklch(39.8% .07 227.392);--color-cyan-950:oklch(30.2% .056 229.695);--color-sky-50:oklch(97.7% .013 236.62);--color-sky-100:oklch(95.1% .026 236.824);--color-sky-200:oklch(90.1% .058 230.902);--color-sky-300:oklch(82.8% .111 230.318);--color-sky-400:oklch(74.6% .16 232.661);--color-sky-500:oklch(68.5% .169 237.323);--color-sky-600:oklch(58.8% .158 241.966);--color-sky-700:oklch(50% .134 242.749);--color-sky-800:oklch(44.3% .11 240.79);--color-sky-900:oklch(39.1% .09 240.876);--color-sky-950:oklch(29.3% .066 243.157);--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-200:oklch(88.2% .059 254.128);--color-blue-300:oklch(80.9% .105 251.813);--color-blue-400:oklch(70.7% .165 254.624);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-900:oklch(37.9% .146 265.522);--color-blue-950:oklch(28.2% .091 267.935);--color-indigo-50:oklch(96.2% .018 272.314);--color-indigo-100:oklch(93% .034 272.788);--color-indigo-200:oklch(87% .065 274.039);--color-indigo-300:oklch(78.5% .115 274.713);--color-indigo-400:oklch(67.3% .182 276.935);--color-indigo-500:oklch(58.5% .233 277.117);--color-indigo-600:oklch(51.1% .262 276.966);--color-indigo-700:oklch(45.7% .24 277.023);--color-indigo-800:oklch(39.8% .195 277.366);--color-indigo-900:oklch(35.9% .144 278.697);--color-indigo-950:oklch(25.7% .09 281.288);--color-violet-50:oklch(96.9% .016 293.756);--color-violet-100:oklch(94.3% .029 294.588);--color-violet-200:oklch(89.4% .057 293.283);--color-violet-300:oklch(81.1% .111 293.571);--color-violet-400:oklch(70.2% .183 293.541);--color-violet-500:oklch(60.6% .25 292.717);--color-violet-600:oklch(54.1% .281 293.009);--color-violet-700:oklch(49.1% .27 292.581);--color-violet-800:oklch(43.2% .232 292.759);--color-violet-900:oklch(38% .189 293.745);--color-violet-950:oklch(28.3% .141 291.089);--color-purple-50:oklch(97.7% .014 308.299);--color-purple-100:oklch(94.6% .033 307.174);--color-purple-200:oklch(90.2% .063 306.703);--color-purple-300:oklch(82.7% .119 306.383);--color-purple-400:oklch(71.4% .203 305.504);--color-purple-500:oklch(62.7% .265 303.9);--color-purple-600:oklch(55.8% .288 302.321);--color-purple-700:oklch(49.6% .265 301.924);--color-purple-800:oklch(43.8% .218 303.724);--color-purple-900:oklch(38.1% .176 304.987);--color-purple-950:oklch(29.1% .149 302.717);--color-fuchsia-50:oklch(97.7% .017 320.058);--color-fuchsia-100:oklch(95.2% .037 318.852);--color-fuchsia-200:oklch(90.3% .076 319.62);--color-fuchsia-300:oklch(83.3% .145 321.434);--color-fuchsia-400:oklch(74% .238 322.16);--color-fuchsia-500:oklch(66.7% .295 322.15);--color-fuchsia-600:oklch(59.1% .293 322.896);--color-fuchsia-700:oklch(51.8% .253 323.949);--color-fuchsia-800:oklch(45.2% .211 324.591);--color-fuchsia-900:oklch(40.1% .17 325.612);--color-fuchsia-950:oklch(29.3% .136 325.661);--color-pink-50:oklch(97.1% .014 343.198);--color-pink-100:oklch(94.8% .028 342.258);--color-pink-200:oklch(89.9% .061 343.231);--color-pink-300:oklch(82.3% .12 346.018);--color-pink-400:oklch(71.8% .202 349.761);--color-pink-500:oklch(65.6% .241 354.308);--color-pink-600:oklch(59.2% .249 .584);--color-pink-700:oklch(52.5% .223 3.958);--color-pink-800:oklch(45.9% .187 3.815);--color-pink-900:oklch(40.8% .153 2.432);--color-pink-950:oklch(28.4% .109 3.907);--color-rose-50:oklch(96.9% .015 12.422);--color-rose-100:oklch(94.1% .03 12.58);--color-rose-200:oklch(89.2% .058 10.001);--color-rose-300:oklch(81% .117 11.638);--color-rose-400:oklch(71.2% .194 13.428);--color-rose-500:oklch(64.5% .246 16.439);--color-rose-600:oklch(58.6% .253 17.585);--color-rose-700:oklch(51.4% .222 16.935);--color-rose-800:oklch(45.5% .188 13.697);--color-rose-900:oklch(41% .159 10.272);--color-rose-950:oklch(27.1% .105 12.094);--color-slate-50:oklch(98.4% .003 247.858);--color-slate-100:oklch(96.8% .007 247.896);--color-slate-200:oklch(92.9% .013 255.508);--color-slate-300:oklch(86.9% .022 252.894);--color-slate-400:oklch(70.4% .04 256.788);--color-slate-500:oklch(55.4% .046 257.417);--color-slate-600:oklch(44.6% .043 257.281);--color-slate-700:oklch(37.2% .044 257.287);--color-slate-800:oklch(27.9% .041 260.031);--color-slate-900:oklch(20.8% .042 265.755);--color-slate-950:oklch(12.9% .042 264.695);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-gray-950:oklch(13% .028 261.692);--color-zinc-50:oklch(98.5% 0 0);--color-zinc-100:oklch(96.7% .001 286.375);--color-zinc-200:oklch(92% .004 286.32);--color-zinc-300:oklch(87.1% .006 286.286);--color-zinc-400:oklch(70.5% .015 286.067);--color-zinc-500:oklch(55.2% .016 285.938);--color-zinc-600:oklch(44.2% .017 285.786);--color-zinc-700:oklch(37% .013 285.805);--color-zinc-800:oklch(27.4% .006 286.033);--color-zinc-900:oklch(21% .006 285.885);--color-zinc-950:oklch(14.1% .005 285.823);--color-neutral-50:oklch(98.5% 0 0);--color-neutral-100:oklch(97% 0 0);--color-neutral-200:oklch(92.2% 0 0);--color-neutral-300:oklch(87% 0 0);--color-neutral-400:oklch(70.8% 0 0);--color-neutral-500:oklch(55.6% 0 0);--color-neutral-600:oklch(43.9% 0 0);--color-neutral-700:oklch(37.1% 0 0);--color-neutral-800:oklch(26.9% 0 0);--color-neutral-900:oklch(20.5% 0 0);--color-neutral-950:oklch(14.5% 0 0);--color-stone-50:oklch(98.5% .001 106.423);--color-stone-100:oklch(97% .001 106.424);--color-stone-200:oklch(92.3% .003 48.717);--color-stone-300:oklch(86.9% .005 56.366);--color-stone-400:oklch(70.9% .01 56.259);--color-stone-500:oklch(55.3% .013 58.071);--color-stone-600:oklch(44.4% .011 73.639);--color-stone-700:oklch(37.4% .01 67.558);--color-stone-800:oklch(26.8% .007 34.298);--color-stone-900:oklch(21.6% .006 56.043);--color-stone-950:oklch(14.7% .004 49.25);--color-black:#000;--color-white:#fff;--breakpoint-sm:40rem;--breakpoint-md:48rem;--breakpoint-lg:64rem;--breakpoint-xl:80rem;--breakpoint-2xl:96rem;--container-3xs:16rem;--container-2xs:18rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-lg:32rem;--container-xl:36rem;--container-2xl:42rem;--container-3xl:48rem;--container-4xl:56rem;--container-5xl:64rem;--container-6xl:72rem;--container-7xl:80rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:calc(1.5 / 1);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:calc(2.25 / 1.875);--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-6xl:3.75rem;--text-6xl--line-height:1;--text-7xl:4.5rem;--text-7xl--line-height:1;--text-8xl:6rem;--text-8xl--line-height:1;--text-9xl:8rem;--text-9xl--line-height:1;--font-weight-thin:100;--font-weight-extralight:200;--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--font-weight-black:900;--tracking-tighter:-.05em;--tracking-tight:-.025em;--tracking-normal:0em;--tracking-wide:.025em;--tracking-wider:.05em;--tracking-widest:.1em;--leading-tight:1.25;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--leading-loose:2;--radius-xs:.125rem;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-4xl:2rem;--shadow-smxs:0 1px #0000000d;--shadow-smxl:0 25px 50px -12px #00000040;--inset-shadow-smxs:inset 0 1px #0000000d;--inset-shadow-xs:inset 0 1px 1px #0000000d;--inset-shadow-sm:inset 0 2px 4px #0000000d;--drop-shadow-xs:0 1px 1px #0000000d;--drop-shadow-sm:0 1px 2px #00000026;--drop-shadow-md:0 3px 3px #0000001f;--drop-shadow-lg:0 4px 4px #00000026;--drop-shadow-xl:0 9px 7px #0000001a;--drop-shadow-smxl:0 25px 25px #00000026;--blur-xs:4px;--blur-sm:8px;--blur-md:12px;--blur-lg:16px;--blur-xl:24px;--blur-2xl:40px;--blur-3xl:64px;--perspective-dramatic:100px;--perspective-near:300px;--perspective-normal:500px;--perspective-midrange:800px;--perspective-distant:1200px;--aspect-video:16 / 9;--ease-in:cubic-bezier(.4, 0, 1, 1);--ease-out:cubic-bezier(0, 0, .2, 1);--ease-in-out:cubic-bezier(.4, 0, .2, 1);--animate-spin:spin 1s linear infinite;--animate-ping:ping 1s cubic-bezier(0, 0, .2, 1) infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--animate-bounce:bounce 1s infinite;--animate-float-1:float-drift 20s ease-in-out infinite;--animate-float-2:float-drift-alt 25s ease-in-out infinite;--animate-float-3:float-drift 30s ease-in-out infinite reverse;--animate-pulse-glow:pulse-glow 8s ease-in-out infinite;--animate-spin-slow:slow-spin 120s linear infinite;--animate-aurora-drift:aurora-drift 30s ease-in-out infinite;--animate-scene-enter:scene-enter 1.2s cubic-bezier(.16, 1, .3, 1) forwards;--md-sys-color-scrim:var(--schmancy-sys-color-scrim);--md-sys-color-outline:var(--schmancy-sys-color-outline);--md-sys-color-outlineVariant:var(--schmancy-sys-color-outlineVariant);--md-sys-color-surface-default:var(--schmancy-sys-color-surface-default);--md-sys-color-surface-dim:var(--schmancy-sys-color-surface-dim);--md-sys-color-surface-bright:var(--schmancy-sys-color-surface-bright);--md-sys-color-surface-container:var(--schmancy-sys-color-surface-container);--md-sys-color-surface-low:var(--schmancy-sys-color-surface-low);--md-sys-color-surface-high:var(--schmancy-sys-color-surface-high);--md-sys-color-surface-highest:var(--schmancy-sys-color-surface-highest);--md-sys-color-surface-lowest:var(--schmancy-sys-color-surface-lowest);--md-sys-color-surface-on:var(--schmancy-sys-color-surface-on);--md-sys-color-on-surface-variant:var(--schmancy-sys-color-surface-onVariant);--md-sys-color-on-secondary-container:var(--schmancy-sys-color-secondary-onContainer);--md-sys-color-primary-default:var(--schmancy-sys-color-primary-default);--md-sys-color-primary-on:var(--schmancy-sys-color-primary-on);--md-sys-color-primary-container:var(--schmancy-sys-color-primary-container);--md-sys-color-primary-onContainer:var(--schmancy-sys-color-primary-onContainer);--md-sys-color-secondary-default:var(--schmancy-sys-color-secondary-default);--md-sys-color-secondary-on:var(--schmancy-sys-color-secondary-on);--md-sys-color-secondary-container:var(--schmancy-sys-color-secondary-container);--md-sys-color-secondary-onContainer:var(--schmancy-sys-color-secondary-onContainer);--md-sys-color-tertiary-default:var(--schmancy-sys-color-tertiary-default);--md-sys-color-tertiary-on:var(--schmancy-sys-color-tertiary-on);--md-sys-color-tertiary-container:var(--schmancy-sys-color-tertiary-container);--md-sys-color-tertiary-onContainer:var(--schmancy-sys-color-tertiary-onContainer);--md-sys-color-error-default:var(--schmancy-sys-color-error-default);--md-sys-color-error-on:var(--schmancy-sys-color-error-on);--md-sys-color-error-container:var(--schmancy-sys-color-error-container);--md-sys-color-error-onContainer:var(--schmancy-sys-color-error-onContainer);--md-sys-color-success-default:var(--schmancy-sys-color-success-default);--md-sys-color-success-on:var(--schmancy-sys-color-success-on);--md-sys-color-success-container:var(--schmancy-sys-color-success-container);--md-sys-color-success-onContainer:var(--schmancy-sys-color-success-onContainer);--md-sys-color-warning-default:var(--schmancy-sys-color-warning-default);--md-sys-color-warning-on:var(--schmancy-sys-color-warning-on);--md-sys-color-warning-container:var(--schmancy-sys-color-warning-container);--md-sys-color-warning-onContainer:var(--schmancy-sys-color-warning-onContainer);--md-sys-color-info-default:var(--schmancy-sys-color-info-default);--md-sys-color-info-on:var(--schmancy-sys-color-info-on);--md-sys-color-info-container:var(--schmancy-sys-color-info-container);--md-sys-color-info-onContainer:var(--schmancy-sys-color-info-onContainer);--md-sys-elevation-0:var(--schmancy-sys-elevation-0);--md-sys-elevation-1:var(--schmancy-sys-elevation-1);--md-sys-elevation-2:var(--schmancy-sys-elevation-2);--md-sys-elevation-3:var(--schmancy-sys-elevation-3);--md-sys-elevation-4:var(--schmancy-sys-elevation-4);--md-sys-elevation-5:var(--schmancy-sys-elevation-5);--md-sys-outline-1:var(--schmancy-sys-outline-1);--md-filter-chip-label-text-color:var(--schmancy-sys-color-surface-on);--md-checkbox-focus-outline-color:var(--schmancy-sys-color-surface-on);--md-checkbox-focus-outline-width:2px;--md-checkbox-hover-outline-color:var(--schmancy-sys-color-surface-on);--md-checkbox-hover-outline-width:2px;--md-checkbox-pressed-outline-color:var(--schmancy-sys-color-surface-on);--md-checkbox-pressed-outline-width:2px;--md-checkbox-disabled-outline-color:var(--schmancy-sys-color-surface-on);--md-checkbox-disabled-outline-width:2px}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ping{75%,to{opacity:0;transform:scale(2)}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,to{animation-timing-function:cubic-bezier(.8,0,1,1);transform:translateY(-25%)}50%{animation-timing-function:cubic-bezier(0,0,.2,1);transform:none}}@keyframes float-drift{0%,to{transform:translate(0)rotate(0)}25%{transform:translate(20px,-30px)rotate(2deg)}50%{transform:translate(-10px,-50px)rotate(-1deg)}75%{transform:translate(15px,-20px)rotate(1deg)}}@keyframes float-drift-alt{0%,to{transform:translate(0)rotate(0)}25%{transform:translate(-25px,20px)rotate(-2deg)}50%{transform:translate(15px,40px)rotate(1deg)}75%{transform:translate(-20px,15px)rotate(-1deg)}}@keyframes pulse-glow{0%,to{opacity:.15;transform:scale(1)}50%{opacity:.25;transform:scale(1.05)}}@keyframes slow-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes aurora-drift{0%,to{transform:translate(0)scale(1)rotate(0)}33%{transform:translate(3%,-5%)scale(1.05)rotate(1deg)}66%{transform:translate(-3%,3%)scale(.95)rotate(-1deg)}}@keyframes scene-enter{0%{opacity:0;filter:blur(12px);transform:scale(.92)}to{opacity:1;filter:blur();transform:scale(1)}}@keyframes star-appear{0%{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}@keyframes star-twinkle{0%,to{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.92)}}"), Le = window.matchMedia("(prefers-color-scheme: dark)"), Re = new s((e) => {
	let t = Le.matches ? "dark" : "light";
	e.next(t);
	let n = u(Le, "change").subscribe((t) => {
		let n = t.matches ? "dark" : "light";
		e.next(n);
	});
	return () => n.unsubscribe();
}), Z = class extends r(Ie) {
	constructor(...e) {
		super(...e), this.scheme = "auto", this.root = !1, this.locale = typeof navigator < "u" ? navigator.language : "de-DE", this.theme = {};
	}
	connectedCallback() {
		super.connectedCallback();
		let e = this.generateThemeName(), t = sessionStorage.getItem(`schmancy-theme-${e}-color`), n = sessionStorage.getItem(`schmancy-theme-${e}-scheme`);
		this.color || (this.color = t || this.generateRandomColor(), sessionStorage.setItem(`schmancy-theme-${e}-color`, this.color)), !this.hasAttribute("scheme") && n && (this.scheme = n), d(this.scheme).pipe(f((e) => e === "auto" ? Re : d(e)), p(this.disconnecting)).subscribe((t) => {
			this.scheme = t, queueMicrotask(() => {
				this.registerTheme(), sessionStorage.setItem(`schmancy-theme-${e}-scheme`, this.scheme);
			});
		}), u(this, a).pipe(p(this.disconnecting)).subscribe((e) => {
			e.stopPropagation(), e.preventDefault(), window.dispatchEvent(new CustomEvent(o, {
				detail: { theme: this },
				bubbles: !0,
				composed: !0
			}));
		});
	}
	updated(e) {
		super.updated(e);
		let t = this.generateThemeName();
		e.has("color") && (sessionStorage.setItem(`schmancy-theme-${t}-color`, this.color), this.registerTheme()), e.has("scheme") && (sessionStorage.setItem(`schmancy-theme-${t}-scheme`, this.scheme), this.registerTheme()), e.has("locale") && this.registerTheme();
	}
	registerTheme() {
		let e = Ne(Me(je(typeof this.color == "string" ? this.color : "#6200ee")), this.scheme === "dark", {
			success: je("#4CAF50"),
			warning: je("#FF9800"),
			info: je("#2196F3")
		});
		this.theme = {
			...e,
			...this.theme,
			locale: this.locale
		}, this.registerThemeValues("schmancy", "", this.theme);
		let t = this.root ? document.body : this.shadowRoot.host, n = (e) => t.style.getPropertyValue(e);
		t.style.setProperty("--schmancy-sys-color-surface-low", n("--schmancy-sys-color-surface-containerLow")), t.style.setProperty("--schmancy-sys-color-surface-high", n("--schmancy-sys-color-surface-containerHigh")), t.style.setProperty("--schmancy-sys-color-surface-highest", n("--schmancy-sys-color-surface-containerHighest")), t.style.setProperty("--schmancy-sys-color-surface-lowest", n("--schmancy-sys-color-surface-containerLowest")), t.style.colorScheme = this.scheme === "dark" ? "dark" : "light";
	}
	registerThemeValues(e = "schmancy", t, n) {
		return typeof n == "object" ? Object.keys(n).map((r) => this.registerThemeValues(e, t + (t ? "-" : "") + r, n[r])).join("\n") : void (this.root ? document.body : this.shadowRoot.host).style.setProperty(`--${e}-${t}`, n);
	}
	generateRandomColor() {
		return "#" + Math.floor(16777215 * Math.random()).toString(16).padStart(6, "0");
	}
	generateThemeName() {
		if (this.name) return this.name;
		let e = [], t = this;
		for (; t && t !== document.body;) {
			let n = t.parentElement;
			if (n) {
				let r = Array.from(n.children).indexOf(t), i = t.tagName.toLowerCase();
				e.unshift(`${i}[${r}]`);
			}
			t = n;
		}
		return e.join(">");
	}
	render() {
		return y`
			<schmancy-container type="containerLowest">
				<slot></slot>
			</schmancy-container>
		`;
	}
};
n([g({
	type: String,
	reflect: !0
})], Z.prototype, "color", void 0), n([g({ type: String })], Z.prototype, "scheme", void 0), n([g({ type: Boolean })], Z.prototype, "root", void 0), n([g({ type: String })], Z.prototype, "locale", void 0), n([g({ type: String })], Z.prototype, "name", void 0), n([t({ context: e }), g({ type: Object })], Z.prototype, "theme", void 0), Z = n([h("schmancy-theme")], Z);
var Q = class extends r() {
	constructor(...e) {
		super(...e), this.currentScheme = "auto", this.currentColor = "#6200ee", this.resolvedScheme = "light", this.themeComponent = null, this.colorInput$ = new c();
	}
	get presetColors() {
		return this.customColors ? this.customColors : [
			{
				name: "Lavender",
				value: "#9D8FE8",
				category: "primary"
			},
			{
				name: "Rose",
				value: "#F48B9D",
				category: "accent"
			},
			{
				name: "Mint",
				value: "#7ED997",
				category: "accent"
			},
			{
				name: "Amber",
				value: "#FFC875",
				category: "accent"
			},
			{
				name: "Sky",
				value: "#6DD5FA",
				category: "primary"
			},
			{
				name: "Coral",
				value: "#FF9E7C",
				category: "secondary"
			},
			{
				name: "Indigo",
				value: "#7380E8",
				category: "primary"
			},
			{
				name: "Blush",
				value: "#FF79A8",
				category: "secondary"
			},
			{
				name: "Aqua",
				value: "#64E0F0",
				category: "accent"
			},
			{
				name: "Gold",
				value: "#FFE066",
				category: "accent"
			},
			{
				name: "Slate",
				value: "#6B7E91",
				category: "primary"
			},
			{
				name: "Onyx",
				value: "#3D4451",
				category: "primary"
			},
			{
				name: "Plum",
				value: "#8E6BA8",
				category: "secondary"
			},
			{
				name: "Forest",
				value: "#5A7A5F",
				category: "accent"
			},
			{
				name: "Navy",
				value: "#3D5A80",
				category: "primary"
			},
			{
				name: "Burgundy",
				value: "#994F5E",
				category: "accent"
			}
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.discover("schmancy-theme").pipe(f((e) => e ? (this.themeComponent = e, this.currentScheme = e.scheme, this.currentColor = e.color, new c().pipe(m(() => {
			this.themeComponent && (this.currentScheme = this.themeComponent.scheme, this.currentColor = this.themeComponent.color);
		}))) : d(null)), p(this.disconnecting)).subscribe(), this.colorInput$.pipe(l(150), m((e) => {
			this.themeComponent && (this.themeComponent.color = e);
		}), p(this.disconnecting)).subscribe();
	}
	setScheme(e) {
		this.themeComponent && (this.themeComponent.scheme = e, this.currentScheme = e);
	}
	setColor(e) {
		this.themeComponent && (this.themeComponent.color = e, this.currentColor = e);
	}
	handleColorInput(e) {
		let t = e.target;
		this.colorInput$.next(t.value);
	}
	randomColor() {
		let e = this.presetColors[Math.floor(Math.random() * this.presetColors.length)];
		this.setColor(e.value);
	}
	triggerColorPicker() {
		this.renderRoot.querySelector("input[type=\"color\"]")?.click();
	}
	render() {
		return y`
			<div class="space-y-4">
				<!-- Color Display -->
				<div class="flex items-center gap-3">
					<div
						class="w-16 h-16 rounded-xl border-2 border-outline cursor-pointer transition-transform hover:scale-105 active:scale-95"
						style="background: ${this.currentColor}"
						@click="${this.triggerColorPicker}"
						title="Click to change color"
					></div>
					<div class="flex-1 min-w-0">
						<schmancy-typography type="body" class="font-mono opacity-60"> ${this.currentColor} </schmancy-typography>
						<div class="flex gap-1 mt-2">
							<schmancy-button
								variant="${this.currentScheme === "light" ? "tonal" : "text"}"
								@click="${() => this.setScheme("light")}"
							>
								<schmancy-icon>light_mode</schmancy-icon>
							</schmancy-button>
							<schmancy-button
								variant="${this.currentScheme === "dark" ? "tonal" : "text"}"
								@click="${() => this.setScheme("dark")}"
							>
								<schmancy-icon>dark_mode</schmancy-icon>
							</schmancy-button>
							<schmancy-button
								variant="${this.currentScheme === "auto" ? "tonal" : "text"}"
								@click="${() => this.setScheme("auto")}"
							>
								<schmancy-icon>contrast</schmancy-icon>
							</schmancy-button>
							<schmancy-button variant="text" @click="${this.randomColor}">
								<schmancy-icon>shuffle</schmancy-icon>
							</schmancy-button>
						</div>
					</div>
				</div>

				<!-- Palette -->
				<div class="flex flex-wrap gap-1.5">
					${this.presetColors.map((e) => y`
							<button
								class="w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95 ${this.currentColor === e.value ? "ring-2 ring-primary ring-offset-1" : ""}"
								style="background: ${e.value}"
								@click="${() => this.setColor(e.value)}"
								title="${e.name}"
							></button>
						`)}
				</div>

				<!-- Hidden Color Input -->
				<input type="color" .value="${this.currentColor}" @input="${this.handleColorInput}" class="hidden" />
			</div>
		`;
	}
};
n([_()], Q.prototype, "currentScheme", void 0), n([_()], Q.prototype, "currentColor", void 0), n([_()], Q.prototype, "resolvedScheme", void 0), n([_()], Q.prototype, "themeComponent", void 0), n([g({ type: Array })], Q.prototype, "customColors", void 0), Q = n([h("schmancy-theme-controller")], Q);
var ze = class extends CustomEvent {
	constructor(e) {
		super("schmancy-generate-mood-audio", {
			detail: e,
			bubbles: !0,
			composed: !0
		});
	}
}, $ = class extends r(v`
	:host {
		display: block;
	}
`) {
	constructor(...e) {
		super(...e), this.currentColor = "#6200ee", this.currentScheme = "auto", this.moodText = "", this.isGenerating = !1, this.audioSequence = null, this.detectedMood = "", this.error = "", this.volume = .15, this.currentThemeName = "default", this.themeComponent = null, this.moodInput$ = new c();
	}
	connectedCallback() {
		super.connectedCallback(), i.volume$.pipe(p(this.disconnecting)).subscribe((e) => {
			this.volume = e;
		}), i.themeName$.pipe(p(this.disconnecting)).subscribe((e) => {
			this.currentThemeName = e;
		}), i.theme$.pipe(p(this.disconnecting)).subscribe((e) => {
			e && (this.detectedMood = e.name.replace("AI: ", ""));
		}), this.discover("schmancy-theme").pipe(f((e) => e ? (this.themeComponent = e, this.currentScheme = e.scheme, this.currentColor = e.color, new c().pipe(m(() => {
			this.themeComponent && (this.currentScheme = this.themeComponent.scheme, this.currentColor = this.themeComponent.color);
		}))) : d(null)), p(this.disconnecting)).subscribe(), this.moodInput$.pipe(l(500), m((e) => {
			this.moodText = e;
		}), p(this.disconnecting)).subscribe();
	}
	handleMoodInput(e) {
		let t = e.target;
		this.moodInput$.next(t.value);
	}
	requestMoodAudio() {
		this.moodText.trim() ? (this.error = "", this.isGenerating = !0, this.audioSequence = null, this.detectedMood = "", this.dispatchEvent(new ze({
			moodText: this.moodText.trim(),
			themeColor: this.currentColor,
			scheme: this.currentScheme
		}))) : this.error = "Please enter how you are feeling";
	}
	setResponse(e) {
		if (this.isGenerating = !1, e.success && e.audioSequence) {
			this.audioSequence = e.audioSequence, this.detectedMood = e.detectedMood;
			let t = this.audioSequenceToSoundTheme(e.audioSequence, e.detectedMood);
			i.setTheme(t), this.playDetectedMood(e.detectedMood);
		} else this.error = e.error || "Failed to generate audio";
	}
	audioSequenceToSoundTheme(e, t) {
		let n = this.mapMoodToFeeling(t);
		return {
			name: `AI: ${t}`,
			description: e.emotionalDescription,
			masterVolume: e.masterVolume,
			feelings: { [n]: {
				puffs: e.puffs,
				tones: e.tones,
				description: e.emotionalDescription
			} },
			metadata: {
				sourceColor: this.currentColor,
				sourceMood: this.moodText,
				scheme: this.currentScheme,
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				generatedBy: "AI"
			}
		};
	}
	mapMoodToFeeling(e) {
		let t = e.toLowerCase().trim(), n = {
			joyful: "joyful",
			happy: "joyful",
			joy: "joyful",
			content: "content",
			satisfied: "content",
			excited: "excited",
			thrilled: "excited",
			proud: "proud",
			hopeful: "hopeful",
			relieved: "relieved",
			grateful: "grateful",
			thankful: "grateful",
			peaceful: "peaceful",
			serene: "peaceful",
			playful: "playful",
			amused: "amused",
			curious: "curious",
			interested: "curious",
			inspired: "inspired",
			confident: "confident",
			loved: "loved",
			comforted: "comforted",
			energized: "energized",
			celebrated: "celebrated",
			sad: "sad",
			unhappy: "sad",
			lonely: "lonely",
			alone: "lonely",
			disappointed: "disappointed",
			melancholic: "melancholic",
			anxious: "anxious",
			worried: "worried",
			nervous: "nervous",
			stressed: "stressed",
			overwhelmed: "overwhelmed",
			annoyed: "annoyed",
			frustrated: "frustrated",
			angry: "angry",
			tired: "tired",
			exhausted: "exhausted",
			bored: "bored",
			calm: "calm",
			relaxed: "relaxed",
			connected: "connected",
			nostalgic: "nostalgic",
			surprised: "surprised",
			confused: "confused"
		};
		if (n[t]) return n[t];
		for (let [e, r] of Object.entries(n)) if (t.includes(e)) return r;
		return "calm";
	}
	playDetectedMood(e) {
		let t = this.mapMoodToFeeling(e);
		i.play(t);
	}
	setError(e) {
		this.isGenerating = !1, this.error = e;
	}
	replay() {
		this.detectedMood && this.playDetectedMood(this.detectedMood);
	}
	handleVolumeChange(e) {
		let t = parseInt(e.target.value) / 100;
		i.setVolume(t);
	}
	resetToDefaults() {
		i.resetTheme(), this.audioSequence = null, this.detectedMood = "";
	}
	render() {
		return y`
			<div class="space-y-4">
				<!-- Current Theme Status -->
				<div class="flex items-center justify-between">
					<schmancy-typography type="label" token="sm" class="opacity-60">
						Sound Theme: ${this.currentThemeName}
					</schmancy-typography>
					${x(this.currentThemeName !== "default", () => y`
							<schmancy-button variant="text" size="sm" @click=${() => this.resetToDefaults()}>
								<schmancy-icon size="16px">refresh</schmancy-icon>
								Reset
							</schmancy-button>
						`)}
				</div>

				<!-- Mood Input -->
				<div class="space-y-2">
					<schmancy-typography type="label" token="lg" class="text-surface-on">
						How are you feeling today?
					</schmancy-typography>
					<schmancy-input
						type="text"
						placeholder="I'm feeling..."
						.value=${this.moodText}
						@input=${this.handleMoodInput}
						?disabled=${this.isGenerating}
						class="w-full"
					></schmancy-input>
				</div>

				<!-- Current Color Preview -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg border border-outline" style="background: ${this.currentColor}"></div>
					<schmancy-typography type="body" token="sm" class="opacity-60"> Current theme color </schmancy-typography>
				</div>

				<!-- Generate Button -->
				<schmancy-button
					variant="filled"
					@click=${() => this.requestMoodAudio()}
					?disabled=${this.isGenerating || !this.moodText.trim()}
					class="w-full"
				>
					${x(this.isGenerating, () => y`
							<schmancy-progress-circular indeterminate size="20"></schmancy-progress-circular>
							<span class="ml-2">Generating...</span>
						`, () => y`
							<schmancy-icon>music_note</schmancy-icon>
							<span class="ml-2">Generate Mood Sound</span>
						`)}
				</schmancy-button>

				<!-- Error Message -->
				${x(this.error, () => y`
						<schmancy-surface type="error" class="p-3 rounded-lg">
							<schmancy-typography type="body" token="sm" class="text-error"> ${this.error} </schmancy-typography>
						</schmancy-surface>
					`)}

				<!-- Generated Audio Info -->
				${x(this.audioSequence, () => y`
						<schmancy-surface type="subtle" rounded="all" class="p-4 space-y-3">
							<div class="flex items-center justify-between">
								<div>
									<schmancy-typography type="label" token="lg"> ${this.detectedMood} </schmancy-typography>
									<schmancy-typography type="body" token="sm" class="opacity-70">
										${this.audioSequence?.emotionalDescription}
									</schmancy-typography>
								</div>
								<schmancy-button variant="tonal" @click=${() => this.replay()}>
									<schmancy-icon>replay</schmancy-icon>
								</schmancy-button>
							</div>

							<!-- Audio Visualization -->
							<div class="flex items-center gap-1 h-8">
								${this.audioSequence?.puffs.map((e, t) => y`
										<div
											class="w-2 bg-primary rounded-full animate-pulse"
											style="height: ${20 + 8 * t}px; animation-delay: ${.1 * t}s"
										></div>
									`)}
								${this.audioSequence?.tones.map((e) => y`
										<div
											class="w-1 bg-secondary rounded-full"
											style="height: ${Math.min(32, e.frequency / 40)}px; opacity: ${.5 + .5 * e.volume}"
										></div>
									`)}
							</div>

							<!-- Volume Control -->
							<div class="flex items-center gap-2">
								<schmancy-icon class="opacity-50">volume_down</schmancy-icon>
								<input
									type="range"
									min="0"
									max="100"
									.value=${String(100 * this.volume)}
									@input=${this.handleVolumeChange}
									class="flex-1 h-1 bg-surface-containerHighest rounded-full appearance-none cursor-pointer"
								/>
								<schmancy-icon class="opacity-50">volume_up</schmancy-icon>
							</div>
						</schmancy-surface>
					`)}
			</div>
		`;
	}
};
n([_()], $.prototype, "currentColor", void 0), n([_()], $.prototype, "currentScheme", void 0), n([_()], $.prototype, "moodText", void 0), n([_()], $.prototype, "isGenerating", void 0), n([_()], $.prototype, "audioSequence", void 0), n([_()], $.prototype, "detectedMood", void 0), n([_()], $.prototype, "error", void 0), n([_()], $.prototype, "volume", void 0), n([_()], $.prototype, "currentThemeName", void 0), $ = n([h("schmancy-theme-audio-player")], $);
var Be = class extends Q {
	render() {
		return y`
			<schmancy-boat id="schmancy-theme-component">
				<schmancy-icon slot="header">palette</schmancy-icon>

				<div class="p-4 space-y-6">
					${super.render()}

					<!-- Audio Player Section -->
					<schmancy-divider></schmancy-divider>
					<schmancy-theme-audio-player></schmancy-theme-audio-player>
				</div>
			</schmancy-boat>
		`;
	}
};
Be = n([h("schmancy-theme-controller-boat")], Be);
export { Z as a, Pe as c, Q as i, Ne as l, ze as n, Ie as o, $ as r, Fe as s, Be as t };
