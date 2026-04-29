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
	readonly value: T
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

function makeHandle(namespace: string): Record<string, (initial: unknown) => unknown> {
	if (claimed.has(namespace)) {
		throw new Error(
			`[state] namespace "${namespace}" already registered. Each namespace must be unique.`,
		)
	}
	claimed.add(namespace)
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
