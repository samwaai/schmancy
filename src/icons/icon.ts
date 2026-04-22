import { TailwindElement } from '@mixins/index'
import { consume } from '@lit/context'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { BehaviorSubject, combineLatest, takeUntil } from 'rxjs'
import { tap } from 'rxjs/operators'
import { SchmancyButtonSizeContext, type SchmancyButtonSize } from '../button/context'

/**
 * Icon size tokens - M3 aligned with optical size optimization
 * - xxs: 12px (opsz: 20) - fits in 24px buttons (ultra-compact)
 * - xs: 16px (opsz: 20) - fits in 32px buttons
 * - sm: 20px (opsz: 20) - fits in 40px buttons
 * - md: 24px (opsz: 24) - fits in 48px buttons (default)
 * - lg: 32px (opsz: 40) - fits in 56px buttons
 * - Or custom string like '48px'
 */
export type IconSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | string

/**
 * @element schmancy-icon
 * Material Symbols icon component with flexible font variation properties
 *
 * @cssprop --schmancy-icon-size - The size of the icon (default: 24px)
 * @cssprop --schmancy-icon-fill - Fill value for icon (0-1)
 * @cssprop --schmancy-icon-weight - Weight value for icon (100-700)
 * @cssprop --schmancy-icon-grade - Grade value for icon (-50-200)
 * @cssprop --schmancy-icon-opsz - Optical size (default: 24)
 * @csspart icon - The inner `<span>` carrying the Material Symbols glyph.
 */
@customElement('schmancy-icon')
export default class SchmancyIcon extends TailwindElement(css`
	:host {
		--schmancy-icon-size: 24px;
		--schmancy-icon-fill: 0;
		--schmancy-icon-weight: 400;
		--schmancy-icon-grade: 0;
		--schmancy-icon-opsz: 24;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--schmancy-icon-size);
		height: var(--schmancy-icon-size);
		font-size: var(--schmancy-icon-size);
		color: inherit;
		transition: font-variation-settings 0.2s ease;
	}

	.material-symbols {
		font-family: var(--schmancy-icon-font, 'Material Symbols Outlined');
		font-weight: normal;
		font-style: normal;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		-webkit-font-feature-settings: 'liga';
		font-feature-settings: 'liga';
		font-variation-settings:
			'FILL' var(--schmancy-icon-fill),
			'wght' var(--schmancy-icon-weight),
			'GRAD' var(--schmancy-icon-grade),
			'opsz' var(--schmancy-icon-opsz);
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* CSS-generated content is NOT translated by Google Translate */
	.material-symbols[data-icon]::before {
		content: attr(data-icon);
	}
`) {
	// Static flag to track if Google Fonts have been loaded
	private static fontsLoaded = false

	/**
	 * Load Material Symbols fonts from Google Fonts CDN
	 */
	private static loadFonts(): void {
		if (SchmancyIcon.fontsLoaded) {
			return
		}

		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
		document.head.appendChild(link)

		SchmancyIcon.fontsLoaded = true
	}

	/**
	 * Fill value for the icon (0-1)
	 * 0 = outlined, 1 = filled
	 */
	@property({ type: Number, reflect: true })
	fill = 0

	/**
	 * Weight value for the icon (100-700)
	 * Controls the thickness of the icon strokes
	 */
	@property({ type: Number, reflect: true })
	weight = 400

	/**
	 * Grade value for the icon (-50-200)
	 * Adjusts the visual weight/grade
	 */
	@property({ type: Number, reflect: true })
	grade = 0

	/**
	 * Icon variant style
	 * @values outlined | rounded | sharp
	 */
	@property({ type: String, reflect: true })
	variant: 'outlined' | 'rounded' | 'sharp' = 'outlined'

	/**
	 * Size of the icon - M3 aligned tokens or custom string
	 * Tokens: 'xxs' (12px), 'xs' (16px), 'sm' (20px), 'md' (24px), 'lg' (32px)
	 * Custom: any CSS size string like '48px', '2rem'
	 *
	 * When this icon is a descendant of `<schmancy-button>`, the button's
	 * `size` wins (via `SchmancyButtonSizeContext`). The local `size` only
	 * applies when there is no ancestor button.
	 */
	@property({ type: String, reflect: true })
	size: IconSize = 'md'

	/**
	 * Size inherited from an ancestor `<schmancy-button>` via context.
	 * Undefined when the icon is not nested in a button.
	 */
	@consume({ context: SchmancyButtonSizeContext, subscribe: true })
	@state()
	private _buttonSize?: SchmancyButtonSize

	/**
	 * Icon name - use this instead of slot content to prevent translation breaking icons.
	 * When set, this takes precedence over slot content.
	 * Example: <schmancy-icon icon="delete"></schmancy-icon>
	 */
	@property({ type: String })
	icon?: string

	// M3 aligned token sizes with optimal optical sizes
	private static readonly tokenSizes: Record<string, { size: string; opsz: number }> = {
		xxs: { size: '12px', opsz: 20 }, // fits in 24px buttons (ultra-compact)
		xs: { size: '16px', opsz: 20 },  // fits in 32px buttons
		sm: { size: '20px', opsz: 20 },  // fits in 40px buttons
		md: { size: '24px', opsz: 24 },  // fits in 48px buttons (default)
		lg: { size: '32px', opsz: 40 },  // fits in 56px buttons
	}

	/** Extract pixel value from a custom size string for optical size */
	private static computeOpticalSize(size: string): number {
		const px = parseFloat(size)
		return isNaN(px) ? 24 : Math.max(20, Math.min(48, Math.round(px)))
	}

	// RxJS subjects for reactive property updates
	private fill$ = new BehaviorSubject(this.fill)
	private weight$ = new BehaviorSubject(this.weight)
	private grade$ = new BehaviorSubject(this.grade)
	private variant$ = new BehaviorSubject(this.variant)

	// Captured icon name from slot content (translation-proof)
	@state()
	private _capturedIcon?: string

	// Observer for text content changes (ternaries update text nodes, not DOM structure)
	private _observer?: MutationObserver

	connectedCallback(): void {
		super.connectedCallback()

		// Capture initial icon name
		this._updateCapturedIcon()

		// Watch for text content changes (characterData) for dynamic icon updates
		this._observer = new MutationObserver(() => this._updateCapturedIcon())
		this._observer.observe(this, { childList: true, characterData: true, subtree: true })

		// Load Google Fonts if not already loaded
		SchmancyIcon.loadFonts()

		// Prevent browser translation from breaking icon ligatures
		// Using multiple methods for maximum compatibility:
		// - translate="no" (HTML5 standard)
		// - class="notranslate" (Google Translate specific)
		this.setAttribute('translate', 'no')
		this.classList.add('notranslate')

		// Set accessibility attributes for decorative icons
		if (!this.hasAttribute('aria-label') &&
		    !this.hasAttribute('aria-labelledby') &&
		    !this.hasAttribute('aria-hidden') &&
		    !this.hasAttribute('role')) {
			this.setAttribute('aria-hidden', 'true')
		}

		// Setup reactive CSS variable updates
		combineLatest([
			this.fill$,
			this.weight$,
			this.grade$,
			this.variant$
		]).pipe(
			tap(([fill, weight, grade, variant]) => {
				// Update CSS custom properties for smooth transitions
				this.style.setProperty('--schmancy-icon-fill', String(fill))
				this.style.setProperty('--schmancy-icon-weight', String(weight))
				this.style.setProperty('--schmancy-icon-grade', String(grade))

				// Update font family based on variant
				const fontFamily = {
					'outlined': 'Material Symbols Outlined',
					'rounded': 'Material Symbols Rounded',
					'sharp': 'Material Symbols Sharp'
				}[variant] || 'Material Symbols Outlined'

				this.style.setProperty('--schmancy-icon-font', fontFamily)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

	}

	/**
	 * Update captured icon from current text content
	 */
	private _updateCapturedIcon(): void {
		if (!this.icon) {
			const textContent = this.textContent?.trim()
			if (textContent && textContent !== this._capturedIcon) {
				this._capturedIcon = textContent
			}
		}
	}

	protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
		super.updated(changedProperties)

		// Update BehaviorSubjects when properties change
		if (changedProperties.has('fill')) {
			this.fill$.next(this.fill)
		}
		if (changedProperties.has('weight')) {
			this.weight$.next(this.weight)
		}
		if (changedProperties.has('grade')) {
			this.grade$.next(this.grade)
		}
		if (changedProperties.has('variant')) {
			this.variant$.next(this.variant)
		}
	}

	protected render(): unknown {
		const fontFamily = {
			'outlined': 'Material Symbols Outlined',
			'rounded': 'Material Symbols Rounded',
			'sharp': 'Material Symbols Sharp'
		}[this.variant] || 'Material Symbols Outlined'

		// Effective size: ancestor `<schmancy-button>` wins via context, else local `size`.
		const effectiveSize: IconSize = this._buttonSize ?? this.size
		// Resolve size: token → px, bare number → px, or pass through as-is
		const sizeConfig = SchmancyIcon.tokenSizes[effectiveSize]
		const isNumeric = !sizeConfig && /^\d+(\.\d+)?$/.test(effectiveSize)
		const iconSize = sizeConfig?.size || (isNumeric ? `${effectiveSize}px` : effectiveSize)
		const opticalSize = sizeConfig?.opsz || SchmancyIcon.computeOpticalSize(iconSize)

		// Set size on HOST so :host CSS picks it up
		this.style.setProperty('--schmancy-icon-size', iconSize)
		this.style.setProperty('--schmancy-icon-opsz', String(opticalSize))

		const style = {
			'--schmancy-icon-fill': this.fill,
			'--schmancy-icon-weight': this.weight,
			'--schmancy-icon-grade': this.grade,
			'--schmancy-icon-font': fontFamily,
		}

		// Priority: icon property > captured icon (for dynamic content)
		const iconName = this.icon || this._capturedIcon

		// Always render slot (hidden) to observe content changes, display via data-icon
		return html`
			<span class="material-symbols notranslate" part="icon" translate="no" data-icon=${iconName || ''} style=${this.styleMap(style)}></span>
			<slot style="display:none"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}