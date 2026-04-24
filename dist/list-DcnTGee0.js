import { a as e, o as t, t as n } from "./tailwind.mixin-CNdR3zFD.js";
import { t as r } from "./provide-Disc6_zz.js";
import { t as i } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as a, property as o, queryAssignedElements as s } from "lit/decorators.js";
import { css as c, html as l } from "lit";
var u = t(void 0), d = t("surface"), f = class extends n(c`
	:host {
		display: block;
		border-radius: 0.5rem;
		transition:
			background 200ms ease,
			box-shadow 300ms ease,
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host(:hover:not([readonly])) {
		background: color-mix(in srgb, var(--schmancy-sys-color-surface-on) 8%, transparent);
		box-shadow: 0 2px 8px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 10%, transparent);
	}
	:host(:active:not([readonly])) {
		transform: scale(0.98);
		transition-duration: 100ms;
	}
	:host([selected]) {
		background: color-mix(in srgb, var(--schmancy-sys-color-secondary-container) 30%, transparent);
		box-shadow: 0 0 10px -3px color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 12%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: background 200ms ease; }
		:host(:active:not([readonly])) { transform: none; }
	}
`) {
	constructor(...e) {
		super(...e), this.selected = !1;
	}
	get imgClasses() {
		return [
			"h-4",
			"w-4",
			"sm:h-5",
			"sm:w-5",
			"object-contain"
		];
	}
	firstUpdated() {
		this.leading?.forEach((e) => {
			e.classList.add(...this.imgClasses);
		}), this.trailing?.forEach((e) => {
			e.classList.add(...this.imgClasses);
		});
	}
	render() {
		let e = {
			"w-full flex items-center min-h-[36px] sm:min-h-[40px] py-1 px-2 sm:px-3 text-sm": !0,
			"focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:z-1 outline-secondary-default outline-hidden": !0,
			"cursor-pointer": !this.readonly
		};
		return l`<li .tabIndex=${this.readonly ? -1 : 0} class=${this.classMap(e)}>
			<slot></slot>
		</li>`;
	}
};
i([e({
	context: d,
	subscribe: !0
}), o()], f.prototype, "variant", void 0), i([o({
	type: Boolean,
	reflect: !0
})], f.prototype, "rounded", void 0), i([o({
	type: Boolean,
	reflect: !0
})], f.prototype, "readonly", void 0), i([o({
	type: Boolean,
	reflect: !0
})], f.prototype, "selected", void 0), i([s({
	slot: "leading",
	flatten: !0
})], f.prototype, "leading", void 0), i([s({
	slot: "trailing",
	flatten: !0
})], f.prototype, "trailing", void 0), f = i([a("schmancy-list-item")], f);
var p = class extends n(c`
	:host {
		display: block;
		padding-top: 8px;
		padding-bottom: 8px;
	}
`) {
	constructor(...e) {
		super(...e), this.fill = "auto", this.elevation = 0;
	}
	render() {
		return l`
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface}>
				<ul>
					<slot></slot>
				</ul>
			</schmancy-surface>
		`;
	}
};
i([r({ context: u }), o()], p.prototype, "surface", void 0), i([o({
	type: String,
	reflect: !0
})], p.prototype, "fill", void 0), i([o({ type: Number })], p.prototype, "elevation", void 0), p = i([a("schmancy-list")], p);
export { f as n, u as r, p as t };
