import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { d as n, f as r } from "./animation-hXFClrIn.js";
import { t as i } from "./reduced-motion-BZTLqAyl.js";
import { t as a } from "./cursor-glow-BydlDInj.js";
import { n as o } from "./theme.service-cOfPrtfe.js";
import { t as s } from "./overlay-stack-DXPYHPhk.js";
import { BehaviorSubject as c, EMPTY as l, Observable as u, animationFrameScheduler as d, auditTime as f, catchError as p, distinctUntilChanged as m, filter as h, finalize as g, from as _, fromEvent as v, map as y, merge as b, switchMap as x, take as S, takeUntil as C, tap as w } from "rxjs";
import { classMap as T } from "lit/directives/class-map.js";
import { styleMap as E } from "lit/directives/style-map.js";
import { customElement as D, property as O, state as k } from "lit/decorators.js";
import { css as A, html as j, nothing as M } from "lit";
import { createRef as N, ref as P } from "lit/directives/ref.js";
var F = "schmancy-window-", I = "schmancy-float-";
function L(e, t) {
	return !(e.left >= t.left + t.width || e.left + e.width <= t.left || e.top >= t.top + t.height || e.top + e.height <= t.top);
}
var R, z = class e {
	constructor() {
		this._state$ = new c({
			windows: /* @__PURE__ */ new Map(),
			focusedId: null,
			stackOrder: []
		}), this.state$ = this._state$.asObservable();
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
	get windows() {
		return this._state$.value.windows;
	}
	get focusedId() {
		return this._state$.value.focusedId;
	}
	register(e, t, n) {
		let r = this._state$.value;
		if (r.windows.has(e)) return;
		let i = {
			id: e,
			bounds: t,
			visualState: "normal",
			zIndex: s.assignZIndex(e),
			open: !1,
			snapTarget: n
		}, a = new Map(r.windows);
		a.set(e, i);
		let o = s.getStackOrder();
		this._state$.next({
			...r,
			windows: a,
			stackOrder: o
		});
	}
	unregister(e) {
		let t = this._state$.value;
		if (!t.windows.has(e)) return;
		s.releaseId(e);
		let n = new Map(t.windows);
		n.delete(e);
		let r = s.getStackOrder(), i = t.focusedId === e ? null : t.focusedId;
		this._state$.next({
			...t,
			windows: n,
			stackOrder: r,
			focusedId: i
		});
	}
	updateBounds(e, t) {
		this._updateRecord(e, { bounds: t });
	}
	updateVisualState(e, t) {
		this._updateRecord(e, { visualState: t });
	}
	updateOpen(e, t) {
		this._updateRecord(e, { open: t });
	}
	focus(e) {
		let t = this._state$.value;
		if (!t.windows.has(e) || t.focusedId === e) return;
		let n = s.bringToFront(e), r = new Map(t.windows), i = r.get(e);
		i && r.set(e, {
			...i,
			zIndex: n
		});
		let a = s.getStackOrder();
		this._state$.next({
			...t,
			windows: r,
			stackOrder: a,
			focusedId: e
		});
	}
	findOverlaps(e, t) {
		let n = [];
		for (let [r, i] of this._state$.value.windows) r !== t && L(e, i.bounds) && n.push(i);
		return n;
	}
	getNeighbors(e) {
		let t = [];
		for (let [n, r] of this._state$.value.windows) n !== e && t.push(r);
		return t;
	}
	selectWindow(e) {
		return this._state$.pipe(y((t) => t.windows.get(e)), m());
	}
	selectFocused() {
		return this._state$.pipe(y((e) => e.focusedId), m());
	}
	loadPosition(e) {
		try {
			let t = localStorage.getItem(F + e) ?? localStorage.getItem(I + e);
			return t ? JSON.parse(t) : null;
		} catch {
			return null;
		}
	}
	savePosition(e, t) {
		try {
			localStorage.setItem(F + e, JSON.stringify(t));
		} catch {}
	}
	clearPosition(e) {
		try {
			localStorage.removeItem(F + e), localStorage.removeItem(I + e);
		} catch {}
	}
	_updateRecord(e, t) {
		let n = this._state$.value, r = n.windows.get(e);
		if (!r) return;
		let i = new Map(n.windows);
		i.set(e, {
			...r,
			...t
		}), this._state$.next({
			...n,
			windows: i
		});
	}
}.getInstance();
function B(e, t, n) {
	let r = { ...e };
	for (let e = 0; e < 10 && t.some((e) => {
		return t = r, n = e.bounds, !(t.left >= n.left + n.width || t.left + t.width <= n.left || t.top >= n.top + n.height || t.top + t.height <= n.top);
		var t, n;
	}); e++) r = {
		...r,
		left: r.left + 44,
		top: r.top + 44
	};
	return function(e, t) {
		return {
			width: e.width,
			height: e.height,
			left: Math.max(0, Math.min(e.left, t.width - e.width)),
			top: Math.max(0, Math.min(e.top, t.height - e.height))
		};
	}(r, n);
}
var V = 48, H = class extends t(A`
	:host {
		display: contents;
		position: relative;
		z-index: 1000;
	}
	:host([hidden]) {
		display: none !important;
	}
`) {
	static {
		R = this;
	}
	constructor(...e) {
		super(...e), this.id = "default", this.lowered = !1, this.corner = "bottom-right", this.resizable = !1, this.freePosition = !1, this.visualState = "normal", this.minWidth = 280, this.minHeight = 200, this.open = !1, this._hasOpened = !1, this._focused = !1, this._position = {
			x: 16,
			y: 16
		}, this._currentCorner = "bottom-right", this._appliedCorner = "", this._containerRef = N(), this._bodyRef = N(), this._headRef = N(), this._handleFocus = () => z.focus(this.id), this._handleHeadKeydown = (e) => {
			if (e.key === "Enter" || e.key === " ") return e.preventDefault(), void this.toggle();
			if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				let t = e.shiftKey ? 20 : 5, n = e.key === "ArrowRight" ? t : e.key === "ArrowLeft" ? -t : 0, r = e.key === "ArrowDown" ? t : e.key === "ArrowUp" ? -t : 0;
				this._position = {
					x: this._position.x + n,
					y: this._position.y + r
				}, this._applyContainerPosition(), this._savePosition();
			}
		};
	}
	get panelWidth() {
		return this.expandedWidth ?? "min(360px, calc(100vw - 32px))";
	}
	get isBottomCorner() {
		return this._currentCorner.startsWith("bottom");
	}
	get closedClipPath() {
		return this.isBottomCorner ? "inset(calc(100% - 48px) 0px 0px 0px round 22px)" : "inset(0px 0px calc(100% - 48px) 0px round 22px)";
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
		this._appliedCorner !== this._currentCorner && (e.style.removeProperty("left"), e.style.removeProperty("right"), e.style.removeProperty("top"), e.style.removeProperty("bottom"), this._appliedCorner = this._currentCorner);
		let { x: t, y: n } = this._position;
		this._currentCorner.includes("right") ? e.style.right = `${t}px` : e.style.left = `${t}px`, this._currentCorner.includes("bottom") ? e.style.bottom = `${n + o.bottomOffset}px` : e.style.top = `${n}px`;
	}
	static {
		this.VALID_CORNERS = new Set([
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right"
		]);
	}
	_loadPosition() {
		let e = z.loadPosition(this.id);
		e && (this._position = {
			x: e.x,
			y: e.y
		}, R.VALID_CORNERS.has(e.anchor) && (this._currentCorner = e.anchor));
	}
	_savePosition() {
		z.savePosition(this.id, {
			...this._position,
			anchor: this._currentCorner
		});
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
		if (this.freePosition) {
			this._savePosition();
			let e = this._containerRef.value?.getBoundingClientRect();
			e && z.updateBounds(this.id, {
				left: e.left,
				top: e.top,
				width: e.width,
				height: e.height
			});
			return;
		}
		let t = this._containerRef.value;
		if (!t) return;
		let r = t.getBoundingClientRect(), a = this._currentCorner.includes("bottom"), o = r.left + r.width / 2, s = a ? r.bottom - 24 : r.top + 24, c = o > window.innerWidth / 2 ? "right" : "left", u = `${s > window.innerHeight / 2 ? "bottom" : "top"}-${c}`;
		if (this._currentCorner = u, this._position = {
			x: 16,
			y: 16
		}, this._applyContainerPosition(), this.open || (t.style.clipPath = this.closedClipPath), e || i.value) {
			this._savePosition();
			let e = t.getBoundingClientRect();
			z.updateBounds(this.id, {
				left: e.left,
				top: e.top,
				width: e.width,
				height: e.height
			});
			return;
		}
		let d = t.getBoundingClientRect(), f = r.left - d.left, m = r.top - d.top;
		t.style.translate = `${f}px ${m}px`;
		let h = [{ translate: `${f}px ${m}px` }, { translate: "0px 0px" }];
		_(t.animate(h, {
			duration: n.duration,
			easing: n.easingFallback,
			fill: "forwards"
		}).finished).pipe(S(1), w(() => {
			t.isConnected && (t.style.translate = "");
			let e = t.getBoundingClientRect();
			z.updateBounds(this.id, {
				left: e.left,
				top: e.top,
				width: e.width,
				height: e.height
			});
		}), p(() => l), C(this.disconnecting)).subscribe(), this._savePosition();
	}
	_drag$() {
		return new u(() => {
			let e = this._headRef.value, t = this._containerRef.value;
			if (!e || !t) return;
			let n = !1, r = v(e, "pointerdown").pipe(h((e) => e.button === 0), h((e) => {
				let t = e.target.tagName?.toLowerCase();
				return ![
					"input",
					"textarea",
					"select",
					"button"
				].includes(t) && !e.target.closest("schmancy-input, schmancy-icon-button, button, a");
			}), w((e) => {
				e.preventDefault(), e.stopPropagation();
			})).pipe(y((e) => {
				let r = t.getBoundingClientRect(), i = this._currentCorner.includes("bottom"), a = this.open;
				return n = !1, {
					startX: e.clientX,
					startY: e.clientY,
					offsetX: e.clientX - r.left,
					offsetY: e.clientY - r.top,
					rect: r,
					vw: window.innerWidth,
					vh: window.innerHeight,
					isBottom: i,
					wasOpen: a,
					pointerId: e.pointerId
				};
			}), x(({ startX: e, startY: r, offsetX: i, offsetY: a, rect: o, vw: s, vh: c, isBottom: l, wasOpen: u, pointerId: p }) => {
				let m = v(window, "pointermove").pipe(h((e) => e.pointerId === p), f(0, d), y((e) => ({
					clientX: e.clientX,
					clientY: e.clientY
				}))), _ = v(window, "pointerup").pipe(h((e) => e.pointerId === p));
				return m.pipe(w(({ clientX: d, clientY: f }) => {
					let p = d - e, m = f - r;
					if (Math.sqrt(p * p + m * m) > 5 && !n && (n = !0, this._applyDragVisuals(!0), u)) {
						this.open = !1, t.style.clipPath = this.closedClipPath, t.style.overflow = "hidden";
						let e = this._bodyRef.value;
						e && (e.inert = !0, e.style.visibility = "hidden");
					}
					if (!n) return;
					let h = Math.max(0, Math.min(d - i, s - o.width)), g = l ? V - o.height : 0, _ = l ? c - o.height : c - V, v = Math.max(g, Math.min(f - a, _));
					this._position = {
						x: this._currentCorner.includes("right") ? s - h - o.width : h,
						y: l ? c - v - o.height : v
					}, this._applyContainerPosition();
				}), C(_), g(() => {
					n ? (this._reorientToNearestCorner(), this._applyDragVisuals(!1), n = !1) : (n = !1, this.toggle());
				}));
			})).subscribe();
			return () => r.unsubscribe();
		});
	}
	connectedCallback() {
		super.connectedCallback(), _(this.updateComplete).pipe(S(1), w(() => {
			this._currentCorner = this.corner, this._loadPosition(), this._applyContainerPosition(), this._initDOMState();
			let e = this._containerRef.value;
			if (e) {
				let t = e.getBoundingClientRect(), n = {
					left: t.left,
					top: t.top,
					width: t.width,
					height: t.height
				};
				z.register(this.id, n, this.freePosition ? "free" : this._currentCorner);
			}
		}), x(() => b(this._drag$(), z.selectWindow(this.id).pipe(w((e) => {
			if (!e) return;
			let t = this._containerRef.value;
			t && (t.style.zIndex = String(e.zIndex));
		})), z.selectFocused().pipe(w((e) => {
			this._focused = e === this.id;
		})))), C(this.disconnecting)).subscribe(), b(v(window, "resize").pipe(f(0, d), w(() => this._validateBounds())), o.bottomOffset$.pipe(w(() => this._applyContainerPosition()))).pipe(C(this.disconnecting)).subscribe();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), z.unregister(this.id);
	}
	_initDOMState() {
		let e = this._containerRef.value, t = this._bodyRef.value;
		e && (this._applyContainerPosition(), this.open ? (this._hasOpened = !0, e.style.overflow = "", t && (t.inert = !1, t.style.visibility = "visible")) : (e.style.clipPath = this.closedClipPath, e.style.overflow = "hidden", t && (t.inert = !0, t.style.visibility = "hidden")));
	}
	_animateOpen() {
		let e = this._containerRef.value, t = this._bodyRef.value;
		if (!e) return;
		this._hasOpened = !0, this.open = !0;
		let n = e.getBoundingClientRect(), a = {
			left: n.left,
			top: this.isBottomCorner ? n.top - 400 : n.top,
			width: n.width,
			height: 448
		}, o = z.findOverlaps(a, this.id);
		if (o.length > 0) {
			let e = B(a, o, {
				width: window.innerWidth,
				height: window.innerHeight
			});
			if (Math.abs(e.left - a.left) > 10 || Math.abs(e.top - a.top) > 10) {
				let t = this._currentCorner.includes("right"), n = this._currentCorner.includes("bottom");
				this._position = {
					x: t ? window.innerWidth - e.left - e.width : e.left,
					y: n ? window.innerHeight - e.top - e.height : e.top
				}, this._applyContainerPosition();
			}
		}
		if (t && (t.style.visibility = "visible", t.inert = !1), i.value) return e.style.clipPath = "", e.style.overflow = "", void this.dispatchScopedEvent("window-toggle", { state: "expanded" });
		this._currentAnimation?.cancel(), e.style.overflow = "hidden", e.style.willChange = "opacity";
		let s = [{
			clipPath: this.closedClipPath,
			opacity: .95
		}, {
			clipPath: this.openClipPath,
			opacity: 1
		}], c = e.animate(s, {
			duration: r.duration,
			easing: r.easingFallback,
			fill: "forwards"
		});
		this._currentAnimation = c, _(c.finished).pipe(S(1), w(() => {
			e.isConnected && (e.style.clipPath = "", e.style.overflow = "", e.style.willChange = "");
		}), p(() => l), C(this.disconnecting)).subscribe(), this.dispatchScopedEvent("window-toggle", { state: "expanded" });
	}
	_animateClose() {
		let e = this._containerRef.value;
		if (!e) return;
		if (i.value) {
			e.style.clipPath = this.closedClipPath, e.style.overflow = "hidden", this.open = !1;
			let t = this._bodyRef.value;
			t && (t.inert = !0, t.style.visibility = "hidden"), this.dispatchScopedEvent("window-toggle", { state: "collapsed" });
			return;
		}
		this._currentAnimation?.cancel(), e.style.overflow = "hidden", e.style.willChange = "opacity";
		let t = [{
			clipPath: this.openClipPath,
			opacity: 1
		}, {
			clipPath: this.closedClipPath,
			opacity: .95
		}], n = e.animate(t, {
			duration: Math.round(.7 * r.duration),
			easing: "cubic-bezier(0.4, 0, 0.8, 0.15)",
			fill: "forwards"
		});
		this._currentAnimation = n, _(n.finished).pipe(S(1), w(() => {
			this.open = !1, e.style.willChange = "";
			let t = this._bodyRef.value;
			t && (t.inert = !0, t.style.visibility = "hidden");
		}), p(() => l), C(this.disconnecting)).subscribe(), this.dispatchScopedEvent("window-toggle", { state: "collapsed" });
	}
	_applyDragVisuals(e) {
		let t = this._headRef.value, n = this._containerRef.value;
		t && (t.classList.toggle("cursor-grabbing", e), t.classList.toggle("cursor-move", !e)), n && (n.style.opacity = e ? "0.95" : "");
	}
	toggle() {
		this.open ? this._animateClose() : this._animateOpen();
	}
	expand() {
		this.open || this._animateOpen();
	}
	close() {
		this.open && this._animateClose();
	}
	render() {
		let e = this._currentCorner.startsWith("bottom"), t = T({
			fixed: !0,
			flex: !0,
			"flex-col": e,
			"flex-col-reverse": !e,
			"z-1000": !0,
			"ring-1": !this._focused,
			"ring-2": this._focused,
			"ring-primary-default/30": this._focused,
			"ring-primary-default/15": this.open && !this._focused,
			"rounded-2xl": this.open,
			"ring-outline-variant/40": !this.open && !this._focused,
			"rounded-[22px]": !this.open,
			"overflow-hidden": !0
		}), n = E({
			width: this.panelWidth,
			"max-height": "calc(100vh - 32px)",
			"pointer-events": "none"
		}), r = E({ "pointer-events": this.open ? "auto" : "none" }), i = T({
			"h-full": !0,
			"px-3": !0,
			flex: !0,
			"items-center": !0,
			"gap-2": !0,
			"select-none": !0,
			"cursor-move": !0
		});
		return j`
			<schmancy-surface
				${P(this._containerRef)}
				type="glass"
				elevation="${this.elevation}"
				class=${t}
				style=${n}
				aria-expanded=${this.open}
				@pointerdown=${this._handleFocus}
			>
				<!-- Details section (visually above summary for bottom corners) -->
				<section
					${P(this._bodyRef)}
					class="flex-1 min-h-0 overflow-hidden flex flex-col"
					style=${r}
					role="region"
					aria-label="Expandable content"
				>
					${this._hasOpened ? j`<slot name="details"></slot>` : M}
				</section>

				<!-- Summary section -- always interactive, always visible -->
				<section
					class="shrink-0 bg-surface-lowest"
					style=${E({
			"pointer-events": "auto",
			height: "48px"
		})}
				>
					<div
						${P(this._headRef)}
						${a({
			radius: 200,
			intensity: .1
		})}
						class=${i}
						role="button"
						tabindex="0"
						title="Drag to move, click to expand"
						aria-label="${this.open ? "Collapse window" : "Expand window"}"
						@keydown=${this._handleHeadKeydown}
					>
						<div class="flex-1 min-w-0">
							<slot></slot>
						</div>
						<svg
							width="16" height="16" viewBox="0 0 24 24" fill="none"
							class="shrink-0 text-surface-on/40 transition-transform duration-200 ${this.open ? "rotate-180" : ""}"
							aria-hidden="true"
						>
							<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</section>
			</schmancy-surface>
		`;
	}
};
e([O({ type: String })], H.prototype, "id", void 0), e([O({ type: String })], H.prototype, "expandedWidth", void 0), e([O({ type: String })], H.prototype, "expandedHeight", void 0), e([O({
	type: Boolean,
	reflect: !0
})], H.prototype, "lowered", void 0), e([O({ type: String })], H.prototype, "corner", void 0), e([O({ type: Boolean })], H.prototype, "resizable", void 0), e([O({ type: Boolean })], H.prototype, "freePosition", void 0), e([O({
	type: String,
	reflect: !0
})], H.prototype, "visualState", void 0), e([O({ type: Number })], H.prototype, "minWidth", void 0), e([O({ type: Number })], H.prototype, "minHeight", void 0), e([O({
	type: Boolean,
	reflect: !0
})], H.prototype, "open", void 0), e([k()], H.prototype, "_hasOpened", void 0), e([k()], H.prototype, "_focused", void 0), e([k()], H.prototype, "_currentCorner", void 0);
var U = H = R = e([D("schmancy-window")], H);
export { z as n, U as t };
