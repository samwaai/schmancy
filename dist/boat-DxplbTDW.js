import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { d as n, f as r } from "./animation-hXFClrIn.js";
import { t as i } from "./reduced-motion-BZTLqAyl.js";
import { n as a } from "./theme.service-cOfPrtfe.js";
import { filter as o, finalize as s, fromEvent as c, map as l, merge as u, switchMap as d, takeUntil as f, tap as p } from "rxjs";
import { classMap as m } from "lit/directives/class-map.js";
import { styleMap as h } from "lit/directives/style-map.js";
import { customElement as g, property as _, state as v } from "lit/decorators.js";
import { css as y, html as b } from "lit";
import { createRef as x, ref as S } from "lit/directives/ref.js";
import { when as C } from "lit/directives/when.js";
var w = 44, T = "schmancy-boat-", E = class extends t(y`
	:host {
		display: contents;
		position: relative;
		z-index: 1000;
	}
	:host([hidden]) {
		display: none !important;
	}
`) {
	constructor(...e) {
		super(...e), this.id = "default", this.lowered = !1, this.corner = "bottom-right", this.open = !1, this.isDragging = !1, this._position = {
			x: 16,
			y: 16
		}, this._currentCorner = "bottom-right", this._containerRef = x(), this._contentRef = x(), this._headerRef = x();
	}
	get state() {
		return this.open ? "expanded" : "collapsed";
	}
	set state(e) {
		e === "expanded" ? this.expand() : this.close();
	}
	get panelWidth() {
		return this.expandedWidth ?? "min(360px, calc(100vw - 32px))";
	}
	get isBottomCorner() {
		return this._currentCorner.startsWith("bottom");
	}
	get closedClipPath() {
		return this.isBottomCorner ? "inset(calc(100% - 44px) 0px 0px 0px round 22px)" : "inset(0px 0px calc(100% - 44px) 0px round 22px)";
	}
	get openClipPath() {
		return "inset(0px 0px 0px 0px round 12px)";
	}
	get elevation() {
		return this.open ? "4" : this.lowered ? "1" : "3";
	}
	_applyContainerPosition() {
		let e = this._containerRef.value;
		if (!e) return;
		e.style.removeProperty("left"), e.style.removeProperty("right"), e.style.removeProperty("top"), e.style.removeProperty("bottom");
		let { x: t, y: n } = this._position;
		this._currentCorner.includes("right") ? e.style.right = `${t}px` : e.style.left = `${t}px`, this._currentCorner.includes("bottom") ? e.style.bottom = `${n + a.bottomOffset}px` : e.style.top = `${n}px`;
	}
	_loadPosition() {
		try {
			let e = localStorage.getItem(T + this.id);
			if (e) {
				let t = JSON.parse(e);
				this._position = {
					x: t.x,
					y: t.y
				}, this._currentCorner = t.anchor;
			}
		} catch {}
	}
	_savePosition() {
		try {
			localStorage.setItem(T + this.id, JSON.stringify({
				...this._position,
				anchor: this._currentCorner
			}));
		} catch {}
	}
	_validateBounds() {
		let e = this._containerRef.value;
		if (!e) return;
		let t = e.getBoundingClientRect();
		if (t.width === 0) return;
		let n = window.innerWidth, r = window.innerHeight, i = this._currentCorner.includes("right"), a = this._currentCorner.includes("bottom"), o = i ? n - this._position.x - t.width : this._position.x, s = a ? r - this._position.y - t.height : this._position.y, c = Math.max(0, Math.min(o, n - t.width)), l = Math.max(0, Math.min(s, r - t.height));
		this._position = {
			x: i ? n - c - t.width : c,
			y: a ? r - l - t.height : l
		}, this._applyContainerPosition();
	}
	_reorientToNearestCorner(e = !1) {
		let t = this._containerRef.value;
		if (!t) return;
		let r = t.getBoundingClientRect(), a = this._currentCorner.includes("bottom"), o = r.left + r.width / 2, s = a ? r.bottom - 22 : r.top + 22, c = o > window.innerWidth / 2 ? "right" : "left", l = `${s > window.innerHeight / 2 ? "bottom" : "top"}-${c}`;
		if (this._currentCorner = l, this._position = {
			x: 16,
			y: 16
		}, this._applyContainerPosition(), this.open || (t.style.clipPath = this.closedClipPath), e || i.value) return void this._savePosition();
		let u = t.getBoundingClientRect(), d = r.left - u.left, f = r.top - u.top;
		t.style.transform = `translate(${d}px, ${f}px)`, this._currentAnimation?.cancel();
		let p = t.animate([{ transform: t.style.transform }, { transform: "translate(0,0)" }], {
			duration: n.duration,
			easing: n.easingFallback,
			fill: "forwards"
		});
		this._currentAnimation = p, p.finished.then(() => {
			t.isConnected && (t.style.transform = "");
		}), this._savePosition();
	}
	_setupDrag() {
		let e = this._headerRef.value, t = this._containerRef.value;
		if (!e || !t) return;
		let n = !1;
		u(c(e, "mousedown").pipe(o((e) => e.button === 0), p((e) => {
			e.preventDefault(), e.stopPropagation();
		}), l((e) => ({
			clientX: e.clientX,
			clientY: e.clientY,
			type: "mouse"
		}))), c(e, "touchstart").pipe(l((e) => ({
			clientX: e.touches[0].clientX,
			clientY: e.touches[0].clientY,
			type: "touch"
		})))).pipe(l(({ clientX: e, clientY: r, type: i }) => {
			let a = t.getBoundingClientRect(), o = this._currentCorner.includes("bottom"), s = this.open;
			return n = !1, {
				startX: e,
				startY: r,
				offsetX: e - a.left,
				offsetY: r - a.top,
				rect: a,
				isBottom: o,
				wasOpen: s,
				type: i
			};
		}), d(({ startX: e, startY: r, offsetX: i, offsetY: a, rect: o, isBottom: u, wasOpen: d, type: m }) => {
			let h = m === "mouse" ? c(window, "mousemove").pipe(l((e) => ({
				clientX: e.clientX,
				clientY: e.clientY
			}))) : c(window, "touchmove").pipe(l((e) => ({
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY
			}))), g = c(window, m === "mouse" ? "mouseup" : "touchend");
			return h.pipe(p(({ clientX: s, clientY: c }) => {
				let l = s - e, f = c - r;
				if (Math.sqrt(l * l + f * f) > 5 && !n && (n = !0, this.isDragging = !0, d)) {
					this._currentAnimation?.cancel(), this.open = !1, t.style.clipPath = this.closedClipPath, t.style.overflow = "hidden";
					let e = this._contentRef.value;
					e && (e.inert = !0, e.style.visibility = "hidden");
				}
				if (!n) return;
				let p = window.innerWidth, m = window.innerHeight, h = Math.max(0, Math.min(s - i, p - o.width)), g = u ? w - o.height : 0, _ = u ? m - o.height : m - w, v = Math.max(g, Math.min(c - a, _));
				this._position = {
					x: this._currentCorner.includes("right") ? p - h - o.width : h,
					y: u ? m - v - o.height : v
				}, this._applyContainerPosition();
			}), f(g), s(() => {
				n ? (this._reorientToNearestCorner(), this.isDragging = !1, n = !1) : (this.isDragging = !1, n = !1, this.toggle());
			}));
		}), f(this.disconnecting)).subscribe();
	}
	connectedCallback() {
		super.connectedCallback(), c(window, "resize").pipe(f(this.disconnecting)).subscribe(() => this._validateBounds()), a.bottomOffset$.pipe(p(() => this._applyContainerPosition()), f(this.disconnecting)).subscribe();
	}
	firstUpdated() {
		this._currentCorner = this.corner, this._loadPosition();
		let e = this._containerRef.value, t = this._contentRef.value;
		e && (this._applyContainerPosition(), this.open ? (e.style.overflow = "", t && (t.inert = !1, t.style.visibility = "visible")) : (e.style.clipPath = this.closedClipPath, e.style.overflow = "hidden", t && (t.inert = !0, t.style.visibility = "hidden")), this._setupDrag());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._currentAnimation?.cancel();
	}
	async _animateOpen() {
		let e = this._containerRef.value, t = this._contentRef.value;
		if (!e) return;
		if (t && (t.style.visibility = "visible", t.inert = !1), this.open = !0, await this.updateComplete, i.value) return e.style.clipPath = "", e.style.overflow = "", void this.dispatchScopedEvent("toggle", "expanded");
		this._currentAnimation?.cancel(), e.style.overflow = "hidden";
		let r = [{
			clipPath: this.closedClipPath,
			opacity: .95
		}, {
			clipPath: this.openClipPath,
			opacity: 1
		}], a = e.animate(r, {
			duration: n.duration,
			easing: n.easingFallback,
			fill: "forwards"
		});
		this._currentAnimation = a, a.finished.then(() => {
			e.isConnected && (e.style.clipPath = "", e.style.overflow = "");
		}), this.dispatchScopedEvent("toggle", "expanded");
	}
	async _animateClose() {
		let e = this._containerRef.value;
		if (!e) return;
		if (i.value) {
			e.style.clipPath = this.closedClipPath, e.style.overflow = "hidden", this.open = !1;
			let t = this._contentRef.value;
			t && (t.inert = !0, t.style.visibility = "hidden"), this.dispatchScopedEvent("toggle", "collapsed");
			return;
		}
		this._currentAnimation?.cancel(), e.style.overflow = "hidden";
		let t = [{
			clipPath: this.openClipPath,
			opacity: 1
		}, {
			clipPath: this.closedClipPath,
			opacity: .95
		}], n = e.animate(t, {
			duration: Math.round(.9 * r.duration),
			easing: "cubic-bezier(0.4, 0, 0.8, 0.15)",
			fill: "forwards"
		});
		this._currentAnimation = n, await n.finished, this.open = !1;
		let a = this._contentRef.value;
		a && (a.inert = !0, a.style.visibility = "hidden"), this.dispatchScopedEvent("toggle", "collapsed");
	}
	toggle() {
		this.open ? this._animateClose() : this._animateOpen();
	}
	expand() {
		this.open || (this.removeAttribute("hidden"), this._containerRef.value ? this._animateOpen() : this.open = !0);
	}
	show() {
		this.expand();
	}
	close() {
		this.open && (this._containerRef.value ? this._animateClose() : this.open = !1);
	}
	render() {
		let e = this._currentCorner.startsWith("bottom"), t = m({
			flex: !0,
			"flex-col": e,
			"flex-col-reverse": !e,
			"will-change-[clip-path]": !0,
			"z-1000": !0,
			"ring-1": !0,
			"ring-primary-default/15": this.open,
			"rounded-2xl": this.open,
			"ring-outline-variant/40": !this.open,
			"rounded-[22px]": !this.open,
			"overflow-hidden": !0,
			"opacity-95": this.isDragging
		}), n = h({
			position: "fixed",
			width: this.panelWidth,
			"max-height": "calc(100vh - 32px)",
			"pointer-events": "none"
		}), r = h({ "pointer-events": this.open ? "auto" : "none" }), i = m({
			"h-full": !0,
			"px-3": !0,
			flex: !0,
			"items-center": !0,
			"gap-2": !0,
			"select-none": !0,
			"cursor-grabbing": this.isDragging,
			"cursor-move": !this.isDragging,
			"transition-opacity": !0,
			"duration-200": !0
		});
		return b`
			<!-- schmancy-surface owns background color and elevation-based shadow.
			     Position is managed imperatively via _applyContainerPosition(). -->
			<schmancy-surface
				${S(this._containerRef)}
				type="glass"
				elevation="${this.elevation}"
				class=${t}
				style=${n}
				aria-expanded=${this.open}
			>
				<!-- Content section (visually above header for bottom corners) -->
				<section
					${S(this._contentRef)}
					class="flex-1 min-h-0 overflow-hidden flex flex-col"
					style=${r}
					role="dialog"
					aria-label="${this.label ?? "Floating panel"}"
				>
					<schmancy-surface type="solid" class="flex flex-col flex-1 min-h-0 overflow-hidden">
						<schmancy-scroll hide class="flex-1">
							<slot></slot>
						</schmancy-scroll>
					</schmancy-surface>
				</section>

				<!-- Gradient separator between header and content — only when open -->
				${C(this.open, () => b`<div
							class="h-px shrink-0 bg-linear-to-r from-transparent via-primary-default/30 to-transparent"
						></div>`)}

				<!-- Header / FAB section — always interactive, always visible -->
				<section
					class="shrink-0 bg-surface-containerLowest"
					style=${h({
			"pointer-events": "auto",
			height: "44px"
		})}
				>
					<div
						${S(this._headerRef)}
						class=${i}
						title="Drag to move"
						aria-label="Drag to reposition panel"
					>
						<!-- Summary slot rendered once — avoids DOM teardown on toggle -->
						<div class="flex-1 min-w-0">
							<slot name="summary"></slot>
						</div>

						<!-- Toggle button: collapse when open, expand when closed -->
						${C(this.open, () => b`
								<schmancy-icon-button
									size="sm"
									variant="text"
									@click=${(e) => {
			e.stopPropagation(), this.close();
		}}
									title="Collapse"
								>
									close_fullscreen
								</schmancy-icon-button>
							`, () => b`
								<schmancy-icon-button
									size="sm"
									variant="text"
									@click=${(e) => {
			e.stopPropagation(), this.expand();
		}}
									title="Expand"
								>
									fullscreen
								</schmancy-icon-button>
							`)}
					</div>
				</section>
			</schmancy-surface>
		`;
	}
};
e([_({ type: String })], E.prototype, "id", void 0), e([_({ type: String })], E.prototype, "icon", void 0), e([_({ type: String })], E.prototype, "label", void 0), e([_({ type: String })], E.prototype, "expandedWidth", void 0), e([_({
	type: Boolean,
	reflect: !0
})], E.prototype, "lowered", void 0), e([_({ type: String })], E.prototype, "corner", void 0), e([_({
	type: Boolean,
	reflect: !0
})], E.prototype, "open", void 0), e([v()], E.prototype, "isDragging", void 0), e([v()], E.prototype, "_currentCorner", void 0);
var D = E = e([g("schmancy-boat")], E);
export { D as t };
