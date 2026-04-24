import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { distinctUntilChanged as n, filter as r, fromEvent as i, map as a } from "rxjs";
import { customElement as o, property as s, query as c } from "lit/decorators.js";
import { LitElement as l, html as u, nothing as d } from "lit";
import { createRef as f, ref as p } from "lit/directives/ref.js";
import { when as m } from "lit/directives/when.js";
import { ifDefined as h } from "lit/directives/if-defined.js";
var g = class extends e(":host{width:-webkit-fill-available;display:block;border:unset!important;line-height:unset!important;background:unset!important;padding:unset!important;font-size:unset!important;box-shadow:unset!important}:host([fillHeight]){flex-direction:column;height:100%;display:flex}:host:focus{box-shadow:unset!important}textarea:focus-visible{outline:none!important}textarea{font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;-webkit-text-decoration:inherit;text-decoration:inherit;text-indent:inherit;text-shadow:inherit;text-overflow:inherit;text-rendering:inherit;text-size-adjust:inherit;text-align-last:inherit;overflow-y:auto}@keyframes onAutoFillStart{}textarea:-webkit-autofill{animation-name:onAutoFillStart}") {
	static {
		this.shadowRootOptions = {
			...l.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	static {
		this.formAssociated = !0;
	}
	constructor() {
		super(), this.textareaRef = f(), this._a11yId = `schmancy-textarea-${Math.random().toString(36).slice(2, 10)}`, this.label = "", this.name = "name_" + Date.now(), this.placeholder = "", this.value = "", this.cols = 20, this.fillHeight = !1, this.autoHeight = !0, this.resize = "vertical", this.wrap = "soft", this.required = !1, this.disabled = !1, this.readonly = !1, this.spellcheck = !1, this.align = "left", this.tabIndex = 0, this.error = !1;
		try {
			this.internals = this.attachInternals();
		} catch {
			this.internals = void 0;
		}
	}
	willUpdate(e) {
		super.willUpdate?.(e), (e.has("value") || e.has("name")) && this.internals?.setFormValue(this.value ?? ""), (e.has("required") || e.has("value")) && (this.required && !this.value ? this.internals?.setValidity({ valueMissing: !0 }, "Please fill out this field.") : this.internals?.setValidity({}));
	}
	formResetCallback() {
		this.value = this.getAttribute("value") ?? "", this.error = !1;
	}
	formDisabledCallback(e) {
		this.disabled = e;
	}
	firstUpdated() {
		this.autofocus && this.focus(), this.autoHeight && setTimeout(() => this.adjustHeight(), 0), i(this.textareaElement, "input").pipe(a((e) => e.target.value), n()).subscribe((e) => {
			this.value = e, this.autoHeight && this.adjustHeight(), this.dispatchEvent(new CustomEvent("change", {
				detail: { value: e },
				bubbles: !0,
				composed: !0
			}));
		}), i(this.textareaElement, "change").pipe(a((e) => e.target.value), n()).subscribe((e) => {
			this.value = e, this.autoHeight && this.adjustHeight(), this.dispatchEvent(new CustomEvent("change", {
				detail: { value: e },
				bubbles: !0,
				composed: !0
			}));
		}), i(this.textareaElement, "keyup").pipe(r((e) => e.key === "Enter"), a((e) => e.target.value), n()).subscribe((e) => {
			this.value = e, this.dispatchEvent(new CustomEvent("change", {
				detail: { value: e },
				bubbles: !0,
				composed: !0
			})), this.dispatchEvent(new CustomEvent("enter", {
				detail: { value: e },
				bubbles: !0,
				composed: !0
			}));
		});
	}
	get form() {
		return this.internals?.form;
	}
	reportValidity() {
		return this.textareaRef.value?.reportValidity();
	}
	checkValidity() {
		return this.textareaRef.value?.checkValidity();
	}
	setCustomValidity(e) {
		return this.textareaRef.value?.setCustomValidity(e);
	}
	select() {
		return this.textareaRef.value?.select();
	}
	setSelectionRange(e, t, n) {
		this.textareaRef.value?.setSelectionRange(e, t, n);
	}
	get selectionStart() {
		return this.textareaRef.value?.selectionStart ?? null;
	}
	get selectionEnd() {
		return this.textareaRef.value?.selectionEnd ?? null;
	}
	get selectionDirection() {
		return this.textareaRef.value?.selectionDirection ?? null;
	}
	setRangeText(e) {
		this.textareaRef.value?.setRangeText(e);
	}
	adjustHeight() {
		let e = this.textareaRef.value;
		if (e) {
			let t = e.offsetHeight, n = e.scrollHeight;
			n > t && (e.style.height = n + "px");
		}
	}
	validity() {
		return this.textareaRef.value?.validity;
	}
	focus(e = { preventScroll: !0 }) {
		this.textareaRef.value?.focus(e), this.dispatchEvent(new Event("focus"));
	}
	click() {
		this.textareaRef.value?.click(), this.dispatchEvent(new Event("click"));
	}
	blur() {
		this.textareaRef.value?.blur(), this.dispatchEvent(new Event("blur"));
	}
	render() {
		let e = {
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
			"text-left": this.align === "left",
			"text-center": this.align === "center",
			"text-right": this.align === "right",
			"h-full": this.fillHeight,
			"resize-none": this.resize === "none",
			"resize-y": this.resize === "vertical",
			"resize-x": this.resize === "horizontal",
			resize: this.resize === "both",
			"px-4 py-3": !0
		}, t = this.rows == null ? "field-sizing: content;" : "", n = {
			"block mb-1 font-medium text-sm": !0,
			"opacity-40": this.disabled,
			"text-primary-default": !this.error,
			"text-error-default": this.error
		}, r = {
			"w-full min-w-0": !0,
			"flex flex-col h-full": this.fillHeight
		}, i = `${this._a11yId}-hint`;
		return u`
		<div class="${this.classMap(r)}">
			${m(this.label, () => u`
					<label class="${this.classMap(n)}" for=${this.id}>
						${this.label}
					</label>
				`)}

			<textarea
				${p(this.textareaRef)}
				.value=${this.value}
				.id=${this.id}
				.name=${this.name}
				.placeholder=${this.placeholder}
				.required=${this.required}
				class=${this.classMap(e)}
				style=${t}
				.disabled=${this.disabled}
				minlength=${h(this.minlength)}
				maxlength=${h(this.maxlength)}
				.readonly=${this.readonly}
				.spellcheck=${this.spellcheck}
				cols=${h(this.cols)}
				rows=${h(this.rows)}
				wrap=${h(this.wrap)}
				dirname=${h(this.dirname)}
				aria-invalid=${this.error ? "true" : "false"}
				aria-required=${this.required ? "true" : "false"}
				aria-describedby=${this.hint ? i : d}
				aria-label=${!this.label && this.placeholder ? this.placeholder : d}
			></textarea>

			${m(this.hint, () => u`
					<div id=${i} class="mt-1 text-sm ${this.error ? "text-error-default" : "text-surface-onVariant"}">
						${this.hint}
					</div>
				`)}
		</div>
		`;
	}
};
t([s()], g.prototype, "label", void 0), t([s()], g.prototype, "name", void 0), t([s()], g.prototype, "placeholder", void 0), t([s({
	type: String,
	reflect: !0
})], g.prototype, "value", void 0), t([s({ type: Number })], g.prototype, "minlength", void 0), t([s({ type: Number })], g.prototype, "maxlength", void 0), t([s({ type: Number })], g.prototype, "cols", void 0), t([s({ type: Number })], g.prototype, "rows", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "fillHeight", void 0), t([s({ type: Boolean })], g.prototype, "autoHeight", void 0), t([s({
	type: String,
	reflect: !0
})], g.prototype, "resize", void 0), t([s({ type: String })], g.prototype, "wrap", void 0), t([s({ type: String })], g.prototype, "dirname", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "required", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "disabled", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "readonly", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "spellcheck", void 0), t([s({
	type: String,
	reflect: !0
})], g.prototype, "align", void 0), t([s({ type: Boolean })], g.prototype, "autofocus", void 0), t([s({ type: Number })], g.prototype, "tabIndex", void 0), t([c("textarea")], g.prototype, "textareaElement", void 0), t([s()], g.prototype, "hint", void 0), t([s({
	type: Boolean,
	reflect: !0
})], g.prototype, "error", void 0), g = t([o("schmancy-textarea")], g);
