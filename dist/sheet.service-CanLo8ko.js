import { p as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./audio-C7TzWI8M.js";
import { t as n } from "./overlay-stack-BJt_r6aZ.js";
import { Subject as r, delay as i, fromEvent as a, map as o, of as s, switchMap as c, take as l, tap as u } from "rxjs";
var d = function(e) {
	return e.Side = "side", e.Bottom = "bottom", e;
}({}), f = new class {
	constructor() {
		this.bottomSheet = new r(), this.activeSheets = /* @__PURE__ */ new Set(), this.popStateListenerActive = !1, this.setupSheetOpeningLogic(), this.setupPopStateListener();
	}
	setupSheetOpeningLogic() {
		this.bottomSheet.pipe(c((t) => {
			let n = t.uid ?? `sheet-${Date.now()}`;
			return e("schmancy-sheet").pipe(o((e) => ({
				target: t,
				existingSheet: e?.getAttribute("uid") === n ? e : null,
				uid: n
			})));
		}), c(({ target: t, existingSheet: n, uid: r }) => n ? s({
			target: t,
			sheet: n,
			uid: r
		}) : e("schmancy-theme").pipe(o((e) => {
			let n = e || document.body, i = document.createElement("schmancy-sheet");
			return i.setAttribute("uid", r), n.appendChild(i), {
				target: t,
				sheet: i,
				uid: r
			};
		}))), u(({ target: e, sheet: t }) => {
			e.lock && t.setAttribute("lock", "true");
			let r = e.position || (window.innerWidth >= 768 ? d.Side : d.Bottom);
			t.setAttribute("position", r), e.persist && t.setAttribute("persist", String(e.persist)), t.style.setProperty("--schmancy-overlay-z", String(n.getNextZIndex())), document.body.style.overflow = "hidden";
		}), i(20), u(({ target: e, uid: t }) => {
			window.dispatchEvent(new CustomEvent("schmancy-sheet-render", {
				detail: {
					component: e.component,
					uid: t,
					props: e.props
				},
				bubbles: !0,
				composed: !0
			}));
		}), i(1), u(({ sheet: e, uid: r }) => {
			e.setAttribute("open", "true"), t.play("curious"), this.activeSheets.add(r), a(e, "close").pipe(l(1), i(300)).subscribe(() => {
				this.activeSheets.delete(r), n.release();
				let t = e.getAttribute("persist");
				t && t !== "false" || e.remove(), document.body.style.overflow = "auto";
			});
		})).subscribe();
	}
	setupPopStateListener() {
		this.popStateListenerActive ||= (a(window, "popstate").subscribe((e) => {
			if (this.activeSheets.size > 0) {
				let t = Array.from(this.activeSheets).pop();
				t && (this.dismiss(t), e.state && e.state.schmancySheet && history.pushState({}, "", window.location.href));
			}
		}), !0);
	}
	dismiss(e) {
		if (!e && this.activeSheets.size > 0) {
			let t = Array.from(this.activeSheets);
			e = t[t.length - 1];
		}
		e && (t.play("atEase"), window.dispatchEvent(new CustomEvent("schmancy-sheet-dismiss", {
			detail: { uid: e },
			bubbles: !0,
			composed: !0
		})), this.activeSheets.delete(e));
	}
	open(e) {
		this.bottomSheet.next(e);
	}
	push(e) {
		this.bottomSheet.next(e);
	}
	isOpen(e) {
		return this.activeSheets.has(e);
	}
	closeAll() {
		Array.from(this.activeSheets).forEach((e) => {
			this.dismiss(e);
		});
	}
}();
export { f as n, d as t };
