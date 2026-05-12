/**
 * Starfield Effect — Night sky with twinkling stars.
 *
 * 6 groups × 7 stars using CSS radial-gradient backgrounds.
 * Wave-by-wave fade-in (group 0 first, then 1, 2, …); gentle twinkle once visible.
 * Opacity driven by RAF instead of CSS @keyframes to avoid Shadow DOM scoping.
 */

import type { ArtState } from '../types'
import { createOverlayContainer } from '../utils'

const GROUP_COUNT = 6
const STARS_PER_GROUP = 7

function generateStarGroups() {
	return Array.from({ length: GROUP_COUNT }, (_, g) => {
		const stops: string[] = []
		for (let i = 0; i < STARS_PER_GROUP; i++) {
			const x = Math.random() * 96 + 2
			const y = Math.random() * 94 + 3
			const size = 0.8 + Math.random() * 1.5
			const alpha = 0.3 + Math.random() * 0.7
			stops.push(
				`radial-gradient(circle ${size}px at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0%, transparent 100%)`,
			)
		}
		const appearDelay = g * 0.6
		return {
			bg: stops.join(','),
			appearDelay,
			twinkleDuration: 5 + g * 0.7,
			twinkleDelay: appearDelay + 2.5,
		}
	})
}

export function createStarfieldOverlay(state: ArtState): void {
	const { element } = state
	const overlay = createOverlayContainer('starfield-overlay')

	const starArea = document.createElement('div')
	starArea.style.cssText = 'position:absolute;bottom:0;right:0;width:66vw;height:66vw;'
	overlay.appendChild(starArea)

	const generated = generateStarGroups()
	const groups: NonNullable<ArtState['starfield']>['groups'] = []

	for (const g of generated) {
		const div = document.createElement('div')
		div.style.cssText = `position:absolute;inset:0;opacity:0;will-change:opacity;background:${g.bg};`
		starArea.appendChild(div)
		groups.push({
			element: div,
			appearDelay: g.appearDelay,
			twinkleDuration: g.twinkleDuration,
			twinkleDelay: g.twinkleDelay,
		})
	}

	element.appendChild(overlay)
	state.overlayElement = overlay
	state.starfield = { groups, startTime: performance.now() }
}

export function animateStarfield(state: ArtState, currentTime: number): void {
	if (!state.starfield) return

	const { intensity = 1, speed = 1 } = state
	const { groups, startTime } = state.starfield
	const elapsed = ((currentTime - startTime) / 1000) * speed

	for (const g of groups) {
		if (intensity <= 0) {
			g.element.style.opacity = '0'
			continue
		}

		const appearStart = g.appearDelay
		const appearEnd = appearStart + 2.5
		let opacity: number

		if (elapsed < appearStart) {
			opacity = 0
		} else if (elapsed < appearEnd) {
			const t = (elapsed - appearStart) / 2.5
			opacity = 1 - Math.pow(1 - t, 3)
		} else {
			const twinkleElapsed = elapsed - g.twinkleDelay
			if (twinkleElapsed < 0) {
				opacity = 1
			} else {
				const cycle = (twinkleElapsed % g.twinkleDuration) / g.twinkleDuration
				if (cycle < 0.25) {
					opacity = 1 - (cycle / 0.25) * 0.4
				} else if (cycle < 0.5) {
					opacity = 0.6 + ((cycle - 0.25) / 0.25) * 0.25
				} else if (cycle < 0.75) {
					opacity = 0.85 - ((cycle - 0.5) / 0.25) * 0.3
				} else {
					opacity = 0.55 + ((cycle - 0.75) / 0.25) * 0.45
				}
			}
		}

		g.element.style.opacity = (opacity * intensity).toFixed(3)
	}
}
