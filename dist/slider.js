import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { fromEvent as n } from "rxjs";
import { throttleTime as r } from "rxjs/operators";
import { customElement as i, property as a, query as o, state as s } from "lit/decorators.js";
import { css as c, html as l } from "lit";
import { cache as u } from "lit/directives/cache.js";
var d = class extends t(c`
	:host {
		display: block;
		scroll-snap-align: center; /* If your slider uses scroll-snap */
	}

	.slide {
		display: block;
		width: 100%;
		height: auto;
		object-fit: var(--object-fit, cover);
	}
`) {
	constructor(...e) {
		super(...e), this.type = "content", this.src = "", this.alt = "", this.controls = !0, this.autoplay = !1, this.loop = !1, this.muted = !1, this.fit = "cover";
	}
	render() {
		return l` <div style="--object-fit: ${this.fit}">${u(this.renderSlide())}</div> `;
	}
	renderSlide() {
		switch (this.type) {
			case "image": return l` <img class="slide" src="${this.src}" alt="${this.alt}" loading="lazy" /> `;
			case "video": return l`
					<video
						class="slide"
						src="${this.src}"
						?controls="${this.controls}"
						?autoplay="${this.autoplay}"
						?loop="${this.loop}"
						?muted="${this.muted}"
					>
						Your browser does not support HTML video.
					</video>
				`;
			default: return l`<slot></slot>`;
		}
	}
};
e([a({ type: String })], d.prototype, "type", void 0), e([a({ type: String })], d.prototype, "src", void 0), e([a({ type: String })], d.prototype, "alt", void 0), e([a({ type: Boolean })], d.prototype, "controls", void 0), e([a({ type: Boolean })], d.prototype, "autoplay", void 0), e([a({ type: Boolean })], d.prototype, "loop", void 0), e([a({ type: Boolean })], d.prototype, "muted", void 0), e([a({ type: String })], d.prototype, "fit", void 0), d = e([i("schmancy-slide")], d);
var f = class extends t(c`
	.slider {
		/* Lay out slides horizontally, one after another */
		display: flex;
		overflow-x: auto;

		/* Optional: scroll snapping */
		scroll-snap-type: x mandatory;

		/* Hide scrollbars */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.slider::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	/* 
      Ensure each slide takes up the full slider width.
      "schmancy-slide" is the child custom element.
    */
	::slotted(schmancy-slide) {
		flex: 0 0 100%;
		box-sizing: border-box;
	}
`) {
	constructor(...e) {
		super(...e), this.selectedIndex = 0, this.showArrows = !0;
	}
	firstUpdated() {
		this.slider.scrollLeft = 0, n(this.slider, "scroll").pipe(r(100, void 0, { trailing: !0 })).subscribe(() => {
			this.updateSelectedIndexOnScroll();
		});
	}
	updateSelectedIndexOnScroll() {
		let e = this.defaultSlot?.assignedElements({ flatten: !0 }) ?? [];
		if (!e.length) return;
		let t = this.selectedIndex, n = this.slider.scrollLeft + this.slider.clientWidth / 2, r = 0, i = Infinity;
		e.forEach((e, t) => {
			let a = e.offsetLeft + e.clientWidth / 2, o = Math.abs(n - a);
			o < i && (i = o, r = t);
		}), this.selectedIndex = r, this.selectedIndex !== t && this.dispatchEvent(new CustomEvent("slide-changed", { detail: { index: this.selectedIndex } }));
	}
	goToSlide(e) {
		let t = this.defaultSlot?.assignedElements({ flatten: !0 }) ?? [];
		t[e] && this.slider.scrollTo({
			left: t[e].offsetLeft,
			behavior: "smooth"
		});
	}
	onPrevClick() {
		this.goToSlide(this.selectedIndex - 1);
	}
	onNextClick() {
		let e = this.defaultSlot?.assignedElements({ flatten: !0 }) ?? [];
		this.selectedIndex < e.length - 1 && this.goToSlide(this.selectedIndex + 1);
	}
	render() {
		let e = this.defaultSlot?.assignedElements({ flatten: !0 }) ?? [];
		return l`
			<div class="relative inset-0">
				<!-- The scrollable track -->
				<div class="slider" id="slider">
					<slot></slot>
				</div>

				<!-- Next/Prev Buttons (Optional) -->
				${this.showArrows ? l`
							<schmancy-icon-button
								class="absolute left-2 top-1/2 -translate-y-1/2"
								@click=${this.onPrevClick}
								?disabled=${this.selectedIndex === 0}
							>
								chevron_left
							</schmancy-icon-button>
							<schmancy-icon-button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								@click=${this.onNextClick}
								?disabled=${this.selectedIndex === e.length - 1}
							>
								chevron_right
							</schmancy-icon-button>
						` : null}

				<!-- Dots / indicators -->
				<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex  space-x-2">
					${e.map((e, t) => l`
							<schmancy-button .variant=${t === this.selectedIndex ? "filled tonal" : "outlined"} class="rounded-full ">
							</schmancy-button>
						`)}
				</div>
			</div>
		`;
	}
};
e([s()], f.prototype, "selectedIndex", void 0), e([a({ type: Boolean })], f.prototype, "showArrows", void 0), e([o("#slider")], f.prototype, "slider", void 0), e([o("slot")], f.prototype, "defaultSlot", void 0), f = e([i("schmancy-slider")], f);
export { d as SchmancySlide, f as SchmancySlider };
