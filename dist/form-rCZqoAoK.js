import { t as e } from "./decorate-D_utPUsC.js";
import { customElement as t } from "lit/decorators.js";
var n = class extends HTMLElement {
	constructor(...e) {
		super(...e), this._form = null, this._wrapped = !1, this._internals = (() => {
			try {
				return this.attachInternals();
			} catch {
				return;
			}
		})(), this._onSubmit = (e) => {
			if (e.preventDefault(), e.stopPropagation(), this.novalidate || this._form.reportValidity()) {
				this._internals?.states.delete("invalid"), this._internals?.states.add("submitting");
				try {
					this.dispatchEvent(new CustomEvent("submit", { detail: new FormData(this._form) }));
				} finally {
					this._internals?.states.delete("submitting");
				}
			} else this._internals?.states.add("invalid");
		}, this._onReset = (e) => {
			e.stopPropagation(), this._internals?.states.delete("invalid"), this.dispatchEvent(new CustomEvent("reset"));
		};
	}
	static {
		this.tagName = "schmancy-form";
	}
	get novalidate() {
		return this.hasAttribute("novalidate");
	}
	set novalidate(e) {
		e ? this.setAttribute("novalidate", "") : this.removeAttribute("novalidate");
	}
	connectedCallback() {
		this.ensureForm();
	}
	disconnectedCallback() {
		this._form && (this._form.removeEventListener("submit", this._onSubmit), this._form.removeEventListener("reset", this._onReset));
	}
	ensureForm() {
		if (this._wrapped) return;
		let e = Array.from(this.children).find((e) => e instanceof HTMLFormElement), t = e ?? document.createElement("form");
		if (t.noValidate = !0, !e) {
			let e = Array.from(this.childNodes);
			for (let n of e) t.appendChild(n);
			this.appendChild(t);
		}
		t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), this._form = t, this._wrapped = !0;
	}
	submit() {
		return !!this._form && !(!this.novalidate && !this._form.reportValidity()) && (this._form.requestSubmit(), !0);
	}
	reset() {
		this._form?.reset();
	}
	reportValidity() {
		return this._form?.reportValidity() ?? !0;
	}
	checkValidity() {
		return this._form?.checkValidity() ?? !0;
	}
	getFormData() {
		return this._form ? new FormData(this._form) : new FormData();
	}
	get form() {
		return this._form;
	}
}, r = n = e([t("schmancy-form")], n);
export { r as t };
