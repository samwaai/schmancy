/**
 * Shared DOM/SVG creation utilities for art effects.
 */

export function createOverlayContainer(className: string): HTMLDivElement {
	const overlay = document.createElement('div')
	overlay.className = `art-overlay ${className}`
	overlay.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1000;
		overflow: hidden;
	`
	return overlay
}

export function createSVG(): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svg.setAttribute('width', '100%')
	svg.setAttribute('height', '100%')
	svg.setAttribute('viewBox', '0 0 100 100')
	svg.setAttribute('preserveAspectRatio', 'none')
	svg.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`
	return svg
}
