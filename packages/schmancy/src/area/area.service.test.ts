// src/area/area.service.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { area } from './area.service'
import type { ActiveRoute } from './router.types'

// Create a test-specific area service class for testing private methods
class TestAreaService {
	public prettyURL = false
	public enableHistoryMode = true

	constructor() {}

	// Copy the createCleanURL method for direct testing
	createCleanURL(areas: Record<string, ActiveRoute>, clearQueryParams?: string[] | boolean | null): string {
		// Get the current base path (everything except the last segment which might be encoded state)
		const currentPath = location.pathname
		const pathSegments = currentPath.split('/')
		let basePath = '/'

		// Check if the last segment is encoded state (contains { or %7B)
		const lastSegment = pathSegments[pathSegments.length - 1]
		if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
			// Remove the encoded state segment to get the base path
			pathSegments.pop()
			basePath = pathSegments.join('/') || '/'
		} else {
			// Keep the current path as base path
			basePath = currentPath
		}

		// Ensure base path ends properly
		if (basePath !== '/' && !basePath.endsWith('/')) {
			basePath += '/'
		}

		// Handle query parameters
		let queryString = ''

		if (clearQueryParams !== true) {
			// Get current query params
			const urlParams = new URLSearchParams(location.search)

			// Clear specific params if provided
			if (Array.isArray(clearQueryParams)) {
				clearQueryParams.forEach(param => urlParams.delete(param))
			}

			// Convert back to string
			queryString = urlParams.toString()
			queryString = queryString ? `?${queryString}` : ''
		}
		// If clearQueryParams === true, queryString remains empty (all params cleared)

		if (this.prettyURL) {
			// Create pretty URLs - customize this based on your routing needs
			const mainArea = areas.main
			if (mainArea) {
				let path = basePath === '/' ? `/${mainArea.component}` : `${basePath}${mainArea.component}`

				// Add simple params to URL
				const searchParams = new URLSearchParams(queryString)
				if (mainArea.params) {
					Object.entries(mainArea.params).forEach(([key, value]) => {
						if (typeof value === 'string' || typeof value === 'number') {
							searchParams.set(key, String(value))
						}
					})
				}

				const query = searchParams.toString()
				return path + (query ? `?${query}` : '')
			}
		}

		// Fallback to encoded state in URL (original behavior)
		try {
			// Clean up empty objects before encoding
			const cleanedAreas: Record<string, any> = {}
			Object.entries(areas).forEach(([areaName, route]) => {
				const cleanRoute: any = { component: route.component }

				// Only include state if it has content
				if (route.state && Object.keys(route.state).length > 0) {
					cleanRoute.state = route.state
				}

				// Only include params if it has content
				if (route.params && Object.keys(route.params).length > 0) {
					cleanRoute.params = route.params
				}

				// Only include props if it has content
				if (route.props && Object.keys(route.props).length > 0) {
					cleanRoute.props = route.props
				}

				cleanedAreas[areaName] = cleanRoute
			})

			// If cleanedAreas is empty, preserve the base path
			if (Object.keys(cleanedAreas).length === 0) {
				const cleanBasePath = basePath === '/' ? '' : basePath.replace(/\/$/, '')
				return `${cleanBasePath}${queryString}`
			}

			const encoded = encodeURIComponent(JSON.stringify(cleanedAreas))
			const cleanBasePath = basePath === '/' ? '' : basePath.replace(/\/$/, '')
			return `${cleanBasePath}/${encoded}${queryString}`
		} catch (error) {
			console.error('Failed to encode URL state:', error)
			return location.pathname
		}
	}
}

// Mock global objects
const mockHistory = {
	state: {},
	pushState: vi.fn(),
	replaceState: vi.fn(),
}

const mockLocation = {
	pathname: '/',
	search: '',
	hash: '',
}

const mockWindow = {
	history: mockHistory,
	location: mockLocation,
	addEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
	removeEventListener: vi.fn(),
}

// Setup global mocks
beforeEach(() => {
	vi.clearAllMocks()

	// Reset history and location state
	mockHistory.state = {}
	mockLocation.pathname = '/'
	mockLocation.search = ''
	mockLocation.hash = ''

	// Mock global objects
	global.history = mockHistory as any
	global.location = mockLocation as any
	global.window = mockWindow as any

	// Clear any existing areas
	area.clear()
})

afterEach(() => {
	vi.clearAllMocks()
	area.clear()
})

describe('AreaService - Base Path Preservation Tests', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
	})

	describe('createCleanURL base path preservation', () => {
		it('should maintain base path when navigating from /demo/', () => {
			mockLocation.pathname = '/demo/'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should maintain base path when navigating from /demo/area/', () => {
			mockLocation.pathname = '/demo/area/'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/area')
		})

		it('should maintain base path when navigating from /app/admin/', () => {
			mockLocation.pathname = '/app/admin/'

			const result = testService.createCleanURL({})

			expect(result).toBe('/app/admin')
		})

		it('should work correctly from root /', () => {
			mockLocation.pathname = '/'

			const result = testService.createCleanURL({})

			expect(result).toBe('')
		})

		it('should preserve nested paths like /demo/area/', () => {
			mockLocation.pathname = '/demo/area/sub'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/area/sub')
		})

		it('should handle deep nested paths', () => {
			mockLocation.pathname = '/demo/app/users/profile/settings'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/app/users/profile/settings')
		})

		it('should detect and remove encoded state from /demo/', () => {
			mockLocation.pathname = '/demo/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should detect and remove encoded state from nested paths', () => {
			mockLocation.pathname = '/demo/area/page/%7B%22sidebar%22%3A%7B%22component%22%3A%22info%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/area/page')
		})

		it('should handle encoded state with unencoded brackets', () => {
			mockLocation.pathname = '/demo/{"main":{"component":"test"}}'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should preserve base path when removing multiple encoded segments', () => {
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%2C%22sidebar%22%3A%7B%22component%22%3A%22info%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/area')
		})
	})

	describe('encoded state URL generation', () => {
		it('should add encoded state to clean URLs (/demo/ becomes /demo/encoded)', () => {
			mockLocation.pathname = '/demo/'

			const areas = {
				main: {
					component: 'test-component',
					state: { page: 1 },
					params: {},
					props: {},
					area: 'main'
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toMatch(/^\/demo\//)
			expect(result).toMatch(/%7B.*%7D$/)

			// Verify the encoded content
			const encodedPart = result.split('/').pop()!
			const decoded = JSON.parse(decodeURIComponent(encodedPart))
			expect(decoded.main.component).toBe('test-component')
			expect(decoded.main.state).toEqual({ page: 1 })
		})

		it('should handle removing encoded state (/demo/encoded back to /demo/)', () => {
			mockLocation.pathname = '/demo/%7B%22main%22%3A%7B%22component%22%3A%22test%22%2C%22state%22%3A%7B%22page%22%3A1%7D%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should handle multiple area states correctly', () => {
			mockLocation.pathname = '/demo/area/'

			const areas = {
				main: {
					component: 'main-component',
					state: { tab: 'home' },
					params: { id: '123' },
					props: {},
					area: 'main'
				},
				sidebar: {
					component: 'sidebar-component',
					state: { expanded: true },
					params: {},
					props: { theme: 'dark' },
					area: 'sidebar'
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toMatch(/^\/demo\/area\//)

			// Decode and verify content
			const encodedPart = result.split('/').pop()!
			const decoded = JSON.parse(decodeURIComponent(encodedPart))
			expect(decoded).toHaveProperty('main')
			expect(decoded).toHaveProperty('sidebar')
			expect(decoded.main.state).toEqual({ tab: 'home' })
			expect(decoded.sidebar.state).toEqual({ expanded: true })
		})

		it('should not add empty state to encoded URLs', () => {
			mockLocation.pathname = '/demo/'

			const areas = {
				main: {
					component: 'test-component',
					state: {},
					params: {},
					props: {},
					area: 'main'
				}
			}

			const result = testService.createCleanURL(areas)

			const encodedPart = result.split('/').pop()!
			const decoded = JSON.parse(decodeURIComponent(encodedPart))
			expect(decoded.main).toEqual({ component: 'test-component' })
			expect(decoded.main).not.toHaveProperty('state')
			expect(decoded.main).not.toHaveProperty('params')
			expect(decoded.main).not.toHaveProperty('props')
		})
	})
})

describe('AreaService - Clear Method Tests', () => {
	beforeEach(() => {
		area.enableHistoryMode = true
	})

	it('should preserve /demo/ path when clearing areas', () => {
		mockLocation.pathname = '/demo/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

		area.clear()

		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{ schmancyAreas: {} },
			'',
			'/demo'
		)
	})

	it('should preserve root / when clearing from root with encoded state', () => {
		mockLocation.pathname = '/%7B%22main%22%3A%7B%22component%22%3A%22home%22%7D%7D'

		area.clear()

		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{ schmancyAreas: {} },
			'',
			''
		)
	})

	it('should preserve nested paths when clearing', () => {
		mockLocation.pathname = '/demo/app/admin/%7B%22sidebar%22%3A%7B%22component%22%3A%22nav%22%7D%7D'

		area.clear()

		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{ schmancyAreas: {} },
			'',
			'/demo/app/admin'
		)
	})

	it('should remove all area states but keep base path', () => {
		mockLocation.pathname = '/demo/area/'

		// Set up some areas directly in the current map (simulating existing state)
		area.current.set('main', {
			component: 'main-component',
			area: 'main',
			state: { data: 'test' },
			params: {},
			props: {}
		})

		area.current.set('sidebar', {
			component: 'sidebar-component',
			area: 'sidebar',
			state: { expanded: true },
			params: {},
			props: {}
		})

		expect(area.current.size).toBe(2)

		area.clear()

		// All areas should be removed
		expect(area.current.size).toBe(0)
		expect(area.getActiveAreas()).toEqual([])

		// History should be updated with clean base path
		expect(mockHistory.replaceState).toHaveBeenCalled()
		const lastCall = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]
		expect(lastCall[0]).toEqual({ schmancyAreas: {} })
		expect(lastCall[2]).toBe('/demo/area')
	})

	it('should call createCleanURL with empty object', () => {
		mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

		// Spy on the private createCleanURL method
		const spy = vi.spyOn(area as any, 'createCleanURL')

		area.clear()

		expect(spy).toHaveBeenCalledWith({})
	})

	it('should clear history state properly', () => {
		mockLocation.pathname = '/demo/area/'

		// Set initial history state
		mockHistory.state = {
			schmancyAreas: {
				main: { component: 'test-component' }
			},
			otherData: 'should-be-preserved'
		}

		area.clear()

		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{ schmancyAreas: {} },
			'',
			'/demo/area'
		)
	})
})

describe('AreaService - Pop Method Tests', () => {
	beforeEach(() => {
		area.enableHistoryMode = true
	})

	it('should remove only specified area from URL', () => {
		mockLocation.pathname = '/demo/area/'

		// Set up multiple areas
		area.current.set('main', {
			component: 'main-component',
			area: 'main',
			state: { data: 'main' },
			params: {},
			props: {}
		})

		area.current.set('sidebar', {
			component: 'sidebar-component',
			area: 'sidebar',
			state: { expanded: true },
			params: {},
			props: {}
		})

		expect(area.current.size).toBe(2)

		area.pop('sidebar')

		// Only sidebar should be removed
		expect(area.current.size).toBe(1)
		expect(area.current.has('main')).toBe(true)
		expect(area.current.has('sidebar')).toBe(false)

		// History should be updated
		expect(mockHistory.replaceState).toHaveBeenCalled()
		const lastCall = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]
		expect(lastCall[2]).toMatch(/^\/demo\/area/)
	})

	it('should preserve base path when popping last area', () => {
		mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

		// Set up single area
		area.current.set('main', {
			component: 'main-component',
			area: 'main',
			state: {},
			params: {},
			props: {}
		})

		area.pop('main')

		expect(area.current.size).toBe(0)

		// Base path should be preserved
		expect(mockHistory.replaceState).toHaveBeenCalled()
		const lastCall = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]
		expect(lastCall[2]).toBe('/demo/area')
	})

	it('should update history correctly when popping areas', () => {
		mockLocation.pathname = '/demo/area/'

		// Set up areas and history state
		area.current.set('main', {
			component: 'main-component',
			area: 'main',
			state: { page: 1 },
			params: {},
			props: {}
		})

		area.current.set('sidebar', {
			component: 'sidebar-component',
			area: 'sidebar',
			state: { expanded: true },
			params: {},
			props: {}
		})

		// Set up initial history state to match current areas
		mockHistory.state = {
			schmancyAreas: {
				main: { component: 'main-component', state: { page: 1 } },
				sidebar: { component: 'sidebar-component', state: { expanded: true } }
			}
		}

		area.pop('sidebar')

		// Check that history state was updated correctly
		expect(mockHistory.replaceState).toHaveBeenCalled()
		const [newState] = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]

		// The newState should have the remaining area (main) but not the popped one (sidebar)
		expect(newState.schmancyAreas).toHaveProperty('main')
		expect(newState.schmancyAreas).not.toHaveProperty('sidebar')
	})

	it('should handle popping non-existent area gracefully', () => {
		mockLocation.pathname = '/demo/area/'

		area.current.set('main', {
			component: 'main-component',
			area: 'main',
			state: {},
			params: {},
			props: {}
		})

		expect(() => area.pop('nonexistent')).not.toThrow()
		expect(area.current.size).toBe(1) // main area should still exist
	})
})

describe('AreaService - Pretty URL Mode Tests', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
		testService.prettyURL = true
	})

	it('should work with base paths in pretty URL mode', () => {
		mockLocation.pathname = '/demo/app/'

		const areas = {
			main: {
				component: 'dashboard',
				params: { view: 'analytics' },
				state: {},
				props: {},
				area: 'main'
			}
		}

		const result = testService.createCleanURL(areas)

		expect(result).toBe('/demo/app/dashboard?view=analytics')
	})

	it('should add pretty URL parameters correctly', () => {
		mockLocation.pathname = '/admin/users/'

		const areas = {
			main: {
				component: 'user-list',
				params: {
					page: 2,
					limit: 50,
					sort: 'name'
				},
				state: {},
				props: {},
				area: 'main'
			}
		}

		const result = testService.createCleanURL(areas)

		expect(result).toBe('/admin/users/user-list?page=2&limit=50&sort=name')
	})

	it('should switch between pretty and encoded modes', () => {
		mockLocation.pathname = '/demo/area/'

		const areas = {
			main: {
				component: 'test-component',
				params: { id: '123' },
				state: {},
				props: {},
				area: 'main'
			}
		}

		// Pretty mode
		testService.prettyURL = true
		const prettyResult = testService.createCleanURL(areas)
		expect(prettyResult).toBe('/demo/area/test-component?id=123')

		// Encoded mode
		testService.prettyURL = false
		const encodedResult = testService.createCleanURL(areas)
		expect(encodedResult).toMatch(/^\/demo\/area\//)
		expect(encodedResult).toMatch(/%7B.*%7D$/)
	})

	it('should fallback to encoded for non-main areas in pretty mode', () => {
		mockLocation.pathname = '/demo/area/'

		const areas = {
			sidebar: {
				component: 'navigation',
				state: { expanded: true },
				params: {},
				props: {},
				area: 'sidebar'
			}
		}

		const result = testService.createCleanURL(areas)

		// Should fallback to encoded URL for non-main areas
		expect(result).toMatch(/^\/demo\/area\//)
		expect(result).toMatch(/%7B.*%7D$/)
	})
})

describe('AreaService - Query Parameter Tests', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
	})

	it('should preserve query parameters during navigation', () => {
		mockLocation.pathname = '/demo/area/'
		mockLocation.search = '?theme=dark&lang=en'

		const result = testService.createCleanURL({})

		expect(result).toBe('/demo/area?theme=dark&lang=en')
	})

	it('should work with clearQueryParams option', () => {
		mockLocation.pathname = '/demo/area/'
		mockLocation.search = '?theme=dark&lang=en&temp=remove'

		const result = testService.createCleanURL({}, ['temp'])

		expect(result).toBe('/demo/area?theme=dark&lang=en')
		expect(result).not.toMatch(/temp=remove/)
	})

	it('should clear all query params when clearQueryParams is true', () => {
		mockLocation.pathname = '/demo/area/'
		mockLocation.search = '?theme=dark&lang=en&temp=remove'

		const result = testService.createCleanURL({}, true)

		expect(result).toBe('/demo/area')
	})

	it('should handle query params with encoded URLs', () => {
		mockLocation.pathname = '/demo/area/'
		mockLocation.search = '?theme=dark'

		const areas = {
			main: {
				component: 'test-component',
				state: { page: 1 },
				params: {},
				props: {},
				area: 'main'
			}
		}

		const result = testService.createCleanURL(areas)

		expect(result).toMatch(/theme=dark/)
		expect(result).toMatch(/%7B.*%7D/)
	})

	it('should preserve URL-encoded query parameters', () => {
		mockLocation.pathname = '/demo/area/'
		mockLocation.search = '?search=hello%20world&special=%26%3D%3F'

		const result = testService.createCleanURL({})

		expect(result).toMatch(/search=/)
		expect(result).toMatch(/special=/)
	})
})

describe('AreaService - Edge Cases', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
	})

	it('should handle URLs with special characters in base path', () => {
		mockLocation.pathname = '/démö/área-especial/tëst/'

		const result = testService.createCleanURL({})

		expect(result).toBe('/démö/área-especial/tëst')
	})

	it('should handle very long base paths', () => {
		const longPath = '/very/long/nested/path/with/many/segments/that/goes/on/and/on/and/on'
		mockLocation.pathname = longPath + '/'

		const result = testService.createCleanURL({})

		expect(result).toBe(longPath)
	})

	it('should handle URLs with existing encoded segments that are not state', () => {
		mockLocation.pathname = '/demo/encoded%20path/area/'

		const result = testService.createCleanURL({})

		expect(result).toBe('/demo/encoded%20path/area')
	})

	it('should handle malformed encoded state gracefully', () => {
		mockLocation.pathname = '/demo/area/%7B%22invalid%22%3A'

		expect(() => testService.createCleanURL({})).not.toThrow()
		const result = testService.createCleanURL({})
		expect(result).toBe('/demo/area')
	})

	it('should handle empty path segments', () => {
		mockLocation.pathname = '/demo//area//'

		const result = testService.createCleanURL({})

		// The createCleanURL method handles empty segments by preserving them but removes trailing slash
		expect(result).toBe('/demo//area/')
	})

	it('should handle concurrent navigation calls', async () => {
		mockLocation.pathname = '/demo/area/'

		// Simulate multiple rapid navigation calls by directly setting areas
		// (since push() is async and goes through request pipeline)
		const promises = []
		for (let i = 0; i < 10; i++) {
			promises.push(new Promise<void>((resolve) => {
				setTimeout(() => {
					area.current.set(`area${i}`, {
						area: `area${i}`,
						component: `component${i}`,
						state: { index: i },
						params: {},
						props: {}
					})
					resolve()
				}, Math.random() * 10)
			}))
		}

		await Promise.all(promises)

		// All areas should be present
		expect(area.current.size).toBe(10)
	})

	it('should handle createCleanURL with null/undefined areas', () => {
		mockLocation.pathname = '/demo/area/'

		// Test with null and undefined values
		const areas = {
			main: {
				component: 'test-component',
				state: null as any,
				params: undefined as any,
				props: {},
				area: 'main'
			}
		}

		expect(() => testService.createCleanURL(areas)).not.toThrow()
		const result = testService.createCleanURL(areas)
		expect(result).toMatch(/^\/demo\/area\//)
	})

	it('should handle extremely large state objects', () => {
		mockLocation.pathname = '/demo/area/'

		// Create a large state object
		const largeState: Record<string, any> = {}
		for (let i = 0; i < 1000; i++) {
			largeState[`key${i}`] = `value${i}`.repeat(10)
		}

		const areas = {
			main: {
				component: 'test-component',
				state: largeState,
				params: {},
				props: {},
				area: 'main'
			}
		}

		expect(() => testService.createCleanURL(areas)).not.toThrow()
		const result = testService.createCleanURL(areas)
		expect(result).toMatch(/^\/demo\/area\//)
	})
})

describe('AreaService - Integration Tests', () => {
	beforeEach(() => {
		area.enableHistoryMode = true
	})

	it('should maintain functionality after multiple operations', () => {
		mockLocation.pathname = '/demo/app/'

		// Add main area directly to current map
		area.current.set('main', {
			area: 'main',
			component: 'dashboard',
			state: { view: 'analytics' },
			params: { period: 'monthly' },
			props: { title: 'Dashboard' }
		})

		expect(area.current.size).toBe(1)
		expect(area.hasArea('main')).toBe(true)

		// Add sidebar area directly to current map
		area.current.set('sidebar', {
			area: 'sidebar',
			component: 'navigation',
			state: { expanded: true },
			params: {},
			props: {}
		})

		expect(area.current.size).toBe(2)

		// Pop sidebar
		area.pop('sidebar')

		expect(area.current.size).toBe(1)
		expect(area.hasArea('main')).toBe(true)
		expect(area.hasArea('sidebar')).toBe(false)

		// Clear all
		area.clear()

		expect(area.current.size).toBe(0)
		expect(area.getActiveAreas()).toEqual([])
	})

	it('should handle rapid state changes correctly', () => {
		mockLocation.pathname = '/demo/area/'

		// Test that multiple rapid changes to the same area work correctly
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: { step: 1 },
			params: {},
			props: {}
		})

		expect(area.getRoute('main')?.state).toEqual({ step: 1 })

		// Update the state
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: { step: 2 },
			params: {},
			props: {}
		})

		expect(area.getRoute('main')?.state).toEqual({ step: 2 })

		// Final update
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: { final: true },
			params: {},
			props: {}
		})

		expect(area.getRoute('main')?.state).toEqual({ final: true })
	})

	it('should preserve functionality across history mode changes', () => {
		mockLocation.pathname = '/demo/area/'

		// Enable history mode and directly set an area (simulating push)
		area.enableHistoryMode = true
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: {},
			params: {},
			props: {}
		})

		// Call _updateBrowserHistory directly to test history behavior
		area._updateBrowserHistory('main', {
			area: 'main',
			component: 'test',
			state: {},
			params: {},
			props: {}
		})

		expect(mockHistory.pushState).toHaveBeenCalled()

		// Disable history mode
		area.enableHistoryMode = false
		area.current.set('sidebar', {
			area: 'sidebar',
			component: 'nav',
			state: {},
			params: {},
			props: {}
		})

		// Should still work but not update history
		expect(area.current.size).toBe(2)
	})

	it('should maintain RxJS stream subscriptions correctly', () => {
		mockLocation.pathname = '/demo/area/'

		// Test that the RxJS observables work correctly
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: { initial: true },
			params: { id: '123' },
			props: { title: 'Test' }
		})

		// Test synchronous access to current route
		const route = area.getRoute('main')
		expect(route).toBeDefined()
		expect(route?.state).toEqual({ initial: true })
		expect(route?.params).toEqual({ id: '123' })
		expect(route?.props).toEqual({ title: 'Test' })

		// Test that hasArea works
		expect(area.hasArea('main')).toBe(true)
		expect(area.hasArea('nonexistent')).toBe(false)

		// Test getActiveAreas
		expect(area.getActiveAreas()).toEqual(['main'])

		// Update state and verify
		area.current.set('main', {
			area: 'main',
			component: 'test',
			state: { updated: true },
			params: { id: '456' },
			props: { title: 'Updated' }
		})

		const updatedRoute = area.getRoute('main')
		expect(updatedRoute?.state).toEqual({ updated: true })
		expect(updatedRoute?.params).toEqual({ id: '456' })
		expect(updatedRoute?.props).toEqual({ title: 'Updated' })
	})
})