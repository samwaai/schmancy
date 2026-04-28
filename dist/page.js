import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-CszkJuNl.js";
import "./mixins.js";
import { n } from "./theme.service-cOfPrtfe.js";
import { t as r } from "./layout-fjM1DWlF.js";
import "./scroll-DXQv0ejL.js";
import { EMPTY as i, Subject as a, combineLatest as o, fromEvent as s, merge as c, timer as l } from "rxjs";
import { debounceTime as u, distinctUntilChanged as d, map as f, startWith as p, switchMap as m, takeUntil as h, tap as g } from "rxjs/operators";
import { customElement as _, property as v } from "lit/decorators.js";
import { css as y, html as b } from "lit";
var x = class extends t(y`
	:host {
		display: block;
		box-sizing: border-box;
		touch-action: pan-x pan-y;
		overscroll-behavior: none;
		-webkit-tap-highlight-color: transparent;
	}
`) {
	constructor(...e) {
		super(...e), this.rows = "auto_1fr_auto", this.showScrollbar = !1, this.noSelect = !1, this.heightDisconnecting$ = new a();
	}
	calculateHeight() {
		let e = window.visualViewport?.height ?? window.innerHeight, t = this.getBoundingClientRect().top;
		return Math.max(0, e - t);
	}
	applyHeight(e, t) {
		this.style.height = `${e}px`, this.style.paddingBottom = `${t}px`;
	}
	setupHeightStream() {
		let e = s(window, "resize", { passive: !0 }), t = c(e, window.visualViewport ? c(s(window.visualViewport, "resize", { passive: !0 }), s(window.visualViewport, "scroll", { passive: !0 })) : e, s(window, "orientationchange"), s(document, "focusout", { passive: !0 }).pipe(m(() => l(100)))).pipe(u(16));
		o([
			c(this.parentElement ? r(this.parentElement) : i, t).pipe(p(null)),
			n.bottomOffset$,
			n.fullscreen$
		]).pipe(f(([, e, t]) => ({
			height: this.calculateHeight(),
			padding: t ? 0 : e
		})), d((e, t) => e.height === t.height && e.padding === t.padding), g(({ height: e, padding: t }) => this.applyHeight(e, t)), h(this.heightDisconnecting$)).subscribe();
	}
	connectedCallback() {
		super.connectedCallback(), this.querySelectorAll(":scope > header").forEach((e) => e.setAttribute("slot", "header")), this.querySelectorAll(":scope > footer").forEach((e) => e.setAttribute("slot", "footer")), this.setupHeightStream();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.heightDisconnecting$.next();
	}
	render() {
		return b`
			<section
				class=${this.classMap({
			"grid overflow-hidden h-full": !0,
			"select-none": this.noSelect
		})}
				style="grid-template-rows: ${this.rows.replace(/_/g, " ")}"
			>
				<slot name="header"></slot>
				<schmancy-scroll ?hide=${!this.showScrollbar}><slot></slot></schmancy-scroll>
				<schmancy-scroll ?hide=${!this.showScrollbar}>
					<slot name="footer"></slot>
				</schmancy-scroll>
			</section>
		`;
	}
};
e([v({ type: String })], x.prototype, "rows", void 0), e([v({
	type: Boolean,
	attribute: "show-scrollbar"
})], x.prototype, "showScrollbar", void 0), e([v({
	type: Boolean,
	attribute: "no-select"
})], x.prototype, "noSelect", void 0), x = e([_("schmancy-page")], x);
export { x as SchmancyPage };
