import { fromEvent as e } from "rxjs";
import { Directive as t, PartType as n, directive as r } from "lit/directive.js";
import { arrow as i, autoUpdate as a, computePosition as o, flip as s, offset as c, shift as l } from "@floating-ui/dom";
var u = /* @__PURE__ */ new WeakMap(), d = r(class extends t {
	constructor(e) {
		if (super(e), e.type !== n.ELEMENT) throw Error("The tooltip directive can only be used on elements");
	}
	render(e, t = {}) {
		return {
			text: e,
			options: t
		};
	}
	update(t, [n, r = {}]) {
		let d = t.element, f = r?.position || "top", p = r?.delay || 300, m = !1 !== r?.showArrow, h = u.get(d);
		if (h) h.tooltipElement.textContent = n, h.arrowElement && (h.arrowElement.style.visibility = m ? "visible" : "hidden");
		else {
			let t = document.createElement("div"), r;
			t.className = "schmancy-tooltip", Object.assign(t.style, {
				position: "absolute",
				zIndex: "10000",
				backgroundColor: "var(--schmancy-sys-color-surface-highest, #333)",
				color: "var(--schmancy-sys-color-surface-on, white)",
				padding: "8px 12px",
				borderRadius: "4px",
				fontSize: "14px",
				fontWeight: "normal",
				maxWidth: "300px",
				pointerEvents: "none",
				opacity: "0",
				transition: "opacity 150ms ease",
				boxShadow: "var(--schmancy-sys-elevation-2)",
				textAlign: "center",
				visibility: "hidden"
			}), m && (r = document.createElement("div"), r.className = "schmancy-tooltip-arrow", Object.assign(r.style, {
				position: "absolute",
				width: "8px",
				height: "8px",
				background: "inherit",
				visibility: "hidden",
				transform: "rotate(45deg)"
			}), t.appendChild(r)), t.setAttribute("role", "tooltip");
			let g = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
			t.id = g, d.setAttribute("aria-describedby", g), document.body.appendChild(t), h = {
				tooltipElement: t,
				arrowElement: r
			}, u.set(d, h);
			let _ = () => {
				h?.showTimeout && clearTimeout(h.showTimeout), h.showTimeout = window.setTimeout(() => {
					h.tooltipElement.textContent = n, m && h.arrowElement && !h.tooltipElement.contains(h.arrowElement) && h.tooltipElement.appendChild(h.arrowElement), h.tooltipElement.style.visibility = "visible", h.cleanup && h.cleanup(), h.cleanup = a(d, h.tooltipElement, () => async function(e, t, n, r) {
						let a = [
							c(8),
							s({
								fallbackPlacements: [
									"top",
									"right",
									"bottom",
									"left"
								].filter((e) => e !== n),
								padding: 5
							}),
							l({ padding: 5 })
						];
						r && t.arrowElement && a.push(i({ element: t.arrowElement }));
						let { x: u, y: d, placement: f, middlewareData: p } = await o(e, t.tooltipElement, {
							placement: n,
							middleware: a,
							strategy: "fixed"
						});
						if (Object.assign(t.tooltipElement.style, {
							left: `${u}px`,
							top: `${d}px`,
							position: "fixed"
						}), r && t.arrowElement && p.arrow) {
							let { x: e, y: n } = p.arrow, r = {
								top: "bottom",
								right: "left",
								bottom: "top",
								left: "right"
							}[f.split("-")[0]] || "bottom";
							Object.assign(t.arrowElement.style, {
								left: e == null ? "" : `${e}px`,
								top: n == null ? "" : `${n}px`,
								[r]: "-4px",
								visibility: "visible"
							});
						}
					}(d, h, f, m)), requestAnimationFrame(() => {
						h.tooltipElement.style.opacity = "1";
					});
				}, p);
			}, v = () => {
				h?.showTimeout && clearTimeout(h.showTimeout), h.tooltipElement.style.opacity = "0", setTimeout(() => {
					h.tooltipElement.style.visibility = "hidden";
				}, 150), h?.cleanup && (h.cleanup(), h.cleanup = void 0);
			}, y = [
				e(d, "mouseenter").subscribe(_),
				e(d, "focus").subscribe(_),
				e(d, "mouseleave").subscribe(v),
				e(d, "blur").subscribe(v),
				e(document, "keydown").subscribe((e) => {
					e.key === "Escape" && h?.tooltipElement.style.opacity === "1" && v();
				})
			];
			h.subscriptions = y;
		}
		return {
			text: n,
			options: r
		};
	}
	disconnected(e) {
		let t = e.element, n = u.get(t);
		n && (n.subscriptions && n.subscriptions.forEach((e) => e.unsubscribe()), n.showTimeout && clearTimeout(n.showTimeout), n.cleanup && n.cleanup(), document.body.contains(n.tooltipElement) && document.body.removeChild(n.tooltipElement), t.hasAttribute("aria-describedby") && t.removeAttribute("aria-describedby"), u.delete(t));
	}
});
export { d as tooltip };
