/**
 * Futuristic Battery Fill Directive
 *
 * A next-gen energy indicator with holographic effects, scan lines, and sci-fi aesthetics.
 *
 * @example
 * ```ts
 * html`<div ${futureCell({ percent: 75, variant: 'cyber' })}>POWER CORE</div>`
 * html`<div ${futureCell({ percent: 50, variant: 'hologram' })}>ENERGY CELL</div>`
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'

// ============================================================================
// TYPES
// ============================================================================

export type FutureCellVariant = 'cyber' | 'hologram' | 'plasma' | 'quantum' | 'matrix' | 'neon' | 'success' | 'warning' | 'danger'

export interface FutureCellOptions {
	/** Fill percentage (0-100+) */
	percent: number
	/** Visual variant */
	variant?: FutureCellVariant
	/** Auto-select variant based on inventory status (≥80% = success/green, 50-79% = warning/yellow, <50% = danger/red) */
	autoVariant?: boolean
	/** Custom accent color */
	accentColor?: string
	/** Show digital readout */
	showReadout?: boolean
	/** Show scan lines */
	showScanLines?: boolean
	/** Show particles */
	showParticles?: boolean
	/** Show hexagonal grid */
	showGrid?: boolean
	/** Show glitch effects */
	showGlitch?: boolean
	/** Intensity of effects (0-1) */
	intensity?: number
	/** Animation speed multiplier */
	speed?: number
	/** Enable critical state animations (when low or overfill) */
	criticalEffects?: boolean
	/** Glass container effect */
	glassEffect?: boolean
	/** Animation duration for fill transitions (ms) */
	duration?: number
}

interface VariantConfig {
	primary: string
	secondary: string
	glow: string
	particle: string
	scanLine: string
	gridColor: string
}

interface Particle {
	x: number
	y: number
	vx: number
	vy: number
	size: number
	opacity: number
	hue: number
	life: number
}

// ============================================================================
// VARIANT CONFIGURATIONS
// ============================================================================

const VARIANTS: Record<FutureCellVariant, VariantConfig> = {
	cyber: {
		primary: '#00f0ff',
		secondary: '#0099ff',
		glow: '#00f0ff',
		particle: '#00f0ff',
		scanLine: '#00f0ff',
		gridColor: '#00f0ff',
	},
	hologram: {
		primary: '#00ff88',
		secondary: '#00cc66',
		glow: '#00ff88',
		particle: '#00ff88',
		scanLine: '#00ff88',
		gridColor: '#00ff88',
	},
	plasma: {
		primary: '#ff00ff',
		secondary: '#cc00ff',
		glow: '#ff00ff',
		particle: '#ff00ff',
		scanLine: '#ff00ff',
		gridColor: '#ff00ff',
	},
	quantum: {
		primary: '#8800ff',
		secondary: '#6600cc',
		glow: '#8800ff',
		particle: '#8800ff',
		scanLine: '#8800ff',
		gridColor: '#8800ff',
	},
	matrix: {
		primary: '#00ff00',
		secondary: '#00cc00',
		glow: '#00ff00',
		particle: '#00ff00',
		scanLine: '#00ff00',
		gridColor: '#00ff00',
	},
	neon: {
		primary: '#ff0080',
		secondary: '#cc0066',
		glow: '#ff0080',
		particle: '#ff0080',
		scanLine: '#ff0080',
		gridColor: '#ff0080',
	},
	success: {
		primary: '#00ff88',
		secondary: '#00cc66',
		glow: '#00ff88',
		particle: '#00ff88',
		scanLine: '#00ff88',
		gridColor: '#00ff88',
	},
	warning: {
		primary: '#ffaa00',
		secondary: '#ff8800',
		glow: '#ffaa00',
		particle: '#ffaa00',
		scanLine: '#ffaa00',
		gridColor: '#ffaa00',
	},
	danger: {
		primary: '#ff3366',
		secondary: '#ff0044',
		glow: '#ff3366',
		particle: '#ff3366',
		scanLine: '#ff3366',
		gridColor: '#ff3366',
	},
}

// ============================================================================
// ANIMATIONS & STYLES
// ============================================================================

const KEYFRAMES = `
@keyframes future-fill-pulse {
	0%, 100% { opacity: 0.85; }
	50% { opacity: 1; }
}

@keyframes future-glow-pulse {
	0%, 100% {
		filter: drop-shadow(0 0 4px var(--glow-color))
		        drop-shadow(0 0 8px var(--glow-color));
	}
	50% {
		filter: drop-shadow(0 0 8px var(--glow-color))
		        drop-shadow(0 0 16px var(--glow-color));
	}
}

@keyframes scan-line-move {
	0% { transform: translateY(-100%); }
	100% { transform: translateY(200%); }
}

@keyframes energy-wave {
	0% { 
		transform: translateY(0) scaleX(1);
		opacity: 0.6;
	}
	50% { 
		transform: translateY(-10px) scaleX(1.1);
		opacity: 1;
	}
	100% { 
		transform: translateY(0) scaleX(1);
		opacity: 0.6;
	}
}

@keyframes data-stream {
	0% { 
		transform: translateY(100%);
		opacity: 0;
	}
	10% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% { 
		transform: translateY(-100%);
		opacity: 0;
	}
}

@keyframes hologram-flicker {
	0%, 100% { opacity: 1; }
	2% { opacity: 0.8; }
	4% { opacity: 1; }
	8% { opacity: 0.9; }
	10% { opacity: 1; }
	50% { opacity: 0.95; }
	51% { opacity: 1; }
}

@keyframes glitch-shift {
	0%, 100% { 
		transform: translate(0, 0);
		filter: hue-rotate(0deg);
	}
	20% { 
		transform: translate(-2px, 1px);
		filter: hue-rotate(90deg);
	}
	40% { 
		transform: translate(2px, -1px);
		filter: hue-rotate(180deg);
	}
	60% { 
		transform: translate(-1px, -2px);
		filter: hue-rotate(270deg);
	}
	80% { 
		transform: translate(1px, 2px);
		filter: hue-rotate(360deg);
	}
}

@keyframes hex-grid-pulse {
	0%, 100% { opacity: 0.15; }
	50% { opacity: 0.35; }
}

@keyframes chromatic-aberration {
	0%, 100% {
		text-shadow:
			-0.5px 0 0 rgba(255, 0, 0, 0.3),
			0.5px 0 0 rgba(0, 255, 255, 0.3);
	}
	50% {
		text-shadow:
			-1px 0 0 rgba(255, 0, 0, 0.5),
			1px 0 0 rgba(0, 255, 255, 0.5);
	}
}

@keyframes critical-flash {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

@keyframes overfill-surge {
	0%, 100% {
		transform: scale(1);
		filter: brightness(1);
	}
	50% {
		transform: scale(1.01);
		filter: brightness(1.15);
	}
}

`

// ============================================================================
// DIRECTIVE
// ============================================================================

class FutureCellDirective extends AsyncDirective {
	private element: HTMLElement | null = null
	private container: HTMLElement | null = null
	private fillElement: HTMLElement | null = null
	private energyWave: HTMLElement | null = null
	private scanLine: HTMLElement | null = null
	private particlesCanvas: HTMLCanvasElement | null = null
	private particlesCtx: CanvasRenderingContext2D | null = null
	private hexGrid: HTMLElement | null = null
	private readout: HTMLElement | null = null
	private dataStreams: HTMLElement | null = null
	private glitchLayer: HTMLElement | null = null
	private styleElement: HTMLStyleElement | null = null
	
	private options: FutureCellOptions = { percent: 0 }
	private variant: VariantConfig = VARIANTS.cyber
	private currentVariantName: FutureCellVariant = 'cyber'
	private particles: Particle[] = []
	private animationFrame: number | null = null
	private lastTime = 0
	private currentPercent = 0

	// Original styles backup
	private originalStyles: Record<string, string> = {}

	// ResizeObserver for canvas updates
	private resizeObserver: ResizeObserver | null = null

	/** Effective speed scales with fill %: low fill = calm, high fill = vivid */
	private getEffectiveSpeed(): number {
		const base = this.options.speed ?? 1
		const pct = Math.min(Math.max(this.currentPercent, 0), 100) / 100
		// Range: 0.15 at 0% → 1.0 at 100%
		return base * (0.15 + pct * 0.85)
	}

	render(_options: FutureCellOptions) {
		return noChange
	}

	override update(part: ElementPart, [options]: [FutureCellOptions]) {
		const element = part.element as HTMLElement

		if (!this.element) {
			this.element = element
			this.options = {
				variant: 'cyber',
				autoVariant: false,
				showReadout: true,
				showScanLines: true,
				showParticles: true,
				showGrid: true,
				showGlitch: false,
				intensity: 1,
				speed: 1,
				criticalEffects: true,
				glassEffect: true,
				duration: 600,
				...options
			}
			this.variant = VARIANTS[this.options.variant!]
			this.currentVariantName = this.options.variant!
			this.storeOriginalStyles()
			this.setupElement()
			this.createStructure()
			this.setupResizeObserver()
			this.startAnimation()
		}

		// Auto-select variant based on inventory status (gastronomy industry standards)
		let newVariantName: FutureCellVariant
		if (options.autoVariant) {
			const percent = options.percent
			if (percent >= 80) {
				newVariantName = 'success' // GREEN - Well stocked, optimal
			} else if (percent >= 50) {
				newVariantName = 'warning' // YELLOW - Getting low, plan reorder
			} else {
				newVariantName = 'danger' // RED - Critical, reorder immediately
			}
		} else {
			newVariantName = options.variant ?? 'cyber'
		}

		// Detect variant change and update colors
		if (newVariantName !== this.currentVariantName) {
			this.currentVariantName = newVariantName
			this.variant = VARIANTS[newVariantName]
			this.updateColors()
		}

		this.options = { ...this.options, ...options }
		this.variant = VARIANTS[newVariantName]
		this.updateFill()

		return noChange
	}

	// ========================================================================
	// INITIALIZATION
	// ========================================================================

	private storeOriginalStyles(): void {
		if (!this.element) return
		const style = this.element.style
		this.originalStyles = {
			position: style.position,
			overflow: style.overflow,
			border: style.border,
			background: style.background,
			boxShadow: style.boxShadow,
			backdropFilter: style.backdropFilter,
			borderRadius: style.borderRadius,
		}
	}

	private setupElement(): void {
		if (!this.element) return

		// Only set position if it's static
		const currentPosition = getComputedStyle(this.element).position
		if (currentPosition === 'static') {
			this.element.style.position = 'relative'
		}
		this.element.style.overflow = 'hidden'

		// Glass effect with vivid border for contrast
		if (this.options.glassEffect !== false) {
			Object.assign(this.element.style, {
				background: 'rgba(10, 10, 20, 0.9)',
				backdropFilter: 'blur(16px) saturate(130%)',
				border: `1.5px solid ${this.variant.primary}30`,
				boxShadow: `
					0 2px 8px rgba(0, 0, 0, 0.4),
					0 8px 32px rgba(0, 0, 0, 0.25),
					inset 0 1px 0 rgba(255, 255, 255, 0.06),
					0 0 0 1px rgba(0, 0, 0, 0.3)
				`,
				borderRadius: '12px',
			})
		}
	}

	private createStructure(): void {
		if (!this.element) return

		// Inject keyframes
		this.styleElement = document.createElement('style')
		this.styleElement.textContent = KEYFRAMES
		this.element.appendChild(this.styleElement)

		// Main container
		this.container = document.createElement('div')
		Object.assign(this.container.style, {
			position: 'absolute',
			inset: '0',
			pointerEvents: 'none',
			zIndex: '0',
			overflow: 'hidden',
			borderRadius: 'inherit',
			background: 'rgba(0, 0, 0, 0.3)',
		})
		this.element.insertBefore(this.container, this.element.firstChild)

		// Create fill first, then add effects inside it
		this.createFill()
		this.createHexGrid()      // Inside fill
		this.createEnergyWave()   // Inside fill
		this.createScanLines()    // Inside fill
		this.createDataStreams()  // Inside fill
		this.createGlitchLayer()  // Inside fill
		this.createParticles()    // Inside fill
		this.createReadout()
	}

	// ========================================================================
	// ELEMENT CREATION
	// ========================================================================

	private createFill(): void {
		if (!this.container) return

		const duration = this.options.duration ?? 600
		const speed = this.getEffectiveSpeed()
		const pulseDur = 4 / speed // slow pulse at low %, fast at high %

		this.fillElement = document.createElement('div')
		Object.assign(this.fillElement.style, {
			position: 'absolute',
			left: '0',
			right: '0',
			bottom: '0',
			height: '0%',
			background: `linear-gradient(180deg,
				${this.variant.primary}00 0%,
				${this.variant.primary}25 20%,
				${this.variant.primary}50 60%,
				${this.variant.secondary}cc 100%
			)`,
			transition: `height ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
			boxShadow: `
				inset 0 0 30px ${this.variant.glow}30,
				inset 0 -10px 20px ${this.variant.glow}20,
				0 0 15px ${this.variant.glow}25
			`,
			overflow: 'hidden',
			'--glow-color': this.variant.glow,
			animation: `future-fill-pulse ${pulseDur}s ease-in-out infinite`,
		})
		this.container.appendChild(this.fillElement)
	}

	private createEnergyWave(): void {
		if (!this.fillElement) return

		const speed = this.getEffectiveSpeed()
		this.energyWave = document.createElement('div')
		Object.assign(this.energyWave.style, {
			position: 'absolute',
			left: '-10%',
			top: '-12px',
			width: '120%',
			height: '24px',
			background: `radial-gradient(ellipse at center,
				${this.variant.primary}90 0%,
				${this.variant.primary}40 30%,
				transparent 70%
			)`,
			filter: `blur(6px) drop-shadow(0 0 6px ${this.variant.glow}80)`,
			animation: `energy-wave ${3 / speed}s ease-in-out infinite`,
		})
		this.fillElement.appendChild(this.energyWave)
	}

	private createHexGrid(): void {
		if (!this.fillElement || !this.options.showGrid) return

		const speed = this.getEffectiveSpeed()
		this.hexGrid = document.createElement('div')
		Object.assign(this.hexGrid.style, {
			position: 'absolute',
			inset: '0',
			background: this.createHexPattern(),
			opacity: '0.08',
			animation: `hex-grid-pulse ${5 / speed}s ease-in-out infinite`,
			mixBlendMode: 'screen',
		})
		this.fillElement.appendChild(this.hexGrid)
	}

	private createHexPattern(): string {
		const size = 40
		const color = this.variant.gridColor
		return `
			repeating-linear-gradient(
				0deg,
				${color}00 0px,
				${color}40 1px,
				${color}00 2px,
				${color}00 ${size}px
			),
			repeating-linear-gradient(
				60deg,
				${color}00 0px,
				${color}40 1px,
				${color}00 2px,
				${color}00 ${size}px
			),
			repeating-linear-gradient(
				120deg,
				${color}00 0px,
				${color}40 1px,
				${color}00 2px,
				${color}00 ${size}px
			)
		`
	}

	private createScanLines(): void {
		if (!this.fillElement || !this.options.showScanLines) return

		const speed = this.getEffectiveSpeed()

		// Horizontal scan lines overlay (very subtle)
		const scanLinesOverlay = document.createElement('div')
		Object.assign(scanLinesOverlay.style, {
			position: 'absolute',
			inset: '0',
			background: `repeating-linear-gradient(
				0deg,
				transparent 0px,
				${this.variant.scanLine}08 1px,
				transparent 2px,
				transparent 4px
			)`,
			opacity: '0.15',
			pointerEvents: 'none',
		})
		this.fillElement.appendChild(scanLinesOverlay)

		// Moving scan line
		this.scanLine = document.createElement('div')
		Object.assign(this.scanLine.style, {
			position: 'absolute',
			left: '0',
			right: '0',
			top: '-1px',
			height: '1px',
			background: `linear-gradient(90deg,
				transparent 0%,
				${this.variant.scanLine}cc 50%,
				transparent 100%
			)`,
			boxShadow: `0 0 8px ${this.variant.glow}60`,
			animation: `scan-line-move ${6 / speed}s linear infinite`,
			opacity: '0.35',
		})
		this.fillElement.appendChild(this.scanLine)
	}

	private createParticles(): void {
		if (!this.fillElement || !this.options.showParticles) return

		this.particlesCanvas = document.createElement('canvas')
		Object.assign(this.particlesCanvas.style, {
			position: 'absolute',
			left: '0',
			bottom: '0',
			width: '100%',
			height: '100%',
			pointerEvents: 'none',
			zIndex: '5',
		})
		this.fillElement.appendChild(this.particlesCanvas)
		this.particlesCtx = this.particlesCanvas.getContext('2d')

		this.resizeCanvas()
		this.initParticles()
	}

	private resizeCanvas(): void {
		if (!this.particlesCanvas || !this.fillElement) return
		const rect = this.fillElement.getBoundingClientRect()
		this.particlesCanvas.width = rect.width
		this.particlesCanvas.height = rect.height
	}

	private setupResizeObserver(): void {
		if (!this.element || typeof ResizeObserver === 'undefined') return
		
		this.resizeObserver = new ResizeObserver(() => {
			this.resizeCanvas()
		})
		
		this.resizeObserver.observe(this.element)
	}

	private initParticles(): void {
		const count = Math.floor(12 * (this.options.intensity ?? 1))
		for (let i = 0; i < count; i++) {
			this.spawnParticle()
		}
	}

	private spawnParticle(): void {
		if (!this.particlesCanvas) return

		const w = this.particlesCanvas.width
		const h = this.particlesCanvas.height
		const speed = this.getEffectiveSpeed()

		this.particles.push({
			x: Math.random() * w,
			y: h + Math.random() * 30,
			vx: (Math.random() - 0.5) * 0.5,
			vy: (-0.4 - Math.random() * 1.2) * speed,
			size: 0.8 + Math.random() * 1.2,
			opacity: 0.2 + Math.random() * 0.4,
			hue: Math.random() * 60 - 30,
			life: 0,
		})
	}

	private createDataStreams(): void {
		if (!this.fillElement) return

		const speed = this.getEffectiveSpeed()

		this.dataStreams = document.createElement('div')
		Object.assign(this.dataStreams.style, {
			position: 'absolute',
			inset: '0',
			overflow: 'hidden',
			opacity: '0.18',
			zIndex: '3',
		})
		this.fillElement.appendChild(this.dataStreams)

		// Fewer, subtler data streams
		for (let i = 0; i < 3; i++) {
			const stream = document.createElement('div')
			const leftPos = 15 + i * 30
			const delay = Math.random() * 4
			const duration = 3 + Math.random() * 2

			Object.assign(stream.style, {
				position: 'absolute',
				left: `${leftPos}%`,
				top: '0',
				width: '1px',
				height: '100%',
				background: `linear-gradient(180deg,
					transparent 0%,
					${this.variant.primary}cc 50%,
					transparent 100%
				)`,
				animation: `data-stream ${duration / speed}s linear infinite`,
				animationDelay: `${delay}s`,
				boxShadow: `0 0 4px ${this.variant.glow}40`,
			})

			this.dataStreams.appendChild(stream)
		}
	}

	private createGlitchLayer(): void {
		if (!this.fillElement || !this.options.showGlitch) return

		this.glitchLayer = document.createElement('div')
		Object.assign(this.glitchLayer.style, {
			position: 'absolute',
			inset: '0',
			background: `linear-gradient(90deg,
				${this.variant.primary}20 0%,
				transparent 50%,
				${this.variant.secondary}20 100%
			)`,
			opacity: '0.3',
			animation: 'glitch-shift 0.3s steps(1) infinite',
			mixBlendMode: 'overlay',
		})
		this.fillElement.appendChild(this.glitchLayer)
	}

	private createReadout(): void {
		if (!this.element || !this.options.showReadout) return

		const speed = this.getEffectiveSpeed()
		this.readout = document.createElement('div')
		Object.assign(this.readout.style, {
			position: 'absolute',
			top: '10px',
			right: '10px',
			fontFamily: 'monospace',
			fontSize: '1rem',
			fontWeight: '600',
			color: this.variant.primary,
			textShadow: `
				0 0 6px ${this.variant.glow}80,
				0 2px 4px rgba(0, 0, 0, 0.8)
			`,
			zIndex: '10',
			pointerEvents: 'none',
			letterSpacing: '0.08em',
			animation: `hologram-flicker ${8 / speed}s ease-in-out infinite`,
		})
		this.element.appendChild(this.readout)

		// Add units label
		const units = document.createElement('span')
		units.textContent = ' PWR'
		units.style.opacity = '0.6'
		units.style.fontSize = '0.7em'
		this.readout.appendChild(units)
	}

	// ========================================================================
	// COLOR UPDATES
	// ========================================================================

	private updateColors(): void {
		// Update fill (subtle glow)
		if (this.fillElement) {
			this.fillElement.style.background = `linear-gradient(180deg,
				${this.variant.primary}00 0%,
				${this.variant.primary}25 20%,
				${this.variant.primary}50 60%,
				${this.variant.secondary}cc 100%
			)`
			this.fillElement.style.boxShadow = `
				inset 0 0 30px ${this.variant.glow}30,
				inset 0 -10px 20px ${this.variant.glow}20,
				0 0 15px ${this.variant.glow}25
			`
			this.fillElement.style.setProperty('--glow-color', this.variant.glow)
		}

		// Update energy wave
		if (this.energyWave) {
			this.energyWave.style.background = `radial-gradient(ellipse at center,
				${this.variant.primary}90 0%,
				${this.variant.primary}40 30%,
				transparent 70%
			)`
			this.energyWave.style.filter = `blur(6px) drop-shadow(0 0 6px ${this.variant.glow}80)`
		}

		// Update hex grid
		if (this.hexGrid) {
			this.hexGrid.style.background = this.createHexPattern()
		}

		// Update data streams
		if (this.dataStreams) {
			const streams = this.dataStreams.querySelectorAll('div')
			streams.forEach(stream => {
				const el = stream as HTMLElement
				el.style.background = `linear-gradient(180deg,
					transparent 0%,
					${this.variant.primary}cc 50%,
					transparent 100%
				)`
				el.style.boxShadow = `0 0 4px ${this.variant.glow}40`
			})
		}

		// Update glitch layer
		if (this.glitchLayer) {
			this.glitchLayer.style.background = `linear-gradient(90deg,
				${this.variant.primary}20 0%,
				transparent 50%,
				${this.variant.secondary}20 100%
			)`
		}

		// Update readout
		if (this.readout) {
			this.readout.style.color = this.variant.primary
			this.readout.style.textShadow = `
				0 0 6px ${this.variant.glow}80,
				0 2px 4px rgba(0, 0, 0, 0.8)
			`
		}

		// Update container border color
		if (this.element && this.options.glassEffect !== false) {
			this.element.style.border = `1.5px solid ${this.variant.primary}30`
		}
	}

	// ========================================================================
	// ANIMATION
	// ========================================================================

	private startAnimation(): void {
		this.lastTime = performance.now()
		this.animate(this.lastTime)
	}

	private animate = (currentTime: number): void => {
		const deltaTime = (currentTime - this.lastTime) / 1000
		this.lastTime = currentTime

		this.updateParticles(deltaTime)

		this.animationFrame = requestAnimationFrame(this.animate)
	}

	private updateParticles(deltaTime: number): void {
		if (!this.particlesCanvas || !this.particlesCtx || !this.options.showParticles) return

		const ctx = this.particlesCtx
		const w = this.particlesCanvas.width
		const h = this.particlesCanvas.height

		ctx.clearRect(0, 0, w, h)

		// Update and draw particles (all within fill area now)
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i]

			// Update position (speed scales with fill %)
			const speed = this.getEffectiveSpeed()
			p.x += p.vx * deltaTime * 60 * speed
			p.y += p.vy * deltaTime * 60 * speed
			p.life += deltaTime

			// Fade out over time
			if (p.life > 2) {
				p.opacity *= 0.95
			}

			// Remove dead particles
			if (p.opacity < 0.01 || p.y < -50) {
				this.particles.splice(i, 1)
				this.spawnParticle()
				continue
			}

			// Draw particle with soft glow
			const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
			gradient.addColorStop(0, this.hexToRGBA(this.variant.particle, p.opacity * 0.8))
			gradient.addColorStop(0.5, this.hexToRGBA(this.variant.particle, p.opacity * 0.15))
			gradient.addColorStop(1, this.hexToRGBA(this.variant.particle, 0))

			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
			ctx.fill()

			// Core
			ctx.fillStyle = this.hexToRGBA(this.variant.particle, p.opacity * 0.7)
			ctx.beginPath()
			ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2)
			ctx.fill()
		}
	}

	private hexToRGBA(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16)
		const g = parseInt(hex.slice(3, 5), 16)
		const b = parseInt(hex.slice(5, 7), 16)
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}

	// ========================================================================
	// UPDATE
	// ========================================================================

	private updateFill(): void {
		const percent = Math.max(0, this.options.percent)
		const displayPercent = Math.min(percent, 100)
		const isCriticalLow = percent < 20
		const isOverfill = percent > 100

		// Update tracked percent (drives effective speed)
		this.currentPercent = displayPercent
		const speed = this.getEffectiveSpeed()

		// Update fill height
		if (this.fillElement) {
			this.fillElement.style.height = `${displayPercent}%`

			// Update transition duration
			const duration = this.options.duration ?? 600
			this.fillElement.style.transition = `height ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
		}

		// Update readout
		if (this.readout) {
			const value = Math.round(percent)
			this.readout.firstChild!.textContent = value.toString().padStart(3, '0')

			if (this.options.criticalEffects) {
				if (isCriticalLow) {
					this.readout.style.animation = 'critical-flash 1s ease-in-out infinite'
				} else if (isOverfill) {
					this.readout.style.animation = 'overfill-surge 1.5s ease-in-out infinite'
				} else {
					this.readout.style.animation = `hologram-flicker ${8 / speed}s ease-in-out infinite`
				}
			}
		}

		// Speed-aware animations on fill
		if (this.fillElement) {
			const pulseDur = 4 / speed
			if (this.options.criticalEffects && isCriticalLow) {
				this.fillElement.style.animation = `future-fill-pulse 1s ease-in-out infinite, critical-flash 1.5s ease-in-out infinite`
			} else if (this.options.criticalEffects && isOverfill) {
				this.fillElement.style.animation = `future-fill-pulse 1.2s ease-in-out infinite, overfill-surge 1.5s ease-in-out infinite`
			} else {
				this.fillElement.style.animation = `future-fill-pulse ${pulseDur}s ease-in-out infinite`
			}
		}

		// Update speed-dependent child animations
		if (this.energyWave) {
			this.energyWave.style.animation = `energy-wave ${3 / speed}s ease-in-out infinite`
		}
		if (this.scanLine) {
			this.scanLine.style.animation = `scan-line-move ${6 / speed}s linear infinite`
		}
		if (this.hexGrid) {
			this.hexGrid.style.animation = `hex-grid-pulse ${5 / speed}s ease-in-out infinite`
		}
	}

	// ========================================================================
	// CLEANUP
	// ========================================================================

	override disconnected(): void {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame)
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect()
		}

		this.styleElement?.remove()
		this.container?.remove()
		this.readout?.remove()

		// Restore original styles
		if (this.element) {
			Object.assign(this.element.style, this.originalStyles)
		}

		this.element = null
		this.container = null
		this.fillElement = null
		this.energyWave = null
		this.scanLine = null
		this.particlesCanvas = null
		this.particlesCtx = null
		this.hexGrid = null
		this.readout = null
		this.dataStreams = null
		this.glitchLayer = null
		this.particles = []
		this.resizeObserver = null
	}
}

// ============================================================================
// EXPORT
// ============================================================================

export const futureCell = directive(FutureCellDirective)