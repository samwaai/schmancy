import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BLb2kIHg.js";
import { fromEvent as n, of as r, timer as i, zip as a } from "rxjs";
import { take as o, takeUntil as s, tap as c } from "rxjs/operators";
import { styleMap as l } from "lit/directives/style-map.js";
import { customElement as u, property as d, state as f } from "lit/decorators.js";
import { css as p, html as m } from "lit";
var h = class extends t(p`
	:host {
		display: block;
		position: relative;
	}

	.splash-layer {
		position: fixed;
		inset: 0;
		z-index: 50;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(
			--schmancy-splash-background,
			var(--schmancy-sys-color-surface-containerLowest, #000)
		);
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-out;
	}

	.content-layer {
		display: block;
		width: 100%;
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-in-out;
	}
`) {
	constructor(...e) {
		super(...e), this.minDuration = 1500, this.auto = !1, this.initiallyHidden = !1, this._visible = !0;
	}
	connectedCallback() {
		super.connectedCallback(), this.initiallyHidden ? this._visible = !1 : a(this.auto ? r(null) : n(this, "ready").pipe(o(1)), i(this.minDuration)).pipe(o(1), c(() => this._dismiss()), s(this.disconnecting)).subscribe();
	}
	ready() {
		this.dispatchEvent(new Event("ready"));
	}
	show() {
		this._visible = !0;
	}
	_dismiss() {
		this._visible = !1, this.dispatchEvent(new CustomEvent("schmancy-splash-done", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return m`
			<div
				class="splash-layer"
				aria-hidden=${!this._visible}
				style=${l({
			opacity: this._visible ? "1" : "0",
			pointerEvents: this._visible ? "auto" : "none"
		})}
			>
				<slot name="splash"></slot>
			</div>
			<div
				class="content-layer"
				style=${l({
			opacity: this._visible ? "0" : "1",
			pointerEvents: this._visible ? "none" : "auto"
		})}
			>
				<slot></slot>
			</div>
		`;
	}
};
e([d({
	type: Number,
	attribute: "min-duration"
})], h.prototype, "minDuration", void 0), e([d({ type: Boolean })], h.prototype, "auto", void 0), e([d({
	type: Boolean,
	attribute: "initially-hidden"
})], h.prototype, "initiallyHidden", void 0), e([f()], h.prototype, "_visible", void 0), h = e([u("schmancy-splash-screen")], h);
