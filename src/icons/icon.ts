import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { BehaviorSubject, combineLatest, takeUntil } from 'rxjs'
import { tap } from 'rxjs/operators'

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
	 */
	@property({ type: String, reflect: true })
	size: IconSize = 'md'

	// M3 aligned token sizes with optimal optical sizes
	private static readonly tokenSizes: Record<string, { size: string; opsz: number }> = {
		xxs: { size: '12px', opsz: 20 }, // fits in 24px buttons (ultra-compact)
		xs: { size: '16px', opsz: 20 },  // fits in 32px buttons
		sm: { size: '20px', opsz: 20 },  // fits in 40px buttons
		md: { size: '24px', opsz: 24 },  // fits in 48px buttons (default)
		lg: { size: '32px', opsz: 40 },  // fits in 56px buttons
	}

	// RxJS subjects for reactive property updates
	private fill$ = new BehaviorSubject(this.fill)
	private weight$ = new BehaviorSubject(this.weight)
	private grade$ = new BehaviorSubject(this.grade)
	private variant$ = new BehaviorSubject(this.variant)

	connectedCallback(): void {
		super.connectedCallback()

		// Load Google Fonts if not already loaded
		SchmancyIcon.loadFonts()

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

		// Resolve size token or use custom value
		const sizeConfig = SchmancyIcon.tokenSizes[this.size]
		const iconSize = sizeConfig?.size || this.size
		const opticalSize = sizeConfig?.opsz || 24

		const style = {
			'--schmancy-icon-fill': this.fill,
			'--schmancy-icon-weight': this.weight,
			'--schmancy-icon-grade': this.grade,
			'--schmancy-icon-font': fontFamily,
			'--schmancy-icon-size': iconSize,
			'--schmancy-icon-opsz': opticalSize,
		}

		return html`
			<span class="material-symbols" part="icon" style=${this.styleMap(style)}>
				<slot></slot>
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}