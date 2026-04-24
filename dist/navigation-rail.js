import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { BehaviorSubject as n, fromEvent as r, merge as i, takeUntil as a } from "rxjs";
import { delay as o, distinctUntilChanged as s, tap as c } from "rxjs/operators";
import { customElement as l, property as u, queryAssignedElements as d, state as f } from "lit/decorators.js";
import { html as p } from "lit";
import { when as m } from "lit/directives/when.js";
var h = class extends t() {
	constructor(...e) {
		super(...e), this.hovering$ = new n(!1), this.pressing$ = new n(!1), this.active$ = new n(!1), this.icon = "", this.label = "", this.value = "", this.badge = "", this.badgeVariant = "error", this.showLabel = !1, this.disabled = !1, this.nested = !1, this.group = !1, this.showRipple = !1;
	}
	get active() {
		return this.active$.value;
	}
	set active(e) {
		this.active$.next(e);
	}
	get selected() {
		return this.active;
	}
	set selected(e) {
		this.active = e;
	}
	connectedCallback() {
		super.connectedCallback(), i(r(this, "mouseenter").pipe(c(() => this.hovering$.next(!0))), r(this, "mouseleave").pipe(c(() => this.hovering$.next(!1)))).pipe(a(this.disconnecting)).subscribe(), i(r(this, "mousedown").pipe(c(() => this.pressing$.next(!0))), r(this, "mouseup").pipe(c(() => this.pressing$.next(!1))), r(this, "mouseleave").pipe(c(() => this.pressing$.next(!1)))).pipe(a(this.disconnecting)).subscribe(), this.pressing$.pipe(c((e) => {
			e && !this.disabled && (this.showRipple = !0);
		}), o(600), c(() => this.showRipple = !1), a(this.disconnecting)).subscribe(), this.active$.pipe(s(), c((e) => {
			this.requestUpdate(), this.setAttribute("aria-selected", String(e)), this.setAttribute("tabindex", e ? "0" : "-1");
		}), a(this.disconnecting)).subscribe(), this.setAttribute("role", "listitem"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", this.active ? "0" : "-1");
	}
	updated(e) {
		super.updated(e), e.has("disabled") && this.setAttribute("aria-disabled", String(this.disabled)), e.has("label") && this.setAttribute("aria-label", this.label);
	}
	handleClick(e) {
		if (this.disabled) return e.preventDefault(), void e.stopPropagation();
		this.dispatchEvent(new CustomEvent("navigate", {
			detail: this.value || this.label,
			bubbles: !0,
			composed: !0
		}));
	}
	handleKeyDown(e) {
		this.disabled || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.click());
	}
	render() {
		let e = !!this.querySelector("[slot=\"icon\"]"), t = this.querySelector("[slot=\"badge\"]"), n = this.classMap({
			"flex flex-col items-center justify-center": !0,
			"min-h-14 w-full": !0,
			"py-3": !0,
			"gap-1": !0,
			"rounded-lg": !0,
			"cursor-pointer": !0,
			relative: !0,
			"select-none": !0,
			"box-border": !0,
			"text-surface-onVariant": !this.active,
			"text-secondary-onContainer": this.active,
			"hover:bg-surface-containerHighest": !0,
			"transition-all duration-150 ease-out": !0,
			"pointer-events-none opacity-38": this.disabled,
			"[&>.ripple]:scale-100": this.showRipple,
			"min-h-12 pl-8": this.nested,
			"mb-2 after:absolute after:bottom-[-4px] after:left-3 after:right-3 after:h-px after:bg-outline-variant after:opacity-12": this.group
		}), r = this.classMap({
			"flex items-center justify-center": !0,
			"w-auto min-w-14 h-8": !0,
			"shrink-0 relative z-10": !0
		}), i = this.classMap({
			"absolute top-1/2 left-1/2 opacity-30": !0,
			"w-14 h-8": !0,
			"rounded-lg": !0,
			"bg-secondary-container": !0,
			"transition-transform duration-150 ease-out": !0,
			"scale-0 -translate-x-1/2 -translate-y-1/2": !this.active,
			"scale-100 -translate-x-1/2 -translate-y-1/2": this.active
		}), a = this.classMap({
			"relative z-100": !0,
			"text-2xl leading-none": !this.nested,
			"text-xl leading-none": this.nested
		}), o = this.classMap({
			"text-xs font-medium leading-4": !0,
			"text-center": !0,
			"overflow-hidden text-ellipsis whitespace-nowrap": !0,
			"z-10 max-w-14 px-1": !0,
			hidden: !this.showLabel && !this.label
		}), s = this.classMap({
			"absolute top-2 right-3": !0,
			"min-w-4 h-4": !0,
			"rounded-sm": !0,
			"text-xs font-semibold": !0,
			"flex items-center justify-center": !0,
			"px-1 box-border z-20": !0,
			"animate-pulse": !0,
			"bg-error-default text-error-on": this.badgeVariant === "error",
			"bg-primary-default text-primary-on": this.badgeVariant === "primary",
			"bg-secondary-default text-secondary-on": this.badgeVariant === "secondary"
		}), c = this.classMap({
			"absolute inset-0 rounded-lg overflow-hidden z-0": !0,
			"before:content-[\"\"] before:absolute before:top-1/2 before:left-1/2": !0,
			"before:w-0 before:h-0 before:rounded-full": !0,
			"before:bg-current before:opacity-0": !0,
			"before:-translate-x-1/2 before:-translate-y-1/2": !0,
			"before:transition-all before:duration-300": !0,
			"before:w-[200%] before:h-[200%] before:opacity-12": this.showRipple
		});
		return p`
			<div
				class=${n}
				part="container"
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				style="outline: ${this.matches(":focus-visible") ? "2px solid var(--schmancy-sys-color-primary-default)" : "none"}; outline-offset: 2px;"
			>
				<span class=${c} aria-hidden="true"></span>

				<div class=${r} part="icon">
					<span class=${i} part="indicator" aria-hidden="true"></span>
					${m(e, () => p`<slot class="relative" name="icon"></slot>`, () => m(this.icon, () => p`
									<span
										class=${a}
										part="icon-text"
										style="font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' ${this.active ? "1" : "0"}, 'wght' 400, 'GRAD' 0, 'opsz' ${this.nested ? "20" : "24"};"
									>
										${this.icon}
									</span>
								`))}
				</div>

				${m(this.label, () => p`<span class=${o} part="label">${this.label}</span>`)}
				${m(this.badge, () => p`
						${m(t, () => p`<slot name="badge"></slot>`, () => p`
								<span class=${s} part="badge" aria-label="${this.badge} notifications"> ${this.badge} </span>
							`)}
					`)}

				<!-- Tooltip shown via title attribute -->
				${m(this.hasAttribute("title"), () => p`
						<div
							class="
							absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2
							bg-surface-inverse text-surface-inverseOn
							px-2 py-1 rounded-sm text-xs whitespace-nowrap
							z-1000 pointer-events-none opacity-0
							hover:opacity-100 hover:translate-x-0
							transition-all duration-150 ease-out
							-translate-x-1
						"
							aria-hidden="true"
						>
							${this.getAttribute("title")}
						</div>
					`)}
			</div>
		`;
	}
};
e([u({ type: String })], h.prototype, "icon", void 0), e([u({ type: String })], h.prototype, "label", void 0), e([u({ type: String })], h.prototype, "value", void 0), e([u({
	type: Boolean,
	reflect: !0
})], h.prototype, "active", null), e([u({
	type: Boolean,
	reflect: !0
})], h.prototype, "selected", null), e([u({ type: String })], h.prototype, "badge", void 0), e([u({ type: String })], h.prototype, "badgeVariant", void 0), e([u({
	type: Boolean,
	attribute: "show-label"
})], h.prototype, "showLabel", void 0), e([u({
	type: Boolean,
	reflect: !0
})], h.prototype, "disabled", void 0), e([u({
	type: Boolean,
	reflect: !0
})], h.prototype, "nested", void 0), e([u({
	type: Boolean,
	reflect: !0
})], h.prototype, "group", void 0), e([f()], h.prototype, "showRipple", void 0), h = e([l("schmancy-navigation-rail-item")], h);
var g = class extends t() {
	constructor(...e) {
		super(...e), this.activeIndex$ = new n(-1), this._activeValue = "", this.labelVisibility = "all", this.alignment = "top", this.showTooltips = !0, this.keyboardNavigation = !0, this.expanded = !1, this.focusedIndex = -1, this.hasHeaderContent = !1, this.isFullscreen = !1;
	}
	get activeIndex() {
		return this.activeIndex$.value;
	}
	set activeIndex(e) {
		this.activeIndex$.next(e);
	}
	get activeValue() {
		return this._activeValue;
	}
	set activeValue(e) {
		this._activeValue = e, this.updateActiveByValue(e);
	}
	get navigationItems() {
		return this.allElements.filter((e) => e.tagName === "SCHMANCY-NAVIGATION-RAIL-ITEM");
	}
	connectedCallback() {
		super.connectedCallback(), this.keyboardNavigation && this.addEventListener("keydown", this.handleKeyDown), this.activeIndex$.pipe(s(), c((e) => this.updateActiveStates(e)), a(this.disconnecting)).subscribe(), r(window, "fullscreen").pipe(c((e) => {
			let t = e;
			this.isFullscreen = t.detail;
		}), a(this.disconnecting)).subscribe(), this.setupNavigateListener(), this.updateLabelVisibility(), this.setAttribute("role", "navigation"), this.setAttribute("aria-label", "Main navigation");
	}
	updated(e) {
		super.updated(e), e.has("labelVisibility") && this.updateLabelVisibility(), e.has("activeValue") && this.updateActiveByValue(this.activeValue), e.has("expanded") && this.updateLabelVisibility();
	}
	updateActiveStates(e) {
		this.navigationItems.forEach((t, n) => {
			let r = n === e;
			t.active = r, t.setAttribute("aria-selected", String(r)), t.setAttribute("tabindex", r ? "0" : "-1"), r && (this._activeValue = t.value || t.label || "");
		});
	}
	updateActiveByValue(e) {
		let t = this.navigationItems.findIndex((t) => t.getAttribute("value") === e || t.label === e);
		t >= 0 && (this.activeIndex = t);
	}
	updateLabelVisibility() {
		this.navigationItems.forEach((e, t) => {
			let n = !1;
			n = !!this.expanded || this.labelVisibility === "all" || this.labelVisibility === "selected" && t === this.activeIndex, e.showLabel = n, this.showTooltips && !n && !this.expanded && e.label ? e.setAttribute("title", e.label) : e.removeAttribute("title");
		});
	}
	expand() {
		this.expanded = !0;
	}
	collapse() {
		this.expanded = !1;
	}
	addBoatItem(e) {
		let t = this.querySelector(`[value="${e.id}"]`);
		if (t) return t;
		let n = document.createElement("schmancy-navigation-rail-item");
		n.setAttribute("value", e.id), n.innerHTML = `\n\t\t\t<schmancy-icon slot="icon">${e.icon || "widgets"}</schmancy-icon>\n\t\t\t${e.title}\n\t\t`;
		let r = this.querySelector("[slot=\"footer\"]");
		return r ? this.insertBefore(n, r) : this.appendChild(n), n;
	}
	toggle() {
		this.expanded = !this.expanded;
	}
	handleKeyDown(e) {
		let t = this.navigationItems;
		if (t.length === 0) return;
		let n = this.focusedIndex >= 0 ? this.focusedIndex : this.activeIndex;
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), n = (n + 1) % t.length;
				break;
			case "ArrowUp":
				e.preventDefault(), n = n <= 0 ? t.length - 1 : n - 1;
				break;
			case "Home":
				e.preventDefault(), n = 0;
				break;
			case "End":
				e.preventDefault(), n = t.length - 1;
				break;
			case "Enter":
			case " ":
				e.preventDefault(), n >= 0 && t[n].click();
				return;
			default: return;
		}
		this.focusedIndex = n, t[n].focus();
	}
	handleFabClick(e) {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("fab-click", {
			bubbles: !0,
			composed: !0
		}));
	}
	handleMenuClick(e) {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("menu-click", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		let e = this.classMap({
			"flex flex-col": !0,
			"h-full": !0,
			"box-border relative overflow-visible": !0,
			"z-10 hover:z-[100]": !0,
			"w-20": !this.isFullscreen,
			"w-0": this.isFullscreen,
			"transition-all duration-300 ease-emphasized": !0,
			"opacity-100": !this.isFullscreen,
			"opacity-0 pointer-events-none": this.isFullscreen,
			"overflow-hidden": this.isFullscreen
		}), t = this.classMap({
			"flex flex-col h-full": !0,
			"box-border relative": !0,
			"py-2": !0,
			"bg-container-lowest text-surface-on": !0,
			"transition-all duration-300 ease-emphasized": !0,
			"w-20": !this.expanded,
			"px-3": !this.expanded,
			"w-60": this.expanded,
			"px-4": this.expanded,
			"shadow-lg": this.expanded
		}), n = this.classMap({
			"flex flex-col items-center gap-1": !0,
			hidden: !this.hasHeaderContent
		}), r = this.classMap({
			"flex-1 flex flex-col gap-3": !0,
			"min-h-0": !0,
			"justify-start": this.alignment === "top",
			"justify-center": this.alignment === "center",
			"justify-end": this.alignment === "bottom"
		}), i = this.classMap({ "flex flex-col items-center gap-1 mt-auto pt-2": !0 });
		return p`
			<div
				class=${e}
			>
				<div class=${t} part="rail">
					<div class=${n} part="header">
						<slot name="fab" @click=${this.handleFabClick} @slotchange=${this.handleHeaderSlotChange}></slot>
						<slot name="menu" @click=${this.handleMenuClick} @slotchange=${this.handleHeaderSlotChange}></slot>
						<slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>
					</div>

					<nav class=${r} part="nav" role="list">
						<schmancy-scroll hide direction="vertical">
							<slot @slotchange=${this.handleSlotChange}></slot>
						</schmancy-scroll>
					</nav>

					<div class=${i} part="footer">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		`;
	}
	setupNavigateListener() {
		this.addEventListener("navigate", (e) => {
			if (e instanceof CustomEvent) {
				let t = e.detail, n = this.navigationItems.findIndex((e) => e.value === t || e.label === t);
				n >= 0 && (this.activeIndex = n, this._activeValue = t);
			}
		});
	}
	handleHeaderSlotChange() {
		let e = this.shadowRoot?.querySelector("[part=\"header\"]");
		if (e) {
			let t = e.querySelectorAll("slot");
			this.hasHeaderContent = Array.from(t).some((e) => e.assignedNodes({ flatten: !0 }).length > 0);
		}
	}
	handleSlotChange() {
		this.updateLabelVisibility(), this.updateActiveStates(this.activeIndex), this.navigationItems.forEach((e, t) => {
			e.setAttribute("role", "listitem"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", t === this.activeIndex ? "0" : "-1");
		});
	}
};
e([u({ type: Number })], g.prototype, "activeIndex", null), e([u({ type: String })], g.prototype, "activeValue", null), e([u({
	type: String,
	attribute: "label-visibility",
	reflect: !0
})], g.prototype, "labelVisibility", void 0), e([u({
	type: String,
	reflect: !0
})], g.prototype, "alignment", void 0), e([u({ type: Boolean })], g.prototype, "showTooltips", void 0), e([u({ type: Boolean })], g.prototype, "keyboardNavigation", void 0), e([u({
	type: Boolean,
	reflect: !0
})], g.prototype, "expanded", void 0), e([f()], g.prototype, "focusedIndex", void 0), e([f()], g.prototype, "hasHeaderContent", void 0), e([f()], g.prototype, "isFullscreen", void 0), e([d({ flatten: !0 })], g.prototype, "allElements", void 0), g = e([l("schmancy-navigation-rail")], g);
export { g as SchmancyNavigationRail, h as SchmancyNavigationRailItem };
