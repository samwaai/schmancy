import { t as e } from "./tailwind.mixin-DIEGVcl3.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n } from "lit/decorators.js";
import { css as r, html as i } from "lit";
var a = class extends e(r`
	:host {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
`) {
	render() {
		return i`<slot></slot>`;
	}
};
a = t([n("schmancy-visually-hidden")], a);
export { a as SchmancyVisuallyHidden };
