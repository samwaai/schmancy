import { a as e, o as t } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t as n } from "./provide-BuzyBLGj.js";
import { t as r } from "./decorate-D_utPUsC.js";
import { t as i } from "./litElement.mixin-BnNYZ24e.js";
import { t as a } from "./hashContent-B2IntJQf.js";
import { timer as o } from "rxjs";
import { takeUntil as s } from "rxjs/operators";
import { customElement as c, property as l, queryAssignedElements as u, state as d } from "lit/decorators.js";
import { html as f } from "lit";
import { AsyncDirective as p } from "lit/async-directive.js";
import { PartType as m, directive as h } from "lit/directive.js";
import { nothing as g } from "lit/html.js";
import { cache as _ } from "lit/directives/cache.js";
var v, y = /* @__PURE__ */ new WeakMap(), b = 0, x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new WeakSet(), C = () => new Promise((e) => requestAnimationFrame(e)), w = [{
	transform: "translateY(100%) scale(0)",
	opacity: 0
}], T = [{
	transform: "translateY(-100%) scale(0)",
	opacity: 0
}], E = [{ opacity: 0 }, { opacity: 1 }], D = (e, t) => {
	let n = e - t;
	return n === 0 ? void 0 : n;
}, O = (e, t) => {
	let n = e / t;
	return n === 1 ? void 0 : n;
}, k = {
	left: (e, t) => {
		let n = D(e, t);
		return {
			value: n,
			transform: n == null || isNaN(n) ? void 0 : `translateX(${n}px)`
		};
	},
	top: (e, t) => {
		let n = D(e, t);
		return {
			value: n,
			transform: n == null || isNaN(n) ? void 0 : `translateY(${n}px)`
		};
	},
	width: (e, t) => {
		let n;
		t === 0 && (t = 1, n = { width: "1px" });
		let r = O(e, t);
		return {
			value: r,
			overrideFrom: n,
			transform: r == null || isNaN(r) ? void 0 : `scaleX(${r})`
		};
	},
	height: (e, t) => {
		let n;
		t === 0 && (t = 1, n = { height: "1px" });
		let r = O(e, t);
		return {
			value: r,
			overrideFrom: n,
			transform: r == null || isNaN(r) ? void 0 : `scaleY(${r})`
		};
	}
}, A = {
	duration: 333,
	easing: "ease-in-out"
}, j = [
	"left",
	"top",
	"width",
	"height",
	"opacity",
	"color",
	"background"
], M = /* @__PURE__ */ new WeakMap(), N = h(class extends p {
	constructor(e) {
		if (super(e), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, e.type === m.CHILD) throw Error("The `animate` directive must be used in attribute position.");
		this.createFinished();
	}
	createFinished() {
		this.resolveFinished?.(), this.finished = new Promise((e) => {
			this.l = e;
		});
	}
	async resolveFinished() {
		this.l?.(), this.l = void 0;
	}
	render(e) {
		return g;
	}
	getController() {
		return y.get(this.u);
	}
	isDisabled() {
		return this.options.disabled || this.getController()?.disabled;
	}
	update(e, [t]) {
		let n = this.u === void 0;
		return n && (this.u = e.options?.host, this.u.addController(this), this.u.updateComplete.then((e) => this.t = !0), this.element = e.element, M.set(this.element, this)), this.optionsOrCallback = t, (n || typeof t != "function") && this.m(t), this.render(t);
	}
	m(e) {
		e ??= {};
		let t = this.getController();
		t !== void 0 && ((e = {
			...t.defaultOptions,
			...e
		}).keyframeOptions = {
			...t.defaultOptions.keyframeOptions,
			...e.keyframeOptions
		}), e.properties ??= j, this.options = e;
	}
	p() {
		let e = {}, t = this.element.getBoundingClientRect(), n = getComputedStyle(this.element);
		return this.options.properties.forEach((r) => {
			let i = t[r] ?? (k[r] ? void 0 : n[r]), a = Number(i);
			e[r] = isNaN(a) ? i + "" : a;
		}), e;
	}
	v() {
		let e, t = !0;
		return this.options.guard && (e = this.options.guard(), t = ((e, t) => {
			if (Array.isArray(e)) {
				if (Array.isArray(t) && t.length === e.length && e.every((e, n) => e === t[n])) return !1;
			} else if (t === e) return !1;
			return !0;
		})(e, this._)), this.h = this.t && !this.isDisabled() && !this.isAnimating() && t && this.element.isConnected, this.h && (this._ = Array.isArray(e) ? Array.from(e) : e), this.h;
	}
	hostUpdate() {
		typeof this.optionsOrCallback == "function" && this.m(this.optionsOrCallback()), this.v() && (this.A = this.p(), this.i = this.i ?? this.element.parentNode, this.o = this.element.nextSibling);
	}
	async hostUpdated() {
		if (!this.h || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered) return;
		let e;
		this.prepare(), await C;
		let t = this.P(), n = this.V(this.options.keyframeOptions, t), r = this.p();
		if (this.A !== void 0) {
			let { from: n, to: i } = this.O(this.A, r, t);
			this.log("measured", [
				this.A,
				r,
				n,
				i
			]), e = this.calculateKeyframes(n, i);
		} else {
			let n = x.get(this.options.inId);
			if (n) {
				x.delete(this.options.inId);
				let { from: i, to: a } = this.O(n, r, t);
				e = this.calculateKeyframes(i, a), e = this.options.in ? [
					{
						...this.options.in[0],
						...e[0]
					},
					...this.options.in.slice(1),
					e[1]
				] : e, b++, e.forEach((e) => e.zIndex = b);
			} else this.options.in && (e = [...this.options.in, {}]);
		}
		this.animate(e, n);
	}
	resetStyles() {
		this.j !== void 0 && (this.element.setAttribute("style", this.j ?? ""), this.j = void 0);
	}
	commitStyles() {
		this.j = this.element.getAttribute("style"), this.webAnimation?.commitStyles(), this.webAnimation?.cancel();
	}
	reconnected() {}
	async disconnected() {
		if (!this.h || (this.options.id !== void 0 && x.set(this.options.id, this.A), this.options.out === void 0)) return;
		if (this.prepare(), await C(), this.i?.isConnected) {
			let e = this.o && this.o.parentNode === this.i ? this.o : null;
			if (this.i.insertBefore(this.element, e), this.options.stabilizeOut) {
				let e = this.p();
				this.log("stabilizing out");
				let t = this.A.left - e.left, n = this.A.top - e.top;
				getComputedStyle(this.element).position !== "static" || t === 0 && n === 0 || (this.element.style.position = "relative"), t !== 0 && (this.element.style.left = t + "px"), n !== 0 && (this.element.style.top = n + "px");
			}
		}
		let e = this.V(this.options.keyframeOptions);
		await this.animate(this.options.out, e), this.element.remove();
	}
	prepare() {
		this.createFinished();
	}
	start() {
		this.options.onStart?.(this);
	}
	didFinish(e) {
		e && this.options.onComplete?.(this), this.A = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
	}
	P() {
		let e = [];
		for (let t = this.element.parentNode; t; t = t?.parentNode) {
			let n = M.get(t);
			n && !n.isDisabled() && n && e.push(n);
		}
		return e;
	}
	get isHostRendered() {
		let e = S.has(this.u);
		return e || this.u.updateComplete.then(() => {
			S.add(this.u);
		}), e;
	}
	V(e, t = this.P()) {
		let n = { ...A };
		return t.forEach((e) => Object.assign(n, e.options.keyframeOptions)), Object.assign(n, e), n;
	}
	O(e, t, n) {
		e = { ...e }, t = { ...t };
		let r = n.map((e) => e.animatingProperties).filter((e) => e !== void 0), i = 1, a = 1;
		return r.length > 0 && (r.forEach((e) => {
			e.width && (i /= e.width), e.height && (a /= e.height);
		}), e.left !== void 0 && t.left !== void 0 && (e.left = i * e.left, t.left = i * t.left), e.top !== void 0 && t.top !== void 0 && (e.top = a * e.top, t.top = a * t.top)), {
			from: e,
			to: t
		};
	}
	calculateKeyframes(e, t, n = !1) {
		let r = {}, i = {}, a = !1, o = {};
		for (let n in t) {
			let s = e[n], c = t[n];
			if (n in k) {
				let e = k[n];
				if (s === void 0 || c === void 0) continue;
				let t = e(s, c);
				t.transform !== void 0 && (o[n] = t.value, a = !0, r.transform = `${r.transform ?? ""} ${t.transform}`, t.overrideFrom !== void 0 && Object.assign(r, t.overrideFrom));
			} else s !== c && s !== void 0 && c !== void 0 && (a = !0, r[n] = s, i[n] = c);
		}
		return r.transformOrigin = i.transformOrigin = n ? "center center" : "top left", this.animatingProperties = o, a ? [r, i] : void 0;
	}
	async animate(e, t = this.options.keyframeOptions) {
		this.start(), this.frames = e;
		let n = !1;
		if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = e = this.options.onFrames(this), this.log("modified frames", e)), e !== void 0)) {
			this.log("animate", [e, t]), n = !0, this.webAnimation = this.element.animate(e, t);
			let r = this.getController();
			r?.add(this);
			try {
				await this.webAnimation.finished;
			} catch {}
			r?.remove(this);
		}
		return this.didFinish(n), n;
	}
	isAnimating() {
		return this.webAnimation?.playState === "running" || this.webAnimation?.pending;
	}
	log(e, t) {
		this.shouldLog && this.isDisabled();
	}
}), P = [
	"top",
	"right",
	"bottom",
	"left"
], F = (h(class extends p {
	constructor(e) {
		if (super(e), e.type !== m.ELEMENT) throw Error("The `position` directive must be used in attribute position.");
	}
	render(e, t) {
		return g;
	}
	update(e, [t, n]) {
		return this.u === void 0 && (this.u = e.options?.host, this.u.addController(this)), this.C = e.element, this.N = t, this.S = n ?? [
			"left",
			"top",
			"width",
			"height"
		], this.render(t, n);
	}
	hostUpdated() {
		this.F();
	}
	F() {
		let e = typeof this.N == "function" ? this.N() : this.N?.value, t = e.offsetParent;
		if (e === void 0 || !t) return;
		let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
		this.S?.forEach((e) => {
			let t = P.includes(e) ? n[e] - r[e] : n[e];
			this.C.style[e] = t + "px";
		});
	}
}), t("delay-context")), I = v = class extends i() {
	constructor(...e) {
		super(...e), this.delay = 0, this.motion = "flyBelow", this.rendered = !1, this.parentDelay = 0, this.effectiveDelay = 0, this.once = !0, this.sessionKey = "";
	}
	firstUpdated() {
		this.observeSlotChanges(), this.updateRenderState();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.mutationObserver?.disconnect();
	}
	observeSlotChanges() {
		let e = this.shadowRoot?.querySelector("slot");
		e && (this.mutationObserver = new MutationObserver(() => {
			this.sessionKey = this.generateSessionKey();
		}), this.mutationObserver.observe(e, {
			childList: !0,
			subtree: !0
		}));
	}
	getTotalSiblingDelay(e) {
		if (!(e && e instanceof HTMLElement)) return 0;
		let t = 0, n = e.previousElementSibling;
		for (; n;) n instanceof v && (t += n.delay), n = n.previousElementSibling;
		return e.parentElement && (t += this.getTotalSiblingDelay(e.parentElement)), t;
	}
	updateRenderState() {
		if (this.sessionKey = this.generateSessionKey(), this.once && sessionStorage.getItem(this.sessionKey) === "true") return void (this.rendered = !0);
		let e = this.getTotalSiblingDelay(this);
		this.effectiveDelay = this.delay + this.parentDelay + e, o(this.effectiveDelay).pipe(s(this.disconnecting)).subscribe(() => {
			if (this.rendered = !0, this.once) try {
				sessionStorage.setItem(this.sessionKey, "true");
			} catch {}
		});
	}
	generateSessionKey() {
		let e = this.assignedElements.map((e) => e.outerHTML).join("");
		return this.once ? a(e) : "";
	}
	get motionLit() {
		return this.motion === "flyBelow" ? w : this.motion === "flyAbove" ? T : E;
	}
	render() {
		return _(this.rendered ? f`<div
						${N({
			in: this.motionLit,
			keyframeOptions: {
				duration: 300,
				easing: "ease-out"
			}
		})}
					>
						<slot></slot>
					</div>` : f`
						<section style="display: none;">
							<slot></slot>
						</section>
					`);
	}
};
r([l({
	type: Number,
	reflect: !0
})], I.prototype, "delay", void 0), r([l({ type: String })], I.prototype, "motion", void 0), r([d()], I.prototype, "rendered", void 0), r([e({
	context: F,
	subscribe: !0
})], I.prototype, "parentDelay", void 0), r([n({ context: F })], I.prototype, "effectiveDelay", void 0), r([l({ type: Boolean })], I.prototype, "once", void 0), r([u({ flatten: !0 })], I.prototype, "assignedElements", void 0), I = v = r([c("schmancy-delay")], I);
export { F as n, I as t };
