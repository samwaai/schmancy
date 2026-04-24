import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
var o = class extends e(i`
	:host {
		display: block;
		width: var(--_sw, 100%);
		height: var(--_sh, 1rem);
	}
	.surface {
		width: 100%;
		height: 100%;
		border-radius: var(--_sr, 0.25rem);
		background: linear-gradient(
			90deg,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 25%,
			var(--schmancy-sys-color-surface-container, #f2f2f2) 37%,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 63%
		);
		background-size: 400% 100%;
		animation: schmancy-skeleton-shimmer 1.4s ease infinite;
	}
	:host([shape='circle']) .surface {
		border-radius: 50%;
	}
	@keyframes schmancy-skeleton-shimmer {
		0% { background-position: 100% 50%; }
		100% { background-position: 0 50%; }
	}
	@media (prefers-reduced-motion: reduce) {
		.surface {
			animation: none;
			background: var(--schmancy-sys-color-surface-containerHighest, #e6e6e6);
		}
	}
`) {
	constructor(...e) {
		super(...e), this.shape = "rect", this.width = "", this.height = "", this.radius = "";
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("role", "status"), this.setAttribute("aria-busy", "true"), this.setAttribute("aria-label", "Loading");
	}
	updated() {
		this.width && this.style.setProperty("--_sw", this.width);
		let e = this.shape === "text" ? "1em" : "1rem";
		this.style.setProperty("--_sh", this.height || e), this.radius && this.style.setProperty("--_sr", this.radius);
	}
	render() {
		return a`<div part="surface" class="surface"></div>`;
	}
};
t([r({
	type: String,
	reflect: !0
})], o.prototype, "shape", void 0), t([r({ type: String })], o.prototype, "width", void 0), t([r({ type: String })], o.prototype, "height", void 0), t([r({ type: String })], o.prototype, "radius", void 0), o = t([n("schmancy-skeleton")], o);
export { o as SchmancySkeleton };
