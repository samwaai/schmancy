import "./animation-CXKSuUoE.js";
import "./overlay-stack-BJt_r6aZ.js";
import "./intersection-C0JuW_7U.js";
var e = class {
	constructor() {
		this.systemLocale = typeof navigator < "u" && navigator.language ? navigator.language : "de-DE";
	}
	roundNumber(e, t = 2) {
		let n = 10 ** t;
		return Math.round(e * n) / n;
	}
	formatNumber(e, t = this.systemLocale, n = {}) {
		return new Intl.NumberFormat(t, n).format(e);
	}
	parseToPureNumber(e, t = ",") {
		let n = e.replace(t, ".");
		return parseFloat(n);
	}
	doIt(e, t = 2, n = this.systemLocale, r = {}) {
		let i = this.roundNumber(e, t);
		return this.formatNumber(i, n, r);
	}
	formatCurrency(e, t = "€") {
		return `${t}${this.doIt(e)}`;
	}
	formatDelta(e, t = "€") {
		return `${e > 0 ? "↑" : e < 0 ? "↓" : "→"} ${t}${this.doIt(Math.abs(e))}`;
	}
	getDeltaClass(e) {
		return e > 0 ? "text-error-default" : e < 0 ? "text-primary-default" : "text-neutral";
	}
	toMixedFraction(e, t = 16, n = 4) {
		let r = e < 0;
		e = Math.abs(e);
		let i = Math.floor(e), a = e - i;
		if (a < 1 / 10 ** t) return r ? `-${i}` : `${i}`;
		let { numerator: o, denominator: s } = this.decimalToFraction(a, t, n);
		return i === 0 ? r ? `-${o}/${s}` : `${o}/${s}` : r ? `-${i} ${o}/${s}` : `${i} ${o}/${s}`;
	}
	decimalToFraction(e, t, n = 4) {
		if (e === 0) return {
			numerator: 0,
			denominator: 1
		};
		let r = Infinity, i = 0, a = 1, o = [];
		n >= 5 && o.push({
			n: 1,
			d: 5
		}, {
			n: 2,
			d: 5
		}, {
			n: 3,
			d: 5
		}, {
			n: 4,
			d: 5
		}), n >= 6 && o.push({
			n: 1,
			d: 6
		}, {
			n: 5,
			d: 6
		}), n >= 8 && o.push({
			n: 1,
			d: 8
		}, {
			n: 3,
			d: 8
		}, {
			n: 5,
			d: 8
		}, {
			n: 7,
			d: 8
		}), n >= 10 && o.push({
			n: 1,
			d: 10
		}, {
			n: 3,
			d: 10
		}, {
			n: 7,
			d: 10
		}, {
			n: 9,
			d: 10
		}), n >= 12 && o.push({
			n: 1,
			d: 12
		}, {
			n: 5,
			d: 12
		}, {
			n: 7,
			d: 12
		}, {
			n: 11,
			d: 12
		}), n >= 16 && o.push({
			n: 1,
			d: 16
		}, {
			n: 3,
			d: 16
		}, {
			n: 5,
			d: 16
		}, {
			n: 7,
			d: 16
		}, {
			n: 9,
			d: 16
		}, {
			n: 11,
			d: 16
		}, {
			n: 13,
			d: 16
		}, {
			n: 15,
			d: 16
		});
		let s = [
			{
				n: 1,
				d: 2
			},
			{
				n: 1,
				d: 3
			},
			{
				n: 2,
				d: 3
			},
			{
				n: 1,
				d: 4
			},
			{
				n: 3,
				d: 4
			},
			...o
		];
		for (let o of s) if (o.d <= n) {
			let n = Math.abs(e - o.n / o.d);
			if (n < r && (r = n, i = o.n, a = o.d, n < 1 / 10 ** t)) return {
				numerator: o.n,
				denominator: o.d
			};
		}
		for (let t = 1; t <= n; t++) {
			let n = Math.round(e * t), o = Math.abs(e - n / t);
			o < r && (r = o, i = n, a = t);
		}
		if (r > 1 / 10 ** (t / 2) && n > 4) {
			let r = 1, o = 0, s = 0, c = 1, l = e;
			do {
				let u = Math.floor(l), d = r;
				if (r = u * r + o, o = d, d = s, s = u * s + c, c = d, l = 1 / (l - u), Math.abs(e - r / s) < 1 / 10 ** t || s > n) return s > n ? {
					numerator: i,
					denominator: a
				} : {
					numerator: r,
					denominator: s
				};
			} while (l !== Infinity);
			i = r, a = s;
		}
		let c = this.findGCD(i, a);
		return {
			numerator: i / c,
			denominator: a / c
		};
	}
	findGCD(e, t) {
		return t === 0 ? e : this.findGCD(t, e % t);
	}
	formatMixedFraction(e, t = "ascii", n = 16, r = 4) {
		let i = this.toMixedFraction(e, n, r);
		if (t === "ascii") return i;
		let a = i.startsWith("-"), o = a ? i.substring(1) : i, s = o.includes(" ");
		if (!o.includes("/")) return i;
		let c = "", l = o;
		if (s) {
			let e = o.split(" ");
			c = e[0], l = e[1];
		}
		let [u, d] = l.split("/");
		if (t === "unicode") {
			let e = this.getUnicodeFraction(parseInt(u), parseInt(d));
			return e ? a ? `-${c}${s ? " " : ""}${e}` : `${c}${s ? " " : ""}${e}` : i;
		}
		if (t === "superscript") {
			let e = this.toSuperscript(u), t = this.toSubscript(d);
			return s ? a ? `-${c} ${e}⁄${t}` : `${c} ${e}⁄${t}` : a ? `-${e}⁄${t}` : `${e}⁄${t}`;
		}
		return i;
	}
	getUnicodeFraction(e, t) {
		return {
			"1/4": "¼",
			"1/2": "½",
			"3/4": "¾",
			"1/3": "⅓",
			"2/3": "⅔",
			"1/5": "⅕",
			"2/5": "⅖",
			"3/5": "⅗",
			"4/5": "⅘",
			"1/6": "⅙",
			"5/6": "⅚",
			"1/7": "⅐",
			"1/8": "⅛",
			"3/8": "⅜",
			"5/8": "⅝",
			"7/8": "⅞",
			"1/9": "⅑",
			"1/10": "⅒"
		}[`${e}/${t}`] || null;
	}
	toSuperscript(e) {
		let t = {
			0: "⁰",
			1: "¹",
			2: "²",
			3: "³",
			4: "⁴",
			5: "⁵",
			6: "⁶",
			7: "⁷",
			8: "⁸",
			9: "⁹",
			"-": "⁻"
		};
		return e.split("").map((e) => t[e] || e).join("");
	}
	toSubscript(e) {
		let t = {
			0: "₀",
			1: "₁",
			2: "₂",
			3: "₃",
			4: "₄",
			5: "₅",
			6: "₆",
			7: "₇",
			8: "₈",
			9: "₉",
			"-": "₋"
		};
		return e.split("").map((e) => t[e] || e).join("");
	}
};
new e();
export { e as t };
