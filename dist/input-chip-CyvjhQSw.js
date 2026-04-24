import { t as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./decorate-D_utPUsC.js";
import { BehaviorSubject as n, combineLatest as r } from "rxjs";
import { map as i, takeUntil as a, tap as o } from "rxjs/operators";
import { classMap as s } from "lit/directives/class-map.js";
import { customElement as c, property as l, state as u } from "lit/decorators.js";
import { LitElement as d, css as f, html as p } from "lit";
var m = class extends e(f`
	:host {
		display: inline-block;
		outline: none;
		min-width:fit-content

	}

	:host([disabled]) {
		pointer-events: none;
	}

	button {
		font-family: inherit;
	}

	.avatar-img {
		width: 20px;
		height: 20px;
		object-fit: cover;
	}

	/* Material Symbols font for icons */
	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 18px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
		font-feature-settings: 'liga';
		vertical-align: middle;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(0, 0, 0, 0.08);
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* State layer for M3 hover/focus/pressed states */
	.state-layer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 200ms ease;
	}

	:host(:not([disabled])) .chip-container:hover .state-layer {
		opacity: 0.08;
	}

	:host(:not([disabled])) .chip-container:focus-visible .state-layer {
		opacity: 0.1;
	}

	:host(:not([disabled])) .chip-container:active .state-layer {
		opacity: 0.1;
	}
`) {
	constructor() {
		super(), this.value = "", this.icon = "", this.avatar = "", this.removable = !0, this.disabled = !1, this.elevated = !1, this.chipHover$ = new n(!1), this.removeHover$ = new n(!1), this.focused$ = new n(!1), this.pressed$ = new n(!1), this.uiState = {
			chipHover: !1,
			removeHover: !1,
			focused: !1,
			pressed: !1
		}, this.ripples = [], this.nextRippleId = 0, this.handleChipClick = (e) => {
			if (this.disabled) return;
			let t = this.shadowRoot?.querySelector(".chip-container");
			if (t) {
				let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = this.nextRippleId++;
				this.ripples = [...this.ripples, {
					x: r,
					y: i,
					id: a
				}], setTimeout(() => {
					this.ripples = this.ripples.filter((e) => e.id !== a);
				}, 600);
			}
			this.dispatchEvent(new CustomEvent("click", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleRemove = (e) => {
			this.disabled || (e.stopPropagation(), this.dispatchEvent(new CustomEvent("remove", {
				detail: { value: this.value },
				bubbles: !0,
				composed: !0
			})));
		}, this.handleKeyDown = (e) => {
			if (!this.disabled) if (e.key !== "Delete" && e.key !== "Backspace" || !this.removable) {
				if (e.key === "Enter") {
					e.preventDefault();
					let t = new MouseEvent("click", {
						bubbles: !0,
						cancelable: !0,
						clientX: 0,
						clientY: 0
					});
					this.handleChipClick(t);
				}
			} else e.preventDefault(), this.handleRemove(e);
		}, this.handleFocus = () => {
			this.focused$.next(!0);
		}, this.handleBlur = () => {
			this.focused$.next(!1);
		};
		try {
			this.internals = this.attachInternals();
		} catch {
			this.internals = void 0;
		}
	}
	static {
		this.shadowRootOptions = {
			...d.shadowRootOptions,
			delegatesFocus: !0
		};
	}
	static {
		this.formAssociated = !0;
	}
	get form() {
		return this.internals?.form;
	}
	updated(e) {
		super.updated?.(e), e.has("value") && this.internals?.setFormValue(this.value || null);
	}
	connectedCallback() {
		super.connectedCallback(), r([
			this.chipHover$,
			this.removeHover$,
			this.focused$,
			this.pressed$
		]).pipe(i(([e, t, n, r]) => ({
			chipHover: e,
			removeHover: t,
			focused: n,
			pressed: r
		})), o((e) => {
			this.uiState = e;
		}), a(this.disconnecting)).subscribe();
	}
	render() {
		let e = this.avatar || this.icon, t = {
			"chip-container": !0,
			"inline-flex": !0,
			"items-center": !0,
			"gap-2": !0,
			"h-8": !0,
			"min-h-[32px]": !0,
			"rounded-full": !0,
			"cursor-default": !0,
			"transition-all": !0,
			"duration-200": !0,
			"select-none": !0,
			"text-sm": !0,
			"font-medium": !0,
			relative: !0,
			"overflow-hidden": !0,
			border: !0,
			"pl-2": e,
			"pl-4": !e,
			"pr-2": this.removable,
			"pr-4": !this.removable,
			"bg-surface-containerLow": !0,
			"text-surface-onVariant": !0,
			"border-outline": !0,
			"border-solid": !0,
			"focus-visible:outline": !this.disabled,
			"focus-visible:outline-2": !this.disabled,
			"focus-visible:outline-primary": !this.disabled,
			"focus-visible:outline-offset-2": !this.disabled,
			"opacity-38": this.disabled,
			"cursor-not-allowed": this.disabled
		}, n = {
			"size-[18px]": !0,
			flex: !0,
			"items-center": !0,
			"justify-center": !0,
			"rounded-full": !0,
			"transition-all": !0,
			"duration-200": !0,
			"cursor-pointer": !this.disabled,
			"-mr-1": !0,
			"hover:bg-surface-containerHighest": !this.disabled,
			"opacity-50": this.disabled
		};
		return p`
			<div
				class=${s(t)}
				@click=${this.handleChipClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${() => this.chipHover$.next(!0)}
				@mouseleave=${() => this.chipHover$.next(!1)}
				@mousedown=${() => this.pressed$.next(!0)}
				@mouseup=${() => this.pressed$.next(!1)}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				role="button"
				tabindex=${this.disabled ? "-1" : "0"}
				aria-disabled=${this.disabled}
				aria-label=${this.value}
			>
				<!-- Avatar image (if provided) -->
				${this.avatar ? p`
					<img
						src=${this.avatar}
						alt=""
						class="avatar-img rounded-full size-5"
					/>
				` : ""}

				<!-- Icon (if provided and no avatar) -->
				${this.icon && !this.avatar ? p`
					<span class="material-symbols-outlined text-[18px] shrink-0">
						${this.icon}
					</span>
				` : ""}

				<!-- Chip content -->
				<span class="text-sm font-medium leading-5">
					<slot></slot>
				</span>

				<!-- Remove button (shown by default for input chips) -->
				${this.removable ? p`
					<button
						class=${s(n)}
						@click=${this.handleRemove}
						@mouseenter=${() => this.removeHover$.next(!0)}
						@mouseleave=${() => this.removeHover$.next(!1)}
						aria-label="Remove"
						tabindex="-1"
						?disabled=${this.disabled}
					>
						<span class="material-symbols-outlined text-[18px]">
							close
						</span>
					</button>
				` : ""}

				<!-- Ripple effects -->
				${this.ripples.map((e) => p`
					<span
						class="ripple"
						style="left: ${e.x}px; top: ${e.y}px;"
					></span>
				`)}

				<!-- State layer for M3 hover/focus/pressed states -->
				<div class="state-layer"></div>
			</div>
		`;
	}
};
t([l({
	type: String,
	reflect: !0
})], m.prototype, "value", void 0), t([l({
	type: String,
	reflect: !0
})], m.prototype, "icon", void 0), t([l({
	type: String,
	reflect: !0
})], m.prototype, "avatar", void 0), t([l({
	type: Boolean,
	reflect: !0
})], m.prototype, "removable", void 0), t([l({
	type: Boolean,
	reflect: !0
})], m.prototype, "disabled", void 0), t([l({
	type: Boolean,
	reflect: !0
})], m.prototype, "elevated", void 0), t([u()], m.prototype, "uiState", void 0), t([u()], m.prototype, "ripples", void 0), m = t([c("schmancy-input-chip")], m);
export { m as t };
