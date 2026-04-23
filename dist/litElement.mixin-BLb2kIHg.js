import { r as e, t } from "./tailwind.mixin-BCz3GEpw.js";
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
