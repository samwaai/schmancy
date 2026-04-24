import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { S as n } from "./area-CfozaCAZ.js";
import { i as r, n as i, o as a, s as o } from "./animation-hXFClrIn.js";
import { n as s, t as c } from "./sheet.service-Dy_fwQqQ.js";
import { filter as l, fromEvent as u, merge as d, takeUntil as f, tap as p } from "rxjs";
import { customElement as m, property as h, query as g } from "lit/decorators.js";
import { css as _, html as v } from "lit";
var y, b, x = class extends t(_`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 999);
		display: none;
	}
	:host([open]) {
		display: block;
	}

	/* Luminous edge glow on sheet panel */
	.content {
		box-shadow: -8px 0 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	:host([position='bottom']) .content {
		box-shadow: 0 -8px 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.content { box-shadow: var(--schmancy-sys-elevation-3); }
	}
`) {
	constructor(...e) {
		super(...e), this.open = !1, this.position = c.Side, this.persist = !1, this.lock = !1, this.handleHistory = !0, this.lastFocusedElement = null, this.handleOverlayClick = (e) => {
			e.stopPropagation(), this.lock || s.dismiss(this.uid);
		};
	}
	onOpenChange(e, t) {
		t ? (this.lastFocusedElement = document.activeElement, this.setBackgroundInert(!0), this.animateIn(), this.focus()) : (this.animateOut(), this.setBackgroundInert(!1), this.lastFocusedElement?.focus(), this.lastFocusedElement = null);
	}
	animateIn() {
		if (!this.overlayEl || !this.contentEl) return;
		this.overlayEl.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 200,
			easing: o,
			fill: "forwards"
		});
		let e = this.position === c.Side ? [{
			opacity: 0,
			transform: "translateX(100%) scale(0.95)"
		}, {
			opacity: 1,
			transform: "translateX(0) scale(1)"
		}] : [{
			opacity: 0,
			transform: "translateY(100%) scale(0.95)"
		}, {
			opacity: 1,
			transform: "translateY(0) scale(1)"
		}];
		this.contentEl.animate(e, {
			duration: r,
			easing: i,
			fill: "forwards"
		});
	}
	animateOut() {
		if (!this.overlayEl || !this.contentEl) return;
		this.overlayEl.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 150,
			easing: o,
			fill: "forwards"
		});
		let e = this.position === c.Side ? [{
			opacity: 1,
			transform: "translateX(0) scale(1)"
		}, {
			opacity: 0,
			transform: "translateX(100%) scale(0.98)"
		}] : [{
			opacity: 1,
			transform: "translateY(0) scale(1)"
		}, {
			opacity: 0,
			transform: "translateY(100%) scale(0.98)"
		}];
		this.contentEl.animate(e, {
			duration: 150,
			easing: a,
			fill: "forwards"
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.setupEventListeners();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.disconnecting.next(!0);
	}
	setupEventListeners() {
		d(u(window, "popstate").pipe(l(() => this.handleHistory), p((e) => {
			e.preventDefault(), this.closeSheet();
		})), u(this, "keydown").pipe(p((e) => {
			e.key === "Escape" && !this.lock && this.open && (e.preventDefault(), e.stopPropagation(), s.dismiss(this.uid));
		})), u(window, "schmancy-sheet-render").pipe(l((e) => e.detail.uid === this.uid), p((e) => {
			n.push({
				area: this.uid,
				component: e.detail.component,
				props: e.detail.props,
				historyStrategy: "silent"
			});
		})), u(window, "schmancy-sheet-dismiss").pipe(l((e) => e.detail.uid === this.uid), p(() => {
			this.closeSheet();
		}))).pipe(f(this.disconnecting)).subscribe();
	}
	setBackgroundInert(e) {
		let t = this.parentElement;
		t && Array.from(t.children).forEach((t) => {
			t !== this && t instanceof HTMLElement && t.toggleAttribute("inert", e);
		});
	}
	closeSheet() {
		this.open = !1, this.dispatchEvent(new CustomEvent("close"));
	}
	focus() {
		let e = this.querySelector("[autofocus]");
		e instanceof HTMLElement && e.focus();
	}
	render() {
		let e = "overlay absolute inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 " + (this.lock ? "" : "cursor-pointer"), t = this.position === c.Side ? "content h-full min-w-[320px] max-w-[90vw] w-fit ml-auto z-10" : "content w-full mt-auto rounded-t-2xl max-h-[90vh] z-10", n = this.position === c.Side ? "h-full overflow-auto" : "max-h-[90vh] overflow-auto";
		return v`
			<div class=${"absolute inset-0 flex h-full"} role="dialog" aria-hidden=${!this.open} aria-modal=${this.open} tabindex="0">
				<div class=${e} @click=${this.handleOverlayClick}></div>
				<div class=${t}>
					<schmancy-surface rounded="left" fill="all" id="body" class=${n} type="solid">
						<schmancy-area class="size-full overflow-auto" name=${this.uid}>
							<slot></slot>
						</schmancy-area>
					</schmancy-surface>
				</div>
			</div>
		`;
	}
};
e([h({
	type: Boolean,
	reflect: !0
})], x.prototype, "open", void 0), e([h({
	type: String,
	reflect: !0
})], x.prototype, "position", void 0), e([h({
	type: Boolean,
	reflect: !0
})], x.prototype, "persist", void 0), e([h({
	type: Boolean,
	reflect: !0
})], x.prototype, "lock", void 0), e([h({
	type: Boolean,
	reflect: !0
})], x.prototype, "handleHistory", void 0), e([g(".overlay")], x.prototype, "overlayEl", void 0), e([g(".content")], x.prototype, "contentEl", void 0), e([(y = "open", (e, t) => {
	let { willUpdate: n } = e;
	b = Object.assign({ waitUntilFirstUpdate: !1 }, b), e.willUpdate = function(e) {
		if (n.call(this, e), e.has(y)) {
			let n = e.get(y), r = this[y];
			n !== r && (b?.waitUntilFirstUpdate && !this.hasUpdated || this[t].call(this, n, r));
		}
	};
})], x.prototype, "onOpenChange", null), x = e([m("schmancy-sheet")], x);
