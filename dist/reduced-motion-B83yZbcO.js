import { BehaviorSubject as e, fromEvent as t } from "rxjs";
import { map as n, startWith as r } from "rxjs/operators";
var i = typeof window < "u" ? window.matchMedia("(prefers-reduced-motion: reduce)") : void 0, a = new e(i?.matches ?? !1);
i && t(i, "change").pipe(n((e) => e.matches), r(i.matches)).subscribe((e) => {
	a.next(e);
});
export { a as t };
