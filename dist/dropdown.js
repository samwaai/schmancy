import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { filter as r, fromEvent as i, takeUntil as a } from "rxjs";
import { customElement as o, property as s, query as c, queryAssignedElements as l, state as u } from "lit/decorators.js";
import { css as d, html as f } from "lit";
import { autoUpdate as p, computePosition as m, flip as h, offset as g, shift as _ } from "@floating-ui/dom";
var v = class extends n() {
	constructor(...e) {
		super(...e), this.open = !1, this.placement = "bottom-start", this.distance = 8, this.portal = null, this.portalSubscriptions = [];
	}
	connectedCallback() {
		super.connectedCallback(), this.setupPortal(), i(document, "click").pipe(r((e) => this.open && !this.isEventFromSelf(e)), a(this.disconnecting)).subscribe(() => {
			this.open = !1;
		}), i(document, "keydown").pipe(r((e) => this.open && e.key === "Escape"), a(this.disconnecting)).subscribe(() => {
			this.open = !1;
		});
	}
	setupPortal() {
		let e = document.getElementById("schmancy-portal-container");
		e || (e = document.createElement("div"), e.id = "schmancy-portal-container", e.style.position = "fixed", e.style.zIndex = "10000", e.style.top = "0", e.style.left = "0", e.style.pointerEvents = "none", document.body.appendChild(e));
		let t = document.createElement("div");
		t.className = "schmancy-dropdown-portal", t.style.position = "absolute", t.style.pointerEvents = "auto", t.style.display = "none", e.appendChild(t), this.portal = t;
	}
	isEventFromSelf(e) {
		return e.composedPath().some((e) => e === this);
	}
	disconnectedCallback() {
		this.cleanupPositioner?.(), this.portalSubscriptions.forEach((e) => e.unsubscribe()), this.portalSubscriptions = [], this.portal &&= (this.portal.remove(), null), super.disconnectedCallback();
	}
	toggle() {
		this.open = !this.open;
	}
	updated(e) {
		super.updated(e), e.has("open") && (this.open ? this.setupPositioner() : (this.cleanupPositioner?.(), this.portal && (this.portal.style.display = "none", this.portal.innerHTML = "", this.portalSubscriptions.forEach((e) => e.unsubscribe()), this.portalSubscriptions = [])));
	}
	setupPositioner() {
		this.triggerContainer && this.portal && (this.portal.style.display = "block", this.teleportContentToPortal(), this.cleanupPositioner = p(this.triggerContainer, this.portal, () => {
			m(this.triggerContainer, this.portal, {
				placement: this.placement,
				middleware: [
					g(this.distance),
					h({ fallbackPlacements: ["top-start", "bottom-start"] }),
					_({ padding: 0 })
				]
			}).then(({ x: e, y: t }) => {
				Object.assign(this.portal.style, {
					left: `${e}px`,
					top: t - 8 + "px"
				});
			});
		}));
	}
	teleportContentToPortal() {
		this.portal && (this.portalSubscriptions.forEach((e) => e.unsubscribe()), this.portalSubscriptions = [], this.portal.innerHTML = "", this.contentElements.forEach((e) => {
			let t = e.cloneNode(!0);
			if (e.tagName.toLowerCase() === "schmancy-dropdown-content") {
				let e = i(t, "slotchange").subscribe(() => {
					let e = t.shadowRoot?.querySelector("[part=\"content\"]");
					e && e.classList.add("schmancy-dropdown-content");
				});
				this.portalSubscriptions.push(e);
			}
			this.portal?.appendChild(t);
		}));
	}
	handleTriggerClick(e) {
		e.stopPropagation(), this.toggle();
	}
	render() {
		return f`
			<div class="trigger-container" @click=${this.handleTriggerClick}>
				<slot name="trigger"></slot>
			</div>

			<div class="dropdown-content-container" ?hidden=${!this.open}>
				<slot
					@slotchange=${() => {
			this.open && (this.teleportContentToPortal(), this.setupPositioner());
		}}
				></slot>
			</div>
		`;
	}
};
t([s({
	type: Boolean,
	reflect: !0
})], v.prototype, "open", void 0), t([s({ type: String })], v.prototype, "placement", void 0), t([s({ type: Number })], v.prototype, "distance", void 0), t([c(".trigger-container")], v.prototype, "triggerContainer", void 0), t([c(".dropdown-content-container")], v.prototype, "contentContainer", void 0), t([l({ flatten: !0 })], v.prototype, "contentElements", void 0), t([u()], v.prototype, "portal", void 0), t([l({
	slot: "trigger",
	flatten: !0
})], v.prototype, "triggerElements", void 0), v = t([o("schmancy-dropdown")], v);
var y = class extends e(d`
	:host {
		display: block;
		position: absolute;
		z-index: 1000;
		min-width: 10rem;
		margin: 0;
		text-align: left;
		list-style: none;
		background-color: var(--schmancy-sys-color-surface-container);
		background-clip: padding-box;
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}

	:host([hidden]) {
		display: none;
	}

	@keyframes dropdownAnimation {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Apply styles to content both in the component and when teleported to the portal */
	.schmancy-dropdown-content {
		background-color: var(--schmancy-sys-color-surface-container);
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}
`) {
	constructor(...e) {
		super(...e), this.width = "auto", this.maxHeight = "80vh", this.shadow = !0, this.radius = "md";
	}
	render() {
		let e = {
			"schmancy-dropdown-content": !0,
			"overflow-auto": !0,
			"shadow-none": !this.shadow,
			"rounded-none": this.radius === "none",
			"rounded-sm": this.radius === "sm",
			"rounded-md": this.radius === "md",
			"rounded-lg": this.radius === "lg",
			"rounded-full": this.radius === "full"
		}, t = {
			width: this.width,
			maxHeight: this.maxHeight
		};
		return f`
			<div class=${this.classMap(e)} style=${this.styleMap(t)} part="content">
				<slot></slot>
			</div>
		`;
	}
};
t([s({ type: String })], y.prototype, "width", void 0), t([s({ type: String })], y.prototype, "maxHeight", void 0), t([s({ type: Boolean })], y.prototype, "shadow", void 0), t([s({ type: String })], y.prototype, "radius", void 0), y = t([o("schmancy-dropdown-content")], y);
export { v as SchmancyDropdown, y as SchmancyDropdownContent };
