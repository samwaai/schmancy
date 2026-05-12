/**
 * Funkhaus Effect — Grid wave animation with window panes glowing diagonally.
 * 7-second cycle, exponential intensity curve.
 */

import type { ArtState } from '../types'
import { createOverlayContainer, createSVG } from '../utils'

export function createFunkhausOverlay(state: ArtState): void {
	const { element, color } = state
	const overlay = createOverlayContainer('funkhaus-overlay')
	const svg = createSVG()

	const cols = 5
	const rows = 4
	const windowWidth = 100 / cols
	const windowHeight = 100 / rows

	const framePath = createGridPath(cols, rows, windowWidth, windowHeight)
	const frameElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	frameElement.setAttribute('d', framePath)
	frameElement.setAttribute('stroke', color)
	frameElement.setAttribute('stroke-width', '0.15')
	frameElement.setAttribute('opacity', '0.2')
	frameElement.setAttribute('fill', 'none')

	const windowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	windowGroup.id = 'window-panes'
	windowGroup.style.mixBlendMode = 'screen'

	const panes: Array<{ element: SVGRectElement; diagonalIndex: number }> = []

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
			rect.setAttribute('x', (col * windowWidth).toString())
			rect.setAttribute('y', (row * windowHeight).toString())
			rect.setAttribute('width', windowWidth.toString())
			rect.setAttribute('height', windowHeight.toString())
			rect.setAttribute('fill', color)
			rect.setAttribute('opacity', '0')
			rect.style.willChange = 'opacity'

			panes.push({ element: rect, diagonalIndex: row + col })
			windowGroup.appendChild(rect)
		}
	}

	svg.appendChild(windowGroup)
	svg.appendChild(frameElement)
	overlay.appendChild(svg)
	element.appendChild(overlay)

	state.overlayElement = overlay
	state.funkhaus = {
		panes,
		maxDiagonal: rows + cols - 2,
		startTime: performance.now(),
	}
}

export function animateFunkhaus(state: ArtState, currentTime: number): void {
	if (!state.funkhaus) return

	const { panes, maxDiagonal, startTime } = state.funkhaus
	const { intensity: effectIntensity = 1, speed = 1 } = state

	if (effectIntensity <= 0) {
		for (const pane of panes) {
			if (pane.element.getAttribute('opacity') !== '0') {
				pane.element.setAttribute('opacity', '0')
			}
		}
		return
	}

	const elapsed = currentTime - startTime
	const cycleDuration = 7000 / speed
	const cycleProgress = (elapsed % cycleDuration) / cycleDuration
	const waveProgress = cycleProgress * 1.555

	const spread = 0.18
	const maxOpacity = 0.18 * effectIntensity
	const spreadFactor = 1 / (2 * spread * spread)

	for (let i = 0; i < panes.length; i++) {
		const pane = panes[i]
		const normalizedPosition = pane.diagonalIndex / maxDiagonal
		const distance = Math.abs(normalizedPosition - waveProgress)

		if (distance > 0.5) {
			if (pane.element.getAttribute('opacity') !== '0') {
				pane.element.setAttribute('opacity', '0')
			}
			continue
		}

		let localIntensity = Math.exp(-distance * distance * spreadFactor)

		localIntensity =
			localIntensity < 0.5
				? 4 * localIntensity * localIntensity * localIntensity
				: 1 - Math.pow(-2 * localIntensity + 2, 3) / 2

		const opacity = localIntensity * maxOpacity
		pane.element.setAttribute('opacity', opacity.toFixed(3))
	}
}

function createGridPath(cols: number, rows: number, width: number, height: number): string {
	let path = ''
	for (let row = 0; row <= rows; row++) {
		const y = row * height
		path += `M 0,${y} L 100,${y} `
	}
	for (let col = 0; col <= cols; col++) {
		const x = col * width
		path += `M ${x},0 L ${x},100 `
	}
	return path
}
