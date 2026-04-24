import { t as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { t as n } from "./cursor-glow-C2YRrB8Z.js";
import { customElement as r, property as i, state as a } from "lit/decorators.js";
import { LitElement as o, css as s, html as c } from "lit";
import { ifDefined as l } from "lit/directives/if-defined.js";
var u = class extends e(s`
	:host {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		align-items: center;
		justify-content: flex-end;
	}
`) {
	render() {
		return c`<slot></slot>`;
	}
};
u = t([r("schmancy-card-action")], u);
var d = class extends e(s`
	:host {
		display: block;
		position: relative;
		border-radius: var(--schmancy-sys-shape-corner-medium);
		transition:
			box-shadow var(--schmancy-sys-motion-duration-short4) var(--schmancy-sys-motion-easing-standard),
			transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
		outline: none;
	}

	/* Type variants */
	:host([type='elevated']) {
		background-color: var(--schmancy-sys-color-surface-low);
		box-shadow: var(--schmancy-sys-elevation-1);
	}
	:host([type='filled']) {
		background-color: var(--schmancy-sys-color-surface-highest);
		box-shadow: var(--schmancy-sys-elevation-0);
	}
	:host([type='outlined']) {
		background-color: var(--schmancy-sys-color-surface-default);
		border: 1px solid var(--schmancy-sys-color-outlineVariant);
		box-shadow: var(--schmancy-sys-elevation-0);
	}

	/* Interactive states */
	:host([interactive]) {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	:host([interactive]:focus-visible:not([disabled])) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
	}
	:host([disabled]) {
		pointer-events: none;
		opacity: var(--schmancy-sys-state-disabled-opacity);
	}

	/* Hover elevations — luminous glow + lift */
	:host([type='elevated'][interactive]:hover:not([disabled])) {
		box-shadow:
			var(--schmancy-sys-elevation-2),
			0 4px 24px -6px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 12%, transparent);
		transform: translateY(-2px);
	}
	:host([type='filled'][interactive]:hover:not([disabled])),
	:host([type='outlined'][interactive]:hover:not([disabled])) {
		box-shadow:
			var(--schmancy-sys-elevation-1),
			0 4px 20px -6px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 10%, transparent);
		transform: translateY(-1px);
	}

	/* Active state — kinetic compress */
	:host([interactive]:active:not([disabled])) {
		transform: scale(0.98);
		transition-duration: 100ms;
	}

	/* Dragged state */
	:host([dragged]) {
		box-shadow:
			var(--schmancy-sys-elevation-3),
			0 8px 32px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
		transform: translateY(-4px);
	}

	@media (prefers-reduced-motion: reduce) {
		:host([interactive]:hover:not([disabled])),
		:host([interactive]:active:not([disabled])),
		:host([dragged]) {
			transform: none;
		}
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
`) {
	constructor(...e) {
		super(...e), this.type = "elevated", this.interactive = !1, this.disabled = !1, this.dragged = !1, this.role = "article", this.ariaLabel = "", this.pressed = !1, this.ripples = [], this.nextRippleId = 0, this.handleClick = (e) => {
			if (this.disabled || !this.interactive) return;
			let t = this.getBoundingClientRect();
			this._triggerAction(e.clientX - t.left, e.clientY - t.top);
		}, this.handleKeyDown = (e) => {
			if (!this.disabled && this.interactive && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault(), this._setPressed(!0);
				let t = this.getBoundingClientRect();
				this._triggerAction(t.width / 2, t.height / 2);
			}
		}, this.handleKeyUp = (e) => {
			e.key !== "Enter" && e.key !== " " || this._setPressed(!1);
		}, this.handleMouseDown = () => {
			!this.disabled && this.interactive && this._setPressed(!0);
		}, this.handleMouseUp = () => this._setPressed(!1), this.handleMouseLeave = () => this._setPressed(!1);
	}
	static {
		this.shadowRootOptions = {
			...o.shadowRootOptions,
			mode: "open",
			delegatesFocus: !0
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._updateAriaAttributes();
	}
	updated(e) {
		super.updated(e), (e.has("interactive") || e.has("disabled")) && this._updateAriaAttributes();
	}
	_updateAriaAttributes() {
		this.interactive && !this.disabled ? (this.setAttribute("tabindex", "0"), this.role && this.role !== "article" || (this.role = this.href ? "link" : "button")) : (this.removeAttribute("tabindex"), this.role !== "button" && this.role !== "link" || (this.role = "article"));
	}
	_addRipple(e, t) {
		let n = this.nextRippleId++;
		this.ripples = [...this.ripples, {
			x: e,
			y: t,
			id: n
		}], setTimeout(() => {
			this.ripples = this.ripples.filter((e) => e.id !== n);
		}, 600);
	}
	_navigate() {
		this.href && (this.target === "_blank" ? window.open(this.href, "_blank") : window.location.href = this.href);
	}
	_triggerAction(e, t) {
		this._addRipple(e, t), this._navigate(), this.dispatchEvent(new CustomEvent("schmancy-click", {
			detail: { value: this.type },
			bubbles: !0,
			composed: !0
		}));
	}
	_setPressed(e) {
		this.pressed = e, e ? this.setAttribute("pressed", "") : this.removeAttribute("pressed");
	}
	render() {
		let e = this.interactive && !this.disabled;
		return c`
			<div
				${e ? n({
			radius: 200,
			intensity: .1
		}) : ""}
				class="relative w-full h-full rounded-xl ${e ? "cursor-pointer" : ""}"
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@keyup=${this.handleKeyUp}
				@mousedown=${this.handleMouseDown}
				@mouseup=${this.handleMouseUp}
				@mouseleave=${this.handleMouseLeave}
				aria-label=${l(this.ariaLabel)}
				aria-disabled=${this.disabled ? "true" : "false"}
			>
				<!-- State layer -->
				<div
					class="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 bg-surface-on ${e ? this.pressed ? "opacity-[var(--schmancy-sys-state-pressed-opacity)]" : "opacity-0 hover:opacity-[var(--schmancy-sys-state-hover-opacity)] focus-visible:opacity-[var(--schmancy-sys-state-focus-opacity)]" : "opacity-0"}"
				></div>

				<!-- Ripples -->
				${this.interactive && this.ripples.length ? c`
							<div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
								${this.ripples.map((e) => c`
										<span
											class="absolute rounded-full scale-0 animate-[ripple_600ms_linear] bg-surface-on opacity-[0.12] w-5 h-5 -ml-2.5 -mt-2.5"
											style="left: ${e.x}px; top: ${e.y}px"
										></span>
									`)}
							</div>
						` : ""}

				<!-- Content -->
				<div class="relative h-full w-full rounded-xl">
					<slot></slot>
				</div>
			</div>
		`;
	}
};
t([i({ reflect: !0 })], d.prototype, "type", void 0), t([i({
	type: Boolean,
	reflect: !0
})], d.prototype, "interactive", void 0), t([i({
	type: Boolean,
	reflect: !0
})], d.prototype, "disabled", void 0), t([i({
	type: Boolean,
	reflect: !0
})], d.prototype, "dragged", void 0), t([i()], d.prototype, "href", void 0), t([i()], d.prototype, "target", void 0), t([i({ attribute: "role" })], d.prototype, "role", void 0), t([i({ attribute: "aria-label" })], d.prototype, "ariaLabel", void 0), t([a()], d.prototype, "pressed", void 0), t([a()], d.prototype, "ripples", void 0), d = t([r("schmancy-card")], d);
var f = class extends e(s`
	:host {
		display: block;
		padding: 1rem;
	}
`) {
	render() {
		return c`<slot></slot>`;
	}
};
f = t([r("schmancy-card-content")], f);
var p = class extends e(s`
	:host {
		display: block;
		position: relative;
		height: 200px;
		overflow: hidden;
	}
	
	/* Allow height to be overridden when used in flex/grid layouts */
	:host-context(.h-full) {
		height: 100%;
	}
	
	::slotted(img),
	img {
		width: 100%;
		height: 100%;
		object-position: center;
	}
	
	/* Object fit styles based on fit attribute */
	:host([fit="contain"]) img,
	:host([fit="contain"]) ::slotted(img) {
		object-fit: contain;
	}
	
	:host([fit="cover"]) img,
	:host([fit="cover"]) ::slotted(img) {
		object-fit: cover;
	}
	
	:host([fit="fill"]) img,
	:host([fit="fill"]) ::slotted(img) {
		object-fit: fill;
	}
	
	:host([fit="none"]) img,
	:host([fit="none"]) ::slotted(img) {
		object-fit: none;
	}
	
	:host([fit="scale-down"]) img,
	:host([fit="scale-down"]) ::slotted(img) {
		object-fit: scale-down;
	}
`) {
	constructor(...e) {
		super(...e), this.src = "", this.fit = "contain", this.alt = "";
	}
	render() {
		return this.src ? c`<img src="${this.src}" alt="${this.alt}" />` : c`<slot></slot>`;
	}
};
t([i({
	type: String,
	reflect: !0
})], p.prototype, "src", void 0), t([i({
	type: String,
	reflect: !0
})], p.prototype, "fit", void 0), t([i({ type: String })], p.prototype, "alt", void 0), p = t([r("schmancy-card-media")], p);
