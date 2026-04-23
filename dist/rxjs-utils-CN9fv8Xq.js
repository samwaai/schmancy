import { t as e } from "./chunk-C_1VqBVD.js";
import { Observable as t } from "rxjs";
var n = (e, n = {
	attributes: !0,
	childList: !0,
	subtree: !0
}) => new t((t) => {
	let r = new MutationObserver((e) => {
		t.next(e);
	});
	return r.observe(e, n), () => {
		r.disconnect();
	};
});
e((e) => {
	Object.defineProperty(e, "t", { value: !0 }), e.hasValueAtKey = e.hasPresentKey = e.isFilled = e.isDefined = e.isPresent = void 0, e.isPresent = function(e) {
		return e != null;
	}, e.isDefined = function(e) {
		return e !== void 0;
	}, e.isFilled = function(e) {
		return e !== null;
	}, e.hasPresentKey = function(e) {
		return function(t) {
			return t[e] !== void 0 && t[e] !== null;
		};
	}, e.hasValueAtKey = function(e, t) {
		return function(n) {
			return n[e] === t;
		};
	};
})();
export { n as t };
