import { M as e } from "./store-Bmj6rvZY.js";
import { n as t, t as n } from "./theme.events-Bw3mYjUA.js";
import { BehaviorSubject as r, Observable as i, defaultIfEmpty as a, distinctUntilChanged as o, fromEvent as s, map as c, of as l, shareReplay as u, switchMap as d, takeUntil as f, tap as p, timer as m } from "rxjs";
var h = e({
	scheme: "auto",
	color: "#6200ee"
}, "local", "schmancy-theme-settings"), g = class e {
	get scheme() {
		return h.value.scheme;
	}
	get color() {
		return h.value.color;
	}
	get theme() {
		return this._theme$.getValue();
	}
	get themeComponent() {
		return this._themeComponent$.getValue();
	}
	get fullscreen() {
		return this._fullscreen$.getValue();
	}
	get bottomOffset() {
		return this._bottomOffset$.getValue();
	}
	constructor() {
		this._theme$ = new r({}), this._themeComponent$ = new r(null), this._fullscreen$ = new r(!1), this._bottomOffset$ = new r(0), this.scheme$ = h.$.pipe(c((e) => e.scheme), o(), u(1)), this.color$ = h.$.pipe(c((e) => e.color), o(), u(1)), this.theme$ = this._theme$.asObservable().pipe(o((e, t) => JSON.stringify(e) === JSON.stringify(t)), u(1)), this.themeComponent$ = this._themeComponent$.asObservable().pipe(o(), u(1)), this.fullscreen$ = this._fullscreen$.asObservable().pipe(o(), u(1)), this.bottomOffset$ = this._bottomOffset$.asObservable().pipe(o(), u(1)), this.resolvedScheme$ = this.scheme$.pipe(d((e) => {
			if (e === "auto") {
				let e = window.matchMedia("(prefers-color-scheme: dark)");
				return new i((t) => {
					let n = (e) => {
						t.next(e.matches ? "dark" : "light");
					};
					return e.addEventListener("change", n), t.next(e.matches ? "dark" : "light"), () => e.removeEventListener("change", n);
				});
			}
			return l(e);
		}), o(), u(1)), this.discoverTheme();
	}
	discoverTheme() {
		return s(window, n).pipe(f(m(100)), c((e) => e.detail.theme), a(null), p((e) => {
			e && this.registerThemeComponent(e);
		})).pipe(p(() => {
			window.dispatchEvent(new CustomEvent(t, {
				bubbles: !0,
				composed: !0
			}));
		}), d(() => s(window, n).pipe(f(m(100)), c((e) => e.detail.theme), a(null), p((e) => {
			e && this.registerThemeComponent(e);
		}))));
	}
	registerThemeComponent(e) {
		this._themeComponent$.next(e), h.set({
			scheme: e.scheme,
			color: e.color
		}), this._theme$.next(e.theme);
	}
	updateTheme(e) {
		let t = {};
		e.scheme !== void 0 && (t.scheme = e.scheme), e.color !== void 0 && (t.color = e.color), Object.keys(t).length > 0 && h.set(t), e.theme !== void 0 && this._theme$.next(e.theme);
	}
	setScheme(e) {
		let t = this.themeComponent;
		t && (t.scheme = e), h.set({ scheme: e });
	}
	setColor(e) {
		let t = this.themeComponent;
		t && (t.color = e), h.set({ color: e });
	}
	isDarkMode() {
		return this.resolvedScheme$.pipe(c((e) => e === "dark"));
	}
	toggleScheme() {
		let e = this.scheme, t = e === "dark" ? "light" : e === "light" ? "dark" : "light";
		this.setScheme(t);
	}
	getCSSVariable(e) {
		let t = this.themeComponent;
		if (t) {
			let n = t.root ? document.body : t.shadowRoot?.host;
			if (n) return getComputedStyle(n).getPropertyValue(`--schmancy-${e}`).trim();
		}
		return "";
	}
	watchCSSVariable(e) {
		return this.theme$.pipe(c(() => this.getCSSVariable(e)), o());
	}
	setFullscreen(e) {
		this._fullscreen$.next(e), window.dispatchEvent(new CustomEvent("fullscreen", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	toggleFullscreen() {
		this.setFullscreen(!this.fullscreen);
	}
	setBottomOffset(e) {
		this._bottomOffset$.next(e);
	}
	next(e) {
		e.fullscreen !== void 0 && this.setFullscreen(e.fullscreen), e.scheme !== void 0 && this.setScheme(e.scheme), e.color !== void 0 && this.setColor(e.color);
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
}.getInstance(), _ = g;
export { g as n, _ as t };
