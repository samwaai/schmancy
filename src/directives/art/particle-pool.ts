/**
 * Particle Pool
 *
 * Reusable object pool for SVG particles to avoid constant creation/destruction.
 * Used by samwa (leaves), howl (steam), error (lightning), snow (flakes) effects.
 */

export class ParticlePool<T extends SVGElement> {
	private pool: T[] = []
	private active = new Set<T>()
	private factory: () => T

	constructor(factory: () => T, initialSize: number = 10) {
		this.factory = factory
		for (let i = 0; i < initialSize; i++) {
			this.pool.push(factory())
		}
	}

	acquire(): T {
		let particle = this.pool.pop()
		if (!particle) particle = this.factory()
		this.active.add(particle)
		return particle
	}

	release(particle: T) {
		this.active.delete(particle)
		particle.setAttribute('opacity', '0')
		this.pool.push(particle)
	}

	clear() {
		this.active.forEach(p => this.release(p))
	}

	get activeCount() {
		return this.active.size
	}
}
