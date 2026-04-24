import { n as e } from "./theme.service-cOfPrtfe.js";
import { EMPTY as t, Observable as n, Subject as r, combineLatest as i, fromEvent as a, merge as o, timer as s } from "rxjs";
import { debounceTime as c, distinctUntilChanged as l, filter as u, map as d, startWith as f, switchMap as p, takeUntil as m, tap as h } from "rxjs/operators";
import { AsyncDirective as g } from "lit/async-directive.js";
import { PartType as _, directive as v } from "lit/directive.js";
function y() {
	let e = window.visualViewport;
	return !!e && Math.abs(e.scale - 1) > .01;
}
var b = null, x = null, S = 0;
function C() {
	if (!b) {
		b = new r();
		let e = a(window, "resize", { passive: !0 });
		x = o(e, window.visualViewport ? o(a(window.visualViewport, "resize", { passive: !0 }), a(window.visualViewport, "scroll", { passive: !0 })) : e, a(window, "orientationchange"), a(document, "focusout", { passive: !0 }).pipe(p(() => s(100)))).pipe(c(16)).subscribe(() => b.next());
	}
	return b;
}
function w() {
	S === 0 && x && (x.unsubscribe(), x = null, b = null);
}
function T(e) {
	return new n((t) => {
		let n = new ResizeObserver((e) => t.next(e));
		return n.observe(e), () => n.disconnect();
	});
}
var E = v(class extends g {
	constructor(...e) {
		super(...e), this.element = null, this.disconnecting$ = new r();
	}
	calculateHeight() {
		if (!this.element) return 0;
		let e = window.visualViewport?.height ?? window.innerHeight, t = this.element.getBoundingClientRect().top;
		return Math.max(0, e - t);
	}
	applyStyles(e, t) {
		this.element && (this.element.style.boxSizing = "border-box", this.element.style.height = `${e}px`, this.element.style.paddingBottom = `${t}px`);
	}
	setupHeightStream() {
		if (!this.element) return;
		let n = this.element;
		i([
			o(n.parentElement ? T(n.parentElement) : t, C()).pipe(f(null)),
			e.bottomOffset$,
			e.fullscreen$
		]).pipe(u(() => !y()), d(([, e, t]) => ({
			height: this.calculateHeight(),
			padding: t ? 0 : e
		})), l((e, t) => e.height === t.height && e.padding === t.padding), h(({ height: e, padding: t }) => this.applyStyles(e, t)), m(this.disconnecting$)).subscribe();
	}
	render() {}
	update(e) {
		if (e.type !== _.ELEMENT) throw Error("fullHeight directive can only be used on elements");
		let t = e.element;
		this.element !== t && (this.element = t, S++, this.setupHeightStream());
	}
	disconnected() {
		this.disconnecting$.next(), S--, w(), this.element = null;
	}
	reconnected() {
		this.element && (S++, this.disconnecting$ = new r(), this.setupHeightStream());
	}
}), D = v(class extends g {
	constructor(...e) {
		super(...e), this.element = null, this.disconnecting$ = new r();
	}
	calculateWidth() {
		if (!this.element) return 0;
		let e = window.visualViewport?.width ?? window.innerWidth, t = this.element.getBoundingClientRect().left;
		return Math.max(0, e - t);
	}
	applyStyles(e) {
		this.element && (this.element.style.boxSizing = "border-box", this.element.style.maxWidth = `${e}px`);
	}
	setupWidthStream() {
		if (!this.element) return;
		let n = this.element;
		i([o(T(n), n.parentElement ? T(n.parentElement) : t, C()).pipe(f(null)), e.fullscreen$]).pipe(u(() => !y()), d(() => this.calculateWidth()), l(), h((e) => this.applyStyles(e)), m(this.disconnecting$)).subscribe();
	}
	render() {}
	update(e) {
		if (e.type !== _.ELEMENT) throw Error("fullWidth directive can only be used on elements");
		let t = e.element;
		this.element !== t && (this.element = t, S++, this.setupWidthStream());
	}
	disconnected() {
		this.disconnecting$.next(), S--, w(), this.element = null;
	}
	reconnected() {
		this.element && (S++, this.disconnecting$ = new r(), this.setupWidthStream());
	}
});
export { E as n, D as r, T as t };
