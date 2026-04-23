import { Observable as e, fromEvent as t, race as n, timer as r } from "rxjs";
import { defaultIfEmpty as i, map as a, take as o, takeUntil as s } from "rxjs/operators";
var c = "schmancy-discover", l = "schmancy-discover-response";
function u(n, o = 100) {
	let c = `${n}-where-are-you`, l = `${n}-here-i-am`;
	return new e((e) => {
		let n = t(window, l).pipe(s(r(o)), a((e) => e.detail.component), i(null)).subscribe((t) => {
			e.next(t), e.complete();
		});
		return window.dispatchEvent(new CustomEvent(c, {
			bubbles: !0,
			composed: !0
		})), () => n.unsubscribe();
	});
}
function d(...t) {
	return t.length === 0 ? new e((e) => {
		e.next(null), e.complete();
	}) : n(...t.map((e) => u(e)));
}
function f(n, u = 150) {
	let d = `discover-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	return new e((e) => {
		let f = t(window, l).pipe(s(r(u)), a((e) => e.detail), a((e) => e.requestId === d ? e.element : null), o(1), i(null)).subscribe((t) => {
			e.next(t), e.complete();
		});
		return window.dispatchEvent(new CustomEvent(c, {
			detail: {
				selector: n,
				requestId: d
			},
			bubbles: !0,
			composed: !0
		})), () => f.unsubscribe();
	});
}
function p(n, i = 150) {
	let a = `discover-all-${Date.now()}-${Math.random().toString(36).slice(2)}`, o = [];
	return new e((e) => {
		let u = t(window, l).pipe(s(r(i))).subscribe({
			next: (e) => {
				e.detail.requestId === a && o.push(e.detail.element);
			},
			complete: () => {
				e.next(o), e.complete();
			}
		});
		return window.dispatchEvent(new CustomEvent(c, {
			detail: {
				selector: n,
				requestId: a
			},
			bubbles: !0,
			composed: !0
		})), () => u.unsubscribe();
	});
}
function m(e, t = 150) {
	return /^[#.\[]/.test(e) ? f(e, t) : u(e, t);
}
export { c as DISCOVER_EVENT, l as DISCOVER_RESPONSE_EVENT, m as discover, p as discoverAllElements, d as discoverAnyComponent, u as discoverComponent, f as discoverElement };
