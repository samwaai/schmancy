import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { $LitElement } from '@mixins/index'
import { bindState, computed, observe, state, stateFromObservable } from './index'

class FakeHost implements ReactiveControllerHost {
	private controllers = new Set<ReactiveController>()
	updates = 0
	addController(c: ReactiveController): void {
		this.controllers.add(c)
	}
	removeController(c: ReactiveController): void {
		this.controllers.delete(c)
	}
	requestUpdate(): void {
		this.updates += 1
	}
	get updateComplete(): Promise<boolean> {
		return Promise.resolve(true)
	}
	connect(): void {
		this.controllers.forEach(c => c.hostConnected?.())
	}
	disconnect(): void {
		this.controllers.forEach(c => c.hostDisconnected?.())
	}
}

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

	it('stateFromObservable lifts an Observable into a state', async () => {
		const source = new Subject<number>()
		const lifted = stateFromObservable(source, 'test/lifted', 0)
		await lifted.ready
		expect(lifted.value).toBe(0)
		source.next(7)
		expect(lifted.value).toBe(7)
		source.next(42)
		expect(lifted.value).toBe(42)
		lifted[Symbol.dispose]()
	})

	it('bindState mirrors the source value across the host lifecycle', async () => {
		using counter = state<number>('test/bound').memory(0)
		const host = new FakeHost()
		const bound = bindState(host, counter)
		expect(bound.value).toBe(0)
		host.connect()
		counter.set(3)
		await settle()
		expect(bound.value).toBe(3)
		expect(host.updates).toBeGreaterThan(0)

		const updatesBeforeDisconnect = host.updates
		host.disconnect()
		counter.set(99)
		await settle()
		// After disconnect, the bound view stops tracking — value frozen.
		expect(bound.value).toBe(3)
		expect(host.updates).toBe(updatesBeforeDisconnect)
	})

	it('@observe binds a Lit component field to a state source', async () => {
		using counter = state<number>('test/observe-counter').memory(0)

		@customElement('test-observe-element')
		class TestObserveElement extends LitElement {
			@observe(counter) count!: number
			render() {
				return html`<span data-test="value">${this.count}</span>`
			}
		}
		void TestObserveElement

		const el = document.createElement('test-observe-element') as LitElement & { count: number }
		document.body.appendChild(el)
		await el.updateComplete

		expect(el.count).toBe(0)
		const span = el.shadowRoot!.querySelector('[data-test="value"]')!
		expect(span.textContent).toBe('0')

		counter.set(7)
		await settle()
		await el.updateComplete
		expect(el.count).toBe(7)
		expect(span.textContent).toBe('7')

		counter.set(42)
		await settle()
		await el.updateComplete
		expect(el.count).toBe(42)
		expect(span.textContent).toBe('42')

		el.remove()
	})

	it('@observe drops caller writes with a dev warning', async () => {
		using flag = state<boolean>('test/observe-readonly').memory(false)

		@customElement('test-observe-readonly')
		class TestReadonlyElement extends LitElement {
			@observe(flag) flag!: boolean
			render() {
				return html`<span>${this.flag}</span>`
			}
		}
		void TestReadonlyElement

		const el = document.createElement('test-observe-readonly') as LitElement & { flag: boolean }
		document.body.appendChild(el)
		await el.updateComplete

		const originalWarn = console.warn
		const warnings: string[] = []
		console.warn = (...args: unknown[]) => warnings.push(args.map(String).join(' '))
		try {
			el.flag = true
		} finally {
			console.warn = originalWarn
		}

		expect(el.flag).toBe(false)
		expect(warnings.length).toBe(1)
		expect(warnings[0]).toMatch(/read-only/)

		flag.set(true)
		await settle()
		await el.updateComplete
		expect(el.flag).toBe(true)

		el.remove()
	})

	it('$LitElement auto-tracks state reads in render — no decorator needed', async () => {
		using counter = state<number>('test/auto-tracked').memory(0)

		@customElement('test-auto-tracked-element')
		class TestAutoTrackedElement extends $LitElement() {
			render() {
				return html`<span data-test="value">${counter.value}</span>`
			}
		}
		void TestAutoTrackedElement

		const el = document.createElement('test-auto-tracked-element') as LitElement
		document.body.appendChild(el)
		await el.updateComplete

		const span = el.shadowRoot!.querySelector('[data-test="value"]')!
		expect(span.textContent).toBe('0')

		counter.set(11)
		await settle()
		await el.updateComplete
		expect(span.textContent).toBe('11')

		counter.set(99)
		await settle()
		await el.updateComplete
		expect(span.textContent).toBe('99')

		el.remove()
	})

	it('@observe unsubscribes on disconnect and resubscribes on reconnect', async () => {
		using ticker = state<number>('test/observe-lifecycle').memory(0)

		@customElement('test-observe-lifecycle')
		class TestLifecycleElement extends LitElement {
			@observe(ticker) tick!: number
			render() {
				return html`<span>${this.tick}</span>`
			}
		}
		void TestLifecycleElement

		const el = document.createElement('test-observe-lifecycle') as LitElement & { tick: number }
		document.body.appendChild(el)
		await el.updateComplete
		expect(el.tick).toBe(0)

		ticker.set(1)
		await settle()
		await el.updateComplete
		expect(el.tick).toBe(1)

		el.remove()
		ticker.set(2)
		// Field reads fall back to source.value once the cached storage is
		// stale — the fallback path always returns the source's latest value,
		// so we don't assert the field stayed frozen. Reconnect to verify
		// the controller resubscribes and renders pick up emissions again.

		document.body.appendChild(el)
		await settle()
		await el.updateComplete
		expect(el.tick).toBe(2)

		el.remove()
	})
})
