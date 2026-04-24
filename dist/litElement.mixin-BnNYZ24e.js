import { r as e, t } from "./tailwind.mixin-H5Pn7vSJ.js";
var n = (n) => {
	class r extends e(t(n)) {
		constructor(...e) {
			super(...e), this.disconnectedCallback = () => {
				super.disconnectedCallback();
			};
		}
	}
	return r;
};
export { n as t };
