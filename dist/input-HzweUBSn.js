import { t as e } from "./decorate-D_utPUsC.js";
import { SchmancyFormField as t } from "./mixins.js";
import { distinctUntilChanged as n, filter as r, fromEvent as i, map as a, takeUntil as o } from "rxjs";
import { customElement as s, property as c, query as l, state as u } from "lit/decorators.js";
import { LitElement as d, html as f, nothing as p } from "lit";
import { createRef as m, ref as h } from "lit/directives/ref.js";
import { when as g } from "lit/directives/when.js";
import { ifDefined as _ } from "lit/directives/if-defined.js";
var v, y = class extends t("/*! tailwindcss v4.2.2 | MIT License | https://tailwindcss.com */\n:host{width:100%;min-width:calc(var(--spacing,.25rem) * 0);box-sizing:border-box;max-width:100%;display:block}.date-input-container{width:100%;min-width:0;width:100%!important;max-width:100%!important}input{appearance:none;border-radius:8px;width:-webkit-fill-available;font-size:16px;transition:box-shadow .3s cubic-bezier(.34,1.56,.64,1),border-color .2s}input:focus{box-shadow:0 0 0 1px var(--schmancy-sys-color-secondary-default), 0 0 16px -4px var(--schmancy-sys-color-secondary-default)}@supports (color:color-mix(in lab, red, red)){input:focus{box-shadow:0 0 0 1px var(--schmancy-sys-color-secondary-default), 0 0 16px -4px color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 20%, transparent)}}input[aria-invalid=true]{box-shadow:0 0 12px -4px var(--schmancy-sys-color-error-default)}@supports (color:color-mix(in lab, red, red)){input[aria-invalid=true]{box-shadow:0 0 12px -4px color-mix(in srgb, var(--schmancy-sys-color-error-default) 15%, transparent)}}input[aria-invalid=true]:focus{box-shadow:0 0 0 1px var(--schmancy-sys-color-error-default), 0 0 16px -4px var(--schmancy-sys-color-error-default)}@supports (color:color-mix(in lab, red, red)){input[aria-invalid=true]:focus{box-shadow:0 0 0 1px var(--schmancy-sys-color-error-default), 0 0 16px -4px color-mix(in srgb, var(--schmancy-sys-color-error-default) 25%, transparent)}}@media (prefers-reduced-motion:reduce){input{transition:none}}input[type=number]::-webkit-inner-spin-button{appearance:none;margin:calc(var(--spacing,.25rem) * 0)}input[type=number]::-webkit-outer-spin-button{appearance:none;margin:calc(var(--spacing,.25rem) * 0)}input[type=number]{appearance:textfield}input:-webkit-autofill{animation-name:onAutoFillStart;-webkit-box-shadow:0 0 0 30px var(--schmancy-sys-color-surface-highest) inset!important;-webkit-text-fill-color:var(--schmancy-sys-color-surface-on)!important}input:autofill{background-color:var(--schmancy-sys-color-surface-highest)!important;color:var(--schmancy-sys-color-surface-on)!important}input[type=date],input[type=datetime-local],input[type=time],input[type=month],input[type=week]{appearance:none;width:100%;line-height:inherit;border-radius:8px;min-width:100%;max-width:100%;margin:0;display:block;overflow:hidden;border-radius:8px!important;width:100%!important}input::-webkit-datetime-edit{align-items:center;width:100%;height:100%;margin:0;padding:0;display:flex}input::-webkit-datetime-edit-fields-wrapper{align-items:center;width:100%;height:100%;margin:0;padding:0;display:flex}input::-webkit-datetime-edit{flex:1;width:100%}input::-webkit-datetime-edit-fields-wrapper{flex:1;justify-content:space-between;width:100%}input::-webkit-datetime-edit-text{align-items:center;display:flex}input::-webkit-datetime-edit-day-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-month-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-year-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-hour-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-minute-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-second-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-millisecond-field{flex-shrink:0;padding:0 2px}input::-webkit-datetime-edit-meridiem-field{flex-shrink:0;padding:0 2px}input[type=date]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}input[type=datetime-local]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}input[type=time]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}input[type=month]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}input[type=week]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}@-moz-document url-prefix(){input[type=date],input[type=datetime-local],input[type=time]{min-height:inherit}}@supports (-webkit-touch-callout:none){input[type=date],input[type=datetime-local],input[type=time],input[type=month],input[type=week]{appearance:none;border-radius:0;width:-webkit-fill-available!important;width:fill-available!important;padding-left:12px!important;padding-right:12px!important}input::-webkit-datetime-edit{width:100%!important;padding-left:0!important;padding-right:0!important}input::-webkit-datetime-edit-fields-wrapper{width:100%!important;margin:0!important;padding:0!important}}") {
	static {
		v = this;
	}
	constructor(...e) {
		super(...e), this.value = "", this.type = "text", this.placeholder = "", this.clickable = !1, this.spellcheck = !1, this.align = "left", this.step = "any", this.autofocus = !1, this.autocomplete = "on", this.tabIndex = 0, this.size = "md", this.validateOn = "touched", this.inputRef = m(), this.isAutofilled = !1, this.touched = !1, this.dirty = !1, this.submitted = !1, this.defaultValue = "";
	}
	static {
		this._idCounter = 0;
	}
	static {
		this.shadowRootOptions = {
			...d.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	willUpdate(e) {
		this.id ||= "sch-input-" + v._idCounter++, super.willUpdate(e);
	}
	updated(e) {
		super.updated(e), e.has("value") && (this.value !== this.defaultValue && (this.dirty = !0), this.validateInput()), !this.hasUpdated && e.has("value") && (this.defaultValue = this.value);
	}
	connectedCallback() {
		super.connectedCallback(), this.defaultValue = this.value, this.setupFormIntegration(), this.setupExternalLabelAssociation();
	}
	setupFormIntegration() {
		this.form && (this.formResetObserver = new MutationObserver((e) => {
			for (let t of e) t.type === "attributes" && t.attributeName === "reset" && this.resetToDefault();
		}), this.formResetObserver.observe(this.form, {
			attributes: !0,
			childList: !1,
			subtree: !1
		}), i(this.form, "reset").pipe(o(this.disconnecting)).subscribe(() => {
			this.resetToDefault();
		}), i(this.form, "submit").pipe(o(this.disconnecting)).subscribe(() => {
			this.submitted = !0, this.validateInput(!0);
		}));
	}
	setupExternalLabelAssociation() {
		if (this.id) {
			let e = () => {
				document.querySelectorAll(`label[for="${this.id}"]`).forEach((e) => {
					i(e, "click").pipe(o(this.disconnecting)).subscribe(() => {
						this.focus();
					});
				});
			};
			document.readyState === "complete" ? e() : i(document, "DOMContentLoaded").pipe(o(this.disconnecting)).subscribe(e);
		}
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.formResetObserver && this.formResetObserver.disconnect();
	}
	resetToDefault() {
		this.value = this.defaultValue, this.touched = !1, this.dirty = !1, this.submitted = !1, this.error = !1, this.validationMessage = "", this.dispatchEvent(new CustomEvent("reset", { bubbles: !0 }));
	}
	shouldShowValidation(e = !1) {
		if (e) return !0;
		switch (this.validateOn) {
			case "always": return !0;
			case "touched":
			default: return this.touched;
			case "dirty": return this.dirty;
			case "submitted": return this.submitted;
		}
	}
	validateInput(e = !1) {
		if (this.disabled) return;
		let t = this.shouldShowValidation(e), n = this.inputElement?.validity ?? {
			badInput: !1,
			customError: !1,
			patternMismatch: !1,
			rangeOverflow: !1,
			rangeUnderflow: !1,
			stepMismatch: !1,
			tooLong: !1,
			tooShort: !1,
			typeMismatch: !1,
			valid: !0,
			valueMissing: !1
		}, r = !n.valid && !n.customError;
		t && r ? (this.error = !0, this.validationMessage = this.inputElement?.validationMessage || "") : n.valid ? (this.error = !1, n.customError || (this.validationMessage = "")) : t || (this.error = !1);
	}
	checkValidity() {
		let e = this.inputRef.value?.checkValidity() ?? !0, t = super.checkValidity();
		return e && t;
	}
	reportValidity() {
		this.touched = !0, this.submitted = !0;
		let e = this.inputRef.value?.reportValidity() ?? !0;
		this.validateInput(!0);
		let t = super.reportValidity();
		return e && t;
	}
	setCustomValidity(e) {
		this.inputRef.value && this.inputRef.value.setCustomValidity(e), super.setCustomValidity(e), this.error = e !== "" && this.shouldShowValidation();
	}
	firstUpdated() {
		this.autofocus && setTimeout(() => {
			this.focus();
		}, 0), this.setupInputEvents(), this.setupFocusBlurEvents(), this.setupAutofillDetection(), this.setupEnterKeyEvents();
	}
	setupInputEvents() {
		i(this.inputElement, "input").pipe(a((e) => {
			e.stopPropagation();
			let t = e;
			return {
				value: e.target.value,
				inputType: t.inputType,
				data: t.data,
				isComposing: t.isComposing,
				originalEvent: e
			};
		}), o(this.disconnecting)).subscribe((e) => {
			this.value = e.value, this.dirty = this.value !== this.defaultValue;
			let t = new CustomEvent("input", {
				detail: { value: e.value },
				bubbles: !0,
				composed: !0
			});
			Object.defineProperties(t, {
				inputType: { value: e.inputType },
				data: { value: e.data },
				isComposing: { value: e.isComposing }
			}), this.dispatchEvent(t), this.validateInput();
		}), i(this.inputElement, "change").pipe(a((e) => (e.stopPropagation(), e.target.value)), n(), o(this.disconnecting)).subscribe((e) => {
			this.value = e, this.dirty = this.value !== this.defaultValue, this.emitChange({ value: e }), this.validateInput();
		});
	}
	setupFocusBlurEvents() {
		i(this.inputElement, "focus").pipe(o(this.disconnecting)).subscribe((e) => {
			let t = new CustomEvent("focus", {
				bubbles: e.bubbles,
				cancelable: e.cancelable,
				composed: e.composed
			});
			Object.defineProperties(t, { relatedTarget: { value: e.relatedTarget } }), this.dispatchEvent(t);
		}), i(this.inputElement, "blur").pipe(o(this.disconnecting)).subscribe((e) => {
			this.touched = !0, this.disabled || this.validateInput();
			let t = new CustomEvent("blur", {
				bubbles: e.bubbles,
				cancelable: e.cancelable,
				composed: e.composed
			});
			Object.defineProperties(t, { relatedTarget: { value: e.relatedTarget } }), this.dispatchEvent(t);
		});
	}
	setupAutofillDetection() {
		i(this.inputElement, "animationstart").pipe(r((e) => e.animationName === "onAutoFillStart"), o(this.disconnecting)).subscribe((e) => {
			let { value: t } = e.target;
			this.value = t, this.isAutofilled = !0, this.dirty = this.value !== this.defaultValue, this.dispatchEvent(new CustomEvent("autofill", {
				detail: { value: t },
				bubbles: !0,
				composed: !0
			})), this.emitChange({ value: t });
		}), i(this.inputElement, "animationstart").pipe(r((e) => e.animationName === "onAutoFillCancel"), o(this.disconnecting)).subscribe(() => {
			this.isAutofilled = !1;
		});
	}
	setupEnterKeyEvents() {
		i(this.inputElement, "keydown").pipe(r((e) => e.key === "Enter"), o(this.disconnecting)).subscribe((e) => {
			let { value: t } = e.target;
			this.value !== t && (this.value = t, this.dirty = this.value !== this.defaultValue), this.inputElement.blur();
			let n = new CustomEvent("enter", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			});
			Object.defineProperties(n, {
				key: { value: "Enter" },
				code: { value: "Enter" },
				keyCode: { value: 13 },
				which: { value: 13 }
			}), this.dispatchEvent(n);
		});
	}
	select() {
		return this.inputRef.value?.select();
	}
	getValidity() {
		return this.inputRef.value?.validity;
	}
	setSelectionRange(e, t, n) {
		this.inputRef.value?.setSelectionRange(e, t, n);
	}
	get selectionStart() {
		return this.inputRef.value?.selectionStart ?? null;
	}
	get selectionEnd() {
		return this.inputRef.value?.selectionEnd ?? null;
	}
	get selectionDirection() {
		return this.inputRef.value?.selectionDirection ?? null;
	}
	setRangeText(e, t, n, r) {
		t !== void 0 && n !== void 0 ? this.inputRef.value?.setRangeText(e, t, n, r) : this.inputRef.value?.setRangeText(e);
	}
	focus(e) {
		this.inputRef.value?.focus(e), this.dispatchEvent(new Event("focus"));
	}
	click() {
		this.inputRef.value?.click(), this.dispatchEvent(new Event("click"));
	}
	blur() {
		this.inputRef.value?.blur(), this.dispatchEvent(new Event("blur"));
	}
	render() {
		let { height: e, padding: t, fontSize: n } = (() => {
			switch (this.size) {
				case "xxs": return {
					height: "24px",
					padding: "0 8px",
					fontSize: "0.625rem"
				};
				case "xs": return {
					height: "32px",
					padding: "0 12px",
					fontSize: "0.75rem"
				};
				case "sm": return {
					height: "40px",
					padding: "0 16px",
					fontSize: "0.875rem"
				};
				case "lg": return {
					height: "56px",
					padding: "0 20px",
					fontSize: "1rem"
				};
				default: return {
					height: "48px",
					padding: "0 16px",
					fontSize: "0.875rem"
				};
			}
		})(), r = [
			"date",
			"datetime-local",
			"time",
			"month",
			"week"
		].includes(this.type), i = {
			"block w-full min-w-0 rounded-2xl border bg-surface-containerLowest text-surface-on": !0,
			"border-outline": !this.error,
			"border-error-default": this.error,
			"outline-secondary-default focus:outline-1 focus:border-secondary-default": !0,
			"disabled:opacity-40 disabled:cursor-not-allowed": !0,
			"placeholder:text-muted": !0,
			"ring-0 focus:ring-1 focus:ring-inset": !0,
			"focus:ring-secondary-default": !this.error,
			"focus:ring-error-default": this.error,
			"caret-transparent focus:outline-hidden cursor-pointer select-none": this.readonly,
			"cursor-pointer": this.clickable,
			"text-left": this.align === "left" || r,
			"text-center": this.align === "center" && !r,
			"text-right": this.align === "right" && !r,
			autofilled: this.isAutofilled
		}, a = {
			"block mb-1 font-medium": !0,
			"opacity-40": this.disabled,
			"text-[10px]": this.size === "xxs",
			"text-xs": this.size === "xs",
			"text-sm": this.size === "sm",
			"text-base": this.size === "md",
			"text-lg": this.size === "lg",
			"text-primary-default": !this.error,
			"text-error-default": this.error
		}, o = {
			height: e,
			padding: t,
			fontSize: n,
			lineHeight: e
		};
		return f`
			<div class="w-full min-w-0 ${r ? "date-input-container" : ""}">
				${g(this.label, () => f`
						<label
							for=${this.id}
							class=${this.classMap(a)}
						>
							${this.label}
						</label>
					`)}

				<input
					${h(this.inputRef)}
					id=${this.id}
					name=${this.name}
					class=${this.classMap(i)}
					style=${this.styleMap(o)}
					.value=${this.value}
					.type=${this.type}
					.autocomplete=${this.autocomplete}
					.spellcheck=${this.spellcheck}
					placeholder=${this.placeholder}
					inputmode=${_(this.inputmode)}
					pattern=${_(this.pattern)}
					.step=${this.step ?? ""}
					minlength=${_(this.minlength)}
					maxlength=${_(this.maxlength)}
					min=${_(this.min)}
					max=${_(this.max)}
					list=${_(this.list)}
					?required=${this.required}
					?disabled=${this.disabled}
					?readonly=${this.readonly}
					aria-invalid=${this.error ? "true" : "false"}
					aria-required=${this.required ? "true" : "false"}
					aria-labelledby=${this.label ? `label-${this.id}` : p}
					aria-describedby=${this.hint || this.validationMessage ? `hint-${this.id}` : p}
					aria-label=${_(this.label ? void 0 : this.placeholder || "Input")}
				/>

				${g(this.hint || this.error && this.validationMessage, () => f`
						<div
							id="hint-${this.id}"
							class="mt-1 text-sm ${this.error ? "text-error-default" : "text-surface-onVariant"}"
						>
							${this.error && this.validationMessage ? this.validationMessage : this.hint}
						</div>
					`)}
			</div>
		`;
	}
};
e([c({
	type: String,
	reflect: !0
})], y.prototype, "value", void 0), e([c({ reflect: !0 })], y.prototype, "type", void 0), e([c()], y.prototype, "placeholder", void 0), e([c({
	type: String,
	reflect: !0
})], y.prototype, "pattern", void 0), e([c({
	type: Boolean,
	reflect: !0
})], y.prototype, "clickable", void 0), e([c({
	type: Boolean,
	reflect: !0
})], y.prototype, "spellcheck", void 0), e([c({
	type: String,
	reflect: !0
})], y.prototype, "align", void 0), e([c()], y.prototype, "inputmode", void 0), e([c({
	type: Number,
	reflect: !0
})], y.prototype, "minlength", void 0), e([c({ type: Number })], y.prototype, "maxlength", void 0), e([c()], y.prototype, "min", void 0), e([c()], y.prototype, "max", void 0), e([c({ reflect: !0 })], y.prototype, "step", void 0), e([c({ type: Boolean })], y.prototype, "autofocus", void 0), e([c({
	type: String,
	reflect: !0
})], y.prototype, "autocomplete", void 0), e([c({
	type: Number,
	reflect: !0
})], y.prototype, "tabIndex", void 0), e([c({
	type: String,
	reflect: !0
})], y.prototype, "size", void 0), e([c({ type: String })], y.prototype, "validateOn", void 0), e([c({ type: String })], y.prototype, "list", void 0), e([l("input")], y.prototype, "inputElement", void 0), e([u()], y.prototype, "isAutofilled", void 0), e([u()], y.prototype, "touched", void 0), e([u()], y.prototype, "dirty", void 0), e([u()], y.prototype, "submitted", void 0), e([u()], y.prototype, "defaultValue", void 0);
var b = y = v = e([s("schmancy-input")], y), x = class extends y {};
x = e([s("sch-input")], x);
export { b as n, x as t };
