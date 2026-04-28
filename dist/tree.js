import { t as e } from "./tailwind.mixin-mdQR3BEO.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { fromEvent as n, merge as r, switchMap as i, takeUntil as a, tap as o, zip as s } from "rxjs";
import { customElement as c, property as l, query as u } from "lit/decorators.js";
import { css as d, html as f } from "lit";
var p = class extends e(d`
	:host {
		display: block;
		position: relative;
		background-color: initial;
	}
	::slotted([slot='root']) {
		width: 100%;
		text-align: left;
	}
	::slotted([slot='root'] + *) {
		margin-top: 0.5rem;
	}
`) {
	constructor(...e) {
		super(...e), this.open = !1, this._a11yId = `schmancy-tree-${Math.random().toString(36).slice(2, 10)}`, this._internals = (() => {
			try {
				return this.attachInternals();
			} catch {
				return;
			}
		})();
	}
	get _contentId() {
		return `${this._a11yId}-content`;
	}
	updated(e) {
		super.updated?.(e), e.has("open") && (this.open ? this._internals?.states.add("open") : this._internals?.states.delete("open"));
	}
	firstUpdated() {
		this.open || (this.defaultSlot.hidden = !0), r(n(this.toggler, "click").pipe(a(this.disconnecting), o((e) => {
			e.preventDefault(), e.stopPropagation(), this.dispatchEvent(new CustomEvent("toggle", {
				bubbles: !1,
				composed: !0
			}));
		})), n(this.chevron, "click")).pipe(i(() => {
			let e = this.open ? 180 : 0, t = this.open ? 0 : 180, r = this.chevron.animate([{ transform: `rotate(${e}deg)` }, { transform: `rotate(${t}deg)` }], {
				duration: 150,
				easing: "ease-in",
				fill: "forwards"
			});
			this.open || (this.defaultSlot.hidden = !1);
			let i = +!!this.open, o = +!this.open, c = this.defaultSlot.animate([{ opacity: i }, { opacity: o }], {
				duration: 150,
				easing: "ease-out",
				fill: "forwards"
			});
			return c.onfinish = () => {
				this.open ? this.defaultSlot.hidden = !0 : (this.defaultSlot.style.height = "auto", this.defaultSlot.style.opacity = "1");
			}, s(n(r, "finish"), n(c, "finish")).pipe(a(this.disconnecting));
		}), o(() => {
			this.open = !this.open;
		}), a(this.disconnecting)).subscribe();
	}
	render() {
		return f`
			<div class="flex content-center items-center justify-between">
				<!-- Root toggler content -->
				<slot id="toggler" name="root"></slot>

				<!-- The chevron or arrow symbol -->
				<!-- Stop propagation on the schmancy-button itself just to avoid double triggers -->
				<schmancy-button
					slot="trailing"
					id="chevron"
					aria-expanded=${this.open ? "true" : "false"}
					aria-controls=${this._contentId}
					aria-label=${this.open ? "Collapse" : "Expand"}
					@click=${(e) => e.stopPropagation()}
				>
					⌅
				</schmancy-button>
			</div>

			<!-- The default slot: tree children -->
			<slot id=${this._contentId}></slot>
		`;
	}
};
t([l({ type: Boolean })], p.prototype, "open", void 0), t([u("#toggler")], p.prototype, "toggler", void 0), t([u("slot:not([name=\"root\"])")], p.prototype, "defaultSlot", void 0), t([u("#chevron")], p.prototype, "chevron", void 0), p = t([c("schmancy-tree")], p);
export { p as SchmancyTree };
