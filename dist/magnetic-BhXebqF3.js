import { f as e } from "./animation-hXFClrIn.js";
import { t } from "./reduced-motion-BZTLqAyl.js";
import { Subject as n, animationFrameScheduler as r, fromEvent as i, merge as a } from "rxjs";
import { auditTime as o, map as s, takeUntil as c } from "rxjs/operators";
import { AsyncDirective as l } from "lit/async-directive.js";
import { PartType as u, directive as d } from "lit/directive.js";
var f = d(class extends l {
	constructor(...e) {
		super(...e), this.teardown$ = new n(), this.strength = 4, this.radius = 100;
	}
	render(e) {}
	update(t, [n]) {
		if (t.type !== u.ELEMENT) throw Error("magnetic directive must be used on an element");
		let r = JSON.stringify(n ?? {});
		this.element && r === this.prevKey || (this.prevKey = r, this.element = t.element, this.strength = n?.strength ?? 4, this.radius = n?.radius ?? 100, this.element.style.transition = `translate ${e.duration}ms ${e.easingFallback}`, this.teardown$.next(), this.setupMagnetic());
	}
	reconnected() {
		this.teardown$.next(), this.setupMagnetic();
	}
	setupMagnetic() {
		if (t.value) return;
		let e = this.element.parentElement ?? document;
		a(i(this.element, "mouseenter").pipe(s(() => (this.element.style.willChange = "translate", this.cachedRect = this.element.getBoundingClientRect(), null))), i(e, "mousemove").pipe(o(0, r), s((e) => {
			let t = this.cachedRect ?? this.element.getBoundingClientRect(), n = t.left + t.width / 2, r = t.top + t.height / 2, i = e.clientX - n, a = e.clientY - r, o = Math.sqrt(i * i + a * a);
			if (o < this.radius && o > 0) {
				let e = (1 - o / this.radius) * this.strength;
				return {
					x: i / o * e,
					y: a / o * e
				};
			}
			return {
				x: 0,
				y: 0
			};
		})), i(e, "mouseleave").pipe(s(() => (this.element.style.willChange = "", this.cachedRect = void 0, {
			x: 0,
			y: 0
		}))), t.pipe(s((e) => (e && (this.element.style.translate = "", this.element.style.willChange = ""), null)))).pipe(c(this.teardown$)).subscribe((e) => {
			e && (this.element.style.translate = `${e.x}px ${e.y}px`);
		});
	}
	disconnected() {
		this.teardown$.next(), this.element && (this.element.style.translate = "", this.element.style.willChange = "");
	}
});
export { f as t };
