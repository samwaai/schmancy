import { t as e } from "./reduced-motion-BZTLqAyl.js";
import { Subject as t, animationFrameScheduler as n, fromEvent as r, merge as i } from "rxjs";
import { auditTime as a, map as o, takeUntil as s } from "rxjs/operators";
import { AsyncDirective as c } from "lit/async-directive.js";
import { PartType as l, directive as u } from "lit/directive.js";
var d = u(class extends c {
	constructor(...e) {
		super(...e), this.teardown$ = new t(), this.radius = 200, this.color = "var(--schmancy-sys-color-primary-default)", this.intensity = .12, this.didSetPosition = !1;
	}
	render(e) {}
	update(t, [n]) {
		if (t.type !== l.ELEMENT) throw Error("cursorGlow directive must be used on an element");
		let r = JSON.stringify(n ?? {});
		this.element && r === this.prevKey || (this.prevKey = r, this.element = t.element, this.radius = n?.radius ?? 200, this.color = n?.color ?? "var(--schmancy-sys-color-primary-default)", this.intensity = n?.intensity ?? .12, e.value || (this.teardown$.next(), this.ensureGlowElement(), this.setupTracking()));
	}
	reconnected() {
		this.ensureGlowElement(), this.teardown$.next(), this.setupTracking();
	}
	ensureGlowElement() {
		getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative", this.didSetPosition = !0), this.glowEl || (this.glowEl = document.createElement("div"), this.glowEl.setAttribute("aria-hidden", "true"), Object.assign(this.glowEl.style, {
			position: "absolute",
			inset: "0",
			pointerEvents: "none",
			zIndex: "0",
			borderRadius: "inherit",
			overflow: "hidden",
			opacity: "0",
			transition: "opacity 400ms ease"
		}), this.element.prepend(this.glowEl));
	}
	setupTracking() {
		i(r(this.element, "mouseenter").pipe(o(() => (this.glowEl && (this.glowEl.style.opacity = "1"), this.cachedRect = this.element.getBoundingClientRect(), null))), r(this.element, "mousemove").pipe(a(0, n), o((e) => {
			let t = this.cachedRect ?? this.element.getBoundingClientRect();
			return {
				x: e.clientX - t.left,
				y: e.clientY - t.top
			};
		})), r(this.element, "mouseleave").pipe(o(() => (this.glowEl && (this.glowEl.style.opacity = "0"), this.cachedRect = void 0, null)))).pipe(s(this.teardown$)).subscribe((e) => {
			e && this.glowEl && (this.glowEl.style.background = `radial-gradient(\n\t\t\t\t\t\t${this.radius}px circle at ${e.x}px ${e.y}px,\n\t\t\t\t\t\tcolor-mix(in srgb, ${this.color} ${Math.round(100 * this.intensity)}%, transparent),\n\t\t\t\t\t\ttransparent\n\t\t\t\t\t)`);
		});
	}
	disconnected() {
		this.teardown$.next(), this.glowEl?.remove(), this.glowEl = void 0, this.didSetPosition && this.element && (this.element.style.position = "", this.didSetPosition = !1);
	}
});
export { d as t };
