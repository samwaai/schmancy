// __tests__/area-routing.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { area } from '../src/area/area.service'
import { ActiveRoute, RouteAction } from '../src/area/router.types'

// Create a test-specific area service class for direct testing
class TestAreaService {
	public prettyURL = false
	public enableHistoryMode = true

	constructor() {}

	// Copy the createCleanURL method for testing
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
})

afterEach(() => {
	vi.clearAllMocks()
})

describe('AreaService - Base Path Preservation', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
		testService.enableHistoryMode = true
	})

	describe('createCleanURL method', () => {
		it('should preserve base path when removing encoded state', () => {
			// Setup location with nested path and encoded state
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test-component%22%7D%7D'

			const result = testService.createCleanURL({})

			// Should preserve /demo/area/ base path
			expect(result).toBe('/demo/area')
		})

		it('should detect encoded state segments with { character', () => {
			mockLocation.pathname = '/demo/{"main":{"component":"test"}}'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should detect encoded state segments with %7B (encoded {)', () => {
			mockLocation.pathname = '/demo/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo')
		})

		it('should preserve current path when no encoded state present', () => {
			mockLocation.pathname = '/demo/area/component'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/area/component')
		})

		it('should handle root path correctly', () => {
			mockLocation.pathname = '/'

			const result = testService.createCleanURL({})

			expect(result).toBe('')
		})

		it('should handle encoded state at root level', () => {
			mockLocation.pathname = '/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('')
		})

		it('should preserve query parameters when clearQueryParams is false', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?tab=main&id=123'

			const result = testService.createCleanURL({}, false)

			expect(result).toBe('/demo/area?tab=main&id=123')
		})

		it('should clear specific query parameters when array provided', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?tab=main&id=123&keep=this'

			const result = testService.createCleanURL({}, ['tab', 'id'])

			expect(result).toBe('/demo/area?keep=this')
		})

		it('should clear all query parameters when clearQueryParams is true', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?tab=main&id=123'

			const result = testService.createCleanURL({}, true)

			expect(result).toBe('/demo/area')
		})

		it('should generate encoded URL when areas have content', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				main: {
					component: 'test-component',
					state: { key: 'value' },
					params: {},
					props: {},
					area: 'main'
				}
			}

			const result = testService.createCleanURL(areas)

			// Should append encoded state to base path
			expect(result).toMatch(/^\/demo\/area\//)
			expect(result).toMatch(/%7B.*%7D$/) // Should end with encoded JSON
		})

		it('should handle pretty URL mode for main area', () => {
			mockLocation.pathname = '/demo/area'
			testService.prettyURL = true

			const areas = {
				main: {
					component: 'test-component',
					params: { id: '123' },
					state: {},
					props: {},
					area: 'main'
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/demo/area/test-component?id=123')
		})

		it('should handle pretty URL mode with root base path', () => {
			mockLocation.pathname = '/'
			testService.prettyURL = true

			const areas = {
				main: {
					component: 'test-component',
					params: {},
					state: {},
					props: {},
					area: 'main'
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/test-component')
		})
	})

	describe('clear method with base path preservation', () => {
		it('should call createCleanURL with empty areas object', () => {
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			// Spy on the createCleanURL method
			const createCleanURLSpy = vi.spyOn(areaService as any, 'createCleanURL')

			areaService.clear()

			expect(createCleanURLSpy).toHaveBeenCalledWith({})
			expect(mockHistory.replaceState).toHaveBeenCalledWith(
				{ schmancyAreas: {} },
				'',
				'/demo/area'
			)
		})

		it('should preserve base path when clearing from nested route', () => {
			mockLocation.pathname = '/demo/products/123/details/%7B%22sidebar%22%3A%7B%22component%22%3A%22product-info%22%7D%7D'

			areaService.clear()

			expect(mockHistory.replaceState).toHaveBeenCalledWith(
				{ schmancyAreas: {} },
				'',
				'/demo/products/123/details'
			)
		})

		it('should handle clearing from root path with encoded state', () => {
			mockLocation.pathname = '/%7B%22main%22%3A%7B%22component%22%3A%22home%22%7D%7D'

			areaService.clear()

			expect(mockHistory.replaceState).toHaveBeenCalledWith(
				{ schmancyAreas: {} },
				'',
				''
			)
		})
	})

	describe('pop method with base path preservation', () => {
		it('should preserve base path when popping an area', () => {
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%2C%22sidebar%22%3A%7B%22component%22%3A%22info%22%7D%7D'

			// Setup current state
			areaService.current.set('main', {
				component: 'test-component',
				area: 'main',
				state: {},
				params: {},
				props: {}
			})
			areaService.current.set('sidebar', {
				component: 'info-component',
				area: 'sidebar',
				state: {},
				params: {},
				props: {}
			})

			areaService.pop('sidebar')

			// Should call createCleanURL with remaining areas
			expect(mockHistory.replaceState).toHaveBeenCalled()
			const callArgs = mockHistory.replaceState.mock.calls[0]
			expect(callArgs[2]).toMatch(/^\/demo\/area/) // Should preserve base path
		})
	})

	describe('_updateBrowserHistory with base path preservation', () => {
		it('should preserve base path when updating browser history', () => {
			mockLocation.pathname = '/demo/area/current'

			const route: ActiveRoute = {
				component: 'test-component',
				area: 'main',
				state: { key: 'value' },
				params: {},
				props: {}
			}

			areaService._updateBrowserHistory('main', route, 'push')

			expect(mockHistory.pushState).toHaveBeenCalled()
			const callArgs = mockHistory.pushState.mock.calls[0]
			expect(callArgs[2]).toMatch(/^\/demo\/area/) // Should preserve base path
		})

		it('should use replace strategy correctly', () => {
			mockLocation.pathname = '/demo/area'

			const route: ActiveRoute = {
				component: 'test-component',
				area: 'main',
				state: {},
				params: {},
				props: {}
			}

			areaService._updateBrowserHistory('main', route, 'replace')

			expect(mockHistory.replaceState).toHaveBeenCalled()
			expect(mockHistory.pushState).not.toHaveBeenCalled()
		})

		it('should not update history when enableHistoryMode is false', () => {
			areaService.enableHistoryMode = false

			const route: ActiveRoute = {
				component: 'test-component',
				area: 'main',
				state: {},
				params: {},
				props: {}
			}

			areaService._updateBrowserHistory('main', route, 'push')

			expect(mockHistory.pushState).not.toHaveBeenCalled()
			expect(mockHistory.replaceState).not.toHaveBeenCalled()
		})
	})

	describe('Navigation scenarios from nested paths', () => {
		it('should maintain base path when navigating from /demo/area', () => {
			mockLocation.pathname = '/demo/area'

			const routeAction: RouteAction = {
				area: 'main',
				component: 'test-component',
				state: { data: 'test' },
				params: {},
				props: {}
			}

			areaService.push(routeAction)

			// Should update current state
			expect(areaService.current.has('main')).toBe(true)
			expect(areaService.current.get('main')?.component).toBe('test-component')
		})

		it('should handle multiple area updates preserving base path', () => {
			mockLocation.pathname = '/demo/products/category'

			// Push to main area
			areaService.push({
				area: 'main',
				component: 'product-list',
				state: { category: 'electronics' },
				params: {},
				props: {}
			})

			// Push to sidebar area
			areaService.push({
				area: 'sidebar',
				component: 'filters',
				state: { filters: ['brand', 'price'] },
				params: {},
				props: {}
			})

			expect(areaService.current.size).toBe(2)
			expect(areaService.getActiveAreas()).toEqual(expect.arrayContaining(['main', 'sidebar']))
		})
	})

	describe('Error handling and edge cases', () => {
		it('should handle malformed encoded URLs gracefully', () => {
			mockLocation.pathname = '/demo/area/%7B%22invalid%22%3A'

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)

			// Should not throw and should clean up the malformed segment
			expect(() => createCleanURL({})).not.toThrow()
			const result = createCleanURL({})
			expect(result).toBe('/demo/area')
		})

		it('should handle very long paths correctly', () => {
			const longPath = '/demo/very/long/nested/path/with/many/segments'
			mockLocation.pathname = longPath + '/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL({})

			expect(result).toBe(longPath)
		})

		it('should handle paths with special characters', () => {
			mockLocation.pathname = '/demo/área-especial/tëst/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL({})

			expect(result).toBe('/demo/área-especial/tëst')
		})

		it('should handle empty path segments', () => {
			mockLocation.pathname = '/demo//area//%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL({})

			// Should preserve the empty segments structure
			expect(result).toBe('/demo//area/')
		})
	})

	describe('Query parameter handling', () => {
		it('should preserve non-conflicting query parameters', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?theme=dark&lang=en'

			const areas = {
				main: {
					component: 'test-component',
					params: { id: '123' },
					state: {},
					props: {},
					area: 'main'
				}
			}

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL(areas, false)

			expect(result).toMatch(/theme=dark/)
			expect(result).toMatch(/lang=en/)
		})

		it('should handle URL encoding in query parameters', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?search=hello%20world&special=%26%3D%3F'

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL({}, false)

			expect(result).toMatch(/search=hello%20world/)
			expect(result).toMatch(/special=%26%3D%3F/)
		})
	})

	describe('Pretty URL mode with nested paths', () => {
		beforeEach(() => {
			areaService.prettyURL = true
		})

		it('should generate pretty URLs with nested base paths', () => {
			mockLocation.pathname = '/demo/app/dashboard'

			const areas = {
				main: {
					component: 'analytics',
					params: { period: 'monthly' },
					state: {},
					props: {},
					area: 'main'
				}
			}

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL(areas)

			expect(result).toBe('/demo/app/dashboard/analytics?period=monthly')
		})

		it('should handle complex params in pretty URLs', () => {
			mockLocation.pathname = '/admin/users'
			areaService.prettyURL = true

			const areas = {
				main: {
					component: 'user-list',
					params: {
						page: 2,
						limit: 50,
						sort: 'name',
						filter: 'active'
					},
					state: {},
					props: {},
					area: 'main'
				}
			}

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL(areas)

			expect(result).toBe('/admin/users/user-list?page=2&limit=50&sort=name&filter=active')
		})

		it('should fallback to encoded URLs for non-main areas even in pretty mode', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				sidebar: {
					component: 'navigation',
					state: { expanded: true },
					params: {},
					props: {},
					area: 'sidebar'
				}
			}

			const createCleanURL = (areaService as any).createCleanURL.bind(areaService)
			const result = createCleanURL(areas)

			// Should fallback to encoded URL since it's not main area
			expect(result).toMatch(/^\/demo\/area\//)
			expect(result).toMatch(/%7B.*%7D$/)
		})
	})
})

describe('AreaService - Regression Tests', () => {
	let areaService: AreaService

	beforeEach(() => {
		areaService = new AreaService()
		areaService.enableHistoryMode = true
	})

	afterEach(() => {
		areaService.dispose()
	})

	describe('Existing functionality preservation', () => {
		it('should still support basic area navigation', () => {
			const routeAction: RouteAction = {
				area: 'main',
				component: 'test-component',
				state: { key: 'value' },
				params: { id: '123' },
				props: { title: 'Test' }
			}

			areaService.push(routeAction)

			const route = areaService.getRoute('main')
			expect(route).toBeDefined()
			expect(route?.component).toBe('test-component')
			expect(route?.state).toEqual({ key: 'value' })
			expect(route?.params).toEqual({ id: '123' })
			expect(route?.props).toEqual({ title: 'Test' })
		})

		it('should support multiple areas simultaneously', () => {
			areaService.push({
				area: 'main',
				component: 'main-component',
				state: {},
				params: {},
				props: {}
			})

			areaService.push({
				area: 'sidebar',
				component: 'sidebar-component',
				state: {},
				params: {},
				props: {}
			})

			expect(areaService.getActiveAreas()).toHaveLength(2)
			expect(areaService.hasArea('main')).toBe(true)
			expect(areaService.hasArea('sidebar')).toBe(true)
		})

		it('should maintain observable subscriptions', (done) => {
			areaService.on('main').subscribe((route) => {
				expect(route.component).toBe('test-component')
				done()
			})

			areaService.push({
				area: 'main',
				component: 'test-component',
				state: {},
				params: {},
				props: {}
			})
		})

		it('should handle state updates correctly', (done) => {
			let updateCount = 0

			areaService.getState('main').subscribe((state) => {
				updateCount++
				if (updateCount === 1) {
					expect(state).toEqual({ initial: true })
				} else if (updateCount === 2) {
					expect(state).toEqual({ updated: true })
					done()
				}
			})

			// Initial push
			areaService.push({
				area: 'main',
				component: 'test-component',
				state: { initial: true },
				params: {},
				props: {}
			})

			// Update state
			setTimeout(() => {
				areaService.push({
					area: 'main',
					component: 'test-component',
					state: { updated: true },
					params: {},
					props: {}
				})
			}, 10)
		})

		it('should handle params and props observables', (done) => {
			let callCount = 0

			areaService.params('main').subscribe((params) => {
				callCount++
				if (callCount === 1) {
					expect(params).toEqual({ id: '123' })
					done()
				}
			})

			areaService.push({
				area: 'main',
				component: 'test-component',
				state: {},
				params: { id: '123' },
				props: {}
			})
		})

		it('should support silent history mode', () => {
			areaService.push({
				area: 'main',
				component: 'test-component',
				state: {},
				params: {},
				props: {},
				historyStrategy: 'silent'
			})

			// Should not update browser history in silent mode
			expect(mockHistory.pushState).not.toHaveBeenCalled()
			expect(mockHistory.replaceState).not.toHaveBeenCalled()
		})
	})

	describe('Browser state restoration', () => {
		it('should restore from browser state correctly', () => {
			const browserState = {
				schmancyAreas: {
					main: {
						component: 'restored-component',
						state: { restored: true },
						params: { id: '456' },
						props: { title: 'Restored' }
					}
				}
			}

			const restored = areaService.restoreFromBrowserState(browserState)

			expect(restored).toEqual(browserState.schmancyAreas)
		})

		it('should fallback to URL parsing when browser state unavailable', () => {
			mockLocation.pathname = '/demo/%7B%22main%22%3A%7B%22component%22%3A%22url-component%22%7D%7D'

			const restored = areaService.restoreFromBrowserState(null)

			expect(restored).toEqual({
				main: {
					component: 'url-component'
				}
			})
		})

		it('should handle malformed URL state gracefully', () => {
			mockLocation.pathname = '/demo/malformed-json'

			const restored = areaService.restoreFromBrowserState(null)

			expect(restored).toEqual({})
		})
	})

	describe('Memory management', () => {
		it('should clean up area subjects on dispose', () => {
			areaService.push({
				area: 'main',
				component: 'test-component',
				state: {},
				params: {},
				props: {}
			})

			const areaSubjects = (areaService as any).areaSubjects
			expect(areaSubjects.size).toBe(1)

			areaService.dispose()

			// Subjects should be completed but map should be cleared
			expect(areaSubjects.size).toBe(0)
		})

		it('should handle multiple subscriptions to same area', () => {
			const subscription1 = areaService.on('main').subscribe(() => {})
			const subscription2 = areaService.on('main').subscribe(() => {})

			expect(subscription1).toBeDefined()
			expect(subscription2).toBeDefined()

			subscription1.unsubscribe()
			subscription2.unsubscribe()
		})
	})
})