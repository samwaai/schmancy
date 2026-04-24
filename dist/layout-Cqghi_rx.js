import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import "./scroll-CdmXRXh2.js";
import { debounceTime as n, distinctUntilChanged as r, fromEvent as i, map as a, startWith as o, takeUntil as s } from "rxjs";
import { classMap as c } from "lit/directives/class-map.js";
import { styleMap as l } from "lit/directives/style-map.js";
import { customElement as u, property as d, queryAssignedElements as f } from "lit/decorators.js";
import { css as p, html as m, unsafeCSS as h } from "lit";
var g = class extends e() {
	constructor(...e) {
		super(...e), this.layout = !0, this.center = void 0, this.display = void 0, this.overflow = void 0, this.overflowX = void 0, this.overflowY = void 0, this.position = void 0;
	}
	static {
		this.styles = [this.styles];
	}
	connectedCallback() {
		super.connectedCallback(), this.style.setProperty("padding", this.padding ?? ""), this.style.setProperty("margin", this.margin ?? ""), this.style.setProperty("width", this.width ?? ""), this.style.setProperty("height", this.height ?? ""), this.style.setProperty("min-width", this.minWidth ?? ""), this.style.setProperty("min-height", this.minHeight ?? ""), this.style.setProperty("max-width", this.maxWidth ?? ""), this.style.setProperty("max-height", this.maxHeight ?? ""), this.style.setProperty("display", this.display ?? ""), this.style.setProperty("overflow", this.overflow ?? ""), this.style.setProperty("overflow-x", this.overflowX ?? ""), this.style.setProperty("overflow-y", this.overflowY ?? ""), this.style.setProperty("position", this.position ?? ""), this.style.setProperty("top", this.top ?? ""), this.style.setProperty("right", this.right ?? ""), this.style.setProperty("bottom", this.bottom ?? ""), this.style.setProperty("left", this.left ?? ""), this.style.setProperty("inset", this.inset ?? ""), this.style.setProperty("z-index", this.zIndex ?? ""), this.style.setProperty("border", this.border ?? ""), this.style.setProperty("border-top", this.borderTop ?? ""), this.style.setProperty("border-right", this.borderRight ?? ""), this.style.setProperty("border-bottom", this.borderBottom ?? ""), this.style.setProperty("border-left", this.borderLeft ?? ""), this.style.setProperty("border-color", this.borderColor ?? ""), this.style.setProperty("border-radius", this.borderRadius ?? ""), this.style.setProperty("border-width", this.borderWidth ?? ""), this.style.setProperty("box-shadow", this.boxShadow ?? ""), this.style.setProperty("opacity", this.opacity ?? ""), this.style.setProperty("background", this.background ?? ""), this.style.setProperty("background-image", this.backgroundImage ?? ""), this.style.setProperty("background-position", this.backgroundPosition ?? ""), this.style.setProperty("background-size", this.backgroundSize ?? ""), this.style.setProperty("background-repeat", this.backgroundRepeat ?? ""), this.style.setProperty("background-attachment", this.backgroundAttachment ?? ""), this.style.setProperty("background-color", this.backgroundColor ?? ""), this.style.setProperty("background-clip", this.backgroundClip ?? ""), this.style.setProperty("background-origin", this.backgroundOrigin ?? ""), this.style.setProperty("background-blend-mode", this.backgroundBlendMode ?? ""), this.style.setProperty("filter", this.filter ?? ""), this.style.setProperty("backdrop-filter", this.backdropFilter ?? ""), this.center && (this.style.setProperty("margin-left", "auto"), this.style.setProperty("margin-right", "auto"));
	}
};
t([d({ type: Boolean })], g.prototype, "center", void 0), t([d({ type: String })], g.prototype, "padding", void 0), t([d({ type: String })], g.prototype, "margin", void 0), t([d({ type: String })], g.prototype, "width", void 0), t([d({ type: String })], g.prototype, "height", void 0), t([d({ type: String })], g.prototype, "minWidth", void 0), t([d({ type: String })], g.prototype, "minHeight", void 0), t([d({ type: String })], g.prototype, "maxWidth", void 0), t([d({ type: String })], g.prototype, "maxHeight", void 0), t([d({ type: String })], g.prototype, "display", void 0), t([d({ type: String })], g.prototype, "overflow", void 0), t([d({ type: String })], g.prototype, "overflowX", void 0), t([d({ type: String })], g.prototype, "overflowY", void 0), t([d({ type: String })], g.prototype, "position", void 0), t([d({ type: String })], g.prototype, "top", void 0), t([d({ type: String })], g.prototype, "right", void 0), t([d({ type: String })], g.prototype, "bottom", void 0), t([d({ type: String })], g.prototype, "left", void 0), t([d({ type: String })], g.prototype, "inset", void 0), t([d({ type: String })], g.prototype, "zIndex", void 0), t([d({ type: String })], g.prototype, "border", void 0), t([d({ type: String })], g.prototype, "borderTop", void 0), t([d({ type: String })], g.prototype, "borderRight", void 0), t([d({ type: String })], g.prototype, "borderBottom", void 0), t([d({ type: String })], g.prototype, "borderLeft", void 0), t([d({ type: String })], g.prototype, "borderColor", void 0), t([d({ type: String })], g.prototype, "borderRadius", void 0), t([d({ type: String })], g.prototype, "borderWidth", void 0), t([d({ type: String })], g.prototype, "boxShadow", void 0), t([d({ type: String })], g.prototype, "opacity", void 0), t([d({ type: String })], g.prototype, "background", void 0), t([d({ type: String })], g.prototype, "backgroundImage", void 0), t([d({ type: String })], g.prototype, "backgroundPosition", void 0), t([d({ type: String })], g.prototype, "backgroundSize", void 0), t([d({ type: String })], g.prototype, "backgroundRepeat", void 0), t([d({ type: String })], g.prototype, "backgroundAttachment", void 0), t([d({ type: String })], g.prototype, "backgroundColor", void 0), t([d({ type: String })], g.prototype, "backgroundClip", void 0), t([d({ type: String })], g.prototype, "backgroundOrigin", void 0), t([d({ type: String })], g.prototype, "backgroundBlendMode", void 0), t([d({ type: String })], g.prototype, "filter", void 0), t([d({ type: String })], g.prototype, "backdropFilter", void 0);
var _ = class extends g {
	constructor(...e) {
		super(...e), this.layout = !0, this.flow = "col", this.wrap = "wrap", this.align = "start", this.justify = "start", this.gap = "none";
	}
	static {
		this.styles = [g.styles, h(":host{background-color:inherit;display:block}")];
	}
	render() {
		return m`
			<section class=${c({
			flex: !0,
			"flex-col": this.flow === "row",
			"flex-col-reverse": this.flow === "row-reverse",
			"flex-row": this.flow === "col",
			"flex-row-reverse": this.flow === "col-reverse",
			"flex-wrap": this.wrap === "wrap",
			"flex-wrap-reverse": this.wrap === "wrap-reverse",
			"flex-nowrap": this.wrap === "nowrap",
			"items-start": this.align === "start",
			"items-center": this.align === "center",
			"items-end": this.align === "end",
			"items-stretch": this.align === "stretch",
			"justify-baseline": this.align === "baseline",
			"justify-center": this.justify === "center",
			"justify-end": this.justify === "end",
			"justify-start": this.justify === "start",
			"justify-stretch": this.justify === "stretch",
			"justify-between": this.justify === "between",
			"gap-0": this.gap === "none",
			"gap-2": this.gap === "sm",
			"gap-4": this.gap === "md",
			"gap-8": this.gap === "lg"
		})} style=${l({})}>
				<slot></slot>
			</section>
		`;
	}
};
t([d({
	type: String,
	reflect: !0
})], _.prototype, "flow", void 0), t([d({
	type: String,
	reflect: !0
})], _.prototype, "wrap", void 0), t([d({
	type: String,
	reflect: !0
})], _.prototype, "align", void 0), t([d({
	type: String,
	reflect: !0
})], _.prototype, "justify", void 0), t([d({
	type: String,
	reflect: !0
})], _.prototype, "gap", void 0), _ = t([u("schmancy-flex")], _);
var v = class extends g {
	constructor(...e) {
		super(...e), this.layout = !0, this.flow = "row", this.align = "stretch", this.justify = "stretch", this.content = "stretch", this.gap = "none", this.wrap = !1;
	}
	static {
		this.styles = [g.styles, h(":host{width:-webkit-fill-available;height:max-content;display:block}")];
	}
	firstUpdated() {
		this.rcols && i(window, "resize").pipe(a((e) => e.target), o(1), a(() => this.clientWidth ? this.clientWidth : window.innerWidth), r(), s(this.disconnecting), n(10), a((e) => {
			let t;
			return this.rcols?.["2xl"] && e >= 1536 ? t = this.rcols?.["2xl"] : this.rcols?.xl && e >= 1280 ? t = this.rcols?.xl : this.rcols?.lg && e >= 1024 ? t = this.rcols?.lg : this.rcols?.md && e >= 768 ? t = this.rcols?.md : this.rcols?.sm && e >= 640 ? t = this.rcols?.sm : this.rcols?.xs && e < 640 && (t = this.rcols?.xs), t;
		})).subscribe((e) => {
			this.cols = e;
		});
	}
	render() {
		let e = {
			"h-full": !0,
			"grid flex-1": !0,
			"grid-flow-row auto-rows-max": this.flow === "row",
			"grid-flow-col auto-cols-max": this.flow === "col",
			"grid-flow-row-dense": this.flow === "row-dense",
			"grid-flow-col-dense": this.flow === "col-dense",
			"grid-flow-dense": this.flow === "dense",
			"justify-center": this.content === "center",
			"justify-end": this.content === "end",
			"justify-start": this.content === "start",
			"justify-stretch": this.content === "stretch",
			"justify-between": this.content === "between",
			"justify-around": this.content === "around",
			"justify-evenly": this.content === "evenly",
			"justify-items-center": this.justify === "center",
			"justify-items-end": this.justify === "end",
			"justify-items-start": this.justify === "start",
			"justify-items-stretch": this.justify === "stretch",
			"items-center": this.align === "center",
			"items-end": this.align === "end",
			"items-start": this.align === "start",
			"items-stretch": this.align === "stretch",
			"items-baseline": this.align === "baseline",
			"gap-0": this.gap === "none",
			"gap-1": this.gap === "xs",
			"gap-2": this.gap === "sm",
			"gap-4": this.gap === "md",
			"gap-8": this.gap === "lg",
			"flex-nowrap": this.wrap,
			"flex-wrap": !this.wrap
		}, t = {
			gridTemplateRows: this.rows ? this.rows : void 0,
			gridTemplateColumns: this.cols ? this.cols : void 0
		};
		return m`
			<section class="${this.classMap(e)}" style=${this.styleMap(t)}>
				<slot> </slot>
			</section>
		`;
	}
};
t([d({ type: String })], v.prototype, "flow", void 0), t([d({ type: String })], v.prototype, "align", void 0), t([d({ type: String })], v.prototype, "justify", void 0), t([d({ type: String })], v.prototype, "content", void 0), t([d({ type: String })], v.prototype, "gap", void 0), t([d({ type: String })], v.prototype, "cols", void 0), t([d({ type: String })], v.prototype, "rows", void 0), t([d({ type: Object })], v.prototype, "rcols", void 0), t([d({ type: Boolean })], v.prototype, "wrap", void 0), t([f()], v.prototype, "assignedElements", void 0), v = t([u("schmancy-grid")], v);
var y = class extends g {
	constructor(...e) {
		super(...e), this.inline = !1, this.flow = "row", this.wrap = "wrap", this.align = "stretch", this.justify = "start", this.gap = "none";
	}
	static {
		this.styles = [g.styles, p`
			:host {
				display: block;
			}
		`];
	}
	render() {
		let e = this.inline ? "inline-flex" : "flex", t = "";
		switch (this.flow) {
			case "row":
			case "row-dense":
			default:
				t = "flex-row";
				break;
			case "row-reverse":
				t = "flex-row-reverse";
				break;
			case "col":
			case "col-dense":
				t = "flex-col";
				break;
			case "col-reverse": t = "flex-col-reverse";
		}
		let n = "";
		switch (this.flow === "row-dense" || this.flow === "col-dense" ? "wrap" : this.wrap) {
			case "wrap":
			default:
				n = "flex-wrap";
				break;
			case "nowrap":
				n = "flex-nowrap";
				break;
			case "wrap-reverse": n = "flex-wrap-reverse";
		}
		let r = "";
		switch (this.align) {
			case "start":
				r = "items-start";
				break;
			case "center":
				r = "items-center";
				break;
			case "end":
				r = "items-end";
				break;
			case "stretch":
			default:
				r = "items-stretch";
				break;
			case "baseline": r = "items-baseline";
		}
		let i = "";
		switch (this.justify) {
			case "start":
			default:
				i = "justify-start";
				break;
			case "center":
				i = "justify-center";
				break;
			case "end":
				i = "justify-end";
				break;
			case "between":
				i = "justify-between";
				break;
			case "around":
				i = "justify-around";
				break;
			case "evenly": i = "justify-evenly";
		}
		let a = "";
		if (this.content) switch (this.content) {
			case "start":
				a = "content-start";
				break;
			case "center":
				a = "content-center";
				break;
			case "end":
				a = "content-end";
				break;
			case "between":
				a = "content-between";
				break;
			case "around":
				a = "content-around";
				break;
			case "evenly": a = "content-evenly";
		}
		let o = this.gap === "none" ? "gap-0" : `gap-${this.gap}`;
		return m`
			<section class=${[
			e,
			t,
			n,
			r,
			i,
			a,
			o
		].filter(Boolean).join(" ")}>
				<slot></slot>
			</section>
		`;
	}
};
t([d({
	type: Boolean,
	reflect: !0
})], y.prototype, "inline", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "flow", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "wrap", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "align", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "justify", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "content", void 0), t([d({
	type: String,
	reflect: !0
})], y.prototype, "gap", void 0), y = t([u("sch-flex")], y);
export { v as n, _ as r, y as t };
