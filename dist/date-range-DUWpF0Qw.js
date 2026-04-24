import { n as e, t } from "./chunk-C_1VqBVD.js";
import { t as n } from "./decorate-D_utPUsC.js";
import { t as r } from "./litElement.mixin-Mi8bar6B.js";
import "./mixins.js";
import { t as i } from "./dialog-service-CCFGpU7a.js";
import { n as a } from "./sheet.service-CanLo8ko.js";
import { debounceTime as o, fromEvent as s, takeUntil as c, timer as l } from "rxjs";
import { customElement as u, property as d, state as f } from "lit/decorators.js";
import { html as p, render as m } from "lit";
import { repeat as h } from "lit/directives/repeat.js";
import { ifDefined as g } from "lit/directives/if-defined.js";
var _ = t((e, t) => {
	var n = e, r = function() {
		var e = 6e4, t = 36e5, n = "millisecond", r = "second", i = "minute", a = "hour", o = "day", s = "week", c = "month", l = "quarter", u = "year", d = "date", f = "Invalid Date", p = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, m = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, h = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(e) {
				var t = [
					"th",
					"st",
					"nd",
					"rd"
				], n = e % 100;
				return "[" + e + (t[(n - 20) % 10] || t[n] || t[0]) + "]";
			}
		}, g = function(e, t, n) {
			var r = String(e);
			return !r || r.length >= t ? e : "" + Array(t + 1 - r.length).join(n) + e;
		}, _ = {
			s: g,
			z: function(e) {
				var t = -e.utcOffset(), n = Math.abs(t), r = Math.floor(n / 60), i = n % 60;
				return (t <= 0 ? "+" : "-") + g(r, 2, "0") + ":" + g(i, 2, "0");
			},
			m: function e(t, n) {
				if (t.date() < n.date()) return -e(n, t);
				var r = 12 * (n.year() - t.year()) + (n.month() - t.month()), i = t.clone().add(r, c), a = n - i < 0, o = t.clone().add(r + (a ? -1 : 1), c);
				return +(-(r + (n - i) / (a ? i - o : o - i)) || 0);
			},
			a: function(e) {
				return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
			},
			p: function(e) {
				return {
					M: c,
					y: u,
					w: s,
					d: o,
					D: d,
					h: a,
					m: i,
					s: r,
					ms: n,
					Q: l
				}[e] || String(e || "").toLowerCase().replace(/s$/, "");
			},
			u: function(e) {
				return e === void 0;
			}
		}, v = "en", y = {};
		y[v] = h;
		var b = "$isDayjsObject", x = function(e) {
			return e instanceof T || !(!e || !e[b]);
		}, S = function e(t, n, r) {
			var i;
			if (!t) return v;
			if (typeof t == "string") {
				var a = t.toLowerCase();
				y[a] && (i = a), n && (y[a] = n, i = a);
				var o = t.split("-");
				if (!i && o.length > 1) return e(o[0]);
			} else {
				var s = t.name;
				y[s] = t, i = s;
			}
			return !r && i && (v = i), i || !r && v;
		}, C = function(e, t) {
			if (x(e)) return e.clone();
			var n = typeof t == "object" ? t : {};
			return n.date = e, n.args = arguments, new T(n);
		}, w = _;
		w.l = S, w.i = x, w.w = function(e, t) {
			return C(e, {
				locale: t.$L,
				utc: t.$u,
				x: t.$x,
				$offset: t.$offset
			});
		};
		var T = function() {
			function h(e) {
				this.$L = S(e.locale, null, !0), this.parse(e), this.$x = this.$x || e.x || {}, this[b] = !0;
			}
			var g = h.prototype;
			return g.parse = function(e) {
				this.$d = function(e) {
					var t = e.date, n = e.utc;
					if (t === null) return /* @__PURE__ */ new Date(NaN);
					if (w.u(t)) return /* @__PURE__ */ new Date();
					if (t instanceof Date) return new Date(t);
					if (typeof t == "string" && !/Z$/i.test(t)) {
						var r = t.match(p);
						if (r) {
							var i = r[2] - 1 || 0, a = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, a)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, a);
						}
					}
					return new Date(t);
				}(e), this.init();
			}, g.init = function() {
				var e = this.$d;
				this.$y = e.getFullYear(), this.$M = e.getMonth(), this.$D = e.getDate(), this.$W = e.getDay(), this.$H = e.getHours(), this.$m = e.getMinutes(), this.$s = e.getSeconds(), this.$ms = e.getMilliseconds();
			}, g.$utils = function() {
				return w;
			}, g.isValid = function() {
				return this.$d.toString() !== f;
			}, g.isSame = function(e, t) {
				var n = C(e);
				return this.startOf(t) <= n && n <= this.endOf(t);
			}, g.isAfter = function(e, t) {
				return C(e) < this.startOf(t);
			}, g.isBefore = function(e, t) {
				return this.endOf(t) < C(e);
			}, g.$g = function(e, t, n) {
				return w.u(e) ? this[t] : this.set(n, e);
			}, g.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, g.valueOf = function() {
				return this.$d.getTime();
			}, g.startOf = function(e, t) {
				var n = this, l = !!w.u(t) || t, f = w.p(e), p = function(e, t) {
					var r = w.w(n.$u ? Date.UTC(n.$y, t, e) : new Date(n.$y, t, e), n);
					return l ? r : r.endOf(o);
				}, m = function(e, t) {
					return w.w(n.toDate()[e].apply(n.toDate("s"), (l ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(t)), n);
				}, h = this.$W, g = this.$M, _ = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (f) {
					case u: return l ? p(1, 0) : p(31, 11);
					case c: return l ? p(1, g) : p(0, g + 1);
					case s:
						var y = this.$locale().weekStart || 0, b = (h < y ? h + 7 : h) - y;
						return p(l ? _ - b : _ + (6 - b), g);
					case o:
					case d: return m(v + "Hours", 0);
					case a: return m(v + "Minutes", 1);
					case i: return m(v + "Seconds", 2);
					case r: return m(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, g.endOf = function(e) {
				return this.startOf(e, !1);
			}, g.$set = function(e, t) {
				var s, l = w.p(e), f = "set" + (this.$u ? "UTC" : ""), p = (s = {}, s[o] = f + "Date", s[d] = f + "Date", s[c] = f + "Month", s[u] = f + "FullYear", s[a] = f + "Hours", s[i] = f + "Minutes", s[r] = f + "Seconds", s[n] = f + "Milliseconds", s)[l], m = l === o ? this.$D + (t - this.$W) : t;
				if (l === c || l === u) {
					var h = this.clone().set(d, 1);
					h.$d[p](m), h.init(), this.$d = h.set(d, Math.min(this.$D, h.daysInMonth())).$d;
				} else p && this.$d[p](m);
				return this.init(), this;
			}, g.set = function(e, t) {
				return this.clone().$set(e, t);
			}, g.get = function(e) {
				return this[w.p(e)]();
			}, g.add = function(n, l) {
				var d, f = this;
				n = Number(n);
				var p = w.p(l), m = function(e) {
					var t = C(f);
					return w.w(t.date(t.date() + Math.round(e * n)), f);
				};
				if (p === c) return this.set(c, this.$M + n);
				if (p === u) return this.set(u, this.$y + n);
				if (p === o) return m(1);
				if (p === s) return m(7);
				var h = (d = {}, d[i] = e, d[a] = t, d[r] = 1e3, d)[p] || 1, g = this.$d.getTime() + n * h;
				return w.w(g, this);
			}, g.subtract = function(e, t) {
				return this.add(-1 * e, t);
			}, g.format = function(e) {
				var t = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || f;
				var r = e || "YYYY-MM-DDTHH:mm:ssZ", i = w.z(this), a = this.$H, o = this.$m, s = this.$M, c = n.weekdays, l = n.months, u = n.meridiem, d = function(e, n, i, a) {
					return e && (e[n] || e(t, r)) || i[n].slice(0, a);
				}, p = function(e) {
					return w.s(a % 12 || 12, e, "0");
				}, h = u || function(e, t, n) {
					var r = e < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(m, function(e, r) {
					return r || function(e) {
						switch (e) {
							case "YY": return String(t.$y).slice(-2);
							case "YYYY": return w.s(t.$y, 4, "0");
							case "M": return s + 1;
							case "MM": return w.s(s + 1, 2, "0");
							case "MMM": return d(n.monthsShort, s, l, 3);
							case "MMMM": return d(l, s);
							case "D": return t.$D;
							case "DD": return w.s(t.$D, 2, "0");
							case "d": return String(t.$W);
							case "dd": return d(n.weekdaysMin, t.$W, c, 2);
							case "ddd": return d(n.weekdaysShort, t.$W, c, 3);
							case "dddd": return c[t.$W];
							case "H": return String(a);
							case "HH": return w.s(a, 2, "0");
							case "h": return p(1);
							case "hh": return p(2);
							case "a": return h(a, o, !0);
							case "A": return h(a, o, !1);
							case "m": return String(o);
							case "mm": return w.s(o, 2, "0");
							case "s": return String(t.$s);
							case "ss": return w.s(t.$s, 2, "0");
							case "SSS": return w.s(t.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(e) || i.replace(":", "");
				});
			}, g.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, g.diff = function(n, d, f) {
				var p, m = this, h = w.p(d), g = C(n), _ = (g.utcOffset() - this.utcOffset()) * e, v = this - g, y = function() {
					return w.m(m, g);
				};
				switch (h) {
					case u:
						p = y() / 12;
						break;
					case c:
						p = y();
						break;
					case l:
						p = y() / 3;
						break;
					case s:
						p = (v - _) / 6048e5;
						break;
					case o:
						p = (v - _) / 864e5;
						break;
					case a:
						p = v / t;
						break;
					case i:
						p = v / e;
						break;
					case r:
						p = v / 1e3;
						break;
					default: p = v;
				}
				return f ? p : w.a(p);
			}, g.daysInMonth = function() {
				return this.endOf(c).$D;
			}, g.$locale = function() {
				return y[this.$L];
			}, g.locale = function(e, t) {
				if (!e) return this.$L;
				var n = this.clone(), r = S(e, t, !0);
				return r && (n.$L = r), n;
			}, g.clone = function() {
				return w.w(this.$d, this);
			}, g.toDate = function() {
				return new Date(this.valueOf());
			}, g.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, g.toISOString = function() {
				return this.$d.toISOString();
			}, g.toString = function() {
				return this.$d.toUTCString();
			}, h;
		}(), E = T.prototype;
		return C.prototype = E, [
			["$ms", n],
			["$s", r],
			["$m", i],
			["$H", a],
			["$W", o],
			["$M", c],
			["$y", u],
			["$D", d]
		].forEach(function(e) {
			E[e[1]] = function(t) {
				return this.$g(t, e[0], e[1]);
			};
		}), C.extend = function(e, t) {
			return e.$i ||= (e(t, T, C), !0), C;
		}, C.locale = S, C.isDayjs = x, C.unix = function(e) {
			return C(1e3 * e);
		}, C.en = y[v], C.Ls = y, C.p = {}, C;
	};
	typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).dayjs = r();
}), v = e(t((e, t) => {
	var n = e, r = function() {
		var e = "month", t = "quarter";
		return function(n, r) {
			var i = r.prototype;
			i.quarter = function(e) {
				return this.$utils().u(e) ? Math.ceil((this.month() + 1) / 3) : this.month(this.month() % 3 + 3 * (e - 1));
			};
			var a = i.add;
			i.add = function(n, r) {
				return n = Number(n), this.$utils().p(r) === t ? this.add(3 * n, e) : a.bind(this)(n, r);
			};
			var o = i.startOf;
			i.startOf = function(n, r) {
				var i = this.$utils(), a = !!i.u(r) || r;
				if (i.p(n) === t) {
					var s = this.quarter() - 1;
					return a ? this.month(3 * s).startOf(e).startOf("day") : this.month(3 * s + 2).endOf(e).endOf("day");
				}
				return o.bind(this)(n, r);
			};
		};
	};
	typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).dayjs_plugin_quarterOfYear = r();
})(), 1), y = e(_(), 1);
function b(e, t) {
	return e.map((e) => ({
		label: `Last ${e} Days`,
		range: {
			dateFrom: (0, y.default)().subtract(e - 1, "days").startOf("day").format(t),
			dateTo: (0, y.default)().endOf("day").format(t)
		},
		step: "day"
	}));
}
function x(e, t) {
	return e.map((e) => ({
		label: `Last ${e} Weeks`,
		range: {
			dateFrom: (0, y.default)().subtract(e, "weeks").startOf("week").format(t),
			dateTo: (0, y.default)().endOf("day").format(t)
		},
		step: "week"
	}));
}
function S(e, t) {
	return e.map((e) => ({
		label: `Last ${e} Months`,
		range: {
			dateFrom: (0, y.default)().subtract(e, "months").startOf("month").format(t),
			dateTo: (0, y.default)().endOf("day").format(t)
		},
		step: "month"
	}));
}
function C(e, t) {
	return e.map((e) => ({
		label: `Last ${e} Quarters`,
		range: {
			dateFrom: (0, y.default)().subtract(e, "quarters").startOf("quarter").format(t),
			dateTo: (0, y.default)().endOf("day").format(t)
		},
		step: "quarter"
	}));
}
function w(e, t) {
	if (!e) return null;
	let n = (0, y.default)(e);
	return n.isValid() ? n.format(t) : null;
}
function T(e, t, n) {
	let r = w(e, n), i = w(t, n);
	return {
		dateFrom: r,
		dateTo: i,
		isValid: r !== null && i !== null
	};
}
var E = class extends r() {
	constructor(...e) {
		super(...e), this.type = "date", this.dateFrom = {
			label: "From",
			value: ""
		}, this.dateTo = {
			label: "To",
			value: ""
		}, this.activePreset = null, this.presetCategories = [];
	}
	getPresetGroups() {
		let e = this.presetCategories.flatMap((e) => e.presets), t = [
			"Today",
			"Yesterday",
			"This Week",
			"This Month"
		].map((t) => e.find((e) => e.label === t)).filter((e) => e !== void 0), n = [
			"Last 7 Days",
			"Last 14 Days",
			"Last 30 Days",
			"Last 60 Days",
			"Last 90 Days"
		].map((t) => e.find((e) => e.label === t)).filter((e) => e !== void 0), r = [
			"Last Week",
			"Last Month",
			"Last Quarter",
			"Last Year"
		].map((t) => e.find((e) => e.label === t)).filter((e) => e !== void 0), i = [
			"This Week",
			"This Month",
			"This Quarter",
			"This Year",
			"Year to Date"
		].map((t) => e.find((e) => e.label === t)).filter((e) => e !== void 0), a = [];
		return t.length > 0 && a.push({
			name: "Quick Select",
			presets: t
		}), n.length > 0 && a.push({
			name: "Days",
			presets: n
		}), r.length > 0 && a.push({
			name: "Periods",
			presets: r
		}), i.length > 0 && a.push({
			name: "Year to Date",
			presets: i
		}), a;
	}
	handleFromDateChange(e) {
		let t = e.target;
		this.dateFrom = {
			...this.dateFrom,
			value: t.value
		}, this.dateTo.value && (0, y.default)(this.dateFrom.value).isAfter((0, y.default)(this.dateTo.value)) && (this.dateTo = {
			...this.dateTo,
			value: this.dateFrom.value
		}), this.dispatchEvent(new CustomEvent("date-change", {
			detail: {
				dateFrom: this.dateFrom.value,
				dateTo: this.dateTo.value
			},
			bubbles: !0,
			composed: !0
		}));
	}
	handleToDateChange(e) {
		let t = e.target;
		this.dateTo = {
			...this.dateTo,
			value: t.value
		}, this.dispatchEvent(new CustomEvent("date-change", {
			detail: {
				dateFrom: this.dateFrom.value,
				dateTo: this.dateTo.value
			},
			bubbles: !0,
			composed: !0
		}));
	}
	handlePresetSelection(e, t) {
		t.stopPropagation(), this.dispatchEvent(new CustomEvent("preset-select", {
			detail: { preset: e },
			bubbles: !0,
			composed: !0
		})), i.dismiss();
	}
	applyManualDateSelection(e) {
		e.stopPropagation();
		let t = (0, y.default)(this.dateFrom.value), n = (0, y.default)(this.dateTo.value);
		t.isValid() && n.isValid() ? (this.dispatchEvent(new CustomEvent("apply-dates", {
			detail: {
				dateFrom: this.dateFrom.value,
				dateTo: this.dateTo.value,
				swapIfNeeded: t.isAfter(n)
			},
			bubbles: !0,
			composed: !0
		})), i.dismiss()) : this.dispatchEvent(new CustomEvent("announce", {
			detail: { message: "Invalid date format. Please check your input." },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return p`
			<div class="w-full min-h-[400px] max-h-[80vh] flex flex-col p-4">
				<!-- Preset Groups Section -->
				<div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0 space-y-4">
					${h(this.getPresetGroups(), (e) => e.name, (e) => p`
							<div class="space-y-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${e.name}
								</schmancy-typography>
								<div class="flex flex-wrap gap-2">
									${h(e.presets, (e) => e.label, (e) => p`
											<schmancy-filter-chip
												.value=${e.label}
												.selected=${this.activePreset === e.label}
												@click=${(t) => this.handlePresetSelection(e, t)}
												title="${e.range.dateFrom} to ${e.range.dateTo}"
											>
												${e.label}
											</schmancy-filter-chip>
										`)}
								</div>
							</div>
						`)}
				</div>

				<!-- Divider -->
				<schmancy-divider class="my-4"></schmancy-divider>

				<!-- Custom Range Section -->
				<div class="space-y-2">
					<div class="flex items-end gap-3 flex-wrap">
						<div class="flex-1 min-w-[140px]">
							<schmancy-input
								.type="${this.type}"
								.label="${this.dateFrom.label || "From"}"
								.value="${this.dateFrom.value}"
								min="${g(this.minDate)}"
								max="${g(this.maxDate)}"
								@change="${this.handleFromDateChange}"
							></schmancy-input>
						</div>
						<div class="flex-1 min-w-[140px]">
							<schmancy-input
								.type="${this.type}"
								.label="${this.dateTo.label || "To"}"
								.value="${this.dateTo.value}"
								min="${g(this.dateFrom.value)}"
								max="${g(this.maxDate)}"
								@change="${this.handleToDateChange}"
							></schmancy-input>
						</div>
						<schmancy-button
							variant="filled"
							@click="${(e) => this.applyManualDateSelection(e)}"
							?disabled="${!this.dateFrom.value || !this.dateTo.value}"
						>
							Apply
						</schmancy-button>
					</div>
				</div>
			</div>
		`;
	}
};
n([d({ type: String })], E.prototype, "type", void 0), n([d({ type: Object })], E.prototype, "dateFrom", void 0), n([d({ type: Object })], E.prototype, "dateTo", void 0), n([d({ type: String })], E.prototype, "minDate", void 0), n([d({ type: String })], E.prototype, "maxDate", void 0), n([d({ type: String })], E.prototype, "activePreset", void 0), n([d({ type: Array })], E.prototype, "presetCategories", void 0), E = n([u("schmancy-date-range-dialog")], E), y.default.extend(v.default);
var D = class extends r() {
	constructor(...e) {
		super(...e), this.type = "date", this.dateFrom = {
			label: "From",
			value: ""
		}, this.dateTo = {
			label: "To",
			value: ""
		}, this.customPresets = [], this.disabled = !1, this.required = !1, this.placeholder = "Select date range", this.clearable = !0, this.collapse = !1, this.isOpen = !1, this.selectedDateRange = "", this.activePreset = null, this.announceMessage = "", this.isMobile = !1, this.presetRanges = [], this.presetCategories = [], this.memoizedPresets = /* @__PURE__ */ new Map();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.isOpen = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this.initPresetRanges(), this.checkMobileView();
		let e = this.getDateFormat(), t = T(this.dateFrom.value, this.dateTo.value, e);
		if (t.isValid) this.dateFrom.value = t.dateFrom, this.dateTo.value = t.dateTo, this.updateSelectedDateRange();
		else {
			let t = (0, y.default)().format(e);
			this.dateFrom.value = t, this.dateTo.value = t, this.updateSelectedDateRange();
		}
		this.setupEventHandlers();
	}
	setupEventHandlers() {
		s(document, "keydown").pipe(c(this.disconnecting)).subscribe((e) => {
			this.handleKeyboardNavigation(e);
		}), s(window, "resize").pipe(o(150), c(this.disconnecting)).subscribe(() => {
			this.checkMobileView();
		});
	}
	updated(e) {
		super.updated(e), !e.has("dateFrom") && !e.has("dateTo") || this.dateFrom?.value === void 0 && this.dateTo?.value === void 0 || this.updateSelectedDateRange();
	}
	initPresetRanges() {
		let e = this.getDateFormat(), t = `${this.type}-${e}-${JSON.stringify(this.customPresets)}`;
		if (this.memoizedPresets.has(t)) {
			let e = this.memoizedPresets.get(t);
			this.presetCategories = e, this.presetRanges = [], e.forEach((e) => {
				this.presetRanges.push(...e.presets);
			});
			return;
		}
		if (this.presetCategories = function(e, t = !1) {
			let n = [];
			return t && n.push({
				name: "Hours",
				presets: [{
					label: "Last 24 Hours",
					range: {
						dateFrom: (0, y.default)().subtract(24, "hours").format(e),
						dateTo: (0, y.default)().format(e)
					},
					step: "hour"
				}, {
					label: "Last 12 Hours",
					range: {
						dateFrom: (0, y.default)().subtract(12, "hours").format(e),
						dateTo: (0, y.default)().format(e)
					},
					step: "hour"
				}]
			}), n.push({
				name: "Days",
				presets: [
					{
						label: "Today",
						range: {
							dateFrom: (0, y.default)().startOf("day").format(e),
							dateTo: (0, y.default)().endOf("day").format(e)
						},
						step: "day"
					},
					{
						label: "Yesterday",
						range: {
							dateFrom: (0, y.default)().subtract(1, "days").startOf("day").format(e),
							dateTo: (0, y.default)().subtract(1, "days").endOf("day").format(e)
						},
						step: "day"
					},
					...b([
						7,
						14,
						30,
						60,
						90
					], e)
				]
			}), n.push({
				name: "Weeks",
				presets: [
					{
						label: "This Week",
						range: {
							dateFrom: (0, y.default)().startOf("week").format(e),
							dateTo: (0, y.default)().endOf("week").format(e)
						},
						step: "week"
					},
					{
						label: "Last Week",
						range: {
							dateFrom: (0, y.default)().subtract(1, "weeks").startOf("week").format(e),
							dateTo: (0, y.default)().subtract(1, "weeks").endOf("week").format(e)
						},
						step: "week"
					},
					...x([2, 4], e)
				]
			}), n.push({
				name: "Months",
				presets: [
					{
						label: "This Month",
						range: {
							dateFrom: (0, y.default)().startOf("month").format(e),
							dateTo: (0, y.default)().endOf("month").format(e)
						},
						step: "month"
					},
					{
						label: "Last Month",
						range: {
							dateFrom: (0, y.default)().subtract(1, "month").startOf("month").format(e),
							dateTo: (0, y.default)().subtract(1, "month").endOf("month").format(e)
						},
						step: "month"
					},
					...S([3, 6], e)
				]
			}), n.push({
				name: "Quarters",
				presets: [
					{
						label: "This Quarter",
						range: {
							dateFrom: (0, y.default)().startOf("quarter").format(e),
							dateTo: (0, y.default)().endOf("quarter").format(e)
						},
						step: "quarter"
					},
					{
						label: "Last Quarter",
						range: {
							dateFrom: (0, y.default)().subtract(1, "quarter").startOf("quarter").format(e),
							dateTo: (0, y.default)().subtract(1, "quarter").endOf("quarter").format(e)
						},
						step: "quarter"
					},
					...C([2, 4], e)
				]
			}), n.push({
				name: "Years",
				presets: [
					{
						label: "This Year",
						range: {
							dateFrom: (0, y.default)().startOf("year").format(e),
							dateTo: (0, y.default)().endOf("year").format(e)
						},
						step: "year"
					},
					{
						label: "Last Year",
						range: {
							dateFrom: (0, y.default)().subtract(1, "year").startOf("year").format(e),
							dateTo: (0, y.default)().subtract(1, "year").endOf("year").format(e)
						},
						step: "year"
					},
					{
						label: "Year to Date",
						range: {
							dateFrom: (0, y.default)().startOf("year").format(e),
							dateTo: (0, y.default)().endOf("day").format(e)
						},
						step: "day"
					}
				]
			}), n;
		}(e, this.type === "datetime-local"), this.presetRanges = [], this.presetCategories.forEach((e) => {
			this.presetRanges.push(...e.presets);
		}), this.customPresets && this.customPresets.length > 0) {
			let e = {
				name: "Custom",
				presets: this.customPresets.map((e) => ({
					label: e.label,
					range: {
						dateFrom: e.dateFrom,
						dateTo: e.dateTo
					},
					step: "day"
				}))
			};
			this.presetCategories.push(e), this.presetRanges.push(...e.presets);
		}
		this.memoizedPresets.set(t, [...this.presetCategories]);
	}
	getDateFormat() {
		return this.format || (this.type === "date" ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm");
	}
	updateSelectedDateRange() {
		let e = this.presetRanges.find((e) => e.range.dateFrom === this.dateFrom.value && e.range.dateTo === this.dateTo.value);
		if (e) return this.selectedDateRange = e.label, void (this.activePreset = e.label);
		this.checkAndUpdateActivePreset(this.dateFrom.value, this.dateTo.value), this.activePreset = null, this.selectedDateRange = function(e, t, n, r) {
			if (!e || !t) return r;
			let i = (0, y.default)(e), a = (0, y.default)(t);
			if (!i.isValid() || !a.isValid()) return r;
			let o = n === "datetime-local" ? i.format(" h:mm A") : "", s = n === "datetime-local" ? a.format(" h:mm A") : "";
			return i.isSame(a, "day") ? `${i.format("ddd, MMM D, YYYY")}${o}` : i.isSame(a, "month") && i.isSame(a, "year") ? `${i.format("ddd MMM D")} - ${a.format("ddd D, YYYY")}${s}` : i.isSame(a, "year") ? `${i.format("ddd MMM D")} - ${a.format("ddd MMM D, YYYY")}${s}` : `${i.format("ddd MMM D, YYYY")}${o} - ${a.format("ddd MMM D, YYYY")}${s}`;
		}(this.dateFrom.value, this.dateTo.value, this.type, this.placeholder);
	}
	setDateRange(e, t) {
		this.dateFrom.value = e, this.dateTo.value = t, this.updateSelectedDateRange(), this.announceToScreenReader(`Date range updated: ${this.selectedDateRange}`), this.dispatchEvent(new CustomEvent("change", {
			detail: {
				dateFrom: e,
				dateTo: t
			},
			bubbles: !0,
			composed: !0
		}));
	}
	toggleDropdown(e) {
		e.stopPropagation(), this.disabled || this.step !== void 0 || (this.isOpen ? this.closeDropdown() : this.openDropdown(e));
	}
	openDropdown(e) {
		if (this.disabled || this.step !== void 0) return;
		this.dispatchEvent(new CustomEvent("beforeopen", {
			bubbles: !0,
			composed: !0
		})), this.isOpen = !0;
		let t = p`
			<schmancy-date-range-dialog
				.type="${this.type}"
				.dateFrom="${this.dateFrom}"
				.dateTo="${this.dateTo}"
				.minDate="${this.minDate}"
				.maxDate="${this.maxDate}"
				.activePreset="${this.activePreset}"
				.presetCategories="${this.presetCategories}"
				@preset-select="${(e) => {
			this.activePreset = e.detail.preset.label, this.setDateRange(e.detail.preset.range.dateFrom, e.detail.preset.range.dateTo), this.closeDropdown();
		}}"
				@date-change="${() => this.updateSelectedDateRange()}"
				@apply-dates="${(e) => {
			let { dateFrom: t, dateTo: n, swapIfNeeded: r } = e.detail;
			r ? this.setDateRange(n, t) : this.setDateRange(t, n), this.closeDropdown();
		}}"
				@announce="${(e) => this.announceToScreenReader(e.detail.message)}"
			></schmancy-date-range-dialog>
		`;
		if (this.isMobile) {
			let e = document.createElement("div");
			m(t, e), a.push({
				component: e,
				uid: "date-range-sheet",
				close: () => {
					this.isOpen = !1;
				}
			});
		} else i.component(t, {
			title: "Select Date Range",
			hideActions: !0,
			position: e
		}).then(() => {
			this.isOpen = !1;
		});
	}
	closeDropdown() {
		this.isMobile ? a.dismiss("date-range-sheet") : i.dismiss(), this.isOpen = !1;
	}
	shiftDateRange(e, t) {
		if (t.stopPropagation(), !this.dateFrom.value || !this.dateTo.value) return;
		let n = (0, y.default)(this.dateFrom.value), r = (0, y.default)(this.dateTo.value);
		if (!n.isValid() || !r.isValid()) return;
		let i = this.getDateFormat(), a = e > 0 ? 1 : -1, o = r.diff(n, "day") + 1, s, c;
		if (this.step !== void 0) typeof this.step == "number" ? (s = a * this.step, c = "day") : this.step === "day" ? (s = a * o, c = "day") : (s = a, c = this.step);
		else {
			let e = function(e, t) {
				return {
					isFullMonth: e.date() === 1 && t.isSame(e.endOf("month"), "day"),
					isFullQuarter: e.isSame(e.startOf("quarter"), "day") && t.isSame(t.endOf("quarter"), "day"),
					isFullYear: e.isSame(e.startOf("year"), "day") && t.isSame(t.endOf("year"), "day"),
					isFullWeek: e.day() === 0 && t.day() === 6 && t.diff(e, "days") === 6
				};
			}(n, r);
			e.isFullYear ? (s = a, c = "year") : e.isFullMonth ? (s = a, c = "month") : e.isFullWeek ? (s = a, c = "week") : (s = a * o, c = "day");
		}
		let l = n.add(s, c), u = r.add(s, c);
		this.minDate && l.isBefore((0, y.default)(this.minDate)) || this.maxDate && u.isAfter((0, y.default)(this.maxDate)) || (this.setDateRange(l.format(i), u.format(i)), this.checkAndUpdateActivePreset(l.format(i), u.format(i)));
	}
	handleKeyboardNavigation(e) {
		let t = e.key;
		if (this.dateFrom.value && this.dateTo.value && !this.disabled) switch (t) {
			case "PageUp":
				(e.target === this || this.contains(e.target)) && (this.shiftDateRange(-1, e), e.preventDefault());
				break;
			case "PageDown":
				(e.target === this || this.contains(e.target)) && (this.shiftDateRange(1, e), e.preventDefault());
				break;
			case "Home":
				if (e.ctrlKey && (e.target === this || this.contains(e.target))) {
					let t = (0, y.default)(this.dateFrom.value), n = (0, y.default)(this.dateTo.value), r = t.startOf("month"), i = n.diff(t, "day");
					this.setDateRange(r.format(this.getDateFormat()), r.add(i, "day").format(this.getDateFormat())), e.preventDefault();
				}
				break;
			case "End": if (e.ctrlKey && (e.target === this || this.contains(e.target))) {
				let t = (0, y.default)(this.dateFrom.value), n = (0, y.default)(this.dateTo.value), r = n.diff(t, "day"), i = n.endOf("month");
				this.setDateRange(i.subtract(r, "day").format(this.getDateFormat()), i.format(this.getDateFormat())), e.preventDefault();
			}
		}
	}
	checkAndUpdateActivePreset(e, t) {
		let n = this.presetRanges.find((n) => n.range.dateFrom === e && n.range.dateTo === t);
		this.activePreset = n ? n.label : null;
	}
	checkMobileView() {
		this.isMobile = window.innerWidth < 768;
	}
	canNavigateBackward() {
		if (!this.dateFrom.value || !this.minDate) return !0;
		let e = (0, y.default)(this.dateFrom.value), t = (0, y.default)(this.minDate);
		return e.isAfter(t);
	}
	canNavigateForward() {
		if (!this.dateTo.value || !this.maxDate) return !0;
		let e = (0, y.default)(this.dateTo.value), t = (0, y.default)(this.maxDate);
		return e.isBefore(t);
	}
	announceToScreenReader(e) {
		this.announceMessage = e, l(100).pipe(c(this.disconnecting)).subscribe(() => {
			this.announceMessage = "";
		});
	}
	render() {
		return p`
			<div class="relative ${this.disabled ? "opacity-60 pointer-events-none" : ""}">
				<!-- Screen reader announcements -->
				<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
					${this.announceMessage}
				</div>

				<!-- Collapsed: icon-only on mobile when collapse=true -->
				<schmancy-icon-button
					class="${this.collapse ? "lg:hidden" : "hidden"}"
					variant="outlined"
					type="button"
					aria-label="Select date range. Current: ${this.selectedDateRange || "No date selected"}"
					@click=${(e) => this.toggleDropdown(e)}
					?disabled=${this.disabled}
				>
					date_range
				</schmancy-icon-button>

				<!-- Full UI: always visible when collapse=false, or lg+ when collapse=true -->
				<section @click=${(e) => e.stopPropagation()} class="${this.collapse ? "hidden lg:flex" : "flex"}">
						<schmancy-icon-button
							type="button"
							aria-label="Previous ${this.activePreset ? this.activePreset.toLowerCase() : "date range"}"
							@click=${(e) => this.shiftDateRange(-1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value || !this.canNavigateBackward()}
						>
							arrow_left
						</schmancy-icon-button>

						<schmancy-button
							class="w-max"
							variant="outlined"
							type="button"
							aria-haspopup="menu"
							aria-expanded=${this.isOpen}
							aria-label="Select date range. Current: ${this.selectedDateRange || "No date selected"}"
							aria-readonly="${this.step !== void 0}"
							@click=${(e) => this.toggleDropdown(e)}
							?disabled=${this.disabled}
							style="${this.step === void 0 ? "" : "cursor: default;"}"
						>
							${this.selectedDateRange || this.placeholder}
						</schmancy-button>

						<schmancy-icon-button
							type="button"
							aria-label="Next ${this.activePreset ? this.activePreset.toLowerCase() : "date range"}"
							@click=${(e) => this.shiftDateRange(1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value || !this.canNavigateForward()}
						>
							arrow_right
						</schmancy-icon-button>
				</section>
			</div>
		`;
	}
};
n([d({ type: String })], D.prototype, "type", void 0), n([d({ type: Object })], D.prototype, "dateFrom", void 0), n([d({ type: Object })], D.prototype, "dateTo", void 0), n([d({ type: String })], D.prototype, "minDate", void 0), n([d({ type: String })], D.prototype, "maxDate", void 0), n([d({ type: Array })], D.prototype, "customPresets", void 0), n([d({ type: String })], D.prototype, "format", void 0), n([d({ type: Boolean })], D.prototype, "disabled", void 0), n([d({ type: Boolean })], D.prototype, "required", void 0), n([d({ type: String })], D.prototype, "placeholder", void 0), n([d({ type: Boolean })], D.prototype, "clearable", void 0), n([d()], D.prototype, "step", void 0), n([d({ type: Boolean })], D.prototype, "collapse", void 0), n([f()], D.prototype, "isOpen", void 0), n([f()], D.prototype, "selectedDateRange", void 0), n([f()], D.prototype, "activePreset", void 0), n([f()], D.prototype, "announceMessage", void 0), n([f()], D.prototype, "isMobile", void 0), D = n([u("schmancy-date-range")], D);
export { T as n, D as t };
