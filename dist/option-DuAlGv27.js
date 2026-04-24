import { t as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { fromEvent as n, takeUntil as r } from "rxjs";
import { customElement as i, property as a } from "lit/decorators.js";
import { css as o, html as s } from "lit";
var c = class extends e(o`
	:host {
		display: block;
		cursor: pointer;
		user-select: none;
		outline: none;
	}

	:host(:focus-visible) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: -2px;
	}

	:host([hidden]) {
		display: none;
	}

	:host([disabled]) {
		opacity: 0.5;
		pointer-events: none;
	}
`) {
	constructor(...e) {
		super(...e), this.value = "", this.label = "", this.selected = !1, this.disabled = !1, this.group = "", this.icon = "";
	}
	connectedCallback() {
		super.connectedCallback(), this.id ||= `schmancy-option-${Math.random().toString(36).substring(2, 9)}`, this.label ||= this.textContent?.trim() || this.value, !this.value && this.textContent && (this.value = this.textContent.trim()), n(this, "click").pipe(r(this.disconnecting)).subscribe((e) => {
			e.stopPropagation(), this.disabled || this.dispatchEvent(new CustomEvent("option-select", {
				bubbles: !0,
				composed: !0,
				detail: { value: this.value }
			}));
		}), n(this, "keydown").pipe(r(this.disconnecting)).subscribe((e) => {
			if (e.key === " " || e.key === "Enter") {
				if (e.preventDefault(), e.stopPropagation(), this.disabled) return;
				this.dispatchEvent(new CustomEvent("option-select", {
					bubbles: !0,
					composed: !0,
					detail: { value: this.value }
				}));
			}
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}
	render() {
		let e = {
			"py-2": !0,
			"px-3": !0,
			rounded: !0,
			"text-sm": !0,
			"w-full": !0,
			flex: !0,
			"items-center": !0,
			"gap-2": !0,
			"bg-primary-container": this.selected,
			"text-primary-onContainer": this.selected,
			"hover:bg-surface-high": !this.selected,
			"focus:outline-none": !0
		};
		return s`
			<div class=${this.classMap(e)} role="option" aria-selected=${this.selected} aria-disabled=${this.disabled}>
				${this.icon ? s`<span class="icon">${this.icon}</span>` : ""}
				<span class="flex-1">${this.label || this.value}</span>
				${this.selected ? s`
							<span class="check">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>
						` : ""}
			</div>
		`;
	}
};
t([a({ type: String })], c.prototype, "value", void 0), t([a({ type: String })], c.prototype, "label", void 0), t([a({
	type: Boolean,
	reflect: !0
})], c.prototype, "selected", void 0), t([a({
	type: Boolean,
	reflect: !0
})], c.prototype, "disabled", void 0), t([a({ type: String })], c.prototype, "group", void 0), t([a({ type: String })], c.prototype, "icon", void 0), c = t([i("schmancy-option")], c);
