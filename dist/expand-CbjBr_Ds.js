import { t as e } from "./tailwind.mixin-mdQR3BEO.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./surface.mixin-DqMwoddO.js";
import "./mixins.js";
import { d as r, f as i } from "./animation-hXFClrIn.js";
import { t as a } from "./reduced-motion-BZTLqAyl.js";
import "./surface-D23JtxYP.js";
import { filter as o, fromEvent as s, lastValueFrom as c } from "rxjs";
import { takeUntil as l, tap as u } from "rxjs/operators";
import { styleMap as d } from "lit/directives/style-map.js";
import { customElement as f, property as p, state as m } from "lit/decorators.js";
import { css as h, html as g, nothing as _ } from "lit";
import { createRef as v, ref as y } from "lit/directives/ref.js";
var b = class extends n(e(h`
	:host {
		display: contents;
	}

	.portal-panel {
		position: fixed;
		transform-origin: top left;
		will-change: clip-path, opacity;
		border-radius: 1rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
		z-index: 9999;
	}

	.minimize-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 150ms, background 150ms;
		color: inherit;
	}

	.minimize-btn:hover {
		opacity: 1;
		background: rgb(0 0 0 / 0.08);
	}
`)) {
	constructor(...e) {
		super(...e), this.type = "solid", this.isOpen = !1, this.summaryRect = null, this._panelRef = v(), this._backdropRef = v(), this._btnRef = v(), this._owner = null, this._hideIndicator = !1, this._backdrop = !0;
	}
	prepare(e, t, n = !1, r = !0) {
		this.summaryRect = e, this._owner = t, this._hideIndicator = n, this._backdrop = r;
	}
	async triggerOpen() {
		this.isOpen = !0, await this.updateComplete;
		let e = this._panelRef.value;
		if (!e) return;
		let t = this.summaryRect;
		Object.assign(e.style, {
			visibility: "hidden",
			top: `${t.top}px`,
			left: `${t.left}px`,
			minWidth: `${t.width}px`,
			width: "max-content",
			maxWidth: window.innerWidth - t.left + "px",
			height: "auto",
			maxHeight: window.innerHeight - 32 + "px",
			overflowY: "auto"
		});
		let n = e.getBoundingClientRect(), r = n.width, i = n.height, a = t.top, o = t.left;
		a + i > window.innerHeight && (a = Math.max(0, t.bottom - i)), o + r > window.innerWidth && (o = Math.max(0, window.innerWidth - r));
		let s = Math.max(0, t.top - a), c = Math.max(0, t.left - o), l = Math.max(0, o + r - (t.left + t.width)), u = Math.max(0, a + i - (t.top + t.height));
		Object.assign(e.style, {
			visibility: "",
			top: `${a}px`,
			left: `${o}px`,
			minWidth: `${t.width}px`,
			width: `${r}px`,
			height: `${i}px`,
			maxWidth: "",
			maxHeight: "",
			clipPath: `inset(${s}px ${l}px ${u}px ${c}px round 0.5rem)`
		}), this._animateOpen(s, l, u, c, a);
	}
	async triggerClose(e) {
		await this._animateClose(e), this.isOpen = !1, this.summaryRect = null;
	}
	_animateOpen(e, t, n, i, o) {
		let s = this._panelRef.value;
		if (!s) return;
		if (a.value) return void (s.style.clipPath = "");
		let c = this._backdropRef.value;
		c && c.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: r.duration,
			easing: r.easingFallback,
			fill: "forwards"
		});
		let l = [{
			clipPath: `inset(${e}px ${t}px ${n}px ${i}px round 0.5rem)`,
			opacity: .9
		}, {
			clipPath: "inset(0px 0px 0px 0px round 1rem)",
			opacity: 1
		}];
		s.animate(l, {
			duration: r.duration,
			easing: r.easingFallback,
			fill: "forwards"
		}).finished.then(() => {
			s.isConnected && (s.style.clipPath = "", s.style.height = "auto", s.style.maxHeight = window.innerHeight - o - 16 + "px");
		});
		let u = this._btnRef.value;
		u && u.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(180deg)" }], {
			duration: r.duration,
			easing: r.easingFallback,
			fill: "forwards"
		});
	}
	_animateClose(e) {
		let t = this._panelRef.value;
		if (!t || a.value) return Promise.resolve();
		let n = t.getBoundingClientRect(), i = Math.max(0, e.top - n.top), o = Math.max(0, e.left - n.left), s = Math.max(0, n.right - e.right), c = Math.max(0, n.bottom - e.bottom), l = Math.round(.4 * r.duration), u = "cubic-bezier(0.4, 0, 1, 1)", d = [{
			clipPath: "inset(0px 0px 0px 0px round 1rem)",
			opacity: 1
		}, {
			clipPath: `inset(${i}px ${s}px ${c}px ${o}px round 0.5rem)`,
			opacity: .6
		}], f = t.animate(d, {
			duration: l,
			easing: u,
			fill: "forwards"
		}), p = this._backdropRef.value;
		p && p.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: l,
			easing: u,
			fill: "forwards"
		});
		let m = this._btnRef.value;
		return m && m.animate([{ transform: "rotate(180deg)" }, { transform: "rotate(0deg)" }], {
			duration: l,
			easing: u,
			fill: "forwards"
		}), f.finished;
	}
	render() {
		return this.isOpen ? g`
			${this._backdrop ? g`
				<div
					${y(this._backdropRef)}
					class="fixed inset-0 z-9998 backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-105 bg-black/[0.07] will-change-[opacity]"
					@click=${() => this._owner?.close?.()}
				></div>
			` : _}
			<schmancy-surface
				${y(this._panelRef)}
				class="portal-panel"
				type=${this.type}
				style="overflow-y: auto;"
			>
				${this._hideIndicator ? _ : g`
					<button
						${y(this._btnRef)}
						class="minimize-btn"
						aria-label="Minimize"
						@click=${() => this._owner?.close?.()}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				`}
				<slot></slot>
			</schmancy-surface>
		` : _;
	}
};
t([p({ reflect: !0 })], b.prototype, "type", void 0), t([m()], b.prototype, "isOpen", void 0), b = t([f("schmancy-expand-root")], b);
var x = "schmancy-expand-request-close", S = class extends e(h`
	:host {
		display: block;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
		color: inherit;
	}

	.inline-grid {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: grid-template-rows 300ms cubic-bezier(0.22, 1.25, 0.36, 1),
		            opacity 300ms cubic-bezier(0.22, 1.25, 0.36, 1);
		opacity: 0;
	}

	.inline-grid[data-open] {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.inline-grid > .inner {
		min-height: 0;
		overflow: hidden;
	}
`) {
	constructor(...e) {
		super(...e), this.summary = "", this.open = !1, this.summaryPadding = "", this.contentPadding = "", this.hideIndicator = !1, this.indicatorRotate = 90, this.backdrop = !0, this.inline = !1, this._summaryRef = v(), this._contentSlotRef = v(), this._root = null, this._movedNodes = [];
	}
	connectedCallback() {
		super.connectedCallback(), s(window, "keydown").pipe(o((e) => e.key === "Escape"), o(() => this.open), u(() => {
			this._handleClose();
		}), l(this.disconnecting)).subscribe(), s(document, "pointerdown").pipe(o(() => this.open), o((e) => !!this._root && !e.composedPath().includes(this._root)), u(() => {
			this._handleClose();
		}), l(this.disconnecting)).subscribe();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._movedNodes.length > 0 && (this._movedNodes.forEach((e) => this.appendChild(e)), this._movedNodes = []), this._root && this._root.children.length === 0 && (this._root.remove(), this._root = null);
	}
	async _getOrCreateRoot() {
		let e = await c(this.discover("schmancy-theme")) ?? document.querySelector("schmancy-theme") ?? document.body, t = e.querySelector("schmancy-expand-root");
		return t || (t = new b(), e.appendChild(t)), t;
	}
	close() {
		this._handleClose();
	}
	expand() {
		this.open || this._expand();
	}
	updated(e) {
		super.updated(e), e.has("open") && this.open && !this.inline && !this._root && this._expand();
	}
	_toggle() {
		this.inline ? (this.open = !this.open, this._animateIndicator(this.open)) : this.open || this._expand();
	}
	_handleSummaryClick(e) {
		e.preventDefault(), this._toggle();
	}
	async _expand() {
		if (this.inline) return this.open = !0, void this._animateIndicator(!0);
		let e = await this._getOrCreateRoot();
		this._root = e;
		let t = this._summaryRef.value, n = this._contentSlotRef.value;
		if (!t || !n) return;
		let r = t.getBoundingClientRect(), i = n.assignedElements({ flatten: !0 });
		i.length !== 0 && (e.prepare(r, this, this.hideIndicator, this.backdrop), this._movedNodes = [...i], this._movedNodes.forEach((t) => e.appendChild(t)), e.triggerOpen(), this._animateIndicator(!0), this.open = !0);
	}
	async _handleClose() {
		if (this.inline) return this._animateIndicator(!1), void (this.open = !1);
		let e = this._root, t = this._summaryRef.value;
		if (!e || !t) return;
		let n = t.getBoundingClientRect();
		this._animateIndicator(!1), await e.triggerClose(n), this._movedNodes.forEach((e) => this.appendChild(e)), this._movedNodes = [], this.open = !1;
	}
	_animateIndicator(e) {
		if (a.value) return;
		let t = this.shadowRoot?.querySelector(".indicator");
		t && (this._currentIndicatorAnim?.cancel(), this._currentIndicatorAnim = t.animate([{ transform: `rotate(${e ? "0deg" : `${this.indicatorRotate}deg`})` }, { transform: `rotate(${e ? `${this.indicatorRotate}deg` : "0deg"})` }], {
			duration: i.duration,
			easing: i.easingFallback,
			fill: "forwards"
		}));
	}
	render() {
		let e = this.classMap({
			[this.summaryPadding]: !0,
			"select-none relative flex items-center gap-2 rounded-xl transition-all duration-150": !0,
			"hover:brightness-[0.92] active:brightness-[0.85] cursor-pointer group": !0,
			"flex-row-reverse": !0
		});
		return g`
			<div class="w-full rounded-xl">
				<div
					${y(this._summaryRef)}
					class=${e}
					tabindex="0"
					role="button"
					@click=${this._handleSummaryClick}
					@keydown=${(e) => {
			e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this._toggle());
		}}
				>
					${this.hideIndicator ? _ : g`
								<span class="indicator flex items-center justify-center w-5 h-5 rounded-full shrink-0 opacity-70 group-hover:opacity-100 will-change-transform">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path
											d="M9 6L15 12L9 18"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							`}

					<span class="flex-1 font-medium text-base min-w-0">
						<slot name="summary">${this.summary}</slot>
					</span>

					<slot name="actions"></slot>
				</div>

				${this.inline ? g`
						<div class="inline-grid" ?data-open=${this.open}>
							<div class="inner">
								<slot ${y(this._contentSlotRef)}></slot>
							</div>
						</div>
					` : g`
						<div style=${d(this.open ? {} : { display: "none" })}>
							<slot ${y(this._contentSlotRef)}></slot>
						</div>
					`}
			</div>
		`;
	}
};
t([p()], S.prototype, "summary", void 0), t([p({
	type: Boolean,
	reflect: !0
})], S.prototype, "open", void 0), t([p({ attribute: "summary-padding" })], S.prototype, "summaryPadding", void 0), t([p({ attribute: "content-padding" })], S.prototype, "contentPadding", void 0), t([p({
	type: Boolean,
	attribute: "hide-indicator"
})], S.prototype, "hideIndicator", void 0), t([p({
	type: Number,
	attribute: "indicator-rotate"
})], S.prototype, "indicatorRotate", void 0), t([p({ type: Boolean })], S.prototype, "backdrop", void 0), t([p({ type: Boolean })], S.prototype, "inline", void 0), S = t([f("schmancy-expand")], S);
export { b as n, x as t };
