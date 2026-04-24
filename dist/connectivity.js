import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./audio-ql6nvY0y.js";
import { fromEvent as r, merge as i, timer as a } from "rxjs";
import { distinctUntilChanged as o, map as s, skip as c, takeUntil as l, tap as u } from "rxjs/operators";
import { customElement as d } from "lit/decorators.js";
import { css as f, html as p } from "lit";
import { createRef as m, ref as h } from "lit/directives/ref.js";
var g = class extends e(f`
	:host {
		display: block;
	}

	.banner {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out;
	}

	.banner.visible {
		transform: translateY(0);
		opacity: 1;
	}

	.banner.exiting {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 300ms ease-out, opacity 300ms ease-out;
	}

	@keyframes icon-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	@keyframes icon-bounce {
		0%, 100% { transform: translateY(0); }
		25% { transform: translateY(-6px); }
		50% { transform: translateY(0); }
		75% { transform: translateY(-3px); }
	}

	.icon-pulse {
		animation: icon-pulse 1s ease-in-out infinite;
	}

	.icon-bounce {
		animation: icon-bounce 600ms ease-out;
	}
`) {
	constructor(...e) {
		super(...e), this.bannerRef = m(), this.surfaceRef = m(), this.iconRef = m(), this.messageRef = m();
	}
	connectedCallback() {
		super.connectedCallback();
		let e = i(r(window, "online").pipe(s(() => !0)), r(window, "offline").pipe(s(() => !1))).pipe(o());
		e.pipe(u((e) => this.updateBanner(e)), l(this.disconnecting)).subscribe(), e.pipe(c(1), u((e) => n.play(e ? "celebrated" : "disappointed")), l(this.disconnecting)).subscribe();
	}
	updateBanner(e) {
		let t = this.bannerRef.value, n = this.surfaceRef.value, r = this.iconRef.value, i = this.messageRef.value;
		t && n && r && i && (e ? (n.setAttribute("type", "primary"), r.textContent = "🎉", r.className = "text-2xl icon-bounce", i.textContent = "Back online", t.classList.remove("exiting"), t.classList.add("visible"), a(1500).pipe(u(() => {
			t.classList.add("exiting"), a(300).pipe(u(() => t.classList.remove("visible", "exiting")), l(this.disconnecting)).subscribe();
		}), l(this.disconnecting)).subscribe()) : (n.setAttribute("type", "error"), r.textContent = "🙀", r.className = "text-2xl icon-pulse", i.textContent = "You're offline", t.classList.remove("exiting"), t.classList.add("visible")));
	}
	render() {
		return p`
			<div ${h(this.bannerRef)} class="banner fixed top-0 inset-x-0 z-50 p-2 pointer-events-none">
				<schmancy-surface
					${h(this.surfaceRef)}
					type="error"
					rounded="all"
					elevation="3"
					class="mx-auto max-w-sm shadow-lg pointer-events-auto"
				>
					<div class="flex items-center gap-3 px-4 py-3">
						<span ${h(this.iconRef)} class="text-2xl">🙀</span>
						<schmancy-typography type="body" token="md">
							<span ${h(this.messageRef)}>You're offline</span>
						</schmancy-typography>
					</div>
				</schmancy-surface>
			</div>
		`;
	}
};
g = t([d("schmancy-connectivity-status")], g);
export { g as SchmancyConnectivityStatus };
