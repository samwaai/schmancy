import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import "./input-chip-CiG61y-N.js";
import { r } from "./layout-fjM1DWlF.js";
import { t as i } from "./magnetic-BhXebqF3.js";
import { BehaviorSubject as a, combineLatest as o } from "rxjs";
import { debounceTime as s, distinctUntilChanged as c, takeUntil as l } from "rxjs/operators";
import { classMap as u } from "lit/directives/class-map.js";
import { customElement as d, property as f, queryAssignedElements as p, state as m } from "lit/decorators.js";
import { LitElement as h, css as g, html as _ } from "lit";
var v = class extends e(g`
	:host {
		display: inline-block;
		outline: none;
		min-width:fit-content
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(0, 0, 0, 0.08);
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* State layer for M3 hover/focus/pressed states */
	.state-layer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 200ms ease;
	}

	:host(:not([disabled])) button:hover .state-layer {
		opacity: 0.08;
	}

	:host(:not([disabled])) button:focus-visible .state-layer {
		opacity: 0.1;
	}

	:host(:not([disabled])) button:active .state-layer {
		opacity: 0.1;
	}
`) {
	constructor(...e) {
		super(...e), this.value = "", this.icon = "", this.href = "", this.target = "", this.disabled = !1, this.elevated = !0, this.hover$ = new a(!1), this.pressed$ = new a(!1), this.focused$ = new a(!1), this.ripples = [], this.nextRippleId = 0, this.handleClick = (e) => {
			if (this.disabled) return;
			let t = this.shadowRoot?.querySelector("button");
			if (t) {
				let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = this.nextRippleId++;
				this.ripples = [...this.ripples, {
					x: r,
					y: i,
					id: a
				}], setTimeout(() => {
					this.ripples = this.ripples.filter((e) => e.id !== a);
				}, 600);
			}
			this.href && (this.target === "_blank" ? window.open(this.href, "_blank") : window.location.href = this.href), this.dispatchEvent(new CustomEvent("action", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleKeyDown = (e) => {
			if (!this.disabled && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault(), this.pressed$.next(!0);
				let t = new MouseEvent("click", {
					bubbles: !0,
					cancelable: !0,
					clientX: 0,
					clientY: 0
				});
				this.handleClick(t), setTimeout(() => this.pressed$.next(!1), 100);
			}
		}, this.handleFocus = () => {
			this.focused$.next(!0);
		}, this.handleBlur = () => {
			this.focused$.next(!1);
		};
	}
	static {
		this.shadowRootOptions = {
			...h.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	connectedCallback() {
		super.connectedCallback(), o([
			this.hover$,
			this.pressed$,
			this.focused$
		]).pipe(l(this.disconnecting)).subscribe();
	}
	render() {
		let e = !!this.icon;
		return _`
			<button
				type="button"
				class=${u({
			relative: !0,
			"inline-flex": !0,
			"items-center": !0,
			"gap-2": !0,
			"h-8": !0,
			"min-h-[32px]": !0,
			"rounded-full": !0,
			"cursor-pointer": !this.disabled,
			"transition-all": !0,
			"duration-200": !0,
			"select-none": !0,
			"overflow-hidden": !0,
			"pl-2": e,
			"pl-4": !e,
			"pr-4": !0,
			"bg-surface-containerLow": !0,
			"text-surface-onVariant": !0,
			"shadow-sm": this.elevated && !this.disabled,
			"hover:shadow-md": this.elevated && !this.disabled,
			"focus-visible:outline": !this.disabled,
			"focus-visible:outline-2": !this.disabled,
			"focus-visible:outline-primary": !this.disabled,
			"focus-visible:outline-offset-2": !this.disabled,
			"opacity-38": this.disabled,
			"cursor-not-allowed": this.disabled
		})}
				?disabled=${this.disabled}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${() => this.hover$.next(!0)}
				@mouseleave=${() => this.hover$.next(!1)}
				@mousedown=${() => this.pressed$.next(!0)}
				@mouseup=${() => this.pressed$.next(!1)}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				tabindex=${this.disabled ? "-1" : "0"}
				role="button"
				aria-disabled=${this.disabled}
				aria-label=${this.value}
			>
				${this.icon ? _`
					<schmancy-icon class="text-[18px] shrink-0">${this.icon}</schmancy-icon>
				` : ""}
				<span class="text-sm font-medium leading-5">
					<slot></slot>
				</span>

				<!-- Ripple effects -->
				${this.ripples.map((e) => _`
					<span
						class="ripple"
						style="left: ${e.x}px; top: ${e.y}px;"
					></span>
				`)}

				<!-- State layer for M3 hover/focus/pressed states -->
				<div class="state-layer"></div>
			</button>
		`;
	}
};
t([f({ reflect: !0 })], v.prototype, "value", void 0), t([f({ reflect: !0 })], v.prototype, "icon", void 0), t([f({ reflect: !0 })], v.prototype, "href", void 0), t([f({ reflect: !0 })], v.prototype, "target", void 0), t([f({
	type: Boolean,
	reflect: !0
})], v.prototype, "disabled", void 0), t([f({
	type: Boolean,
	reflect: !0
})], v.prototype, "elevated", void 0), t([m()], v.prototype, "ripples", void 0), v = t([d("schmancy-assist-chip")], v);
var y = class extends n(g`
:host{
	display:block;
	height:fit-content;
	width:fit-content;
}
	
`) {
	constructor(...e) {
		super(...e), this.value$ = new a(""), this.values$ = new a([]), this._value = "", this._values = [], this._multi = !1, this._valueSet = !1, this._valuesSet = !1, this.wrap = !1, this.required = !1, this.justify = "start";
	}
	get multi() {
		return this._multi;
	}
	set multi(e) {
		this._multi = e;
	}
	get mode() {
		return this._valuesSet ? "multi" : this._valueSet ? "single" : this.hasAttribute("values") ? "multi" : this.hasAttribute("value") ? "single" : !0 === this._multi ? "multi" : "none";
	}
	get values() {
		return this._values;
	}
	set values(e) {
		this._values = e || [], this._valuesSet = !0, this.values$.next(this._values);
	}
	get value() {
		return this._value;
	}
	set value(e) {
		this._value = e || "", this._valueSet = !0, this.value$.next(this._value);
	}
	connectedCallback() {
		super.connectedCallback(), this.value$.next(this._value), this.values$.next(this._values), o([this.value$.pipe(c()), this.values$.pipe(c((e, t) => e.length === t.length && e.every((e, n) => e === t[n])))]).pipe(s(0), l(this.disconnecting)).subscribe(([e, t]) => {
			this.updateChipStates(this.mode, e, t);
		});
	}
	updateChipStates(e, t, n) {
		this.chips && e !== "none" && this.chips.forEach((r) => {
			if ("value" in r && "selected" in r) {
				let i = r;
				e === "multi" ? i.selected = n.length > 0 && n.includes(i.value) : e === "single" && (i.selected = t !== "" && t === i.value);
			}
		});
	}
	async change(e) {
		if (e.preventDefault(), e.stopPropagation(), this.mode === "none") return;
		let { value: t, selected: n } = e.detail;
		if (this.mode === "multi") n ? this._values.includes(t) || (this._values = [...this._values, t], this.values$.next(this._values)) : (this._values = this._values.filter((e) => e !== t), this.values$.next(this._values));
		else if (this.mode === "single") {
			if (n) this._value = t;
			else {
				if (this.required) return;
				this._value = "";
			}
			this.value$.next(this._value);
		}
		this.requestUpdate(), this.dispatchEvent(new CustomEvent("change", {
			detail: this.mode === "multi" ? this._values : this._value,
			bubbles: !0
		}));
	}
	firstUpdated(e) {
		super.firstUpdated(e), this.updateChipStates(this.mode, this._value, this._values);
	}
	render() {
		let e = {
			"flex flex-nowrap justify-center gap-2": !0,
			"flex-wrap": this.wrap,
			"justify-center": this.justify === "center"
		};
		return _`
			<schmancy-scroll
				hide
				.direction=${this.wrap ? "vertical" : "horizontal"}
				class="${this.classMap(e)}"
				${r()}
				@change=${this.change}
			>
				<slot
					@slotchange=${() => {
			this.updateChipStates(this.mode, this._value, this._values);
		}}
				></slot>
			</schmancy-scroll>
		`;
	}
};
t([f({
	type: Boolean,
	reflect: !0
})], y.prototype, "multi", null), t([f({
	type: Array,
	reflect: !0
})], y.prototype, "values", null), t([f({
	type: String,
	reflect: !0
})], y.prototype, "value", null), t([p({
	selector: "schmancy-chip, schmancy-filter-chip, schmancy-assist-chip, schmancy-input-chip, schmancy-suggestion-chip",
	flatten: !0
})], y.prototype, "chips", void 0), t([f({
	type: Boolean,
	reflect: !0
})], y.prototype, "wrap", void 0), t([f({
	type: Boolean,
	reflect: !0
})], y.prototype, "required", void 0), t([f({
	type: String,
	reflect: !0
})], y.prototype, "justify", void 0), y = t([d("schmancy-chips")], y);
var b = class extends e(g`
	:host {
		display: inline-block;
		outline: none;
		min-width: fit-content;
		border-radius: 0.5rem;
		transition:
			box-shadow 300ms ease,
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	:host(:hover:not([disabled])) {
		box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	:host(:active:not([disabled])) {
		transform: scale(0.95);
		transition-duration: 100ms;
	}

	:host([selected]) {
		box-shadow: 0 0 12px -2px color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 20%, transparent);
	}

	:host([disabled]) {
		pointer-events: none;
		opacity: var(--schmancy-sys-state-disabled-opacity);
	}

	@media (prefers-reduced-motion: reduce) {
		:host { transition: none; }
		:host(:hover:not([disabled])) { box-shadow: none; }
		:host(:active:not([disabled])) { transform: none; }
		:host([selected]) { box-shadow: none; }
	}

	button {
		font-family: inherit;
	}
`) {
	get selected() {
		return this._selected;
	}
	set selected(e) {
		let t = this._selected;
		this._selected = e, this.requestUpdate("selected", t);
	}
	constructor() {
		super(), this.value = "", this._selected = !1, this.removable = !1, this.disabled = !1, this.elevated = !1, this.handleClick = () => {
			this.disabled || this.dispatchEvent(new CustomEvent("change", {
				detail: {
					value: this.value,
					selected: !this._selected
				},
				bubbles: !0,
				composed: !0
			}));
		}, this.handleRemove = (e) => {
			this.disabled || (e.stopPropagation(), this.dispatchEvent(new CustomEvent("remove", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			})));
		}, this.handleKeyDown = (e) => {
			this.disabled || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.dispatchEvent(new CustomEvent("change", {
				detail: {
					value: this.value,
					selected: !this._selected
				},
				bubbles: !0,
				composed: !0
			})));
		};
		try {
			this.internals = this.attachInternals();
		} catch {
			this.internals = void 0;
		}
	}
	static {
		this.shadowRootOptions = {
			...h.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	static {
		this.formAssociated = !0;
	}
	get form() {
		return this.internals?.form;
	}
	connectedCallback() {
		super.connectedCallback();
	}
	updated(e) {
		super.updated?.(e), (e.has("value") || e.has("selected")) && this.internals?.setFormValue(this._selected ? this.value || "on" : null);
	}
	formResetCallback() {
		this._selected = this.hasAttribute("selected");
	}
	formDisabledCallback(e) {
		this.disabled = e;
	}
	render() {
		let e = {
			"inline-flex": !0,
			"items-center": !0,
			"gap-2": !0,
			"rounded-lg": !0,
			"h-8 px-4": !0,
			"cursor-pointer": !this.disabled,
			"transition-all": !0,
			"duration-200": !0,
			"select-none": !0,
			"text-sm": !0,
			"font-medium": !0,
			border: !0,
			relative: !0,
			"min-h-[32px]": !0,
			"bg-secondary-container": this._selected,
			"text-secondary-onContainer": this._selected,
			"border-secondary-container": this._selected,
			"bg-surface-container": !this._selected,
			"text-surface-on": !this._selected,
			"border-outline": !this._selected,
			"hover:brightness-95": this._selected && !this.disabled,
			"hover:bg-surface-containerHigh": !this._selected && !this.disabled,
			"active:brightness-90": !this.disabled,
			"focus-visible:outline": !this.disabled,
			"focus-visible:outline-2": !this.disabled,
			"focus-visible:outline-offset-2": !this.disabled,
			"focus-visible:outline-primary-default": !this.disabled,
			"shadow-md": this.elevated && !this.disabled,
			"hover:shadow-lg": this.elevated && !this.disabled,
			"opacity-[var(--schmancy-sys-state-disabled-opacity)]": this.disabled,
			"cursor-not-allowed": this.disabled
		};
		return _`
			<button
				${i({
			strength: 2,
			radius: 40
		})}
				class=${this.classMap(e)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				?disabled=${this.disabled}
				aria-pressed=${this._selected ? "true" : "false"}
				role="checkbox"
				tabindex="0"
			>
				<slot></slot>

				${this.removable ? _`
							<button
								class="ml-1 -mr-1 p-0.5 rounded-full hover:bg-surface-containerHighest transition-colors duration-200"
								@click=${this.handleRemove}
								aria-label="Remove filter"
								tabindex="-1"
							>
								<span class="material-symbols-outlined text-sm">close</span>
							</button>
						` : ""}
			</button>
		`;
	}
};
if (t([f({
	type: String,
	reflect: !0
})], b.prototype, "value", void 0), t([f({
	type: Boolean,
	reflect: !0
})], b.prototype, "selected", null), t([f({
	type: Boolean,
	reflect: !0
})], b.prototype, "removable", void 0), t([f({
	type: Boolean,
	reflect: !0
})], b.prototype, "disabled", void 0), t([f({
	type: Boolean,
	reflect: !0
})], b.prototype, "elevated", void 0), customElements.get("schmancy-filter-chip") || customElements.define("schmancy-filter-chip", b), !customElements.get("schmancy-chip")) {
	class e extends b {}
	customElements.define("schmancy-chip", e);
}
var x = class extends e(g`
	:host {
		display: inline-block;
		outline: none;
		min-width:fit-content
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(0, 0, 0, 0.08);
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* State layer for M3 hover/focus/pressed states */
	.state-layer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 200ms ease;
	}

	:host(:not([disabled])) button:hover .state-layer {
		opacity: 0.08;
	}

	:host(:not([disabled])) button:focus-visible .state-layer {
		opacity: 0.1;
	}

	:host(:not([disabled])) button:active .state-layer {
		opacity: 0.1;
	}
`) {
	constructor(...e) {
		super(...e), this.value = "", this.icon = "", this.href = "", this.target = "", this.disabled = !1, this.elevated = !1, this.hover$ = new a(!1), this.pressed$ = new a(!1), this.focused$ = new a(!1), this.ripples = [], this.nextRippleId = 0, this.handleClick = (e) => {
			if (this.disabled) return;
			let t = this.shadowRoot?.querySelector("button");
			if (t) {
				let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = this.nextRippleId++;
				this.ripples = [...this.ripples, {
					x: r,
					y: i,
					id: a
				}], setTimeout(() => {
					this.ripples = this.ripples.filter((e) => e.id !== a);
				}, 600);
			}
			this.href && (this.target === "_blank" ? window.open(this.href, "_blank") : window.location.href = this.href), this.dispatchEvent(new CustomEvent("action", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleKeyDown = (e) => {
			if (!this.disabled && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault(), this.pressed$.next(!0);
				let t = new MouseEvent("click", {
					bubbles: !0,
					cancelable: !0,
					clientX: 0,
					clientY: 0
				});
				this.handleClick(t), setTimeout(() => this.pressed$.next(!1), 100);
			}
		}, this.handleFocus = () => {
			this.focused$.next(!0);
		}, this.handleBlur = () => {
			this.focused$.next(!1);
		};
	}
	static {
		this.shadowRootOptions = {
			...h.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	connectedCallback() {
		super.connectedCallback(), o([
			this.hover$,
			this.pressed$,
			this.focused$
		]).pipe(l(this.disconnecting)).subscribe();
	}
	render() {
		let e = !!this.icon;
		return _`
			<button
				type="button"
				class=${u({
			relative: !0,
			"inline-flex": !0,
			"items-center": !0,
			"gap-2": !0,
			"h-8": !0,
			"min-h-[32px]": !0,
			"rounded-full": !0,
			"cursor-pointer": !this.disabled,
			"transition-all": !0,
			"duration-200": !0,
			"select-none": !0,
			"overflow-hidden": !0,
			border: !0,
			"pl-2": e,
			"pl-4": !e,
			"pr-4": !0,
			"bg-surface-containerLow": !0,
			"text-surface-onVariant": !0,
			"border-outline": !0,
			"focus-visible:outline": !this.disabled,
			"focus-visible:outline-2": !this.disabled,
			"focus-visible:outline-primary": !this.disabled,
			"focus-visible:outline-offset-2": !this.disabled,
			"opacity-38": this.disabled,
			"cursor-not-allowed": this.disabled
		})}
				?disabled=${this.disabled}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${() => this.hover$.next(!0)}
				@mouseleave=${() => this.hover$.next(!1)}
				@mousedown=${() => this.pressed$.next(!0)}
				@mouseup=${() => this.pressed$.next(!1)}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				tabindex=${this.disabled ? "-1" : "0"}
				role="button"
				aria-disabled=${this.disabled}
				aria-label=${this.value}
			>
				${this.icon ? _`
					<schmancy-icon class="text-[18px] shrink-0">${this.icon}</schmancy-icon>
				` : ""}
				<span class="text-sm font-medium leading-5">
					<slot></slot>
				</span>

				<!-- Ripple effects -->
				${this.ripples.map((e) => _`
					<span
						class="ripple"
						style="left: ${e.x}px; top: ${e.y}px;"
					></span>
				`)}

				<!-- State layer for M3 hover/focus/pressed states -->
				<div class="state-layer"></div>
			</button>
		`;
	}
};
t([f({ reflect: !0 })], x.prototype, "value", void 0), t([f({ reflect: !0 })], x.prototype, "icon", void 0), t([f({ reflect: !0 })], x.prototype, "href", void 0), t([f({ reflect: !0 })], x.prototype, "target", void 0), t([f({
	type: Boolean,
	reflect: !0
})], x.prototype, "disabled", void 0), t([f({
	type: Boolean,
	reflect: !0
})], x.prototype, "elevated", void 0), t([m()], x.prototype, "ripples", void 0), x = t([d("schmancy-suggestion-chip")], x);
export { b as n, v as r, x as t };
