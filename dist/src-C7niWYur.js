import { a as e, o as t, t as n } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t as r } from "./provide-BuzyBLGj.js";
import { t as i } from "./decorate-D_utPUsC.js";
import { t as a } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { S as o, b as ee, x as te } from "./area-Dr4I9R2p.js";
import "./store-CjzZDQt8.js";
import "./audio-ql6nvY0y.js";
import "./autocomplete-CgWUCUU-.js";
import { n as s } from "./theme.service-cOfPrtfe.js";
import { color as c } from "./directives.js";
import "./boat-Dw8TmOzN.js";
import "./busy-D2hP3fOy.js";
import "./button.js";
import "./card-CEdgK9nb.js";
import "./charts.js";
import "./checkbox-Br84TiCs.js";
import "./chips-BNYOweGm.js";
import "./code-highlight-BgExKEto.js";
import "./components-DjKNS9R_.js";
import "./connectivity.js";
import "./date-range-sGkC0KF3.js";
import { n as l } from "./sheet.service-DQE7-_wq.js";
import "./date-range-inline-CpKG6qt2.js";
import "./delay-DwX65fSc.js";
import "./details-CCW52lzz.js";
import "./dialog.js";
import "./discovery.js";
import "./divider-CbEWg3G_.js";
import "./dropdown.js";
import "./expand-bFa_qVDT.js";
import "./float-D5ezUurt.js";
import "./window.js";
import "./extra-HwbaUnCD.js";
import "./form-rCZqoAoK.js";
import "./icons-C5-DIjet.js";
import "./iframe-BXBsuLwt.js";
import "./input-Bc3bVISm.js";
import "./notification-ChAvNXf3.js";
import "./json.js";
import "./layout-Cqghi_rx.js";
import "./lightbox-CnCTvqSu.js";
import "./list-BpjKUOzM.js";
import "./mailbox-CHIpxS3W.js";
import "./map-YY1Q4FWO.js";
import "./menu-BIBUgS1T.js";
import "./navigation-rail.js";
import "./option-Ci7C8xxh.js";
import "./page.js";
import "./progress.js";
import "./qr-scanner.js";
import "./radio-group-B72sYGnS.js";
import "./range.js";
import "./rxjs-utils-CKTnEKUH.js";
import { t as u } from "./theme.interface-Buged9Cg.js";
import "./select-wFDKDLQI.js";
import "./sheet-LFVo5iN4.js";
import "./slider.js";
import "./steps.js";
import "./surface.js";
import "./table-hBEZRxM_.js";
import "./tabs-C7r4TqcX.js";
import "./textarea-CS-KdSLz.js";
import "./theme-Cq_c9IO3.js";
import "./theme-button-OJl2ma0u.js";
import "./tooltip.js";
import "./tree.js";
import { SchmancyEvents as d } from "./types.js";
import "./typewriter-DyN7xa0n.js";
import "./typography.js";
import "./utils-xBXLvebz.js";
import "./breadcrumb.js";
import "./kbd.js";
import "./skeleton.js";
import "./splash-screen-COg3Z6n8.js";
import "./switch.js";
import "./visually-hidden.js";
import { BehaviorSubject as f, Observable as ne, Subject as p, bufferTime as re, concatMap as ie, debounceTime as m, delay as ae, distinctUntilChanged as oe, filter as se, from as ce, fromEvent as h, interval as le, map as g, merge as _, of as v, startWith as ue, take as de, takeUntil as y, tap as b, throwIfEmpty as fe, timeout as pe, timer as me, zip as he } from "rxjs";
import { distinctUntilChanged as ge, filter as x, map as _e, pairwise as ve, take as ye, takeUntil as S, tap as C, throttleTime as be } from "rxjs/operators";
import { customElement as w, property as T, query as E, queryAssignedElements as xe, state as D } from "lit/decorators.js";
import { css as O, html as k, nothing as Se } from "lit";
import { when as Ce } from "lit/directives/when.js";
var A = class extends n(O`
	:host {
		display: inline-flex;
		width: fit-content;
	}

	/* Enhanced pulse animation for better attention-getting */
	@keyframes elegant-pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.85;
		}
	}

	.animate-pulse {
		animation: elegant-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
`) {
	constructor(...e) {
		super(...e), this.color = "primary", this.size = "md", this.shape = "pill", this.outlined = !1, this.icon = "", this.pulse = !1;
	}
	getSizeClasses() {
		switch (this.size) {
			case "xs": return "text-xs py-0.75 px-1.5 gap-0.5 leading-none";
			case "sm": return "text-xs py-1.5 px-2.5 gap-0.5 tracking-wide leading-none";
			case "lg": return "text-base py-2 px-4 gap-1 tracking-wide";
			default: return "text-sm py-1.5 px-3 gap-0.5";
		}
	}
	getShapeClasses() {
		switch (this.shape) {
			case "square": return "rounded";
			case "rounded": return "rounded-md";
			default: return "rounded-full";
		}
	}
	getIconSize() {
		switch (this.size) {
			case "xs": return "11px";
			case "sm": return "13px";
			case "lg": return "18px";
			default: return "15px";
		}
	}
	getExoticStyles() {
		let e = {};
		return this.size === "lg" && (e.letterSpacing = "0.03em", e.fontWeight = "500"), this.size === "sm" && (e.letterSpacing = "0.02em"), e;
	}
	getColorStyles() {
		return {
			primary: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.primary.container} 92%, ${u.sys.color.primary.default} 8%)`,
				text: this.outlined ? u.sys.color.primary.default : u.sys.color.primary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.primary.default} 90%, ${u.sys.color.surface.highest} 10%)` : void 0
			},
			secondary: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.secondary.container} 95%, ${u.sys.color.secondary.default} 5%)`,
				text: this.outlined ? u.sys.color.secondary.default : u.sys.color.secondary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.secondary.default} 85%, ${u.sys.color.surface.highest} 15%)` : void 0
			},
			tertiary: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.tertiary.container} 94%, ${u.sys.color.tertiary.default} 6%)`,
				text: this.outlined ? u.sys.color.tertiary.default : u.sys.color.tertiary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.tertiary.default} 88%, ${u.sys.color.surface.highest} 12%)` : void 0
			},
			success: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.success.container} 90%, ${u.sys.color.success.default} 10%)`,
				text: this.outlined ? u.sys.color.success.default : u.sys.color.success.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.success.default} 85%, ${u.sys.color.surface.bright} 15%)` : void 0
			},
			warning: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.tertiary.container} 85%, ${u.sys.color.tertiary.default} 15%)`,
				text: this.outlined ? u.sys.color.tertiary.default : u.sys.color.tertiary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.tertiary.default} 90%, ${u.sys.color.surface.highest} 10%)` : void 0
			},
			error: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.error.container} 92%, ${u.sys.color.error.default} 8%)`,
				text: this.outlined ? u.sys.color.error.default : u.sys.color.error.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.error.default} 88%, ${u.sys.color.surface.bright} 12%)` : void 0
			},
			neutral: {
				bg: this.outlined ? "transparent" : `color-mix(in srgb, ${u.sys.color.surface.high} 95%, ${u.sys.color.outline} 5%)`,
				text: this.outlined ? `color-mix(in srgb, ${u.sys.color.surface.on} 95%, ${u.sys.color.surface.default} 5%)` : u.sys.color.surface.on,
				border: this.outlined ? `color-mix(in srgb, ${u.sys.color.outline} 85%, ${u.sys.color.surface.highest} 15%)` : void 0
			},
			surface: {
				bg: this.outlined ? "transparent" : u.sys.color.surface.high,
				text: u.sys.color.surface.on,
				border: this.outlined ? u.sys.color.outline : void 0
			}
		}[this.color];
	}
	render() {
		let e = this.getSizeClasses(), t = this.getShapeClasses(), n = this.getColorStyles(), r = this.getIconSize(), i = this.getExoticStyles(), a = {
			"inline-flex items-center justify-center font-medium": !0,
			"transition-all duration-200 ease-in-out": !0,
			[e]: !0,
			[t]: !0,
			"animate-pulse": this.pulse,
			"border border-solid": this.outlined,
			"shadow-sm": !this.outlined && this.size === "sm",
			shadow: !this.outlined && this.size === "md",
			"shadow-md": !this.outlined && this.size === "lg",
			"hover:brightness-95 hover:-translate-y-px": this.outlined,
			"hover:brightness-[0.98]": !this.outlined
		}, o = {
			borderColor: n.border,
			backdropFilter: this.outlined ? "blur(4px)" : void 0,
			boxShadow: this.size !== "lg" || this.outlined ? void 0 : "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)",
			...i
		};
		return k`
			<div
				part="badge"
				class="${this.classMap(a)}"
				style="${this.styleMap(o)}"
				${c({
			bgColor: n.bg,
			color: n.text
		})}
			>
				<!-- Icon slot or named icon -->
				<slot name="icon">
					${this.icon ? k`
								<div part="icon" class="shrink-0 flex items-center justify-center leading-none">
									<schmancy-icon .size=${r} class="flex items-center justify-center">${this.icon}</schmancy-icon>
								</div>
							` : ""}
				</slot>

				<!-- Content with proper spacing from icon -->
				<div part="content" class="flex items-center leading-none tracking-[0.01em] ${this.icon ? "ml-[0.38em]" : ""}">
					<slot></slot>
				</div>
			</div>
		`;
	}
};
i([T({
	type: String,
	reflect: !0
})], A.prototype, "color", void 0), i([T({
	type: String,
	reflect: !0
})], A.prototype, "size", void 0), i([T({
	type: String,
	reflect: !0
})], A.prototype, "shape", void 0), i([T({
	type: Boolean,
	reflect: !0
})], A.prototype, "outlined", void 0), i([T({ type: String })], A.prototype, "icon", void 0), i([T({
	type: Boolean,
	reflect: !0
})], A.prototype, "pulse", void 0), A = i([w("schmancy-badge")], A);
var j = class extends A {};
j = i([w("sch-badge")], j);
var we = new class {
	constructor() {
		this.$drawer = new p(), this.pushCounter = 0, this.isDismissing$ = new f(!1), this.$drawer.pipe(ie((e) => {
			switch (e.action) {
				case "dismiss": return v(e).pipe(b(() => {
					this.isDismissing$.next(!0), this.dispatchToggleEvent(e.ref, "close");
				}), ae(300), b(() => this.isDismissing$.next(!1)));
				case "render": return v(e).pipe(b(() => {
					this.dispatchToggleEvent(e.ref, "open"), this.dispatchRenderEvent(e.ref, e.component, e.title);
				}));
				case "push": return v(e).pipe(b(() => this.handlePush(e.ref, e.component, e.state, e.params, e.props)));
				default: return v(null);
			}
		})).subscribe();
	}
	dispatchToggleEvent(e, t) {
		e.dispatchEvent(new CustomEvent(d.ContentDrawerToggle, {
			detail: { state: t },
			bubbles: !0,
			composed: !0
		}));
	}
	dispatchRenderEvent(e, t, n, r, i, a) {
		e.dispatchEvent(new CustomEvent("schmancy-content-drawer-render", {
			detail: {
				component: t,
				title: n,
				state: r,
				params: i,
				props: a
			},
			bubbles: !0,
			composed: !0
		}));
	}
	dimiss(e) {
		this.$drawer.next({
			action: "dismiss",
			ref: e
		});
	}
	render(e, t, n) {
		e.dispatchEvent(new CustomEvent("custom-event")), this.$drawer.next({
			action: "render",
			ref: e,
			component: t,
			title: n
		});
	}
	handlePush(e, t, n, r, i) {
		let a = {
			...n,
			_drawerPushId: ++this.pushCounter
		};
		this.dispatchToggleEvent(e, "open"), this.dispatchRenderEvent(e, t, void 0, a, r, i);
	}
	push(e) {
		this.$drawer.next({
			action: "push",
			ref: window,
			...e
		});
	}
}(), M = t("push"), N = t("close"), P = t(Math.floor(Math.random() * Date.now()).toString()), F = t("100%"), I = t({}), L = class extends a(O`
	:host {
		position: relative;
		inset: 0;
		display: block;
		overflow: hidden;
	}
`) {
	constructor(...e) {
		super(...e), this.minWidth = {
			main: 360,
			sheet: 576
		}, this.schmancyContentDrawerID = Math.floor(Math.random() * Date.now()).toString(), this.maxHeight = "100%";
	}
	firstUpdated() {
		this.setupResizeListener(), this.setupToggleListener(), this.setupRenderListener();
	}
	setupResizeListener() {
		_(h(window, "resize"), h(window, d.ContentDrawerResize)).pipe(ue(!0), m(100), g(() => this.clientWidth || window.innerWidth), g((e) => e >= this.minWidth.main + this.minWidth.sheet), oe(), b(() => this.updateMaxHeight()), y(this.disconnecting)).subscribe((e) => this.updateMode(e));
	}
	setupToggleListener() {
		h(window, d.ContentDrawerToggle).pipe(b((e) => e.stopPropagation()), g((e) => e.detail.state), y(this.disconnecting)).subscribe((e) => {
			this.open = e;
		});
	}
	setupRenderListener() {
		h(window, "schmancy-content-drawer-render").pipe(b((e) => e.stopPropagation()), g((e) => e.detail), y(this.disconnecting)).subscribe((e) => this.handleRender(e));
	}
	updateMaxHeight() {
		this.maxHeight = window.innerHeight - this.getOffsetTop(this) + "px", this.style.setProperty("max-height", this.maxHeight);
	}
	updateMode(e) {
		e ? (this.mode = "push", this.open = "open") : (this.mode = "overlay", this.open = "close");
	}
	handleRender(e) {
		this.mode === "push" ? o.push({
			area: this.schmancyContentDrawerID,
			component: e.component,
			historyStrategy: "silent",
			state: e.state,
			params: e.params,
			props: e.props
		}) : this.mode === "overlay" && l.open({
			component: e.component,
			uid: this.schmancyContentDrawerID,
			props: e.props
		});
	}
	getOffsetTop(e) {
		let t = 0;
		for (; e;) t += e.offsetTop, e = e.offsetParent;
		return t;
	}
	render() {
		return this.mode && this.open ? k`
			<div class=${[
			"grid h-full",
			"grid-flow-col auto-cols-max",
			"grid-rows-[1fr]",
			"justify-items-stretch items-stretch",
			this.mode === "overlay" ? "grid-cols-[1fr]" : "grid-cols-[auto_1fr]"
		].join(" ")}>
				<slot></slot>
			</div>
		` : Se;
	}
};
i([r({ context: I })], L.prototype, "minWidth", void 0), i([r({ context: N }), T()], L.prototype, "open", void 0), i([r({ context: M }), D()], L.prototype, "mode", void 0), i([r({ context: P })], L.prototype, "schmancyContentDrawerID", void 0), i([r({ context: F })], L.prototype, "maxHeight", void 0), i([xe({ flatten: !0 })], L.prototype, "assignedElements", void 0), L = i([w("schmancy-content-drawer")], L);
var R = class extends a(O`
	:host {
		display: block;
		overflow: hidden;
	}
`) {
	connectedCallback() {
		super.connectedCallback(), this.minWidth ? this.drawerMinWidth.main = this.minWidth : this.minWidth = this.drawerMinWidth.main;
	}
	update(e) {
		super.update(e), e.has("minWidth") && this.minWidth && (this.drawerMinWidth.main = this.minWidth, this.dispatchEvent(new CustomEvent(d.ContentDrawerResize, {
			bubbles: !0,
			composed: !0
		})));
	}
	render() {
		let e = {
			minWidth: `${this.minWidth}px`,
			maxHeight: this.maxHeight
		};
		return k`
			<section class="relative inset-0 h-full">
				<div class=${[
			"grid h-full relative overflow-scroll",
			"grid-flow-col auto-cols-max",
			"grid-rows-[1fr]",
			"items-stretch justify-items-stretch",
			this.mode === "push" ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]"
		].join(" ")}>
					<section style=${this.styleMap(e)}>
						<slot></slot>
					</section>
				</div>
				${Ce(this.mode === "push", () => k` <schmancy-divider class="absolute right-0 top-0" orientation="vertical"></schmancy-divider>`)}
			</section>
		`;
	}
};
i([T({ type: Number })], R.prototype, "minWidth", void 0), i([e({
	context: I,
	subscribe: !0
})], R.prototype, "drawerMinWidth", void 0), i([e({
	context: M,
	subscribe: !0
}), D()], R.prototype, "mode", void 0), i([e({
	context: F,
	subscribe: !0
}), D()], R.prototype, "maxHeight", void 0), R = i([w("schmancy-content-drawer-main")], R);
var z = class extends a(O`
	:host {
		overflow: scroll;
	}
`) {
	connectedCallback() {
		super.connectedCallback(), this.minWidth ? this.drawerMinWidth.sheet = this.minWidth : this.minWidth = this.drawerMinWidth.sheet;
	}
	updated(e) {
		super.updated(e), e.has("minWidth") && this.minWidth ? (this.drawerMinWidth.sheet = this.minWidth, this.dispatchEvent(new CustomEvent(d.ContentDrawerResize, {
			bubbles: !0,
			composed: !0
		}))) : (e.has("state") || e.has("mode")) && (this.mode === "overlay" ? this.state === "close" ? this.closeAll() : this.state : this.mode === "push" && (l.dismiss(this.schmancyContentDrawerID), this.state === "close" ? this.closeAll() : this.state === "open" && this.open()));
	}
	open() {
		this.mode === "overlay" ? this.sheet.style.position = "fixed" : this.sheet.style.position = "relative", this.sheet.style.display = "block", this.sheet.animate([{
			opacity: 0,
			transform: "translateX(100%)"
		}, {
			opacity: 1,
			transform: "translateX(0%)"
		}], {
			duration: 250,
			easing: "cubic-bezier(0.5, 0.01, 0.25, 1)"
		});
	}
	closeAll() {
		_(ce(this.closeModalSheet()), ce(this.closeSheet())).pipe(y(this.disconnecting)).subscribe();
	}
	closeModalSheet() {
		return v(!0).pipe(b(() => l.dismiss(this.schmancyContentDrawerID)));
	}
	closeSheet() {
		return new ne((e) => {
			this.sheet.animate([{
				opacity: 1,
				transform: "translateX(0%)"
			}, {
				opacity: 1,
				transform: "translateX(100%)"
			}], {
				duration: 250,
				easing: "cubic-bezier(0.5, 0.01, 0.25, 1)"
			}).onfinish = () => {
				this.sheet.style.display = "none", e.next(), e.complete();
			};
		});
	}
	render() {
		let e = {
			"block h-full w-full": this.mode === "push",
			"absolute z-50": this.mode === "overlay",
			"opacity-1": this.mode === "overlay" && this.state === "open"
		}, t = {
			minWidth: `${this.minWidth}px`,
			maxHeight: this.maxHeight
		};
		return k`
			<section id="sheet" class="${this.classMap(e)}" style=${this.styleMap(t)}>
				<schmancy-area class="h-full w-full" name="${this.schmancyContentDrawerID}">
					<slot name="placeholder"></slot>
				</schmancy-area>
			</section>
		`;
	}
};
i([T({ type: Number })], z.prototype, "minWidth", void 0), i([e({
	context: M,
	subscribe: !0
}), D()], z.prototype, "mode", void 0), i([e({
	context: N,
	subscribe: !0
}), D()], z.prototype, "state", void 0), i([e({ context: P })], z.prototype, "schmancyContentDrawerID", void 0), i([E("#sheet")], z.prototype, "sheet", void 0), i([xe({
	flatten: !0,
	slot: void 0
})], z.prototype, "defaultSlot", void 0), i([e({
	context: I,
	subscribe: !0
})], z.prototype, "drawerMinWidth", void 0), i([e({
	context: F,
	subscribe: !0
}), D()], z.prototype, "maxHeight", void 0), z = i([w("schmancy-content-drawer-sheet")], z);
var Te = new class {
	constructor() {
		this.$drawer = new p(), this.$drawer.pipe(m(10)).subscribe((e) => {
			e.state ? window.dispatchEvent(new CustomEvent(d.NavDrawer_toggle, {
				detail: { state: "open" },
				bubbles: !0,
				composed: !0
			})) : window.dispatchEvent(new CustomEvent(d.NavDrawer_toggle, {
				detail: { state: "close" },
				bubbles: !0,
				composed: !0
			}));
		});
	}
	open(e) {
		this.$drawer.next({
			self: e,
			state: !0
		});
	}
	close(e) {
		this.$drawer.next({
			self: e,
			state: !1
		});
	}
}(), Ee = Te, B = class extends n(O`
	:host {
		display: block;
		width: 100%;
		min-width: 0;
	}
`) {
	render() {
		return k`<slot></slot>`;
	}
};
B = i([w("schmancy-nav-drawer-appbar")], B);
var V = class extends a(O`
	:host {
		display: block;
		position: relative;
		inset: 0;
		overflow-y: auto;
	}
`) {
	connectedCallback() {
		super.connectedCallback(), h(this, "scroll").pipe(y(this.disconnecting)).subscribe((e) => {
			this.parentElement.dispatchEvent(new CustomEvent("scroll", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		});
	}
	render() {
		return k` <slot></slot> `;
	}
};
V = i([w("schmancy-nav-drawer-content")], V);
var H, U = t("push"), W = t("close"), G = class extends a(O`
	:host {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
		flex-grow: 1;
		height: 100%;
		overflow: hidden;
		/* Initially hide the component until it's ready */
		visibility: hidden;
	}

	:host([data-ready]) {
		visibility: visible;
	}

	:host([fullscreen]) {
		grid-template-columns: 1fr;
	}
`) {
	static {
		H = this;
	}
	constructor(...e) {
		super(...e), this.fullscreen = !1, this.breakpoint = "md";
	}
	static {
		this.BREAKPOINTS = {
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280
		};
	}
	firstUpdated() {
		this.updateState(window.innerWidth), this.setAttribute("data-ready", ""), h(window, "resize").pipe(g((e) => e.target.innerWidth), g((e) => e >= H.BREAKPOINTS[this.breakpoint]), oe(), m(100), y(this.disconnecting)).subscribe((e) => {
			e ? (this.mode = "push", this.open = "open") : (this.mode = "overlay", this.open = "close");
		}), h(window, "fullscreen").pipe(b((e) => {
			let t = e;
			this.fullscreen = t.detail;
		}), y(this.disconnecting)).subscribe(), h(window, d.NavDrawer_toggle).pipe(b((e) => {
			e.stopPropagation();
		}), g((e) => e.detail.state), y(this.disconnecting), m(10)).subscribe((e) => {
			e === "toggle" && (e = this.open === "open" ? "close" : "open"), this.mode === "push" && e === "close" || (this.open = e);
		});
	}
	updateState(e) {
		let t = e >= H.BREAKPOINTS[this.breakpoint];
		this.mode = t ? "push" : "overlay", this.open = t ? "open" : "close";
	}
	render() {
		return k`<slot></slot>`;
	}
};
i([T({
	type: Boolean,
	reflect: !0
})], G.prototype, "fullscreen", void 0), i([T({
	type: String,
	attribute: "breakpoint"
})], G.prototype, "breakpoint", void 0), i([r({ context: U }), D()], G.prototype, "mode", void 0), i([r({ context: W }), T()], G.prototype, "open", void 0), G = H = i([w("schmancy-nav-drawer")], G);
var K = "cubic-bezier(0.5, 0.01, 0.25, 1)", q = class extends a() {
	constructor(...e) {
		super(...e), this.width = "220px", this._initialized = !1;
	}
	firstUpdated() {
		this.mode === "overlay" ? this.drawerState === "close" ? (this.nav.style.transform = "translateX(-100%)", this.overlay.style.display = "none") : this.drawerState === "open" && (this.nav.style.transform = "translateX(0)", this.overlay.style.display = "block", this.overlay.style.opacity = "0.4") : this.mode === "push" && (this.nav.style.transform = "translateX(0)", this.overlay.style.display = "none"), this._initialized = !0;
	}
	updated(e) {
		this._initialized && (e.has("drawerState") || e.has("mode")) && (this.mode === "overlay" ? this.drawerState === "open" ? this.nav.style.transform !== "translateX(0)" && (this.openOverlay(), this.showNavDrawer()) : this.drawerState === "close" && this.nav.style.transform !== "translateX(-100%)" && (this.hideNavDrawer(), this.closeOverlay()) : this.mode === "push" && (this.nav.style.transform !== "translateX(0)" && this.showNavDrawer(), this.overlay.style.display !== "none" && this.closeOverlay()));
	}
	openOverlay() {
		this.overlay.style.display = "block", this.overlay.animate([{ opacity: 0 }, { opacity: .4 }], {
			duration: 200,
			easing: K,
			fill: "forwards"
		});
	}
	closeOverlay() {
		this.overlay.animate([{ opacity: .4 }, { opacity: 0 }], {
			duration: 150,
			easing: K,
			fill: "forwards"
		}).onfinish = () => {
			this.overlay.style.display = "none";
		};
	}
	showNavDrawer() {
		this.nav.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }], {
			duration: 200,
			easing: K,
			fill: "forwards"
		}).onfinish = () => {
			this.nav.style.transform = "translateX(0)";
		};
	}
	hideNavDrawer() {
		this.nav.animate([{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }], {
			duration: 200,
			easing: K,
			fill: "forwards"
		}).onfinish = () => {
			this.nav.style.transform = "translateX(-100%)";
		};
	}
	handleOverlayClick() {
		window.dispatchEvent(new CustomEvent(d.NavDrawer_toggle, {
			detail: { state: "close" },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		let e = {
			"max-w-[360px] w-fit h-full overflow-auto": !0,
			block: this.mode === "push",
			"fixed inset-0 z-50": this.mode === "overlay"
		}, t = { width: this.width };
		return k`
			<nav
				style=${this.styleMap(t)}
				class="${this.classMap({ ...e })}"
				${c({ bgColor: u.sys.color.surface.containerLowest })}
			>
				<slot></slot>
			</nav>
			<div
				id="overlay"
				${c({ bgColor: u.sys.color.scrim })}
				@click=${this.handleOverlayClick}
				class="${this.classMap({ "fixed inset-0 z-49 hidden": !0 })}"
			></div>
		`;
	}
};
i([e({
	context: U,
	subscribe: !0
}), D()], q.prototype, "mode", void 0), i([e({
	context: W,
	subscribe: !0
}), D()], q.prototype, "drawerState", void 0), i([E("#overlay")], q.prototype, "overlay", void 0), i([E("nav")], q.prototype, "nav", void 0), i([T({ type: String })], q.prototype, "width", void 0), i([D()], q.prototype, "_initialized", void 0), q = i([w("schmancy-nav-drawer-navbar")], q);
var J = class extends n(O`
	:host {
		display: flex;
		flex: 1;
		min-width: 48px;
		max-width: 168px;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	button {
		font-family: inherit;
		border: none;
		background: none;
		width: 100%;
		padding: 0;
		margin: 0;
		text-align: center;
		color: inherit;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: 2px solid var(--focus-color);
		outline-offset: 2px;
		border-radius: 8px;
	}

	/* Ripple animation */
	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	.ripple-effect {
		position: absolute;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		background-color: currentColor;
		opacity: 0.25;
		animation: ripple 0.6s ease-out;
		pointer-events: none;
	}
`) {
	constructor(...e) {
		super(...e), this.icon = "", this.label = "", this.badge = "", this.active$ = new f(!1), this.disabled = !1, this.hideLabels = !1, this.ripples = [], this.addRippleEffect = (e) => {
			if (this.disabled) return;
			let t = this.shadowRoot?.querySelector(".w-16.h-8");
			if (t) {
				let n = t.getBoundingClientRect(), r = {
					x: e.clientX - n.left,
					y: e.clientY - n.top,
					id: Date.now()
				};
				this.ripples = [...this.ripples, r], me(600).pipe(C(() => {
					this.ripples = this.ripples.filter((e) => e.id !== r.id);
				}), S(this.disconnecting)).subscribe();
			}
		}, this.handleClick = (e) => {
			if (this.disabled) return e.preventDefault(), void e.stopPropagation();
			this.addRippleEffect(e);
		}, this.handleKeyDown = (e) => {
			this.disabled || e.key !== "Enter" && e.key !== " " || e.preventDefault();
		};
	}
	get active() {
		return this.active$.value;
	}
	set active(e) {
		this.active$.next(e);
	}
	setActive(e) {
		this.active = e;
	}
	connectedCallback() {
		super.connectedCallback(), this.active$.pipe(S(this.disconnecting)).subscribe(() => {
			this.requestUpdate();
		}), this.setupNavigationStream();
	}
	setupNavigationStream() {
		let e = this.shadowRoot?.querySelector("button");
		e && _(h(e, "click").pipe(x(() => !this.disabled)), h(e, "keydown").pipe(x(() => !this.disabled), x((e) => e.key === "Enter" || e.key === " "), C((e) => e.preventDefault()))).pipe(C(() => {
			this.dispatchEvent(new CustomEvent("bar-item-click", {
				detail: {
					icon: this.icon,
					label: this.label,
					active: this.active
				},
				bubbles: !0,
				composed: !0
			}));
		}), S(this.disconnecting)).subscribe();
	}
	formatBadge(e) {
		let t = Number(e);
		return isNaN(t) ? e.slice(0, 3) : t > 99 ? "99+" : String(t);
	}
	firstUpdated() {
		this.setupNavigationStream();
	}
	render() {
		let e = this.querySelector("[slot]") || this.textContent?.trim() && !this.label, t = this.badge ? this.formatBadge(this.badge) : "", n = t && t !== "0", r = this.querySelector("[slot=\"icon\"]"), i = {
			"relative flex flex-col items-center justify-center": !0,
			"flex-1 min-w-[48px] max-w-[168px]": !0,
			"py-2 px-1 cursor-pointer": !this.disabled,
			"transition-all duration-200": !0,
			"hover:bg-surface-containerHigh": !this.disabled && !this.active,
			"cursor-not-allowed opacity-38": this.disabled,
			"outline-none": !0,
			"focus-visible:outline-2 focus-visible:outline-offset-2": !0
		}, a = {
			"w-16 h-8 rounded-2xl": !0,
			"flex items-center justify-center": !0,
			"transition-all duration-200": !0,
			"bg-secondary-container": this.active,
			"group-hover:bg-surface-containerHighest": !this.active && !this.disabled,
			"relative overflow-hidden": !0
		}, o = {
			"absolute top-0 right-3": !0,
			"min-w-[6px] h-1.5": !n,
			"min-w-[16px] h-4": n,
			"rounded-full": !n,
			"rounded-lg": n,
			"flex items-center justify-center": n,
			"px-1": n,
			"transition-all duration-200": !0,
			"z-10": !0
		}, ee = this.active ? { color: u.sys.color.secondary.onContainer } : { color: u.sys.color.surface.onVariant }, te = { "--focus-color": u.sys.color.primary.default };
		return k`
			<button
				type="button"
				class=${this.classMap(i)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				?disabled=${this.disabled}
				aria-pressed=${this.active}
				aria-label=${this.label || "Navigation item"}
				style=${this.styleMap({
			...te,
			"outline-color": "var(--focus-color)"
		})}
				${c(ee)}
			>
				<!-- Icon with indicator background -->
				<div class=${this.classMap(a)}>
					<!-- Ripple effects -->
					${this.ripples.map((e) => k`
							<span
								class="ripple-effect"
								style=${this.styleMap({
			left: `${e.x}px`,
			top: `${e.y}px`,
			transform: "translate(-50%, -50%)"
		})}
							></span>
						`)}

					${r ? k`<slot name="icon"></slot>` : this.icon ? k`
									<schmancy-icon
										.fill=${+!!this.active}
										class="relative z-10 flex items-center justify-center transition-all duration-200"
										style="--schmancy-icon-size: 24px;"
										aria-hidden="true"
									>
										${this.icon}
									</schmancy-icon>
							  ` : e ? k`<slot></slot>` : ""}
				</div>

				<!-- Label below icon -->
				${!this.hideLabels && this.label ? k`
					<span class=${this.classMap({
			"text-xs font-medium leading-4 mt-1": !0,
			"text-center max-w-full": !0,
			"overflow-hidden text-ellipsis whitespace-nowrap": !0,
			"transition-all duration-200": !0
		})}>${this.label}</span>
				` : ""}

				<!-- Badge -->
				${n ? k`
					<span
						class=${this.classMap(o)}
						aria-label="${t} notifications"
						${c({
			bgColor: u.sys.color.error.default,
			color: u.sys.color.error.on
		})}
					>
						<span class="text-[10px] font-medium leading-none">${t}</span>
					</span>
				` : this.badge ? k`
					<span
						class=${this.classMap(o)}
						aria-label="Has notifications"
						${c({ bgColor: u.sys.color.error.default })}
					></span>
				` : ""}
			</button>
		`;
	}
};
i([T({ type: String })], J.prototype, "icon", void 0), i([T({ type: String })], J.prototype, "label", void 0), i([T({ type: String })], J.prototype, "badge", void 0), i([T({
	type: Boolean,
	reflect: !0
})], J.prototype, "active", null), i([T({
	type: Boolean,
	reflect: !0
})], J.prototype, "disabled", void 0), i([T({
	type: Boolean,
	reflect: !0
})], J.prototype, "hideLabels", void 0), i([D()], J.prototype, "ripples", void 0), J = i([w("schmancy-navigation-bar-item")], J);
var Y = class extends n(O`
	:host {
		display: block;
		transition: transform 0.3s ease-in-out;
	}

	:host([hide-on-scroll]) {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Support 3-7 items with equal distribution */
	::slotted(schmancy-navigation-bar-item) {
		flex: 1;
		max-width: 168px; /* Prevent items from being too wide */
	}

	/* Accessibility focus indicators */
	:host(:focus-within) {
		outline: 2px solid var(--schmancy-sys-color-primary);
		outline-offset: -2px;
	}
`) {
	constructor(...e) {
		super(...e), this.activeIndex$ = new f(-1), this.hideLabels = !1, this.elevation = 2, this.hideOnScroll = !1, this.focusedIndex = -1, this.isHiddenByScroll = !1, this.isFullscreen = !1, this.SCROLL_THRESHOLD = 10, this.mobileMediaQuery = null, this.visibility$ = new p(), this.handleItemClick = (e) => {
			let t = this.getItems(), n = e.target, r = t.indexOf(n);
			if (r === -1) return;
			if (this.activeIndex === r) return void this.dispatchEvent(new CustomEvent(d.NavDrawer_toggle, {
				detail: { state: "toggle" },
				bubbles: !0,
				composed: !0
			}));
			let i = this.activeIndex;
			this.activeIndex = r, this.dispatchEvent(new CustomEvent("navigation-change", {
				detail: {
					oldIndex: i,
					newIndex: r,
					item: n
				},
				bubbles: !0,
				composed: !0
			}));
		}, this.handleKeyDown = (e) => {
			let t = this.getItems(), n = this.focusedIndex === -1 ? this.activeIndex : this.focusedIndex;
			switch (e.key) {
				case "ArrowLeft":
					e.preventDefault(), n > 0 && this.focusItem(n - 1);
					break;
				case "ArrowRight":
					e.preventDefault(), n < t.length - 1 && this.focusItem(n + 1);
					break;
				case "Home":
					e.preventDefault(), this.focusItem(0);
					break;
				case "End":
					e.preventDefault(), this.focusItem(t.length - 1);
					break;
				case "Enter":
				case " ": e.preventDefault(), this.focusedIndex !== -1 && t[this.focusedIndex]?.click();
			}
		};
	}
	get activeIndex() {
		return this.activeIndex$.value;
	}
	set activeIndex(e) {
		this.activeIndex$.next(e);
	}
	getItems() {
		let e = this.shadowRoot?.querySelector("slot");
		return e ? e.assignedElements({ flatten: !0 }).filter((e) => e.tagName.toLowerCase() === "schmancy-navigation-bar-item") : [];
	}
	isMobileViewport() {
		return this.mobileMediaQuery?.matches ?? !1;
	}
	updateBottomOffset() {
		let e = !this.isFullscreen && this.isMobileViewport();
		s.setBottomOffset(e ? 80 : 0);
	}
	connectedCallback() {
		super.connectedCallback(), this.mobileMediaQuery = window.matchMedia("(max-width: 767px)"), h(this.mobileMediaQuery, "change").pipe(C(() => this.updateBottomOffset()), S(this.disconnecting)).subscribe(), s.fullscreen$.pipe(C((e) => {
			this.isFullscreen = e, this.visibility$.next(!this.isFullscreen && !this.isHiddenByScroll), this.updateBottomOffset();
		}), S(this.disconnecting)).subscribe(), this.updateBottomOffset(), h(this, "bar-item-click").pipe(C((e) => this.handleItemClick(e)), S(this.disconnecting)).subscribe(), h(this, "keydown").pipe(C((e) => this.handleKeyDown(e)), S(this.disconnecting)).subscribe(), this.activeIndex$.pipe(S(this.disconnecting)).subscribe((e) => {
			this.updateActiveStates(e);
		}), this.hideOnScroll && this.setupScrollListener(), this.updateItems();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), s.setBottomOffset(0), this.mobileMediaQuery = null;
	}
	setupScrollListener() {
		h(window, "scroll").pipe(be(100), _e(() => window.scrollY), ve(), x(([e, t]) => Math.abs(t - e) > this.SCROLL_THRESHOLD), C(([e, t]) => {
			let n = t > e, r = t < e, i = this.isHiddenByScroll;
			n && !this.isHiddenByScroll ? this.isHiddenByScroll = !0 : r && this.isHiddenByScroll && (this.isHiddenByScroll = !1), t <= this.SCROLL_THRESHOLD && (this.isHiddenByScroll = !1), i !== this.isHiddenByScroll && this.visibility$.next(!this.isHiddenByScroll && !this.isFullscreen);
		}), S(this.disconnecting)).subscribe();
	}
	focusItem(e) {
		let t = this.getItems();
		t[e] && (this.focusedIndex = e, t[e].focus());
	}
	updateItems() {
		let e = this.shadowRoot?.querySelector("slot");
		if (e) {
			let t = () => {
				this.updateActiveStates(this.activeIndex);
			};
			e.addEventListener("slotchange", t), t();
		}
	}
	addBoatItem(e) {
		let t = this.querySelector(`[value="${e.id}"]`);
		if (t) return t;
		let n = document.createElement("schmancy-navigation-bar-item");
		return n.setAttribute("value", e.id), n.innerHTML = `\n\t\t\t<schmancy-icon>${e.icon || "widgets"}</schmancy-icon>\n\t\t\t<span>${e.title}</span>\n\t\t`, this.appendChild(n), n;
	}
	updateActiveStates(e) {
		this.getItems().forEach((t, n) => {
			let r = t;
			r.setActive ? r.setActive(n === e) : r.active = n === e, r.hideLabels = this.hideLabels, t.tabIndex = n === e ? 0 : -1;
		});
	}
	updated(e) {
		super.updated(e), e.has("hideLabels") && this.updateActiveStates(this.activeIndex), e.has("hideOnScroll") && (this.hideOnScroll && !e.get("hideOnScroll") ? this.setupScrollListener() : this.hideOnScroll || (this.isHiddenByScroll = !1, this.visibility$.next(!this.isFullscreen)));
	}
	render() {
		let e = this.isFullscreen || this.isHiddenByScroll, t = {
			"h-20": !0,
			"flex items-center justify-around": !0,
			"px-2 py-3 box-border": !0,
			"transition-all duration-300 ease-in-out": !0,
			"z-10": !0,
			"shadow-none": this.elevation === 0,
			"shadow-sm": this.elevation === 1,
			"shadow-md": this.elevation === 2,
			"shadow-lg": this.elevation === 3,
			"shadow-xl": this.elevation === 4,
			"shadow-2xl": this.elevation === 5
		}, n = e ? "translateY(100%)" : "translateY(0)";
		return k`
			<nav
				class=${this.classMap(t)}
				role="navigation"
				aria-label="Main navigation"
				aria-hidden=${e}
				style="transform: ${n};"
				${c({
			bgColor: u.sys.color.surface.container,
			color: u.sys.color.surface.on
		})}
			>
				<slot></slot>
			</nav>
		`;
	}
};
i([T({ type: Number })], Y.prototype, "activeIndex", null), i([T({
	type: Boolean,
	reflect: !0
})], Y.prototype, "hideLabels", void 0), i([T({
	type: Number,
	reflect: !0
})], Y.prototype, "elevation", void 0), i([T({
	type: Boolean,
	reflect: !0
})], Y.prototype, "hideOnScroll", void 0), i([D()], Y.prototype, "focusedIndex", void 0), i([D()], Y.prototype, "isHiddenByScroll", void 0), i([D()], Y.prototype, "isFullscreen", void 0), Y = i([w("schmancy-navigation-bar")], Y);
var X = "whereAreYouRicky", De = "hereMorty", Z = new class {
	constructor() {
		this.activeTeleportations = /* @__PURE__ */ new Map(), this.flipRequests = new p(), this.find = (e) => he([h(window, De).pipe(se((t) => !!t.detail.component.uuid && !!e.id && t.detail.component.id === e.id && t.detail.component.uuid !== e.uuid), g((e) => e.detail.component), de(1)), v(e).pipe(b(() => {
			window.dispatchEvent(new CustomEvent(X, { detail: {
				id: e.id,
				callerID: e.uuid
			} }));
		}))]).pipe(g(([e]) => e), pe(0)), this.flip = (e) => {
			let { from: t, to: n } = e, r = n.element.style.zIndex;
			n.element.style.transformOrigin = "top left", n.element.style.setProperty("visibility", "visible"), n.element.style.zIndex = "1000";
			let i = [{ transform: `translate(${t.rect.left - n.rect.left}px, ${t.rect.top - n.rect.top}px) scale(${t.rect.width / n.rect.width}, ${t.rect.height / n.rect.height})` }, { transform: "translate(0, 0) scale(1, 1)" }];
			n.element.animate(i, {
				duration: 250,
				delay: 10,
				easing: "cubic-bezier(0.455, 0.03, 0.515, 0.955)"
			}).onfinish = () => {
				n.element.style.zIndex = r, n.element.style.transformOrigin = "";
			};
		}, this.flipRequests.pipe(re(1), g((e) => e.map(({ from: e, to: t, host: n }, r) => ({
			from: e,
			to: t,
			host: n,
			i: r
		}))), ie((e) => he(e.map((e) => v(this.flip(e)))))).subscribe();
	}
}();
function Oe(e) {
	return le(50).pipe(_e(() => e.getBoundingClientRect()), ge((e, t) => e.width === t.width && e.height === t.height && e.top === t.top && e.right === t.right && e.bottom === t.bottom && e.left === t.left), ye(1));
}
var Q = class extends a(O``) {
	constructor(...e) {
		super(...e), this.uuid = Math.floor(Math.random() * Date.now()), this.delay = 0, this.debugging = !1;
	}
	get _slottedChildren() {
		return this.shadowRoot.querySelector("slot").assignedElements({ flatten: !0 });
	}
	connectedCallback() {
		if (this.id === void 0) throw Error("id is required");
		super.connectedCallback(), _(h(window, ee).pipe(b({ next: () => {
			this.dispatchEvent(new CustomEvent(te, {
				detail: { component: this },
				bubbles: !0,
				composed: !0
			}));
		} })), h(window, X).pipe(b({ next: (e) => {
			e.detail.id === this.id && this.uuid && e.detail.callerID !== this.uuid && this.dispatchEvent(new CustomEvent(De, {
				detail: { component: this },
				bubbles: !0,
				composed: !0
			}));
		} }))).pipe(y(this.disconnecting)).subscribe();
	}
	async firstUpdated() {
		v(Z.activeTeleportations.get(this.id)).pipe(se((e) => !!e), y(this.disconnecting), fe()).subscribe({
			next: (e) => {
				this.style.setProperty("visibility", "hidden"), Oe(this).pipe(y(this.disconnecting)).subscribe({ next: (t) => {
					Z.activeTeleportations.set(this.id, t), Z.flipRequests.next({
						from: { rect: e },
						to: {
							rect: t,
							element: this._slottedChildren[0]
						},
						host: this
					});
				} });
			},
			error: () => {
				this.style.setProperty("visibility", "visible"), Oe(this).pipe(y(this.disconnecting)).subscribe({ next: (e) => {
					Z.activeTeleportations.set(this.id, e);
				} });
			},
			complete: () => {}
		});
	}
	render() {
		return k`<slot></slot>`;
	}
};
i([T({
	type: Number,
	reflect: !0
})], Q.prototype, "uuid", void 0), i([T({ type: String })], Q.prototype, "id", void 0), i([T({ type: Number })], Q.prototype, "delay", void 0), Q = i([w("schmancy-teleport")], Q);
var $ = class extends a() {
	constructor(...e) {
		super(...e), this.initials = "", this.src = "", this.icon = "", this.size = "md", this.color = "primary", this.shape = "circle", this.bordered = !1, this.status = "none";
	}
	render() {
		let e;
		e = this.src ? k`<img class="w-full h-full object-cover" src="${this.src}" alt="Avatar" />` : this.initials ? k`<span class="text-center font-medium">${this.initials.substring(0, 2).toUpperCase()}</span>` : this.icon ? k`<schmancy-icon>${this.icon}</schmancy-icon>` : k`<schmancy-icon>person</schmancy-icon>`;
		let t = {
			"relative flex items-center justify-center overflow-hidden": !0,
			[{
				xxs: "w-5 h-5 text-[8px]",
				xs: "w-6 h-6 text-xs",
				sm: "w-8 h-8 text-sm",
				md: "w-10 h-10 text-base",
				lg: "w-12 h-12 text-lg",
				xl: "w-16 h-16 text-xl"
			}[this.size]]: !0,
			[{
				circle: "rounded-full",
				square: "rounded-md"
			}[this.shape]]: !0,
			"border-2 border-surface-container": this.bordered
		}, n = this.getColorAttributes();
		return k`
			<div class="${this.classMap(t)}" ${n}>
				${e} ${this.status === "none" ? "" : this.renderStatusIndicator()}
			</div>
		`;
	}
	getColorAttributes() {
		return c({
			primary: {
				bgColor: u.sys.color.primary.container,
				color: u.sys.color.primary.onContainer
			},
			secondary: {
				bgColor: u.sys.color.secondary.container,
				color: u.sys.color.secondary.onContainer
			},
			tertiary: {
				bgColor: u.sys.color.tertiary.container,
				color: u.sys.color.tertiary.onContainer
			},
			success: {
				bgColor: u.sys.color.success.container,
				color: u.sys.color.success.onContainer
			},
			error: {
				bgColor: u.sys.color.error.container,
				color: u.sys.color.error.onContainer
			},
			neutral: {
				bgColor: u.sys.color.surface.container,
				color: u.sys.color.surface.on
			}
		}[this.color]);
	}
	renderStatusIndicator() {
		let e = {
			online: u.sys.color.success.default,
			offline: u.sys.color.surface.onVariant,
			busy: u.sys.color.error.default,
			away: u.sys.color.tertiary.default
		}, t = {
			"absolute bottom-0 right-0 rounded-full border-2 border-surface-default": !0,
			[{
				xxs: "w-1 h-1",
				xs: "w-1.5 h-1.5",
				sm: "w-2 h-2",
				md: "w-2.5 h-2.5",
				lg: "w-3 h-3",
				xl: "w-4 h-4"
			}[this.size]]: !0
		};
		return k`
			<div class="${this.classMap(t)}" style="background-color: ${e[this.status]};"></div>
		`;
	}
};
i([T({ type: String })], $.prototype, "initials", void 0), i([T({ type: String })], $.prototype, "src", void 0), i([T({ type: String })], $.prototype, "icon", void 0), i([T({ type: String })], $.prototype, "size", void 0), i([T({ type: String })], $.prototype, "color", void 0), i([T({ type: String })], $.prototype, "shape", void 0), i([T({ type: Boolean })], $.prototype, "bordered", void 0), i([T({ type: String })], $.prototype, "status", void 0), $ = i([w("schmancy-avatar")], $);
export { N as C, A as E, M as S, j as T, R as _, Z as a, F as b, q as c, W as d, V as f, z as g, Te as h, X as i, G as l, Ee as m, Q as n, Y as o, B as p, De as r, J as s, $ as t, U as u, L as v, we as w, I as x, P as y };
