// @mhmo91/schmancy/state — reactive state primitive.
//
// Module-scoped singletons keyed by namespace. Each state exposes:
//   - `value: T`            current snapshot (defaultValue while loading)
//   - `signal: Signal.State<T>`  raw TC39 signal (use with computed())
//   - `$: Observable<T>`    RxJS surface (auto-emits on change, microtask-coalesced)
//   - `ready: Promise<void>` resolves once initial load attempt completes
//   - `loaded: boolean`     runtime flag — `value` reflects stored data
//
// Three call shapes:
//   const cart = state<CartState>('hannah/cart').session({ items: [], total: 0 })
//   const cart = state('hannah/cart').session(initialCart)               // typed-const
//   declare module '@mhmo91/schmancy/state' {                            // registry
//     interface SchmancyStateRegistry { 'hannah/cart': CartState }
//   }
//   const cart = state('hannah/cart').session({ items: [], total: 0 })

import { Signal } from '@lit-labs/signals'
import { Observable } from 'rxjs'
import { produce, type Draft } from 'immer'

import { createAdapter, type StorageAdapter, type StorageBackend } from './persist'

export type { StorageBackend } from './persist'
export { Signal } from '@lit-labs/signals'

// ---------------------------------------------------------------------------
// Public type surface
// ---------------------------------------------------------------------------

const stateBrand: unique symbol = Symbol('schmancy.state')
const namespaceBrand: unique symbol = Symbol('schmancy.state.namespace')

/**
 * Open registry — augment via `declare module '@mhmo91/schmancy/state'` to
 * bind a TypeScript type to a namespace string. Augmenting flips that
 * namespace to overload (A) of the factory: zero ceremony at the call
 * site, T comes from the registry.
 */
export interface SchmancyStateRegistry {}

export type RegisteredNamespace = keyof SchmancyStateRegistry & string

/** Feature-prefix convention enforced at compile time. */
export type FeatureNamespace = `${string}/${string}`

export type AssertNovel<NS extends string> = NS extends RegisteredNamespace
	? never & { readonly __error: `Namespace "${NS}" already registered` }
	: NS

export type SyncStorage = Exclude<StorageBackend, 'indexeddb'>
export type AsyncStorage = Extract<StorageBackend, 'indexeddb'>
export type IsAsync<S extends StorageBackend> = S extends AsyncStorage ? true : false

// Detect explicit null/undefined in T's union — works in BOTH strict and
// non-strict tsconfigs. The relaxed `null extends T` form fires for every
// T when strictNullChecks is off, which classifies every shape as
// 'nullable'. Distributing `T extends null/undefined` is a structural
// subtype check that doesn't depend on strict mode.
type _Has<T, U> = T extends U ? true : never
type _IsNullable<T> = [_Has<T, null> | _Has<T, undefined>] extends [never] ? false : true

/**
 * Shape classifier — drives the variant write API per T. Order: structural
 * shapes first (Map / Set / Array), primitives, then nullable-union check,
 * then plain object.
 */
export type Kind<T> = [T] extends [Map<unknown, unknown>]
	? 'map'
	: [T] extends [Set<unknown>]
		? 'set'
		: [T] extends [readonly unknown[]]
			? 'array'
			: [T] extends [string | number | boolean | bigint | symbol]
				? 'primitive'
				: _IsNullable<T> extends true
					? 'nullable'
					: [T] extends [object]
						? 'object'
						: 'unknown'

export interface ObjectAPI<T> {
	set(patch: Partial<T>, merge?: boolean): void
	replace(next: T): void
	update(recipe: (draft: Draft<T>) => void): void
	delete<K extends keyof T>(key: K): void
}

export interface MapAPI<T> {
	set: T extends Map<infer K, infer V> ? (key: K, value: V) => void : never
	replace(next: T): void
	delete: T extends Map<infer K, unknown> ? (key: K) => void : never
	clear(): void
}

export interface SetAPI<T> {
	add: T extends Set<infer U> ? (value: U) => void : never
	delete: T extends Set<infer U> ? (value: U) => boolean : never
	toggle: T extends Set<infer U> ? (value: U) => void : never
	replace(next: T): void
	clear(): void
}

export interface ArrayAPI<T> {
	push: T extends readonly (infer U)[] ? (...items: U[]) => void : never
	replace(next: T): void
	update(recipe: (draft: Draft<T>) => void): void
	clear(): void
}

export interface ScalarAPI<T> {
	set(next: T): void
	replace(next: T): void
}

export type WriteAPI<T> = Kind<T> extends 'map'
	? MapAPI<T>
	: Kind<T> extends 'set'
		? SetAPI<T>
		: Kind<T> extends 'array'
			? ArrayAPI<T>
			: Kind<T> extends 'object'
				? ObjectAPI<T>
				: ScalarAPI<T>

export interface BaseAPI<NS extends string, T, S extends StorageBackend> {
	readonly [stateBrand]: true
	readonly namespace: NS & { readonly [namespaceBrand]: NS }
	readonly storage: S
	/**
	 * Current value. For sync backends (memory/local/session) the load is
	 * synchronous, so the type narrows to `T`. For `idb` the load is genuinely
	 * async — `value` is `T | undefined` until `ready` resolves. Read with
	 * `state.value ?? state.defaultValue` if you don't care about the
	 * pre-load distinction; await `state.ready` if you do.
	 */
	readonly value: IsAsync<S> extends true ? T | undefined : T
	readonly defaultValue: T
	readonly ready: Promise<void>
	readonly loaded: boolean
	readonly signal: Signal.State<T>
	readonly $: Observable<T>
	destroy(): void
}

export interface SyncState<NS extends string, T, S extends SyncStorage>
	extends BaseAPI<NS, T, S>,
		Disposable {
	[Symbol.dispose](): void
}

export interface AsyncState<NS extends string, T>
	extends BaseAPI<NS, T, 'indexeddb'>,
		Disposable,
		AsyncDisposable {
	[Symbol.dispose](): void
	[Symbol.asyncDispose](): Promise<void>
}

export type State<NS extends string, T, S extends StorageBackend> = S extends AsyncStorage
	? AsyncState<NS, T> & WriteAPI<T>
	: SyncState<NS, T, S extends SyncStorage ? S : never> & WriteAPI<T>

export interface NamespaceHandlePinned<NS extends string, T> {
	memory(initial: T): State<NS, T, 'memory'>
	local(initial: T): State<NS, T, 'local'>
	session(initial: T): State<NS, T, 'session'>
	idb(initial: T): State<NS, T, 'indexeddb'>
}

export interface NamespaceHandleInferred<NS extends string> {
	memory<U>(initial: U): State<NS, U, 'memory'>
	local<U>(initial: U): State<NS, U, 'local'>
	session<U>(initial: U): State<NS, U, 'session'>
	idb<U>(initial: U): State<NS, U, 'indexeddb'>
}

// ---------------------------------------------------------------------------
// Runtime — variant detection + state instance construction
// ---------------------------------------------------------------------------

type RuntimeKind = 'map' | 'set' | 'array' | 'object' | 'scalar'

function detectKind(value: unknown): RuntimeKind {
	if (value instanceof Map) return 'map'
	if (value instanceof Set) return 'set'
	if (Array.isArray(value)) return 'array'
	if (value === null || value === undefined) return 'scalar'
	if (typeof value !== 'object') return 'scalar'
	return 'object'
}

const claimed = new Set<string>()

interface InternalState {
	signal: Signal.State<unknown>
	storage: StorageBackend
	adapter: StorageAdapter<unknown>
	pendingWrite: Promise<void> | null
	scheduledWrite: boolean
	disposed: boolean
}

function scheduleWrite(internal: InternalState): void {
	if (internal.scheduledWrite || internal.disposed) return
	internal.scheduledWrite = true
	queueMicrotask(() => {
		internal.scheduledWrite = false
		if (internal.disposed) return
		internal.pendingWrite = internal.adapter.save(internal.signal.get()).catch(err => {
			console.error('[state] save failed:', err)
		})
	})
}

function signalToObservable<T>(signal: Signal.State<T>): Observable<T> {
	return new Observable<T>(subscriber => {
		subscriber.next(signal.get())
		let scheduled = false
		const watcher = new Signal.subtle.Watcher(() => {
			if (scheduled) return
			scheduled = true
			queueMicrotask(() => {
				scheduled = false
				if (subscriber.closed) return
				subscriber.next(signal.get())
				watcher.watch(signal)
			})
		})
		watcher.watch(signal)
		return () => watcher.unwatch(signal)
	})
}

function buildWriteApi(internal: InternalState, kind: RuntimeKind): Record<string, unknown> {
	const commit = (next: unknown): void => {
		if (internal.disposed) return
		internal.signal.set(next)
		scheduleWrite(internal)
	}

	const common = {
		replace: (next: unknown) => commit(next),
	}

	switch (kind) {
		case 'object':
			return {
				...common,
				set(patch: Record<string, unknown>, merge = true) {
					const current = internal.signal.get() as Record<string, unknown>
					commit(merge ? { ...current, ...patch } : patch)
				},
				update(recipe: (draft: unknown) => void) {
					commit(produce(internal.signal.get(), recipe))
				},
				delete(key: string) {
					const current = internal.signal.get() as Record<string, unknown>
					const next = { ...current }
					delete next[key]
					commit(next)
				},
			}

		case 'map':
			return {
				...common,
				set(key: unknown, value: unknown) {
					const current = internal.signal.get() as Map<unknown, unknown>
					const next = new Map(current)
					next.set(key, value)
					commit(next)
				},
				delete(key: unknown) {
					const current = internal.signal.get() as Map<unknown, unknown>
					const next = new Map(current)
					next.delete(key)
					commit(next)
				},
				clear() {
					commit(new Map())
				},
			}

		case 'set':
			return {
				...common,
				add(value: unknown) {
					const current = internal.signal.get() as Set<unknown>
					if (current.has(value)) return
					const next = new Set(current)
					next.add(value)
					commit(next)
				},
				delete(value: unknown): boolean {
					const current = internal.signal.get() as Set<unknown>
					if (!current.has(value)) return false
					const next = new Set(current)
					next.delete(value)
					commit(next)
					return true
				},
				toggle(value: unknown) {
					const current = internal.signal.get() as Set<unknown>
					const next = new Set(current)
					if (next.has(value)) {
						next.delete(value)
					} else {
						next.add(value)
					}
					commit(next)
				},
				clear() {
					commit(new Set())
				},
			}

		case 'array':
			return {
				...common,
				push(...items: unknown[]) {
					const current = internal.signal.get() as unknown[]
					commit([...current, ...items])
				},
				update(recipe: (draft: unknown) => void) {
					commit(produce(internal.signal.get(), recipe))
				},
				clear() {
					commit([])
				},
			}

		case 'scalar':
		default:
			return {
				...common,
				set(next: unknown) {
					commit(next)
				},
			}
	}
}

interface CreateInstanceArgs {
	namespace: string
	initial: unknown
	storage: StorageBackend
}

function reportLoadError(err: unknown): void {
	console.error('[state] load failed:', err)
}

function createInstance(args: CreateInstanceArgs): unknown {
	const { namespace, initial, storage } = args
	const adapter = createAdapter<unknown>(storage, namespace)
	const signal = new Signal.State<unknown>(initial)
	const internal: InternalState = {
		signal,
		storage,
		adapter,
		pendingWrite: null,
		scheduledWrite: false,
		disposed: false,
	}

	let loaded = false
	const applyLoaded = (stored: unknown): void => {
		if (internal.disposed) return
		if (stored !== null && stored !== undefined) {
			internal.signal.set(stored)
		}
	}
	const markLoaded = (): boolean => (loaded = true)
	const ready = adapter
		.load()
		.then(applyLoaded, reportLoadError)
		.then(markLoaded)
		.then(() => undefined)

	const observable = signalToObservable(signal)
	const writeApi = buildWriteApi(internal, detectKind(initial))

	async function flushAndClose(): Promise<void> {
		// Wait for any in-flight write, then any scheduled microtask write.
		if (internal.pendingWrite) await internal.pendingWrite
		// Drain a possibly-still-scheduled microtask:
		await new Promise<void>(resolve => queueMicrotask(resolve))
		if (internal.pendingWrite) await internal.pendingWrite
		if (adapter.close) await adapter.close()
	}

	const dispose = (): void => {
		if (internal.disposed) return
		internal.disposed = true
		// Fire-and-forget close for sync backends; AsyncDisposable variant
		// has its own awaited path via Symbol.asyncDispose.
		void flushAndClose()
		claimed.delete(namespace)
	}

	const asyncDispose = async (): Promise<void> => {
		if (internal.disposed) return
		internal.disposed = true
		await flushAndClose()
		claimed.delete(namespace)
	}

	// Build the instance with explicit property definitions so the `value`
	// and `loaded` getters stay live. (A `{ ...base }` spread invokes the
	// getter once at spread time and freezes the result — that snapshot
	// then disagrees with the signal on every subsequent write.)
	const instance: Record<string | symbol, unknown> = Object.assign(Object.create(null) as object, {
		[stateBrand]: true,
		namespace,
		storage,
		defaultValue: initial,
		ready,
		signal,
		$: observable,
		destroy: dispose,
		[Symbol.dispose]: dispose,
		...writeApi,
	})

	Object.defineProperty(instance, 'value', {
		get: () => signal.get(),
		enumerable: true,
	})
	Object.defineProperty(instance, 'loaded', {
		get: () => loaded,
		enumerable: true,
	})

	if (storage === 'indexeddb') {
		instance[Symbol.asyncDispose] = asyncDispose
	}

	return instance
}

function makeHandle(
	namespace: string,
	options: { claim?: boolean } = {},
): Record<string, (initial: unknown) => unknown> {
	const claim = options.claim ?? true
	if (claim) {
		if (claimed.has(namespace)) {
			throw new Error(
				`[state] namespace "${namespace}" already registered. Each namespace must be unique.`,
			)
		}
		claimed.add(namespace)
	}
	return {
		memory: initial => createInstance({ namespace, initial, storage: 'memory' }),
		local: initial => createInstance({ namespace, initial, storage: 'local' }),
		session: initial => createInstance({ namespace, initial, storage: 'session' }),
		idb: initial => createInstance({ namespace, initial, storage: 'indexeddb' }),
	}
}

// ---------------------------------------------------------------------------
// Three-overload factory.
// (A) registered → pinned T from registry
// (C) unregistered, no type arg → inferred T (typed-const flow)
// (B) unregistered, explicit type arg → pinned T
// Order matters for resolution; do not reorder.
// ---------------------------------------------------------------------------

export function state<NS extends RegisteredNamespace>(
	namespace: NS,
): NamespaceHandlePinned<NS, SchmancyStateRegistry[NS]>

export function state<const NS extends FeatureNamespace>(
	namespace: NS extends RegisteredNamespace ? never : AssertNovel<NS>,
): NamespaceHandleInferred<NS>

export function state<T, const NS extends FeatureNamespace = FeatureNamespace>(
	namespace: NS extends RegisteredNamespace ? never : AssertNovel<NS>,
): NamespaceHandlePinned<NS, T>

export function state(namespace: unknown): unknown {
	if (typeof namespace !== 'string') {
		throw new TypeError('[state] namespace must be a string')
	}
	if (!namespace.includes('/')) {
		throw new TypeError(
			`[state] namespace "${namespace}" must follow the "feature/name" convention.`,
		)
	}
	return makeHandle(namespace)
}

// ---------------------------------------------------------------------------
// Derived state — re-export the upstream computed primitive directly.
// Reading state.value (which calls signal.get() under the hood) inside a
// computed callback auto-tracks the dependency.
// ---------------------------------------------------------------------------

export { computed } from '@lit-labs/signals'

// ---------------------------------------------------------------------------
// effect(fn) — run a side-effect function whenever any signal it reads
// changes. Returns a Disposable so the effect can be cleaned up.
//
//   const stop = effect(() => {
//     document.title = `${cart.value.items.length} items`
//   })
//   ...later...
//   stop[Symbol.dispose]()
//
// The effect runs once eagerly to register dependencies, then re-runs
// (microtask-coalesced) whenever any read signal changes.
// ---------------------------------------------------------------------------

export interface EffectHandle extends Disposable {
	[Symbol.dispose](): void
}

export function effect(fn: () => void): EffectHandle {
	let scheduled = false
	let disposed = false
	let watcher: Signal.subtle.Watcher | undefined

	const run = (): void => {
		if (disposed) return
		// Wrap fn in a Computed so signal reads are tracked. The computed's
		// value is unused — we only care about the dependency graph it builds.
		const computation = new Signal.Computed(() => {
			fn()
			return undefined
		})
		// Reading the computed registers our Watcher as a sink for every
		// signal the fn touches.
		watcher?.unwatch()
		watcher = new Signal.subtle.Watcher(() => {
			if (scheduled || disposed) return
			scheduled = true
			queueMicrotask(() => {
				scheduled = false
				if (disposed) return
				run()
			})
		})
		watcher.watch(computation)
		computation.get()
	}

	run()

	return {
		[Symbol.dispose](): void {
			if (disposed) return
			disposed = true
			watcher?.unwatch()
			watcher = undefined
		},
	}
}

// ---------------------------------------------------------------------------
// Observable → state bridge.
// ---------------------------------------------------------------------------

export interface FromObservableOptions {
	storage?: StorageBackend
}

/**
 * Lift an Observable into a state(). The state is initialized with
 * `initial`, then updates on every Observable emission. Cleanup on
 * dispose unsubscribes the source.
 */
export function stateFromObservable<T, NS extends FeatureNamespace>(
	observable: Observable<T>,
	namespace: NS,
	initial: T,
	options: FromObservableOptions = {},
): State<NS, T, 'memory'> {
	const storage = options.storage ?? 'memory'
	const handle = makeHandle(namespace)
	const inst = handle[storage](initial) as State<NS, T, 'memory'> & {
		readonly signal: Signal.State<T>
		[Symbol.dispose](): void
	}
	const subscription = observable.subscribe({
		next: value => inst.signal.set(value),
		error: err => console.error(`[state] from(${namespace}) source errored:`, err),
	})
	const originalDispose = inst[Symbol.dispose].bind(inst)
	;(inst as { [Symbol.dispose]: () => void })[Symbol.dispose] = () => {
		subscription.unsubscribe()
		originalDispose()
	}
	return inst
}

// ---------------------------------------------------------------------------
// bindState(host, source) — Lit ReactiveController helper for one-way binding.
//
// Subscribes in hostConnected, unsubscribes in hostDisconnected, calls
// host.requestUpdate() on every emission. Returned object exposes the same
// `value` and `$` surface as the source so render code reads naturally:
//
//   class CartView extends LitElement {
//     cart = bindState(this, cartState)
//     render() { return html`Items: ${this.cart.value.items.length}` }
//   }
//
// Decorator (`@observe`) form is deliberately deferred — schmancy's
// tsconfig still uses experimentalDecorators=true and flipping to
// TC39 native produces ~9k errors across the codebase. The helper
// gives the same lifecycle guarantees with zero tsconfig churn.
// ---------------------------------------------------------------------------

import type { ReactiveController, ReactiveControllerHost } from 'lit'

/** Permissive duck-typed contract — v1 IStore<T>, v2 State<>, and
 *  computed() outputs (`Signal.Computed<T>` wrapped in a thin shim) all
 *  satisfy it once you supply a `value` getter and an Observable `$`. */
export interface ObservableState<T> {
	readonly value: T
	readonly $: Observable<T>
}

export interface BoundState<T> {
	readonly value: T
	readonly $: Observable<T>
}

class BindStateController<T> implements ReactiveController {
	private subscription: import('rxjs').Subscription | undefined
	private latest: T
	constructor(
		private readonly host: ReactiveControllerHost,
		private readonly source: ObservableState<T>,
	) {
		this.latest = source.value
		host.addController(this)
	}
	get value(): T {
		return this.latest
	}
	get $(): Observable<T> {
		return this.source.$
	}
	hostConnected(): void {
		this.subscription = this.source.$.subscribe(v => {
			this.latest = v
			this.host.requestUpdate()
		})
	}
	hostDisconnected(): void {
		this.subscription?.unsubscribe()
		this.subscription = undefined
	}
}

export function bindState<T>(
	host: ReactiveControllerHost,
	source: ObservableState<T>,
): BoundState<T> {
	return new BindStateController(host, source)
}

// ---------------------------------------------------------------------------
// @observe(source) — legacy property decorator for one-way binding.
//
// Usage:
//   class CartView extends LitElement {
//     @observe(cart) cart!: CartState
//     render() { return html`Items: ${this.cart.items.length}` }
//   }
//
// Reads return the latest value emitted by the source (falling back to
// `source.value` before the first emission). Caller writes are dropped
// with a dev-mode warning — the source is the single source of truth.
//
// Per-instance subscription is wired via Lit's static `addInitializer`,
// which runs at instance construction and gives the decorator access to
// the host. A `ReactiveController` handles the lifecycle: subscribe in
// `hostConnected`, unsubscribe in `hostDisconnected`. Multiple `@observe`
// decorators on the same class register independent controllers — no
// init-order bookkeeping, no prototype-walking.
//
// Legacy decorator (matches the rest of schmancy's @property / @state /
// @query family). Works under the existing `experimentalDecorators: true`
// tsconfig — no migration required.
// ---------------------------------------------------------------------------

interface ObserveHost extends ReactiveControllerHost {
	addController(controller: ReactiveController): void
}

interface LitElementCtor {
	addInitializer(initializer: (host: ObserveHost) => void): void
}

export function observe<T>(source: ObservableState<T>) {
	return function (proto: object, propertyKey: string | symbol): void {
		const storageKey = Symbol(`__observe_${String(propertyKey)}`)

		// Per-prototype accessor — reads return the latest cached value,
		// falling back to `source.value` before the first emission lands.
		// Writes from callers are dropped with a dev warning.
		Object.defineProperty(proto, propertyKey, {
			get(this: Record<symbol, T>): T {
				const cached = this[storageKey]
				return cached !== undefined ? cached : source.value
			},
			set(_value: T): void {
				console.warn(
					`@observe: field "${String(propertyKey)}" is read-only — write ignored. ` +
						`Update the source state directly.`,
				)
			},
			configurable: true,
			enumerable: true,
		})

		// Per-instance subscription via Lit's addInitializer hook.
		const ctor = proto.constructor as unknown as LitElementCtor
		if (typeof ctor.addInitializer !== 'function') {
			throw new TypeError(
				`@observe requires a Lit ReactiveElement subclass — ${proto.constructor.name} ` +
					`does not provide static addInitializer.`,
			)
		}

		ctor.addInitializer((host: ObserveHost) => {
			let subscription: import('rxjs').Subscription | undefined
			host.addController({
				hostConnected(): void {
					subscription = source.$.subscribe(value => {
						;(host as unknown as Record<symbol, T>)[storageKey] = value
						host.requestUpdate()
					})
				},
				hostDisconnected(): void {
					subscription?.unsubscribe()
					subscription = undefined
				},
			})
		})
	}
}

// ---------------------------------------------------------------------------
// scopedState — tree-scoped state via @lit/context.
//
// `state(...)` is a module-scoped singleton (one global instance per
// namespace). `scopedState(...)` is the tree-scoped equivalent: a
// provider component creates a per-instance state, descendant
// consumers walk the DOM tree to find it.
//
// Use cases this enables that module-scoped can't:
//   - Multi-tenant subtrees (each <tenant-shell> provides its own cart)
//   - Sub-route isolation (a route's state lives only while mounted)
//   - Test isolation (mount a component with a controlled state, no
//     global pollution)
//   - Micro-frontend composition (each MFE gets its own state, no
//     cross-talk via siblings)
//
// Module-scoped state is a strict subset: a single top-level provider
// IS the global. So scopedState is additive — module-scoped consumers
// keep working unchanged.
//
// Shape:
//   const cartScope = scopedState<CartState>('hannah/cart')
//
//   class CartProvider extends $LitElement() {
//     cart = cartScope.provide(this).session(initial)
//     render() { return html`<slot></slot>` }
//   }
//
//   class CartView extends $LitElement() {
//     cart = cartScope.consume(this)
//     render() { return html`Items: ${this.cart.value.items.length}` }
//   }
//
// The consumer's `cart` is the SAME state instance the provider
// created — same write API, same Observable, same value. Reads
// before the consumer's host connects throw a clear error; reads
// inside `render()` (which always runs after connection) are safe.
// ---------------------------------------------------------------------------

import { ContextConsumer, ContextProvider, createContext, type Context } from '@lit/context'
import type { LitElement } from 'lit'

type AnyState<NS extends string, T> = State<NS, T, StorageBackend>

export interface ScopedFactory<NS extends string, T> {
	/**
	 * Create + register the scoped state on the provider host. The provider
	 * picks the storage backend (memory / local / session / idb).
	 *
	 * The state lives for the host's lifetime — it's disposed when the
	 * provider disconnects.
	 */
	provide(host: LitElement): NamespaceHandlePinned<NS, T>

	/**
	 * Resolve the nearest provider in the DOM tree. Returns the same state
	 * instance the provider created — same value, same write API, same
	 * Observable.
	 *
	 * Throws if no provider exists in scope when read (after the host
	 * connects). Reads in `render()` are safe; reads in the constructor
	 * are not.
	 */
	consume(host: LitElement): AnyState<NS, T>
}

const scopeContextRegistry = new Map<string, Context<string, unknown>>()

function getScopeContext<NS extends string, T>(namespace: NS): Context<NS, AnyState<NS, T>> {
	let ctx = scopeContextRegistry.get(namespace) as Context<NS, AnyState<NS, T>> | undefined
	if (!ctx) {
		ctx = createContext<AnyState<NS, T>>(Symbol(`schmancy.state.scope:${namespace}`)) as Context<
			NS,
			AnyState<NS, T>
		>
		scopeContextRegistry.set(namespace, ctx as Context<string, unknown>)
	}
	return ctx
}

export function scopedState<T, const NS extends FeatureNamespace>(
	namespace: NS extends RegisteredNamespace ? never : AssertNovel<NS>,
): ScopedFactory<NS, T>

export function scopedState(namespace: string): ScopedFactory<string, unknown> {
	if (!namespace.includes('/')) {
		throw new TypeError(
			`[state] namespace "${namespace}" must follow the "feature/name" convention.`,
		)
	}
	const ctx = getScopeContext<string, unknown>(namespace)

	return {
		provide(host: LitElement): NamespaceHandlePinned<string, unknown> {
			// Per-host: one state instance, one ContextProvider, dispose on
			// hostDisconnected. The namespace is NOT globally claimed — multiple
			// providers for the same namespace are the entire point of the
			// scoped surface.
			const handle = makeHandle(namespace, { claim: false })
			const wrap = (backend: 'memory' | 'local' | 'session' | 'idb') =>
				(initial: unknown) => {
					const inst = handle[backend](initial) as AnyState<string, unknown> & {
						destroy(): void
					}
					const provider = new ContextProvider(host, { context: ctx, initialValue: inst })
					void provider
					host.addController({
						hostDisconnected(): void {
							inst.destroy()
						},
					})
					return inst
				}
			return {
				memory: wrap('memory'),
				local: wrap('local'),
				session: wrap('session'),
				idb: wrap('idb'),
			} as NamespaceHandlePinned<string, unknown>
		},

		consume(host: LitElement): AnyState<string, unknown> {
			let resolved: AnyState<string, unknown> | undefined
			const consumer = new ContextConsumer(host, {
				context: ctx,
				callback: (value: AnyState<string, unknown> | undefined): void => {
					resolved = value
				},
				subscribe: true,
			})
			void consumer

			// Return a proxy that forwards every property read/write to the
			// resolved instance. Reads before resolution throw with a clear
			// error so misuse surfaces loudly instead of silently returning
			// stale values.
			return new Proxy({} as AnyState<string, unknown>, {
				get(_target, prop): unknown {
					if (!resolved) {
						throw new Error(
							`[state] scopedState("${namespace}") consumed by ${host.tagName.toLowerCase()} ` +
								`but no provider in tree. Mount the provider as an ancestor before this component reads ` +
								`scoped state, or move the read into render() / a method called after connectedCallback.`,
						)
					}
					return (resolved as unknown as Record<string | symbol, unknown>)[prop as string | symbol]
				},
				set(_target, prop, value): boolean {
					if (!resolved) {
						throw new Error(
							`[state] scopedState("${namespace}") write before provider attached.`,
						)
					}
					;(resolved as unknown as Record<string | symbol, unknown>)[prop as string | symbol] =
						value
					return true
				},
				has(_target, prop): boolean {
					return resolved ? prop in (resolved as object) : false
				},
			})
		},
	}
}
