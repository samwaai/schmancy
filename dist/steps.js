import { a as e, o as t } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t as n } from "./provide-BuzyBLGj.js";
import { t as r } from "./decorate-D_utPUsC.js";
import { t as i } from "./litElement.mixin-BnNYZ24e.js";
import { BehaviorSubject as a } from "rxjs";
import { distinctUntilChanged as o, takeUntil as s, tap as c } from "rxjs/operators";
import { customElement as l, property as u, state as d } from "lit/decorators.js";
import { css as f, html as p } from "lit";
import { when as m } from "lit/directives/when.js";
var h = class {
	constructor() {
		this._currentStep = new a(1);
	}
	get currentStep$() {
		return this._currentStep.asObservable();
	}
	get currentStep() {
		return this._currentStep.value;
	}
	setStep(e) {
		this._currentStep.next(e);
	}
}, g = t(Symbol("SchmancyStepsContext")), _ = class extends i(f`
	:host {
		display: grid;
		/* Base display is just grid, flex properties will be applied dynamically */
		transition: all 0.2s ease-in-out;
	}
`) {
	constructor(...e) {
		super(...e), this.position = 1, this.title = "", this.description = "", this.completed = !1, this.lockBack = !1, this.currentStep = 1;
	}
	connectedCallback() {
		super.connectedCallback();
	}
	firstUpdated() {
		this.subscription = this.steps.currentStep$.subscribe((e) => {
			this.currentStep = e, this.updateFlexProperties();
		}), this.updateFlexProperties();
	}
	disconnectedCallback() {
		this.subscription?.unsubscribe(), super.disconnectedCallback();
	}
	updateFlexProperties() {
		this.position === this.currentStep ? this.style.flex = "1 1 auto" : this.style.flex = "0 0 auto";
	}
	get status() {
		return this.completed || this.position < this.currentStep ? "complete" : this.position === this.currentStep ? "current" : "upcoming";
	}
	_onStepClick(e) {
		this.lockBack && this.position < this.currentStep || this.status !== "upcoming" && this.steps.setStep(this.position);
	}
	render() {
		let e = this.position === this.currentStep, t = this.status === "complete", n = this.status === "upcoming", r = {
			"bg-tertiary-default": t,
			"bg-outlineVariant": !t
		}, i = {
			"relative border-solid z-10 flex size-8 items-center justify-center rounded-full transition-all duration-200": !0,
			"bg-tertiary-default text-tertiary-on shadow-md group-hover:shadow-lg": t,
			"border-2 border-primary-default bg-primary-container text-primary-onContainer shadow-sm": !t && e,
			"border-2 border-outline bg-surface-default text-surface-onVariant group-hover:border-primary-default group-hover:bg-primary-container": n
		}, a = {
			"text-primary-default font-medium": e,
			"text-tertiary-default": t,
			"text-surface-onVariant": n
		}, o = e || t ? "cursor-pointer" : "";
		return p`
			<li class="relative">
				<!-- Connector line - responsive positioning -->
				<div
					class="absolute top-8 left-3 sm:left-4 -ml-px w-0.5 transition-colors duration-200 ${this.classMap(r)}"
					style="height: calc(100% + var(--steps-gap, 0px))"
					aria-hidden="true"
				></div>

				<!-- Step Button/Label - adjusted padding for mobile -->
				<button
					type="button"
					@click=${this._onStepClick}
					class="relative flex items-center group transition-all duration-200 hover:scale-[1.02] ${o} ${e ? "bg-primary-container/20 -mx-1 sm:-mx-2 px-1 sm:px-2 py-2 sm:py-3 rounded-lg" : "py-1 sm:py-2"}"
				>
					<span class="flex items-center h-10 sm:h-12">
						<span class=${this.classMap(i)}>
							${t ? p`
										<svg class="size-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
												clip-rule="evenodd"
											/>
										</svg>
									` : p`
										<span
											class="size-3 rounded-full transition-all duration-200 ${e ? "bg-primary-onContainer" : "bg-transparent group-hover:bg-primary-default group-hover:scale-125"}"
										></span>
									`}
						</span>
					</span>

					<span class="flex flex-col items-start justify-center min-w-0 ml-3 sm:ml-6">
						<schmancy-typography type="title" token="md">
							<span class="transition-colors duration-200 ${this.classMap(a)}">${this.title}</span>
						</schmancy-typography>
						${m(this.description, () => p`
								<schmancy-typography type="body" token="sm" class="mt-0.5 sm:mt-1">
									<span class="text-surface-onVariant transition-colors duration-200 ${e ? "text-primary-onContainer" : ""}">${this.description}</span>
								</schmancy-typography>
							`)}
					</span>
				</button>

				<!-- Render step content if the step is active - responsive spacing -->
				${m(e, () => p`
						<div class="ml-6 sm:ml-10 mt-3 sm:mt-4 pb-6 sm:pb-8 transition-all duration-300 ease-out">
						<slot></slot>
						</div>
					`)}
			</li>
		`;
	}
};
r([u({ type: Number })], _.prototype, "position", void 0), r([u({ type: String })], _.prototype, "title", void 0), r([u({ type: String })], _.prototype, "description", void 0), r([u({
	type: Boolean,
	reflect: !0
})], _.prototype, "completed", void 0), r([u({ type: Boolean })], _.prototype, "lockBack", void 0), r([e({ context: g })], _.prototype, "steps", void 0), r([d()], _.prototype, "currentStep", void 0), _ = r([l("schmancy-step")], _);
var v = class extends i(f`
	:host {
		display: block;
		overflow: auto;
	}
`) {
	constructor(...e) {
		super(...e), this.controller = new h(), this.stepsController = this.controller, this.gap = 4, this.handleChange = (e) => {
			e.target !== this && e.stopPropagation();
		};
	}
	set currentStep(e) {
		this.controller.currentStep !== e && this.controller.setStep(e);
	}
	get currentStep() {
		return this.controller.currentStep;
	}
	connectedCallback() {
		super.connectedCallback(), this.controller.currentStep$.pipe(o(), c((e) => {
			this.requestUpdate(), this.dispatchScopedEvent("change", { value: e }, { bubbles: !1 });
		}), s(this.disconnecting)).subscribe();
	}
	render() {
		let e = `gap-${this.gap}`, t = {
			0: "0",
			1: "0.25rem",
			2: "0.5rem",
			3: "0.75rem",
			4: "1rem",
			5: "1.25rem",
			6: "1.5rem",
			8: "2rem",
			10: "2.5rem",
			12: "3rem",
			16: "4rem",
			20: "5rem",
			24: "6rem"
		}[this.gap] || "1rem";
		return p`
			<nav class="flex h-full w-full" aria-label="Progress" @change=${this.handleChange}>
				<ol class="flex flex-col flex-1 ${e}" role="list" style="--steps-gap: ${t}">
					<slot></slot>
				</ol>
			</nav>
		`;
	}
};
r([n({ context: g })], v.prototype, "stepsController", void 0), r([u({
	type: Number,
	reflect: !0
})], v.prototype, "currentStep", null), r([u({
	type: Number,
	reflect: !0
})], v.prototype, "gap", void 0), v = r([l("schmancy-steps-container")], v);
export { _ as SchmancyStep, v as SchmancyStepsContainer, h as StepsController, g as stepsContext };
