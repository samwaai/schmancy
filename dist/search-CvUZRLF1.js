var e = /[\s\-_.,;:!?()[\]{}]+/;
function t(t, r, i) {
	if (!t || !r) return 0;
	if (t === r) return 1;
	let a = {
		normalizeAccents: i?.normalizeAccents ?? !0,
		includeWordJaccard: i?.includeWordJaccard ?? !0,
		maxLevenshteinDistance: i?.maxLevenshteinDistance ?? 0
	}, o = n(t, a.normalizeAccents), s = n(r, a.normalizeAccents);
	if (o === s) return 1;
	if (s.startsWith(o)) return .95 + o.length / s.length * .05;
	let c = s.split(e).filter((e) => e.length > 0);
	for (let e = 0; e < c.length; e++) if (c[e].startsWith(o)) return .85 * (1 - e / c.length * .1);
	if (s.includes(o)) return .7 * (1 - s.indexOf(o) / s.length * .2);
	if (function(e, t) {
		let n = 0, r = 0;
		for (; n < e.length && r < t.length;) e[n] === t[r] && n++, r++;
		return n === e.length;
	}(o, s)) return .5;
	let l = 0, u = .45 * function(e, t) {
		if (e.length < 2 || t.length < 2) return 0;
		let n = /* @__PURE__ */ new Map();
		for (let e = 0; e < t.length - 1; e++) {
			let r = t.substring(e, e + 2);
			n.set(r, (n.get(r) || 0) + 1);
		}
		let r = 0, i = 0;
		for (let t = 0; t < e.length - 1; t++) {
			let a = e.substring(t, t + 2);
			i++;
			let o = n.get(a);
			o && o > 0 && (r++, n.set(a, o - 1));
		}
		let a = t.length - 1;
		return 2 * r / (i + a);
	}(o, s);
	u > l && (l = u);
	let d = Math.max(o.length, s.length), f = function(e, t, n = 0) {
		if (e.length > t.length && ([e, t] = [t, e]), e.length === 0) return t.length;
		if (n > 0 && t.length - e.length > n) return n + 1;
		let r = Array(e.length + 1), i = Array(e.length + 1);
		for (let t = 0; t <= e.length; t++) r[t] = t;
		for (let a = 1; a <= t.length; a++) {
			i[0] = a;
			let o = a;
			for (let n = 1; n <= e.length; n++) {
				let s = e[n - 1] === t[a - 1] ? 0 : 1;
				i[n] = Math.min(r[n] + 1, i[n - 1] + 1, r[n - 1] + s), i[n] < o && (o = i[n]);
			}
			if (n > 0 && o > n) return n + 1;
			[r, i] = [i, r];
		}
		return r[e.length];
	}(o, s, a.maxLevenshteinDistance), p = d ? .45 * (1 - f / d) : 0;
	if (p > l && (l = p), function(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let e = 0; e < t.length; e++) {
			let r = t[e];
			n.set(r, (n.get(r) || 0) + 1);
		}
		let r = /* @__PURE__ */ new Map();
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			r.set(n, (r.get(n) || 0) + 1);
		}
		let i = !0;
		return r.forEach((e, t) => {
			(n.get(t) || 0) < e && (i = !1);
		}), i;
	}(o, s) && .3 > l && (l = .3), a.includeWordJaccard && c.length > 1) {
		let t = o.split(e).filter((e) => e.length > 0);
		if (t.length > 0) {
			let e = .4 * function(e, t) {
				if (e.length === 0 || t.length === 0) return 0;
				let n = new Set(e), r = new Set(t), i = 0;
				n.forEach((e) => {
					r.has(e) && i++;
				});
				let a = n.size + r.size - i;
				return a > 0 ? i / a : 0;
			}(t, c);
			e > l && (l = e);
		}
	}
	return l;
}
function n(e, t) {
	let n = e.toLowerCase().trim();
	return t && (n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "")), n;
}
export { t };
