import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { EMPTY as n, ReplaySubject as r, Subject as i, bufferTime as a, catchError as o, distinctUntilChanged as s, filter as c, fromEvent as l, map as u, merge as d, of as f, shareReplay as p, skip as m, startWith as h, switchMap as g, take as _, takeUntil as v, tap as y, timeout as b, zip as x } from "rxjs";
import { customElement as S, property as C, queryAssignedElements as w } from "lit/decorators.js";
import { css as T, html as E } from "lit";
var D = new i(), O = "FINDING_MORTIES", k = "HERE_RICKY", A = /* @__PURE__ */ new WeakMap(), j = class e {
	get areaSubjects() {
		let e = A.get(this);
		return e || (e = /* @__PURE__ */ new Map(), A.set(this, e)), e;
	}
	constructor() {
		this.prettyURL = !1, this.mode = "HISTORY", this.request = new r(1), this.current = /* @__PURE__ */ new Map(), this.$current = new r(1), this.enableHistoryMode = !0, this.findingMortiesEvent = new CustomEvent(O), this.disposed = !1, this.isProcessingPopstate = !1, this.$current.next(this.current), this.$current.subscribe((e) => {
			this.disposed || e.forEach((e, t) => {
				this.getOrCreateAreaSubject(t).next(e);
			});
		}), this.initializeFromBrowserState(), typeof window < "u" && (this.unloadSubscription = l(window, "unload").subscribe(() => {
			this.dispose();
		}));
	}
	initializeFromBrowserState() {
		try {
			let e = history.state;
			e && e.schmancyAreas && (Object.entries(e.schmancyAreas).forEach(([e, t]) => {
				this.current.set(e, t);
			}), this.$current.next(this.current));
		} catch {}
	}
	getOrCreateAreaSubject(e) {
		let t = this.areaSubjects.get(e);
		if (!t || t.closed) {
			t = new r(1), this.areaSubjects.set(e, t);
			let n = this.current.get(e);
			n && t.next({
				...n,
				state: n.state || {},
				params: n.params || {},
				props: n.props || {}
			});
		}
		return t;
	}
	on(e, t = !1) {
		if (!e) throw Error("Area name is required");
		let n = this.getOrCreateAreaSubject(e).asObservable().pipe(s((e, t) => e.component === t.component && JSON.stringify(e.state) === JSON.stringify(t.state) && JSON.stringify(e.params) === JSON.stringify(t.params) && JSON.stringify(e.props) === JSON.stringify(t.props)), p(1));
		return t ? n.pipe(m(1)) : n;
	}
	all(e = !1) {
		let t = this.$current.asObservable().pipe(p(1));
		return e ? t.pipe(m(1)) : t;
	}
	getState(e) {
		if (!e) throw Error("Area name is required");
		return this.on(e).pipe(u((e) => e.state), c((e) => e != null), s((e, t) => JSON.stringify(e) === JSON.stringify(t)), u((e) => e), o((e) => n));
	}
	params(e) {
		if (!e) throw Error("Area name is required");
		let t = { ...this.current.get(e)?.params ?? {} };
		return typeof window < "u" && window.location.search && new URLSearchParams(window.location.search).forEach((e, n) => {
			t[n] = e;
		}), this.on(e).pipe(u((e) => e.params ?? {}), h(t), s((e, t) => JSON.stringify(e) === JSON.stringify(t)), o((e) => n));
	}
	param(e, t) {
		if (!e || !t) throw Error("Area name and key are required");
		return this.params(e).pipe(u((e) => e[t]), c((e) => e !== void 0), s(), u((e) => e), o((e) => n));
	}
	props(e) {
		if (!e) throw Error("Area name is required");
		return this.on(e).pipe(u((e) => e.props), c((e) => e != null), s((e, t) => JSON.stringify(e) === JSON.stringify(t)), u((e) => e), o((e) => n));
	}
	prop(e, t) {
		if (!e || !t) throw Error("Area name and key are required");
		return this.props(e).pipe(u((e) => e[t]), c((e) => e !== void 0), s(), u((e) => e), o((e) => n));
	}
	find() {
		return x([l(window, k).pipe(u((e) => e.detail), a(0)), f(1).pipe(y(() => window.dispatchEvent(this.findingMortiesEvent)))]).pipe(u(([e]) => e), b(1), o(() => n));
	}
	push(e) {
		if (!e.area) throw Error("Area is required for route action");
		if (this.isProcessingPopstate) return;
		let t = {
			...e,
			state: e.state || {},
			params: e.params || {},
			props: e.props || {},
			_source: "programmatic"
		};
		this.enableHistoryMode && D.next(t), this.request.next(t), this.dispatchAreaEvent(t.area, t);
	}
	_updateFromBrowser(e) {
		let t = {
			...e,
			state: e.state || {},
			params: e.params || {},
			props: e.props || {},
			_source: "browser"
		};
		this.isProcessingPopstate = !0, this.request.next(t), this.isProcessingPopstate = !1;
	}
	_updateBrowserHistory(e, t, n, r, i) {
		if (this.enableHistoryMode) try {
			let a = history.state || {}, o = a.schmancyAreas || {}, s = {
				component: t.component,
				area: t.area
			};
			t.state && Object.keys(t.state).length > 0 && (s.state = t.state), t.params && Object.keys(t.params).length > 0 && (s.params = t.params), t.props && Object.keys(t.props).length > 0 && (s.props = t.props), o[e] = s;
			let c = {
				...a,
				schmancyAreas: o
			}, l = this.createCleanURL(o, r, i);
			n === "replace" || n === "pop" ? history.replaceState(c, "", l) : n !== "push" && n || history.pushState(c, "", l);
		} catch {}
	}
	createCleanURL(e, t, n) {
		let r = "/";
		if (n) r = n, r.startsWith("/") || (r = "/" + r), r.endsWith("/") || (r += "/");
		else {
			let e = location.pathname, t = e.split("/"), n = t[t.length - 1];
			n && (n.includes("{") || n.includes("%7B")) ? (t.pop(), r = t.join("/") || "/") : r = e, r === "/" || r.endsWith("/") || (r += "/");
		}
		let i = "";
		if (!0 !== t) {
			let n = new URLSearchParams(location.search);
			Object.values(e).forEach((e) => {
				e.params && Object.keys(e.params).length > 0 && Object.entries(e.params).forEach(([e, t]) => {
					t != null && n.set(e, String(t));
				});
			}), Array.isArray(t) && t.forEach((e) => n.delete(e)), i = n.toString(), i = i ? `?${i}` : "";
		}
		if (this.prettyURL) {
			let t = e.main;
			if (t) {
				let e = r === "/" ? `/${t.component}` : `${r}${t.component}`, n = new URLSearchParams(i);
				t.params && Object.entries(t.params).forEach(([e, t]) => {
					typeof t != "string" && typeof t != "number" || n.set(e, String(t));
				});
				let a = n.toString();
				return e + (a ? `?${a}` : "");
			}
		}
		try {
			let t = {};
			if (Object.entries(e).forEach(([e, n]) => {
				let r = { component: n.component };
				n.state && Object.keys(n.state).length > 0 && (r.state = n.state), n.params && Object.keys(n.params).length > 0 && (r.params = n.params), n.props && Object.keys(n.props).length > 0 && (r.props = n.props), t[e] = r;
			}), Object.keys(t).length === 0) return `${r === "/" ? "" : r.replace(/\/$/, "")}${i}`;
			let n = encodeURIComponent(JSON.stringify(t));
			return `${r === "/" ? "" : r.replace(/\/$/, "")}/${n}${i}`;
		} catch {
			return location.pathname;
		}
	}
	restoreFromBrowserState(e) {
		try {
			if (e && e.schmancyAreas) return e.schmancyAreas;
		} catch {}
		return this.parseStateFromURL();
	}
	parseStateFromURL() {
		let e = location.pathname.split("/").pop();
		if (!e) return {};
		try {
			let t = JSON.parse(decodeURIComponent(e));
			if (typeof t == "object" && t) return t;
		} catch {}
		return {};
	}
	dispatchAreaEvent(e, t) {
		let n = new CustomEvent(`schmancy-area-${e}-changed`, {
			detail: {
				area: e,
				component: t.component,
				state: t.state,
				params: t.params,
				props: t.props,
				historyStrategy: t.historyStrategy
			},
			bubbles: !0,
			composed: !0
		});
		window.dispatchEvent(n);
	}
	pop(e) {
		if (!e) throw Error("Area name is required");
		let t = this.areaSubjects.get(e);
		if (t && !t.closed && t.next({
			component: null,
			state: {},
			area: e,
			params: {},
			props: {}
		}), this.request.next({
			area: e,
			component: null,
			state: {},
			params: {},
			props: {},
			historyStrategy: "silent",
			_source: "programmatic"
		}), this.current.delete(e), this.$current.next(this.current), this.enableHistoryMode) try {
			let t = history.state || {}, n = { ...t.schmancyAreas || {} };
			delete n[e];
			let r = {
				...t,
				schmancyAreas: n
			}, i = this.createCleanURL(n);
			history.replaceState(r, "", i);
		} catch {}
	}
	clear() {
		if (this.areaSubjects.forEach((e) => e.complete()), this.areaSubjects.clear(), this.current.clear(), this.$current.next(this.current), this.enableHistoryMode) {
			let e = this.createCleanURL({});
			history.replaceState({ schmancyAreas: {} }, "", e);
		}
	}
	dispose() {
		this.disposed || (this.disposed = !0, this.unloadSubscription &&= (this.unloadSubscription.unsubscribe(), void 0), this.areaSubjects.forEach((e) => e.complete()), this.areaSubjects.clear(), this.request.complete(), this.$current.complete(), D.complete(), this.current.clear(), A.delete(this));
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
	get state() {
		try {
			let e = history.state;
			if (e && e.schmancyAreas) return e.schmancyAreas;
		} catch {}
		return this.parseStateFromURL();
	}
	hasArea(e) {
		return this.current.has(e);
	}
	getActiveAreas() {
		return Array.from(this.current.keys());
	}
	getRoute(e) {
		return this.current.get(e);
	}
}.getInstance(), M = class extends t(T`
  :host {
    display: none;
  }
`) {
	constructor(...e) {
		super(...e), this.exact = !1;
	}
	getConfig() {
		return {
			when: this.when,
			component: this.component,
			exact: this.exact,
			guard: this.guard
		};
	}
	render() {
		return E``;
	}
};
e([C({ type: String })], M.prototype, "when", void 0), e([C({ type: Object })], M.prototype, "component", void 0), e([C({ type: Boolean })], M.prototype, "exact", void 0), e([C({ type: Object })], M.prototype, "guard", void 0), M = e([S("schmancy-route")], M);
var N = function(e) {
	return e.push = "push", e.replace = "replace", e.pop = "pop", e.silent = "silent", e;
}({}), P = class extends t(T`
	:host {
		position: relative;
		display: block;
		inset: 0;
		contain: layout style;
	}
`) {
	firstUpdated() {
		if (!this.name) throw Error("Area name is required");
		d(j.request.pipe(c(({ area: e }) => e === this.name)), f(null).pipe(_(1), u(() => {
			let e = location.pathname, t = e.split("/").pop() || "";
			if (t && (t.includes("{") || t.includes("%7B"))) try {
				let e = JSON.parse(decodeURIComponent(t));
				if (e[this.name]) return {
					area: this.name,
					component: e[this.name].component,
					state: e[this.name].state || {},
					params: e[this.name].params || {},
					props: e[this.name].props || {},
					historyStrategy: N.replace
				};
			} catch {}
			let n = e.split("/").filter(Boolean).find((e) => this.routes?.some((t) => t.when === e));
			return n ? {
				area: this.name,
				component: n,
				state: {},
				params: {},
				historyStrategy: N.silent
			} : this.default ? {
				area: this.name,
				component: this.default,
				state: {},
				params: {},
				historyStrategy: N.silent
			} : null;
		})), l(window, "popstate").pipe(u(() => {
			if (history.state?.schmancyAreas?.[this.name]) {
				let e = history.state.schmancyAreas[this.name];
				return {
					area: this.name,
					component: e.component,
					state: e.state || {},
					params: e.params || {},
					props: e.props || {},
					historyStrategy: N.pop
				};
			}
			let e = location.pathname, t = e.split("/").pop() || "";
			if (t && (t.includes("{") || t.includes("%7B"))) try {
				let e = JSON.parse(decodeURIComponent(t));
				if (e[this.name]) return {
					area: this.name,
					component: e[this.name].component,
					state: e[this.name].state || {},
					params: e[this.name].params || {},
					props: e[this.name].props || {},
					historyStrategy: N.replace
				};
			} catch {}
			let n = e.split("/").filter(Boolean).find((e) => this.routes?.some((t) => t.when === e));
			return n ? {
				area: this.name,
				component: n,
				state: {},
				params: {},
				historyStrategy: N.silent
			} : this.default ? {
				area: this.name,
				component: this.default,
				state: {},
				params: {},
				historyStrategy: N.silent
			} : null;
		}))).pipe(c((e) => e !== null), y(() => performance.mark(`area-${this.name}-nav-start`)), g(async (e) => {
			let t, n = e.component;
			if (typeof n == "string" && this.routes && (t = this.routes.find((e) => e.when === n), t && (n = t.component)), !t && typeof n == "function" && ("preload" in n || "_promise" in n || "_module" in n)) try {
				n = (await n()).default;
				let e = customElements.getName(n);
				e && this.routes && (t = this.routes.find((t) => t.when === e));
			} catch {
				return {
					...e,
					component: null,
					matchedRoute: void 0
				};
			}
			if (!t && n instanceof HTMLElement && this.routes) {
				let e = n.tagName.toLowerCase();
				t = this.routes.find((t) => t.when === e);
			}
			return {
				...e,
				component: n,
				matchedRoute: t
			};
		}), g((e) => e.matchedRoute?.guard ? e.matchedRoute.guard.pipe(g((t) => {
			if (!0 === t) return f(e);
			let r = new CustomEvent("redirect", {
				detail: {
					blockedRoute: e.matchedRoute?.when || "unknown",
					area: this.name,
					params: e.params || {},
					state: e.state || {},
					redirectTarget: typeof t == "object" ? t : void 0
				},
				bubbles: !0,
				composed: !0
			});
			return e.matchedRoute.dispatchEvent(r), n;
		})) : f(e)), g(async (e) => {
			let t = e.component;
			if (typeof t == "function" && ("preload" in t || "_promise" in t || "_module" in t)) try {
				t = (await t()).default;
			} catch {
				return {
					...e,
					component: null
				};
			}
			return {
				...e,
				component: t
			};
		}), u((e) => {
			let t = "", n = e.component;
			n && n !== "" ? typeof n == "string" ? t = n : n instanceof HTMLElement ? t = n.tagName.toLowerCase() : typeof n == "function" && (t = n.name || "CustomElement") : t = "null";
			let r = `${t}${JSON.stringify(e.params)}${JSON.stringify(e.state)}${JSON.stringify(e.props)}`;
			return {
				...e,
				key: r,
				tagName: t
			};
		}), s((e, t) => e.key === t.key), u((e) => {
			let t = null, n = e.component;
			if (n && n !== "") {
				if (typeof n == "string") try {
					t = document.createElement(n);
				} catch {}
				else if (n instanceof HTMLElement) t = n;
				else if (typeof n == "function") try {
					t = new n();
				} catch {}
			} else t = null;
			return t && (e.params && Object.assign(t, e.params), e.props && Object.assign(t, e.props), e.state && (t.state = e.state)), {
				element: t,
				route: e
			};
		}), p(1), y(({ element: e, route: t }) => this.swapComponents(e, t)), y(() => {
			performance.mark(`area-${this.name}-nav-end`), performance.measure(`area-${this.name}-navigation`, `area-${this.name}-nav-start`, `area-${this.name}-nav-end`);
		}), o((e) => n), v(this.disconnecting)).subscribe();
	}
	swapComponents(e, t) {
		let n = Array.from(this.children).find((e) => !(e instanceof M));
		if (!e) return void n?.remove();
		let r = t.animationDuration ?? 150;
		if (r === 0) n?.remove(), this.appendChild(e);
		else if (n) n.style.willChange = "opacity", e.style.willChange = "opacity", n.style.contentVisibility = "hidden", n.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: r,
			easing: "ease-out"
		}).onfinish = () => {
			n.remove(), this.appendChild(e), e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: r,
				easing: "ease-in"
			}).onfinish = () => {
				e.style.willChange = "auto";
			};
		};
		else {
			e.style.willChange = "opacity", this.appendChild(e);
			let t = r > 100 ? Math.max(100, .66 * r) : r;
			e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: t,
				easing: "ease-in"
			}).onfinish = () => {
				e.style.willChange = "auto";
			};
		}
		let i = {
			component: e.tagName.toLowerCase(),
			state: t.state || {},
			area: this.name,
			params: t.params || {},
			props: t.props || {}
		};
		j.current.set(this.name, i), j.$current.next(j.current), j.enableHistoryMode && j._updateBrowserHistory(this.name, i, t.historyStrategy || N.push, t.clearQueryParams, t.path);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), j.pop(this.name);
	}
	render() {
		return E`<slot></slot>`;
	}
};
function F(e) {
	return btoa(e);
}
function I(e) {
	return atob(e);
}
function L(e, t) {
	if (e === t) return !0;
	if (typeof e != "function" || typeof t != "function") return !1;
	if (e.name && t.name && e.name === t.name) return !0;
	let n = e.observedAttributes, r = t.observedAttributes;
	if (n && r && Array.isArray(n) && Array.isArray(r)) return n.length === r.length && n.every((e, t) => e === r[t]);
	try {
		let n = e.prototype, r = t.prototype;
		if (Object.getPrototypeOf(n) === Object.getPrototypeOf(r)) {
			let e = Object.getOwnPropertyNames(n).sort(), t = Object.getOwnPropertyNames(r).sort();
			return e.length === t.length && e.every((e, n) => e === t[n]);
		}
	} catch {}
	return !1;
}
function R(e) {
	return e.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function z(e) {
	if (typeof e == "string") return e.toLowerCase();
	if (e instanceof HTMLElement) return e.tagName.toLowerCase();
	if (typeof e == "function") {
		let t = e.name;
		if (t) return t.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
	}
	return null;
}
function B(e, t) {
	let n = { ...e };
	for (let e in t) if (t.hasOwnProperty(e)) {
		let r = t[e], i = n[e];
		V(r) && V(i) ? n[e] = B(i, r) : n[e] = r;
	}
	return n;
}
function V(e) {
	return typeof e == "object" && !!e && e.constructor === Object && Object.prototype.toString.call(e) === "[object Object]";
}
function H(e, t) {
	let n = null;
	return function(...r) {
		let i = this;
		n !== null && clearTimeout(n), n = setTimeout(() => {
			e.apply(i, r), n = null;
		}, t);
	};
}
function U(e) {
	try {
		let t = JSON.stringify(e);
		return encodeURIComponent(t);
	} catch {
		return "";
	}
}
function W(e) {
	if (!e) return {};
	try {
		let t = JSON.parse(decodeURIComponent(e));
		if (V(t)) return t;
	} catch {}
	return {};
}
function G(e, t) {
	if (e.area !== t.area || typeof e.component != typeof t.component) return !1;
	if (typeof e.component == "string" && typeof t.component == "string") {
		if (R(e.component) !== R(t.component)) return !1;
	} else if (typeof e.component == "function" && typeof t.component == "function") {
		if (!L(e.component, t.component)) return !1;
	} else if (e.component !== t.component) return !1;
	return JSON.stringify(e.state || {}) === JSON.stringify(t.state || {}) && JSON.stringify(e.params || {}) === JSON.stringify(t.params || {});
}
function K(e, t) {
	return e.area === t.area && e.component === t.component && JSON.stringify(e.state || {}) === JSON.stringify(t.state || {}) && JSON.stringify(e.params || {}) === JSON.stringify(t.params || {});
}
function q(e) {
	let t = z(e.component) || "unknown", n = J(JSON.stringify(e.state || {})), r = J(JSON.stringify(e.params || {}));
	return `${e.area}:${t}:${n}:${r}`;
}
function J(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t &= t;
	return Math.abs(t).toString(36);
}
function Y(e, t = [
	"password",
	"token",
	"secret",
	"apiKey"
]) {
	let n = {};
	for (let r in e) if (e.hasOwnProperty(r) && !t.includes(r)) {
		let i = e[r];
		V(i) ? n[r] = Y(i, t) : Array.isArray(i) ? n[r] = i.map((e) => V(e) ? Y(e, t) : e) : n[r] = i;
	}
	return n;
}
function X(e) {
	let t = {}, n;
	return n = e instanceof URLSearchParams ? e : typeof e == "string" ? new URL(e, window.location.origin).searchParams : new URLSearchParams(window.location.search), n.forEach((e, n) => {
		t[n] = e;
	}), t;
}
function Z(e) {
	let t = new URLSearchParams();
	for (let n in e) if (e.hasOwnProperty(n)) {
		let r = e[n];
		r != null && r !== "" && t.set(n, String(r));
	}
	let n = t.toString();
	return n ? `?${n}` : "";
}
e([C()], P.prototype, "name", void 0), e([C()], P.prototype, "default", void 0), e([w({
	selector: "schmancy-route",
	flatten: !0
})], P.prototype, "routes", void 0), P = e([S("schmancy-area")], P);
export { D as C, j as S, P as _, q as a, O as b, B as c, z as d, V as f, F as g, I as h, G as i, U as l, Y as m, K as n, H as o, R as p, L as r, W as s, Z as t, X as u, N as v, k as x, M as y };
