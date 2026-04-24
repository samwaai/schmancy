import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
var o = class extends e(i`
	:host {
		display: block;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}
	.sep {
		color: var(--schmancy-sys-color-surface-onVariant, #79747e);
		user-select: none;
		padding: 0 0.25rem;
	}
	::slotted(schmancy-breadcrumb-item:last-of-type) {
		font-weight: 500;
	}
`) {
	constructor(...e) {
		super(...e), this.separator = "/";
	}
	connectedCallback() {
		super.connectedCallback(), this.hasAttribute("aria-label") || this.setAttribute("aria-label", "Breadcrumb");
	}
	render() {
		return a`
			<nav role="navigation">
				<slot @slotchange=${() => this._insertSeparators()}></slot>
			</nav>
		`;
	}
	_insertSeparators() {
		let e = this.shadowRoot?.querySelector("slot");
		if (!e) return;
		let t = e.assignedElements({ flatten: !0 });
		this.querySelectorAll("[data-schmancy-sep]").forEach((e) => e.remove()), t.forEach((e, n) => {
			if (n === t.length - 1) return;
			let r = document.createElement("span");
			r.setAttribute("data-schmancy-sep", ""), r.setAttribute("aria-hidden", "true"), r.setAttribute("part", "separator"), r.className = "sep", r.textContent = this.separator, e.insertAdjacentElement("afterend", r);
		});
	}
};
t([r({ type: String })], o.prototype, "separator", void 0), o = t([n("schmancy-breadcrumb")], o);
var s = class extends e(i`
	:host {
		display: inline-block;
	}
	a, span {
		color: inherit;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
`) {
	constructor(...e) {
		super(...e), this.href = "", this.current = !1;
	}
	render() {
		return this.href && !this.current ? a`<a href=${this.href}><slot></slot></a>` : a`<span aria-current=${this.current ? "page" : "false"}><slot></slot></span>`;
	}
};
t([r({ type: String })], s.prototype, "href", void 0), t([r({
	type: Boolean,
	reflect: !0
})], s.prototype, "current", void 0), s = t([n("schmancy-breadcrumb-item")], s);
export { o as SchmancyBreadcrumb, s as SchmancyBreadcrumbItem };
