import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a, nothing as o } from "lit";
var s = class extends e(i`
	:host {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	:host([size='sm']) .label { font-size: 0.6875rem; }
	:host([size='sm']) .value { font-size: 1.25rem; }
	:host([size='md']) .label { font-size: 0.75rem; }
	:host([size='md']) .value { font-size: 1.75rem; }
	:host([size='lg']) .label { font-size: 0.8125rem; }
	:host([size='lg']) .value { font-size: 2.5rem; }
	.label {
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--schmancy-sys-color-surface-onVariant);
	}
	.value {
		font-weight: 600;
		line-height: 1.1;
		color: var(--schmancy-sys-color-surface-on);
		font-variant-numeric: tabular-nums;
	}
	.delta {
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.375rem;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
	}
	.delta[data-trend='up'] {
		color: var(--schmancy-sys-color-success-on);
		background: var(--schmancy-sys-color-success-default);
	}
	.delta[data-trend='down'] {
		color: var(--schmancy-sys-color-error-on);
		background: var(--schmancy-sys-color-error-default);
	}
	.delta[data-trend='neutral'] {
		color: var(--schmancy-sys-color-surface-on);
		background: var(--schmancy-sys-color-surface-containerHigh);
	}
	.arrow {
		font-size: 0.625rem;
		line-height: 1;
	}
	.row {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
`) {
	constructor(...e) {
		super(...e), this.label = "", this.value = "", this.size = "md";
	}
	_arrowFor(e) {
		return e === "up" ? "↑" : e === "down" ? "↓" : "→";
	}
	render() {
		let e = this.trend ?? "neutral";
		return a`
			<span class="label" part="label"><slot name="label">${this.label}</slot></span>
			<span class="row">
				<span class="value" part="value"><slot>${this.value}</slot></span>
				${this.delta ? a`
							<span class="delta" part="delta" data-trend=${e}>
								${this.trend ? a`<span class="arrow" aria-hidden="true">${this._arrowFor(this.trend)}</span>` : o}
								${this.delta}
							</span>
						` : o}
			</span>
		`;
	}
};
t([r({ type: String })], s.prototype, "label", void 0), t([r({ type: String })], s.prototype, "value", void 0), t([r({
	type: String,
	reflect: !0
})], s.prototype, "trend", void 0), t([r({ type: String })], s.prototype, "delta", void 0), t([r({
	type: String,
	reflect: !0
})], s.prototype, "size", void 0), s = t([n("schmancy-metric")], s);
export { s as SchmancyMetric };
