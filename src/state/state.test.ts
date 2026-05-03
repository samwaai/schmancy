import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { LitElement, html, render } from 'lit'
import { customElement } from 'lit/decorators.js'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { $LitElement } from '@mixins/index'
import { bindState, computed, effect, observe, state, stateFromObservable } from './index'

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

	it('effect(fn) runs eagerly and re-runs on signal change', async () => {
		using counter = state<number>('test/effect-basic').memory(0)
		const seen: number[] = []
		const stop = effect(() => {
			seen.push(counter.value)
		})

		// Eager: fn ran once during construction.
		expect(seen).toEqual([0])

		counter.set(1)
		await settle()
		counter.set(2)
		await settle()
		counter.set(3)
		await settle()
		expect(seen).toEqual([0, 1, 2, 3])

		stop[Symbol.dispose]()
		counter.set(99)
		await settle()
		// Disposed: no further runs.
		expect(seen).toEqual([0, 1, 2, 3])
	})

	it('effect coalesces multiple writes within the same microtask', async () => {
		using counter = state<number>('test/effect-coalesce').memory(0)
		let runs = 0
		const stop = effect(() => {
			void counter.value
			runs += 1
		})
		expect(runs).toBe(1)

		counter.set(1)
		counter.set(2)
		counter.set(3)
		await settle()
		// All three writes in the same task → exactly one re-run.
		expect(runs).toBe(2)
		stop[Symbol.dispose]()
	})

	it('stress: 1000 rapid signal mutations produce one render cycle', async () => {
		using counter = state<number>('test/stress').memory(0)

		@customElement('test-stress-element')
		class TestStressElement extends $LitElement() {
			renders = 0
			render() {
				this.renders += 1
				return html`<span>${counter.value}</span>`
			}
		}
		void TestStressElement

		const el = document.createElement('test-stress-element') as LitElement & { renders: number }
		document.body.appendChild(el)
		await el.updateComplete
		const initialRenders = el.renders

		for (let i = 1; i <= 1000; i++) {
			counter.set(i)
		}
		await settle()
		await el.updateComplete

		expect(counter.value).toBe(1000)
		expect(el.shadowRoot!.querySelector('span')!.textContent).toBe('1000')
		// SignalWatcher coalesces — the host re-renders at most a small,
		// bounded number of times for 1000 sync mutations, NOT 1000 times.
		expect(el.renders - initialRenders).toBeLessThanOrEqual(2)
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

// ---------------------------------------------------------------------------
// <schmancy-context provides={[…]}> — declarative state isolation.
// Each test uses a fresh namespace so the global `claimed` set + the
// per-host resolver cache stay isolated. `using` ensures destroy on scope
// exit, including failure cases.
// ---------------------------------------------------------------------------

interface CounterShape {
	n: number
}

describe('<schmancy-context provides>', () => {
	it('isolates mutations across two disjoint subtrees (and leaves the global untouched)', async () => {
		using counter = state<CounterShape>('ctxtest/disjoint').memory({ n: 0 })

		@customElement('ctx-disjoint-reader')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
			bump() {
				counter.replace({ n: counter.value.n + 1 })
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context id="A" .provides=${[counter]}>
					<ctx-disjoint-reader id="ra"></ctx-disjoint-reader>
				</schmancy-context>
				<schmancy-context id="B" .provides=${[counter]}>
					<ctx-disjoint-reader id="rb"></ctx-disjoint-reader>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const ra = root.querySelector<LitElement & { bump(): void }>('#ra')!
		const rb = root.querySelector<LitElement & { bump(): void }>('#rb')!
		await ra.updateComplete
		await rb.updateComplete

		ra.bump()
		await settle()
		await ra.updateComplete
		await rb.updateComplete
		expect(ra.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(rb.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('0')
		expect(counter.value.n).toBe(0)

		rb.bump()
		rb.bump()
		await settle()
		await ra.updateComplete
		await rb.updateComplete
		expect(ra.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(rb.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('2')
		expect(counter.value.n).toBe(0)

		root.remove()
	})

	it('nested contexts resolve to the closest provider per namespace', async () => {
		using counter = state<CounterShape>('ctxtest/nested').memory({ n: 0 })

		@customElement('ctx-nested-reader')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
			set(v: number) {
				counter.replace({ n: v })
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context id="outer" .provides=${[counter]}>
					<ctx-nested-reader id="middle"></ctx-nested-reader>
					<schmancy-context id="inner" .provides=${[counter]}>
						<ctx-nested-reader id="leaf"></ctx-nested-reader>
					</schmancy-context>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const middle = root.querySelector<LitElement & { set(n: number): void }>('#middle')!
		const leaf = root.querySelector<LitElement & { set(n: number): void }>('#leaf')!
		await middle.updateComplete
		await leaf.updateComplete

		middle.set(7)
		leaf.set(99)
		await settle()
		await middle.updateComplete
		await leaf.updateComplete
		expect(middle.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('7')
		expect(leaf.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('99')
		expect(counter.value.n).toBe(0)

		root.remove()
	})

	it('isolated copy starts from the global snapshot at mount time', async () => {
		using counter = state<CounterShape>('ctxtest/snapshot').memory({ n: 0 })
		counter.replace({ n: 5 })

		@customElement('ctx-snapshot-reader')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-snapshot-reader id="r"></ctx-snapshot-reader>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement>('#r')!
		await r.updateComplete
		expect(r.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('5')

		root.remove()
	})

	it('disposes the isolated copy on provider disconnect (a fresh provider re-snapshots from global)', async () => {
		using counter = state<CounterShape>('ctxtest/dispose').memory({ n: 0 })

		@customElement('ctx-dispose-reader')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
			set(v: number) {
				counter.replace({ n: v })
			}
		}
		void Reader

		const rootA = document.createElement('div')
		document.body.appendChild(rootA)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-dispose-reader id="ra"></ctx-dispose-reader>
				</schmancy-context>
			`,
			rootA,
		)
		await settle()
		const ra = rootA.querySelector<LitElement & { set(n: number): void }>('#ra')!
		await ra.updateComplete
		ra.set(42)
		await settle()
		await ra.updateComplete
		expect(ra.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('42')
		expect(counter.value.n).toBe(0) // global never touched

		rootA.remove()

		// New provider mounts in a fresh subtree. It snapshots from the
		// CURRENT global, which is still 0 — proving the previous isolated's
		// state did not leak into the new one (i.e., it was destroyed).
		const rootB = document.createElement('div')
		document.body.appendChild(rootB)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-dispose-reader id="rb"></ctx-dispose-reader>
				</schmancy-context>
			`,
			rootB,
		)
		await settle()
		const rb = rootB.querySelector<LitElement>('#rb')!
		await rb.updateComplete
		expect(rb.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('0')

		rootB.remove()
	})

	it('falls through to the global for states not listed in `provides`', async () => {
		using inside = state<CounterShape>('ctxtest/inside').memory({ n: 0 })
		using outside = state<CounterShape>('ctxtest/outside').memory({ n: 0 })

		@customElement('ctx-fallthrough-reader')
		class Reader extends $LitElement() {
			override render() {
				return html`
					<span data-test="i">${inside.value.n}</span>
					<span data-test="o">${outside.value.n}</span>
				`
			}
			bumpInside() {
				inside.replace({ n: inside.value.n + 1 })
			}
			bumpOutside() {
				outside.replace({ n: outside.value.n + 1 })
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[inside]}>
					<ctx-fallthrough-reader id="r"></ctx-fallthrough-reader>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement & { bumpInside(): void; bumpOutside(): void }>('#r')!
		await r.updateComplete

		r.bumpInside()
		r.bumpOutside()
		await settle()
		await r.updateComplete

		// `inside` is provided → global stays at 0, isolated reads as 1.
		expect(inside.value.n).toBe(0)
		expect(r.shadowRoot!.querySelector('[data-test="i"]')!.textContent).toBe('1')
		// `outside` is not provided → write hits the global.
		expect(outside.value.n).toBe(1)
		expect(r.shadowRoot!.querySelector('[data-test="o"]')!.textContent).toBe('1')

		root.remove()
	})

	it('class-method handler resolves through the active host', async () => {
		using counter = state<CounterShape>('ctxtest/class-method').memory({ n: 0 })

		@customElement('ctx-class-method')
		class Reader extends $LitElement() {
			override render() {
				return html`
					<span data-test="v">${counter.value.n}</span>
					<button data-test="b" @click=${this.handleClick}></button>
				`
			}
			handleClick() {
				counter.replace({ n: counter.value.n + 1 })
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-class-method id="r"></ctx-class-method>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement>('#r')!
		await r.updateComplete
		const btn = r.shadowRoot!.querySelector<HTMLButtonElement>('[data-test="b"]')!
		btn.click()
		await settle()
		await r.updateComplete

		expect(r.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(counter.value.n).toBe(0)

		root.remove()
	})

	it('inline arrow handler resolves through the active host (event-host slot)', async () => {
		using counter = state<CounterShape>('ctxtest/inline-arrow').memory({ n: 0 })

		@customElement('ctx-inline-arrow')
		class Reader extends $LitElement() {
			override render() {
				return html`
					<span data-test="v">${counter.value.n}</span>
					<button
						data-test="b"
						@click=${() => counter.replace({ n: counter.value.n + 1 })}
					></button>
				`
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-inline-arrow id="r"></ctx-inline-arrow>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement>('#r')!
		await r.updateComplete
		const btn = r.shadowRoot!.querySelector<HTMLButtonElement>('[data-test="b"]')!
		btn.click()
		await settle()
		await r.updateComplete

		expect(r.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(counter.value.n).toBe(0)

		root.remove()
	})

	// Skipped: V8's await optimization (since 7.x) bypasses
	// `Promise.prototype.then` for native `await` on a native Promise — the
	// continuation resumes via internal scheduling without ever calling our
	// patched `then`, so the active-host stack is empty when the body after
	// the first `await` runs. There is no userland fix without a build-time
	// async-function transform or native AsyncContext.Variable. To preserve
	// the host across an async boundary today, do the mutation in the
	// synchronous prelude (before the first `await`) or chain explicitly with
	// `.then()` (which still routes through the patched method).
	it.skip('async-after-await handler resolves through the active host (Promise.then patch)', async () => {
		using counter = state<CounterShape>('ctxtest/async-after-await').memory({ n: 0 })

		@customElement('ctx-async-await')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
			async run(): Promise<void> {
				await Promise.resolve()
				await new Promise<void>(resolve => queueMicrotask(resolve))
				counter.replace({ n: counter.value.n + 1 })
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-async-await id="r"></ctx-async-await>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement & { run(): Promise<void> }>('#r')!
		await r.updateComplete

		await r.run()
		await settle()
		await r.updateComplete

		expect(r.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(counter.value.n).toBe(0)

		root.remove()
	})

	it('explicit .then() chain preserves the host across the microtask hop', async () => {
		using counter = state<CounterShape>('ctxtest/explicit-then').memory({ n: 0 })

		@customElement('ctx-explicit-then')
		class Reader extends $LitElement() {
			override render() {
				return html`<span data-test="v">${counter.value.n}</span>`
			}
			run(): Promise<void> {
				return Promise.resolve().then(() => counter.replace({ n: counter.value.n + 1 }))
			}
		}
		void Reader

		const root = document.createElement('div')
		document.body.appendChild(root)
		render(
			html`
				<schmancy-context .provides=${[counter]}>
					<ctx-explicit-then id="r"></ctx-explicit-then>
				</schmancy-context>
			`,
			root,
		)

		await settle()
		const r = root.querySelector<LitElement & { run(): Promise<void> }>('#r')!
		await r.updateComplete

		await r.run()
		await settle()
		await r.updateComplete

		expect(r.shadowRoot!.querySelector('[data-test="v"]')!.textContent).toBe('1')
		expect(counter.value.n).toBe(0)

		root.remove()
	})
})
