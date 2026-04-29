// Type-level tests for the public state() surface.
//
// All assertions are compile-time. Each call-site probe is wrapped in
// a function that's never invoked at runtime — types are extracted via
// `ReturnType`, so importing this file doesn't claim any namespace.
//
// Negative-case strategy: the schmancy pre-edit hook bans the TS
// directive that asserts "this line should fail to typecheck"
// (NO_TYPE_ESCAPES rule). Negative cases are expressed as pure
// type-level predicates over the public surface — never as call
// sites we expect to fail.
//
// Note: schmancy's main tsconfig has `strict: false`, which makes
// the `Kind<T>` nullable check fragile at the type level (every
// type is implicitly nullable). The runtime test suite covers the
// nullable-union dispatch directly; this file focuses on assertions
// that hold under both strict and non-strict tsconfigs.

import type {
	AssertNovel,
	FeatureNamespace,
	IsAsync,
	Kind,
	ObjectAPI,
	State,
} from './index'
import { state } from './index'

// --- Equality / assignability primitives ---------------------------------
type Equal<X, Y> =
	(<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
type Expect<T extends true> = T
type Assignable<A, B> = A extends B ? true : false

// --- Sample shapes -------------------------------------------------------
interface CartItem {
	id: string
	name: string
	price: number
	quantity: number
}
interface CartState {
	items: CartItem[]
	total: number
}
interface PamDoc {
	id: string
	amount: number
}

// =========================================================================
// Probes — never called. Wrapped in functions so the state() factory
// runs only at the type level (no namespace registration at import).
// =========================================================================
function form1Probe() {
	const initial: CartState = { items: [], total: 0 }
	return state('test-d/cart-form-1').session(initial)
}
function form2Probe() {
	return state<CartState>('test-d/cart-form-2').session({ items: [], total: 0 })
}
function mapProbe() {
	return state<Map<string, PamDoc>>('test-d/map-shape').idb(new Map())
}
function setProbe() {
	return state<Set<string>>('test-d/set-shape').memory(new Set())
}
function arrayProbe() {
	return state<number[]>('test-d/items').memory([])
}
function flagProbe() {
	return state<boolean>('test-d/footer').memory(false)
}

type Form1 = ReturnType<typeof form1Probe>
type Form2 = ReturnType<typeof form2Probe>
type Docs = ReturnType<typeof mapProbe>
type Sel = ReturnType<typeof setProbe>
type Items = ReturnType<typeof arrayProbe>
type Flag = ReturnType<typeof flagProbe>

// =========================================================================
// Kind<T> classifier — Map / Set / Array / primitive checks. (Nullable
// classification is non-strict-tsconfig-fragile; covered by runtime tests.)
// =========================================================================
type _kObject = Expect<Equal<Kind<CartState>, 'object'>>
type _kMap = Expect<Equal<Kind<Map<string, PamDoc>>, 'map'>>
type _kSet = Expect<Equal<Kind<Set<string>>, 'set'>>
type _kArrayReadonly = Expect<Equal<Kind<readonly string[]>, 'array'>>
type _kArrayMutable = Expect<Equal<Kind<string[]>, 'array'>>
type _kBoolean = Expect<Equal<Kind<boolean>, 'primitive'>>
type _kNumber = Expect<Equal<Kind<number>, 'primitive'>>
type _kString = Expect<Equal<Kind<string>, 'primitive'>>

// IsAsync<S> drives the AsyncDisposable lifecycle for indexeddb only.
type _idbAsync = Expect<Equal<IsAsync<'indexeddb'>, true>>
type _memSync = Expect<Equal<IsAsync<'memory'>, false>>
type _sesSync = Expect<Equal<IsAsync<'session'>, false>>
type _locSync = Expect<Equal<IsAsync<'local'>, false>>

// =========================================================================
// Form (1) — typed-const inference (no type arg).
// =========================================================================
type _f1Value = Expect<Equal<Form1['value'], CartState>>
type _f1SetArg0 = Expect<Equal<Parameters<Form1['set']>[0], Partial<CartState>>>
type _f1SetArg1 = Expect<Equal<Parameters<Form1['set']>[1], boolean | undefined>>
type _f1Replace = Expect<Equal<Parameters<Form1['replace']>, [CartState]>>

// =========================================================================
// Form (2) — explicit type arg.
// =========================================================================
type _f2SetArg0 = Expect<Equal<Parameters<Form2['set']>[0], Partial<CartState>>>
type _f2SetArg1 = Expect<Equal<Parameters<Form2['set']>[1], boolean | undefined>>
type _f2Replace = Expect<Equal<Parameters<Form2['replace']>, [CartState]>>
type _f2DeleteKeys = Expect<Equal<Parameters<Form2['delete']>[0], keyof CartState>>
type _f2HasUpdate = Expect<Assignable<Form2, { update: ObjectAPI<CartState>['update'] }>>
type _f2Value = Expect<Equal<Form2['value'], CartState>>
type _f2Sync = Expect<Assignable<Form2, Disposable>>

// =========================================================================
// Map<string, Doc> with idb backend → MapAPI + AsyncDisposable.
// =========================================================================
type _docsSetShape = Expect<Equal<Parameters<Docs['set']>, [string, PamDoc]>>
type _docsDeleteShape = Expect<Equal<Parameters<Docs['delete']>, [string]>>
type _docsHasClear = Expect<Equal<Parameters<Docs['clear']>, []>>
type _docsValue = Expect<Equal<Docs['value'], Map<string, PamDoc>>>
type _docsAsync = Expect<Assignable<Docs, AsyncDisposable>>
type _docsSync = Expect<Assignable<Docs, Disposable>>

// =========================================================================
// Set<string> in memory → SetAPI.
// =========================================================================
type _selAdd = Expect<Equal<Parameters<Sel['add']>, [string]>>
type _selToggle = Expect<Equal<Parameters<Sel['toggle']>, [string]>>
type _selDelete = Expect<Equal<Parameters<Sel['delete']>, [string]>>
type _selDeleteReturns = Expect<Equal<ReturnType<Sel['delete']>, boolean>>
type _selValue = Expect<Equal<Sel['value'], Set<string>>>
type _selSync = Expect<Assignable<Sel, Disposable>>

// =========================================================================
// Mutable arrays → ArrayAPI.
// =========================================================================
type _itemsPush = Expect<Equal<Parameters<Items['push']>, number[]>>
type _itemsHasUpdate = Expect<Equal<'update' extends keyof Items ? true : false, true>>
type _itemsHasClear = Expect<Equal<'clear' extends keyof Items ? true : false, true>>

// =========================================================================
// Primitive boolean → ScalarAPI (no update / no delete).
// =========================================================================
type _flagSet = Expect<Equal<Parameters<Flag['set']>, [boolean]>>
type _flagNoUpdate = Expect<Equal<'update' extends keyof Flag ? true : false, false>>
type _flagNoDelete = Expect<Equal<'delete' extends keyof Flag ? true : false, false>>

// =========================================================================
// FeatureNamespace pure type-level checks (no call sites).
// =========================================================================
type _slashlessRejected = Expect<Equal<'cart' extends FeatureNamespace ? true : false, false>>
type _slashedAccepted = Expect<Equal<'a/b' extends FeatureNamespace ? true : false, true>>
type _twoSlashesAccepted = Expect<Equal<'a/b/c' extends FeatureNamespace ? true : false, true>>

// =========================================================================
// AssertNovel returns 'fresh' for unregistered names.
// =========================================================================
type _assertNovelOnFresh = Expect<Equal<AssertNovel<'test-d/fresh'>, 'test-d/fresh'>>

// =========================================================================
// State<NS, T, S> alias smoke — verifies the conditional structure resolves.
// =========================================================================
type _syncMemoryState = Expect<
	Assignable<State<'test-d/x', CartState, 'memory'>, { value: CartState }>
>
type _asyncIdbState = Expect<Assignable<State<'test-d/x', CartState, 'indexeddb'>, AsyncDisposable>>

// =========================================================================
// Collect every assertion into one exported tuple. TS still checks each
// entry; the export consumes the unused locals so noUnusedLocals stops
// flagging them.
// =========================================================================
export type _SchmancyStateTypeSpec = [
	_kObject,
	_kMap,
	_kSet,
	_kArrayReadonly,
	_kArrayMutable,
	_kBoolean,
	_kNumber,
	_kString,
	_idbAsync,
	_memSync,
	_sesSync,
	_locSync,
	_f1Value,
	_f1SetArg0,
	_f1SetArg1,
	_f1Replace,
	_f2SetArg0,
	_f2SetArg1,
	_f2Replace,
	_f2DeleteKeys,
	_f2HasUpdate,
	_f2Value,
	_f2Sync,
	_docsSetShape,
	_docsDeleteShape,
	_docsHasClear,
	_docsValue,
	_docsAsync,
	_docsSync,
	_selAdd,
	_selToggle,
	_selDelete,
	_selDeleteReturns,
	_selValue,
	_selSync,
	_itemsPush,
	_itemsHasUpdate,
	_itemsHasClear,
	_flagSet,
	_flagNoUpdate,
	_flagNoDelete,
	_slashlessRejected,
	_slashedAccepted,
	_twoSlashesAccepted,
	_assertNovelOnFresh,
	_syncMemoryState,
	_asyncIdbState,
]
