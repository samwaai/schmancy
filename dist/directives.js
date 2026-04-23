import { _ as e, d as t, f as n, l as r, u as i } from "./animation-CXKSuUoE.js";
import { t as a } from "./reduced-motion-B83yZbcO.js";
import { t as o } from "./cursor-glow-C2YRrB8Z.js";
import { n as s, r as c, t as l } from "./layout-BE2ld1IY.js";
import { t as u } from "./magnetic-Dj52WplI.js";
import { BehaviorSubject as d, EMPTY as f, Observable as p, Subject as m, animationFrameScheduler as h, combineLatest as g, concat as _, defer as v, from as y, fromEvent as b, interval as x, merge as S, of as C, timer as w } from "rxjs";
import { catchError as T, delay as E, distinctUntilChanged as D, filter as O, finalize as k, first as A, map as j, observeOn as ee, repeat as M, skip as te, startWith as ne, switchMap as N, take as P, takeUntil as F, takeWhile as I, tap as L } from "rxjs/operators";
import { noChange as R, nothing as z } from "lit";
import { AsyncDirective as B, directive as V } from "lit/async-directive.js";
import { Directive as H, PartType as U, directive as W } from "lit/directive.js";
var re = {
	smooth: t,
	snappy: n,
	bouncy: r,
	gentle: i
}, ie = V(class extends B {
	constructor(...e) {
		super(...e), this.element = null, this.originalContent = "", this.animations = [], this.disconnecting$ = new m(), this.initialized = !1;
	}
	render(e) {
		return R;
	}
	update(e, [t]) {
		return this.element = e.element, this.initialized || (this.initialized = !0, this.disconnecting$.closed && (this.disconnecting$ = new m()), t.text === void 0 ? this.originalContent = this.element.textContent || "" : (this.originalContent = t.text, this.element.textContent = t.text), this.element.style.willChange = "transform, opacity", t.animation === "typewriter" ? this.element.textContent = "" : this.element.style.opacity = "0", this.initialize(t)), R;
	}
	disconnected() {
		this.cleanup();
	}
	reconnected() {
		this.element && (this.element.style.willChange = "transform, opacity");
	}
	initialize(e) {
		let { animation: t, delay: n = 0, duration: r, stagger: i, preset: a = "snappy", restart: o = !1 } = e, s = re[a], c = r ?? s.duration, l = i ?? (t === "cyber-glitch" ? 30 : 50), u = this.createVisibilityObservable$();
		(o ? u.pipe(N((e) => e ? w(n).pipe(N(() => this.runAnimation$(t, c, l, s))) : v(() => (this.resetToInitial(t), f)))) : u.pipe(O((e) => e), P(1), E(n), N(() => this.runAnimation$(t, c, l, s)))).pipe(F(this.disconnecting$)).subscribe();
	}
	cleanup() {
		this.disconnecting$.next(), this.disconnecting$.complete(), this.cancelAnimations(), this.element && (this.element.textContent = this.originalContent, this.element.style.opacity = "", this.element.style.willChange = "auto", this.element.style.transform = "", this.element.style.filter = ""), this.element = null, this.initialized = !1;
	}
	cancelAnimations() {
		this.animations.forEach((e) => e.cancel()), this.animations = [];
	}
	resetToInitial(e) {
		this.cancelAnimations(), this.element && (e === "typewriter" ? this.element.textContent = "" : (this.element.textContent = this.originalContent, this.element.style.opacity = "0"), this.element.style.transform = "", this.element.style.filter = "", this.element.style.willChange = "transform, opacity");
	}
	getAccumulatedOpacity() {
		if (!this.element) return 0;
		let e = 1, t = this.element.parentElement, n = 0;
		for (; t && t !== document.body && n < 10;) {
			let r = window.getComputedStyle(t);
			if (r.visibility === "hidden" || r.display === "none") return 0;
			let i = parseFloat(r.opacity) || 1;
			if (i < 1 && (e *= i, e <= .5)) return e;
			if (t.assignedSlot) {
				let n = this.getSlotAncestorOpacity(t.assignedSlot);
				if (n === 0) return 0;
				e *= n;
			}
			t = t.parentElement, n++;
		}
		return e;
	}
	getSlotAncestorOpacity(e) {
		let t = 1, n = e.parentElement;
		for (; n;) {
			let e = window.getComputedStyle(n);
			if (e.visibility === "hidden" || e.display === "none") return 0;
			t *= parseFloat(e.opacity) || 1, n = n.parentElement;
		}
		return t;
	}
	createVisibilityObservable$() {
		let e = b(document, "visibilitychange").pipe(ne(null), j(() => document.visibilityState === "visible"), D());
		return g([x(200).pipe(ne(0), j(() => {
			if (!this.element) return !1;
			let e = this.element.getBoundingClientRect();
			return e.width > 0 && e.height > 0 && e.top < window.innerHeight && e.bottom > 0 && this.getAccumulatedOpacity() > .5;
		}), D()), e]).pipe(j(([e, t]) => e && t), D());
	}
	runAnimation$(e, t, n, r) {
		if (!this.element) return f;
		switch (e) {
			case "fade-up": return this.animateFadeUp$(t, r);
			case "blur-reveal": return this.animateBlurReveal$(t, n, r);
			case "word-reveal": return this.animateWordReveal$(t, n, r);
			case "cyber-glitch": return this.animateCyberGlitch$(t, n, r);
			case "typewriter": return this.animateTypewriter$(t);
			default: return f;
		}
	}
	animateFadeUp$(e, t) {
		if (!this.element) return f;
		let n = this.element.animate([{
			opacity: 0,
			transform: "translateY(30px)"
		}, {
			opacity: 1,
			transform: "translateY(0)"
		}], {
			duration: e,
			easing: t.easingFallback,
			fill: "forwards"
		});
		return this.animations.push(n), y(n.finished).pipe(L(() => {
			this.element && (this.element.style.opacity = "", this.element.style.transform = "", this.element.style.willChange = "auto");
		}), T(() => f));
	}
	wrapTextNodes(e) {
		let t = [], n = document.createDocumentFragment(), r = Array.from(e.childNodes);
		for (let e of r) if (e.nodeType === Node.TEXT_NODE) {
			let r = (e.textContent || "").split(/(\s+)/);
			for (let e of r) if (/^\s+$/.test(e)) n.appendChild(document.createTextNode(e));
			else if (e.length > 0) {
				let r = document.createElement("span");
				r.textContent = e, n.appendChild(r), t.push(r);
			}
		} else e instanceof HTMLElement && (n.appendChild(e), t.push(e));
		return e.textContent = "", e.appendChild(n), t;
	}
	animateBlurReveal$(e, t, n) {
		if (!this.element) return f;
		let r = this.wrapTextNodes(this.element);
		this.element.style.opacity = "1", r.forEach((r, i) => {
			r.style.opacity = "0", r.style.display = "inline-block";
			let a = r.animate([{
				opacity: 0,
				filter: "blur(8px)",
				transform: "scale(0.9)"
			}, {
				opacity: 1,
				filter: "blur(0)",
				transform: "scale(1)"
			}], {
				duration: e,
				easing: n.easingFallback,
				delay: i * t,
				fill: "forwards"
			});
			this.animations.push(a);
		});
		let i = this.animations[this.animations.length - 1];
		return i ? y(i.finished).pipe(L(() => {
			this.element && (this.element.style.willChange = "auto", r.forEach((e) => {
				e.style.willChange = "auto";
			}));
		}), T(() => f)) : f;
	}
	animateWordReveal$(e, t, n) {
		if (!this.element) return f;
		let r = this.wrapTextNodes(this.element);
		this.element.style.opacity = "1", r.forEach((r, i) => {
			r.style.opacity = "0", r.style.display = "inline-block";
			let a = r.animate([{
				opacity: 0,
				transform: "translateY(20px)"
			}, {
				opacity: 1,
				transform: "translateY(0)"
			}], {
				duration: e,
				easing: n.easingFallback,
				delay: i * t,
				fill: "forwards"
			});
			this.animations.push(a);
		});
		let i = this.animations[this.animations.length - 1];
		return i ? y(i.finished).pipe(L(() => {
			this.element && (this.element.style.willChange = "auto", r.forEach((e) => {
				e.style.willChange = "auto";
			}));
		}), T(() => f)) : f;
	}
	animateCyberGlitch$(e, t, n) {
		if (!this.element) return f;
		let r = this.originalContent.split(""), i = document.createDocumentFragment(), a = [];
		for (let e of r) {
			let t = document.createElement("span");
			t.style.display = "inline-block", t.style.opacity = "0", t.textContent = e === " " ? "\xA0" : e, i.appendChild(t), a.push(t);
		}
		this.element.textContent = "", this.element.appendChild(i), this.element.style.opacity = "1", a.forEach((i, a) => {
			if (r[a] === " ") return void (i.style.opacity = "1");
			let o = i.animate([{
				opacity: 0,
				transform: "translateY(-8px) scale(1.4)",
				filter: "blur(4px)"
			}, {
				opacity: 1,
				transform: "translateY(0) scale(1)",
				filter: "blur(0)"
			}], {
				duration: e,
				easing: n.easingFallback,
				delay: a * t,
				fill: "forwards"
			});
			this.animations.push(o);
		});
		let o = this.animations[this.animations.length - 1];
		return o ? y(o.finished).pipe(L(() => {
			this.element && (this.element.style.willChange = "auto", a.forEach((e) => {
				e.style.willChange = "auto";
			}));
		}), T(() => f)) : f;
	}
	animateTypewriter$(e) {
		if (!this.element) return f;
		let t = this.originalContent, n = t.length;
		if (n === 0) return f;
		let r = 0;
		return x(e / n).pipe(L(() => {
			r++, this.element && (this.element.textContent = t.slice(0, r));
		}), I(() => r < n), k(() => {
			this.element && (this.element.textContent = this.originalContent, this.element.style.willChange = "auto");
		}));
	}
}), ae = W(class extends H {
	constructor(e) {
		super(e), this.config = {};
	}
	update(e, [t]) {
		if (e.type !== U.ELEMENT) throw Error("The `classMap` directive must be used in the `class` attribute");
		let n = e.element;
		this.config = t, this.config.bgColor && (n.style.backgroundColor = this.config.bgColor), this.config.color && (n.style.color = this.config.color);
	}
	render(e) {
		return this.config = e, z;
	}
}), G = /* @__PURE__ */ new WeakMap();
function oe(e, t) {
	let n = e.match(/var\(([^,)]+)/);
	return n && getComputedStyle(document.documentElement).getPropertyValue(n[1]).trim() || t;
}
var se = W(class extends H {
	constructor(e) {
		if (super(e), e.type !== U.ELEMENT) throw Error("confirmClick directive can only be used on elements");
	}
	render(e, t) {}
	update(e, [t, n = {}]) {
		let r = e.element, i = G.get(r);
		if (i) {
			if (i.callback = t, this.optionsEqual(i.options, n)) return;
			this.cleanup(r);
		}
		let a = new m(), o = this.setupClickListener(r, n ?? {}, a);
		G.set(r, {
			subscription: o,
			callback: t,
			options: n ?? {},
			overlayElement: null,
			isConfirming: !1,
			cancel$: a
		});
	}
	optionsEqual(e, t) {
		return t ? e.timeout === t.timeout && e.icon === t.icon : Object.keys(e).length === 0;
	}
	setupClickListener(e, t, n) {
		return b(e, "click").pipe(L((r) => {
			let i = G.get(e);
			i && !i.isConfirming && (r.stopPropagation(), r.preventDefault(), i.isConfirming = !0, this.showOverlay(e, i, t, n));
		})).subscribe();
	}
	showOverlay(e, t, n, r) {
		let i = n.timeout ?? 3e3, a = e, o = n.icon ?? a.icon ?? a._capturedIcon ?? e.textContent?.trim() ?? "warning", s = oe("var(--schmancy-sys-color-error-default)", "#dc2626"), c = oe("var(--schmancy-sys-color-error-on)", "#ffffff"), l = oe("var(--schmancy-sys-color-error-container)", "#fecaca"), u = document.createElement("div");
		u.setAttribute("role", "status"), u.setAttribute("aria-label", "Click again to confirm");
		let d = e.getBoundingClientRect(), f = d.width, p = d.height, m = window.devicePixelRatio || 1, g = getComputedStyle(e);
		Object.assign(u.style, {
			position: "fixed",
			top: `${d.top}px`,
			left: `${d.left}px`,
			width: `${f}px`,
			height: `${p}px`,
			zIndex: "10000",
			borderRadius: g.borderRadius || "50%",
			overflow: "hidden",
			cursor: "pointer",
			opacity: "0",
			transform: "scale(0.6)",
			transition: "opacity 250ms cubic-bezier(0.22, 1.25, 0.36, 1), transform 300ms cubic-bezier(0.22, 1.25, 0.36, 1)"
		});
		let _ = document.createElement("canvas");
		_.width = f * m, _.height = p * m, _.style.width = `${f}px`, _.style.height = `${p}px`, _.style.position = "absolute", _.style.top = "0", _.style.left = "0", u.appendChild(_);
		let v = Math.round(.5 * Math.min(f, p)), y = document.createElement("schmancy-icon");
		y.textContent = o, y.setAttribute("size", `${v}px`), Object.assign(y.style, {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			color: c,
			pointerEvents: "none"
		}), u.appendChild(y), document.body.appendChild(u), t.overlayElement = u, C(null).pipe(ee(h)).subscribe(() => {
			u.style.opacity = "1", u.style.transform = "scale(1)";
		});
		let w = _.getContext("2d");
		if (!w) return;
		w.scale(m, m);
		let T = f / 2, E = p / 2, D = Math.min(f, p) / 2 - 1, k = D - 3, A = (e) => {
			w.clearRect(0, 0, f, p), w.beginPath(), w.arc(T, E, k, 0, 2 * Math.PI), w.fillStyle = s, w.fill();
			let t = 1 - e;
			if (t > 0) {
				let e = -Math.PI / 2, n = e + 2 * Math.PI * t;
				w.beginPath(), w.arc(T, E, D, e, n), w.arc(T, E, k, n, e, !0), w.closePath(), w.fillStyle = l, w.fill();
			}
		};
		A(0);
		let M = performance.now(), te = x(0, h).pipe(j(() => (performance.now() - M) / i), I((e) => e <= 1), F(r), L((e) => A(e))).subscribe({ complete: () => {
			G.get(e)?.isConfirming && this.hideOverlay(e);
		} });
		t.subscription.add(te);
		let ne = S(b(u, "click").pipe(P(1), L(() => {
			t.callback(), this.hideOverlay(e);
		})), b(document, "click", { capture: !0 }).pipe(O((t) => !u.contains(t.target) && !e.contains(t.target)), P(1), L(() => this.hideOverlay(e))), b(document, "keydown").pipe(O((e) => e.key === "Escape"), P(1), L(() => this.hideOverlay(e)))).pipe(P(1), F(r)).subscribe();
		t.subscription.add(ne);
	}
	hideOverlay(e) {
		let t = G.get(e);
		if (t && (t.cancel$.next(), t.isConfirming = !1, t.overlayElement)) {
			let e = t.overlayElement;
			e.style.opacity = "0", e.style.transform = "scale(0.6)", w(250).pipe(L(() => {
				document.body.contains(e) && document.body.removeChild(e);
			})).subscribe(), t.overlayElement = null;
		}
	}
	cleanup(e) {
		let t = G.get(e);
		t && (t.cancel$.next(), t.cancel$.complete(), t.subscription.unsubscribe(), t.overlayElement && document.body.contains(t.overlayElement) && document.body.removeChild(t.overlayElement), G.delete(e));
	}
	disconnected(e) {
		this.cleanup(e.element);
	}
	reconnected(e) {
		let t = e.element, n = G.get(t);
		if (n) {
			let e = new m(), r = this.setupClickListener(t, n.options, e);
			G.set(t, {
				subscription: r,
				callback: n.callback,
				options: n.options,
				overlayElement: null,
				isConfirming: !1,
				cancel$: e
			});
		}
	}
}), ce = V(class extends B {
	constructor(...e) {
		super(...e), this.element = null, this.items = [], this.subscription = null, this.typewriterSub = null, this.currentAnimation = null, this.addDisplayEl = null, this.disconnecting$ = new m(), this.initialized = !1;
	}
	render(e) {
		return R;
	}
	update(e, [t = {}]) {
		if (this.element = e.element, !this.initialized && this.isConnected) {
			if (this.initialized = !0, this.disconnecting$.closed && (this.disconnecting$ = new m()), this.items = Array.from(this.element.children).filter((e) => e instanceof HTMLElement), this.items.length === 0) return R;
			this.element.style.display = "inline-grid", this.element.style.verticalAlign = "bottom", this.items.forEach((e, t) => {
				e.style.gridColumn = "1", e.style.gridRow = "1", e.style.visibility = t === 0 ? "" : "hidden";
			}), this.startCycling(t);
		}
		return R;
	}
	disconnected() {
		this.cleanup();
	}
	reconnected() {}
	startCycling(e) {
		let { mode: t = "replace" } = e;
		this.items.length < 2 || (t === "add" ? this.startAddCycling(e) : this.startReplaceCycling(e));
	}
	startReplaceCycling(e) {
		let { transition: t = "fade", hold: n = 2e3, duration: r = 300, delay: i = 0 } = e, a = (e) => v(() => new p((i) => {
			let a = this.items[e], o = (e - 1 + this.items.length) % this.items.length, s = this.items[o], c = parseInt(a.dataset.hold || "", 10) || n, l = this.transitionItems(s, a, t, r).pipe(N(() => w(c)), P(1), F(this.disconnecting$)).subscribe({
				next: () => {
					i.next(), i.complete();
				},
				error: (e) => i.error(e)
			});
			return () => l.unsubscribe();
		})), o = parseInt(this.items[0].dataset.hold || "", 10) || n, s = _(v(() => new p((e) => {
			let t = w(o).pipe(F(this.disconnecting$)).subscribe({ next: () => {
				e.next(), e.complete();
			} });
			return () => t.unsubscribe();
		})), _(...[...Array.from({ length: this.items.length }, (e, t) => t).slice(1), 0].map((e) => a(e))).pipe(M()));
		this.subscription = w(i).pipe(N(() => s), F(this.disconnecting$)).subscribe();
	}
	startAddCycling(e) {
		let { transition: t = "fade", hold: n = 2e3, duration: r = 300, delay: i = 0, separator: a = ", " } = e, o = this.items.map((e) => e.textContent || "");
		this.items.forEach((e) => {
			e.style.display = "none";
		});
		let s = document.createElement("span");
		this.element.appendChild(s), this.addDisplayEl = s;
		let c = v(() => {
			s.textContent = "";
			let e = "", i = o.map((i, o) => {
				let c = parseInt(this.items[o].dataset.hold || "", 10) || n, l = (o > 0 ? a : "") + i;
				return v(() => t === "typewriter" ? this.typewriterAdd(s, e, l, r).pipe(L(() => {
					e += l;
				}), N(() => w(c))) : v(() => (e += l, s.textContent = e, w(c))));
			}), c = v(() => {
				let t = s.animate([{ opacity: 1 }, { opacity: 0 }], {
					duration: r,
					fill: "forwards"
				});
				return this.currentAnimation = t, y(t.finished).pipe(L(() => {
					t.cancel(), s.textContent = "", s.style.opacity = "", e = "";
				}), N(() => w(300)));
			});
			return _(...i, c);
		});
		this.subscription = w(i).pipe(N(() => c.pipe(M())), F(this.disconnecting$)).subscribe();
	}
	typewriterAdd(e, t, n, r) {
		if (n.length === 0) return C(void 0);
		let i = r / n.length;
		return new p((r) => {
			let a = 0, o = x(i).pipe(L(() => {
				a++, e.textContent = t + n.slice(0, a);
			}), I(() => a < n.length), F(this.disconnecting$)).subscribe({ complete: () => {
				e.textContent = t + n, r.next(), r.complete();
			} });
			return () => o.unsubscribe();
		});
	}
	transitionItems(e, t, n, r) {
		switch (this.currentAnimation?.cancel(), this.currentAnimation = null, this.typewriterSub?.unsubscribe(), this.typewriterSub = null, n) {
			case "slide": return this.slideTransition(e, t, r);
			case "typewriter": return this.typewriterTransition(e, t, r);
			default: return this.fadeTransition(e, t, r);
		}
	}
	fadeTransition(e, t, n) {
		let r = e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: n / 2,
			fill: "forwards"
		});
		return this.currentAnimation = r, y(r.finished).pipe(N(() => {
			r.cancel(), e.style.visibility = "hidden", t.style.visibility = "";
			let i = t.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: n / 2,
				fill: "forwards"
			});
			return this.currentAnimation = i, y(i.finished).pipe(L(() => {
				i.cancel();
			}), j(() => {}), T(() => f));
		}), T(() => f));
	}
	slideTransition(e, t, n) {
		let r = "cubic-bezier(0.4, 0, 0.2, 1)";
		t.style.visibility = "";
		let i = e.animate([{
			transform: "translateY(0)",
			opacity: 1
		}, {
			transform: "translateY(-100%)",
			opacity: 0
		}], {
			duration: n,
			fill: "forwards",
			easing: r
		}), a = t.animate([{
			transform: "translateY(100%)",
			opacity: 0
		}, {
			transform: "translateY(0)",
			opacity: 1
		}], {
			duration: n,
			fill: "forwards",
			easing: r
		});
		return this.currentAnimation = a, y(a.finished).pipe(L(() => {
			i.cancel(), a.cancel(), e.style.visibility = "hidden";
		}), j(() => {}), T(() => f));
	}
	typewriterTransition(e, t, n) {
		let r = e.textContent || "", i = t.textContent || "", a = r.length + i.length;
		if (a === 0) return e.style.visibility = "hidden", t.style.visibility = "", C(void 0);
		let o = n / a;
		return new p((n) => {
			let a = r.length;
			return this.typewriterSub = _(x(o).pipe(L(() => {
				a--, e.textContent = r.slice(0, a);
			}), I(() => a > 0)), v(() => (e.style.visibility = "hidden", e.textContent = r, t.style.visibility = "", t.textContent = "", C(null))), v(() => {
				let e = 0;
				return x(o).pipe(L(() => {
					e++, t.textContent = i.slice(0, e);
				}), I(() => e < i.length));
			})).pipe(F(this.disconnecting$)).subscribe({ complete: () => {
				t.textContent = i, n.next(), n.complete();
			} }), () => {
				this.typewriterSub?.unsubscribe(), this.typewriterSub = null;
			};
		});
	}
	cleanup() {
		this.disconnecting$.next(), this.disconnecting$.complete(), this.currentAnimation?.cancel(), this.currentAnimation = null, this.typewriterSub?.unsubscribe(), this.typewriterSub = null, this.subscription?.unsubscribe(), this.subscription = null, this.addDisplayEl &&= (this.addDisplayEl.remove(), null), this.items.forEach((e, t) => {
			e.style.gridColumn = "", e.style.gridRow = "", e.style.visibility = t === 0 ? "" : "hidden", e.style.opacity = "", e.style.transform = "";
		}), this.element = null, this.items = [], this.initialized = !1;
	}
}), le = W(class extends B {
	constructor(...e) {
		super(...e), this.maxBlur = 8, this.duration = 400, this.isBlurred = !1, this.transitionSet = !1;
	}
	render(e) {}
	update(e, [t]) {
		if (e.type !== U.ELEMENT) throw Error("depthOfField directive must be used on an element");
		this.element = e.element, this.maxBlur = t.maxBlur ?? 8, this.duration = t.duration ?? 400, this.transitionSet || a.value || (this.element.style.transition = `filter ${this.duration}ms cubic-bezier(0.34, 1.2, 0.64, 1), scale ${this.duration}ms cubic-bezier(0.34, 1.2, 0.64, 1)`, this.transitionSet = !0), t.active && !this.isBlurred ? this.applyBlur() : !t.active && this.isBlurred && this.clearBlur();
	}
	applyBlur() {
		this.element.style.filter = `blur(${this.maxBlur}px) saturate(60%)`, this.element.style.scale = "1.01", this.isBlurred = !0;
	}
	clearBlur() {
		this.element.style.filter = "", this.element.style.scale = "", this.isBlurred = !1;
	}
	disconnected() {
		this.isBlurred && this.clearBlur();
	}
	reconnected() {}
}), ue = new d(null), K = new d(null), q = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Y = [];
function X(e) {
	Y.push(`[${(/* @__PURE__ */ new Date()).toISOString().slice(11, 23)}] ${e}`);
}
var Z = null;
K.pipe(D((e, t) => e?.target === t?.target && e?.position === t?.position)).subscribe((e) => {
	if (!e) return void (Z && (Z.style.display = "none"));
	if (a.value) return;
	let t = function() {
		if (Z) return Z;
		let e = document.createElement("div");
		e.setAttribute("data-schmancy-drop-line", ""), Object.assign(e.style, {
			position: "fixed",
			height: "2px",
			backgroundColor: "var(--schmancy-sys-color-tertiary-default, #6750A4)",
			borderRadius: "1px",
			pointerEvents: "none",
			zIndex: "10000",
			transition: "top 100ms ease, left 100ms ease, width 100ms ease",
			boxShadow: "0 0 4px var(--schmancy-sys-color-tertiary-default, #6750A4)",
			display: "none"
		});
		for (let t of ["left", "right"]) {
			let n = document.createElement("div");
			Object.assign(n.style, {
				position: "absolute",
				width: "6px",
				height: "6px",
				borderRadius: "50%",
				backgroundColor: "var(--schmancy-sys-color-tertiary-default, #6750A4)",
				top: "-2px",
				[t]: "-3px"
			}), e.appendChild(n);
		}
		return document.body.appendChild(e), Z = e, e;
	}(), n = e.target.getBoundingClientRect(), r = e.position === "before" ? n.top - 1 : n.bottom + 1;
	Object.assign(t.style, {
		top: `${r}px`,
		left: `${n.left}px`,
		width: `${n.width}px`,
		display: "block"
	});
});
var de = class extends H {
	constructor(e) {
		super(e), this.destroy$ = new m();
	}
	update(e, [t]) {
		if (this.id = t, !this.element) {
			let t = e.element;
			this.element = t, t.draggable = !0, t.style.cursor = "grab", b(t, "dragstart").pipe(L((e) => {
				e.stopPropagation(), e.dataTransfer?.setData("application/json", JSON.stringify({ id: this.id })), e.dataTransfer && (e.dataTransfer.effectAllowed = "move"), t.style.cursor = "grabbing", Y.length = 0, X(`DRAGSTART id=${this.id} tag=${t.tagName}`), ue.next(this.id), J.clear();
				let n = t.parentElement;
				if (n) for (let [e, t] of q) t.parentElement === n && J.set(e, t.getBoundingClientRect());
			}), ee(h), L(() => {
				a.value || (t.style.transition = "transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease", t.style.transform = "scale(1.03)", t.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)", t.style.opacity = "0.6", t.style.zIndex = "1000", t.style.pointerEvents = "none");
			}), N(() => b(t, "dragend").pipe(P(1), L(() => {
				let e = K.value;
				if (t.style.removeProperty("transition"), t.style.removeProperty("transform"), t.style.removeProperty("box-shadow"), t.style.removeProperty("opacity"), t.style.removeProperty("z-index"), t.style.removeProperty("pointer-events"), t.style.cursor = "grab", e) {
					let { target: t, destinationId: r, position: i } = e;
					X(`DROP source=${this.id} dest=${r} pos=${i}`), t.dispatchEvent(new CustomEvent("drop", {
						detail: {
							source: this.id,
							destination: r,
							position: i
						},
						bubbles: !0,
						composed: !0
					})), w(0, h).pipe(te(1), P(1)).subscribe(() => {
						if (!a.value && J.size !== 0) {
							for (let [e, t] of J) {
								let r = q.get(e);
								if (!r) continue;
								let i = r.getBoundingClientRect(), a = t.left - i.left, o = t.top - i.top;
								Math.abs(a) < 1 && Math.abs(o) < 1 || r.animate([{ transform: `translate(${a}px, ${o}px)` }, { transform: "translate(0,0)" }], {
									duration: n.duration,
									easing: n.easingFallback,
									fill: "none"
								});
							}
							J.clear();
						}
					});
				}
				ue.next(null), K.next(null), X(`DRAGEND id=${this.id}`), Y.length !== 0 && (Y.length = 0);
			}))), F(this.destroy$)).subscribe();
		}
		return this.registeredId && this.registeredId !== t && q.delete(this.registeredId), q.set(t, this.element), this.registeredId = t, z;
	}
	disconnected() {
		this.destroy$.next(), this.destroy$.complete(), this.registeredId && q.delete(this.registeredId), this.element = void 0;
	}
	reconnected() {
		this.destroy$ = new m(), this.element = void 0;
	}
	render(e) {
		return z;
	}
}, fe = W(de), pe = class extends H {
	constructor(e) {
		super(e), this.destroy$ = new m();
	}
	update(e, [t]) {
		if (this.destinationId = t, !this.element) {
			let t = e.element;
			this.element = t, b(t, "dragenter").pipe(L((e) => {
				X(`NATIVE-DRAGENTER dest=${this.destinationId}`), e.preventDefault();
			}), F(this.destroy$)).subscribe(), b(t, "dragover").pipe(L((e) => {
				X(`NATIVE-DRAGOVER dest=${this.destinationId}`), e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
			}), F(this.destroy$)).subscribe(), b(t, "drop").pipe(L((e) => {
				e.preventDefault(), X(`NATIVE-DROP dest=${this.destinationId}`);
			}), F(this.destroy$)).subscribe(), ue.pipe(N((e) => e && e !== this.destinationId ? (X(`DROP-ACTIVE dest=${this.destinationId} src=${e}`), b(t, "dragover").pipe(L((e) => {
				e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
			}), L((n) => {
				let r = function(e, t, n) {
					let r = t.getBoundingClientRect(), i = n ? q.get(n) : null;
					if (!i) return e.clientY < r.top + r.height / 2 ? "before" : "after";
					let a = i.getBoundingClientRect();
					if (Math.abs(a.top - r.top) < r.height / 2) {
						let t = r.left + r.width / 2;
						return a.left > r.left ? e.clientX < t ? "before" : null : e.clientX >= t ? "after" : null;
					}
					let o = r.top + r.height / 2;
					return a.top > r.top ? e.clientY < o ? "before" : null : e.clientY >= o ? "after" : null;
				}(n, t, e);
				K.next(r ? {
					target: t,
					destinationId: this.destinationId,
					position: r
				} : null);
			}))) : (K.next(null), f)), F(this.destroy$)).subscribe();
		}
		return z;
	}
	disconnected() {
		this.destroy$.next(), this.destroy$.complete(), this.element = void 0;
	}
	reconnected() {
		this.destroy$ = new m(), this.element = void 0;
	}
	render(e) {
		return z;
	}
}, me = W(pe), he = W(class extends B {
	constructor(...e) {
		super(...e), this.hasAnimated = !1;
	}
	render(e) {}
	update(e, [t]) {
		if (e.type !== U.ELEMENT) throw Error("gravity directive must be used on an element");
		if (this.element = e.element, this.options = t, this.hasAnimated) return;
		if (a.value) return void (this.hasAnimated = !0);
		let n = Math.max(.3, Math.min(3, t?.mass ?? 1)), r = t?.distance ?? 30, i = (t?.delay ?? 0) + (t?.stagger ?? 0);
		this.animate(n, r, i), this.hasAnimated = !0;
	}
	reconnected() {
		if (this.hasAnimated = !1, this.options && !a.value) {
			let e = Math.max(.3, Math.min(3, this.options.mass ?? 1)), t = this.options.distance ?? 30, n = (this.options.delay ?? 0) + (this.options.stagger ?? 0);
			this.animate(e, t, n), this.hasAnimated = !0;
		}
	}
	animate(e, n, i) {
		let a = e < .7 ? r : t, o = a.duration * (1 / Math.sqrt(e)), s = 1 / e * n;
		this.animation?.cancel(), this.element.style.willChange = "transform, opacity", this.animation = this.element.animate([{
			opacity: 0,
			transform: `translateY(-${s}px)`
		}, {
			opacity: 1,
			transform: "translateY(0)"
		}], {
			duration: o,
			delay: i,
			easing: a.easingFallback,
			fill: "backwards"
		}), y(this.animation.finished).pipe(P(1), L(() => {
			this.element.style.willChange = "", this.animation = void 0;
		}), T(() => f)).subscribe();
	}
	disconnected() {
		this.animation?.cancel(), this.animation = void 0;
	}
}), ge = V(class extends B {
	constructor(...e) {
		super(...e), this.state = null;
	}
	render(e, t) {
		return R;
	}
	update(e, [t, n]) {
		let r = e.element, i, a, o, s = {};
		if (typeof t == "function" ? (i = t, s = n || {}) : (a = t.onEnter, o = t.onExit, s = t.options || {}, i = (e) => {
			e && a && a(), !e && o && o();
		}), this.state?.element === r) return R;
		this.cleanup();
		let { once: c = !1, threshold: l = 0, rootMargin: u = "0px", delay: d = 0 } = s, f = new IntersectionObserver((e) => {
			if (!this.state) return;
			let t = e[0], n = t.isIntersecting;
			d > 0 && n ? (this.state.delayTimerSub && this.state.delayTimerSub.unsubscribe(), this.state.delayTimerSub = w(d).pipe(P(1), L(() => this.triggerCallback(n, t))).subscribe()) : (!n && this.state.delayTimerSub && (this.state.delayTimerSub.unsubscribe(), this.state.delayTimerSub = void 0), this.triggerCallback(n, t));
		}, {
			threshold: l,
			rootMargin: u
		});
		return this.state = {
			element: r,
			observer: f,
			callback: i,
			onEnter: a,
			onExit: o,
			once: c,
			delay: d,
			hasFired: !1
		}, f.observe(r), R;
	}
	triggerCallback(e, t) {
		this.state && (this.state.once ? e && !this.state.hasFired && (this.state.hasFired = !0, this.state.callback(e, t), this.cleanup()) : this.state.callback(e, t));
	}
	cleanup() {
		this.state &&= (this.state.delayTimerSub?.unsubscribe(), this.state.delayTimerSub = void 0, this.state.observer.disconnect(), null);
	}
	pause() {
		this.state && (this.state.delayTimerSub?.unsubscribe(), this.state.observer.disconnect());
	}
	disconnected() {
		this.pause();
	}
	reconnected() {
		this.state && this.state.observer.observe(this.state.element);
	}
}), _e = {
	active: !0,
	intensity: "medium"
}, ve = {
	light: {
		blur: 12,
		sat: 1.3,
		bright: 1.05,
		tint: .45,
		border: .2,
		shadow: .06
	},
	medium: {
		blur: 16,
		sat: 1.4,
		bright: 1.08,
		tint: .55,
		border: .28,
		shadow: .08
	},
	strong: {
		blur: 24,
		sat: 1.5,
		bright: 1.12,
		tint: .65,
		border: .35,
		shadow: .1
	}
}, ye = [
	"backdropFilter",
	"background",
	"boxShadow",
	"borderTop",
	"borderBottom"
], be = V(class extends B {
	constructor(...e) {
		super(...e), this.state = null;
	}
	render(e) {
		return R;
	}
	update(e, [t = {}]) {
		let n = e.element, r = {
			..._e,
			...t
		};
		return r.active ? this.activate(n, r) : this.cleanup(), R;
	}
	activate(e, t) {
		if (!this.isConnected) return;
		let n = ve[t.intensity];
		if (!this.state) {
			let t = {};
			for (let n of ye) t[n] = e.style[n];
			this.state = {
				element: e,
				origStyles: t
			};
		}
		this.applyStyles(e, n);
	}
	applyStyles(e, t) {
		let n = `blur(${t.blur}px) saturate(${t.sat}) brightness(${t.bright})`;
		e.style.backdropFilter = n, e.style.setProperty("-webkit-backdrop-filter", n), e.style.background = `rgba(var(--md-sys-color-surface-container, 255 255 255) / ${t.tint})`;
		let r = t.border;
		e.style.boxShadow = [
			`inset 0 1px 0 0 rgba(255,255,255, ${1.5 * r})`,
			`inset 0 2px 6px rgba(255,255,255, ${.6 * r})`,
			`inset 0 -1px 0 0 rgba(255,255,255, ${.25 * r})`,
			`0 1px 3px rgba(0,0,0, ${t.shadow})`,
			`0 6px 20px rgba(0,0,0, ${.5 * t.shadow})`
		].join(", "), e.style.borderTop = `0.5px solid rgba(255,255,255, ${.9 * r})`, e.style.borderBottom = "0.5px solid rgba(0,0,0, 0.05)";
	}
	cleanup() {
		if (!this.state) return;
		let { element: e, origStyles: t } = this.state;
		for (let n of ye) e.style[n] = t[n];
		e.style.removeProperty("-webkit-backdrop-filter"), this.state = null;
	}
	disconnected() {
		this.cleanup();
	}
	reconnected() {}
}), Q = "schmancy-lb-rotate", xe = !1;
function Se() {
	if (xe) return;
	let e = document.createElement("style");
	e.id = "schmancy-living-border-shared", e.textContent = `\n\t\t@property --${Q}-angle {\n\t\t\tsyntax: '<angle>';\n\t\t\tinitial-value: 0deg;\n\t\t\tinherits: false;\n\t\t}\n\t\t@keyframes ${Q} {\n\t\t\tto { --${Q}-angle: 360deg; }\n\t\t}\n\t`, document.head.appendChild(e), xe = !0;
}
var Ce = W(class extends B {
	constructor(...e) {
		super(...e), this.teardown$ = new m(), this.didSetPosition = !1;
	}
	render(e) {}
	update(e, [t]) {
		if (e.type !== U.ELEMENT) throw Error("livingBorder directive must be used on an element");
		let n = JSON.stringify(t ?? {});
		this.element && n === this.prevKey || (this.prevKey = n, this.element = e.element, this.lastOptions = t, a.value || (this.teardown$.next(), this.cleanup(), Se(), this.createBorderOverlay(t)));
	}
	reconnected() {
		this.lastOptions && !a.value && (Se(), this.createBorderOverlay(this.lastOptions));
	}
	createBorderOverlay(e) {
		let t = e?.width ?? 1, n = e?.color ?? "var(--schmancy-sys-color-primary-default)", r = e?.spread ?? 6, i = e?.duration ?? 3e3, a = e?.onHover ?? !1;
		getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative", this.didSetPosition = !0), this.borderEl = document.createElement("div"), this.borderEl.setAttribute("aria-hidden", "true");
		let o = `-${t}px`;
		Object.assign(this.borderEl.style, {
			position: "absolute",
			top: o,
			left: o,
			right: o,
			bottom: o,
			borderRadius: "inherit",
			pointerEvents: "none",
			zIndex: "0",
			background: `conic-gradient(\n\t\t\t\tfrom var(--${Q}-angle),\n\t\t\t\ttransparent 0%, transparent 30%,\n\t\t\t\tcolor-mix(in srgb, ${n} 50%, transparent) 45%,\n\t\t\t\t${n} 50%,\n\t\t\t\tcolor-mix(in srgb, ${n} 50%, transparent) 55%,\n\t\t\t\ttransparent 70%, transparent 100%\n\t\t\t)`,
			mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
			maskComposite: "exclude",
			WebkitMaskComposite: "xor",
			padding: `${t}px`,
			animation: `${Q} ${i}ms linear infinite`,
			filter: `blur(${.3 * r}px) drop-shadow(0 0 ${r}px color-mix(in srgb, ${n} 40%, transparent))`,
			opacity: a ? "0" : "0.5",
			transition: "opacity 300ms ease"
		}), this.element.prepend(this.borderEl), S(b(this.element, "mouseenter").pipe(j(() => {
			this.borderEl && (this.borderEl.style.opacity = a ? "0.7" : "0.8");
		})), b(this.element, "mouseleave").pipe(j(() => {
			this.borderEl && (this.borderEl.style.opacity = a ? "0" : "0.5");
		}))).pipe(F(this.teardown$)).subscribe();
	}
	cleanup() {
		this.borderEl?.remove(), this.borderEl = void 0;
	}
	disconnected() {
		this.teardown$.next(), this.cleanup(), this.didSetPosition && this.element && (this.element.style.position = "", this.didSetPosition = !1);
	}
}), $ = /* @__PURE__ */ new WeakMap(), we = W(class extends H {
	constructor(e) {
		if (super(e), e.type !== U.ELEMENT) throw Error("longPress directive can only be used on elements");
	}
	render(e, t) {}
	update(e, [t, n = {}]) {
		let r = e.element, i = $.get(r);
		if (i) {
			if (i.callback === t && this.optionsEqual(i.options, n)) return;
			i.subscription.unsubscribe();
		}
		let a = this.setupLongPress(r, t, n);
		$.set(r, {
			subscription: a,
			callback: t,
			options: n || {}
		});
	}
	optionsEqual(e, t) {
		return t ? e.duration === t.duration && e.movementThreshold === t.movementThreshold : Object.keys(e).length === 0;
	}
	setupLongPress(e, t, n = {}) {
		let r = n.duration ?? 500, i = n.movementThreshold ?? 10, a = b(e, "pointerdown"), o = b(window, "pointerup"), s = b(window, "pointermove"), c = b(window, "pointercancel");
		return a.pipe(N((e) => {
			let n = e.clientX, a = e.clientY, l = S(o, c, s.pipe(O((e) => {
				let t = e.clientX - n, r = e.clientY - a;
				return Math.sqrt(t * t + r * r) > i;
			}))).pipe(A());
			return w(r).pipe(F(l), L(() => t()));
		})).subscribe();
	}
	disconnected(e) {
		let t = e.element, n = $.get(t);
		n && (n.subscription.unsubscribe(), $.delete(t));
	}
	reconnected(e) {
		let t = e.element, n = $.get(t);
		n && (n.subscription = this.setupLongPress(t, n.callback, n.options));
	}
}), Te = {
	active: !0,
	autoHideDuration: 3e3,
	background: !0,
	intensity: 1,
	blur: 1,
	speed: 1,
	fadeInDuration: 1e3,
	fadeOutDuration: 8e3,
	idleOpacity: .6,
	idleBreathe: !0,
	temperature: 0,
	chromaticAberration: 1,
	particleCount: 30
}, Ee = "cubic-bezier(0.37, 0, 0.63, 1)", De = "cubic-bezier(0.25, 0.1, 0.25, 1)", Oe = !1, ke = class e {
	constructor() {
		this.elementToDirective = /* @__PURE__ */ new WeakMap(), this.instances = /* @__PURE__ */ new Set(), this.observer = null, this.visibilitySub = null, this.tabVisible = !0;
	}
	static {
		this._instance = null;
	}
	static get instance() {
		return e._instance ||= new e(), e._instance;
	}
	register(e, t) {
		let n = this.instances.size === 0;
		this.instances.add(e), this.elementToDirective.set(t, e), n && this.setup(), this.observer?.observe(t);
	}
	unregister(e, t) {
		this.observer?.unobserve(t), this.elementToDirective.delete(t), this.instances.delete(e), this.instances.size === 0 && this.teardown();
	}
	setup() {
		this.observer = new IntersectionObserver((e) => {
			for (let t of e) {
				let e = this.elementToDirective.get(t.target);
				e && e.onVisibilityChange(t.isIntersecting && this.tabVisible);
			}
		}, { threshold: 0 }), this.visibilitySub = b(document, "visibilitychange").pipe(L(() => {
			this.tabVisible = document.visibilityState === "visible";
			for (let e of this.instances) e.onVisibilityChange(this.tabVisible);
		})).subscribe();
	}
	teardown() {
		this.observer &&= (this.observer.disconnect(), null), this.visibilitySub &&= (this.visibilitySub.unsubscribe(), null);
	}
}, Ae = V(class extends B {
	constructor(...e) {
		super(...e), this.state = null, this.coordinator = ke.instance;
	}
	render(e) {
		return R;
	}
	update(e, [t = {}]) {
		let n = e.element, r = {
			...Te,
			...t
		};
		return r.active ? this.show(n, r) : this.hide(r), R;
	}
	onVisibilityChange(e) {
		if (!this.state?.overlay) return;
		let t = this.state.isVisible;
		this.state.isVisible = e, t !== e && (this.state.overlay.classList.toggle("paused", !e), this.state.overlay.classList.toggle("running", e));
	}
	show(e, t) {
		(function() {
			if (Oe || typeof document > "u") return;
			Oe = !0;
			let e = document.createElement("style");
			e.id = "nebula-directive-styles", e.textContent = "\n/* =============================================================================\n   NEBULA v3 - SURREAL DIMENSIONAL RIFT - GPU-COMPOSITED CSS ANIMATIONS\n   Chromatic aberration, iridescent hue-cycling, event horizon, tendrils.\n   Performance: translate3d + opacity for most layers, hue-rotate for core only.\n   ============================================================================= */\n\n/* Chromatic red channel - rightward aberration drift */\n@keyframes nebula-chromatic-red {\n	0%, 100% { transform: translate3d(var(--nebula-aberration, 3px), 0, 0); }\n	25% { transform: translate3d(calc(var(--nebula-aberration, 3px) * 1.8), -1%, 0); }\n	50% { transform: translate3d(var(--nebula-aberration, 3px), 1%, 0); }\n	75% { transform: translate3d(calc(var(--nebula-aberration, 3px) * 0.5), 0, 0); }\n}\n\n/* Chromatic blue channel - leftward counter-drift */\n@keyframes nebula-chromatic-blue {\n	0%, 100% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1), 0, 0); }\n	25% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -0.5), 1%, 0); }\n	50% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1), -1%, 0); }\n	75% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1.8), 0, 0); }\n}\n\n/* Iridescent core - continuous 360-degree hue rotation (the ONE filter animation) */\n@keyframes nebula-iridescent {\n	0% { filter: hue-rotate(0deg) blur(var(--nebula-blur-core, 12px)) saturate(1.6); }\n	100% { filter: hue-rotate(360deg) blur(var(--nebula-blur-core, 12px)) saturate(1.6); }\n}\n\n/* Bioluminescent tendrils - organic breathing */\n@keyframes nebula-tendrils-breathe {\n	0%, 100% { opacity: 0.6; transform: translate3d(0, 0, 0); }\n	30% { opacity: 0.9; transform: translate3d(1%, -1.5%, 0); }\n	60% { opacity: 0.5; transform: translate3d(-1%, 1.5%, 0); }\n}\n\n/* Quantum particle twinkle - opacity only (cheapest) */\n@keyframes nebula-particle-twinkle {\n	0%, 100% { opacity: 0.7; }\n	15% { opacity: 1; }\n	40% { opacity: 0.5; }\n	65% { opacity: 0.85; }\n	85% { opacity: 0.6; }\n}\n\n/* Idle breathing - gentle pulse when dimmed */\n@keyframes nebula-idle-breathe {\n	0%, 100% {\n		opacity: var(--nebula-idle-opacity, 0.08);\n		filter: blur(calc(var(--nebula-blur-base, 10px) * 8));\n		transform: scale(1);\n	}\n	50% {\n		opacity: calc(var(--nebula-idle-opacity, 0.08) * 1.4);\n		filter: blur(calc(var(--nebula-blur-base, 10px) * 10));\n		transform: scale(1.005);\n	}\n}\n\n/* =============================================================================\n   STATE CLASSES - Control via CSS class toggle (no JS animation calls)\n   ============================================================================= */\n\n.nebula-overlay {\n	contain: strict;\n	pointer-events: none;\n	isolation: isolate;\n}\n\n.nebula-overlay.paused .nebula-layer {\n	animation-play-state: paused !important;\n}\n\n.nebula-overlay.running .nebula-layer {\n	animation-play-state: running !important;\n}\n\n/* Reduced motion - respect user preferences */\n@media (prefers-reduced-motion: reduce) {\n	.nebula-layer {\n		animation: none !important;\n		transition: opacity 0s !important;\n	}\n}\n", document.head.appendChild(e);
		})(), this.state?.autoHideSub && (this.state.autoHideSub.unsubscribe(), this.state.autoHideSub = null);
		let n = a.value;
		if (this.state?.overlay && this.state.isDimmed) return this.state.isDimmed = !1, this.state.options = t, this.awakenOverlay(t, n), void this.scheduleAutoHide(t);
		this.state?.overlay || this.createOverlay(e, t, n), this.scheduleAutoHide(t);
	}
	awakenOverlay(n, r) {
		if (!this.state?.overlay) return;
		let i = this.state.overlay, a = r ? 0 : .6 * n.fadeInDuration, o = r ? "linear" : e(t);
		i.style.setProperty("--nebula-intensity", String(n.intensity)), i.animate([
			{
				opacity: n.idleOpacity,
				transform: "scale(0.98)",
				filter: `blur(${4 * n.blur}px)`
			},
			{
				opacity: .7 * n.intensity,
				transform: "scale(1.01)",
				filter: `blur(${1 * n.blur}px)`
			},
			{
				opacity: n.intensity,
				transform: "scale(1)",
				filter: "blur(0px)"
			}
		], {
			duration: a,
			easing: o,
			fill: "forwards"
		}), i.classList.remove("paused"), i.classList.add("running");
	}
	createOverlay(n, r, i) {
		let a = window.getComputedStyle(n).position, o = n.style.position, s = n.style.overflow, c = n.style.contain;
		a === "static" && (n.style.position = "relative"), n.style.overflow = "hidden", n.style.contain = "paint";
		let l = r.temperature, u = Math.max(0, l), d = Math.max(0, -l), f = r.intensity, p = Math.round(3 + 5 * r.chromaticAberration), m = Math.round(20 + 60 * d), h = Math.round(80 + 80 * d), g = Math.round(20 + 80 * u), _ = Math.round(255 - 55 * u), v = Math.round(100 + 100 * d), y = Math.round(100 * u), b = Math.round(255 - 55 * u), x = Math.round(100 + 55 * d), S = Math.round(255 - 55 * d), C = document.createElement("div");
		if (C.className = "nebula-overlay running", Object.assign(C.style, {
			position: "absolute",
			inset: "-20%",
			zIndex: r.background ? "-1" : "9999",
			opacity: "0",
			"--nebula-intensity": String(f),
			"--nebula-blur-base": 10 * r.blur + "px",
			"--nebula-idle-opacity": String(r.idleOpacity),
			"--nebula-aberration": `${p}px`,
			"--nebula-blur-core": 12 * r.blur + "px"
		}), i) {
			let e = document.createElement("div");
			Object.assign(e.style, {
				position: "absolute",
				inset: "0",
				background: `\n\t\t\t\t\tradial-gradient(ellipse 45% 40% at 50% 50%,\n\t\t\t\t\t\trgba(255,${x},${S},${.12 * f}) 0%,\n\t\t\t\t\t\trgba(${g},100,${_},${.06 * f}) 40%,\n\t\t\t\t\t\ttransparent 70%),\n\t\t\t\t\tradial-gradient(circle 8% at 50% 50%,\n\t\t\t\t\t\trgba(255,255,255,${.15 * f}) 0%,\n\t\t\t\t\t\ttransparent 100%)`,
				filter: `blur(${10 * r.blur}px)`,
				opacity: String(f)
			}), C.appendChild(e);
		} else {
			let e = document.createElement("div");
			e.className = "nebula-layer", Object.assign(e.style, {
				position: "absolute",
				inset: "-5%",
				background: `\n\t\t\t\t\tlinear-gradient(155deg,\n\t\t\t\t\t\ttransparent 0%, transparent 38%,\n\t\t\t\t\t\trgba(8,2,18,${.35 * f}) 44%,\n\t\t\t\t\t\trgba(0,0,0,${.4 * f}) 49%,\n\t\t\t\t\t\trgba(8,2,18,${.35 * f}) 54%,\n\t\t\t\t\t\ttransparent 60%, transparent 100%),\n\t\t\t\t\tlinear-gradient(225deg,\n\t\t\t\t\t\ttransparent 0%, transparent 42%,\n\t\t\t\t\t\trgba(5,0,12,${.28 * f}) 47%,\n\t\t\t\t\t\trgba(0,0,0,${.32 * f}) 50%,\n\t\t\t\t\t\trgba(5,0,12,${.28 * f}) 53%,\n\t\t\t\t\t\ttransparent 58%, transparent 100%),\n\t\t\t\t\tradial-gradient(ellipse 110% 110% at 50% 50%,\n\t\t\t\t\t\ttransparent 35%,\n\t\t\t\t\t\trgba(3,0,8,${.2 * f}) 60%,\n\t\t\t\t\t\trgba(0,0,0,${.35 * f}) 85%),\n\t\t\t\t\tradial-gradient(ellipse 50% 45% at 30% 35%,\n\t\t\t\t\t\trgba(0,0,0,${.3 * f}) 0%,\n\t\t\t\t\t\ttransparent 65%),\n\t\t\t\t\tradial-gradient(ellipse 40% 55% at 70% 65%,\n\t\t\t\t\t\trgba(0,0,0,${.25 * f}) 0%,\n\t\t\t\t\t\ttransparent 60%)`,
				filter: `blur(${4 * r.blur}px)`,
				mixBlendMode: "multiply",
				transform: "translateZ(0)"
			}), C.appendChild(e);
			let t = document.createElement("div");
			t.className = "nebula-layer", Object.assign(t.style, {
				position: "absolute",
				inset: "-15%",
				background: `\n\t\t\t\t\tradial-gradient(ellipse 55% 50% at 48% 50%,\n\t\t\t\t\t\trgba(255,${m},${h},${.14 * f}) 0%,\n\t\t\t\t\t\trgba(255,${m},${h},${.06 * f}) 35%,\n\t\t\t\t\t\ttransparent 65%),\n\t\t\t\t\tradial-gradient(ellipse 30% 35% at 30% 35%,\n\t\t\t\t\t\trgba(255,${v},200,${.1 * f}) 0%,\n\t\t\t\t\t\trgba(255,${v},200,${.03 * f}) 50%,\n\t\t\t\t\t\ttransparent 70%),\n\t\t\t\t\tradial-gradient(ellipse 25% 30% at 65% 70%,\n\t\t\t\t\t\trgba(255,${Math.min(255, m + 30)},${h},${.08 * f}) 0%,\n\t\t\t\t\t\ttransparent 60%)`,
				filter: `blur(${18 * r.blur}px) saturate(1.4)`,
				mixBlendMode: "screen",
				transform: "translateZ(0)",
				animation: `nebula-chromatic-red ${35e3 / r.speed}ms ${De} infinite`
			}), C.appendChild(t);
			let n = document.createElement("div");
			n.className = "nebula-layer", Object.assign(n.style, {
				position: "absolute",
				inset: "-15%",
				background: `\n\t\t\t\t\tradial-gradient(ellipse 50% 55% at 52% 50%,\n\t\t\t\t\t\trgba(${g},100,${_},${.12 * f}) 0%,\n\t\t\t\t\t\trgba(${g},100,${_},${.05 * f}) 35%,\n\t\t\t\t\t\ttransparent 60%),\n\t\t\t\t\tradial-gradient(ellipse 35% 30% at 68% 40%,\n\t\t\t\t\t\trgba(${y},${b},200,${.09 * f}) 0%,\n\t\t\t\t\t\trgba(${y},${b},200,${.03 * f}) 45%,\n\t\t\t\t\t\ttransparent 65%),\n\t\t\t\t\tradial-gradient(ellipse 28% 25% at 35% 65%,\n\t\t\t\t\t\trgba(${g},100,${Math.min(255, _ + 20)},${.07 * f}) 0%,\n\t\t\t\t\t\ttransparent 55%)`,
				filter: `blur(${18 * r.blur}px) saturate(1.4)`,
				mixBlendMode: "screen",
				transform: "translateZ(0)",
				animation: `nebula-chromatic-blue ${35e3 / r.speed}ms ${De} infinite`
			}), C.appendChild(n);
			let i = document.createElement("div");
			i.className = "nebula-layer", Object.assign(i.style, {
				position: "absolute",
				inset: "0",
				background: `\n\t\t\t\t\tradial-gradient(ellipse 20% 22% at 50% 50%,\n\t\t\t\t\t\trgba(255,${x},${S},${.18 * f}) 0%,\n\t\t\t\t\t\trgba(255,${v},200,${.08 * f}) 40%,\n\t\t\t\t\t\trgba(${g},100,${_},${.03 * f}) 65%,\n\t\t\t\t\t\ttransparent 80%),\n\t\t\t\t\tradial-gradient(circle 6% at 50% 50%,\n\t\t\t\t\t\trgba(255,255,255,${.25 * f}) 0%,\n\t\t\t\t\t\trgba(255,240,245,${.1 * f}) 50%,\n\t\t\t\t\t\ttransparent 100%)`,
				mixBlendMode: "screen",
				transform: "translateZ(0)",
				animation: `nebula-iridescent ${28e3 / r.speed}ms linear infinite`
			}), C.appendChild(i);
			let a = document.createElement("div");
			if (a.className = "nebula-layer", Object.assign(a.style, {
				position: "absolute",
				inset: "-12%",
				background: `\n\t\t\t\t\tradial-gradient(ellipse 60% 12% at 50% 48%,\n\t\t\t\t\t\trgba(255,${v},200,${.1 * f}) 0%,\n\t\t\t\t\t\ttransparent 70%),\n\t\t\t\t\tradial-gradient(ellipse 12% 55% at 48% 50%,\n\t\t\t\t\t\trgba(${y},${b},200,${.08 * f}) 0%,\n\t\t\t\t\t\ttransparent 65%),\n\t\t\t\t\tradial-gradient(ellipse 45% 10% at 45% 35%,\n\t\t\t\t\t\trgba(255,${x},${S},${.07 * f}) 0%,\n\t\t\t\t\t\ttransparent 60%),\n\t\t\t\t\tradial-gradient(ellipse 10% 40% at 60% 60%,\n\t\t\t\t\t\trgba(${g},100,${_},${.06 * f}) 0%,\n\t\t\t\t\t\ttransparent 55%)`,
				filter: `blur(${14 * r.blur}px)`,
				mixBlendMode: "screen",
				transform: "translateZ(0)",
				animation: `nebula-tendrils-breathe ${22e3 / r.speed}ms ${Ee} infinite`
			}), C.appendChild(a), r.particleCount > 0) {
				let e = document.createElement("div");
				e.className = "nebula-layer";
				let t = [];
				for (let e = 0; e < r.particleCount; e++) {
					let e = 5 + 90 * Math.random(), n = 5 + 90 * Math.random(), r = .5 + 2 * Math.random(), i = Math.round(360 * Math.random()), a = (.3 + .5 * Math.random()) * f;
					t.push(`radial-gradient(circle ${r}px at ${e}% ${n}%, hsla(${i},80%,70%,${a}) 0%, transparent 100%)`);
				}
				Object.assign(e.style, {
					position: "absolute",
					inset: "0",
					background: t.join(","),
					mixBlendMode: "screen",
					transform: "translateZ(0)",
					animation: `nebula-particle-twinkle ${5e3 / r.speed}ms ${Ee} infinite`
				}), C.appendChild(e);
			}
		}
		n.appendChild(C);
		let w = i ? 0 : r.fadeInDuration, T = i ? "linear" : e(t);
		C.animate([
			{
				opacity: 0,
				transform: "scale(0.85)",
				filter: `blur(${25 * r.blur}px) saturate(0.5)`
			},
			{
				opacity: .3 * r.intensity,
				transform: "scale(0.95)",
				filter: `blur(${12 * r.blur}px) saturate(0.8)`
			},
			{
				opacity: .6 * r.intensity,
				transform: "scale(1.02)",
				filter: `blur(${4 * r.blur}px) saturate(1.1)`
			},
			{
				opacity: .85 * r.intensity,
				transform: "scale(1.005)",
				filter: `blur(${1 * r.blur}px) saturate(1.05)`
			},
			{
				opacity: r.intensity,
				transform: "scale(1)",
				filter: "blur(0px) saturate(1)"
			}
		], {
			duration: w,
			easing: T,
			fill: "forwards"
		}), this.state = {
			element: n,
			overlay: C,
			originalPosition: o,
			originalOverflow: s,
			originalContain: c,
			isDimmed: !1,
			autoHideSub: null,
			options: r,
			reducedMotion: i,
			isVisible: document.visibilityState === "visible"
		}, this.coordinator.register(this, n);
	}
	scheduleAutoHide(e) {
		!this.state || e.autoHideDuration <= 0 || (this.state.autoHideSub = w(e.autoHideDuration).pipe(P(1), L(() => {
			this.state && (this.state.autoHideSub = null, this.hide(this.state.options));
		})).subscribe());
	}
	hide(t) {
		if (!this.state?.overlay || (this.state.autoHideSub && (this.state.autoHideSub.unsubscribe(), this.state.autoHideSub = null), this.state.isDimmed)) return;
		this.state.isDimmed = !0;
		let n = this.state.overlay, r = this.state.options, a = this.state.reducedMotion, o = a ? 0 : t.fadeOutDuration, s = a ? "linear" : e(i);
		if (t.idleOpacity <= 0) return void n.animate([
			{
				opacity: r.intensity,
				transform: "scale(1)",
				filter: "blur(0px) saturate(1)"
			},
			{
				opacity: .4 * r.intensity,
				transform: "scale(0.95)",
				filter: `blur(${8 * r.blur}px) saturate(0.7)`
			},
			{
				opacity: 0,
				transform: "scale(0.9)",
				filter: `blur(${15 * r.blur}px) saturate(0.3)`
			}
		], {
			duration: o,
			easing: s,
			fill: "forwards"
		});
		let c = n.animate([
			{
				opacity: r.intensity,
				transform: "scale(1)",
				filter: "blur(0px) saturate(1)"
			},
			{
				opacity: .5 * r.intensity,
				transform: "scale(0.99)",
				filter: `blur(${3 * r.blur}px) saturate(0.75)`
			},
			{
				opacity: t.idleOpacity,
				transform: "scale(1)",
				filter: `blur(${8 * r.blur}px) saturate(0.4)`
			}
		], {
			duration: o,
			easing: s,
			fill: "forwards"
		});
		t.idleBreathe && !a && y(c.finished).pipe(P(1), T(() => f)).subscribe(() => {
			this.state?.overlay && (this.state.overlay.style.animation = `nebula-idle-breathe ${12e3 / r.speed}ms ${Ee} infinite`);
		});
	}
	cleanup() {
		this.state &&= (this.coordinator.unregister(this, this.state.element), this.state.autoHideSub?.unsubscribe(), this.state.overlay?.remove(), this.state.element.style.position = this.state.originalPosition, this.state.element.style.overflow = this.state.originalOverflow, this.state.element.style.contain = this.state.originalContain, null);
	}
	disconnected() {
		this.cleanup();
	}
	reconnected() {
		this.state && this.coordinator.register(this, this.state.element);
	}
}), je = {
	smooth: t,
	snappy: n,
	bouncy: r,
	gentle: i
}, Me = V(class extends B {
	constructor(e) {
		if (super(e), this.initialized = !1, this.element = null, e.type !== U.ELEMENT) throw Error("reveal() can only be used on elements");
	}
	render(e, t) {
		return R;
	}
	update(t, [n = !1, r = {}]) {
		let i = t.element;
		this.element = i;
		let { preset: o = "smooth", maxHeight: s = "10rem", duration: c, easing: l } = r, u = je[o], d = c ?? u.duration, f = l ?? e(u), p = a.value;
		return this.initialized ||= (this.setupElement(i, d, f, p), !0), n ? (i.style.maxHeight = s, i.style.opacity = "1", i.style.transform = "translateY(0) scale(1)", i.style.pointerEvents = "", i.style.paddingTop = "", i.style.paddingBottom = "", i.style.marginTop = "", i.style.marginBottom = "", i.removeAttribute("aria-hidden"), i.removeAttribute("inert")) : (i.style.maxHeight = "0", i.style.opacity = "0", i.style.transform = "translateY(-8px) scale(0.98)", i.style.pointerEvents = "none", i.style.paddingTop = "0", i.style.paddingBottom = "0", i.style.marginTop = "0", i.style.marginBottom = "0", i.setAttribute("aria-hidden", "true"), i.setAttribute("inert", "")), R;
	}
	setupElement(e, t, n, r) {
		e.style.overflow = "hidden", e.style.transition = r ? "none" : [
			`max-height ${t}ms ${n}`,
			`opacity ${t}ms ${n}`,
			`transform ${t}ms ${n}`,
			`padding ${t}ms ${n}`,
			`margin ${t}ms ${n}`
		].join(", ");
	}
	disconnected() {
		this.element && (this.element.style.willChange = "");
	}
	reconnected() {}
}), Ne = !1, Pe = W(class extends B {
	constructor(...e) {
		super(...e), this.teardown$ = new m();
	}
	render() {}
	update(e) {
		if (e.type !== U.ELEMENT) throw Error("ripple directive must be used on an element");
		this.element = e.element, function() {
			if (Ne) return;
			let e = document.createElement("style");
			e.id = "schmancy-ripple-shared", e.textContent = "\n		.schmancy-ripple-effect {\n			position: absolute;\n			border-radius: 50%;\n			background: var(--schmancy-sys-color-surface-on);\n			opacity: 0.12;\n			transform: scale(0);\n			animation: schmancy-ripple-expand 600ms linear forwards;\n			pointer-events: none;\n			aria-hidden: true;\n		}\n		@keyframes schmancy-ripple-expand {\n			to { transform: scale(4); opacity: 0; }\n		}\n	", document.head.appendChild(e), Ne = !0;
		}(), getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative"), this.element.style.overflow = "hidden", this.teardown$.next(), b(this.element, "click").pipe(F(this.teardown$)).subscribe((e) => this.addRipple(e));
	}
	reconnected() {
		this.teardown$.next(), b(this.element, "click").pipe(F(this.teardown$)).subscribe((e) => this.addRipple(e));
	}
	addRipple(e) {
		let t = this.element.getBoundingClientRect(), n = Math.max(t.width, t.height), r = n / 2, i = document.createElement("span");
		i.className = "schmancy-ripple-effect", i.setAttribute("aria-hidden", "true"), i.style.width = `${n}px`, i.style.height = `${n}px`, i.style.left = e.clientX - t.left - r + "px", i.style.top = e.clientY - t.top - r + "px", this.element.appendChild(i), b(i, "animationend").pipe(P(1)).subscribe(() => i.remove());
	}
	disconnected() {
		this.teardown$.next();
	}
}), Fe = class {
	constructor(e = .3) {
		this.audioContext = new AudioContext(), this.volume = Math.max(0, Math.min(1, e));
	}
	playKeyPress() {
		let e = this.audioContext.currentTime, t = this.audioContext.createOscillator(), n = this.audioContext.createGain(), r = 800 + 200 * Math.random();
		t.frequency.setValueAtTime(r, e), t.type = "sine", n.gain.setValueAtTime(0, e), n.gain.linearRampToValueAtTime(.2 * this.volume, e + .005), n.gain.exponentialRampToValueAtTime(.001, e + .03), t.connect(n), n.connect(this.audioContext.destination), t.start(e), t.stop(e + .03);
		let i = this.audioContext.createOscillator(), a = this.audioContext.createGain();
		i.frequency.setValueAtTime(1800 + 400 * Math.random(), e), i.type = "sine", a.gain.setValueAtTime(0, e), a.gain.linearRampToValueAtTime(.08 * this.volume, e + .003), a.gain.exponentialRampToValueAtTime(.001, e + .015), i.connect(a), a.connect(this.audioContext.destination), i.start(e), i.stop(e + .015);
	}
	playDelete() {
		let e = this.audioContext.currentTime, t = this.audioContext.createOscillator(), n = this.audioContext.createGain();
		t.frequency.setValueAtTime(600, e), t.frequency.exponentialRampToValueAtTime(200, e + .04), t.type = "sine", n.gain.setValueAtTime(0, e), n.gain.linearRampToValueAtTime(.12 * this.volume, e + .005), n.gain.exponentialRampToValueAtTime(.001, e + .04), t.connect(n), n.connect(this.audioContext.destination), t.start(e), t.stop(e + .04);
	}
	cleanup() {
		this.audioContext.close();
	}
}, Ie = V(class extends B {
	constructor(...e) {
		super(...e), this.state = null, this.soundEngine = null;
	}
	render(e, t = {}) {
		return R;
	}
	update(e, [t, n = {}]) {
		let r = e.element;
		if (!this.state || JSON.stringify(this.state.phrases) === JSON.stringify(t) && JSON.stringify(this.state.options) === JSON.stringify(n) || this.cleanup(), !this.state) {
			let e = {
				typeSpeed: 50,
				deleteSpeed: 30,
				pauseDuration: 1500,
				loop: !0,
				selector: ".typed",
				cursor: !1,
				finalMessage: "",
				sound: !0,
				volume: .08
			};
			if (this.state = {
				phrases: t,
				options: {
					...e,
					...n
				},
				element: r
			}, this.state.options.sound && (this.soundEngine = new Fe(this.state.options.volume)), this.state.targetElement = r.querySelector(this.state.options.selector) ?? void 0, !this.state.targetElement) return R;
			if (this.state.options.cursor) {
				this.state.targetElement.style.position = "relative", this.state.targetElement.style.display = "inline-block";
				let e = document.createElement("span");
				if (e.className = "typewriter-cursor", e.textContent = "|", e.style.cssText = "\n					display: inline-block;\n					margin-left: 2px;\n					animation: typewriter-blink 1s step-end infinite;\n				", this.state.targetElement.appendChild(e), !document.getElementById("typewriter-styles")) {
					let e = document.createElement("style");
					e.id = "typewriter-styles", e.textContent = "\n						@keyframes typewriter-blink {\n							0%, 50% { opacity: 1; }\n							51%, 100% { opacity: 0; }\n						}\n					", document.head.appendChild(e);
				}
			}
			this.startTyping();
		}
		return R;
	}
	startTyping() {
		if (!this.state || !this.state.targetElement) return;
		let { phrases: e, options: t, targetElement: n } = this.state, r = (e, r = !0) => _(v(() => _(...e.split("").map((e) => C(e).pipe(E(t.typeSpeed), L((e) => {
			let t = this.getTextNode(n);
			t && (t.textContent += e), this.soundEngine && this.soundEngine.playKeyPress();
		}))))), C(null).pipe(E(t.pauseDuration)), r ? v(() => {
			let r = e.length;
			return x(t.deleteSpeed).pipe(P(r), L(() => {
				let e = this.getTextNode(n);
				e && e.textContent && (e.textContent = e.textContent.slice(0, -1)), this.soundEngine && this.soundEngine.playDelete();
			}));
		}) : f, r ? C(null).pipe(E(200)) : f), i = _(...e.map((e) => r(e))), a = t.finalMessage ? _(i, r(t.finalMessage, !1)) : i;
		this.state.subscription = (t.loop ? i.pipe(M()) : a).subscribe({ error: (e) => {} });
	}
	getTextNode(e) {
		for (let t of Array.from(e.childNodes)) if (t.nodeType === Node.TEXT_NODE) return t;
		let t = document.createTextNode("");
		return e.insertBefore(t, e.firstChild), t;
	}
	cleanup() {
		this.state &&= (this.state.subscription && this.state.subscription.unsubscribe(), this.state.targetElement && this.state.targetElement.querySelector(".typewriter-cursor")?.remove(), this.soundEngine &&= (this.soundEngine.cleanup(), null), null);
	}
	disconnected() {
		this.cleanup();
	}
	reconnected() {
		this.state && !this.state.subscription && this.startTyping();
	}
});
export { de as DragDirective, pe as DropDirective, ie as animateText, ae as color, se as confirmClick, o as cursorGlow, ce as cycleText, le as depthOfField, fe as drag, me as drop, l as fromResizeObserver, s as fullHeight, c as fullWidth, he as gravity, ge as intersect, be as liquid, Ce as livingBorder, we as longPress, u as magnetic, Ae as nebula, a as reducedMotion$, Me as reveal, Pe as ripple, Ie as typewriter };
