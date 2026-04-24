import { o as e, t } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t as n } from "./provide-BuzyBLGj.js";
import { t as r } from "./decorate-D_utPUsC.js";
import { t as i } from "./surface.mixin-DqMwoddO.js";
import { customElement as a, property as o } from "lit/decorators.js";
import { css as s, html as c } from "lit";
var l = e("surface"), u = class extends i(t(s`
		:host {
			display: block;
			box-sizing: border-box;
			overflow: visible;
		}
	`)) {
	constructor(...e) {
		super(...e), this.type = "subtle";
	}
	render() {
		return c`<slot></slot>`;
	}
};
r([n({ context: l }), o({ reflect: !0 })], u.prototype, "type", void 0), u = r([a("schmancy-surface")], u);
export { l as n, u as t };
