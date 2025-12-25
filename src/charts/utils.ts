/**
 * Catmull-Rom spline interpolation for smooth curves
 * Returns the interpolated point between p1 and p2
 */
export function catmullRomSpline(
	p0: { x: number; y: number },
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	p3: { x: number; y: number },
	t: number
): { x: number; y: number } {
	const t2 = t * t
	const t3 = t2 * t

	const x =
		0.5 *
		(2 * p1.x +
			(-p0.x + p2.x) * t +
			(2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
			(-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3)

	const y =
		0.5 *
		(2 * p1.y +
			(-p0.y + p2.y) * t +
			(2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
			(-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)

	return { x, y }
}

/**
 * Converts hex or rgb color to rgba string
 */
export function hexToRgba(color: string, alpha: number): string {
	// Handle rgb/rgba format
	if (color.startsWith('rgb')) {
		const match = color.match(/[\d.]+/g)
		if (match && match.length >= 3) {
			return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`
		}
	}

	// Handle hex format
	let hex = color.replace('#', '')
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map(c => c + c)
			.join('')
	}

	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Cubic ease-out animation function
 */
export function easeOutCubic(t: number): number {
	return 1 - Math.pow(1 - t, 3)
}
