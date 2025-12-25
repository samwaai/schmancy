import { html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { $LitElement } from '@mixins/index'
import type { PillDataPoint, PillSegment } from './types'

/** Default color palette for segments - expanded for uniqueness */
const DEFAULT_COLORS = [
	'bg-primary',
	'bg-secondary',
	'bg-tertiary',
	'bg-success',
	'bg-warning',
	'bg-error',
	'bg-primary/70',
	'bg-secondary/70',
	'bg-tertiary/70',
	'bg-success/70',
	'bg-warning/70',
	'bg-error/70',
	'bg-primary/40',
	'bg-secondary/40',
	'bg-tertiary/40',
]

@customElement('schmancy-pills')
export class SchmancyPills extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	/** Chart data points */
	@property({ type: Array })
	data: PillDataPoint[] = []

	/** Prefix for values (e.g., "EUR ") */
	@property({ type: String })
	valuePrefix = ''

	/** Suffix for values (e.g., "%") */
	@property({ type: String })
	valueSuffix = ''

	/** Decimal places for value display */
	@property({ type: Number })
	valueDecimals = 2

	/** Show medals for top 3 */
	@property({ type: Boolean })
	showMedals = true

	/** Show legend for segments */
	@property({ type: Boolean })
	showLegend = true

	/** Animation duration in milliseconds */
	@property({ type: Number })
	animationDuration = 500

	/** Enable entrance animation */
	@property({ type: Boolean })
	animated = true

	/** Label column width (Tailwind class) */
	@property({ type: String })
	labelWidth = 'w-14'

	/** Value column width (Tailwind class) */
	@property({ type: String })
	valueWidth = 'w-20'

	@state() private animationProgress = 0
	@state() private isVisible = false
	@state() private categoryColorMap = new Map<string, string>()

	private observer: IntersectionObserver | null = null
	private animationFrameId: number | null = null

	connectedCallback() {
		super.connectedCallback()
		this.setupIntersectionObserver()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.cleanup()
	}

	private cleanup() {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId)
			this.animationFrameId = null
		}
		if (this.observer) {
			this.observer.disconnect()
			this.observer = null
		}
	}

	private setupIntersectionObserver() {
		this.observer = new IntersectionObserver(
			entries => {
				const entry = entries[0]
				if (entry.isIntersecting && !this.isVisible) {
					this.isVisible = true
					if (this.animated) {
						this.startAnimation()
					} else {
						this.animationProgress = 1
					}
				}
			},
			{ threshold: 0.1 }
		)
	}

	protected firstUpdated() {
		if (this.observer) {
			this.observer.observe(this)
		}
	}

	protected updated(changedProperties: PropertyValues) {
		super.updated(changedProperties)

		// Restart animation when data changes
		if (changedProperties.has('data') && this.isVisible && this.animated) {
			this.animationProgress = 0
			this.startAnimation()
		}
	}

	private startAnimation() {
		const startTime = performance.now()
		const duration = this.animationDuration

		const animateFrame = (currentTime: number) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			// Ease out cubic
			this.animationProgress = 1 - Math.pow(1 - progress, 3)

			if (progress < 1 && this.isVisible) {
				this.animationFrameId = requestAnimationFrame(animateFrame)
			}
		}

		this.animationFrameId = requestAnimationFrame(animateFrame)
	}

	private initializeCategoryColors(): void {
		// Build consistent color map from all segments in data
		const categoryTotals = new Map<string, number>()
		const explicitColors = new Map<string, string>()

		this.data.forEach(d => {
			if (d.segments) {
				d.segments.forEach(seg => {
					categoryTotals.set(seg.label, (categoryTotals.get(seg.label) || 0) + seg.value)
					// Capture explicit colors from segments
					if (seg.color && !explicitColors.has(seg.label)) {
						explicitColors.set(seg.label, seg.color)
					}
				})
			}
		})

		// Sort by total value (most = first color)
		const sortedCategories = Array.from(categoryTotals.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([cat]) => cat)

		// Clear and rebuild - use explicit colors if available, otherwise default palette
		this.categoryColorMap.clear()
		let defaultColorIndex = 0
		sortedCategories.forEach(cat => {
			if (explicitColors.has(cat)) {
				this.categoryColorMap.set(cat, explicitColors.get(cat)!)
			} else {
				this.categoryColorMap.set(cat, DEFAULT_COLORS[defaultColorIndex % DEFAULT_COLORS.length])
				defaultColorIndex++
			}
		})
	}

	private getSegmentColor(segment: PillSegment): string {
		// Use explicit color if provided
		if (segment.color) return segment.color
		// Otherwise use from color map
		return this.categoryColorMap.get(segment.label) || 'bg-primary'
	}

	private formatValue(value: number): string {
		const formatted = value.toFixed(this.valueDecimals)
		return `${this.valuePrefix}${formatted}${this.valueSuffix}`
	}

	private getMedalEmoji(rank: number | undefined): string {
		if (!this.showMedals || !rank) return ''
		if (rank === 1) return '🥇'
		if (rank === 2) return '🥈'
		if (rank === 3) return '🥉'
		return ''
	}

	private getMaxValue(): number {
		if (this.data.length === 0) return 0
		return Math.max(...this.data.map(d => d.value), 1)
	}

	private renderBar(dataPoint: PillDataPoint, maxValue: number): ReturnType<typeof html> {
		const percentage = maxValue > 0 ? (dataPoint.value / maxValue) * 100 : 0
		const animatedPercentage = percentage * this.animationProgress

		// If no segments, render solid bar
		if (!dataPoint.segments || dataPoint.segments.length === 0) {
			const barColorClass = dataPoint.isPeak
				? 'bg-success'
				: dataPoint.isLow
					? 'bg-tertiary opacity-70'
					: dataPoint.value === 0
						? 'bg-tertiary/40'
						: 'bg-primary'

			return html`
				<div
					class="${barColorClass} h-full transition-all rounded-full"
					style="width: ${Math.max(animatedPercentage, dataPoint.value > 0 ? 2 : 0)}%; transition-duration: ${this.animated ? '0ms' : '300ms'}"
					title="${this.formatValue(dataPoint.value)}"
				></div>
			`
		}

		// Stacked bar with segments
		return html`
			<div
				class="h-full flex"
				style="width: ${Math.max(animatedPercentage, 2)}%; transition-duration: ${this.animated ? '0ms' : '300ms'}"
			>
				${repeat(
					dataPoint.segments,
					seg => seg.label,
					(seg, index) => {
						const segmentPercentage = dataPoint.value > 0 ? (seg.value / dataPoint.value) * 100 : 0
						const marginLeft = index > 0 ? 'ml-px' : ''
						const brightenClass = dataPoint.isPeak ? 'brightness-110' : ''
						const colorClass = this.getSegmentColor(seg)

						return html`
							<div
								class="${colorClass} ${marginLeft} ${brightenClass} h-full transition-all
									${index === 0 ? 'rounded-l-full' : ''}
									${index === dataPoint.segments!.length - 1 ? 'rounded-r-full' : ''}"
								style="width: ${segmentPercentage}%"
								title="${seg.label}: ${this.formatValue(seg.value)}"
							></div>
						`
					}
				)}
			</div>
		`
	}

	private renderLegend(): ReturnType<typeof html> {
		if (!this.showLegend || this.categoryColorMap.size === 0) {
			return html``
		}

		return html`
			<div class="flex flex-wrap gap-3 mt-4 pt-4 border-t border-outline-variant">
				${repeat(
					Array.from(this.categoryColorMap.entries()),
					([cat]) => cat,
					([cat, color]) => html`
						<div class="flex items-center gap-1.5">
							<div class="${color} w-3 h-3 rounded-sm"></div>
							<schmancy-typography type="label" token="sm" class="text-surface-onVariant">
								${cat}
							</schmancy-typography>
						</div>
					`
				)}
			</div>
		`
	}

	render() {
		// Initialize colors before rendering
		this.initializeCategoryColors()

		if (!this.data || this.data.length === 0) {
			return html``
		}

		const maxValue = this.getMaxValue()

		return html`
			<div class="space-y-1">
				${repeat(
					this.data,
					d => d.label,
					d => {
						const rowBgClass = d.isPeak ? 'bg-success/10 rounded-lg' : ''
						const textColorClass = d.isPeak ? 'text-success font-bold' : 'text-surface-on'

						return html`
							<div class="flex items-center gap-3 py-2 px-2 ${rowBgClass}">
								<!-- Label -->
								<div class="${this.labelWidth} shrink-0 text-right">
									<schmancy-typography type="label" token="md" class="${textColorClass}">
										${d.label}
									</schmancy-typography>
								</div>

								<!-- Medal -->
								<div class="w-6 shrink-0 text-center">
									${d.isPeak || (d.rank && d.rank <= 3)
										? html`<span class="text-sm">${this.getMedalEmoji(d.rank)}</span>`
										: ''}
								</div>

								<!-- Bar -->
								<div class="flex-1 h-6 bg-secondary/15 rounded-full overflow-hidden">
									${this.renderBar(d, maxValue)}
								</div>

								<!-- Value -->
								<div class="${this.valueWidth} shrink-0 text-right">
									<schmancy-typography type="label" token="md" class="${textColorClass}">
										${this.formatValue(d.value)}
									</schmancy-typography>
								</div>
							</div>
						`
					}
				)}
			</div>

			<!-- Legend -->
			${this.renderLegend()}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-pills': SchmancyPills
	}
}
