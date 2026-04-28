import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-CszkJuNl.js";
import "./mixins.js";
import { customElement as n, property as r, state as i } from "lit/decorators.js";
import { css as a, html as o } from "lit";
import { createRef as s, ref as c } from "lit/directives/ref.js";
import { repeat as l } from "lit/directives/repeat.js";
function u(e, t, n, r, i) {
	let a = i * i, o = a * i;
	return {
		x: .5 * (2 * t.x + (-e.x + n.x) * i + (2 * e.x - 5 * t.x + 4 * n.x - r.x) * a + (-e.x + 3 * t.x - 3 * n.x + r.x) * o),
		y: .5 * (2 * t.y + (-e.y + n.y) * i + (2 * e.y - 5 * t.y + 4 * n.y - r.y) * a + (-e.y + 3 * t.y - 3 * n.y + r.y) * o)
	};
}
function d(e, t) {
	if (e.startsWith("rgb")) {
		let n = e.match(/[\d.]+/g);
		if (n && n.length >= 3) return `rgba(${n[0]}, ${n[1]}, ${n[2]}, ${t})`;
	}
	let n = e.replace("#", "");
	return n.length === 3 && (n = n.split("").map((e) => e + e).join("")), `rgba(${parseInt(n.substring(0, 2), 16)}, ${parseInt(n.substring(2, 4), 16)}, ${parseInt(n.substring(4, 6), 16)}, ${t})`;
}
function f(e) {
	return 1 - (1 - e) ** 3;
}
var p = class extends t(a`
	:host {
		display: block;
	}
`) {
	constructor(...e) {
		super(...e), this.data = [], this.height = 200, this.showGrid = !0, this.showLabels = !0, this.showTooltip = !0, this.peakCount = 3, this.animationDuration = 800, this.animated = !0, this.valuePrefix = "", this.valueSuffix = "", this.valueDecimals = 2, this.theme = {}, this.tooltipData = {
			visible: !1,
			x: 0,
			y: 0,
			label: "",
			value: 0
		}, this.animationProgress = 0, this.isVisible = !1, this.canvasRef = s(), this.containerRef = s(), this.animationFrameId = null, this.observer = null, this.processedData = [], this.resizeObserver = null, this.handlePointerMove = (e) => {
			if (this.processedData.length === 0 || !this.showTooltip) return;
			let t = this.canvasRef.value;
			if (!t) return;
			let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = null, a = Infinity;
			this.processedData.forEach((e) => {
				let t = Math.abs(e.x - r);
				t < a && (a = t, i = e);
			}), this.tooltipData = i && a < 30 ? {
				visible: !0,
				x: i.x,
				y: i.y,
				label: i.label,
				value: i.value,
				metadata: i.metadata
			} : {
				...this.tooltipData,
				visible: !1
			};
		}, this.handlePointerLeave = () => {
			this.tooltipData = {
				...this.tooltipData,
				visible: !1
			};
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.setupIntersectionObserver();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.cleanup();
	}
	cleanup() {
		this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.observer &&= (this.observer.disconnect(), null), this.resizeObserver &&= (this.resizeObserver.disconnect(), null);
	}
	setupIntersectionObserver() {
		this.observer = new IntersectionObserver((e) => {
			let t = e[0];
			t.isIntersecting && !this.isVisible ? (this.isVisible = !0, this.animated ? this.startAnimation() : (this.animationProgress = 1, this.drawChart())) : t.isIntersecting || (this.isVisible = !1, this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null));
		}, { threshold: .1 });
	}
	updated(e) {
		super.updated(e), this.containerRef.value && this.observer && this.observer.observe(this.containerRef.value), this.canvasRef.value && !this.resizeObserver && (this.resizeObserver = new ResizeObserver(() => {
			this.drawChart();
		}), this.resizeObserver.observe(this.canvasRef.value)), e.has("data") && this.isVisible && (this.animated ? (this.animationProgress = 0, this.startAnimation()) : (this.animationProgress = 1, this.drawChart())), (e.has("theme") || e.has("showGrid") || e.has("showLabels") || e.has("peakCount")) && this.isVisible && this.drawChart();
	}
	startAnimation() {
		let e = performance.now(), t = this.animationDuration, n = (r) => {
			let i = r - e, a = Math.min(i / t, 1);
			this.animationProgress = f(a), this.drawChart(), a < 1 && this.isVisible && (this.animationFrameId = requestAnimationFrame(n));
		};
		this.animationFrameId = requestAnimationFrame(n);
	}
	processData() {
		if (!this.data || this.data.length === 0) return [];
		let e = [...this.data].sort((e, t) => t.value - e.value), t = new Set(e.slice(0, this.peakCount).map((e) => e.label));
		return this.data.map((e) => ({
			...e,
			x: 0,
			y: 0,
			isPeak: t.has(e.label)
		}));
	}
	getThemeValue(e, t) {
		return this.theme[e] ?? t;
	}
	drawChart() {
		let e = this.canvasRef.value;
		if (!e) return;
		let t = e.getContext("2d");
		if (!t) return;
		let n = window.devicePixelRatio || 1, r = e.getBoundingClientRect(), i = r.width, a = r.height;
		e.width = i * n, e.height = a * n, t.scale(n, n), t.clearRect(0, 0, i, a);
		let o = this.processData();
		if (o.length === 0) return;
		let s = this.showLabels ? 40 : 20, c = i - 20 - 20, l = a - 20 - s, f = Math.max(...o.map((e) => e.value), 1), p = o.map((e, t) => ({
			...e,
			x: 20 + (o.length > 1 ? t / (o.length - 1) * c : c / 2),
			y: 20 + l - e.value / f * l
		}));
		this.processedData = p;
		let m = getComputedStyle(this).getPropertyValue("--schmancy-sys-color-primary").trim() || "#6750A4", h = this.getThemeValue("primaryColor", m), [g, _] = this.getThemeValue("gradientOpacity", [.4, .05]), v = this.getThemeValue("strokeWidth", 2), y = this.getThemeValue("pointRadius", 4), b = this.getThemeValue("peakRadius", 6);
		if (this.showGrid) {
			t.strokeStyle = "rgba(128, 128, 128, 0.15)", t.lineWidth = 1, t.setLineDash([4, 4]);
			for (let e = 1; e <= 3; e++) {
				let n = 20 + l * e / 4;
				t.beginPath(), t.moveTo(20, n), t.lineTo(i - 20, n), t.stroke();
			}
			t.setLineDash([]);
		}
		let x = new Path2D(), S = new Path2D();
		if (p.length >= 2) {
			S.moveTo(p[0].x, 20 + l), x.moveTo(p[0].x, p[0].y), S.lineTo(p[0].x, p[0].y);
			for (let e = 0; e < p.length - 1; e++) {
				let t = p[Math.max(0, e - 1)], n = p[e], r = p[Math.min(p.length - 1, e + 1)], i = p[Math.min(p.length - 1, e + 2)];
				for (let e = 1; e <= 16; e++) {
					let a = u(t, n, r, i, e / 16);
					x.lineTo(a.x, a.y), S.lineTo(a.x, a.y);
				}
			}
			S.lineTo(p[p.length - 1].x, 20 + l), S.closePath();
		} else p.length === 1 && x.arc(p[0].x, p[0].y, y, 0, 2 * Math.PI);
		if (t.save(), t.beginPath(), t.rect(0, 0, 20 + c * this.animationProgress, a), t.clip(), p.length >= 2) {
			let e = t.createLinearGradient(0, 20, 0, 20 + l);
			e.addColorStop(0, d(h, g)), e.addColorStop(1, d(h, _)), t.fillStyle = e, t.fill(S);
		}
		if (t.strokeStyle = h, t.lineWidth = v, t.lineCap = "round", t.lineJoin = "round", t.stroke(x), p.forEach((e, n) => {
			if (n / (p.length - 1 || 1) * this.animationProgress < n / (p.length || 1)) return;
			let r = e.isPeak ? b - 1 : y - 1, i = e.isPeak ? b + 4 : y + 2;
			e.isPeak && (t.beginPath(), t.arc(e.x, e.y, i, 0, 2 * Math.PI), t.fillStyle = d(h, .2), t.fill()), t.beginPath(), t.arc(e.x, e.y, r, 0, 2 * Math.PI), t.fillStyle = h, t.fill(), e.isPeak && (t.beginPath(), t.arc(e.x, e.y, 2, 0, 2 * Math.PI), t.fillStyle = "white", t.fill());
		}), t.restore(), this.showLabels && p.length > 0) {
			t.fillStyle = "rgba(128, 128, 128, 0.8)", t.font = "11px system-ui, sans-serif", t.textAlign = "center", t.textBaseline = "top";
			let e = i < 400 ? 3 : i < 600 ? 2 : 1;
			p.forEach((n, r) => {
				r % e === 0 && t.fillText(n.label, n.x, a - s + 8);
			});
		}
	}
	formatValue(e) {
		let t = e.toFixed(this.valueDecimals);
		return `${this.valuePrefix}${t}${this.valueSuffix}`;
	}
	renderMetadata() {
		return this.tooltipData.metadata ? Object.entries(this.tooltipData.metadata).map(([e, t]) => o`
				<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
					${e}: ${String(t)}
				</schmancy-typography>
			`) : "";
	}
	render() {
		return this.data && this.data.length !== 0 ? o`
			<div ${c(this.containerRef)} class="relative">
				<div class="relative" style="height: ${this.height}px; touch-action: pan-y;">
					<canvas
						${c(this.canvasRef)}
						class="w-full h-full"
						style="display: block;"
						@pointermove=${this.handlePointerMove}
						@pointerleave=${this.handlePointerLeave}
					></canvas>

					<!-- Tooltip -->
					${this.showTooltip ? o`
								<div
									class="absolute pointer-events-none transition-opacity duration-150 ${this.tooltipData.visible ? "opacity-100" : "opacity-0"}"
									style="
                    left: ${this.tooltipData.x}px;
                    top: ${this.tooltipData.y - 60}px;
                    transform: translateX(-50%);
                  "
								>
									<schmancy-surface elevation="3" rounded="all" class="px-3 py-2 min-w-max">
										<schmancy-typography type="label" token="sm" class="text-surface-onVariant">
											${this.tooltipData.label}
										</schmancy-typography>
										<schmancy-typography type="title" token="md" class="text-surface-on font-semibold">
											${this.formatValue(this.tooltipData.value)}
										</schmancy-typography>
										${this.renderMetadata()}
									</schmancy-surface>
								</div>
						  ` : ""}
				</div>
			</div>
		` : o``;
	}
};
e([r({ type: Array })], p.prototype, "data", void 0), e([r({ type: Number })], p.prototype, "height", void 0), e([r({ type: Boolean })], p.prototype, "showGrid", void 0), e([r({ type: Boolean })], p.prototype, "showLabels", void 0), e([r({ type: Boolean })], p.prototype, "showTooltip", void 0), e([r({ type: Number })], p.prototype, "peakCount", void 0), e([r({ type: Number })], p.prototype, "animationDuration", void 0), e([r({ type: Boolean })], p.prototype, "animated", void 0), e([r({ type: String })], p.prototype, "valuePrefix", void 0), e([r({ type: String })], p.prototype, "valueSuffix", void 0), e([r({ type: Number })], p.prototype, "valueDecimals", void 0), e([r({ type: Object })], p.prototype, "theme", void 0), e([i()], p.prototype, "tooltipData", void 0), e([i()], p.prototype, "animationProgress", void 0), e([i()], p.prototype, "isVisible", void 0), p = e([n("schmancy-area-chart")], p);
var m = [
	"bg-primary",
	"bg-secondary",
	"bg-tertiary",
	"bg-success",
	"bg-warning",
	"bg-error",
	"bg-primary/70",
	"bg-secondary/70",
	"bg-tertiary/70",
	"bg-success/70",
	"bg-warning/70",
	"bg-error/70",
	"bg-primary/40",
	"bg-secondary/40",
	"bg-tertiary/40"
], h = class extends t(a`
	:host {
		display: block;
	}
`) {
	constructor(...e) {
		super(...e), this.data = [], this.valuePrefix = "", this.valueSuffix = "", this.valueDecimals = 2, this.showMedals = !0, this.showLegend = !0, this.animationDuration = 500, this.animated = !0, this.labelWidth = "w-14", this.valueWidth = "w-20", this.animationProgress = 0, this.isVisible = !1, this.categoryColorMap = /* @__PURE__ */ new Map(), this.observer = null, this.animationFrameId = null;
	}
	connectedCallback() {
		super.connectedCallback(), this.setupIntersectionObserver();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.cleanup();
	}
	cleanup() {
		this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.observer &&= (this.observer.disconnect(), null);
	}
	setupIntersectionObserver() {
		this.observer = new IntersectionObserver((e) => {
			e[0].isIntersecting && !this.isVisible && (this.isVisible = !0, this.animated ? this.startAnimation() : this.animationProgress = 1);
		}, { threshold: .1 });
	}
	firstUpdated() {
		this.observer && this.observer.observe(this);
	}
	updated(e) {
		super.updated(e), e.has("data") && this.isVisible && this.animated && (this.animationProgress = 0, this.startAnimation());
	}
	startAnimation() {
		let e = performance.now(), t = this.animationDuration, n = (r) => {
			let i = r - e, a = Math.min(i / t, 1);
			this.animationProgress = 1 - (1 - a) ** 3, a < 1 && this.isVisible && (this.animationFrameId = requestAnimationFrame(n));
		};
		this.animationFrameId = requestAnimationFrame(n);
	}
	initializeCategoryColors() {
		let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
		this.data.forEach((n) => {
			n.segments && n.segments.forEach((n) => {
				e.set(n.label, (e.get(n.label) || 0) + n.value), n.color && !t.has(n.label) && t.set(n.label, n.color);
			});
		});
		let n = Array.from(e.entries()).sort((e, t) => t[1] - e[1]).map(([e]) => e);
		this.categoryColorMap.clear();
		let r = 0;
		n.forEach((e) => {
			t.has(e) ? this.categoryColorMap.set(e, t.get(e)) : (this.categoryColorMap.set(e, m[r % m.length]), r++);
		});
	}
	getSegmentColor(e) {
		return e.color ? e.color : this.categoryColorMap.get(e.label) || "bg-primary";
	}
	formatValue(e) {
		let t = e.toFixed(this.valueDecimals);
		return `${this.valuePrefix}${t}${this.valueSuffix}`;
	}
	getMedalEmoji(e) {
		return this.showMedals && e ? e === 1 ? "🥇" : e === 2 ? "🥈" : e === 3 ? "🥉" : "" : "";
	}
	getMaxValue() {
		return this.data.length === 0 ? 0 : Math.max(...this.data.map((e) => e.value), 1);
	}
	renderBar(e, t) {
		let n = (t > 0 ? e.value / t * 100 : 0) * this.animationProgress;
		return e.segments && e.segments.length !== 0 ? o`
			<div
				class="h-full flex"
				style="width: ${Math.max(n, 2)}%; transition-duration: ${this.animated ? "0ms" : "300ms"}"
			>
				${l(e.segments, (e) => e.label, (t, n) => {
			let r = e.value > 0 ? t.value / e.value * 100 : 0, i = n > 0 ? "ml-px" : "", a = e.isPeak ? "brightness-110" : "";
			return o`
							<div
								class="${this.getSegmentColor(t)} ${i} ${a} h-full transition-all
									${n === 0 ? "rounded-l-full" : ""}
									${n === e.segments.length - 1 ? "rounded-r-full" : ""}"
								style="width: ${r}%"
								title="${t.label}: ${this.formatValue(t.value)}"
							></div>
						`;
		})}
			</div>
		` : o`
				<div
					class="${e.isPeak ? "bg-success" : e.isLow ? "bg-tertiary opacity-70" : e.value === 0 ? "bg-tertiary/40" : "bg-primary"} h-full transition-all rounded-full"
					style="width: ${Math.max(n, e.value > 0 ? 2 : 0)}%; transition-duration: ${this.animated ? "0ms" : "300ms"}"
					title="${this.formatValue(e.value)}"
				></div>
			`;
	}
	renderLegend() {
		return this.showLegend && this.categoryColorMap.size !== 0 ? o`
			<div class="flex flex-wrap gap-3 mt-4 pt-4 border-t border-outline-variant">
				${l(Array.from(this.categoryColorMap.entries()), ([e]) => e, ([e, t]) => o`
						<div class="flex items-center gap-1.5">
							<div class="${t} w-3 h-3 rounded-sm"></div>
							<schmancy-typography type="label" token="sm" class="text-surface-onVariant">
								${e}
							</schmancy-typography>
						</div>
					`)}
			</div>
		` : o``;
	}
	render() {
		if (this.initializeCategoryColors(), !this.data || this.data.length === 0) return o``;
		let e = this.getMaxValue();
		return o`
			<div class="space-y-1">
				${l(this.data, (e) => e.label, (t) => {
			let n = t.isPeak ? "bg-success/10 rounded-lg" : "", r = t.isPeak ? "text-success font-bold" : "text-surface-on";
			return o`
							<div class="flex items-center gap-3 py-2 px-2 ${n}">
								<!-- Label -->
								<div class="${this.labelWidth} shrink-0 text-right">
									<schmancy-typography type="label" token="md" class="${r}">
										${t.label}
									</schmancy-typography>
								</div>

								<!-- Medal -->
								<div class="w-6 shrink-0 text-center">
									${t.isPeak || t.rank && t.rank <= 3 ? o`<span class="text-sm">${this.getMedalEmoji(t.rank)}</span>` : ""}
								</div>

								<!-- Bar -->
								<div class="flex-1 h-6 bg-secondary/15 rounded-full overflow-hidden">
									${this.renderBar(t, e)}
								</div>

								<!-- Value -->
								<div class="${this.valueWidth} shrink-0 text-right">
									<schmancy-typography type="label" token="md" class="${r}">
										${this.formatValue(t.value)}
									</schmancy-typography>
								</div>
							</div>
						`;
		})}
			</div>

			<!-- Legend -->
			${this.renderLegend()}
		`;
	}
};
e([r({ type: Array })], h.prototype, "data", void 0), e([r({ type: String })], h.prototype, "valuePrefix", void 0), e([r({ type: String })], h.prototype, "valueSuffix", void 0), e([r({ type: Number })], h.prototype, "valueDecimals", void 0), e([r({ type: Boolean })], h.prototype, "showMedals", void 0), e([r({ type: Boolean })], h.prototype, "showLegend", void 0), e([r({ type: Number })], h.prototype, "animationDuration", void 0), e([r({ type: Boolean })], h.prototype, "animated", void 0), e([r({ type: String })], h.prototype, "labelWidth", void 0), e([r({ type: String })], h.prototype, "valueWidth", void 0), e([i()], h.prototype, "animationProgress", void 0), e([i()], h.prototype, "isVisible", void 0), e([i()], h.prototype, "categoryColorMap", void 0), h = e([n("schmancy-pills")], h);
export { p as SchmancyAreaChart, h as SchmancyPills, u as catmullRomSpline, f as easeOutCubic, d as hexToRgba };
