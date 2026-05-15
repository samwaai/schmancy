/**
 * Starfield Effect — surreal deep-space drift with rare comets.
 *
 * A recessive page backdrop. One <canvas>; stars live in
 * structure-of-arrays Float32Array tables (zero per-frame allocation) and
 * render as pre-rendered glow sprites via drawImage — no gradient is built
 * inside the RAF loop. Three parallax depth layers drift on slow orbit paths;
 * colour temperature runs blue-white → warm; entrance reveals far→near in
 * waves behind a faint corner nebula; a pooled comet streaks by rarely.
 * Sparse and dim by design — tune reach with the `density` ArtOption.
 *
 * Performance budget: ≤ MAX_STAR_COUNT drawImage calls + one nebula blit per
 * frame, dpr capped at 2, the whole field idle under prefers-reduced-motion.
 */

import type { ArtState } from '../types'
import { createOverlayContainer } from '../utils'

const BASE_STAR_COUNT = 90
// Hard ceiling: a wide monitor must never carpet, whatever the density prop asks.
const MAX_STAR_COUNT = 140
const COMET_POOL = 3
const APPEAR_DURATION = 2.5
const SPRITE_PX = 64
// Cool → warm. Index 0 is the dominant blue-white; the tail warms toward amber.
const TEMPERATURE_RGB = [
	[205, 222, 255],
	[224, 233, 255],
	[255, 255, 255],
	[255, 240, 214],
	[255, 222, 184],
]

export function createStarfieldOverlay(state: ArtState): void {
	const { element } = state
	const overlay = createOverlayContainer('starfield-overlay')

	const canvas = document.createElement('canvas')
	canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
	overlay.appendChild(canvas)
	element.appendChild(overlay)

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	const rect = element.getBoundingClientRect()
	const deviceWidth = Math.max(1, Math.round(rect.width * dpr))
	const deviceHeight = Math.max(1, Math.round(rect.height * dpr))
	canvas.width = deviceWidth
	canvas.height = deviceHeight

	const sprites = TEMPERATURE_RGB.map(([r, g, b]) => {
		const s = document.createElement('canvas')
		s.width = SPRITE_PX
		s.height = SPRITE_PX
		const sc = s.getContext('2d')!
		const grad = sc.createRadialGradient(SPRITE_PX / 2, SPRITE_PX / 2, 0, SPRITE_PX / 2, SPRITE_PX / 2, SPRITE_PX / 2)
		grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
		grad.addColorStop(0.18, `rgba(${r},${g},${b},0.35)`)
		grad.addColorStop(0.5, `rgba(${r},${g},${b},0)`)
		sc.fillStyle = grad
		sc.fillRect(0, 0, SPRITE_PX, SPRITE_PX)
		return s
	})

	const nebula = document.createElement('canvas')
	nebula.width = 512
	nebula.height = 512
	const nc = nebula.getContext('2d')!
	const ng = nc.createRadialGradient(256, 256, 0, 256, 256, 256)
	ng.addColorStop(0, 'rgba(150,170,255,0.16)')
	ng.addColorStop(0.4, 'rgba(120,110,210,0.07)')
	ng.addColorStop(1, 'rgba(0,0,0,0)')
	nc.fillStyle = ng
	nc.fillRect(0, 0, 512, 512)

	const starCount = Math.min(
		MAX_STAR_COUNT,
		Math.round(BASE_STAR_COUNT * Math.min(1, Math.max(0.5, (rect.width * rect.height) / (1280 * 720))) * state.density),
	)
	const sx = new Float32Array(starCount)
	const sy = new Float32Array(starCount)
	const sr = new Float32Array(starCount)
	const sphase = new Float32Array(starCount)
	const stwinkle = new Float32Array(starCount)
	const sdepth = new Float32Array(starCount)
	const sbucket = new Uint8Array(starCount)
	const sappear = new Float32Array(starCount)

	for (let i = 0; i < starCount; i++) {
		const depthBand = i % 3 // 0 far, 1 mid, 2 near — even split across layers
		const depth = depthBand === 0 ? 0.18 : depthBand === 1 ? 0.5 : 1
		sx[i] = Math.random()
		sy[i] = Math.random()
		sr[i] = (0.7 + Math.random() * 1.6) * (0.6 + 0.7 * depth)
		sphase[i] = Math.random() * Math.PI * 2
		stwinkle[i] = 0.6 + Math.random() * 1.8
		sdepth[i] = depth
		// Field skews blue-white; only a minority warms — that asymmetry reads as authored.
		sbucket[i] = Math.random() < 0.7 ? (Math.random() < 0.5 ? 0 : 1) : 2 + Math.floor(Math.random() * 3)
		// Far layer arrives first, near layer last → the depth reveals as waves.
		sappear[i] = (1 - depth) * 1.6 + Math.random() * 0.8
	}

	state.overlayElement = overlay
	state.starfield = {
		canvas,
		ctx,
		sprites,
		nebula,
		starCount,
		sx,
		sy,
		sr,
		sphase,
		stwinkle,
		sdepth,
		sbucket,
		sappear,
		cx: new Float32Array(COMET_POOL),
		cy: new Float32Array(COMET_POOL),
		cvx: new Float32Array(COMET_POOL),
		cvy: new Float32Array(COMET_POOL),
		clife: new Float32Array(COMET_POOL),
		cometCount: COMET_POOL,
		nextCometAt: performance.now() + 14000 + Math.random() * 16000,
		dpr,
		deviceWidth,
		deviceHeight,
		reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		drawnStatic: false,
		lastFrame: performance.now(),
		startTime: performance.now(),
	}
}

export function animateStarfield(state: ArtState, currentTime: number): void {
	const sf = state.starfield
	if (!sf) return

	const { intensity = 1, speed = 1 } = state
	const { ctx, canvas } = sf

	if (intensity <= 0) {
		ctx.clearRect(0, 0, sf.deviceWidth, sf.deviceHeight)
		return
	}

	// One layout read per frame; resize only when the backing store must change.
	const cssW = canvas.clientWidth
	const cssH = canvas.clientHeight
	const wantW = Math.max(1, Math.round(cssW * sf.dpr))
	const wantH = Math.max(1, Math.round(cssH * sf.dpr))
	if (wantW !== sf.deviceWidth || wantH !== sf.deviceHeight) {
		canvas.width = wantW
		canvas.height = wantH
		sf.deviceWidth = wantW
		sf.deviceHeight = wantH
		sf.drawnStatic = false
	}

	const W = sf.deviceWidth
	const H = sf.deviceHeight

	if (sf.reducedMotion && sf.drawnStatic) return

	const elapsed = ((currentTime - sf.startTime) / 1000) * speed
	const dt = Math.min((currentTime - sf.lastFrame) / 1000, 0.05)
	sf.lastFrame = currentTime

	ctx.clearRect(0, 0, W, H)

	// Entrance nebula: blooms in over the first ~4s, then holds at a faint floor.
	const nebulaAlpha = (Math.min(1, elapsed / 4) * 0.7 + 0.3) * 0.14 * intensity
	if (nebulaAlpha > 0.001) {
		const nSize = Math.max(W, H) * 1.3
		ctx.globalAlpha = nebulaAlpha
		ctx.drawImage(sf.nebula, W * 0.78 - nSize / 2, H * 0.28 - nSize / 2, nSize, nSize)
	}

	// Normal compositing — additive blend is what turned overlap into a glowing carpet.
	for (let i = 0; i < sf.starCount; i++) {
		const appear = sf.sappear[i]
		let reveal: number
		if (sf.reducedMotion) {
			reveal = 1
		} else if (elapsed < appear) {
			continue
		} else if (elapsed < appear + APPEAR_DURATION) {
			const t = (elapsed - appear) / APPEAR_DURATION
			reveal = 1 - (1 - t) * (1 - t) * (1 - t)
		} else {
			reveal = 1
		}

		const depth = sf.sdepth[i]
		const twinkle = sf.reducedMotion ? 0.9 : 0.82 + 0.18 * Math.sin(elapsed * sf.stwinkle[i] + sf.sphase[i])

		// Slow orbit drift, amplitude scaled by depth — the parallax is the surreality.
		const driftAmp = sf.reducedMotion ? 0 : depth * 14 * sf.dpr
		const px = sf.sx[i] * W + Math.sin(elapsed * 0.05 + sf.sphase[i]) * driftAmp
		const py = sf.sy[i] * H + Math.cos(elapsed * 0.04 + sf.sphase[i]) * driftAmp * 0.6

		const size = sf.sr[i] * sf.dpr * 2.3
		ctx.globalAlpha = reveal * twinkle * (0.3 + 0.5 * depth) * intensity
		ctx.drawImage(sf.sprites[sf.sbucket[i]], px - size, py - size, size * 2, size * 2)
	}

	if (!sf.reducedMotion) {
		if (currentTime >= sf.nextCometAt) {
			for (let c = 0; c < sf.cometCount; c++) {
				if (sf.clife[c] > 0) continue
				const fromLeft = Math.random() < 0.5
				sf.cx[c] = (fromLeft ? -0.05 : 1.05) * W
				sf.cy[c] = Math.random() * 0.45 * H
				const sp = (520 + Math.random() * 420) * sf.dpr
				sf.cvx[c] = (fromLeft ? 1 : -1) * sp
				sf.cvy[c] = (0.35 + Math.random() * 0.35) * sp
				sf.clife[c] = 1
				break
			}
			sf.nextCometAt = currentTime + (20000 + Math.random() * 25000) / speed
		}

		for (let c = 0; c < sf.cometCount; c++) {
			if (sf.clife[c] <= 0) continue
			sf.cx[c] += sf.cvx[c] * dt * speed
			sf.cy[c] += sf.cvy[c] * dt * speed
			sf.clife[c] -= dt / 1.6

			const tailX = sf.cx[c] - sf.cvx[c] * 0.16
			const tailY = sf.cy[c] - sf.cvy[c] * 0.16
			const grad = ctx.createLinearGradient(sf.cx[c], sf.cy[c], tailX, tailY)
			const headA = Math.max(0, Math.min(1, sf.clife[c])) * 0.55 * intensity
			grad.addColorStop(0, `rgba(255,255,255,${headA})`)
			grad.addColorStop(0.4, `rgba(190,210,255,${headA * 0.4})`)
			grad.addColorStop(1, 'rgba(190,210,255,0)')
			ctx.globalAlpha = 1
			ctx.strokeStyle = grad
			ctx.lineWidth = 2 * sf.dpr
			ctx.lineCap = 'round'
			ctx.beginPath()
			ctx.moveTo(sf.cx[c], sf.cy[c])
			ctx.lineTo(tailX, tailY)
			ctx.stroke()
		}
	}

	ctx.globalAlpha = 1
	sf.drawnStatic = true
}
