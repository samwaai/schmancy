import { t as e } from "./tailwind.mixin-BCz3GEpw.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { t as n } from "./tslib.es6-vJQZBGJO.js";
import { classMap as r } from "lit/directives/class-map.js";
import { customElement as i, property as a, query as o, state as s } from "lit/decorators.js";
import { LitElement as c, css as l, html as u, isServer as d, nothing as f } from "lit";
import { when as p } from "lit/directives/when.js";
var m, h = Symbol("attachableController");
d || (m = new MutationObserver((e) => {
	for (let t of e) t.target[h]?.hostConnected();
}));
var g = class {
	get htmlFor() {
		return this.host.getAttribute("for");
	}
	set htmlFor(e) {
		e === null ? this.host.removeAttribute("for") : this.host.setAttribute("for", e);
	}
	get control() {
		return this.host.hasAttribute("for") ? this.htmlFor && this.host.isConnected ? this.host.getRootNode().querySelector(`#${this.htmlFor}`) : null : this.currentControl || this.host.parentElement;
	}
	set control(e) {
		e ? this.attach(e) : this.detach();
	}
	constructor(e, t) {
		this.host = e, this.onControlChange = t, this.currentControl = null, e.addController(this), e[h] = this, m?.observe(e, { attributeFilter: ["for"] });
	}
	attach(e) {
		e !== this.currentControl && (this.setCurrentControl(e), this.host.removeAttribute("for"));
	}
	detach() {
		this.setCurrentControl(null), this.host.setAttribute("for", "");
	}
	hostConnected() {
		this.setCurrentControl(this.control);
	}
	hostDisconnected() {
		this.setCurrentControl(null);
	}
	setCurrentControl(e) {
		this.onControlChange(this.currentControl, e), this.currentControl = e;
	}
}, _ = [
	"focusin",
	"focusout",
	"pointerdown"
], v = class extends c {
	constructor() {
		super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new g(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	handleEvent(e) {
		if (!e[y]) {
			switch (e.type) {
				default: return;
				case "focusin":
					this.visible = this.control?.matches(":focus-visible") ?? !1;
					break;
				case "focusout":
				case "pointerdown": this.visible = !1;
			}
			e[y] = !0;
		}
	}
	onControlChange(e, t) {
		if (!d) for (let n of _) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
	update(e) {
		e.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(e);
	}
};
n([a({
	type: Boolean,
	reflect: !0
})], v.prototype, "visible", void 0), n([a({
	type: Boolean,
	reflect: !0
})], v.prototype, "inward", void 0);
var y = Symbol("handledByFocusRing"), b = l`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`, x = class extends v {};
x.styles = [b], x = n([i("md-focus-ring")], x);
var S, C = "cubic-bezier(0.2, 0, 0, 1)";
(function(e) {
	e[e.INACTIVE = 0] = "INACTIVE", e[e.TOUCH_DELAY = 1] = "TOUCH_DELAY", e[e.HOLDING = 2] = "HOLDING", e[e.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(S ||= {});
var w = [
	"click",
	"contextmenu",
	"pointercancel",
	"pointerdown",
	"pointerenter",
	"pointerleave",
	"pointerup"
], T = d ? null : window.matchMedia("(forced-colors: active)"), E = class extends c {
	constructor() {
		super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = S.INACTIVE, this.attachableController = new g(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	render() {
		return u`<div class="surface ${r({
			hovered: this.hovered,
			pressed: this.pressed
		})}"></div>`;
	}
	update(e) {
		e.has("disabled") && this.disabled && (this.hovered = !1, this.pressed = !1), super.update(e);
	}
	handlePointerenter(e) {
		this.shouldReactToEvent(e) && (this.hovered = !0);
	}
	handlePointerleave(e) {
		this.shouldReactToEvent(e) && (this.hovered = !1, this.state !== S.INACTIVE && this.endPressAnimation());
	}
	handlePointerup(e) {
		if (this.shouldReactToEvent(e)) {
			if (this.state !== S.HOLDING) return this.state === S.TOUCH_DELAY ? (this.state = S.WAITING_FOR_CLICK, void this.startPressAnimation(this.rippleStartEvent)) : void 0;
			this.state = S.WAITING_FOR_CLICK;
		}
	}
	async handlePointerdown(e) {
		if (this.shouldReactToEvent(e)) {
			if (this.rippleStartEvent = e, !this.isTouch(e)) return this.state = S.WAITING_FOR_CLICK, void this.startPressAnimation(e);
			this.state = S.TOUCH_DELAY, await new Promise((e) => {
				setTimeout(e, 150);
			}), this.state === S.TOUCH_DELAY && (this.state = S.HOLDING, this.startPressAnimation(e));
		}
	}
	handleClick() {
		this.disabled || (this.state === S.WAITING_FOR_CLICK ? this.endPressAnimation() : this.state === S.INACTIVE && (this.startPressAnimation(), this.endPressAnimation()));
	}
	handlePointercancel(e) {
		this.shouldReactToEvent(e) && this.endPressAnimation();
	}
	handleContextmenu() {
		this.disabled || this.endPressAnimation();
	}
	determineRippleSize() {
		let { height: e, width: t } = this.getBoundingClientRect(), n = Math.max(e, t), r = Math.max(.35 * n, 75), i = this.currentCSSZoom ?? 1, a = Math.floor(.2 * n / i), o = Math.sqrt(t ** 2 + e ** 2) + 10;
		this.initialSize = a;
		let s = (o + r) / a;
		this.rippleScale = "" + s / i, this.rippleSize = `${a}px`;
	}
	getNormalizedPointerEventCoords(e) {
		let { scrollX: t, scrollY: n } = window, { left: r, top: i } = this.getBoundingClientRect(), a = t + r, o = n + i, { pageX: s, pageY: c } = e, l = this.currentCSSZoom ?? 1;
		return {
			x: (s - a) / l,
			y: (c - o) / l
		};
	}
	getTranslationCoordinates(e) {
		let { height: t, width: n } = this.getBoundingClientRect(), r = this.currentCSSZoom ?? 1, i = {
			x: (n / r - this.initialSize) / 2,
			y: (t / r - this.initialSize) / 2
		}, a;
		return a = e instanceof PointerEvent ? this.getNormalizedPointerEventCoords(e) : {
			x: n / r / 2,
			y: t / r / 2
		}, a = {
			x: a.x - this.initialSize / 2,
			y: a.y - this.initialSize / 2
		}, {
			startPoint: a,
			endPoint: i
		};
	}
	startPressAnimation(e) {
		if (!this.mdRoot) return;
		this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
		let { startPoint: t, endPoint: n } = this.getTranslationCoordinates(e), r = `${t.x}px, ${t.y}px`, i = `${n.x}px, ${n.y}px`;
		this.growAnimation = this.mdRoot.animate({
			top: [0, 0],
			left: [0, 0],
			height: [this.rippleSize, this.rippleSize],
			width: [this.rippleSize, this.rippleSize],
			transform: [`translate(${r}) scale(1)`, `translate(${i}) scale(${this.rippleScale})`]
		}, {
			pseudoElement: "::after",
			duration: 450,
			easing: C,
			fill: "forwards"
		});
	}
	async endPressAnimation() {
		this.rippleStartEvent = void 0, this.state = S.INACTIVE;
		let e = this.growAnimation, t = Infinity;
		typeof e?.currentTime == "number" ? t = e.currentTime : e?.currentTime && (t = e.currentTime.to("ms").value), t >= 225 ? this.pressed = !1 : (await new Promise((e) => {
			setTimeout(e, 225 - t);
		}), this.growAnimation === e && (this.pressed = !1));
	}
	shouldReactToEvent(e) {
		if (this.disabled || !e.isPrimary || this.rippleStartEvent && this.rippleStartEvent.pointerId !== e.pointerId) return !1;
		if (e.type === "pointerenter" || e.type === "pointerleave") return !this.isTouch(e);
		let t = e.buttons === 1;
		return this.isTouch(e) || t;
	}
	isTouch({ pointerType: e }) {
		return e === "touch";
	}
	async handleEvent(e) {
		if (!T?.matches) switch (e.type) {
			case "click":
				this.handleClick();
				break;
			case "contextmenu":
				this.handleContextmenu();
				break;
			case "pointercancel":
				this.handlePointercancel(e);
				break;
			case "pointerdown":
				await this.handlePointerdown(e);
				break;
			case "pointerenter":
				this.handlePointerenter(e);
				break;
			case "pointerleave":
				this.handlePointerleave(e);
				break;
			case "pointerup": this.handlePointerup(e);
		}
	}
	onControlChange(e, t) {
		if (!d) for (let n of w) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
};
n([a({
	type: Boolean,
	reflect: !0
})], E.prototype, "disabled", void 0), n([s()], E.prototype, "hovered", void 0), n([s()], E.prototype, "pressed", void 0), n([o(".surface")], E.prototype, "mdRoot", void 0);
var D = l`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`, O = class extends E {};
O.styles = [D], O = n([i("md-ripple")], O);
var k = /* @__PURE__ */ "role.ariaAtomic.ariaAutoComplete.ariaBusy.ariaChecked.ariaColCount.ariaColIndex.ariaColSpan.ariaCurrent.ariaDisabled.ariaExpanded.ariaHasPopup.ariaHidden.ariaInvalid.ariaKeyShortcuts.ariaLabel.ariaLevel.ariaLive.ariaModal.ariaMultiLine.ariaMultiSelectable.ariaOrientation.ariaPlaceholder.ariaPosInSet.ariaPressed.ariaReadOnly.ariaRequired.ariaRoleDescription.ariaRowCount.ariaRowIndex.ariaRowSpan.ariaSelected.ariaSetSize.ariaSort.ariaValueMax.ariaValueMin.ariaValueNow.ariaValueText".split("."), A = k.map(M);
function j(e) {
	return A.includes(e);
}
function M(e) {
	return e.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
var N = Symbol("privateIgnoreAttributeChangesFor");
function P(e) {
	return `data-${e}`;
}
function F(e) {
	return e.replace(/-\w/, (e) => e[1].toUpperCase());
}
function ee(e) {
	return e.currentTarget === e.target && e.composedPath()[0] === e.target && !e.target.disabled && !function(e) {
		let t = I;
		return t && (e.preventDefault(), e.stopImmediatePropagation()), async function() {
			I = !0, await null, I = !1;
		}(), t;
	}(e);
}
var I = !1, L = Symbol("internals"), R = Symbol("privateInternals"), z = Symbol("createValidator"), B = Symbol("getValidityAnchor"), V = Symbol("privateValidator"), H = Symbol("privateSyncValidity"), U = Symbol("privateCustomValidationMessage"), W = Symbol("getFormValue"), G = Symbol("getFormState"), K, q = class {
	constructor(e) {
		this.getCurrentState = e, this.currentValidity = {
			validity: {},
			validationMessage: ""
		};
	}
	getValidity() {
		let e = this.getCurrentState();
		if (this.prevState && this.equals(this.prevState, e)) return this.currentValidity;
		let { validity: t, validationMessage: n } = this.computeValidity(e);
		return this.prevState = this.copy(e), this.currentValidity = {
			validationMessage: n,
			validity: {
				badInput: t.badInput,
				customError: t.customError,
				patternMismatch: t.patternMismatch,
				rangeOverflow: t.rangeOverflow,
				rangeUnderflow: t.rangeUnderflow,
				stepMismatch: t.stepMismatch,
				tooLong: t.tooLong,
				tooShort: t.tooShort,
				typeMismatch: t.typeMismatch,
				valueMissing: t.valueMissing
			}
		}, this.currentValidity;
	}
}, J = class extends q {
	computeValidity(e) {
		return this.checkboxControl || (this.checkboxControl = document.createElement("input"), this.checkboxControl.type = "checkbox"), this.checkboxControl.checked = e.checked, this.checkboxControl.required = e.required, {
			validity: this.checkboxControl.validity,
			validationMessage: this.checkboxControl.validationMessage
		};
	}
	equals(e, t) {
		return e.checked === t.checked && e.required === t.required;
	}
	copy({ checked: e, required: t }) {
		return {
			checked: e,
			required: t
		};
	}
}, Y = function(e) {
	var t;
	if (d) return e;
	class n extends e {
		constructor() {
			super(...arguments), this[t] = /* @__PURE__ */ new Set();
		}
		attributeChangedCallback(e, t, n) {
			if (!j(e)) return void super.attributeChangedCallback(e, t, n);
			if (this[N].has(e)) return;
			this[N].add(e), this.removeAttribute(e), this[N].delete(e);
			let r = F(e);
			n === null ? delete this.dataset[r] : this.dataset[r] = n, this.requestUpdate(F(e), t);
		}
		getAttribute(e) {
			return j(e) ? super.getAttribute(P(e)) : super.getAttribute(e);
		}
		removeAttribute(e) {
			super.removeAttribute(e), j(e) && (super.removeAttribute(P(e)), this.requestUpdate());
		}
	}
	return t = N, function(e) {
		for (let t of k) {
			let n = M(t), r = P(n), i = F(n);
			e.createProperty(t, {
				attribute: n,
				noAccessor: !0
			}), e.createProperty(Symbol(r), {
				attribute: r,
				noAccessor: !0
			}), Object.defineProperty(e.prototype, t, {
				configurable: !0,
				enumerable: !0,
				get() {
					return this.dataset[i] ?? null;
				},
				set(e) {
					let n = this.dataset[i] ?? null;
					e !== n && (e === null ? delete this.dataset[i] : this.dataset[i] = e, this.requestUpdate(t, n));
				}
			});
		}
	}(n), n;
}(function(e) {
	var t;
	class n extends e {
		constructor() {
			super(...arguments), this[t] = "";
		}
		get validity() {
			return this[H](), this[L].validity;
		}
		get validationMessage() {
			return this[H](), this[L].validationMessage;
		}
		get willValidate() {
			return this[H](), this[L].willValidate;
		}
		checkValidity() {
			return this[H](), this[L].checkValidity();
		}
		reportValidity() {
			return this[H](), this[L].reportValidity();
		}
		setCustomValidity(e) {
			this[U] = e, this[H]();
		}
		requestUpdate(e, t, n) {
			super.requestUpdate(e, t, n), this[H]();
		}
		firstUpdated(e) {
			super.firstUpdated(e), this[H]();
		}
		[(t = U, H)]() {
			if (d) return;
			this[V] || (this[V] = this[z]());
			let { validity: e, validationMessage: t } = this[V].getValidity(), n = !!this[U], r = this[U] || t;
			this[L].setValidity({
				...e,
				customError: n
			}, r, this[B]() ?? void 0);
		}
		[z]() {
			throw Error("Implement [createValidator]");
		}
		[B]() {
			throw Error("Implement [getValidityAnchor]");
		}
	}
	return n;
}(function(e) {
	class t extends e {
		get form() {
			return this[L].form;
		}
		get labels() {
			return this[L].labels;
		}
		get name() {
			return this.getAttribute("name") ?? "";
		}
		set name(e) {
			this.setAttribute("name", e);
		}
		get disabled() {
			return this.hasAttribute("disabled");
		}
		set disabled(e) {
			this.toggleAttribute("disabled", e);
		}
		attributeChangedCallback(e, t, n) {
			if (e === "name" || e === "disabled") {
				let n = e === "disabled" ? t !== null : t;
				this.requestUpdate(e, n);
				return;
			}
			super.attributeChangedCallback(e, t, n);
		}
		requestUpdate(e, t, n) {
			super.requestUpdate(e, t, n), this[L].setFormValue(this[W](), this[G]());
		}
		[W]() {
			throw Error("Implement [getFormValue]");
		}
		[G]() {
			return this[W]();
		}
		formDisabledCallback(e) {
			this.disabled = e;
		}
	}
	return t.formAssociated = !0, n([a({ noAccessor: !0 })], t.prototype, "name", null), n([a({
		type: Boolean,
		noAccessor: !0
	})], t.prototype, "disabled", null), t;
}((K = c, class extends K {
	get [L]() {
		return this[R] || (this[R] = this.attachInternals()), this[R];
	}
})))), X = class extends Y {
	constructor() {
		super(), this.checked = !1, this.indeterminate = !1, this.required = !1, this.value = "on", this.prevChecked = !1, this.prevDisabled = !1, this.prevIndeterminate = !1, d || this.addEventListener("click", (e) => {
			ee(e) && this.input && (this.focus(), function(e) {
				let t = new MouseEvent("click", { bubbles: !0 });
				e.dispatchEvent(t);
			}(this.input));
		});
	}
	update(e) {
		(e.has("checked") || e.has("disabled") || e.has("indeterminate")) && (this.prevChecked = e.get("checked") ?? this.checked, this.prevDisabled = e.get("disabled") ?? this.disabled, this.prevIndeterminate = e.get("indeterminate") ?? this.indeterminate), super.update(e);
	}
	render() {
		let e = !this.prevChecked && !this.prevIndeterminate, t = this.prevChecked && !this.prevIndeterminate, n = this.prevIndeterminate, i = this.checked && !this.indeterminate, a = this.indeterminate, o = r({
			disabled: this.disabled,
			selected: i || a,
			unselected: !i && !a,
			checked: i,
			indeterminate: a,
			"prev-unselected": e,
			"prev-checked": t,
			"prev-indeterminate": n,
			"prev-disabled": this.prevDisabled
		}), { ariaLabel: s, ariaInvalid: c } = this;
		return u`
      <div class="container ${o}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${a ? "mixed" : f}
          aria-label=${s || f}
          aria-invalid=${c || f}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
	}
	handleInput(e) {
		let t = e.target;
		this.checked = t.checked, this.indeterminate = t.indeterminate;
	}
	handleChange(e) {
		(function(e, t) {
			!t.bubbles || e.shadowRoot && !t.composed || t.stopPropagation();
			let n = Reflect.construct(t.constructor, [t.type, t]);
			e.dispatchEvent(n) || t.preventDefault();
		})(this, e);
	}
	[W]() {
		return !this.checked || this.indeterminate ? null : this.value;
	}
	[G]() {
		return String(this.checked);
	}
	formResetCallback() {
		this.checked = this.hasAttribute("checked");
	}
	formStateRestoreCallback(e) {
		this.checked = e === "true";
	}
	[z]() {
		return new J(() => this);
	}
	[B]() {
		return this.input;
	}
};
X.shadowRootOptions = {
	...c.shadowRootOptions,
	delegatesFocus: !0
}, n([a({ type: Boolean })], X.prototype, "checked", void 0), n([a({ type: Boolean })], X.prototype, "indeterminate", void 0), n([a({ type: Boolean })], X.prototype, "required", void 0), n([a()], X.prototype, "value", void 0), n([s()], X.prototype, "prevChecked", void 0), n([s()], X.prototype, "prevDisabled", void 0), n([s()], X.prototype, "prevIndeterminate", void 0), n([o("input")], X.prototype, "input", void 0);
var Z = l`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`, Q = class extends X {};
Q.styles = [Z], Q = n([i("md-checkbox")], Q);
var $ = class extends e() {
	static {
		this.shadowRootOptions = {
			...c.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	static {
		this.formAssociated = !0;
	}
	constructor() {
		super(), this.value = !1, this.disabled = !1, this.required = !1, this.name = "checkbox-" + Math.random().toString(36), this.id = "checkbox-" + Math.random().toString(36), this.size = "md";
		try {
			this.internals = this.attachInternals();
		} catch {}
	}
	get form() {
		return this.internals?.form;
	}
	get checked() {
		return this.value;
	}
	set checked(e) {
		this.value = e;
	}
	connectedCallback() {
		super.connectedCallback(), this._syncFormValue();
	}
	updated(e) {
		super.updated?.(e), (e.has("value") || e.has("name")) && this._syncFormValue(), (e.has("required") || e.has("value")) && this._syncValidity(), e.has("value") && (this.value ? this.internals?.states.add("checked") : this.internals?.states.delete("checked"));
	}
	_syncFormValue() {
		this.internals?.setFormValue(this.value ? this.getAttribute("true-value") ?? "on" : null);
	}
	_syncValidity() {
		this.required && !this.value ? this.internals?.setValidity({ valueMissing: !0 }, "Please check this box if you want to proceed.") : this.internals?.setValidity({});
	}
	checkValidity() {
		return this.internals?.checkValidity() ?? !0;
	}
	reportValidity() {
		return this.internals?.reportValidity() ?? !0;
	}
	render() {
		return u`
			<label class="grid grid-flow-col items-center space-x-2 w-fit">
				<md-checkbox
					.required=${this.required}
					.disabled=${this.disabled}
					?checked=${!0 === this.value}
					@change=${(e) => {
			this.value = e.target.checked, this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value } }));
		}}
				>
				</md-checkbox>
				${p(this.label, () => u`<span>${this.label}</span>`, () => u`<slot></slot>`)}
			</label>
		`;
	}
};
t([a({
	type: Boolean,
	reflect: !0
})], $.prototype, "value", void 0), t([a({ type: Boolean })], $.prototype, "checked", null), t([a({ type: Boolean })], $.prototype, "disabled", void 0), t([a({ type: Boolean })], $.prototype, "required", void 0), t([a({ type: String })], $.prototype, "name", void 0), t([a({ type: String })], $.prototype, "id", void 0), t([a({ type: String })], $.prototype, "label", void 0), t([a({ type: String })], $.prototype, "size", void 0), $ = t([i("schmancy-checkbox")], $);
export { $ as t };
