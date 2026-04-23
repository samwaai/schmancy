import { Observable as e } from "rxjs";
function t(t, n = { threshold: .5 }) {
	return new e((e) => {
		let r = new IntersectionObserver((t) => {
			e.next(t);
		}, n);
		return Array.isArray(t) ? t.forEach((e) => r.observe(e)) : r.observe(t), () => {
			r.disconnect();
		};
	});
}
export { t };
