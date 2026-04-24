import { a as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./litElement.mixin-BnNYZ24e.js";
import "./mixins.js";
import { n as r } from "./delay-DwX65fSc.js";
import { t as i } from "./hashContent-B2IntJQf.js";
import { t as a } from "./intersection-BrXp4YTO.js";
import { customElement as o, property as s, query as c, queryAssignedElements as l, queryAssignedNodes as u } from "lit/decorators.js";
import { css as d, html as f } from "lit";
var p = null, m = class extends n(d`
	:host {
		display: inline-block;
	}

	#typewriter {
		position: relative;
	}

	/* Enhanced cursor with glow effect */
	#typewriter :global(.ti-cursor) {
		animation: cursor-pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		color: currentColor;
		filter: drop-shadow(0 0 8px currentColor);
	}

	@keyframes cursor-pulse {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.3;
			transform: scale(0.95);
		}
	}

	/* Character entrance animation */
	#typewriter :global(.ti-container *) {
		animation: char-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	}

	@keyframes char-entrance {
		0% {
			opacity: 0;
			transform: scale(0.3) translateY(10px);
			filter: blur(4px);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.1) translateY(-2px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
			filter: blur(0);
		}
	}

	/* Subtle character wobble on appear */
	#typewriter :global(.ti-container *:nth-child(odd)) {
		animation: char-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
		           char-wobble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
	}

	@keyframes char-wobble {
		0%, 100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(2deg);
		}
		75% {
			transform: rotate(-2deg);
		}
	}

	/* Deletion animation - fade out and scale down */
	#typewriter :global(.ti-container .deleting) {
		animation: char-delete 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	@keyframes char-delete {
		0% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.8) translateY(-3px);
		}
		100% {
			opacity: 0;
			transform: scale(0.4) translateY(-8px);
			filter: blur(3px);
		}
	}

	/* Gradient text effect on typed text */
	#typewriter :global(.ti-container) {
		background: linear-gradient(
			90deg,
			currentColor 0%,
			currentColor 70%,
			transparent 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		animation: gradient-shift 3s ease-in-out infinite;
	}

	@keyframes gradient-shift {
		0%, 100% {
			filter: brightness(1) saturate(1);
		}
		50% {
			filter: brightness(1.15) saturate(1.2);
		}
	}

	/* Smooth transitions for all text */
	#typewriter * {
		transition: opacity 0.15s ease-out, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
`) {
	constructor(...e) {
		super(...e), this.speed = 35, this.delay = 0, this.autoStart = !0, this.cursorChar = "", this.deleteSpeed = 20, this.once = !0, this.loop = !1, this.cyclePause = 1500, this.typeItInstance = null, this.sessionKey = "";
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._destroyTypeIt();
	}
	async _startTyping() {
		if (this._destroyTypeIt(), this.sessionKey = this.generateSessionKey(), this.once && sessionStorage.getItem(this.sessionKey) === "true") return void this.shadowRoot?.querySelector("slot")?.removeAttribute("hidden");
		if (!this.typewriterContainer) return;
		let e = {
			speed: this.speed,
			startDelay: this.delay,
			cursor: !!this.cursorChar,
			cursorChar: this.cursorChar,
			deleteSpeed: this.deleteSpeed,
			loop: this.loop,
			afterComplete: () => {
				if (this.once && !this.loop) try {
					sessionStorage.setItem(this.sessionKey, "true");
				} catch {}
				this.dispatchEvent(new CustomEvent("typeit-complete", {
					bubbles: !0,
					composed: !0
				})), this.loop || this.typewriterContainer.style.setProperty("--ti-cursor-display", "none");
			}
		}, t = await (p ||= import("./index.es-CLyb_o3Y.js").then((e) => e.default));
		this.isConnected && (this.typeItInstance = new t(this.typewriterContainer, e), this._getSlottedNodes.forEach((e) => {
			if (e.nodeType === Node.TEXT_NODE) {
				let t = e.textContent || "";
				t.trim() && this.typeItInstance?.type(t);
			} else e instanceof HTMLElement && this._processCustomElement(e);
		}), a(this.shadowRoot?.host).subscribe(() => {
			this.typeItInstance?.go();
		}));
	}
	generateSessionKey() {
		let e = this._getSlottedElements.map((e) => e.outerHTML).join("");
		return this.once ? i(e) : "";
	}
	_destroyTypeIt() {
		if (this.typeItInstance) {
			try {
				this.typeItInstance.destroy();
			} catch {}
			this.typeItInstance = null;
		}
	}
	_processCustomElement(e) {
		let t = e.getAttribute("action"), n = e.getAttribute("value"), r = e.getAttribute("cycle");
		if (r) {
			let t = r.split("|").map((e) => e.trim());
			this._processCycle(t, e);
			return;
		}
		switch (t) {
			case "pause":
				this.typeItInstance?.pause(parseInt(n || "0", 10));
				break;
			case "delete":
				this.typeItInstance?.delete(parseInt(n || "0", 10));
				break;
			default: e.tagName === "P" && this.typeItInstance?.break(), this.typeItInstance?.type(e.textContent || "");
		}
	}
	_processCycle(e, t) {
		if (e.length === 0) return;
		let n = t.getAttribute("pause"), r = n ? parseInt(n, 10) : this.cyclePause;
		e.forEach((t, n) => {
			this.typeItInstance?.type(t), (n < e.length - 1 || this.loop) && this.typeItInstance?.pause(r), (n < e.length - 1 || this.loop) && this.typeItInstance?.delete(t.length);
		});
	}
	render() {
		return f`<div id="typewriter" aria-live="polite"></div>

			<div class="typewriter">
				<slot
					hidden
					@slotchange=${() => {
			this._startTyping();
		}}
				></slot>
			</div> `;
	}
};
t([s({ type: Number })], m.prototype, "speed", void 0), t([e({
	context: r,
	subscribe: !0
}), s({ type: Number })], m.prototype, "delay", void 0), t([s({ type: Boolean })], m.prototype, "autoStart", void 0), t([s({ type: String })], m.prototype, "cursorChar", void 0), t([s({ type: Number })], m.prototype, "deleteSpeed", void 0), t([s({ type: Boolean })], m.prototype, "once", void 0), t([s({ type: Boolean })], m.prototype, "loop", void 0), t([s({ type: Number })], m.prototype, "cyclePause", void 0), t([c("#typewriter")], m.prototype, "typewriterContainer", void 0), t([u({ flatten: !0 })], m.prototype, "_getSlottedNodes", void 0), t([l({ flatten: !0 })], m.prototype, "_getSlottedElements", void 0), m = t([o("schmancy-typewriter")], m);
export { m as TypewriterElement };
