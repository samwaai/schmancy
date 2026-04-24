import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
var o = class extends e(i`
	:host {
		display: inline-block;
		vertical-align: middle;
	}
	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--_ksize, 1.5rem);
		height: var(--_ksize, 1.5rem);
		padding: 0 0.375rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: var(--_kfont, 0.75rem);
		font-weight: 500;
		line-height: 1;
		color: var(--schmancy-sys-color-surface-on, #1d1b20);
		background: var(--schmancy-sys-color-surface-container, #f3f0f7);
		border: 1px solid var(--schmancy-sys-color-outline-variant, #cac4d0);
		border-radius: 0.375rem;
		box-shadow: inset 0 -1px 0 var(--schmancy-sys-color-outline-variant, #cac4d0);
		white-space: nowrap;
	}
	:host([size='sm']) kbd {
		--_ksize: 1.25rem;
		--_kfont: 0.6875rem;
	}
`) {
	constructor(...e) {
		super(...e), this.size = "md";
	}
	render() {
		return a`<kbd part="base"><slot></slot></kbd>`;
	}
};
t([r({
	type: String,
	reflect: !0
})], o.prototype, "size", void 0), o = t([n("schmancy-kbd")], o);
export { o as SchmancyKbd };
