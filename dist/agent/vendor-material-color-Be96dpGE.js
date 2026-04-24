function e(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function t(e, t, n) {
	return (1 - n) * e + n * t;
}
function n(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function r(e) {
	return (e %= 360) < 0 && (e += 360), e;
}
function i(e) {
	return (e %= 360) < 0 && (e += 360), e;
}
function a(e, t) {
	return 180 - Math.abs(Math.abs(e - t) - 180);
}
function o(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
var s = [
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
], c = [
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
], l = [
	95.047,
	100,
	108.883
];
function u(e, t, n) {
	return (255 << 24 | (255 & e) << 16 | (255 & t) << 8 | 255 & n) >>> 0;
}
function d(e) {
	return u(y(e[0]), y(e[1]), y(e[2]));
}
function f(e) {
	return e >> 16 & 255;
}
function p(e) {
	return e >> 8 & 255;
}
function m(e) {
	return 255 & e;
}
function h(e) {
	let t = function(e) {
		return o([
			v(f(e)),
			v(p(e)),
			v(m(e))
		], s);
	}(e)[1];
	return 116 * b(t / 100) - 16;
}
function g(e) {
	return 100 * function(e) {
		let t = e * e * e;
		return t > 216 / 24389 ? t : (116 * e - 16) / 903.2962962962963;
	}((e + 16) / 116);
}
function _(e) {
	return 116 * b(e / 100) - 16;
}
function v(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : 100 * ((t + .055) / 1.055) ** 2.4;
}
function y(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, r = 0, i = 255, (a = Math.round(255 * n)) < r ? r : a > i ? i : a;
	var r, i, a;
}
function b(e) {
	return e > 216 / 24389 ? e ** (1 / 3) : (24389 / 27 * e + 16) / 116;
}
var x = class e {
	static make(n = function() {
		return l;
	}(), r = 200 / Math.PI * g(50) / 100, i = 50, a = 2, o = !1) {
		let s = n, c = .401288 * s[0] + .650173 * s[1] + -.051461 * s[2], u = -.250268 * s[0] + 1.204414 * s[1] + .045854 * s[2], d = -.002079 * s[0] + .048952 * s[1] + .953127 * s[2], f = .8 + a / 10, p = f >= .9 ? t(.59, .69, 10 * (f - .9)) : t(.525, .59, 10 * (f - .8)), m = o ? 1 : f * (1 - 1 / 3.6 * Math.exp((-r - 42) / 92));
		m = m > 1 ? 1 : m < 0 ? 0 : m;
		let h = f, _ = [
			100 / c * m + 1 - m,
			100 / u * m + 1 - m,
			100 / d * m + 1 - m
		], v = 1 / (5 * r + 1), y = v * v * v * v, b = 1 - y, x = y * r + .1 * b * b * Math.cbrt(5 * r), S = g(i) / n[1], C = 1.48 + Math.sqrt(S), w = .725 / S ** .2, T = w, E = [
			(x * _[0] * c / 100) ** .42,
			(x * _[1] * u / 100) ** .42,
			(x * _[2] * d / 100) ** .42
		], D = [
			400 * E[0] / (E[0] + 27.13),
			400 * E[1] / (E[1] + 27.13),
			400 * E[2] / (E[2] + 27.13)
		];
		return new e(S, (2 * D[0] + D[1] + .05 * D[2]) * w, w, T, p, h, _, x, x ** .25, C);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
x.DEFAULT = x.make();
var S = class t {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(e) {
		return t.fromIntInViewingConditions(e, x.DEFAULT);
	}
	static fromIntInViewingConditions(n, r) {
		let a = (65280 & n) >> 8, o = 255 & n, s = v((16711680 & n) >> 16), c = v(a), l = v(o), u = .41233895 * s + .35762064 * c + .18051042 * l, d = .2126 * s + .7152 * c + .0722 * l, f = .01932141 * s + .11916382 * c + .95034478 * l, p = .401288 * u + .650173 * d - .051461 * f, m = -.250268 * u + 1.204414 * d + .045854 * f, h = -.002079 * u + .048952 * d + .953127 * f, g = r.rgbD[0] * p, _ = r.rgbD[1] * m, y = r.rgbD[2] * h, b = (r.fl * Math.abs(g) / 100) ** .42, x = (r.fl * Math.abs(_) / 100) ** .42, S = (r.fl * Math.abs(y) / 100) ** .42, C = 400 * e(g) * b / (b + 27.13), w = 400 * e(_) * x / (x + 27.13), T = 400 * e(y) * S / (S + 27.13), E = (11 * C + -12 * w + T) / 11, D = (C + w - 2 * T) / 9, O = (20 * C + 20 * w + 21 * T) / 20, k = (40 * C + 20 * w + T) / 20, A = i(180 * Math.atan2(D, E) / Math.PI), j = A * Math.PI / 180, M = 100 * (k * r.nbb / r.aw) ** +(r.c * r.z), N = 4 / r.c * Math.sqrt(M / 100) * (r.aw + 4) * r.fLRoot, P = A < 20.14 ? A + 360 : A, F = (5e4 / 13 * (.25 * (Math.cos(P * Math.PI / 180 + 2) + 3.8)) * r.nc * r.ncb * Math.sqrt(E * E + D * D) / (O + .305)) ** .9 * (1.64 - .29 ** r.n) ** .73, I = F * Math.sqrt(M / 100), L = I * r.fLRoot, R = 50 * Math.sqrt(F * r.c / (r.aw + 4)), z = 1.7000000000000002 * M / (1 + .007 * M), B = 1 / .0228 * Math.log(1 + .0228 * L);
		return new t(A, I, M, N, L, R, z, B * Math.cos(j), B * Math.sin(j));
	}
	static fromJch(e, n, r) {
		return t.fromJchInViewingConditions(e, n, r, x.DEFAULT);
	}
	static fromJchInViewingConditions(e, n, r, i) {
		let a = 4 / i.c * Math.sqrt(e / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(e / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = 1.7000000000000002 * e / (1 + .007 * e), d = 1 / .0228 * Math.log(1 + .0228 * o);
		return new t(r, n, e, a, o, c, u, d * Math.cos(l), d * Math.sin(l));
	}
	static fromUcs(e, n, r) {
		return t.fromUcsInViewingConditions(e, n, r, x.DEFAULT);
	}
	static fromUcsInViewingConditions(e, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(.0228 * s) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = e / (1 - .007 * (e - 100));
		return t.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(x.DEFAULT);
	}
	viewed(t) {
		let n = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** t.n) ** .73) ** (1 / .9), r = this.hue * Math.PI / 180, i = .25 * (Math.cos(r + 2) + 3.8), a = t.aw * (this.j / 100) ** (1 / t.c / t.z), o = 5e4 / 13 * i * t.nc * t.ncb, s = a / t.nbb, l = Math.sin(r), d = Math.cos(r), f = 23 * (s + .305) * n / (23 * o + 11 * n * d + 108 * n * l), p = f * d, m = f * l, h = (460 * s + 451 * p + 288 * m) / 1403, g = (460 * s - 891 * p - 261 * m) / 1403, _ = (460 * s - 220 * p - 6300 * m) / 1403, v = Math.max(0, 27.13 * Math.abs(h) / (400 - Math.abs(h))), b = e(h) * (100 / t.fl) * v ** (1 / .42), x = Math.max(0, 27.13 * Math.abs(g) / (400 - Math.abs(g))), S = e(g) * (100 / t.fl) * x ** (1 / .42), C = Math.max(0, 27.13 * Math.abs(_) / (400 - Math.abs(_))), w = e(_) * (100 / t.fl) * C ** (1 / .42), T = b / t.rgbD[0], E = S / t.rgbD[1], D = w / t.rgbD[2];
		return function(e, t, n) {
			let r = c, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
			return u(y(i), y(a), y(o));
		}(1.86206786 * T - 1.01125463 * E + .14918677 * D, .38752654 * T + .62144744 * E - .00897398 * D, -.0158415 * T - .03412294 * E + 1.04996444 * D);
	}
	static fromXyzInViewingConditions(n, r, i, a) {
		let o = .401288 * n + .650173 * r - .051461 * i, s = -.250268 * n + 1.204414 * r + .045854 * i, c = -.002079 * n + .048952 * r + .953127 * i, l = a.rgbD[0] * o, u = a.rgbD[1] * s, d = a.rgbD[2] * c, f = (a.fl * Math.abs(l) / 100) ** .42, p = (a.fl * Math.abs(u) / 100) ** .42, m = (a.fl * Math.abs(d) / 100) ** .42, h = 400 * e(l) * f / (f + 27.13), g = 400 * e(u) * p / (p + 27.13), _ = 400 * e(d) * m / (m + 27.13), v = (11 * h + -12 * g + _) / 11, y = (h + g - 2 * _) / 9, b = (20 * h + 20 * g + 21 * _) / 20, x = (40 * h + 20 * g + _) / 20, S = 180 * Math.atan2(y, v) / Math.PI, C = S < 0 ? S + 360 : S >= 360 ? S - 360 : S, w = C * Math.PI / 180, T = 100 * (x * a.nbb / a.aw) ** +(a.c * a.z), E = 4 / a.c * Math.sqrt(T / 100) * (a.aw + 4) * a.fLRoot, D = C < 20.14 ? C + 360 : C, O = (5e4 / 13 * (1 / 4 * (Math.cos(D * Math.PI / 180 + 2) + 3.8)) * a.nc * a.ncb * Math.sqrt(v * v + y * y) / (b + .305)) ** .9 * (1.64 - .29 ** a.n) ** .73, k = O * Math.sqrt(T / 100), A = k * a.fLRoot, j = 50 * Math.sqrt(O * a.c / (a.aw + 4)), M = 1.7000000000000002 * T / (1 + .007 * T), N = Math.log(1 + .0228 * A) / .0228;
		return new t(C, k, T, E, A, j, M, N * Math.cos(w), N * Math.sin(w));
	}
	xyzInViewingConditions(t) {
		let n = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** t.n) ** .73) ** (1 / .9), r = this.hue * Math.PI / 180, i = .25 * (Math.cos(r + 2) + 3.8), a = t.aw * (this.j / 100) ** (1 / t.c / t.z), o = 5e4 / 13 * i * t.nc * t.ncb, s = a / t.nbb, c = Math.sin(r), l = Math.cos(r), u = 23 * (s + .305) * n / (23 * o + 11 * n * l + 108 * n * c), d = u * l, f = u * c, p = (460 * s + 451 * d + 288 * f) / 1403, m = (460 * s - 891 * d - 261 * f) / 1403, h = (460 * s - 220 * d - 6300 * f) / 1403, g = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), _ = e(p) * (100 / t.fl) * g ** (1 / .42), v = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), y = e(m) * (100 / t.fl) * v ** (1 / .42), b = Math.max(0, 27.13 * Math.abs(h) / (400 - Math.abs(h))), x = e(h) * (100 / t.fl) * b ** (1 / .42), S = _ / t.rgbD[0], C = y / t.rgbD[1], w = x / t.rgbD[2];
		return [
			1.86206786 * S - 1.01125463 * C + .14918677 * w,
			.38752654 * S + .62144744 * C - .00897398 * w,
			-.0158415 * S - .03412294 * C + 1.04996444 * w
		];
	}
}, C = class t {
	static sanitizeRadians(e) {
		return (e + 8 * Math.PI) % (2 * Math.PI);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, 255 * n;
	}
	static chromaticAdaptation(t) {
		let n = Math.abs(t) ** .42;
		return 400 * e(t) * n / (n + 27.13);
	}
	static hueOf(e) {
		let n = o(e, t.SCALED_DISCOUNT_FROM_LINRGB), r = t.chromaticAdaptation(n[0]), i = t.chromaticAdaptation(n[1]), a = t.chromaticAdaptation(n[2]), s = (11 * r + -12 * i + a) / 11, c = (r + i - 2 * a) / 9;
		return Math.atan2(c, s);
	}
	static areInCyclicOrder(e, n, r) {
		return t.sanitizeRadians(n - e) < t.sanitizeRadians(r - e);
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
	static setCoordinate(e, n, r, i) {
		let a = t.intercept(e[i], n, r[i]);
		return t.lerpPoint(e, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(e, n) {
		let r = t.Y_FROM_LINRGB[0], i = t.Y_FROM_LINRGB[1], a = t.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (e - n * i - c * a) / r;
			return t.isBounded(l) ? [
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
			let n = o, c = s, l = (e - c * r - n * a) / i;
			return t.isBounded(l) ? [
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
			let n = o, c = s, l = (e - n * r - c * i) / a;
			return t.isBounded(l) ? [
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
	static bisectToSegment(e, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = t.nthVertex(e, l);
			if (u[0] < 0) continue;
			let d = t.hueOf(u);
			s ? (c || t.areInCyclicOrder(a, d, o)) && (c = !1, t.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d)) : (r = u, i = u, a = d, o = d, s = !0);
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
	static bisectToLimit(e, n) {
		let r = t.bisectToSegment(e, n), i = r[0], a = t.hueOf(i), o = r[1];
		for (let e = 0; e < 3; e++) if (i[e] !== o[e]) {
			let r = -1, s = 255;
			i[e] < o[e] ? (r = t.criticalPlaneBelow(t.trueDelinearized(i[e])), s = t.criticalPlaneAbove(t.trueDelinearized(o[e]))) : (r = t.criticalPlaneAbove(t.trueDelinearized(i[e])), s = t.criticalPlaneBelow(t.trueDelinearized(o[e])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = t.CRITICAL_PLANES[c], u = t.setCoordinate(i, l, o, e), d = t.hueOf(u);
				t.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return t.midpoint(i, o);
	}
	static inverseChromaticAdaptation(t) {
		let n = Math.abs(t), r = Math.max(0, 27.13 * n / (400 - n));
		return e(t) * r ** (1 / .42);
	}
	static findResultByJ(e, n, r) {
		let i = 11 * Math.sqrt(r), a = x.DEFAULT, s = 1 / (1.64 - .29 ** a.n) ** .73, c = .25 * (Math.cos(e + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, l = Math.sin(e), u = Math.cos(e);
		for (let e = 0; e < 5; e++) {
			let f = i / 100, p = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(f)) * s) ** (1 / .9), m = a.aw * f ** (1 / a.c / a.z) / a.nbb, h = 23 * (m + .305) * p / (23 * c + 11 * p * u + 108 * p * l), g = h * u, _ = h * l, v = (460 * m + 451 * g + 288 * _) / 1403, y = (460 * m - 891 * g - 261 * _) / 1403, b = (460 * m - 220 * g - 6300 * _) / 1403, x = o([
				t.inverseChromaticAdaptation(v),
				t.inverseChromaticAdaptation(y),
				t.inverseChromaticAdaptation(b)
			], t.LINRGB_FROM_SCALED_DISCOUNT);
			if (x[0] < 0 || x[1] < 0 || x[2] < 0) return 0;
			let S = t.Y_FROM_LINRGB[0], C = t.Y_FROM_LINRGB[1], w = t.Y_FROM_LINRGB[2], T = S * x[0] + C * x[1] + w * x[2];
			if (T <= 0) return 0;
			if (e === 4 || Math.abs(T - r) < .002) return x[0] > 100.01 || x[1] > 100.01 || x[2] > 100.01 ? 0 : d(x);
			i -= (T - r) * i / (2 * T);
		}
		return 0;
	}
	static solveToInt(e, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return function(e) {
			let t = y(g(e));
			return u(t, t, t);
		}(r);
		let a = (e = i(e)) / 180 * Math.PI, o = g(r), s = t.findResultByJ(a, n, o);
		return s === 0 ? d(t.bisectToLimit(o, a)) : s;
	}
	static solveToCam(e, n, r) {
		return S.fromInt(t.solveToInt(e, n, r));
	}
};
C.SCALED_DISCOUNT_FROM_LINRGB = [
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
], C.LINRGB_FROM_SCALED_DISCOUNT = [
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
], C.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], C.CRITICAL_PLANES = [
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
var w = class e {
	static from(t, n, r) {
		return new e(C.solveToInt(t, n, r));
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
		this.setInternalState(C.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(C.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(C.solveToInt(this.internalHue, this.internalChroma, e));
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
		let t = S.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = h(e), this.argb = e;
	}
	setInternalState(e) {
		let t = S.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = h(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = S.fromInt(this.toInt()).xyzInViewingConditions(t), r = S.fromXyzInViewingConditions(n[0], n[1], n[2], x.make());
		return e.from(r.hue, r.chroma, _(n[1]));
	}
}, T = class e {
	static harmonize(e, t) {
		let n = w.fromInt(e), r = w.fromInt(t), o = a(n.hue, r.hue), s = Math.min(.5 * o, 15), c = i(n.hue + s * (l = n.hue, i(r.hue - l) <= 180 ? 1 : -1));
		var l;
		return w.from(c, n.chroma, n.tone).toInt();
	}
	static hctHue(t, n, r) {
		let i = e.cam16Ucs(t, n, r), a = S.fromInt(i), o = S.fromInt(t);
		return w.from(a.hue, o.chroma, h(t)).toInt();
	}
	static cam16Ucs(e, t, n) {
		let r = S.fromInt(e), i = S.fromInt(t), a = r.jstar, o = r.astar, s = r.bstar, c = a + (i.jstar - a) * n, l = o + (i.astar - o) * n, u = s + (i.bstar - s) * n;
		return S.fromUcs(c, l, u).toInt();
	}
}, E = class e {
	static ratioOfTones(t, r) {
		return t = n(0, 100, t), r = n(0, 100, r), e.ratioOfYs(g(t), g(r));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t;
		return (n + 5) / ((n === t ? e : t) + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = g(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = _(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = g(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = _(i) - .4;
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
}, D = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? w.from(t.hue, t.chroma, 70) : t;
	}
};
function O(e, t, n) {
	return function(e, t, n) {
		if (e.name !== n.name) throw Error(`Attempting to extend color ${e.name} with color ${n.name} of different name for spec version ${t}.`);
		if (e.isBackground !== n.isBackground) throw Error(`Attempting to extend color ${e.name} as a ${e.isBackground ? "background" : "foreground"} with color ${n.name} as a ${n.isBackground ? "background" : "foreground"} for spec version ${t}.`);
	}(e, t, n), k.fromPalette({
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
var k = class e {
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
		let n = M(e.specVersion).getHct(e, this);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, n), n;
	}
	getTone(e) {
		return M(e.specVersion).getTone(e, this);
	}
	static foregroundTone(t, n) {
		let r = E.lighterUnsafe(t, n), i = E.darkerUnsafe(t, n), a = E.ratioOfTones(r, t), o = E.ratioOfTones(i, t);
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
}, A = new class {
	getHct(e, t) {
		let n = t.getTone(e);
		return t.palette(e).getHct(n);
	}
	getTone(e, t) {
		let r = e.contrastLevel < 0, i = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (i) {
			let a = i.roleA, o = i.roleB, s = i.delta, c = i.polarity, l = i.stayTogether, u = c === "nearer" || c === "lighter" && !e.isDark || c === "darker" && e.isDark, d = u ? a : o, f = u ? o : a, p = t.name === d.name, m = e.isDark ? 1 : -1, h = d.tone(e), g = f.tone(e);
			if (t.background && d.contrastCurve && f.contrastCurve) {
				let n = t.background(e), i = d.contrastCurve(e), a = f.contrastCurve(e);
				if (n && i && a) {
					let t = n.getTone(e), o = i.get(e.contrastLevel), s = a.get(e.contrastLevel);
					E.ratioOfTones(t, h) < o && (h = k.foregroundTone(t, o)), E.ratioOfTones(t, g) < s && (g = k.foregroundTone(t, s)), r && (h = k.foregroundTone(t, o), g = k.foregroundTone(t, s));
				}
			}
			return (g - h) * m < s && (g = n(0, 100, h + s * m), (g - h) * m >= s || (h = n(0, 100, g - s * m))), 50 <= h && h < 60 ? m > 0 ? (h = 60, g = Math.max(g, h + s * m)) : (h = 49, g = Math.min(g, h + s * m)) : 50 <= g && g < 60 && (l ? m > 0 ? (h = 60, g = Math.max(g, h + s * m)) : (h = 49, g = Math.min(g, h + s * m)) : g = m > 0 ? 60 : 49), p ? h : g;
		}
		{
			let n = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return n;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (E.ratioOfTones(i, n) >= a || (n = k.foregroundTone(i, a)), r && (n = k.foregroundTone(i, a)), t.isBackground && 50 <= n && n < 60 && (n = E.ratioOfTones(49, i) >= a ? 49 : 60), t.secondBackground == null || t.secondBackground(e) === void 0) return n;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (E.ratioOfTones(u, n) >= a && E.ratioOfTones(d, n) >= a) return n;
			let f = E.lighter(u, a), p = E.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), k.tonePrefersLightForeground(c) || k.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}(), j = new class {
	getHct(e, t) {
		let n = t.palette(e), r = t.getTone(e), i = n.hue, a = n.chroma * (t.chromaMultiplier ? t.chromaMultiplier(e) : 1);
		return w.from(i, a, r);
	}
	getTone(e, t) {
		let r = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (r) {
			let i = r.roleA, a = r.roleB, o = r.polarity, s = r.constraint, c = o === "darker" || o === "relative_lighter" && e.isDark || o === "relative_darker" && !e.isDark ? -r.delta : r.delta, l = t.name === i.name, u = l ? a : i, d = (l ? i : a).tone(e), f = u.getTone(e), p = c * (l ? 1 : -1);
			if (s === "exact" ? d = n(0, 100, f + p) : s === "nearer" ? d = n(0, 100, p > 0 ? n(f, f + p, d) : n(f + p, f, d)) : s === "farther" && (d = p > 0 ? n(f + p, 100, d) : n(0, f + p, d)), t.background && t.contrastCurve) {
				let n = t.background(e), r = t.contrastCurve(e);
				if (n && r) {
					let t = n.getTone(e), i = r.get(e.contrastLevel);
					d = E.ratioOfTones(t, d) >= i && e.contrastLevel >= 0 ? d : k.foregroundTone(t, i);
				}
			}
			return t.isBackground && !t.name.endsWith("_fixed_dim") && (d = d >= 57 ? n(65, 100, d) : n(0, 49, d)), d;
		}
		{
			let r = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return r;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (r = E.ratioOfTones(i, r) >= a && e.contrastLevel >= 0 ? r : k.foregroundTone(i, a), t.isBackground && !t.name.endsWith("_fixed_dim") && (r = r >= 57 ? n(65, 100, r) : n(0, 49, r)), t.secondBackground == null || t.secondBackground(e) === void 0) return r;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (E.ratioOfTones(u, r) >= a && E.ratioOfTones(d, r) >= a) return r;
			let f = E.lighter(u, a), p = E.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), k.tonePrefersLightForeground(c) || k.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}();
function M(e) {
	return e === "2025" ? j : A;
}
var N, P = class e {
	static fromInt(t) {
		let n = w.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		return new e(t, n, new F(t, n).create());
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = e == 99 && w.isYellow(this.hue) ? this.averageArgb(this.tone(98), this.tone(100)) : w.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return w.fromInt(this.tone(e));
	}
	averageArgb(e, t) {
		let n = e >>> 16 & 255, r = e >>> 8 & 255, i = 255 & e, a = t >>> 16 & 255, o = t >>> 8 & 255, s = 255 & t;
		return (255 << 24 | (255 & Math.round((n + a) / 2)) << 16 | (255 & Math.round((r + o) / 2)) << 8 | 255 & Math.round((i + s) / 2)) >>> 0;
	}
}, F = class {
	constructor(e, t) {
		this.hue = e, this.requestedChroma = t, this.chromaCache = /* @__PURE__ */ new Map(), this.maxChromaValue = 200;
	}
	create() {
		let e = 0, t = 100;
		for (; e < t;) {
			let n = Math.floor((e + t) / 2), r = this.maxChroma(n) < this.maxChroma(n + 1);
			if (this.maxChroma(n) >= this.requestedChroma - .01) if (Math.abs(e - 50) < Math.abs(t - 50)) t = n;
			else {
				if (e === n) return w.from(this.hue, this.requestedChroma, e);
				e = n;
			}
			else r ? e = n + 1 : t = n;
		}
		return w.from(this.hue, this.requestedChroma, e);
	}
	maxChroma(e) {
		if (this.chromaCache.has(e)) return this.chromaCache.get(e);
		let t = w.from(this.hue, this.maxChromaValue, e).chroma;
		return this.chromaCache.set(e, t), t;
	}
}, I = class e {
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
		let n = Math.round(this.input.hue), i = this.hctsByHue[n], a = this.relativeTemperature(i), o = [i], s = 0;
		for (let e = 0; e < 360; e++) {
			let t = r(n + e), i = this.hctsByHue[t], o = this.relativeTemperature(i), c = Math.abs(o - a);
			a = o, s += c;
		}
		let c = 1, l = s / t, u = 0;
		for (a = this.relativeTemperature(i); o.length < t;) {
			let e = r(n + c), i = this.hctsByHue[e], s = this.relativeTemperature(i);
			u += Math.abs(s - a);
			let d = u >= o.length * l, f = 1;
			for (; d && o.length < t;) o.push(i), d = u >= (o.length + f) * l, f++;
			if (a = s, c++, c > 360) {
				for (; o.length < t;) o.push(i);
				break;
			}
		}
		let d = [this.input], f = Math.floor((e - 1) / 2);
		for (let e = 1; e < f + 1; e++) {
			let t = 0 - e;
			for (; t < 0;) t = o.length + t;
			t >= o.length && (t %= o.length), d.splice(0, 0, o[t]);
		}
		let p = e - f - 1;
		for (let e = 1; e < p + 1; e++) {
			let t = e;
			for (; t < 0;) t = o.length + t;
			t >= o.length && (t %= o.length), d.push(o[t]);
		}
		return d;
	}
	get complement() {
		if (this.complementCache != null) return this.complementCache;
		let t = this.coldest.hue, n = this.tempsByHct.get(this.coldest), r = this.warmest.hue, a = this.tempsByHct.get(this.warmest) - n, o = e.isBetween(this.input.hue, t, r), s = o ? r : t, c = o ? t : r, l = 1e3, u = this.hctsByHue[Math.round(this.input.hue)], d = 1 - this.inputRelativeTemperature;
		for (let t = 0; t <= 360; t += 1) {
			let r = i(s + 1 * t);
			if (!e.isBetween(r, s, c)) continue;
			let o = this.hctsByHue[Math.round(r)], f = (this.tempsByHct.get(o) - n) / a, p = Math.abs(d - f);
			p < l && (l = p, u = o);
		}
		return this.complementCache = u, this.complementCache;
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
			let n = w.from(t, this.input.chroma, this.input.tone);
			e.push(n);
		}
		return this.hctsByHueCache = e, this.hctsByHueCache;
	}
	static isBetween(e, t, n) {
		return t < n ? t <= e && e <= n : t <= e || e <= n;
	}
	static rawTemperature(e) {
		let t = function(e) {
			let t = v(f(e)), n = v(p(e)), r = v(m(e)), i = s, a = i[0][0] * t + i[0][1] * n + i[0][2] * r, o = i[1][0] * t + i[1][1] * n + i[1][2] * r, c = i[2][0] * t + i[2][1] * n + i[2][2] * r, u = o / l[1], d = c / l[2], h = b(a / l[0]), g = b(u);
			return [
				116 * g - 16,
				500 * (h - g),
				200 * (g - b(d))
			];
		}(e.toInt()), n = i(180 * Math.atan2(t[2], t[1]) / Math.PI);
		return .02 * Math.sqrt(t[1] * t[1] + t[2] * t[2]) ** 1.07 * Math.cos(i(n - 50) * Math.PI / 180) - .5;
	}
}, L = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	get(e) {
		return e <= -1 ? this.low : e < 0 ? t(this.low, this.normal, (e - -1) / 1) : e < .5 ? t(this.normal, this.medium, (e - 0) / .5) : e < 1 ? t(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, R = class {
	constructor(e, t, n, r, i, a) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i, this.constraint = a, this.constraint = a ?? "exact";
	}
};
function z(e) {
	return e.variant === N.FIDELITY || e.variant === N.CONTENT;
}
function B(e) {
	return e.variant === N.MONOCHROME;
}
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD";
})(N ||= {});
var V = class {
	primaryPaletteKeyColor() {
		return k.fromPalette({
			name: "primary_palette_key_color",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.primaryPalette.keyColor.tone
		});
	}
	secondaryPaletteKeyColor() {
		return k.fromPalette({
			name: "secondary_palette_key_color",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.secondaryPalette.keyColor.tone
		});
	}
	tertiaryPaletteKeyColor() {
		return k.fromPalette({
			name: "tertiary_palette_key_color",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.tertiaryPalette.keyColor.tone
		});
	}
	neutralPaletteKeyColor() {
		return k.fromPalette({
			name: "neutral_palette_key_color",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.neutralPalette.keyColor.tone
		});
	}
	neutralVariantPaletteKeyColor() {
		return k.fromPalette({
			name: "neutral_variant_palette_key_color",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.neutralVariantPalette.keyColor.tone
		});
	}
	errorPaletteKeyColor() {
		return k.fromPalette({
			name: "error_palette_key_color",
			palette: (e) => e.errorPalette,
			tone: (e) => e.errorPalette.keyColor.tone
		});
	}
	background() {
		return k.fromPalette({
			name: "background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	onBackground() {
		return k.fromPalette({
			name: "on_background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.background(),
			contrastCurve: (e) => new L(3, 3, 4.5, 7)
		});
	}
	surface() {
		return k.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	surfaceDim() {
		return k.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : new L(87, 87, 80, 75).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceBright() {
		return k.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(24, 24, 29, 34).get(e.contrastLevel) : 98,
			isBackground: !0
		});
	}
	surfaceContainerLowest() {
		return k.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(4, 4, 2, 0).get(e.contrastLevel) : 100,
			isBackground: !0
		});
	}
	surfaceContainerLow() {
		return k.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(10, 10, 11, 12).get(e.contrastLevel) : new L(96, 96, 96, 95).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainer() {
		return k.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(12, 12, 16, 20).get(e.contrastLevel) : new L(94, 94, 92, 90).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHigh() {
		return k.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(17, 17, 21, 25).get(e.contrastLevel) : new L(92, 92, 88, 85).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHighest() {
		return k.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new L(22, 22, 26, 30).get(e.contrastLevel) : new L(90, 90, 84, 80).get(e.contrastLevel),
			isBackground: !0
		});
	}
	onSurface() {
		return k.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	surfaceVariant() {
		return k.fromPalette({
			name: "surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0
		});
	}
	onSurfaceVariant() {
		return k.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 80 : 30,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	inverseSurface() {
		return k.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 20,
			isBackground: !0
		});
	}
	inverseOnSurface() {
		return k.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 20 : 95,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	outline() {
		return k.fromPalette({
			name: "outline",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 60 : 50,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1.5, 3, 4.5, 7)
		});
	}
	outlineVariant() {
		return k.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 80,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5)
		});
	}
	shadow() {
		return k.fromPalette({
			name: "shadow",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	scrim() {
		return k.fromPalette({
			name: "scrim",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	surfaceTint() {
		return k.fromPalette({
			name: "surface_tint",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0
		});
	}
	primary() {
		return k.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new R(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	primaryDim() {}
	onPrimary() {
		return k.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.primary(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	primaryContainer() {
		return k.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => z(e) ? e.sourceColorHct.tone : B(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	onPrimaryContainer() {
		return k.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => z(e) ? k.foregroundTone(this.primaryContainer().tone(e), 4.5) : B(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 30,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	inversePrimary() {
		return k.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 40 : 80,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new L(3, 4.5, 7, 7)
		});
	}
	secondary() {
		return k.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new R(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	secondaryDim() {}
	onSecondary() {
		return k.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => B(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
			background: (e) => this.secondary(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	secondaryContainer() {
		return k.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = e.isDark ? 30 : 90;
				return B(e) ? e.isDark ? 30 : 85 : z(e) ? function(e, t, n, r) {
					let i = n, a = w.from(e, t, n);
					if (a.chroma < t) {
						let n = a.chroma;
						for (; a.chroma < t;) {
							i += r ? -1 : 1;
							let o = w.from(e, t, i);
							if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
							Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
						}
					}
					return i;
				}(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark) : t;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	onSecondaryContainer() {
		return k.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => B(e) ? e.isDark ? 90 : 10 : z(e) ? k.foregroundTone(this.secondaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	tertiary() {
		return k.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new R(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	tertiaryDim() {}
	onTertiary() {
		return k.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	tertiaryContainer() {
		return k.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				if (B(e)) return e.isDark ? 60 : 49;
				if (!z(e)) return e.isDark ? 30 : 90;
				let t = e.tertiaryPalette.getHct(e.sourceColorHct.tone);
				return D.fixIfDisliked(t).tone;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	onTertiaryContainer() {
		return k.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? e.isDark ? 0 : 100 : z(e) ? k.foregroundTone(this.tertiaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	error() {
		return k.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new R(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	errorDim() {}
	onError() {
		return k.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 20 : 100,
			background: (e) => this.error(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	errorContainer() {
		return k.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	onErrorContainer() {
		return k.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => B(e) ? e.isDark ? 90 : 10 : e.isDark ? 90 : 30,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	primaryFixed() {
		return k.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	primaryFixedDim() {
		return k.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	onPrimaryFixed() {
		return k.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? 100 : 10,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	onPrimaryFixedVariant() {
		return k.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			tone: (e) => B(e) ? 90 : 30,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	secondaryFixed() {
		return k.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => B(e) ? 80 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	secondaryFixedDim() {
		return k.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => B(e) ? 70 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	onSecondaryFixed() {
		return k.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => 10,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	onSecondaryFixedVariant() {
		return k.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			tone: (e) => B(e) ? 25 : 30,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	tertiaryFixed() {
		return k.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	tertiaryFixedDim() {
		return k.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new L(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new R(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	onTertiaryFixed() {
		return k.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? 100 : 10,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new L(4.5, 7, 11, 21)
		});
	}
	onTertiaryFixedVariant() {
		return k.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => B(e) ? 90 : 30,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new L(3, 4.5, 7, 11)
		});
	}
	highestSurface(e) {
		return e.isDark ? this.surfaceBright() : this.surfaceDim();
	}
};
function H(e, t = 0, r = 100, i = 1) {
	return n(t, r, W(e.hue, e.chroma * i, 100, !0));
}
function U(e, t = 0, r = 100) {
	return n(t, r, W(e.hue, e.chroma, 0, !1));
}
function W(e, t, n, r) {
	let i = n, a = w.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = w.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function G(e) {
	return e === 1.5 ? new L(1.5, 1.5, 3, 5.5) : e === 3 ? new L(3, 3, 4.5, 7) : e === 4.5 ? new L(4.5, 4.5, 7, 11) : e === 6 ? new L(6, 6, 7, 11) : e === 7 ? new L(7, 7, 11, 21) : e === 9 ? new L(9, 9, 11, 21) : e === 11 ? new L(11, 11, 21, 21) : e === 21 ? new L(21, 21, 21, 21) : new L(e, e, 7, 21);
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
K.contentAccentToneDelta = 15, K.colorSpec = new class extends V {
	surface() {
		let e = k.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => (super.surface().tone(e), e.platform === "phone" ? e.isDark ? 4 : w.isYellow(e.neutralPalette.hue) ? 99 : e.variant === N.VIBRANT ? 97 : 98 : 0),
			isBackground: !0
		});
		return O(super.surface(), "2025", e);
	}
	surfaceDim() {
		let e = k.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 4 : w.isYellow(e.neutralPalette.hue) ? 90 : e.variant === N.VIBRANT ? 85 : 87,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (!e.isDark) {
					if (e.variant === N.NEUTRAL) return 2.5;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === N.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return O(super.surfaceDim(), "2025", e);
	}
	surfaceBright() {
		let e = k.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 18 : w.isYellow(e.neutralPalette.hue) ? 99 : e.variant === N.VIBRANT ? 97 : 98,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.isDark) {
					if (e.variant === N.NEUTRAL) return 2.5;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === N.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return O(super.surfaceBright(), "2025", e);
	}
	surfaceContainerLowest() {
		let e = k.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 0 : 100,
			isBackground: !0
		});
		return O(super.surfaceContainerLowest(), "2025", e);
	}
	surfaceContainerLow() {
		let e = k.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 6 : w.isYellow(e.neutralPalette.hue) ? 98 : e.variant === N.VIBRANT ? 95 : 96 : 15,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 1.3;
					if (e.variant === N.TONAL_SPOT) return 1.25;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? 1.3 : 1.15;
					if (e.variant === N.VIBRANT) return 1.08;
				}
				return 1;
			}
		});
		return O(super.surfaceContainerLow(), "2025", e);
	}
	surfaceContainer() {
		let e = k.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 9 : w.isYellow(e.neutralPalette.hue) ? 96 : e.variant === N.VIBRANT ? 92 : 94 : 20,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 1.6;
					if (e.variant === N.TONAL_SPOT) return 1.4;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? 1.6 : 1.3;
					if (e.variant === N.VIBRANT) return 1.15;
				}
				return 1;
			}
		});
		return O(super.surfaceContainer(), "2025", e);
	}
	surfaceContainerHigh() {
		let e = k.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 12 : w.isYellow(e.neutralPalette.hue) ? 94 : e.variant === N.VIBRANT ? 90 : 92 : 25,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 1.9;
					if (e.variant === N.TONAL_SPOT) return 1.5;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? 1.95 : 1.45;
					if (e.variant === N.VIBRANT) return 1.22;
				}
				return 1;
			}
		});
		return O(super.surfaceContainerHigh(), "2025", e);
	}
	surfaceContainerHighest() {
		let e = k.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 15 : w.isYellow(e.neutralPalette.hue) ? 92 : e.variant === N.VIBRANT ? 88 : 90,
			isBackground: !0,
			chromaMultiplier: (e) => e.variant === N.NEUTRAL ? 2.2 : e.variant === N.TONAL_SPOT ? 1.7 : e.variant === N.EXPRESSIVE ? w.isYellow(e.neutralPalette.hue) ? 2.3 : 1.6 : e.variant === N.VIBRANT ? 1.29 : 1
		});
		return O(super.surfaceContainerHighest(), "2025", e);
	}
	onSurface() {
		let e = k.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === N.VIBRANT ? H(e.neutralPalette, 0, 100, 1.1) : k.getInitialToneFromBackground((e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh())(e),
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 2.2;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.isDark && e.platform === "phone" ? G(11) : G(9)
		});
		return O(super.onSurface(), "2025", e);
	}
	onSurfaceVariant() {
		let e = k.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 2.2;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? e.isDark ? G(6) : G(4.5) : G(7)
		});
		return O(super.onSurfaceVariant(), "2025", e);
	}
	outline() {
		let e = k.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 2.2;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(3) : G(4.5)
		});
		return O(super.outline(), "2025", e);
	}
	outlineVariant() {
		let e = k.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === N.NEUTRAL) return 2.2;
					if (e.variant === N.TONAL_SPOT) return 1.7;
					if (e.variant === N.EXPRESSIVE) return w.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(1.5) : G(3)
		});
		return O(super.outlineVariant(), "2025", e);
	}
	inverseSurface() {
		let e = k.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			isBackground: !0
		});
		return O(super.inverseSurface(), "2025", e);
	}
	inverseOnSurface() {
		let e = k.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => G(7)
		});
		return O(super.inverseOnSurface(), "2025", e);
	}
	primary() {
		let e = k.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === N.NEUTRAL ? e.platform === "phone" ? e.isDark ? 80 : 40 : 90 : e.variant === N.TONAL_SPOT ? e.platform === "phone" ? e.isDark ? 80 : H(e.primaryPalette) : H(e.primaryPalette, 0, 90) : e.variant === N.EXPRESSIVE ? e.platform === "phone" ? H(e.primaryPalette, 0, w.isYellow(e.primaryPalette.hue) ? 25 : w.isCyan(e.primaryPalette.hue) ? 88 : 98) : H(e.primaryPalette) : e.platform === "phone" ? H(e.primaryPalette, 0, w.isCyan(e.primaryPalette.hue) ? 88 : 98) : H(e.primaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new R(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return O(super.primary(), "2025", e);
	}
	primaryDim() {
		return k.fromPalette({
			name: "primary_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === N.NEUTRAL ? 85 : e.variant === N.TONAL_SPOT ? H(e.primaryPalette, 0, 90) : H(e.primaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new R(this.primaryDim(), this.primary(), 5, "darker", !0, "farther")
		});
	}
	onPrimary() {
		let e = k.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => e.platform === "phone" ? this.primary() : this.primaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onPrimary(), "2025", e);
	}
	primaryContainer() {
		let e = k.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === N.NEUTRAL ? e.isDark ? 30 : 90 : e.variant === N.TONAL_SPOT ? e.isDark ? U(e.primaryPalette, 35, 93) : H(e.primaryPalette, 0, 90) : e.variant === N.EXPRESSIVE ? e.isDark ? H(e.primaryPalette, 30, 93) : H(e.primaryPalette, 78, w.isCyan(e.primaryPalette.hue) ? 88 : 90) : e.isDark ? U(e.primaryPalette, 66, 93) : H(e.primaryPalette, 66, w.isCyan(e.primaryPalette.hue) ? 88 : 93),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "phone" ? void 0 : new R(this.primaryContainer(), this.primaryDim(), 10, "darker", !0, "farther"),
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return O(super.primaryContainer(), "2025", e);
	}
	onPrimaryContainer() {
		let e = k.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onPrimaryContainer(), "2025", e);
	}
	primaryFixed() {
		let e = k.fromPalette({
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
		return O(super.primaryFixed(), "2025", e);
	}
	primaryFixedDim() {
		let e = k.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new R(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact")
		});
		return O(super.primaryFixedDim(), "2025", e);
	}
	onPrimaryFixed() {
		let e = k.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return O(super.onPrimaryFixed(), "2025", e);
	}
	onPrimaryFixedVariant() {
		let e = k.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return O(super.onPrimaryFixedVariant(), "2025", e);
	}
	inversePrimary() {
		let e = k.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => H(e.primaryPalette),
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.inversePrimary(), "2025", e);
	}
	secondary() {
		let e = k.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === N.NEUTRAL ? 90 : H(e.secondaryPalette, 0, 90) : e.variant === N.NEUTRAL ? e.isDark ? U(e.secondaryPalette, 0, 98) : H(e.secondaryPalette) : e.variant === N.VIBRANT ? H(e.secondaryPalette, 0, e.isDark ? 90 : 98) : e.isDark ? 80 : H(e.secondaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new R(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return O(super.secondary(), "2025", e);
	}
	secondaryDim() {
		return k.fromPalette({
			name: "secondary_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.variant === N.NEUTRAL ? 85 : H(e.secondaryPalette, 0, 90),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new R(this.secondaryDim(), this.secondary(), 5, "darker", !0, "farther")
		});
	}
	onSecondary() {
		let e = k.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => e.platform === "phone" ? this.secondary() : this.secondaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onSecondary(), "2025", e);
	}
	secondaryContainer() {
		let e = k.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === N.VIBRANT ? e.isDark ? U(e.secondaryPalette, 30, 40) : H(e.secondaryPalette, 84, 90) : e.variant === N.EXPRESSIVE ? e.isDark ? 15 : H(e.secondaryPalette, 90, 95) : e.isDark ? 25 : 90,
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new R(this.secondaryContainer(), this.secondaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return O(super.secondaryContainer(), "2025", e);
	}
	onSecondaryContainer() {
		let e = k.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onSecondaryContainer(), "2025", e);
	}
	secondaryFixed() {
		let e = k.fromPalette({
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
		return O(super.secondaryFixed(), "2025", e);
	}
	secondaryFixedDim() {
		let e = k.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new R(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact")
		});
		return O(super.secondaryFixedDim(), "2025", e);
	}
	onSecondaryFixed() {
		let e = k.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return O(super.onSecondaryFixed(), "2025", e);
	}
	onSecondaryFixedVariant() {
		let e = k.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return O(super.onSecondaryFixedVariant(), "2025", e);
	}
	tertiary() {
		let e = k.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === N.TONAL_SPOT ? H(e.tertiaryPalette, 0, 90) : H(e.tertiaryPalette) : e.variant === N.EXPRESSIVE || e.variant === N.VIBRANT ? H(e.tertiaryPalette, 0, w.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 98 : 100) : e.isDark ? H(e.tertiaryPalette, 0, 98) : H(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new R(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return O(super.tertiary(), "2025", e);
	}
	tertiaryDim() {
		return k.fromPalette({
			name: "tertiary_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.variant === N.TONAL_SPOT ? H(e.tertiaryPalette, 0, 90) : H(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new R(this.tertiaryDim(), this.tertiary(), 5, "darker", !0, "farther")
		});
	}
	onTertiary() {
		let e = k.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => e.platform === "phone" ? this.tertiary() : this.tertiaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onTertiary(), "2025", e);
	}
	tertiaryContainer() {
		let e = k.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === N.TONAL_SPOT ? H(e.tertiaryPalette, 0, 90) : H(e.tertiaryPalette) : e.variant === N.NEUTRAL ? e.isDark ? H(e.tertiaryPalette, 0, 93) : H(e.tertiaryPalette, 0, 96) : e.variant === N.TONAL_SPOT ? H(e.tertiaryPalette, 0, e.isDark ? 93 : 100) : e.variant === N.EXPRESSIVE ? H(e.tertiaryPalette, 75, w.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 93 : 100) : e.isDark ? H(e.tertiaryPalette, 0, 93) : H(e.tertiaryPalette, 72, 100),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new R(this.tertiaryContainer(), this.tertiaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return O(super.tertiaryContainer(), "2025", e);
	}
	onTertiaryContainer() {
		let e = k.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onTertiaryContainer(), "2025", e);
	}
	tertiaryFixed() {
		let e = k.fromPalette({
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
		return O(super.tertiaryFixed(), "2025", e);
	}
	tertiaryFixedDim() {
		let e = k.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new R(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact")
		});
		return O(super.tertiaryFixedDim(), "2025", e);
	}
	onTertiaryFixed() {
		let e = k.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => G(7)
		});
		return O(super.onTertiaryFixed(), "2025", e);
	}
	onTertiaryFixedVariant() {
		let e = k.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => G(4.5)
		});
		return O(super.onTertiaryFixedVariant(), "2025", e);
	}
	error() {
		let e = k.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? U(e.errorPalette, 0, 98) : H(e.errorPalette) : U(e.errorPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new R(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return O(super.error(), "2025", e);
	}
	errorDim() {
		return k.fromPalette({
			name: "error_dim",
			palette: (e) => e.errorPalette,
			tone: (e) => U(e.errorPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => G(4.5),
			toneDeltaPair: (e) => new R(this.errorDim(), this.error(), 5, "darker", !0, "farther")
		});
	}
	onError() {
		let e = k.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => e.platform === "phone" ? this.error() : this.errorDim(),
			contrastCurve: (e) => e.platform === "phone" ? G(6) : G(7)
		});
		return O(super.onError(), "2025", e);
	}
	errorContainer() {
		let e = k.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.isDark ? U(e.errorPalette, 30, 93) : H(e.errorPalette, 0, 90),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new R(this.errorContainer(), this.errorDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? G(1.5) : void 0
		});
		return O(super.errorContainer(), "2025", e);
	}
	onErrorContainer() {
		let e = k.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => e.platform === "phone" ? G(4.5) : G(7)
		});
		return O(super.onErrorContainer(), "2025", e);
	}
	surfaceVariant() {
		let e = Object.assign(this.surfaceContainerHighest().clone(), { name: "surface_variant" });
		return O(super.surfaceVariant(), "2025", e);
	}
	surfaceTint() {
		let e = Object.assign(this.primary().clone(), { name: "surface_tint" });
		return O(super.surfaceTint(), "2025", e);
	}
	background() {
		let e = Object.assign(this.surface().clone(), { name: "background" });
		return O(super.background(), "2025", e);
	}
	onBackground() {
		let e = Object.assign(this.onSurface().clone(), {
			name: "on_background",
			tone: (e) => e.platform === "watch" ? 100 : this.onSurface().getTone(e)
		});
		return O(super.onBackground(), "2025", e);
	}
}(), K.primaryPaletteKeyColor = K.colorSpec.primaryPaletteKeyColor(), K.secondaryPaletteKeyColor = K.colorSpec.secondaryPaletteKeyColor(), K.tertiaryPaletteKeyColor = K.colorSpec.tertiaryPaletteKeyColor(), K.neutralPaletteKeyColor = K.colorSpec.neutralPaletteKeyColor(), K.neutralVariantPaletteKeyColor = K.colorSpec.neutralVariantPaletteKeyColor(), K.background = K.colorSpec.background(), K.onBackground = K.colorSpec.onBackground(), K.surface = K.colorSpec.surface(), K.surfaceDim = K.colorSpec.surfaceDim(), K.surfaceBright = K.colorSpec.surfaceBright(), K.surfaceContainerLowest = K.colorSpec.surfaceContainerLowest(), K.surfaceContainerLow = K.colorSpec.surfaceContainerLow(), K.surfaceContainer = K.colorSpec.surfaceContainer(), K.surfaceContainerHigh = K.colorSpec.surfaceContainerHigh(), K.surfaceContainerHighest = K.colorSpec.surfaceContainerHighest(), K.onSurface = K.colorSpec.onSurface(), K.surfaceVariant = K.colorSpec.surfaceVariant(), K.onSurfaceVariant = K.colorSpec.onSurfaceVariant(), K.inverseSurface = K.colorSpec.inverseSurface(), K.inverseOnSurface = K.colorSpec.inverseOnSurface(), K.outline = K.colorSpec.outline(), K.outlineVariant = K.colorSpec.outlineVariant(), K.shadow = K.colorSpec.shadow(), K.scrim = K.colorSpec.scrim(), K.surfaceTint = K.colorSpec.surfaceTint(), K.primary = K.colorSpec.primary(), K.onPrimary = K.colorSpec.onPrimary(), K.primaryContainer = K.colorSpec.primaryContainer(), K.onPrimaryContainer = K.colorSpec.onPrimaryContainer(), K.inversePrimary = K.colorSpec.inversePrimary(), K.secondary = K.colorSpec.secondary(), K.onSecondary = K.colorSpec.onSecondary(), K.secondaryContainer = K.colorSpec.secondaryContainer(), K.onSecondaryContainer = K.colorSpec.onSecondaryContainer(), K.tertiary = K.colorSpec.tertiary(), K.onTertiary = K.colorSpec.onTertiary(), K.tertiaryContainer = K.colorSpec.tertiaryContainer(), K.onTertiaryContainer = K.colorSpec.onTertiaryContainer(), K.error = K.colorSpec.error(), K.onError = K.colorSpec.onError(), K.errorContainer = K.colorSpec.errorContainer(), K.onErrorContainer = K.colorSpec.onErrorContainer(), K.primaryFixed = K.colorSpec.primaryFixed(), K.primaryFixedDim = K.colorSpec.primaryFixedDim(), K.onPrimaryFixed = K.colorSpec.onPrimaryFixed(), K.onPrimaryFixedVariant = K.colorSpec.onPrimaryFixedVariant(), K.secondaryFixed = K.colorSpec.secondaryFixed(), K.secondaryFixedDim = K.colorSpec.secondaryFixedDim(), K.onSecondaryFixed = K.colorSpec.onSecondaryFixed(), K.onSecondaryFixedVariant = K.colorSpec.onSecondaryFixedVariant(), K.tertiaryFixed = K.colorSpec.tertiaryFixed(), K.tertiaryFixedDim = K.colorSpec.tertiaryFixedDim(), K.onTertiaryFixed = K.colorSpec.onTertiaryFixed(), K.onTertiaryFixedVariant = K.colorSpec.onTertiaryFixedVariant();
var q = class e {
	static maybeFallbackSpecVersion(e, t) {
		switch (t) {
			case N.EXPRESSIVE:
			case N.VIBRANT:
			case N.TONAL_SPOT:
			case N.NEUTRAL: return e;
			default: return "2021";
		}
	}
	constructor(t) {
		this.sourceColorArgb = t.sourceColorHct.toInt(), this.variant = t.variant, this.contrastLevel = t.contrastLevel, this.isDark = t.isDark, this.platform = t.platform ?? "phone", this.specVersion = e.maybeFallbackSpecVersion(t.specVersion ?? "2021", this.variant), this.sourceColorHct = t.sourceColorHct, this.primaryPalette = t.primaryPalette ?? Y(this.specVersion).getPrimaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.secondaryPalette = t.secondaryPalette ?? Y(this.specVersion).getSecondaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.tertiaryPalette = t.tertiaryPalette ?? Y(this.specVersion).getTertiaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralPalette = t.neutralPalette ?? Y(this.specVersion).getNeutralPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralVariantPalette = t.neutralVariantPalette ?? Y(this.specVersion).getNeutralVariantPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.errorPalette = t.errorPalette ?? Y(this.specVersion).getErrorPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel) ?? P.fromHueAndChroma(25, 84), this.colors = new K();
	}
	toString() {
		return `Scheme: variant=${N[this.variant]}, mode=${this.isDark ? "dark" : "light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`;
	}
	static getPiecewiseHue(e, t, n) {
		let r = Math.min(t.length - 1, n.length), a = e.hue;
		for (let e = 0; e < r; e++) if (a >= t[e] && a < t[e + 1]) return i(n[e]);
		return a;
	}
	static getRotatedHue(t, n, r) {
		let a = e.getPiecewiseHue(t, n, r);
		return Math.min(n.length - 1, r.length) <= 0 && (a = 0), i(t.hue + a);
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
var J = class {
	getPrimaryPalette(e, t, n, r, a) {
		switch (e) {
			case N.CONTENT:
			case N.FIDELITY: return P.fromHueAndChroma(t.hue, t.chroma);
			case N.FRUIT_SALAD: return P.fromHueAndChroma(i(t.hue - 50), 48);
			case N.MONOCHROME: return P.fromHueAndChroma(t.hue, 0);
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, 12);
			case N.RAINBOW: return P.fromHueAndChroma(t.hue, 48);
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, 36);
			case N.EXPRESSIVE: return P.fromHueAndChroma(i(t.hue + 240), 40);
			case N.VIBRANT: return P.fromHueAndChroma(t.hue, 200);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getSecondaryPalette(e, t, n, r, a) {
		switch (e) {
			case N.CONTENT:
			case N.FIDELITY: return P.fromHueAndChroma(t.hue, Math.max(t.chroma - 32, .5 * t.chroma));
			case N.FRUIT_SALAD: return P.fromHueAndChroma(i(t.hue - 50), 36);
			case N.MONOCHROME: return P.fromHueAndChroma(t.hue, 0);
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, 8);
			case N.RAINBOW:
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, 16);
			case N.EXPRESSIVE: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.VIBRANT: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
	getTertiaryPalette(e, t, n, r, a) {
		switch (e) {
			case N.CONTENT: return P.fromHct(D.fixIfDisliked(new I(t).analogous(3, 6)[2]));
			case N.FIDELITY: return P.fromHct(D.fixIfDisliked(new I(t).complement));
			case N.FRUIT_SALAD: return P.fromHueAndChroma(t.hue, 36);
			case N.MONOCHROME: return P.fromHueAndChroma(t.hue, 0);
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, 16);
			case N.RAINBOW:
			case N.TONAL_SPOT: return P.fromHueAndChroma(i(t.hue + 60), 24);
			case N.EXPRESSIVE: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.VIBRANT: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
	getNeutralPalette(e, t, n, r, a) {
		switch (e) {
			case N.CONTENT:
			case N.FIDELITY: return P.fromHueAndChroma(t.hue, t.chroma / 8);
			case N.FRUIT_SALAD: return P.fromHueAndChroma(t.hue, 10);
			case N.MONOCHROME: return P.fromHueAndChroma(t.hue, 0);
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, 2);
			case N.RAINBOW: return P.fromHueAndChroma(t.hue, 0);
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, 6);
			case N.EXPRESSIVE: return P.fromHueAndChroma(i(t.hue + 15), 8);
			case N.VIBRANT: return P.fromHueAndChroma(t.hue, 10);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralVariantPalette(e, t, n, r, a) {
		switch (e) {
			case N.CONTENT:
			case N.FIDELITY: return P.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case N.FRUIT_SALAD: return P.fromHueAndChroma(t.hue, 16);
			case N.MONOCHROME: return P.fromHueAndChroma(t.hue, 0);
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, 2);
			case N.RAINBOW: return P.fromHueAndChroma(t.hue, 0);
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, 8);
			case N.EXPRESSIVE: return P.fromHueAndChroma(i(t.hue + 15), 12);
			case N.VIBRANT: return P.fromHueAndChroma(t.hue, 12);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getErrorPalette(e, t, n, r, i) {}
}, ee = new J(), te = new class e extends J {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, r === "phone" ? w.isBlue(t.hue) ? 12 : 8 : w.isBlue(t.hue) ? 16 : 12);
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, r === "phone" && n ? 26 : 32);
			case N.EXPRESSIVE: return P.fromHueAndChroma(t.hue, r === "phone" ? n ? 36 : 48 : 40);
			case N.VIBRANT: return P.fromHueAndChroma(t.hue, r === "phone" ? 74 : 56);
			default: return super.getPrimaryPalette(e, t, n, r, i);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case N.NEUTRAL: return P.fromHueAndChroma(t.hue, r === "phone" ? w.isBlue(t.hue) ? 6 : 4 : w.isBlue(t.hue) ? 10 : 6);
			case N.TONAL_SPOT: return P.fromHueAndChroma(t.hue, 16);
			case N.EXPRESSIVE: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.VIBRANT: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.NEUTRAL: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.TONAL_SPOT: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.EXPRESSIVE: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
			case N.VIBRANT: return P.fromHueAndChroma(q.getRotatedHue(t, [
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
		return r === "phone" ? n ? w.isYellow(i) ? 6 : 14 : 18 : 12;
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
		return n === "phone" || w.isBlue(r) ? 28 : 20;
	}
	getNeutralPalette(t, n, r, i, a) {
		switch (t) {
			case N.NEUTRAL: return P.fromHueAndChroma(n.hue, i === "phone" ? 1.4 : 6);
			case N.TONAL_SPOT: return P.fromHueAndChroma(n.hue, i === "phone" ? 5 : 10);
			case N.EXPRESSIVE: return P.fromHueAndChroma(e.getExpressiveNeutralHue(n), e.getExpressiveNeutralChroma(n, r, i));
			case N.VIBRANT: return P.fromHueAndChroma(e.getVibrantNeutralHue(n), e.getVibrantNeutralChroma(n, i));
			default: return super.getNeutralPalette(t, n, r, i, a);
		}
	}
	getNeutralVariantPalette(t, n, r, i, a) {
		switch (t) {
			case N.NEUTRAL: return P.fromHueAndChroma(n.hue, 2.2 * (i === "phone" ? 1.4 : 6));
			case N.TONAL_SPOT: return P.fromHueAndChroma(n.hue, 1.7 * (i === "phone" ? 5 : 10));
			case N.EXPRESSIVE:
				let o = e.getExpressiveNeutralHue(n), s = e.getExpressiveNeutralChroma(n, r, i);
				return P.fromHueAndChroma(o, s * (o >= 105 && o < 125 ? 1.6 : 2.3));
			case N.VIBRANT:
				let c = e.getVibrantNeutralHue(n), l = e.getVibrantNeutralChroma(n, i);
				return P.fromHueAndChroma(c, 1.29 * l);
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
			case N.NEUTRAL: return P.fromHueAndChroma(a, r === "phone" ? 50 : 40);
			case N.TONAL_SPOT: return P.fromHueAndChroma(a, r === "phone" ? 60 : 48);
			case N.EXPRESSIVE: return P.fromHueAndChroma(a, r === "phone" ? 64 : 48);
			case N.VIBRANT: return P.fromHueAndChroma(a, r === "phone" ? 80 : 60);
			default: return super.getErrorPalette(e, t, n, r, i);
		}
	}
}();
function Y(e) {
	return e === "2025" ? te : ee;
}
var X = class e {
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
		let n = w.fromInt(e), r = n.hue, i = n.chroma;
		t ? (this.a1 = P.fromHueAndChroma(r, i), this.a2 = P.fromHueAndChroma(r, i / 3), this.a3 = P.fromHueAndChroma(r + 60, i / 2), this.n1 = P.fromHueAndChroma(r, Math.min(i / 12, 4)), this.n2 = P.fromHueAndChroma(r, Math.min(i / 6, 8))) : (this.a1 = P.fromHueAndChroma(r, Math.max(48, i)), this.a2 = P.fromHueAndChroma(r, 16), this.a3 = P.fromHueAndChroma(r + 60, 24), this.n1 = P.fromHueAndChroma(r, 4), this.n2 = P.fromHueAndChroma(r, 8)), this.error = P.fromHueAndChroma(25, 84);
	}
}, Z = class e {
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
		return e.lightFromCorePalette(X.of(t));
	}
	static dark(t) {
		return e.darkFromCorePalette(X.of(t));
	}
	static lightContent(t) {
		return e.lightFromCorePalette(X.contentOf(t));
	}
	static darkContent(t) {
		return e.darkFromCorePalette(X.contentOf(t));
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
}, ne = {
	desired: 4,
	fallbackColorARGB: 4282549748,
	filter: !0
};
function re(e, t) {
	return e.score > t.score ? -1 : +(e.score < t.score);
}
var Q = class e {
	constructor() {}
	static score(t, n) {
		let { desired: i, fallbackColorARGB: o, filter: s } = {
			...ne,
			...n
		}, c = [], l = Array(360).fill(0), u = 0;
		for (let [e, n] of t.entries()) {
			let t = w.fromInt(e);
			c.push(t), l[Math.floor(t.hue)] += n, u += n;
		}
		let d = Array(360).fill(0);
		for (let e = 0; e < 360; e++) {
			let t = l[e] / u;
			for (let n = e - 14; n < e + 16; n++) d[r(n)] += t;
		}
		let f = [];
		for (let t of c) {
			let n = d[r(Math.round(t.hue))];
			if (s && (t.chroma < e.CUTOFF_CHROMA || n <= e.CUTOFF_EXCITED_PROPORTION)) continue;
			let i = 100 * n * e.WEIGHT_PROPORTION, a = t.chroma < e.TARGET_CHROMA ? e.WEIGHT_CHROMA_BELOW : e.WEIGHT_CHROMA_ABOVE, o = i + (t.chroma - e.TARGET_CHROMA) * a;
			f.push({
				hct: t,
				score: o
			});
		}
		f.sort(re);
		let p = [];
		for (let e = 90; e >= 15; e--) {
			p.length = 0;
			for (let { hct: t } of f) if (p.find((n) => a(t.hue, n.hue) < e) || p.push(t), p.length >= i) break;
			if (p.length >= i) break;
		}
		let m = [];
		p.length === 0 && m.push(o);
		for (let e of p) m.push(e.toInt());
		return m;
	}
};
function ie(e) {
	let t = f(e), n = p(e), r = m(e), i = [
		t.toString(16),
		n.toString(16),
		r.toString(16)
	];
	for (let [e, t] of i.entries()) t.length === 1 && (i[e] = "0" + t);
	return "#" + i.join("");
}
function ae(e) {
	let t = (e = e.replace("#", "")).length === 3, n = e.length === 6, r = e.length === 8;
	if (!t && !n && !r) throw Error("unexpected hex " + e);
	let i = 0, a = 0, o = 0;
	return t ? (i = $(e.slice(0, 1).repeat(2)), a = $(e.slice(1, 2).repeat(2)), o = $(e.slice(2, 3).repeat(2))) : n ? (i = $(e.slice(0, 2)), a = $(e.slice(2, 4)), o = $(e.slice(4, 6))) : r && (i = $(e.slice(2, 4)), a = $(e.slice(4, 6)), o = $(e.slice(6, 8))), (255 << 24 | (255 & i) << 16 | (255 & a) << 8 | 255 & o) >>> 0;
}
function $(e) {
	return parseInt(e, 16);
}
function oe(e, t = []) {
	let n = X.of(e);
	return {
		source: e,
		schemes: {
			light: Z.light(e),
			dark: Z.dark(e)
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
			t.blend && (n = T.harmonize(r, i));
			let a = X.of(n).a1;
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
Q.TARGET_CHROMA = 48, Q.WEIGHT_PROPORTION = .7, Q.WEIGHT_CHROMA_ABOVE = .3, Q.WEIGHT_CHROMA_BELOW = .1, Q.CUTOFF_CHROMA = 5, Q.CUTOFF_EXCITED_PROPORTION = .01;
export { w as a, P as i, ae as n, ie as r, oe as t };
