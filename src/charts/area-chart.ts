import { html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ref, createRef, Ref } from 'lit/directives/ref.js'
import { $LitElement } from '@mixins/index'
import type { ChartDataPoint, ChartTheme, ProcessedDataPoint } from './types'
import { catmullRomSpline, hexToRgba, easeOutCubic } from './utils'

interface TooltipData {
	visible: boolean
	x: number
	y: number
	label: string
	value: number
	metadata?: Record<string, unknown>
}

@customElement('schmancy-area-chart')
export class SchmancyAreaChart extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	/** Chart data points */
	@property({ type: Array })
	data: ChartDataPoint[] = []

	/** Chart height in pixels */
	@property({ type: Number })
	height = 200

	/** Show grid lines */
	@property({ type: Boolean })
	showGrid = true

	/** Show x-axis labels */
	@property({ type: Boolean })
	showLabels = true

	/** Enable tooltips */
	@property({ type: Boolean })
	showTooltip = true

	/** Number of peaks to highlight */
	@property({ type: Number })
	peakCount = 3

	/** Animation duration in milliseconds */
	@property({ type: Number })
	animationDuration = 800

	/** Enable entrance animation */
	@property({ type: Boolean })
	animated = true

	/** Prefix for values (e.g., "EUR ") */
	@property({ type: String })
	valuePrefix = ''

	/** Suffix for values (e.g., "%") */
	@property({ type: String })
	valueSuffix = ''

	/** Decimal places for value display */
	@property({ type: Number })
	valueDecimals = 2

	/** Theme overrides */
	@property({ type: Object })
	theme: Partial<ChartTheme> = {}

	@state() private tooltipData: TooltipData = {
		visible: false,
		x: 0,
		y: 0,
		label: '',
		value: 0,
	}

	@state() private animationProgress = 0
	@state() private isVisible = false

	private canvasRef: Ref<HTMLCanvasElement> = createRef()
	private containerRef: Ref<HTMLDivElement> = createRef()
	private animationFrameId: number | null = null
	private observer: IntersectionObserver | null = null
	private processedData: ProcessedDataPoint[] = []
	private resizeObserver: ResizeObserver | null = null

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
		if (this.resizeObserver) {
			this.resizeObserver.disconnect()
			this.resizeObserver = null
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
						this.drawChart()
					}
				} else if (!entry.isIntersecting) {
					this.isVisible = false
					if (this.animationFrameId !== null) {
						cancelAnimationFrame(this.animationFrameId)
						this.animationFrameId = null
					}
				}
			},
			{ threshold: 0.1 }
		)
	}

	protected updated(changedProperties: PropertyValues) {
		super.updated(changedProperties)

		if (this.containerRef.value && this.observer) {
			this.observer.observe(this.containerRef.value)
		}

		if (this.canvasRef.value && !this.resizeObserver) {
			this.resizeObserver = new ResizeObserver(() => {
				this.drawChart()
			})
			this.resizeObserver.observe(this.canvasRef.value)
		}

		// Redraw when data changes
		if (changedProperties.has('data') && this.isVisible) {
			if (this.animated) {
				this.animationProgress = 0
				this.startAnimation()
			} else {
				this.animationProgress = 1
				this.drawChart()
			}
		}

		// Redraw on theme or config changes
		if (
			(changedProperties.has('theme') ||
				changedProperties.has('showGrid') ||
				changedProperties.has('showLabels') ||
				changedProperties.has('peakCount')) &&
			this.isVisible
		) {
			this.drawChart()
		}
	}

	private startAnimation() {
		const startTime = performance.now()
		const duration = this.animationDuration

		const animateFrame = (currentTime: number) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			this.animationProgress = easeOutCubic(progress)
			this.drawChart()

			if (progress < 1 && this.isVisible) {
				this.animationFrameId = requestAnimationFrame(animateFrame)
			}
		}

		this.animationFrameId = requestAnimationFrame(animateFrame)
	}

	private processData(): ProcessedDataPoint[] {
		if (!this.data || this.data.length === 0) return []

		// Find top N peak values
		const sortedByValue = [...this.data].sort((a, b) => b.value - a.value)
		const peakLabels = new Set(sortedByValue.slice(0, this.peakCount).map(d => d.label))

		return this.data.map(d => ({
			...d,
			x: 0, // Will be calculated during draw
			y: 0, // Will be calculated during draw
			isPeak: peakLabels.has(d.label),
		}))
	}

	private getThemeValue<K extends keyof ChartTheme>(
		key: K,
		defaultValue: NonNullable<ChartTheme[K]>
	): NonNullable<ChartTheme[K]> {
		return (this.theme[key] as NonNullable<ChartTheme[K]>) ?? defaultValue
	}

	private drawChart() {
		const canvas = this.canvasRef.value
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dpr = window.devicePixelRatio || 1
		const rect = canvas.getBoundingClientRect()
		const width = rect.width
		const height = rect.height

		// Set canvas size for high DPI
		canvas.width = width * dpr
		canvas.height = height * dpr
		ctx.scale(dpr, dpr)

		// Clear canvas
		ctx.clearRect(0, 0, width, height)

		const data = this.processData()
		if (data.length === 0) return

		const padding = { top: 20, right: 20, bottom: this.showLabels ? 40 : 20, left: 20 }
		const chartWidth = width - padding.left - padding.right
		const chartHeight = height - padding.top - padding.bottom

		// Find max value for scaling
		const maxValue = Math.max(...data.map(d => d.value), 1)

		// Calculate positions
		const points = data.map((d, i) => ({
			...d,
			x: padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2),
			y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
		}))

		this.processedData = points

		// Get primary color from CSS or theme
		const computedStyle = getComputedStyle(this)
		const defaultPrimaryColor =
			computedStyle.getPropertyValue('--schmancy-sys-color-primary').trim() || '#6750A4'
		const primaryColor = this.getThemeValue('primaryColor', defaultPrimaryColor)
		const [gradientOpacityTop, gradientOpacityBottom] = this.getThemeValue('gradientOpacity', [0.4, 0.05])
		const strokeWidth = this.getThemeValue('strokeWidth', 2)
		const pointRadius = this.getThemeValue('pointRadius', 4)
		const peakRadius = this.getThemeValue('peakRadius', 6)

		// Draw grid lines
		if (this.showGrid) {
			ctx.strokeStyle = 'rgba(128, 128, 128, 0.15)'
			ctx.lineWidth = 1
			ctx.setLineDash([4, 4])

			for (let i = 1; i <= 3; i++) {
				const y = padding.top + (chartHeight * i) / 4
				ctx.beginPath()
				ctx.moveTo(padding.left, y)
				ctx.lineTo(width - padding.right, y)
				ctx.stroke()
			}

			ctx.setLineDash([])
		}

		// Create smooth curve path using Catmull-Rom spline
		const curvePath = new Path2D()
		const areaPath = new Path2D()

		if (points.length >= 2) {
			// Start area path from bottom left
			areaPath.moveTo(points[0].x, padding.top + chartHeight)
			curvePath.moveTo(points[0].x, points[0].y)
			areaPath.lineTo(points[0].x, points[0].y)

			for (let i = 0; i < points.length - 1; i++) {
				const p0 = points[Math.max(0, i - 1)]
				const p1 = points[i]
				const p2 = points[Math.min(points.length - 1, i + 1)]
				const p3 = points[Math.min(points.length - 1, i + 2)]

				// Draw curve segments
				const segments = 16
				for (let j = 1; j <= segments; j++) {
					const t = j / segments
					const point = catmullRomSpline(p0, p1, p2, p3, t)
					curvePath.lineTo(point.x, point.y)
					areaPath.lineTo(point.x, point.y)
				}
			}

			// Close area path
			areaPath.lineTo(points[points.length - 1].x, padding.top + chartHeight)
			areaPath.closePath()
		} else if (points.length === 1) {
			// Single point - draw a dot
			curvePath.arc(points[0].x, points[0].y, pointRadius, 0, Math.PI * 2)
		}

		// Apply animation clipping
		ctx.save()
		ctx.beginPath()
		ctx.rect(0, 0, padding.left + chartWidth * this.animationProgress, height)
		ctx.clip()

		// Draw gradient fill
		if (points.length >= 2) {
			const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
			gradient.addColorStop(0, hexToRgba(primaryColor, gradientOpacityTop))
			gradient.addColorStop(1, hexToRgba(primaryColor, gradientOpacityBottom))

			ctx.fillStyle = gradient
			ctx.fill(areaPath)
		}

		// Draw stroke
		ctx.strokeStyle = primaryColor
		ctx.lineWidth = strokeWidth
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.stroke(curvePath)

		// Draw data points
		points.forEach((point, index) => {
			const pointProgress = (index / (points.length - 1 || 1)) * this.animationProgress
			if (pointProgress < index / (points.length || 1)) return

			const radius = point.isPeak ? peakRadius - 1 : pointRadius - 1
			const outerRadius = point.isPeak ? peakRadius + 4 : pointRadius + 2

			// Outer glow for peaks
			if (point.isPeak) {
				ctx.beginPath()
				ctx.arc(point.x, point.y, outerRadius, 0, Math.PI * 2)
				ctx.fillStyle = hexToRgba(primaryColor, 0.2)
				ctx.fill()
			}

			// Inner dot
			ctx.beginPath()
			ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
			ctx.fillStyle = primaryColor
			ctx.fill()

			// White center for peaks
			if (point.isPeak) {
				ctx.beginPath()
				ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
				ctx.fillStyle = 'white'
				ctx.fill()
			}
		})

		ctx.restore()

		// Draw labels
		if (this.showLabels && points.length > 0) {
			ctx.fillStyle = 'rgba(128, 128, 128, 0.8)'
			ctx.font = '11px system-ui, sans-serif'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'top'

			// Show fewer labels on narrow charts
			const labelStep = width < 400 ? 3 : width < 600 ? 2 : 1
			points.forEach((point, index) => {
				if (index % labelStep === 0) {
					ctx.fillText(point.label, point.x, height - padding.bottom + 8)
				}
			})
		}
	}

	private formatValue(value: number): string {
		const formatted = value.toFixed(this.valueDecimals)
		return `${this.valuePrefix}${formatted}${this.valueSuffix}`
	}

	private handlePointerMove = (e: PointerEvent) => {
		if (this.processedData.length === 0 || !this.showTooltip) return

		const canvas = this.canvasRef.value
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left

		// Find closest data point
		let closestPoint: ProcessedDataPoint | null = null
		let minDistance = Infinity

		this.processedData.forEach(point => {
			const distance = Math.abs(point.x - x)
			if (distance < minDistance) {
				minDistance = distance
				closestPoint = point
			}
		})

		if (closestPoint && minDistance < 30) {
			this.tooltipData = {
				visible: true,
				x: closestPoint.x,
				y: closestPoint.y,
				label: closestPoint.label,
				value: closestPoint.value,
				metadata: closestPoint.metadata,
			}
		} else {
			this.tooltipData = { ...this.tooltipData, visible: false }
		}
	}

	private handlePointerLeave = () => {
		this.tooltipData = { ...this.tooltipData, visible: false }
	}

	private renderMetadata() {
		if (!this.tooltipData.metadata) return ''
		return Object.entries(this.tooltipData.metadata).map(
			([key, value]) => html`
				<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
					${key}: ${String(value)}
				</schmancy-typography>
			`
		)
	}

	render() {
		if (!this.data || this.data.length === 0) {
			return html``
		}

		return html`
			<div ${ref(this.containerRef)} class="relative">
				<div class="relative" style="height: ${this.height}px; touch-action: pan-y;">
					<canvas
						${ref(this.canvasRef)}
						class="w-full h-full"
						style="display: block;"
						@pointermove=${this.handlePointerMove}
						@pointerleave=${this.handlePointerLeave}
					></canvas>

					<!-- Tooltip -->
					${this.showTooltip
						? html`
								<div
									class="absolute pointer-events-none transition-opacity duration-150 ${this.tooltipData.visible
										? 'opacity-100'
										: 'opacity-0'}"
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
						  `
						: ''}
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-area-chart': SchmancyAreaChart
	}
}
