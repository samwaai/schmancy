import { SchmancyElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { magnetic } from '../directives/magnetic'

export type FabVariant = 'surface' | 'primary' | 'secondary' | 'tertiary'
export type FabSize = 'small' | 'medium' | 'large'

/**
 * Material 3 Floating Action Button.
 *
 * Mirrors the `md-fab` reference implementation
 * (github.com/material-components/material-web) and the M3 spec
 * (m3.material.io/components/floating-action-button): four colour
 * variants, three container sizes, an extended form (set `label`),
 * and a `lowered` elevation register. Per M3 guidance a FAB is never
 * disabled, so there is no `disabled` property.
 *
 * Sizing, shape, icon size and elevation are M3 design tokens expressed
 * as `:host` rules (the same token-driven model as `md-fab`'s SCSS);
 * colour roles and the state layer are schmancy theme utilities. The
 * host shrink-wraps the inner button and clips its rounded shape.
 *
 * @element schmancy-fab
 * @slot - The icon (typically `<schmancy-icon>`).
 * @csspart base - The underlying native `<button>`.
 */
@customElement('schmancy-fab')
export class SchmancyFab extends SchmancyElement {
	static styles = [
		css`
			:host {
				/* M3 FAB (medium) — 16dp shape, 24dp icon, resting level 3 */
				display: inline-flex;
				position: relative;
				touch-action: manipulation;
				overflow: hidden;
				border-radius: 16px;
				--_icon: 24px;
				--_elevation: var(--schmancy-sys-elevation-3);
				--_elevation-hover: var(--schmancy-sys-elevation-4);
				box-shadow: var(--_elevation);
				transition:
					box-shadow 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
					transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
			}
			/* M3 small FAB — 12dp shape */
			:host([size='small']) {
				border-radius: 12px;
			}
			/* M3 large FAB — 28dp shape, 36dp icon */
			:host([size='large']) {
				border-radius: 28px;
				--_icon: 36px;
			}
			/* Extended FAB always uses the 16dp shape / 24dp icon */
			:host([extended]) {
				border-radius: 16px;
				--_icon: 24px;
			}
			/* M3 lowered register — resting level 1, hover level 2 */
			:host([lowered]) {
				--_elevation: var(--schmancy-sys-elevation-1);
				--_elevation-hover: var(--schmancy-sys-elevation-2);
			}
			:host(:hover) {
				box-shadow: var(--_elevation-hover);
			}
			:host(:active) {
				/* M3 pressed elevation == resting; schmancy spring press */
				box-shadow: var(--_elevation);
				transform: scale(0.96);
				transition-duration: 100ms;
			}
			::slotted(*) {
				font-size: var(--_icon);
				width: var(--_icon);
				height: var(--_icon);
			}
			:host([extended]) ::slotted(*) {
				margin-inline-end: 12px;
			}
			@media (prefers-reduced-motion: reduce) {
				:host {
					transition: none;
				}
				:host(:active) {
					transform: none;
				}
			}
			:host *,
			* {
				touch-action: manipulation;
			}
		`,
	]

	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: true,
	}

	@query('[part="base"]', true)
	private nativeElement!: HTMLElement

	private ariaLabelValue!: string

	/**
	 * Colour variant. M3 maps each to a container + on-container role.
	 * @attr
	 * @default 'surface'
	 */
	@property({ reflect: true, type: String })
	public variant: FabVariant = 'surface'

	/**
	 * Container size. Ignored while extended (extended is always 56dp tall).
	 * @attr
	 * @default 'medium'
	 */
	@property({ reflect: true, type: String })
	public size: FabSize = 'medium'

	/**
	 * Extended-FAB label. A non-empty value switches the FAB to its
	 * extended form (icon + text), exactly as `md-fab` derives extended
	 * from a truthy label.
	 * @attr
	 */
	@property({ type: String })
	public label = ''

	/**
	 * Reflected mirror of "label is non-empty" so `:host([extended])`
	 * can drive the extended geometry. Synced from `label`; read it,
	 * don't set it.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	public extended = false

	/**
	 * Lowers the FAB's elevation register (M3 lowered FAB).
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	public lowered = false

	public override set ariaLabel(value: string) {
		const oldVal = this.ariaLabelValue
		this.ariaLabelValue = value
		if (this.hasAttribute('aria-label')) {
			this.removeAttribute('aria-label')
		}
		this.requestUpdate('ariaLabel', oldVal)
	}

	@property({ attribute: 'aria-label' })
	public override get ariaLabel() {
		return this.ariaLabelValue
	}

	/** Sets focus on the FAB. */
	public override focus(options?: FocusOptions) {
		this.nativeElement.focus(options)
	}

	/** Removes focus from the FAB. */
	public override blur() {
		this.nativeElement.blur()
	}

	protected willUpdate(changed: Map<string, unknown>) {
		if (changed.has('label')) this.extended = this.label.length > 0
	}

	render() {
		const classes = {
			'relative z-0 flex items-center justify-center overflow-hidden border-0 cursor-pointer outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-secondary-default':
				true,
			// M3 container — fixed square per size, content-width when extended
			'size-10': !this.extended && this.size === 'small',
			'size-14': !this.extended && this.size === 'medium',
			'size-24': !this.extended && this.size === 'large',
			'h-14 ps-4 pe-5 gap-3 text-sm font-medium leading-5': this.extended,
			// M3 container + on-container colour roles per variant
			'bg-surface-containerHigh text-primary-default': this.variant === 'surface',
			'bg-primary-container text-primary-onContainer': this.variant === 'primary',
			'bg-secondary-container text-secondary-onContainer': this.variant === 'secondary',
			'bg-tertiary-container text-tertiary-onContainer': this.variant === 'tertiary',
		}

		const stateLayerClasses = {
			'absolute inset-0 z-0 opacity-0 transition-opacity duration-150 hover:opacity-8 focus-visible:opacity-10 active:opacity-10':
				true,
			'bg-primary-default': this.variant === 'surface',
			'bg-primary-onContainer': this.variant === 'primary',
			'bg-secondary-onContainer': this.variant === 'secondary',
			'bg-tertiary-onContainer': this.variant === 'tertiary',
		}

		return html`
			<button
				${magnetic({ strength: 3, radius: 60 })}
				part="base"
				type="button"
				aria-label=${ifDefined(this.ariaLabel)}
				class="${this.classMap(classes)}"
			>
				<div class="${this.classMap(stateLayerClasses)}"></div>
				<slot aria-hidden=${ifDefined(this.ariaLabel || this.label ? 'true' : undefined)}></slot>
				${when(this.extended, () => html`<span class="relative z-0">${this.label}</span>`)}
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-fab': SchmancyFab
	}
}
