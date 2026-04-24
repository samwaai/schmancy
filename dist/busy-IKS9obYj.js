import { t as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
var o = class extends e(i`
	:host {
		display: inline;
		position: absolute;
		inset: 0;
		pointer-events: all;
		z-index: 50;
	}
`) {
	render() {
		return a`
			<!-- Clean overlay with subtle backdrop -->
			<div class="absolute inset-0 flex items-center justify-center bg-surface-container/10 backdrop-blur-xs rounded-[inherit]">
				<!-- Content container with clean surface -->
				<div class="relative flex items-center justify-center p-4">
					
					<!-- Content slot -->
					<div class="relative z-10">
						<slot>
							<!-- Default spinner if no content provided -->
							<schmancy-spinner ></schmancy-spinner>
						</slot>
					</div>
				</div>
			</div>
		`;
	}
};
o = t([n("schmancy-busy")], o);
var s = class extends e(i`
	:host {
		display: inline-block;
		color: inherit; /* Inherit from parent by default */
	}

	/* Explicit color options when needed */
	:host([color="primary"]) {
		color: var(--schmancy-sys-color-primary-default);
	}

	:host([color="on-primary"]) {
		color: var(--schmancy-sys-color-primary-on);
	}

	:host([color="secondary"]) {
		color: var(--schmancy-sys-color-secondary-default);
	}

	:host([color="on-secondary"]) {
		color: var(--schmancy-sys-color-secondary-on);
	}

	:host([color="tertiary"]) {
		color: var(--schmancy-sys-color-tertiary-default);
	}

	:host([color="on-tertiary"]) {
		color: var(--schmancy-sys-color-tertiary-on);
	}

	:host([color="error"]) {
		color: var(--schmancy-sys-color-error-default);
	}

	:host([color="on-error"]) {
		color: var(--schmancy-sys-color-error-on);
	}

	:host([color="success"]) {
		color: var(--schmancy-sys-color-success-default);
	}

	:host([color="on-success"]) {
		color: var(--schmancy-sys-color-success-on);
	}

	:host([color="surface"]) {
		color: var(--schmancy-sys-color-surface-default);
	}

	:host([color="on-surface"]) {
		color: var(--schmancy-sys-color-surface-on);
	}

	:host([color="surface-variant"]) {
		color: var(--schmancy-sys-color-surface-variant-default);
	}

	:host([color="on-surface-variant"]) {
		color: var(--schmancy-sys-color-surface-onVariant);
	}

	.spinner {
		animation: spin 1s linear infinite;
		animation-direction: reverse;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`) {
	constructor(...e) {
		super(...e), this.size = "md", this.glass = !1;
	}
	render() {
		let e = {
			xxs: 12,
			xs: 16,
			sm: 20,
			md: 24,
			lg: 32
		}, t;
		t = typeof this.size == "string" && this.size in e ? e[this.size] : typeof this.size != "number" || isNaN(this.size) ? 24 : 4 * this.size;
		let n = {
			width: `${t}px`,
			height: `${t}px`
		};
		return this.glass ? a`
			<div class="spinner relative" style=${this.styleMap(n)}>
				<!-- Glass container with Apple-style effect -->
				<div class="absolute inset-0 rounded-full backdrop-blur-xl backdrop-saturate-150
							bg-surface-container/20
							shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]
							border border-outline-variant/30"></div>
				
				<!-- Spinner SVG -->
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" 
					 style="width: 100%; height: 100%;" class="relative z-10">
					<path
						opacity=".7"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="currentColor"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="currentColor" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="currentColor" opacity="0.8"></path>
				</svg>
			</div>
		` : a`
			<div class="spinner" style=${this.styleMap(n)}>
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" style="width: 100%; height: 100%;">
					<path
						opacity=".5"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="currentColor"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="currentColor" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="currentColor"></path>
				</svg>
			</div>
		`;
	}
};
t([r({
	type: String,
	reflect: !0
})], s.prototype, "color", void 0), t([r()], s.prototype, "size", void 0), t([r({ type: Boolean })], s.prototype, "glass", void 0), s = t([n("schmancy-spinner")], s);
