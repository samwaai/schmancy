import { c as e, d as t, f as n, l as r, m as i, n as a, p as o, r as s, t as c, u as l } from "./tailwind.mixin-DIEGVcl3.js";
import { t as u } from "./decorate-D_utPUsC.js";
import { t as d } from "./litElement.mixin-BuZ28ZzP.js";
import { t as f } from "./surface.mixin-DqMwoddO.js";
import { property as p } from "lit/decorators.js";
var m = Symbol.for("schmancy.form-field");
function h(e) {
	return !!e && typeof e == "object" && !0 === e.constructor?.[m];
}
function g(e) {
	class t extends e {
		static {
			this.formAssociated = !0;
		}
		static {
			this[m] = !0;
		}
		constructor(...e) {
			super(...e), this._defaultValue = void 0, this.name = "", this.value = "", this.label = "", this.required = !1, this.disabled = !1, this.readonly = !1, this.error = !1, this.validationMessage = "", this.id = `schmancy-field-${Date.now()}-${Math.floor(1e3 * Math.random())}`;
			try {
				this.internals = this.attachInternals();
			} catch {
				this.internals = void 0;
			}
		}
		get form() {
			return this.internals?.form ?? null;
		}
		firstUpdated(e) {
			super.firstUpdated?.(e), this._defaultValue === void 0 && (this._defaultValue = this.value);
		}
		willUpdate(e) {
			super.willUpdate(e), e.has("value") && this.internals?.setFormValue(this.value), (e.has("error") || e.has("validationMessage")) && (this.error && this.validationMessage ? this.internals?.setValidity({ customError: !0 }, this.validationMessage) : this.internals?.setValidity({})), e.has("error") && (this.error ? this.internals?.states.add("invalid") : this.internals?.states.delete("invalid")), e.has("required") && (this.required ? this.internals?.states.add("required") : this.internals?.states.delete("required")), e.has("disabled") && (this.disabled ? this.internals?.states.add("disabled") : this.internals?.states.delete("disabled")), e.has("readonly") && (this.readonly ? this.internals?.states.add("readonly") : this.internals?.states.delete("readonly"));
		}
		formResetCallback() {
			this.resetForm();
		}
		formDisabledCallback(e) {
			this.disabled = e;
		}
		formStateRestoreCallback(e) {
			e != null && (this.value = e);
		}
		resetForm() {
			this.value = this._defaultValue ?? "", this.error = !1, this.validationMessage = "", this.internals?.setValidity({});
		}
		toFormEntries() {
			if (!this.name || this.disabled) return [];
			let e = this.value;
			return e == null || e === "" ? [] : Array.isArray(e) ? e.map((e) => [this.name, String(e)]) : typeof e == "boolean" ? e ? [[this.name, "on"]] : [] : [[this.name, String(e)]];
		}
		checkValidity() {
			return !!this.disabled || (!this.required || this.value !== "" && this.value !== void 0 && this.value !== null ? this.internals?.checkValidity() ?? !0 : (this.error = !0, this.validationMessage = "This field is required", !1));
		}
		reportValidity() {
			let e = this.checkValidity();
			return e || this.internals?.reportValidity(), e;
		}
		setCustomValidity(e) {
			this.validationMessage = e, this.error = e !== "", e ? this.internals?.setValidity({ customError: !0 }, e) : this.internals?.setValidity({});
		}
		emitChange(e) {
			"dispatchScopedEvent" in this && typeof this.dispatchScopedEvent == "function" ? this.dispatchScopedEvent("change", e, { bubbles: !0 }) : this.dispatchEvent(new CustomEvent("change", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		}
	}
	return u([p({ type: String })], t.prototype, "name", void 0), u([p({ reflect: !0 })], t.prototype, "value", void 0), u([p({ type: String })], t.prototype, "label", void 0), u([p({
		type: Boolean,
		reflect: !0
	})], t.prototype, "required", void 0), u([p({
		type: Boolean,
		reflect: !0
	})], t.prototype, "disabled", void 0), u([p({
		type: Boolean,
		reflect: !0
	})], t.prototype, "readonly", void 0), u([p({
		type: Boolean,
		reflect: !0
	})], t.prototype, "error", void 0), u([p({ type: String })], t.prototype, "validationMessage", void 0), u([p({ type: String })], t.prototype, "hint", void 0), u([p({ reflect: !0 })], t.prototype, "id", void 0), t;
}
function _(e) {
	return g(c(e));
}
export { d as $LitElement, s as BaseElement, e as DISCOVER_EVENT, r as DISCOVER_RESPONSE_EVENT, g as FormFieldMixin, m as SCHMANCY_FORM_FIELD, _ as SchmancyFormField, f as SurfaceMixin, c as TailwindElement, l as discover, t as discoverAllElements, n as discoverAnyComponent, o as discoverComponent, i as discoverElement, h as isSchmancyFormField, a as tailwindStyles };
