import { a as e, o as t, t as n } from "./tailwind.mixin-BCz3GEpw.js";
import { t as r } from "./provide-BEMtticm.js";
import { t as i } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { filter as a, fromEvent as o, interval as s, map as c, take as l, throttleTime as u } from "rxjs";
import { customElement as d, property as f, query as p, queryAssignedElements as m, state as h } from "lit/decorators.js";
import { css as g, html as _ } from "lit";
import { repeat as v } from "lit/directives/repeat.js";
var y = t("tabs"), b = class extends n() {
	updated(e) {
		e.has("active") && this.active && requestAnimationFrame(() => {
			window.dispatchEvent(new Event("resize"));
		});
	}
	render() {
		return this.mode !== "tabs" || this.active ? _`<slot></slot>` : _``;
	}
};
i([f({
	type: String,
	reflect: !0
})], b.prototype, "label", void 0), i([f({
	type: String,
	reflect: !0
})], b.prototype, "value", void 0), i([f({
	type: Boolean,
	reflect: !0
})], b.prototype, "active", void 0), i([e({
	context: y,
	subscribe: !0
}), h()], b.prototype, "mode", void 0), b = i([d("schmancy-tab")], b);
var x = class extends n(g`
	:host {
		display: block;
		height: 100%;
	}
`) {
	constructor(...e) {
		super(...e), this.mode = "tabs", this.rounded = !0, this.tabs = [];
	}
	connectedCallback() {
		super.connectedCallback(), o(window, "scroll").pipe(u(1e3), a(() => this.mode === "scroll"), c(() => {
			let e = null, t = Infinity;
			return this.tabsElements.forEach((n) => {
				let r = n.getBoundingClientRect().top - this.navElement.clientHeight + document.body.offsetHeight / 3;
				r < t && r > 0 && (t = r, e = n);
			}), e;
		}), a((e) => e !== null)).subscribe({ next: (e) => {
			this.activeTab = e.value;
		} });
	}
	firstUpdated() {
		s(0).pipe(a(() => !!this.navElement.clientHeight), l(1)).subscribe(() => {
			this.tabsElements.forEach((e) => {
				this.mode === "scroll" && (e.style.paddingTop = this.navElement.clientHeight + "px");
			});
		});
	}
	hydrateTabs() {
		this.tabs = this.tabsElements, !this.activeTab && this.tabsElements[0] ? (this.activeTab = this.tabsElements[0].value, this.tabsElements[0].active = !0) : this.tabsElements.forEach((e) => {
			e.value === this.activeTab ? e.active = !0 : e.active = !1;
		});
		let e = this.tabs?.[-1];
		e && (e.style.paddingBottom = e.offsetHeight + "px");
	}
	tabChanged(e) {
		let t;
		this.tabsElements.forEach((n) => {
			n.value === e.value ? (n.active = !0, t = n, this.mode === "scroll" && t.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "start"
			})) : n.active = !1;
		}), this.mode === "tabs" && (this.activeTab = e.value), this.dispatchEvent(new CustomEvent("tab-changed", { detail: this.activeTab }));
	}
	render() {
		let e = {
			"bg-surface-default color-surface-on": !0,
			"flex z-50 overflow-auto": !0,
			"sticky top-0 shadow-md": this.mode === "scroll",
			"rounded-full": this.rounded
		}, t = { "text-primary-default": !0 }, n = {
			"border-transparent": !0,
			"hover:text-surface-on": !0,
			"hover:border-outlineVariant": !0,
			"text-surface-onVariant": !0
		};
		return _`
			<section id="tabsNavigation" class="${this.classMap(e)}" aria-label="Tabs">
				${v(this.tabs, (e) => e.value, (e) => _`
						<schmancy-button
							@click=${() => {
			this.tabChanged({
				label: e.label,
				value: e.value
			});
		}}
							aria-current="page"
							class="h-auto relative"
						>
							<div
								class="px-4 py-3 ${this.activeTab === e.value ? this.classMap(t) : this.classMap(n)}"
							>
								<schmancy-typography class="h-full align-middle flex " type="title" token="md" weight="medium">
									${e.label}
								</schmancy-typography>
								<div
									.hidden=${this.activeTab !== e.value}
									class="border-primary-default absolute bottom-0 inset-x-6  border-solid border-2 rounded-t-full"
								></div>
							</div>
						</schmancy-button>
					`)}
			</section>
			<section id="tabsContent" class="h-full">
				<slot @slotchange=${() => this.hydrateTabs()}></slot>
			</section>
		`;
	}
};
i([r({ context: y }), f({ type: String })], x.prototype, "mode", void 0), i([f({ type: Boolean })], x.prototype, "rounded", void 0), i([f({
	type: String,
	reflect: !0
})], x.prototype, "activeTab", void 0), i([m({ flatten: !0 })], x.prototype, "tabsElements", void 0), i([p("#tabsNavigation")], x.prototype, "navElement", void 0), i([p("#tabsContent")], x.prototype, "tabsContent", void 0), i([h()], x.prototype, "tabs", void 0);
var S = x = i([d("schmancy-tab-group")], x);
customElements.define("schmancy-tabs-group", class extends S {});
