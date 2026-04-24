import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { debounceTime as n, filter as r, fromEvent as i, takeUntil as a } from "rxjs";
import { customElement as o, property as s } from "lit/decorators.js";
import { css as c, html as l } from "lit";
var u = class extends e(c`
	:host {
		/* Flexible sizing for different layout contexts */
		width: 100%;
		min-height: 0; /* Allow flex shrinking */
		flex: 1; /* Grow in flex containers */
		box-sizing: border-box; /* Ensures proper sizing */
		display: block;
		position: relative;
		scroll-behavior: smooth;
		overscroll-behavior-x: contain;
		overscroll-behavior-y: auto;
	}
	/* Fallback for non-flex contexts */
	:host(.explicit-height) {
		height: 100%;
		flex: none;
	}
	:host([hide]) {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	:host([hide])::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
`) {
	constructor(...e) {
		super(...e), this.hide = !1, this.direction = "both", this.debounce = 10;
	}
	get scroller() {
		return this;
	}
	scrollTo(e, t) {
		typeof e == "number" ? super.scrollTo({
			top: e,
			behavior: t ? "smooth" : "auto"
		}) : e ? super.scrollTo(e) : super.scrollTo({
			top: 0,
			left: 0,
			behavior: "auto"
		});
	}
	scrollToLeft(e, t = "auto") {
		super.scrollTo({
			left: e,
			behavior: t
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.updateScrollingStyles(), this.updateLayoutContext(), this.setAttribute("part", "scroller");
	}
	updateScrollingStyles() {
		this.direction === "horizontal" ? (this.style.setProperty("overflow-y", "hidden"), this.style.setProperty("overflow-x", "auto")) : this.direction === "vertical" ? (this.style.setProperty("overflow-y", "auto"), this.style.setProperty("overflow-x", "hidden")) : (this.style.setProperty("overflow-y", "auto"), this.style.setProperty("overflow-x", "auto"));
	}
	updateLayoutContext() {
		requestAnimationFrame(() => {
			let e = this.parentElement;
			if (e) {
				let t = getComputedStyle(e);
				t.display === "flex" || t.display === "inline-flex" ? this.classList.remove("explicit-height") : this.classList.add("explicit-height");
			} else this.classList.add("explicit-height");
		});
	}
	updated(e) {
		super.updated(e), e.has("direction") && this.updateScrollingStyles(), this.updateLayoutContext();
	}
	firstUpdated() {
		i(this.scroller, "scroll", { passive: !0 }).pipe(n(this.debounce), a(this.disconnecting)).subscribe((e) => {
			let t = this.scroller.scrollTop, n = this.scroller.scrollHeight, r = this.scroller.clientHeight, i = this.scroller.scrollLeft, a = this.scroller.scrollWidth, o = this.scroller.clientWidth;
			this.dispatchEvent(new CustomEvent("scroll", {
				detail: {
					scrollTop: t,
					scrollHeight: n,
					clientHeight: r,
					e,
					scrollLeft: i,
					scrollWidth: a,
					clientWidth: o
				},
				bubbles: !0,
				composed: !0
			}));
		}), i(window, "@schmancy:scrollTo").pipe(r((e) => this.name !== void 0 && e.detail.name === this.name), a(this.disconnecting)).subscribe((e) => {
			if (e.detail.action === "scrollTo" && typeof e.detail.top == "number") {
				let t = {
					behavior: "smooth",
					top: e.detail.top
				};
				typeof e.detail.left == "number" && (t.left = e.detail.left), this.scrollTo(t);
			}
		});
	}
	render() {
		return l`<slot></slot>`;
	}
};
t([s({
	type: Boolean,
	reflect: !0
})], u.prototype, "hide", void 0), t([s({
	type: String,
	reflect: !0
})], u.prototype, "name", void 0), t([s({
	type: String,
	reflect: !0
})], u.prototype, "direction", void 0), t([s({ type: Number })], u.prototype, "debounce", void 0), u = t([o("schmancy-scroll")], u);
export { u as t };
