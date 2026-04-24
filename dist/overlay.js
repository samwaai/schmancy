import { n as e } from "./chunk-BM5alsTp.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { t as r } from "./lazy-D6R5N5v4.js";
import { f as i, o as a, u as o, v as s } from "./animation-hXFClrIn.js";
import { BehaviorSubject as c, EMPTY as l, Observable as u, Subject as d, defaultIfEmpty as f, defer as p, distinctUntilChanged as m, filter as h, firstValueFrom as g, fromEvent as _, map as v, merge as y, switchMap as b, take as x, takeUntil as S, tap as C } from "rxjs";
import { customElement as w, property as T, query as E } from "lit/decorators.js";
import { css as D, html as O, nothing as k, render as A } from "lit";
import { when as j } from "lit/directives/when.js";
import { choose as M } from "lit/directives/choose.js";
function N(e, t) {
	if (s()) return t === "in" ? {
		keyframes: [{
			opacity: 0,
			transform: "none"
		}, {
			opacity: 1,
			transform: "none"
		}],
		options: {
			duration: 1,
			easing: "linear",
			fill: "forwards"
		}
	} : {
		keyframes: [{
			opacity: 1,
			transform: "none"
		}, {
			opacity: 0,
			transform: "none"
		}],
		options: {
			duration: 1,
			easing: "linear",
			fill: "forwards"
		}
	};
	switch (e) {
		case "centered": return t === "in" ? {
			keyframes: [{
				opacity: 0,
				transform: "scale(0.92) translateY(16px)"
			}, {
				opacity: 1,
				transform: "scale(1) translateY(0)"
			}],
			options: {
				duration: i.duration,
				easing: i.easingFallback,
				fill: "forwards"
			}
		} : {
			keyframes: [{
				opacity: 1,
				transform: "scale(1) translateY(0)"
			}, {
				opacity: 0,
				transform: "scale(0.96) translateY(8px)"
			}],
			options: {
				duration: 150,
				easing: a,
				fill: "forwards"
			}
		};
		case "sheet": return t === "in" ? {
			keyframes: [{
				opacity: 0,
				transform: "translateY(100%)"
			}, {
				opacity: 1,
				transform: "translateY(0)"
			}],
			options: {
				duration: o.duration,
				easing: o.easingFallback,
				fill: "forwards"
			}
		} : {
			keyframes: [{
				opacity: 1,
				transform: "translateY(0)"
			}, {
				opacity: 0,
				transform: "translateY(100%)"
			}],
			options: {
				duration: 150,
				easing: a,
				fill: "forwards"
			}
		};
		case "anchored": return t === "in" ? {
			keyframes: [{ opacity: 0 }, { opacity: 1 }],
			options: {
				duration: i.duration,
				easing: i.easingFallback,
				fill: "forwards"
			}
		} : {
			keyframes: [{ opacity: 1 }, { opacity: 0 }],
			options: {
				duration: 150,
				easing: a,
				fill: "forwards"
			}
		};
	}
}
var P = "overlay-mount", F = class extends n(D`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 10000);
		display: contents;
		pointer-events: none;
	}
	dialog {
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		overflow: visible;
		max-width: none;
		max-height: none;
		pointer-events: auto;
	}
	dialog::backdrop {
		background: rgba(12, 12, 16, 0.28);
		backdrop-filter: blur(18px) saturate(150%);
		-webkit-backdrop-filter: blur(18px) saturate(150%);
	}
	.surface {
		position: fixed;
		pointer-events: auto;
		max-width: calc(100vw - 2rem);
		max-height: 90dvh;
		overflow: auto;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		background: var(--schmancy-sys-color-surface, #ffffff);
		box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.35);
	}
	.surface[data-layout='centered'] {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.surface[data-layout='sheet'] {
		left: 0;
		right: 0;
		bottom: 0;
		max-width: none;
		max-height: 90dvh;
		width: 100%;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px) var(--schmancy-sys-shape-corner-large, 16px) 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.surface[data-layout='anchored'] {
		max-width: min(480px, calc(100vw - 2rem));
		box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.28);
	}
	.drag-handle {
		display: flex;
		justify-content: center;
		padding: 8px 0 4px;
		touch-action: none;
		cursor: grab;
	}
	.drag-handle::before {
		content: '';
		width: 40px;
		height: 4px;
		border-radius: 999px;
		background: var(--schmancy-sys-color-outline-variant, #cac4cf);
	}
	@media (prefers-reduced-motion: reduce) {
		.surface { box-shadow: var(--schmancy-sys-elevation-2, 0 2px 6px rgba(0,0,0,0.2)); }
	}
`) {
	constructor(...e) {
		super(...e), this.layout = "centered", this.dismissable = !0, this.modal = !0, this._closed$ = new d(), this._mounted = !1, this._closing = !1;
	}
	get closed$() {
		return this._closed$.asObservable();
	}
	async open(e, t) {
		if (this._mounted) throw Error("schmancy-overlay: open() called twice on the same element");
		this._mounted = !0, this.dismissable = !1 !== t.dismissable, await this.updateComplete;
		let n = this.renderRoot.querySelector(`#${P}`);
		if (!n) throw Error("schmancy-overlay: mount point missing");
		await I(e, n, t.props);
		let r = {
			width: window.innerWidth,
			height: window.innerHeight,
			isCoarsePointer: window.matchMedia("(pointer: coarse)").matches
		}, i = {
			width: n.scrollWidth,
			height: n.scrollHeight
		}, a = function(e) {
			let { anchor: t, content: n, viewport: r } = e, i = r.width < 640, a = r.isCoarsePointer, o = n.height > .8 * r.height, s = n.width > .9 * r.width;
			return i || a || o || s ? "sheet" : t === void 0 ? "centered" : "anchored";
		}({
			anchor: t.anchor,
			content: i,
			viewport: r
		});
		this.layout = a;
		let o = t.modal ?? (a === "centered" || a === "sheet");
		this.modal = o, await this.updateComplete, o ? this._dialog.showModal() : this._dialog.show(), a === "anchored" && t.anchor && this.positionAnchored(t.anchor), this.wireCloseTriggers(t.signal), await this.playEnterAnimations();
	}
	async close(e, t) {
		if (!this._closing && this._mounted) {
			this._closing = !0;
			try {
				await this.playExitAnimations();
			} catch {}
			try {
				this._dialog?.close();
			} catch {}
			this._closed$.next({
				reason: e,
				result: t
			}), this._closed$.complete();
		}
	}
	wireCloseTriggers(e) {
		let t = this.disconnecting;
		if (_(this._dialog, "close").pipe(h(() => !this._closing), C(() => {
			let e = this._dialog.returnValue;
			e !== "" && e !== void 0 ? this.close("native-submit", e) : this.close("escape");
		}), S(t)).subscribe(), _(this, "close").pipe(h((e) => e instanceof CustomEvent), h((e) => e.target !== this._dialog), C((e) => {
			e.stopPropagation(), this.close("structured", e.detail);
		}), S(t)).subscribe(), _(this._dialog, "cancel").pipe(C((e) => {
			this.dismissable || e.preventDefault();
		}), S(t)).subscribe(), _(this._dialog, "click").pipe(h((e) => this.dismissable && e.target === this._dialog), C(() => {
			this.close("backdrop");
		}), S(t)).subscribe(), this.layout === "sheet" && this.dismissable) {
			let e = this.renderRoot.querySelector(".drag-handle");
			(function(e) {
				let { surface: t, dragHandle: n, until$: r } = e;
				return new u((e) => {
					let i = n ?? t, a = new d(), o = !1, s = 0, c = 0, l = 0;
					return y(_(i, "touchstart", { passive: !0 }).pipe(h((e) => e.touches.length === 1), h((e) => {
						if (n) return !0;
						let r = e.touches[0], i = t.getBoundingClientRect();
						return r.clientY - i.top <= 40;
					}), C((e) => {
						o = !0, s = e.touches[0].clientY, c = performance.now(), l = 0, t.style.transition = "none", t.style.willChange = "transform";
					})), _(t, "touchmove", { passive: !1 }).pipe(h(() => o), h((e) => e.touches.length === 1), C((e) => {
						let n = e.touches[0].clientY - s;
						l = n < 0 ? .2 * n : n, t.style.transform = `translateY(${l}px)`, e.preventDefault();
					})), y(_(t, "touchend", { passive: !0 }), _(t, "touchcancel", { passive: !0 })).pipe(h(() => o), C(() => {
						o = !1;
						let n = Math.max(1, performance.now() - c), r = l / n, i = t.getBoundingClientRect().height, a = Math.min(80, .3 * i), s = l > a || l > 20 && r > .5;
						t.style.willChange = "", s ? (t.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)", t.style.transform = "translateY(100%)", e.next("dismiss"), e.complete()) : (t.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)", t.style.transform = "translateY(0)");
					}))).pipe(S(y(a, r))).subscribe(), () => {
						a.next(), a.complete(), t.style.transition = "", t.style.transform = "", t.style.willChange = "";
					};
				}).pipe(x(1));
			})({
				surface: this._surface,
				dragHandle: e,
				until$: y(t, this._closed$)
			}).pipe(x(1)).subscribe(() => {
				this.close("swipe");
			});
		}
		e && (e.aborted ? queueMicrotask(() => {
			this.close("abort");
		}) : _(e, "abort").pipe(x(1), C(() => {
			this.close("abort");
		}), S(t)).subscribe());
	}
	positionAnchored(e) {
		let t = function(e) {
			if (e instanceof Element) {
				let t = e.getBoundingClientRect();
				return {
					top: t.top,
					left: t.left,
					right: t.right,
					bottom: t.bottom,
					width: t.width,
					height: t.height
				};
			}
			if ("clientX" in e && "clientY" in e) return {
				top: e.clientY,
				left: e.clientX,
				right: e.clientX,
				bottom: e.clientY,
				width: 0,
				height: 0
			};
			let t = e;
			return {
				top: t.y,
				left: t.x,
				right: t.x,
				bottom: t.y,
				width: 0,
				height: 0
			};
		}(e), n = this._surface.getBoundingClientRect(), r = window.innerWidth, i = window.innerHeight, a = t.bottom + 8;
		if (a + n.height > i - 16) {
			let e = t.top - 8 - n.height;
			a = e >= 16 ? e : Math.max(16, i - 16 - n.height);
		}
		let o = t.left;
		o + n.width > r - 16 && (o = r - 16 - n.width), o < 16 && (o = 16), this._surface.style.top = `${a}px`, this._surface.style.left = `${o}px`, this._surface.style.transform = "none";
	}
	async playEnterAnimations() {
		let e = this._dialog, t = this._surface;
		if (!e || !t) return;
		let n = N(this.layout, "in");
		await t.animate(n.keyframes, n.options).finished.catch(() => {});
	}
	async playExitAnimations() {
		let e = this._surface;
		if (!e) return;
		let t = N(this.layout, "out");
		await e.animate(t.keyframes, t.options).finished.catch(() => {});
	}
	render() {
		return O`
			<dialog>
				<section
					class="surface"
					data-layout=${this.layout}
					role="dialog"
					aria-modal=${this.modal ? "true" : "false"}
				>
					${j(this.layout === "sheet", () => O`<div class="drag-handle" role="button" aria-label="Dismiss" tabindex="0"></div>`)}
					<div id=${P}></div>
				</section>
			</dialog>
		`;
	}
};
async function I(e, t, n) {
	if (typeof (r = e) == "object" && r !== null && "_$litType$" in r) return A(e, t), t;
	var r;
	if (e instanceof HTMLElement) return n && Object.assign(e, n), t.appendChild(e), e;
	if (function(e) {
		return typeof e == "function" && ("preload" in e || "_promise" in e);
	}(e)) return I((await e()).default, t, n);
	if (typeof e == "function") {
		let r = new e();
		return n && Object.assign(r, n), t.appendChild(r), r;
	}
	if (typeof e == "string") {
		let r = document.createElement(e);
		return n && Object.assign(r, n), t.appendChild(r), r;
	}
	throw Error("schmancy-overlay: unsupported content type");
}
t([T({
	type: String,
	reflect: !0
})], F.prototype, "layout", void 0), t([T({
	type: Boolean,
	reflect: !0
})], F.prototype, "dismissable", void 0), t([T({
	type: Boolean,
	reflect: !0
})], F.prototype, "modal", void 0), t([E("dialog")], F.prototype, "_dialog", void 0), t([E(".surface")], F.prototype, "_surface", void 0), F = t([w("schmancy-overlay")], F);
var L = e({ SchmancyOverlayPromptBody: () => R }), R = class extends n(D`
	:host {
		display: block;
		padding: 20px 24px;
		min-width: 280px;
		max-width: 480px;
		color: var(--schmancy-sys-color-on-surface, #1a1a1a);
		background: var(--schmancy-sys-color-surface, #ffffff);
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
	}
	:host([variant='danger']) .cta-confirm {
		background: var(--schmancy-sys-color-error, #b3261e);
		color: var(--schmancy-sys-color-on-error, #ffffff);
	}
`) {
	constructor(...e) {
		super(...e), this.confirmText = "Confirm", this.cancelText = "Cancel", this.variant = "default", this.mode = "confirm", this.defaultValue = "", this.inputType = "text", this.required = !1, this.handleCancel = () => {
			this.dismiss(this.mode === "prompt" && null);
		}, this.handleConfirm = () => {
			if (this.mode === "prompt") {
				let e = this._input;
				if (e && !e.reportValidity()) return;
				this.dismiss(e?.value ?? "");
			} else this.dismiss(!0);
		}, this.handleSubmit = (e) => {
			e.preventDefault(), this.handleConfirm();
		};
	}
	firstUpdated() {
		this.mode === "prompt" && queueMicrotask(() => this._input?.focus());
	}
	dismiss(e) {
		this.dispatchEvent(new CustomEvent("close", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return O`
			<form @submit=${this.handleSubmit}>
				${j(this.heading, () => O`<h2 class="text-lg font-semibold mb-1">${this.heading}</h2>`)}
				${j(this.subtitle, () => O`<p class="text-sm opacity-70 mb-2">${this.subtitle}</p>`)}
				${M(this.mode, [["prompt", () => O`
								${j(this.label, () => O`<label class="block text-sm mb-1">${this.label}</label>`)}
								<input
									type=${this.inputType}
									.value=${this.defaultValue}
									placeholder=${this.placeholder ?? k}
									pattern=${this.pattern ?? k}
									?required=${this.required}
									class="w-full px-3 py-2 rounded-md border border-outline-variant text-base mb-2"
								/>
								${j(this.message, () => O`<p class="text-sm mb-3">${this.message}</p>`)}
							`]], () => O`${j(this.message, () => O`<p class="text-sm mb-4">${this.message}</p>`)}`)}

				<div class="flex justify-end gap-2 mt-4">
					<button
						type="button"
						@click=${this.handleCancel}
						class="px-4 py-2 rounded-md border border-outline-variant bg-transparent cursor-pointer"
					>
						${this.cancelText}
					</button>
					<button
						type="submit"
						class="cta-confirm px-4 py-2 rounded-md border-0 bg-primary text-on-primary cursor-pointer font-medium"
					>
						${this.confirmText}
					</button>
				</div>
			</form>
		`;
	}
};
t([T({ type: String })], R.prototype, "heading", void 0), t([T({ type: String })], R.prototype, "subtitle", void 0), t([T({ type: String })], R.prototype, "message", void 0), t([T({
	type: String,
	attribute: "confirm-text"
})], R.prototype, "confirmText", void 0), t([T({
	type: String,
	attribute: "cancel-text"
})], R.prototype, "cancelText", void 0), t([T({
	type: String,
	reflect: !0
})], R.prototype, "variant", void 0), t([T({ type: String })], R.prototype, "mode", void 0), t([T({ type: String })], R.prototype, "label", void 0), t([T({
	type: String,
	attribute: "default-value"
})], R.prototype, "defaultValue", void 0), t([T({ type: String })], R.prototype, "placeholder", void 0), t([T({
	type: String,
	attribute: "input-type"
})], R.prototype, "inputType", void 0), t([T({ type: String })], R.prototype, "pattern", void 0), t([T({ type: Boolean })], R.prototype, "required", void 0), t([E("input")], R.prototype, "_input", void 0), R = t([w("schmancy-overlay-prompt-body")], R);
var z = new c([]), B = z.asObservable(), V = !1, H = "", U = "";
z.pipe(v((e) => e.length > 0), m()).subscribe((e) => {
	typeof document < "u" && (e && !V ? (H = document.documentElement.style.overflow, U = document.documentElement.style.getPropertyValue("scrollbar-gutter"), document.documentElement.style.overflow = "hidden", document.documentElement.style.setProperty("scrollbar-gutter", "stable"), V = !0) : !e && V && (document.documentElement.style.overflow = H, U ? document.documentElement.style.setProperty("scrollbar-gutter", U) : document.documentElement.style.removeProperty("scrollbar-gutter"), H = "", U = "", V = !1));
});
var W = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Set();
function K(e, t) {
	W.add(e), W.size === 1 && function(e) {
		let t = e.parentElement ?? document.body;
		for (let n = 0; n < t.children.length; n++) {
			let r = t.children[n];
			r !== e && r instanceof HTMLElement && !r.inert && (r.inert = !0, G.add(r));
		}
	}(t);
}
function q(e) {
	W.delete(e), W.size === 0 && function() {
		for (let e of G) e.inert = !1;
		G.clear();
	}();
}
var J = B;
function Y(e, t = {}) {
	return p(() => new u((n) => {
		let r = null, i = null, a = !1, o = !1, s = new d();
		return (async () => {
			try {
				r = document.createElement("schmancy-overlay"), (document.body ?? document.documentElement).appendChild(r), await r.updateComplete, await r.open(e, t);
				let c = "ov_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
				i = {
					id: c,
					element: r,
					layout: r.layout
				}, function(e) {
					z.next([...z.value, e]);
				}(i), r.modal && r.parentElement && K(c, r);
				let l = t.historyStrategy ?? "push";
				l === "push" ? (history.pushState({ t: c }, "", location.href), a = !0) : l === "replace" && history.replaceState({ t: c }, "", location.href), a && _(window, "popstate").pipe(x(1), S(s)).subscribe(() => {
					o = !0, r?.close("popstate");
				}), r.closed$.pipe(x(1), S(s)).subscribe(({ result: e }) => {
					o = !0, n.next(e), n.complete();
				});
			} catch (e) {
				n.error(e);
			}
		})(), () => {
			s.next(), s.complete(), r && !o && r.close("programmatic"), i && (q(i.id), function(e) {
				let t = z.value, n = t.filter((t) => t.id !== e);
				n.length !== t.length && z.next(n);
			}(i.id)), a && !o && (history.state?.t === i?.id && history.back(), a = !1), queueMicrotask(() => {
				r?.remove(), r = null;
			});
		};
	}));
}
async function X(e = {}) {
	let { SchmancyOverlayPromptBody: t } = await Promise.resolve().then(() => L);
	return !0 === await g(Y(t, {
		anchor: e.anchor,
		signal: e.signal,
		props: {
			mode: "confirm",
			heading: e.title,
			subtitle: e.subtitle,
			message: e.message,
			confirmText: e.confirmText ?? "Confirm",
			cancelText: e.cancelText ?? "Cancel",
			variant: e.variant ?? "default"
		}
	}).pipe(f(!1)));
}
async function Z(e = {}) {
	let { SchmancyOverlayPromptBody: t } = await Promise.resolve().then(() => L), n = await g(Y(t, {
		anchor: e.anchor,
		signal: e.signal,
		props: {
			mode: "prompt",
			heading: e.title,
			subtitle: e.subtitle,
			message: e.message,
			label: e.label,
			defaultValue: e.defaultValue ?? "",
			placeholder: e.placeholder,
			inputType: e.inputType ?? "text",
			pattern: e.pattern,
			required: e.required ?? !1,
			confirmText: e.confirmText ?? "OK",
			cancelText: e.cancelText ?? "Cancel"
		}
	}).pipe(f(null)));
	return typeof n == "string" ? n : null;
}
function Q(e, t) {
	return function(e) {
		let t = e.toLowerCase();
		return z.pipe(v((e) => {
			let n = [];
			for (let r of e) {
				let e = r.element.querySelector(t);
				e && n.push(e);
			}
			return n;
		}), m((e, t) => e.length === t.length && e.every((e, n) => e === t[n])));
	}(e).pipe(m((e, t) => e.length === t.length && e.every((e, n) => e === t[n])), b((e) => e.length === 0 ? l : y(...e.map((e) => _(e, t)))), v((e) => e));
}
function $() {
	let e = [...z.value];
	for (let t = e.length - 1; t >= 0; t--) e[t].element.close("programmatic");
	z.value.length > 0 && z.next([]);
}
export { F as SchmancyOverlay, R as SchmancyOverlayPromptBody, X as confirm, $ as dismissAll, r as lazy, J as openOverlays$, Q as overlayEvents, Z as prompt, Y as show };
