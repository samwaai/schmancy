// src/store/__tests__/store.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createContext } from '../src/store/context-create'
import { filterArray, filterMap } from '../src/store/filter-directive'
import { createCompoundSelector, createFilterSelector, createItemSelector } from '../src/store/selectors'
import { IArrayStore } from '../src/store/types'

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {}
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key]
		}),
		clear: vi.fn(() => {
			store = {}
		}),
		getStore: () => store,
	}
})()

// Setup test environment
beforeEach(() => {
	Object.defineProperty(window, 'localStorage', {
		value: localStorageMock,
		writable: true,
	})
})

// Clear mocks after each test
afterEach(() => {
	vi.clearAllMocks()
	localStorageMock.clear()
})

describe('Object Store', () => {
	interface TestSettings {
		theme: 'light' | 'dark'
		fontSize: number
		notifications: boolean
	}

	it('should create store with default values', () => {
		const defaultSettings: TestSettings = {
			theme: 'light',
			fontSize: 20,
			notifications: false,
		}

		const store = createContext<TestSettings>(defaultSettings, 'local', 'settings')

		expect(store.value).toEqual(defaultSettings)
		expect(store.defaultValue).toEqual(defaultSettings)
		// For non-memory storage like 'local', ready is initially false until loaded
		expect(store.ready).toBe(false)
	})

	it('should update store values', () => {
		const store = createContext<TestSettings>(
			{
				theme: 'light',
				fontSize: 20,
				notifications: false,
			},
			'local',
			'settings',
		)

		// Update with partial data
		store.set({ theme: 'dark' })

		expect(store.value).toEqual({
			theme: 'dark',
			fontSize: 20,
			notifications: false,
		})

		// Replace entire state
		store.replace({
			theme: 'light',
			fontSize: 20,
			notifications: false,
		})

		expect(store.value).toEqual({
			theme: 'light',
			fontSize: 20,
			notifications: false,
		})
	})

	it('should delete specific keys', () => {
		interface TestObject {
			name: string
			age?: number
			address?: {
				city: string
				zip: string
			}
		}

		const store = createContext<TestObject>(
			{
				name: 'Test',
				age: 30,
				address: {
					city: 'Test City',
					zip: '12345',
				},
			},
			'memory',
			'test-object',
		)

		// Delete a key
		store.delete('age')

		expect(store.value).toEqual({
			name: 'Test',
			address: {
				city: 'Test City',
				zip: '12345',
			},
		})

		// Delete nested object
		store.delete('address')

		expect(store.value).toEqual({
			name: 'Test',
		})
	})

	it('should persist data to localStorage', async () => {
		const initialSettings: TestSettings = {
			theme: 'light',
			fontSize: 20,
			notifications: false,
		}

		const store = createContext<TestSettings>(initialSettings, 'local', 'settings')

		// Update just the theme
		store.set({ theme: 'dark' })

		// Wait for async persistence
		await new Promise(resolve => setTimeout(resolve, 150))

		// Check localStorage contains the expected merged data
		const storedData = localStorageMock.getItem('settings')
		const parsedData = JSON.parse(storedData || '{}')

		expect(parsedData).toEqual({
			theme: 'dark',
			fontSize: 20,
			notifications: false,
		})
	})
})

describe('Collection Store', () => {
	interface TodoItem {
		id: string
		title: string
		completed: boolean
		priority: 'low' | 'medium' | 'high'
	}

	it('should create empty collection store', () => {
		const store = createContext<TodoItem>(new Map(), 'memory', 'todos')

		expect(store.value.size).toBe(0)
		// With memory storage, ready is immediately set to true
		expect(store.ready).toBe(true)
	})

	it('should create collection store from array', () => {
		const items: TodoItem[] = [
			{ id: 'task1', title: 'Task 1', completed: false, priority: 'high' },
			{ id: 'task2', title: 'Task 2', completed: true, priority: 'low' },
		]

		// Convert items to Map for collection store
		const itemsMap = new Map<string, TodoItem>()
		items.forEach((item, index) => itemsMap.set(index.toString(), item))

		const store = createContext<TodoItem>(itemsMap, 'memory', 'todos')

		expect(store.value.size).toBe(2)
		expect(store.value.get('0')).toEqual(items[0])
		expect(store.value.get('1')).toEqual(items[1])
	})

	it('should add, update and delete items', () => {
		const store = createContext<TodoItem>(new Map(), 'memory', 'todos')
		store.clear()
		// Add items
		store.set('task1', {
			id: 'task1',
			title: 'Task 1',
			completed: false,
			priority: 'medium',
		})

		store.set('task2', {
			id: 'task2',
			title: 'Task 2',
			completed: true,
			priority: 'low',
		})

		expect(store.value.size).toBe(2)

		// Update an item
		store.set('task1', {
			id: 'task1',
			title: 'Updated Task 1',
			completed: true,
			priority: 'high',
		})

		expect(store.value.get('task1')).toEqual({
			id: 'task1',
			title: 'Updated Task 1',
			completed: true,
			priority: 'high',
		})

		// Delete an item
		store.delete('task2')

		expect(store.value.size).toBe(1)
		expect(store.value.has('task2')).toBe(false)

		// Clear all items
		store.clear()

		expect(store.value.size).toBe(0)
	})
})

describe('Array Store', () => {
	interface TodoItem {
		id: string
		title: string
		completed: boolean
		priority: 'low' | 'medium' | 'high'
	}

	it('should create empty array store', () => {
		// Cast to IArrayStore to get access to array-specific methods
		const store = createContext<TodoItem[]>([], 'memory', 'todos-array') as unknown as IArrayStore<TodoItem>

		expect(store.value.length).toBe(0)
		// With memory storage, ready is immediately set to true
		expect(store.ready).toBe(true)
	})

	it('should add, update and remove items from array', () => {
		// Cast to IArrayStore to get access to array-specific methods
		const store = createContext<TodoItem[]>([], 'memory', 'todos-array') as unknown as IArrayStore<TodoItem>

		// Push items to array
		store.push(
			{ id: 'task1', title: 'Task 1', completed: false, priority: 'medium' },
			{ id: 'task2', title: 'Task 2', completed: true, priority: 'low' },
		)

		expect(store.value.length).toBe(2)

		// Update an item
		store.set(0, {
			id: 'task1',
			title: 'Updated Task 1',
			completed: true,
			priority: 'high',
		})

		expect(store.value[0]).toEqual({
			id: 'task1',
			title: 'Updated Task 1',
			completed: true,
			priority: 'high',
		})

		// Remove an item
		store.splice(1, 1)

		expect(store.value.length).toBe(1)
		expect(store.value[0].id).toBe('task1')

		// Clear all items
		store.clear()

		expect(store.value.length).toBe(0)
	})
})

describe('Selectors', () => {
	interface TodoItem {
		id: string
		title: string
		completed: boolean
		priority: 'low' | 'medium' | 'high'
	}

	it('should create item selector', async () => {
		const store = createContext<TodoItem>(new Map(), 'memory', 'todos')

		// Add items
		store.set('task1', {
			id: 'task1',
			title: 'Task 1',
			completed: false,
			priority: 'high',
		})

		const selector = createItemSelector(store, 'task1')

		await new Promise<void>(resolve => {
			selector.subscribe(item => {
				expect(item).toEqual({
					id: 'task1',
					title: 'Task 1',
					completed: false,
					priority: 'high',
				})
				resolve()
			})
		})
	})

	it('should create filter selector', () => {
		return new Promise<void>(resolve => {
			const store = createContext<TodoItem>(new Map(), 'memory', 'todos')

			// Add items
			store.set('task1', {
				id: 'task1',
				title: 'Task 1',
				completed: false,
				priority: 'high',
			})

			store.set('task2', {
				id: 'task2',
				title: 'Task 2',
				completed: true,
				priority: 'medium',
			})

			store.set('task3', {
				id: 'task3',
				title: 'Task 3',
				completed: false,
				priority: 'low',
			})

			// Create selector for incomplete tasks
			const incompleteTasksSelector = createFilterSelector(store, task => !task.completed)

			incompleteTasksSelector.subscribe(tasks => {
				expect(tasks.length).toBe(2)
				expect(tasks[0].id).toBe('task1')
				expect(tasks[1].id).toBe('task3')
				resolve()
			})
		})
	})

	it('should create compound selector', () => {
		return new Promise<void>(resolve => {
			const store = createContext<TodoItem>(new Map(), 'memory', 'todos')

			// Add items
			store.set('task1', { id: 'task1', title: 'Task 1', completed: false, priority: 'high' })
			store.set('task2', { id: 'task2', title: 'Task 2', completed: true, priority: 'medium' })
			store.set('task3', { id: 'task3', title: 'Task 3', completed: false, priority: 'low' })

			// Create selectors
			const completedSelector = createFilterSelector(store, task => task.completed)
			const incompleteSelector = createFilterSelector(store, task => !task.completed)

			// Create compound selector
			const summarySelector = createCompoundSelector(
				[completedSelector, incompleteSelector],
				(completed, incomplete) => ({
					total: completed.length + incomplete.length,
					completed: completed.length,
					incomplete: incomplete.length,
					percentage: Math.round((completed.length / (completed.length + incomplete.length)) * 100),
				}),
			)

			summarySelector.subscribe(summary => {
				expect(summary).toEqual({
					total: 3,
					completed: 1,
					incomplete: 2,
					percentage: 33,
				})
				resolve()
			})
		})
	})
})

describe('Filtering', () => {
	interface Product {
		id: string
		name: string
		price: number
		category: string
		tags: string[]
		stock: number
	}

	const products: Product[] = [
		{
			id: 'p1',
			name: 'Laptop',
			price: 1200,
			category: 'electronics',
			tags: ['computer', 'portable'],
			stock: 10,
		},
		{
			id: 'p2',
			name: 'Smartphone',
			price: 800,
			category: 'electronics',
			tags: ['mobile', 'portable'],
			stock: 15,
		},
		{
			id: 'p3',
			name: 'Headphones',
			price: 200,
			category: 'accessories',
			tags: ['audio', 'portable'],
			stock: 20,
		},
		{
			id: 'p4',
			name: 'Monitor',
			price: 300,
			category: 'electronics',
			tags: ['computer', 'display'],
			stock: 5,
		},
		{
			id: 'p5',
			name: 'Keyboard',
			price: 100,
			category: 'accessories',
			tags: ['computer', 'input'],
			stock: 0,
		},
	]

	it('should filter map of items', () => {
		// Create map from products
		const productsMap = new Map<string, Product>()
		products.forEach(product => productsMap.set(product.id, product))

		// Filter by category
		const electronicsProducts = filterMap(productsMap, [['category', '==', 'electronics']])

		expect(electronicsProducts.length).toBe(3)
		expect(electronicsProducts.map(p => p.id)).toEqual(['p1', 'p2', 'p4'])

		// Filter by price range
		const affordableProducts = filterMap(productsMap, [
			['price', '>=', 100],
			['price', '<=', 300],
		])

		expect(affordableProducts.length).toBe(3)
		expect(affordableProducts.map(p => p.id)).toEqual(['p3', 'p4', 'p5'])

		// Filter by tag presence
		const portableProducts = filterMap(productsMap, [['tags', 'includes', 'portable']])

		expect(portableProducts.length).toBe(3)
		expect(portableProducts.map(p => p.id)).toEqual(['p1', 'p2', 'p3'])

		// Filter by multiple conditions
		const inStockElectronics = filterMap(productsMap, [
			['category', '==', 'electronics'],
			['stock', '>', 0],
		])

		expect(inStockElectronics.length).toBe(3)
		expect(inStockElectronics.map(p => p.id)).toEqual(['p1', 'p2', 'p4'])
	})

	it('should filter array of items', () => {
		// Filter by price range
		const expensiveProducts = filterArray(products, [['price', '>', 500]])

		expect(expensiveProducts.length).toBe(2)
		expect(expensiveProducts.map(p => p.id)).toEqual(['p1', 'p2'])

		// Filter with fuzzy search
		const searchResults = filterArray(products, [['name', 'any', 'phne']])

		expect(searchResults.length).toBe(2)
		expect(searchResults.map(p => p.id)).toEqual(['p2', 'p3'])
	})

	it('should handle strict filtering', () => {
		// Create map from products
		const productsMap = new Map<string, Product>()
		products.forEach(product => productsMap.set(product.id, product))

		// Filter with strict matching
		const strictResults = filterMap(productsMap, [
			['category', '==', 'electronics', true], // Strict matching
			['stock', '>', 5],
		])

		expect(strictResults.length).toBe(2)
		expect(strictResults.map(p => p.id)).toEqual(['p1', 'p2'])
	})
})
