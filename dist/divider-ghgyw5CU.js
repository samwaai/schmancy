import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-CszkJuNl.js";
import "./mixins.js";
import { customElement as n, property as r } from "lit/decorators.js";
import { css as i, html as a } from "lit";
var o = class extends t(i`
	:host {
		display: block;
	}

	@keyframes grow-horizontal {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@keyframes grow-vertical {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	/* Horizontal divider grow animations */
	.grow-start:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: left;
	}

	.grow-end:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: right;
	}

	.grow-both:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: center;
	}

	/* Vertical divider grow animations */
	.grow-start.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: top;
	}

	.grow-end.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: bottom;
	}

	.grow-both.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: center;
	}
`) {
	constructor(...e) {
		super(...e), this.outline = "variant", this.vertical = !1, this.grow = "start";
	}
	set orientation(e) {
		this.vertical = e === "vertical";
	}
	get orientation() {
		return this.vertical ? "vertical" : "horizontal";
	}
	render() {
		return a`<div
			class=${this.classMap({
			"w-full h-px": !this.vertical,
			"h-full w-px": this.vertical,
			"border-outlineVariant": this.outline === "variant",
			"border-outline": this.outline === "default",
			"border-t": !this.vertical,
			"border-l": this.vertical,
			[`grow-${this.grow}`]: !0
		})}
		></div>`;
	}
};
e([r({ type: String })], o.prototype, "outline", void 0), e([r({ type: Boolean })], o.prototype, "vertical", void 0), e([r({ type: String })], o.prototype, "grow", void 0), e([r({
	reflect: !0,
	type: String
})], o.prototype, "orientation", null), o = e([n("schmancy-divider")], o);
