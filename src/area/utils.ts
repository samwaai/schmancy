import { RouteComponent } from './route.component'
import { RouteAction, ActiveRoute } from './router.types'

/**
 * Compare two custom element constructors for equality
 * @param constructor1 First constructor to compare
 * @param constructor2 Second constructor to compare
 * @returns true if constructors are functionally equivalent
 */
export function compareCustomElementConstructors(
	constructor1: CustomElementConstructor | Function,
	constructor2: CustomElementConstructor | Function,
): boolean {
	// Quick reference check
	if (constructor1 === constructor2) {
		return true
	}

	// Check if both are functions
	if (typeof constructor1 !== 'function' || typeof constructor2 !== 'function') {
		return false
	}

	// Compare by name (handles minification)
	if (constructor1.name && constructor2.name && constructor1.name === constructor2.name) {
		return true
	}

	// Compare observed attributes if available
	const obs1 = (constructor1 as any).observedAttributes
	const obs2 = (constructor2 as any).observedAttributes

	if (obs1 && obs2) {
		if (Array.isArray(obs1) && Array.isArray(obs2)) {
			if (obs1.length !== obs2.length) return false
			return obs1.every((attr, i) => attr === obs2[i])
		}
	}

	// Try to compare prototypes
	try {
		const proto1 = constructor1.prototype
		const proto2 = constructor2.prototype

		// Check if they have the same prototype chain
		if (Object.getPrototypeOf(proto1) === Object.getPrototypeOf(proto2)) {
			// Check if they have the same property names
			const keys1 = Object.getOwnPropertyNames(proto1).sort()
			const keys2 = Object.getOwnPropertyNames(proto2).sort()

			return keys1.length === keys2.length && keys1.every((key, i) => key === keys2[i])
		}
	} catch {
		// Ignore prototype access errors
	}

	return false
}

/**
 * Normalize a component tag name for comparison
 * @param tagName Tag name to normalize
 * @returns Normalized tag name
 */
export function normalizeTagName(tagName: string): string {
	return tagName.toLowerCase().replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
}

/**
 * Get tag name from a component
 * @param component Component to get tag name from
 * @returns Tag name or null if unable to determine
 */
export function getTagName(component: RouteComponent): string | null {
	if (typeof component === 'string') {
		return component.toLowerCase()
	}

	if (component instanceof HTMLElement) {
		return component.tagName.toLowerCase()
	}

	if (typeof component === 'function') {
		// Try to get custom element name from constructor
		const name = component.name
		if (name) {
			// Convert PascalCase to kebab-case
			return name
				.replace(/([A-Z])/g, '-$1')
				.toLowerCase()
				.replace(/^-/, '')
		}
	}

	return null
}

/**
 * Deep merge two objects
 * @param target Target object
 * @param source Source object to merge
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
	const output = { ...target }

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const sourceValue = source[key]
			const targetValue = output[key]

			if (isObject(sourceValue) && isObject(targetValue)) {
				output[key] = deepMerge(targetValue, sourceValue)
			} else {
				output[key] = sourceValue as T[Extract<keyof T, string>]
			}
		}
	}

	return output
}

/**
 * Check if value is a plain object
 * @param obj Value to check
 * @returns true if value is a plain object
 */
export function isObject(obj: any): obj is Record<string, any> {
	return (
		obj !== null &&
		typeof obj === 'object' &&
		obj.constructor === Object &&
		Object.prototype.toString.call(obj) === '[object Object]'
	)
}

/**
 * Debounce a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null

	return function (this: any, ...args: Parameters<T>) {
		const context = this

		if (timeout !== null) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(() => {
			func.apply(context, args)
			timeout = null
		}, wait)
	}
}

/**
 * Create a URL-safe string from route state
 * @param state Route state object
 * @returns URL-safe encoded string
 */
export function encodeRouteState(state: Record<string, unknown>): string {
	try {
		const json = JSON.stringify(state)
		return encodeURIComponent(json)
	} catch (error) {
		console.error('Failed to encode route state:', error)
		return ''
	}
}

/**
 * Decode a URL-safe string to route state
 * @param encoded Encoded string
 * @returns Decoded route state or empty object
 */
export function decodeRouteState(encoded: string): Record<string, unknown> {
	if (!encoded) return {}

	try {
		const decoded = decodeURIComponent(encoded)
		const parsed = JSON.parse(decoded)

		if (isObject(parsed)) {
			return parsed
		}
	} catch (error) {
		console.error('Failed to decode route state:', error)
	}

	return {}
}

/**
 * Compare two route actions for equality
 * @param a First route action
 * @param b Second route action
 * @returns true if route actions are equal
 */
export function compareRouteActions(a: RouteAction, b: RouteAction): boolean {
	// Compare areas
	if (a.area !== b.area) return false

	// Compare components
	if (typeof a.component !== typeof b.component) return false

	if (typeof a.component === 'string' && typeof b.component === 'string') {
		if (normalizeTagName(a.component) !== normalizeTagName(b.component)) {
			return false
		}
	} else if (typeof a.component === 'function' && typeof b.component === 'function') {
		if (!compareCustomElementConstructors(a.component, b.component)) {
			return false
		}
	} else if (a.component !== b.component) {
		return false
	}

	// Compare state
	if (JSON.stringify(a.state || {}) !== JSON.stringify(b.state || {})) {
		return false
	}

	// Compare params
	if (JSON.stringify(a.params || {}) !== JSON.stringify(b.params || {})) {
		return false
	}

	return true
}

/**
 * Compare two active routes for equality
 * @param a First active route
 * @param b Second active route
 * @returns true if active routes are equal
 */
export function compareActiveRoutes(a: ActiveRoute, b: ActiveRoute): boolean {
	return (
		a.area === b.area &&
		a.component === b.component &&
		JSON.stringify(a.state || {}) === JSON.stringify(b.state || {}) &&
		JSON.stringify(a.params || {}) === JSON.stringify(b.params || {})
	)
}

/**
 * Create a cache key from a route action
 * @param route Route action
 * @returns Cache key string
 */
export function createRouteCacheKey(route: RouteAction): string {
	const tagName = getTagName(route.component) || 'unknown'
	const stateHash = simpleHash(JSON.stringify(route.state || {}))
	const paramsHash = simpleHash(JSON.stringify(route.params || {}))

	return `${route.area}:${tagName}:${stateHash}:${paramsHash}`
}

/**
 * Simple hash function for creating cache keys
 * @param str String to hash
 * @returns Hash string
 */
function simpleHash(str: string): string {
	let hash = 0

	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash = hash & hash // Convert to 32-bit integer
	}

	return Math.abs(hash).toString(36)
}

/**
 * Sanitize route state to remove sensitive data
 * @param state Route state
 * @param keysToRemove Keys to remove from state
 * @returns Sanitized state
 */
export function sanitizeRouteState(
	state: Record<string, unknown>,
	keysToRemove: string[] = ['password', 'token', 'secret', 'apiKey'],
): Record<string, unknown> {
	const sanitized: Record<string, unknown> = {}

	for (const key in state) {
		if (state.hasOwnProperty(key) && !keysToRemove.includes(key)) {
			const value = state[key]

			if (isObject(value)) {
				sanitized[key] = sanitizeRouteState(value, keysToRemove)
			} else if (Array.isArray(value)) {
				sanitized[key] = value.map(item => (isObject(item) ? sanitizeRouteState(item, keysToRemove) : item))
			} else {
				sanitized[key] = value
			}
		}
	}

	return sanitized
}

/**
 * Extract query parameters from URL
 * @param url URL string or URLSearchParams
 * @returns Object with query parameters
 */
export function extractQueryParams(url?: string | URLSearchParams): Record<string, string> {
	const params: Record<string, string> = {}

	let searchParams: URLSearchParams

	if (url instanceof URLSearchParams) {
		searchParams = url
	} else if (typeof url === 'string') {
		const urlObj = new URL(url, window.location.origin)
		searchParams = urlObj.searchParams
	} else {
		searchParams = new URLSearchParams(window.location.search)
	}

	searchParams.forEach((value, key) => {
		params[key] = value
	})

	return params
}

/**
 * Build query string from parameters object
 * @param params Parameters object
 * @returns Query string with leading '?'
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
	const searchParams = new URLSearchParams()

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const value = params[key]
			if (value !== undefined && value !== null && value !== '') {
				searchParams.set(key, String(value))
			}
		}
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}
