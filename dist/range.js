import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
import { when as o } from "lit/directives/when.js";
var s = class extends e(i`
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: linear-gradient(
			to right,
			var(--color-primary, #6750a4) 0%,
			var(--color-primary, #6750a4) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) 100%
		);
		outline: none;
		cursor: pointer;
	}
	input[type='range']:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
		transition: box-shadow 0.1s ease;
	}
	input[type='range']::-webkit-slider-thumb:hover {
		box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-primary, #6750a4) 12%, transparent);
	}
	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
	}
`) {
	constructor(...e) {
		super(...e), this.min = 0, this.max = 1, this.step = .01, this.value = 0, this.disabled = !1;
	}
	get progress() {
		return (this.value - this.min) / (this.max - this.min) * 100 + "%";
	}
	render() {
		return a`
			<div class="flex flex-col gap-1 w-full">
				${o(this.label, () => a`
						<div class="flex justify-between items-center">
							<schmancy-typography type="label" token="sm" class="text-surface-on">${this.label}</schmancy-typography>
							<schmancy-typography type="label" token="sm" class="text-surface-on opacity-60">${this.value}</schmancy-typography>
						</div>
					`)}
				<input
					type="range"
					.min=${String(this.min)}
					.max=${String(this.max)}
					.step=${String(this.step)}
					.value=${String(this.value)}
					?disabled=${this.disabled}
					style="--range-progress: ${this.progress}"
					@input=${(e) => {
			this.value = Number(e.target.value), this.dispatchEvent(new CustomEvent("change", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			}));
		}}
				/>
			</div>
		`;
	}
};
t([r({ type: Number })], s.prototype, "min", void 0), t([r({ type: Number })], s.prototype, "max", void 0), t([r({ type: Number })], s.prototype, "step", void 0), t([r({ type: Number })], s.prototype, "value", void 0), t([r({ type: String })], s.prototype, "label", void 0), t([r({ type: Boolean })], s.prototype, "disabled", void 0), s = t([n("schmancy-range")], s);
export { s as SchmancyRange };
