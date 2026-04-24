import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-Mi8bar6B.js";
import "./mixins.js";
import { t as n } from "./audio-C7TzWI8M.js";
import "./progress-BnXr7aAs.js";
import { BehaviorSubject as r, NEVER as i, catchError as a, finalize as o, interval as s, tap as c, timer as l } from "rxjs";
import { distinctUntilChanged as u, map as d, switchMap as f, takeUntil as p, tap as m } from "rxjs/operators";
import { customElement as h, property as g, state as _ } from "lit/decorators.js";
import { html as v } from "lit";
var y = class extends t(":host{display:block}.notification{background:var(--schmancy-sys-color-surface-container);border-radius:var(--schmancy-sys-shape-corner-extraLarge,16px);color:var(--schmancy-sys-color-surface-on);--notification-glow-color:var(--schmancy-sys-color-primary-default);max-width:320px;box-shadow:0 4px 24px -6px color-mix(in srgb, var(--notification-glow-color) 18%, transparent);border-left:2px solid color-mix(in srgb, var(--notification-glow-color) 50%, transparent);align-items:flex-start;gap:10px;padding:12px 32px 12px 12px;transition:box-shadow .3s,transform .3s cubic-bezier(.34,1.56,.64,1);display:flex;position:relative;overflow:hidden}.notification.info{--notification-glow-color:var(--schmancy-sys-color-primary-default)}.notification.success{--notification-glow-color:var(--schmancy-sys-color-success-default)}.notification.warning{--notification-glow-color:var(--schmancy-sys-color-warning-default)}.notification.error{--notification-glow-color:var(--schmancy-sys-color-error-default)}.notification.hovered{box-shadow:0 8px 32px -4px color-mix(in srgb, var(--notification-glow-color) 28%, transparent);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.notification{transition:box-shadow .2s}.notification.hovered{transform:none}}.emoji{flex-shrink:0;margin-top:1px;font-size:20px;line-height:1}.content{flex:1;min-width:0}.title{letter-spacing:.01em;margin-bottom:2px;font-size:13px;font-weight:500;line-height:1.4}.info .title{color:var(--schmancy-sys-color-primary-default)}.success .title{color:var(--schmancy-sys-color-success-default)}.warning .title{color:var(--schmancy-sys-color-tertiary-default)}.error .title{color:var(--schmancy-sys-color-error-default)}.message{opacity:.75;letter-spacing:.01em;font-size:13px;line-height:1.4}.close{color:var(--schmancy-sys-color-surface-onVariant);cursor:pointer;opacity:.4;border-radius:var(--schmancy-sys-shape-corner-full,50%);background:0 0;border:none;padding:4px 6px;font-size:16px;font-weight:300;line-height:1;transition:opacity .2s;position:absolute;top:8px;right:6px}.close:hover{opacity:.8}.close:focus-visible{opacity:1;box-shadow:0 0 0 2px var(--schmancy-sys-color-primary-default), 0 0 8px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 25%, transparent);outline:none}.progress{position:absolute;bottom:0;left:0;right:0}") {
	constructor(...e) {
		super(...e), this.title = "", this.message = "", this.type = "info", this.closable = !0, this.duration = 5e3, this.id = `notification-${Date.now()}-${Math.floor(1e4 * Math.random())}`, this.playSound = !0, this.showProgress = !1, this.startPosition = {
			x: 0,
			y: 0
		}, this._visible = !0, this._progress = 100, this._hovered = !1, this._closing = !1, this.paused$ = new r(!1), this.startTime = 0, this.pausedAt = 0, this.elapsedBeforePause = 0;
	}
	connectedCallback() {
		super.connectedCallback(), this.style.position = "fixed", this.style.top = "16px", this.style.right = "16px", this.style.zIndex = "10001", this.style.opacity = "0", this.updateComplete.then(() => {
			this.animateIn();
		}), this.duration > 0 && (this.setupAutoClose(), this.setupProgressUpdates()), this.playSound && this._playSound();
	}
	async animateIn() {
		let e = this.getBoundingClientRect(), t = e.left + e.width / 2, n = e.top + e.height / 2, r = function(e, t, n = "up", r = .3) {
			let i = (e.x + t.x) / 2, a = (e.y + t.y) / 2, o = Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2), s = Math.min(o * r, 150);
			return {
				x: i,
				y: n === "up" ? a - s : a + s
			};
		}(this.startPosition, {
			x: t,
			y: n
		}, "up", .3);
		await this.animate([
			{
				transform: `translate(${this.startPosition.x - t}px, ${this.startPosition.y - n}px) scale(0.1)`,
				opacity: 0
			},
			{
				transform: `translate(${r.x - t}px, ${r.y - n}px) scale(0.6)`,
				opacity: .9,
				offset: .5
			},
			{
				transform: "translate(0, 0) scale(1)",
				opacity: 1
			}
		], {
			duration: 400,
			easing: "cubic-bezier(0.34, 1.2, 0.64, 1)",
			fill: "forwards"
		}).finished;
	}
	setupAutoClose() {
		this.duration <= 0 || (this.startTime = Date.now(), this.elapsedBeforePause = 0, this.paused$.pipe(f((e) => {
			if (e) return this.pausedAt = Date.now(), this.elapsedBeforePause += this.pausedAt - this.startTime, i;
			{
				this.startTime = Date.now();
				let e = this.duration - this.elapsedBeforePause;
				return e <= 0 ? (this.close(), i) : l(e);
			}
		}), p(this.disconnecting)).subscribe(() => this.close()));
	}
	setupProgressUpdates() {
		this.duration <= 0 || s(16).pipe(f(() => this.paused$.pipe(d((e) => {
			if (e) return this._progress;
			let t = this.elapsedBeforePause + (Date.now() - this.startTime);
			return Math.max(0, this.duration - t) / this.duration * 100;
		}))), u(), m((e) => {
			this._progress = e;
		}), p(this.disconnecting)).subscribe();
	}
	_playSound() {
		this.dispatchEvent(new CustomEvent("playsound", {
			detail: { type: this.type },
			bubbles: !0,
			composed: !0
		}));
	}
	_handleMouseEnter() {
		this._hovered = !0, this.paused$.next(!0);
	}
	_handleMouseLeave() {
		this._hovered = !1, this.paused$.next(!1);
	}
	async close() {
		this._closing || (this._closing = !0, this._visible = !1, await this.animate([{
			transform: "translate(0, 0) scale(1)",
			opacity: 1
		}, {
			transform: "translate(0, -20px) scale(0.8)",
			opacity: 0
		}], {
			duration: 200,
			easing: "cubic-bezier(0.4, 0, 1, 1)",
			fill: "forwards"
		}).finished, this.dispatchEvent(new CustomEvent("close", {
			detail: { id: this.id },
			bubbles: !0,
			composed: !0
		})));
	}
	_getEmoji() {
		switch (this.type) {
			case "success": return "✅";
			case "warning": return "⚠️";
			case "error": return "❌";
			default: return "💡";
		}
	}
	render() {
		return !this._visible && this._closing ? v`` : v`
			<div
				class="notification ${this.type} ${this._closing ? "closing" : ""} ${this._hovered ? "hovered" : ""}"
				role="alert"
				@mouseenter=${this._handleMouseEnter}
				@mouseleave=${this._handleMouseLeave}
			>
				<span class="emoji">${this._getEmoji()}</span>
				<div class="content">
					${this.title ? v`<div class="title">${this.title}</div>` : ""}
					<div class="message">${this.message}</div>
				</div>
				${this.closable ? v`
							<button class="close" aria-label="Close notification" @click=${this.close}>x</button>
						` : ""}
				${this.showProgress || this.duration > 0 ? v`<schmancy-progress
						class="progress"
						size="xs"
						.value=${this._progress}
						?indeterminate=${this.showProgress && this.duration === 0}
					></schmancy-progress>` : ""}
			</div>
		`;
	}
};
e([g({ type: String })], y.prototype, "title", void 0), e([g({ type: String })], y.prototype, "message", void 0), e([g({ type: String })], y.prototype, "type", void 0), e([g({ type: Boolean })], y.prototype, "closable", void 0), e([g({ type: Number })], y.prototype, "duration", void 0), e([g({ type: String })], y.prototype, "id", void 0), e([g({ type: Boolean })], y.prototype, "playSound", void 0), e([g({ type: Boolean })], y.prototype, "showProgress", void 0), e([g({ type: Object })], y.prototype, "startPosition", void 0), e([_()], y.prototype, "_visible", void 0), e([_()], y.prototype, "_progress", void 0), e([_()], y.prototype, "_hovered", void 0), e([_()], y.prototype, "_closing", void 0);
var b = y = e([h("sch-notification")], y), x = {
	info: "curious",
	success: "content",
	warning: "anxious",
	error: "disappointed"
}, S = {
	x: window.innerWidth - 100,
	y: 50
};
typeof window < "u" && window.addEventListener("mousedown", (e) => {
	S = {
		x: e.clientX,
		y: e.clientY
	};
}, {
	capture: !0,
	passive: !0
});
var C = null, w = class e {
	static {
		this.DEFAULT_OPTIONS = {
			duration: 1e3,
			closable: !0,
			playSound: !0
		};
	}
	static {
		this.TYPE_DURATIONS = {
			success: 1500,
			info: 2e3,
			warning: 2500,
			error: 2500
		};
	}
	constructor() {
		this.notificationStack = [], this.audioVolume = .1, n.setVolume(this.audioVolume);
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
	notify(t) {
		let r = {
			...e.DEFAULT_OPTIONS,
			...t,
			duration: t.duration ?? e.DEFAULT_OPTIONS.duration
		}, i = r.id || `notification-${Date.now()}-${Math.floor(1e4 * Math.random())}`;
		this.notificationStack.push(i), C &&= (C.remove(), null);
		let a = document.createElement("sch-notification");
		return a.id = i, a.title = r.title || "", a.message = r.message, a.type = r.type || "info", a.duration = r.duration ?? 1e3, a.closable = !1 !== r.closable, a.playSound = !1, a.showProgress = r.showProgress || !1, a.startPosition = { ...S }, !1 !== r.playSound && n.play(x[a.type]), a.addEventListener("close", () => {
			let e = this.notificationStack.indexOf(i);
			e > -1 && this.notificationStack.splice(e, 1), a.remove(), C === a && (C = null);
		}), document.body.appendChild(a), C = a, i;
	}
	dismiss(e) {
		let t;
		if (e) {
			let n = this.notificationStack.indexOf(e);
			n > -1 && (this.notificationStack.splice(n, 1), t = e);
		} else t = this.notificationStack.pop();
		t && C && C.id === t && C.close();
	}
	update(e, t) {
		C && C.id === e && (t.title !== void 0 && (C.title = t.title), t.message !== void 0 && (C.message = t.message), t.type !== void 0 && (C.type = t.type));
	}
	info(t, n = {}) {
		return this.notify({
			message: t ?? "",
			type: "info",
			duration: t ? n.duration ?? e.TYPE_DURATIONS.info : 1,
			...n
		});
	}
	success(t, n = {}) {
		return this.notify({
			message: t ?? "",
			type: "success",
			duration: t ? n.duration ?? e.TYPE_DURATIONS.success : 1,
			...n
		});
	}
	warning(t, n = {}) {
		return this.notify({
			message: t ?? "",
			type: "warning",
			duration: t ? n.duration ?? e.TYPE_DURATIONS.warning : 1,
			...n
		});
	}
	error(t, n = {}) {
		return this.notify({
			message: t ?? "",
			type: "error",
			duration: t ? n.duration ?? e.TYPE_DURATIONS.error : 1,
			...n
		});
	}
	customDuration(e, t, n = {}) {
		return this.notify({
			message: e,
			duration: t,
			...n
		});
	}
	persistent(e, t = {}) {
		return this.notify({
			message: e,
			duration: 0,
			...t
		});
	}
}, T = {
	show: (e) => w.getInstance().notify(e),
	info: (e, t = {}) => w.getInstance().info(e, t),
	success: (e, t = {}) => w.getInstance().success(e, t),
	warning: (e, t = {}) => w.getInstance().warning(e, t),
	error: (e, t = {}) => w.getInstance().error(e, t),
	customDuration: (e, t, n = {}) => w.getInstance().customDuration(e, t, n),
	persistent: (e, t = {}) => w.getInstance().persistent(e, t),
	dismiss: (e) => w.getInstance().dismiss(e),
	update: (e, t) => w.getInstance().update(e, t)
};
function E(e) {
	return (t) => {
		let n;
		return e.loadingMessage && (n = T.show({
			message: e.loadingMessage,
			type: e.loadingType || "info",
			duration: 0,
			showProgress: !0
		})), t.pipe(c((t) => {
			if (n && typeof t == "object" && t) {
				let r;
				if ("progress" in t && typeof t.progress == "number") r = t.progress;
				else if ("loaded" in t && "total" in t) {
					let e = t.loaded, n = t.total;
					typeof e == "number" && typeof n == "number" && n > 0 && (r = e / n * 100);
				}
				r !== void 0 && T.update?.(n, { message: `${e.loadingMessage} (${Math.round(r)}%)` });
			}
			typeof t == "object" && t && ("progress" in t || "loaded" in t && "total" in t) || (n && !1 !== e.autoDismissLoading && (T.dismiss(n), n = void 0), e.successMessage && T.show({
				message: e.successMessage,
				type: e.successType || "success",
				duration: e.successDuration ?? 2e3
			}));
		}), a((t) => {
			if (n && !1 !== e.autoDismissLoading && (T.dismiss(n), n = void 0), e.errorMessage) {
				let n = typeof e.errorMessage == "function" ? e.errorMessage(t) : e.errorMessage;
				T.show({
					message: n,
					type: e.errorType || "error",
					duration: e.errorDuration ?? 3e3
				});
			}
			throw t;
		}), o(() => {
			n && !1 !== e.autoDismissLoading && T.dismiss(n);
		}));
	};
}
function D(e, t, n) {
	return E({
		loadingMessage: e,
		successMessage: t || void 0,
		errorMessage: n || void 0,
		autoDismissLoading: !0
	});
}
export { b as i, D as n, T as r, E as t };
