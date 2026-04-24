import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { color as n } from "./directives.js";
import { t as r } from "./theme.interface-Buged9Cg.js";
import { BehaviorSubject as i, Subject as a, combineLatest as o, fromEvent as s, takeUntil as c } from "rxjs";
import { tap as l, withLatestFrom as u } from "rxjs/operators";
import { classMap as d } from "lit/directives/class-map.js";
import { customElement as f, property as p, query as m, queryAssignedElements as h, state as g } from "lit/decorators.js";
import { css as _, html as v } from "lit";
import { autoUpdate as y, computePosition as b, flip as x, offset as S, shift as C } from "@floating-ui/dom";
var w = class extends t(_`
	:host {
		display: block;
		position: relative;
	}

	[role='listbox'] {
		overflow-y: auto;
		outline: none;
	}
`) {
	static {
		this.formAssociated = !0;
	}
	get value() {
		return this.multi ? this._selectedValues$.value : this._selectedValue$.value;
	}
	set value(e) {
		if (this.multi) {
			let t = Array.isArray(e) ? e : e ? String(e).split(",").map((e) => e.trim()).filter(Boolean) : [];
			this._selectedValues$.next(t);
		} else this._selectedValue$.next(e == null ? "" : String(e));
	}
	get values() {
		return [...this._selectedValues$.value];
	}
	set values(e) {
		this._selectedValues$.next(Array.isArray(e) ? [...e] : []);
	}
	constructor() {
		super(), this.required = !1, this.disabled = !1, this.placeholder = "", this.multi = !1, this.label = "", this.hint = "", this.validateOn = "touched", this.size = "md", this.isOpen = !1, this.valueLabel = "", this.isValid = !0, this.validationMessage = "", this.defaultValue = "", this._options$ = new i([]), this._selectedValue$ = new i(""), this._selectedValues$ = new i([]), this._optionSelect$ = new a(), this._userInteracted = !1, this._touched = !1, this._dirty = !1, this._submitted = !1, this._focusedOptionId = "", this.formSubmitHandler = () => {
			this._submitted = !0, this.checkValidity();
		}, this.formResetHandler = () => {
			this.reset();
		}, this.handleKeyDown = (e) => {
			if (this.disabled) return;
			if (!this.isOpen) return void ([
				"Enter",
				" ",
				"ArrowDown"
			].includes(e.key) && (e.preventDefault(), this.openDropdown(!1)));
			let t = Array.from(this.options || []), n = t.findIndex((e) => e.id === this._focusedOptionId) ?? -1;
			switch (e.key) {
				case "Escape":
					e.preventDefault(), this.closeDropdown();
					break;
				case "ArrowDown":
					e.preventDefault(), this.focusOption(t, Math.min(n + 1, t.length - 1));
					break;
				case "ArrowUp":
					e.preventDefault(), this.focusOption(t, Math.max(n - 1, 0));
					break;
				case "Home":
					e.preventDefault(), this.focusOption(t, 0);
					break;
				case "End":
					e.preventDefault(), this.focusOption(t, t.length - 1);
					break;
				case "Enter":
				case " ":
					if (e.preventDefault(), this._focusedOptionId) {
						let e = t.find((e) => e.id === this._focusedOptionId);
						e && this.handleOptionSelect(e.value);
					}
					break;
				case "Tab": this.closeDropdown();
			}
		};
		try {
			this.internals = this.attachInternals();
		} catch {}
	}
	get form() {
		return this.internals?.form;
	}
	connectedCallback() {
		super.connectedCallback(), this.id ||= `schmancy-select-${Math.random().toString(36).substring(2, 9)}`, this.defaultValue = this.value, s(this, "keydown").pipe(c(this.disconnecting)).subscribe(this.handleKeyDown), this._setupReactivePipelines(), this.internals?.form && (s(this.internals.form, "submit").pipe(c(this.disconnecting)).subscribe(this.formSubmitHandler), s(this.internals.form, "reset").pipe(c(this.disconnecting)).subscribe(this.formResetHandler));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.cleanupPositioner?.();
	}
	firstUpdated() {
		this.syncSelection(), this.setupOptionsAccessibility(), this.inputRef && (this.inputRef.error = !1);
	}
	updated(e) {
		if (super.updated(e), e.has("value")) {
			let e = this.multi ? this._selectedValues$.value.join(",") : this._selectedValue$.value;
			this.internals?.setFormValue(e), this.hasUpdated && (this._dirty = !0), this.hasUpdated && this.checkValidity();
		}
		e.has("isOpen") && (this.isOpen ? this.positionDropdown() : this.cleanupPositioner?.());
	}
	shouldShowValidation(e = !1) {
		if (e) return !0;
		switch (this.validateOn) {
			case "always": return !0;
			case "touched":
			default: return this._touched;
			case "dirty": return this._dirty;
			case "submitted": return this._submitted;
		}
	}
	syncSelection() {
		if (this.multi) {
			let e = this._selectedValues$.value;
			this.options?.forEach((t) => t.selected = e.includes(t.value)), this.valueLabel = e.length > 0 && this.options?.filter((t) => e.includes(t.value)).map((e) => e.label || e.textContent || "").join(", ") || this.placeholder;
		} else {
			let e = this._selectedValue$.value;
			this.options?.forEach((t) => {
				t.selected = t.value === e;
			});
			let t = this.options?.find((t) => t.value === e);
			this.valueLabel = t ? t.label || t.textContent || "" : this.placeholder;
		}
	}
	setupOptionsAccessibility() {
		this.options?.forEach((e, t) => {
			e.setAttribute("role", "option"), e.id ||= `${this.id}-option-${t}`, e.tabIndex = -1, e.setAttribute("aria-selected", String(this.multi ? this._selectedValues$.value.includes(e.value) : e.value === this._selectedValue$.value));
		});
	}
	async positionDropdown() {
		let e = this.renderRoot.querySelector(".trigger");
		e && this.ul && (this.cleanupPositioner = y(e, this.ul, async () => {
			let t = window.innerHeight, n = e.getBoundingClientRect(), r = t - n.bottom, i = n.top, a = Math.max(.75 * Math.max(r, i), 150), o = r < 200 && i > r;
			this.ul.style.maxHeight = `${a}px`;
			let { x: s, y: c } = await b(e, this.ul, {
				placement: o ? "top-start" : "bottom-start",
				middleware: [
					S(5),
					x(),
					C({ padding: 5 })
				]
			});
			Object.assign(this.ul.style, {
				left: `${s}px`,
				top: `${c}px`,
				position: "absolute",
				width: `${e.offsetWidth}px`
			});
		}));
	}
	focusOption(e, t) {
		let n = e[t];
		if (n) {
			n.focus(), this._focusedOptionId = n.id;
			let e = this.renderRoot.querySelector(".trigger");
			if (e && e.setAttribute("aria-activedescendant", n.id), this.ul && n.offsetTop !== void 0) {
				let e = n.offsetTop, t = n.offsetHeight, r = this.ul.scrollTop, i = this.ul.clientHeight;
				e < r ? this.ul.scrollTop = e : e + t > r + i && (this.ul.scrollTop = e + t - i);
			}
		}
	}
	async openDropdown(e = !1) {
		if (this.disabled) return;
		this.isOpen = !0, await this.updateComplete;
		let t = Array.from(this.options || []), n = this.multi ? 0 : t.findIndex((e) => e.value === this._selectedValue$.value);
		this.focusOption(t, Math.max(n, 0)), e && this.reportValidity();
	}
	closeDropdown() {
		this._userInteracted && (this._touched = !0), this.isOpen = !1, this._focusedOptionId = "";
		let e = this.renderRoot.querySelector(".trigger");
		e && (e.removeAttribute("aria-activedescendant"), e?.focus()), this._userInteracted && this.shouldShowValidation() && this.checkValidity();
	}
	_setupReactivePipelines() {
		s(this, "option-select").pipe(l((e) => {
			e.stopPropagation();
			let t = this.options.find((t) => t.value === e.detail.value);
			t && this._optionSelect$.next(t);
		}), c(this.disconnecting)).subscribe(), this._optionSelect$.pipe(u(this._selectedValue$, this._selectedValues$), l(([e, t, n]) => {
			if (this._userInteracted = !0, this._touched = !0, this._dirty = !0, this.multi) {
				let t = n.indexOf(e.value), r = t > -1 ? [...n.slice(0, t), ...n.slice(t + 1)] : [...n, e.value];
				this._selectedValues$.next(r), this.internals?.setFormValue(r.join(",")), this.valueLabel = r.length > 0 ? this.options.filter((e) => r.includes(e.value)).map((e) => e.label || e.textContent || "").join(", ") : this.placeholder;
			} else this._selectedValue$.next(e.value), this.internals?.setFormValue(e.value), this.valueLabel = e.label || e.textContent || this.placeholder, this.closeDropdown();
			this.setupOptionsAccessibility(), this._fireChangeEvent();
		}), c(this.disconnecting)).subscribe(), this._options$.pipe(l((e) => {
			e.forEach((e, t) => {
				e.setAttribute("role", "option"), e.tabIndex = -1, e.id ||= `${this.id}-option-${t}`, e.hasAttribute("data-event-bound") || (s(e, "click").pipe(l((e) => {
					e.stopPropagation();
				}), c(this.disconnecting)).subscribe(() => this._optionSelect$.next(e)), e.setAttribute("data-event-bound", "true"));
			});
		}), c(this.disconnecting)).subscribe(), o([
			this._selectedValue$,
			this._selectedValues$,
			this._options$
		]).pipe(l(([e, t, n]) => {
			n.length !== 0 && (this.multi ? n.forEach((e) => {
				e.selected = t.includes(e.value);
			}) : n.forEach((t) => {
				t.selected = t.value === e;
			}));
		}), c(this.disconnecting)).subscribe();
	}
	handleOptionSelect(e) {
		let t = this.options.find((t) => t.value === e);
		t && this._optionSelect$.next(t);
	}
	_fireChangeEvent() {
		let e = this.multi ? this._selectedValues$.value : this._selectedValue$.value;
		this.dispatchEvent(new CustomEvent("change", {
			detail: { value: e },
			bubbles: !0,
			composed: !0
		})), this.checkValidity();
	}
	checkValidity() {
		if (this.disabled) return !0;
		let e = this.multi ? this._selectedValues$.value.length === 0 : !this._selectedValue$.value, t = !(this.required && e);
		if (this.isValid = t, this.isValid ? (this.validationMessage = "", this.internals?.setValidity({})) : (this.validationMessage = "Please select an option.", this.internals?.setValidity({ valueMissing: !0 }, "Please select an option.", this.inputRef)), this.inputRef && this.hasUpdated) {
			let e = !this.isValid && this.shouldShowValidation();
			this.inputRef.error = e, this.inputRef.hint = e ? this.validationMessage : this.hint;
		}
		return this.isValid;
	}
	reportValidity() {
		let e = this.checkValidity();
		return this.inputRef && (this.inputRef.error = !e, this.inputRef.hint = e ? this.hint : this.validationMessage, e || this.isOpen || this.openDropdown(!1), e || this.inputRef.reportValidity()), e;
	}
	setCustomValidity(e) {
		this.validationMessage = e, e ? (this.isValid = !1, this.internals?.setValidity({ customError: !0 }, e, this.inputRef)) : (this.isValid = !0, this.internals?.setValidity({})), this.inputRef && this.shouldShowValidation() && (this.inputRef.error = !this.isValid, this.inputRef.hint = this.isValid ? this.hint : this.validationMessage);
	}
	reset() {
		this.value = this.defaultValue, this.valueLabel = this.placeholder, this.isValid = !0, this.validationMessage = "", this._touched = !1, this._dirty = !1, this._submitted = !1, this._userInteracted = !1, this.internals?.setValidity({}), this.inputRef && (this.inputRef.error = !1, this.inputRef.hint = this.hint);
	}
	render() {
		let e = !this.isValid && this.shouldShowValidation() && !this.isOpen, t = this.isOpen ? v`<span class="absolute right-3 top-1/2 transform -translate-y-1/2">▲</span>` : v`<span class="absolute right-3 top-1/2 transform -translate-y-1/2">▼</span>`;
		return v`
			<div class="relative ${this.disabled ? "opacity-60 cursor-not-allowed" : ""}">
				<sch-input
					.name=${this.name}
					tabIndex=${this.disabled ? "-1" : "0"}
					class="trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded=${this.isOpen}
					aria-controls="options"
					aria-autocomplete="none"
					aria-required=${this.required}
					aria-activedescendant=${this._focusedOptionId || void 0}
					aria-disabled=${this.disabled}
					.label=${this.label}
					.placeholder=${this.placeholder}
					.value=${this.valueLabel}
					.required=${this.required}
					.disabled=${this.disabled}
					.hint=${e ? this.validationMessage : this.hint}
					.error=${e}
					.validateOn=${this.validateOn}
					.size=${this.size}
					readonly
					clickable
					@click=${(e) => {
			if (this.disabled) return e.preventDefault(), void e.stopPropagation();
			this.isOpen ? (this._userInteracted = !0, this.closeDropdown()) : this.openDropdown(!1);
		}}
				>
					${t}
				</sch-input>

				<!-- Overlay for capturing clicks outside when dropdown is open -->
				${this.isOpen ? v` <div class="fixed inset-0 z-10" @click=${this.closeDropdown} tabindex="-1" aria-hidden="true"></div> ` : ""}

				<ul
					id="options"
					role="listbox"
					aria-multiselectable=${this.multi}
					class=${d({
			"absolute min-w-full w-full z-20 mt-1 rounded-md shadow-lg": !0,
			hidden: !this.isOpen
		})}
					${n({
			bgColor: r.sys.color.surface.low,
			color: r.sys.color.surface.on
		})}
				>
					<slot
						@slotchange=${() => {
			this._options$.next(this.options), this.syncSelection();
		}}
					></slot>
				</ul>
			</div>
		`;
	}
};
e([p({ type: String })], w.prototype, "name", void 0), e([p({
	type: Boolean,
	reflect: !0
})], w.prototype, "required", void 0), e([p({
	type: Boolean,
	reflect: !0
})], w.prototype, "disabled", void 0), e([p({ type: String })], w.prototype, "placeholder", void 0), e([p({
	type: String,
	reflect: !0
})], w.prototype, "value", null), e([p({ type: Array })], w.prototype, "values", null), e([p({ type: Boolean })], w.prototype, "multi", void 0), e([p({ type: String })], w.prototype, "label", void 0), e([p({ type: String })], w.prototype, "hint", void 0), e([p({ type: String })], w.prototype, "validateOn", void 0), e([p({ type: String })], w.prototype, "size", void 0), e([g()], w.prototype, "isOpen", void 0), e([g()], w.prototype, "valueLabel", void 0), e([g()], w.prototype, "isValid", void 0), e([p({ type: String })], w.prototype, "validationMessage", void 0), e([g()], w.prototype, "defaultValue", void 0), e([m("ul")], w.prototype, "ul", void 0), e([m("sch-input")], w.prototype, "inputRef", void 0), e([h({ flatten: !0 })], w.prototype, "options", void 0), e([g()], w.prototype, "_userInteracted", void 0), e([g()], w.prototype, "_touched", void 0), e([g()], w.prototype, "_dirty", void 0), e([g()], w.prototype, "_submitted", void 0), e([g()], w.prototype, "_focusedOptionId", void 0), w = e([f("schmancy-select")], w);
export { w as t };
