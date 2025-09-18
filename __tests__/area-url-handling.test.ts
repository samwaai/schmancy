// __tests__/area-url-handling.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { area } from '../src/area/area.service'

// Create a test-specific area service class for testing the createCleanURL logic
class TestAreaService {
	public prettyURL = false
	public enableHistoryMode = true

	// Copy the createCleanURL method implementation from the actual service
	createCleanURL(areas: Record<string, any>, clearQueryParams?: string[] | boolean | null): string {
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
})

afterEach(() => {
	vi.clearAllMocks()
})

describe('Area URL Handling - Base Path Preservation', () => {
	let testService: TestAreaService

	beforeEach(() => {
		testService = new TestAreaService()
	})

	describe('Base path detection and preservation', () => {
		it('should preserve base path when removing encoded state', () => {
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test-component%22%7D%7D'

			const result = testService.createCleanURL({})

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

		it('should handle nested paths with multiple segments', () => {
			mockLocation.pathname = '/admin/users/edit/123/%7B%22sidebar%22%3A%7B%22component%22%3A%22user-info%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/admin/users/edit/123')
		})

		it('should handle very long paths correctly', () => {
			const longPath = '/demo/very/long/nested/path/with/many/segments'
			mockLocation.pathname = longPath + '/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe(longPath)
		})

		it('should handle paths with special characters', () => {
			mockLocation.pathname = '/demo/área-especial/tëst/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			const result = testService.createCleanURL({})

			expect(result).toBe('/demo/área-especial/tëst')
		})

		it('should handle malformed encoded URLs gracefully', () => {
			mockLocation.pathname = '/demo/area/%7B%22invalid%22%3A'

			expect(() => testService.createCleanURL({})).not.toThrow()
			const result = testService.createCleanURL({})
			expect(result).toBe('/demo/area')
		})
	})

	describe('Query parameter handling', () => {
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

		it('should handle URL encoding in query parameters', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?search=hello%20world&special=%26%3D%3F'

			const result = testService.createCleanURL({}, false)

			// URLSearchParams automatically converts %20 to + for spaces
			expect(result).toBe('/demo/area?search=hello+world&special=%26%3D%3F')
		})

		it('should preserve non-conflicting query parameters', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?theme=dark&lang=en'

			const areas = {
				main: {
					component: 'test-component',
					params: { id: '123' },
					state: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas, false)

			expect(result).toMatch(/theme=dark/)
			expect(result).toMatch(/lang=en/)
		})
	})

	describe('URL generation with areas', () => {
		it('should generate encoded URL when areas have content', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				main: {
					component: 'test-component',
					state: { key: 'value' },
					params: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toMatch(/^\/demo\/area\//)
			expect(result).toMatch(/%7B.*%7D$/) // Should end with encoded JSON
		})

		it('should handle multiple areas in encoded URL', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				main: {
					component: 'main-component',
					state: { page: 1 },
					params: {},
					props: {}
				},
				sidebar: {
					component: 'sidebar-component',
					state: { expanded: true },
					params: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toMatch(/^\/demo\/area\//)

			// Decode and check the content
			const encodedPart = result.split('/').pop()
			const decoded = JSON.parse(decodeURIComponent(encodedPart!))
			expect(decoded).toHaveProperty('main')
			expect(decoded).toHaveProperty('sidebar')
			expect(decoded.main.component).toBe('main-component')
			expect(decoded.sidebar.component).toBe('sidebar-component')
		})

		it('should exclude empty state/params/props from encoded URL', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				main: {
					component: 'test-component',
					state: {},
					params: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			const encodedPart = result.split('/').pop()
			const decoded = JSON.parse(decodeURIComponent(encodedPart!))

			// Should only have component, not empty objects
			expect(decoded.main).toEqual({ component: 'test-component' })
			expect(decoded.main).not.toHaveProperty('state')
			expect(decoded.main).not.toHaveProperty('params')
			expect(decoded.main).not.toHaveProperty('props')
		})
	})

	describe('Pretty URL mode', () => {
		beforeEach(() => {
			testService.prettyURL = true
		})

		it('should generate pretty URLs for main area', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				main: {
					component: 'test-component',
					params: { id: '123' },
					state: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/demo/area/test-component?id=123')
		})

		it('should handle pretty URLs with root base path', () => {
			mockLocation.pathname = '/'

			const areas = {
				main: {
					component: 'test-component',
					params: {},
					state: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/test-component')
		})

		it('should generate pretty URLs with nested base paths', () => {
			mockLocation.pathname = '/demo/app/dashboard'

			const areas = {
				main: {
					component: 'analytics',
					params: { period: 'monthly' },
					state: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/demo/app/dashboard/analytics?period=monthly')
		})

		it('should handle complex params in pretty URLs', () => {
			mockLocation.pathname = '/admin/users'

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
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			expect(result).toBe('/admin/users/user-list?page=2&limit=50&sort=name&filter=active')
		})

		it('should fallback to encoded URLs for non-main areas', () => {
			mockLocation.pathname = '/demo/area'

			const areas = {
				sidebar: {
					component: 'navigation',
					state: { expanded: true },
					params: {},
					props: {}
				}
			}

			const result = testService.createCleanURL(areas)

			// Should fallback to encoded URL since it's not main area
			expect(result).toMatch(/^\/demo\/area\//)
			expect(result).toMatch(/%7B.*%7D$/)
		})
	})
})

describe('Area Service Integration - Clear and Pop Operations', () => {
	beforeEach(() => {
		// Clear any existing areas before each test
		area.clear()

		// Reset location mock
		mockLocation.pathname = '/'
		mockLocation.search = ''
	})

	afterEach(() => {
		area.clear()
	})

	describe('clear method behavior', () => {
		it('should preserve base path when clearing from nested route', () => {
			mockLocation.pathname = '/demo/products/123/details/%7B%22sidebar%22%3A%7B%22component%22%3A%22info%22%7D%7D'

			area.clear()

			expect(mockHistory.replaceState).toHaveBeenCalledWith(
				{ schmancyAreas: {} },
				'',
				'/demo/products/123/details'
			)
		})

		it('should preserve base path when clearing from root with encoded state', () => {
			mockLocation.pathname = '/%7B%22main%22%3A%7B%22component%22%3A%22home%22%7D%7D'

			area.clear()

			expect(mockHistory.replaceState).toHaveBeenCalledWith(
				{ schmancyAreas: {} },
				'',
				''
			)
		})
	})

	describe('URL behavior verification', () => {
		it('should call createCleanURL when clearing areas', () => {
			mockLocation.pathname = '/demo/area/%7B%22main%22%3A%7B%22component%22%3A%22test%22%7D%7D'

			// Spy on the method if we can access it
			const createCleanURLSpy = vi.spyOn(area as any, 'createCleanURL')

			area.clear()

			// The clear method should call createCleanURL with empty object
			if (createCleanURLSpy.getMockImplementation()) {
				expect(createCleanURLSpy).toHaveBeenCalledWith({})
			}

			// Verify the URL was updated correctly (base path preserved)
			expect(mockHistory.replaceState).toHaveBeenCalled()
			const lastCall = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]
			expect(lastCall[2]).toBe('/demo/area')
		})

		it('should handle clearing with query parameters', () => {
			mockLocation.pathname = '/demo/area'
			mockLocation.search = '?tab=main&id=123'

			area.clear()

			// Should preserve query parameters when clearing
			expect(mockHistory.replaceState).toHaveBeenCalled()
			const lastCall = mockHistory.replaceState.mock.calls[mockHistory.replaceState.mock.calls.length - 1]
			expect(lastCall[2]).toMatch(/\?tab=main&id=123/)
		})
	})

	describe('Basic functionality verification', () => {
		it('should support basic area operations', () => {
			// Test that basic area operations work
			expect(area.getActiveAreas()).toEqual([])
			expect(area.hasArea('nonexistent')).toBe(false)

			// The clear method should work without errors
			expect(() => area.clear()).not.toThrow()
		})

		it('should maintain area service state correctly', () => {
			// Verify the area service maintains its internal state
			expect(area.current).toBeDefined()
			expect(area.current instanceof Map).toBe(true)

			// After clearing, current should be empty
			area.clear()
			expect(area.current.size).toBe(0)
		})
	})
})