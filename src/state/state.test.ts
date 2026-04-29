import { describe, expect, it } from 'vitest'
import { computed, state } from './index'

const nextMicrotask = (): Promise<void> => Promise.resolve()
const settle = async (): Promise<void> => {
	await nextMicrotask()
	await nextMicrotask()
}

describe('state() factory', () => {
	it('rejects namespaces without a "/"', () => {
		expect(() => state('cart' as never)).toThrow(/feature\/name/)
	})

	it('rejects double-claiming the same namespace', () => {
		const a = state('test/double-claim').memory(0)
		expect(() => state('test/double-claim').memory(0)).toThrow(/already registered/)
		a[Symbol.dispose]()
	})

	it('exposes value, signal, $ + ready and loaded', async () => {
		using s = state<number>('test/scalar-shape').memory(7)
		expect(s.value).toBe(7)
		expect(s.signal.get()).toBe(7)
		expect(s.loaded).toBe(false)
		await s.ready
		expect(s.loaded).toBe(true)
	})

	it('writes through ObjectAPI: set, replace, update, delete', () => {
		interface Cart {
			items: number[]
			total: number
		}
		using cart = state<Cart>('test/cart-object').memory({ items: [], total: 0 })
		cart.set({ total: 12 })
		expect(cart.value).toEqual({ items: [], total: 12 })
		cart.update(d => {
			d.items.push(1, 2, 3)
		})
		expect(cart.value.items).toEqual([1, 2, 3])
		cart.replace({ items: [9], total: 100 })
		expect(cart.value).toEqual({ items: [9], total: 100 })
		cart.delete('total')
		expect(cart.value).toEqual({ items: [9] })
	})

	it('writes through MapAPI', () => {
		using docs = state<Map<string, { id: string }>>('test/map-shape').memory(new Map())
		docs.set('a', { id: 'a' })
		docs.set('b', { id: 'b' })
		expect(docs.value.size).toBe(2)
		expect(docs.value.get('a')).toEqual({ id: 'a' })
		docs.delete('a')
		expect(docs.value.has('a')).toBe(false)
		docs.clear()
		expect(docs.value.size).toBe(0)
	})

	it('writes through SetAPI: add / toggle / delete', () => {
		using sel = state<Set<string>>('test/set-shape').memory(new Set())
		sel.add('x')
		sel.add('x')
		expect(sel.value.size).toBe(1)
		sel.toggle('x')
		expect(sel.value.size).toBe(0)
		sel.toggle('y')
		expect(sel.value.has('y')).toBe(true)
		expect(sel.delete('y')).toBe(true)
		expect(sel.delete('y')).toBe(false)
	})

	it('writes through ScalarAPI for nullable references', () => {
		using edit = state<{ id: string } | null>('test/nullable-shape').memory(null)
		expect(edit.value).toBeNull()
		edit.set({ id: 'doc-1' })
		expect(edit.value).toEqual({ id: 'doc-1' })
		edit.replace(null)
		expect(edit.value).toBeNull()
	})

	it('writes through ArrayAPI', () => {
		using items = state<number[]>('test/array-shape').memory([])
		items.push(1, 2, 3)
		expect(items.value).toEqual([1, 2, 3])
		items.update(d => {
			d.push(4)
		})
		expect(items.value).toEqual([1, 2, 3, 4])
		items.clear()
		expect(items.value).toEqual([])
	})

	it('emits on $ when the signal changes (microtask-coalesced)', async () => {
		using counter = state<number>('test/counter-emit').memory(0)
		const collected: number[] = []
		const sub = counter.$.subscribe(v => collected.push(v))
		counter.set(1)
		counter.set(2)
		counter.set(3)
		await settle()
		expect(collected[0]).toBe(0)
		expect(collected.at(-1)).toBe(3)
		expect(collected.length).toBeLessThanOrEqual(3)
		sub.unsubscribe()
	})

	it('persists to localStorage and rehydrates on next mount', async () => {
		const ns = 'test/persist-local'
		localStorage.removeItem(ns)
		const a = state<{ count: number }>(ns).local({ count: 0 })
		await a.ready
		a.set({ count: 5 })
		await settle()
		a[Symbol.dispose]()

		const b = state<{ count: number }>(ns).local({ count: 0 })
		await b.ready
		expect(b.value.count).toBe(5)
		b[Symbol.dispose]()
		localStorage.removeItem(ns)
	})

	it('round-trips Map via the JSON tunnel through localStorage', async () => {
		const ns = 'test/persist-map'
		localStorage.removeItem(ns)
		const a = state<Map<string, number>>(ns).local(new Map())
		await a.ready
		a.set('alpha', 1)
		a.set('beta', 2)
		await settle()
		a[Symbol.dispose]()

		const b = state<Map<string, number>>(ns).local(new Map())
		await b.ready
		expect(b.value.get('alpha')).toBe(1)
		expect(b.value.get('beta')).toBe(2)
		b[Symbol.dispose]()
		localStorage.removeItem(ns)
	})

	it('IDB-backed state is AsyncDisposable', async () => {
		const idb = state<{ id: string }>('test/idb-async').idb({ id: 'init' })
		await idb.ready
		expect(typeof idb[Symbol.asyncDispose]).toBe('function')
		await idb[Symbol.asyncDispose]()
	})

	it('computed() composes over multiple states', () => {
		using a = state<number>('test/computed-a').memory(2)
		using b = state<number>('test/computed-b').memory(3)
		const sum = computed(() => a.value + b.value)
		expect(sum.get()).toBe(5)
		a.set(10)
		expect(sum.get()).toBe(13)
		b.set(20)
		expect(sum.get()).toBe(30)
	})

	it('Symbol.dispose releases the namespace claim', () => {
		const ns = 'test/release-and-reuse'
		const s = state<number>(ns).memory(0)
		s[Symbol.dispose]()
		expect(() => {
			using s2 = state<number>(ns).memory(0)
			void s2
		}).not.toThrow()
	})
})
