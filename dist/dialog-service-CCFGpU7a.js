import { n as e, t } from "./theme.events-Bw3mYjUA.js";
import { t as n } from "./overlay-stack-BJt_r6aZ.js";
import { Subject as r, defaultIfEmpty as i, forkJoin as a, fromEvent as o, map as s, of as c, switchMap as l, takeUntil as u, tap as d, timer as f } from "rxjs";
import { render as p } from "lit";
var m = "are-you-there-dialog", h = "yes-dialog-here", g = class g {
	static {
		this.DEFAULT_OPTIONS = {
			title: void 0,
			subtitle: void 0,
			confirmText: void 0,
			cancelText: void 0,
			variant: "default"
		};
	}
	constructor() {
		this.activeDialogs = [], this.dialogSubject = new r(), this.dismissSubject = new r(), this.lastClickPosition = null, this.clickTrackingInitialized = !1, this.setupDialogOpeningLogic(), this.setupDialogDismissLogic(), this.setupClickPositionTracking();
	}
	setupClickPositionTracking() {
		this.clickTrackingInitialized || typeof document > "u" || (this.clickTrackingInitialized = !0, o(document, "pointerdown", {
			capture: !0,
			passive: !0
		}).pipe(d((e) => {
			this.lastClickPosition = {
				x: e.clientX,
				y: e.clientY
			};
		})).subscribe());
	}
	static getInstance() {
		return g.instance ||= new g(), g.instance;
	}
	setupDialogOpeningLogic() {
		this.dialogSubject.pipe(l((n) => a([o(window, t).pipe(u(f(50)), s((e) => e.detail.theme), i(void 0)), c(n).pipe(d(() => {
			let t = `dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			window.dispatchEvent(new CustomEvent(e, {
				bubbles: !0,
				composed: !0
			})), n.uid = t;
		}))])), s(([e, t]) => {
			let r = e || t.options.targetContainer || document.querySelector("schmancy-theme") || document.body, i = t.uid, a = document.createElement("schmancy-dialog");
			return a.setAttribute("uid", i), a.style.setProperty("--schmancy-overlay-z", String(n.getNextZIndex())), r.appendChild(a), {
				dialog: a,
				target: t
			};
		}), d(({ dialog: e, target: t }) => {
			let n = t.options;
			if (t.type === "confirm") {
				if (e.title = n.title, e.subtitle = n.subtitle, e.message = n.message, e.confirmText = n.confirmText ?? "Confirm", e.cancelText = n.cancelText ?? "Cancel", e.variant = n.variant ?? "default", n.content) {
					let t = document.createElement("div");
					if (t.slot = "content", typeof n.content == "function") {
						let e = n.content();
						e instanceof HTMLElement ? t.appendChild(e) : p(e, t);
					} else n.content instanceof HTMLElement ? t.appendChild(n.content) : p(n.content, t);
					e.appendChild(t);
				}
			} else if (e.hideActions = !0, t.content) {
				let n = document.createElement("div");
				if (n.style.display = "contents", n.classList.add("schmancy-dialog-content-container"), typeof t.content == "function") {
					let e = t.content();
					e instanceof HTMLElement ? n.appendChild(e) : p(e, n);
				} else t.content instanceof HTMLElement ? n.appendChild(t.content) : p(t.content, n);
				e.appendChild(n);
			}
			this.activeDialogs.push(e);
		}), d(({ dialog: e, target: t }) => {
			let r = t.options.position || this.getDefaultPosition();
			e.show(r).then((r) => {
				t.resolve?.(r);
				let i = this.activeDialogs.indexOf(e);
				i !== -1 && this.activeDialogs.splice(i, 1), n.release();
				let a = e.querySelector("[slot=\"content\"]");
				a && e.removeChild(a);
				let o = e.querySelector(".schmancy-dialog-content-container");
				o?.parentNode && o.parentNode.removeChild(o), e._eventSubscriptions?.forEach((e) => e.unsubscribe()), e.parentElement?.removeChild(e);
			}).catch((e) => {
				t.reject?.(e);
			});
			let i = [];
			if (t.options.onConfirm) {
				let n = o(e, "confirm").subscribe(() => {
					t.options.onConfirm(), n.unsubscribe();
				});
				i.push(n);
			}
			if (t.options.onCancel) {
				let n = o(e, "cancel").subscribe(() => {
					t.options.onCancel(), n.unsubscribe();
				});
				i.push(n);
			}
			e._eventSubscriptions = i;
		})).subscribe();
	}
	setupDialogDismissLogic() {
		this.dismissSubject.pipe(l((e) => a([o(window, h).pipe(u(f(100)), s((e) => e.detail), i(void 0)), c(e).pipe(d(() => {
			window.dispatchEvent(new CustomEvent(m, {
				detail: { uid: e },
				bubbles: !0,
				composed: !0
			}));
		}))])), d(([e]) => {
			if (e?.dialog) {
				e.dialog.hide(!1), e.dialog._eventSubscriptions?.forEach((e) => e.unsubscribe());
				let t = this.activeDialogs.indexOf(e.dialog);
				t !== -1 && this.activeDialogs.splice(t, 1), n.release(), e.dialog.parentElement?.removeChild(e.dialog);
			}
		})).subscribe();
	}
	confirm(e) {
		return new Promise((t, n) => {
			let r = {
				...g.DEFAULT_OPTIONS,
				...e
			};
			r.position ||= this.getDefaultPosition(), this.dialogSubject.next({
				options: r,
				type: "confirm",
				content: r.content,
				resolve: t,
				reject: n
			});
		});
	}
	component(e, t = {}) {
		return new Promise((n, r) => {
			t.position ||= this.getDefaultPosition(), this.dialogSubject.next({
				options: t,
				type: "component",
				content: e,
				resolve: n,
				reject: r
			});
		});
	}
	dismiss() {
		if (this.activeDialogs.length > 0) {
			let e = this.activeDialogs[this.activeDialogs.length - 1].getAttribute("uid");
			if (e) return this.dismissSubject.next(e), !0;
		}
		return !1;
	}
	close() {
		return this.dismiss();
	}
	ask(e, t) {
		return this.confirm({
			message: e,
			confirmText: "Confirm",
			cancelText: "Cancel",
			position: t
		});
	}
	danger(e) {
		return this.confirm({
			...e,
			variant: "danger"
		});
	}
	prompt(e) {
		return new Promise((t) => {
			let n = e.defaultValue || "", r = document.createElement("div");
			r.style.width = "100%", r.style.minWidth = "280px";
			let i = document.createElement("schmancy-input");
			i.setAttribute("type", e.inputType || "text"), e.label && i.setAttribute("label", e.label), e.placeholder && i.setAttribute("placeholder", e.placeholder), e.defaultValue && i.setAttribute("value", e.defaultValue), i.addEventListener("input", (e) => {
				n = e.target.value;
			}), r.appendChild(i), this.confirm({
				title: e.title,
				message: e.message,
				confirmText: e.confirmText ?? "OK",
				cancelText: e.cancelText ?? "Cancel",
				position: e.position,
				content: r
			}).then((e) => {
				t(e ? n : null);
			});
		});
	}
	getDefaultPosition() {
		return this.lastClickPosition ? { ...this.lastClickPosition } : {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
	}
}, _ = g.getInstance(), v = {
	confirm: (e) => _.confirm(e),
	ask: (e, t) => _.ask(e, t),
	danger: (e) => _.danger(e),
	prompt: (e) => _.prompt(e),
	component: (e, t) => _.component(e, t),
	dismiss: () => _.dismiss(),
	close: () => _.close()
};
export { m as i, g as n, h as r, v as t };
