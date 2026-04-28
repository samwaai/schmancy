import { t as e } from "./tailwind.mixin-mdQR3BEO.js";
import { t } from "./decorate-D_utPUsC.js";
import { FormFieldMixin as n } from "./mixins.js";
import { Subject as r, fromEvent as i, takeUntil as a } from "rxjs";
import { customElement as o, property as s } from "lit/decorators.js";
import { html as c } from "lit";
import { when as l } from "lit/directives/when.js";
var u = class extends n(e(":host{display:inherit;position:inherit}")) {
	constructor(...e) {
		super(...e), this.label = "", this.name = "", this.value = "", this.options = [], this.required = !1, this.selection$ = new r();
	}
	connectedCallback() {
		super.connectedCallback(), this.selection$.pipe(a(this.disconnecting)).subscribe((e) => {
			this.value = e, this.emitChange({ value: e }), this.updateChildRadioButtons();
		}), i(this, "radio-button-click").pipe(a(this.disconnecting)).subscribe((e) => {
			this.selection$.next(e.detail.value);
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.selection$?.complete();
	}
	handleSelection(e) {
		this.selection$.next(e);
	}
	updateChildRadioButtons() {
		this.querySelectorAll("schmancy-radio-button").forEach((e) => {
			e.getAttribute("value") === this.value ? e.setAttribute("checked", "") : e.removeAttribute("checked");
		});
	}
	updated(e) {
		super.updated(e), e.has("value") && this.updateChildRadioButtons();
	}
	render() {
		let e = this.childElementCount > 0;
		return c`
			<div class="grid gap-4">
				${l(this.label, () => c` <label class="text-base font-semibold text-surface-on">${this.label}</label> `)}
				
				${e ? c`<slot></slot>` : this.options?.map((e) => c`
						<div class="flex items-center">
							<input
								.required=${this.required}
								id=${e.value}
								class="h-4 w-4 border-outline text-primary-default focus:ring-primary-default"
								type="radio"
								name=${this.name}
								.value=${e.value}
								.checked=${e.value === this.value}
								@change=${() => this.handleSelection(e.value)}
							/>
							<label for=${e.value} class="ml-3 block text-sm font-medium leading-6 text-surface-on">
								${e.label || e.value}
							</label>
						</div>
					`)}
			</div>
		`;
	}
};
t([s({ type: String })], u.prototype, "label", void 0), t([s({ type: String })], u.prototype, "name", void 0), t([s({ type: String })], u.prototype, "value", void 0), t([s({ type: Array })], u.prototype, "options", void 0), t([s({ type: Boolean })], u.prototype, "required", void 0), u = t([o("schmancy-radio-group")], u);
var d = class extends n(e()) {
	constructor(...e) {
		super(...e), this.value = "", this.checked = !1, this.disabled = !1, this.name = "";
	}
	connectedCallback() {
		super.connectedCallback(), i(this, "click").pipe(a(this.disconnecting)).subscribe(this.handleClick);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}
	handleClick() {
		if (!this.disabled) if (this.closest("schmancy-radio-group")) {
			let e = new CustomEvent("radio-button-click", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			});
			this.dispatchEvent(e);
		} else this.checked = !0, this.emitChange({ value: this.value });
	}
	render() {
		return c`
			<label class="relative flex items-start cursor-pointer">
				<div class="flex items-center h-6">
					<input
						type="radio"
						class="h-4 w-4 text-primary-default focus:ring-primary-container border-outline"
						.value=${this.value}
						.checked=${this.checked}
						.disabled=${this.disabled}
						.name=${this.name}
						@change=${() => {}}
					/>
				</div>
				<div class="ml-3">
					<slot name="label"></slot>
				</div>
			</label>
		`;
	}
};
t([s({ type: String })], d.prototype, "value", void 0), t([s({
	type: Boolean,
	reflect: !0
})], d.prototype, "checked", void 0), t([s({ type: Boolean })], d.prototype, "disabled", void 0), t([s({ type: String })], d.prototype, "name", void 0), d = t([o("schmancy-radio-button")], d);
export { u as n, d as t };
