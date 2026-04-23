import { BehaviorSubject as e, Subject as t, combineLatest as n, distinctUntilChanged as r, map as i, share as a, shareReplay as o, throttleTime as s } from "rxjs";
import { takeUntil as c } from "rxjs/operators";
import { property as ee } from "lit/decorators.js";
var te = Symbol.for("immer-nothing"), l = Symbol.for("immer-draftable"), u = Symbol.for("immer-state"), ne = process.env.NODE_ENV === "production" ? [] : [
	function(e) {
		return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
	},
	function(e) {
		return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
	},
	"This object has been frozen and should not be mutated",
	function(e) {
		return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
	},
	"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
	"Immer forbids circular references",
	"The first or second argument to `produce` must be a function",
	"The third argument to `produce` must be a function or undefined",
	"First argument to `createDraft` must be a plain object, an array, or an immerable object",
	"First argument to `finishDraft` must be a draft returned by `createDraft`",
	function(e) {
		return `'current' expects a draft, got: ${e}`;
	},
	"Object.defineProperty() cannot be used on an Immer draft",
	"Object.setPrototypeOf() cannot be used on an Immer draft",
	"Immer only supports deleting array indices",
	"Immer only supports setting array indices and the 'length' property",
	function(e) {
		return `'original' expects a draft, got: ${e}`;
	}
];
function d(e, ...t) {
	if (process.env.NODE_ENV !== "production") {
		let n = ne[e], r = C(n) ? n.apply(null, t) : n;
		throw Error(`[Immer] ${r}`);
	}
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var f = Object, p = f.getPrototypeOf, m = "constructor", re = "prototype", ie = "configurable", h = "enumerable", g = "writable", _ = "value", v = (e) => !!e && !!e[u];
function y(e) {
	return !!e && (se(e) || de(e) || !!e[l] || !!e[m]?.[l] || fe(e) || pe(e));
}
var ae = f[re][m].toString(), oe = /* @__PURE__ */ new WeakMap();
function se(e) {
	if (!e || !S(e)) return !1;
	let t = p(e);
	if (t === null || t === f[re]) return !0;
	let n = f.hasOwnProperty.call(t, m) && t[m];
	if (n === Object) return !0;
	if (!C(n)) return !1;
	let r = oe.get(n);
	return r === void 0 && (r = Function.toString.call(n), oe.set(n, r)), r === ae;
}
function b(e, t, n = !0) {
	x(e) === 0 ? (n ? Reflect.ownKeys(e) : f.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function x(e) {
	let t = e[u];
	return t ? t.type_ : de(e) ? 1 : fe(e) ? 2 : pe(e) ? 3 : 0;
}
var ce = (e, t, n = x(e)) => n === 2 ? e.has(t) : f[re].hasOwnProperty.call(e, t), le = (e, t, n = x(e)) => n === 2 ? e.get(t) : e[t], ue = (e, t, n, r = x(e)) => {
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}, de = Array.isArray, fe = (e) => e instanceof Map, pe = (e) => e instanceof Set, S = (e) => typeof e == "object", C = (e) => typeof e == "function", me = (e) => typeof e == "boolean", w = (e) => e.copy_ || e.base_, he = (e) => {
	let t = ((e) => S(e) ? e?.[u] : null)(e);
	return t ? t.copy_ ?? t.base_ : e;
}, ge = (e) => e.modified_ ? e.copy_ : e.base_;
function _e(e, t) {
	if (fe(e)) return new Map(e);
	if (pe(e)) return new Set(e);
	if (de(e)) return Array[re].slice.call(e);
	let n = se(e);
	if (!0 === t || t === "class_only" && !n) {
		let t = f.getOwnPropertyDescriptors(e);
		delete t[u];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			!1 === a[g] && (a[g] = !0, a[ie] = !0), (a.get || a.set) && (t[i] = {
				[ie]: !0,
				[g]: !0,
				[h]: a[h],
				[_]: e[i]
			});
		}
		return f.create(p(e), t);
	}
	{
		let t = p(e);
		if (t !== null && n) return { ...e };
		let r = f.create(t);
		return f.assign(r, e);
	}
}
function ve(e, t = !1) {
	return E(e) || v(e) || !y(e) || (x(e) > 1 && f.defineProperties(e, {
		set: T,
		add: T,
		clear: T,
		delete: T
	}), f.freeze(e), t && b(e, (e, t) => {
		ve(t, !0);
	}, !1)), e;
}
var T = { [_]: function() {
	d(2);
} };
function E(e) {
	return e === null || !S(e) || f.isFrozen(e);
}
var D = "MapSet", ye = "Patches", be = "ArrayMethods", xe = {};
function O(e) {
	let t = xe[e];
	return t || d(0, e), t;
}
var k, Se = (e) => !!xe[e], A = () => k;
function Ce(e, t) {
	t && (e.patchPlugin_ = O(ye), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function we(e) {
	Te(e), e.drafts_.forEach(De), e.drafts_ = null;
}
function Te(e) {
	e === k && (k = e.parent_);
}
var Ee = (e) => k = {
	drafts_: [],
	parent_: k,
	immer_: e,
	canAutoFreeze_: !0,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: Se(D) ? O(D) : void 0,
	arrayMethodsPlugin_: Se(be) ? O(be) : void 0
};
function De(e) {
	let t = e[u];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Oe(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	if (e !== void 0 && e !== n) {
		n[u].modified_ && (we(t), d(4)), y(e) && (e = ke(t, e));
		let { patchPlugin_: r } = t;
		r && r.generateReplacementPatches_(n[u].base_, e, t);
	} else e = ke(t, n);
	return function(e, t, n = !1) {
		!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && ve(t, n);
	}(t, e, !0), we(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === te ? void 0 : e;
}
function ke(e, t) {
	if (E(t)) return t;
	let n = t[u];
	if (!n) return M(t, e.handledSet_, e);
	if (!j(n, e)) return t;
	if (!n.modified_) return n.base_;
	if (!n.finalized_) {
		let { callbacks_: t } = n;
		if (t) for (; t.length > 0;) t.pop()(e);
		Ne(n, e);
	}
	return n.copy_;
}
function Ae(e) {
	e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var j = (e, t) => e.scope_ === t, je = [];
function Me(e, t, n, r) {
	let i = w(e), a = e.type_;
	if (r !== void 0 && le(i, r, a) === t) return void ue(i, r, n, a);
	if (!e.draftLocations_) {
		let t = e.draftLocations_ = /* @__PURE__ */ new Map();
		b(i, (e, n) => {
			if (v(n)) {
				let r = t.get(n) || [];
				r.push(e), t.set(n, r);
			}
		});
	}
	let o = e.draftLocations_.get(t) ?? je;
	for (let e of o) ue(i, e, n, a);
}
function Ne(e, t) {
	if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
		let { patchPlugin_: n } = t;
		if (n) {
			let r = n.getPath(e);
			r && n.generatePatches_(e, r, t);
		}
		Ae(e);
	}
}
function Pe(e, t, n) {
	let { scope_: r } = e;
	if (v(n)) {
		let i = n[u];
		j(i, r) && i.callbacks_.push(function() {
			I(e), Me(e, n, ge(i), t);
		});
	} else y(n) && e.callbacks_.push(function() {
		let i = w(e);
		e.type_ === 3 ? i.has(n) && M(n, r.handledSet_, r) : le(i, t, e.type_) === n && r.drafts_.length > 1 && !0 === (e.assigned_.get(t) ?? !1) && e.copy_ && M(le(e.copy_, t, e.type_), r.handledSet_, r);
	});
}
function M(e, t, n) {
	return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || v(e) || t.has(e) || !y(e) || E(e) || (t.add(e), b(e, (r, i) => {
		if (v(i)) {
			let t = i[u];
			j(t, n) && (ue(e, r, ge(t), e.type_), Ae(t));
		} else y(i) && M(i, t, n);
	})), e;
}
var N = {
	get(e, t) {
		if (t === u) return e;
		let n = e.scope_.arrayMethodsPlugin_, r = e.type_ === 1 && typeof t == "string";
		if (r && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
		let i = w(e);
		if (!ce(i, t, e.type_)) return function(e, t, n) {
			let r = Ie(t, n);
			return r ? _ in r ? r[_] : r.get?.call(e.draft_) : void 0;
		}(e, i, t);
		let a = i[t];
		if (e.finalized_ || !y(a) || r && e.operationMethod && n?.isMutatingArrayMethod(e.operationMethod) && function(e) {
			let t = +e;
			return Number.isInteger(t) && String(t) === e;
		}(t)) return a;
		if (a === Fe(e.base_, t)) {
			I(e);
			let n = e.type_ === 1 ? +t : t, r = L(e.scope_, a, e, n);
			return e.copy_[n] = r;
		}
		return a;
	},
	has: (e, t) => t in w(e),
	ownKeys: (e) => Reflect.ownKeys(w(e)),
	set(e, t, n) {
		let r = Ie(w(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Fe(w(e), t), o = r?.[u];
			if (o && o.base_ === n) return e.copy_[t] = n, e.assigned_.set(t, !1), !0;
			if (((i = n) === (a = r) ? i !== 0 || 1 / i == 1 / a : i != i && a != a) && (n !== void 0 || ce(e.base_, t, e.type_))) return !0;
			I(e), F(e);
		}
		var i, a;
		return e.copy_[t] === n && (n !== void 0 || t in e.copy_) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_.set(t, !0), Pe(e, t, n)), !0;
	},
	deleteProperty: (e, t) => (I(e), Fe(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), F(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0),
	getOwnPropertyDescriptor(e, t) {
		let n = w(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			[g]: !0,
			[ie]: e.type_ !== 1 || t !== "length",
			[h]: r[h],
			[_]: n[t]
		};
	},
	defineProperty() {
		d(11);
	},
	getPrototypeOf: (e) => p(e.base_),
	setPrototypeOf() {
		d(12);
	}
}, P = {};
for (let e in N) {
	let t = N[e];
	P[e] = function() {
		let e = arguments;
		return e[0] = e[0][0], t.apply(this, e);
	};
}
function Fe(e, t) {
	let n = e[u];
	return (n ? w(n) : e)[t];
}
function Ie(e, t) {
	if (!(t in e)) return;
	let n = p(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = p(n);
	}
}
function F(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && F(e.parent_));
}
function I(e) {
	e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), _e(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
P.deleteProperty = function(e, t) {
	return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && d(13), P.set.call(this, e, t, void 0);
}, P.set = function(e, t, n) {
	return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && d(14), N.set.call(this, e[0], t, n, e[0]);
};
function L(e, t, n, r) {
	let [i, a] = fe(t) ? O(D).proxyMap_(t, n) : pe(t) ? O(D).proxySet_(t, n) : function(e, t) {
		let n = de(e), r = {
			type_: +!!n,
			scope_: t ? t.scope_ : A(),
			modified_: !1,
			finalized_: !1,
			assigned_: void 0,
			parent_: t,
			base_: e,
			draft_: null,
			copy_: null,
			revoke_: null,
			isManual_: !1,
			callbacks_: void 0
		}, i = r, a = N;
		n && (i = [r], a = P);
		let { revoke: o, proxy: s } = Proxy.revocable(i, a);
		return r.draft_ = s, r.revoke_ = o, [s, r];
	}(t, n);
	return (n?.scope_ ?? A()).drafts_.push(i), a.callbacks_ = n?.callbacks_ ?? [], a.key_ = r, n && r !== void 0 ? function(e, t, n) {
		e.callbacks_.push(function(r) {
			let i = t;
			if (!i || !j(i, r)) return;
			r.mapSetPlugin_?.fixSetContents(i);
			let a = ge(i);
			Me(e, i.draft_ ?? i, a, n), Ne(i, r);
		});
	}(n, a, r) : a.callbacks_.push(function(e) {
		e.mapSetPlugin_?.fixSetContents(a);
		let { patchPlugin_: t } = e;
		a.modified_ && t && t.generatePatches_(a, [], e);
	}), i;
}
function Le(e) {
	if (!y(e) || E(e)) return e;
	let t = e[u], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = _e(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = _e(e, !0);
	return b(n, (e, t) => {
		ue(n, e, Le(t));
	}, r), t && (t.finalized_ = !1), n;
}
var R = new class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, n) => {
			if (C(e) && !C(t)) {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			let r;
			if (C(t) || d(6), n === void 0 || C(n) || d(7), y(e)) {
				let i = Ee(this), a = L(i, e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? we(i) : Te(i);
				}
				return Ce(i, n), Oe(r, i);
			}
			if (!e || !S(e)) {
				if (r = t(e), r === void 0 && (r = e), r === te && (r = void 0), this.autoFreeze_ && ve(r, !0), n) {
					let t = [], i = [];
					O(ye).generateReplacementPatches_(e, r, {
						patches_: t,
						inversePatches_: i
					}), n(t, i);
				}
				return r;
			}
			d(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (C(e)) return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, me(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze), me(e?.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), me(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		y(e) || d(8), v(e) && (e = function(e) {
			return v(e) || d(10, e), Le(e);
		}(e));
		let t = Ee(this), n = L(t, e, void 0);
		return n[u].isManual_ = !0, Te(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[u];
		n && n.isManual_ || d(9);
		let { scope_: r } = n;
		return Ce(r, t), Oe(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = O(ye).applyPatches_;
		return v(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
}().produce, z = class e extends Error {
	constructor(t, n, r) {
		super(t), this.name = "StoreError", this.cause = n, this.context = r, this.timestamp = /* @__PURE__ */ new Date(), Error.captureStackTrace && Error.captureStackTrace(this, e);
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			cause: this.cause,
			context: this.context,
			timestamp: this.timestamp.toISOString(),
			stack: this.stack
		};
	}
};
function Re(e, t) {
	return t instanceof Map ? {
		t: "Map",
		entries: Array.from(t.entries())
	} : t instanceof Set ? {
		t: "Set",
		values: Array.from(t.values())
	} : t;
}
function ze(e, t) {
	if (t && typeof t == "object" && "t" in t) {
		let e = t;
		if (e.t === "Map") return Array.isArray(e.entries) && e.entries.every((e) => Array.isArray(e) && e.length === 2) ? new Map(e.entries) : t;
		if (e.t === "Set") return Array.isArray(e.values) ? new Set(e.values) : t;
	}
	return t;
}
var Be = class {
	constructor() {
		this.data = null;
	}
	async load() {
		return this.data;
	}
	async save(e) {
		this.data = e;
	}
	async clear() {
		this.data = null;
	}
}, Ve = class {
	constructor(e) {
		this.key = e;
	}
	async load() {
		try {
			let e = localStorage.getItem(this.key);
			return e ? JSON.parse(e, ze) : null;
		} catch {
			return null;
		}
	}
	async save(e) {
		try {
			localStorage.setItem(this.key, JSON.stringify(e, Re));
		} catch (e) {
			throw new z(`Failed to save to localStorage (${this.key})`, e);
		}
	}
	async clear() {
		localStorage.removeItem(this.key);
	}
}, He = class {
	constructor(e) {
		this.key = e;
	}
	async load() {
		try {
			let e = sessionStorage.getItem(this.key);
			return e ? JSON.parse(e, ze) : null;
		} catch {
			return null;
		}
	}
	async save(e) {
		try {
			sessionStorage.setItem(this.key, JSON.stringify(e, Re));
		} catch (e) {
			throw new z(`Failed to save to sessionStorage (${this.key})`, e);
		}
	}
	async clear() {
		sessionStorage.removeItem(this.key);
	}
}, Ue = class e {
	static {
		this.DB_NAME = "StoreDB";
	}
	static {
		this.STORE_NAME = "states";
	}
	static {
		this.DB_VERSION = 1;
	}
	constructor(e) {
		this.key = e;
	}
	openDB() {
		return new Promise((t, n) => {
			let r = indexedDB.open(e.DB_NAME, e.DB_VERSION);
			r.onupgradeneeded = () => {
				let t = r.result;
				t.objectStoreNames.contains(e.STORE_NAME) || t.createObjectStore(e.STORE_NAME);
			}, r.onsuccess = () => t(r.result), r.onerror = () => n(r.error);
		});
	}
	async load() {
		try {
			let t = await this.openDB();
			return new Promise((n, r) => {
				let i = t.transaction(e.STORE_NAME, "readonly").objectStore(e.STORE_NAME).get(this.key);
				i.onsuccess = () => {
					t.close(), n(i.result || null);
				}, i.onerror = () => {
					t.close(), r(i.error);
				};
			});
		} catch {
			return null;
		}
	}
	async save(t) {
		try {
			let n = await this.openDB();
			return new Promise((r, i) => {
				let a = n.transaction(e.STORE_NAME, "readwrite").objectStore(e.STORE_NAME).put(t, this.key);
				a.onsuccess = () => {
					n.close(), r();
				}, a.onerror = () => {
					n.close(), i(a.error);
				};
			});
		} catch (e) {
			throw new z(`Failed to save to IndexedDB (${this.key})`, e);
		}
	}
	async clear() {
		try {
			let t = await this.openDB();
			return new Promise((n, r) => {
				let i = t.transaction(e.STORE_NAME, "readwrite").objectStore(e.STORE_NAME).delete(this.key);
				i.onsuccess = () => {
					t.close(), n();
				}, i.onerror = () => {
					t.close(), r(i.error);
				};
			});
		} catch (e) {
			throw new z(`Failed to clear from IndexedDB (${this.key})`, e);
		}
	}
};
function We(e, t) {
	switch (e) {
		case "local": return new Ve(t);
		case "session": return new He(t);
		case "indexeddb": return new Ue(t);
		default: return new Be();
	}
}
(function() {
	class e extends Map {
		constructor(e, t) {
			super(), this[u] = {
				type_: 2,
				parent_: t,
				scope_: t ? t.scope_ : A(),
				modified_: !1,
				finalized_: !1,
				copy_: void 0,
				assigned_: void 0,
				base_: e,
				draft_: this,
				isManual_: !1,
				revoked_: !1,
				callbacks_: []
			};
		}
		get size() {
			return w(this[u]).size;
		}
		has(e) {
			return w(this[u]).has(e);
		}
		set(e, n) {
			let r = this[u];
			return i(r), w(r).has(e) && w(r).get(e) === n || (t(r), F(r), r.assigned_.set(e, !0), r.copy_.set(e, n), r.assigned_.set(e, !0), Pe(r, e, n)), this;
		}
		delete(e) {
			if (!this.has(e)) return !1;
			let n = this[u];
			return i(n), t(n), F(n), n.base_.has(e) ? n.assigned_.set(e, !1) : n.assigned_.delete(e), n.copy_.delete(e), !0;
		}
		clear() {
			let e = this[u];
			i(e), w(e).size && (t(e), F(e), e.assigned_ = /* @__PURE__ */ new Map(), b(e.base_, (t) => {
				e.assigned_.set(t, !1);
			}), e.copy_.clear());
		}
		forEach(e, t) {
			let n = this[u];
			w(n).forEach((n, r, i) => {
				e.call(t, this.get(r), r, this);
			});
		}
		get(e) {
			let n = this[u];
			i(n);
			let r = w(n).get(e);
			if (n.finalized_ || !y(r) || r !== n.base_.get(e)) return r;
			let a = L(n.scope_, r, n, e);
			return t(n), n.copy_.set(e, a), a;
		}
		keys() {
			return w(this[u]).keys();
		}
		values() {
			let e = this.keys();
			return {
				[Symbol.iterator]: () => this.values(),
				next: () => {
					let t = e.next();
					return t.done ? t : {
						done: !1,
						value: this.get(t.value)
					};
				}
			};
		}
		entries() {
			let e = this.keys();
			return {
				[Symbol.iterator]: () => this.entries(),
				next: () => {
					let t = e.next();
					if (t.done) return t;
					let n = this.get(t.value);
					return {
						done: !1,
						value: [t.value, n]
					};
				}
			};
		}
		[Symbol.iterator]() {
			return this.entries();
		}
	}
	function t(e) {
		e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), new Map(e.base_));
	}
	class n extends Set {
		constructor(e, t) {
			super(), this[u] = {
				type_: 3,
				parent_: t,
				scope_: t ? t.scope_ : A(),
				modified_: !1,
				finalized_: !1,
				copy_: void 0,
				base_: e,
				draft_: this,
				drafts_: /* @__PURE__ */ new Map(),
				revoked_: !1,
				isManual_: !1,
				assigned_: void 0,
				callbacks_: []
			};
		}
		get size() {
			return w(this[u]).size;
		}
		has(e) {
			let t = this[u];
			return i(t), t.copy_ ? !!t.copy_.has(e) || !(!t.drafts_.has(e) || !t.copy_.has(t.drafts_.get(e))) : t.base_.has(e);
		}
		add(e) {
			let t = this[u];
			return i(t), this.has(e) || (r(t), F(t), t.copy_.add(e), Pe(t, e, e)), this;
		}
		delete(e) {
			if (!this.has(e)) return !1;
			let t = this[u];
			return i(t), r(t), F(t), t.copy_.delete(e) || !!t.drafts_.has(e) && t.copy_.delete(t.drafts_.get(e));
		}
		clear() {
			let e = this[u];
			i(e), w(e).size && (r(e), F(e), e.copy_.clear());
		}
		values() {
			let e = this[u];
			return i(e), r(e), e.copy_.values();
		}
		entries() {
			let e = this[u];
			return i(e), r(e), e.copy_.entries();
		}
		keys() {
			return this.values();
		}
		[Symbol.iterator]() {
			return this.values();
		}
		forEach(e, t) {
			let n = this.values(), r = n.next();
			for (; !r.done;) e.call(t, r.value, r.value, this), r = n.next();
		}
	}
	function r(e) {
		e.copy_ || (e.copy_ = /* @__PURE__ */ new Set(), e.base_.forEach((t) => {
			if (y(t)) {
				let n = L(e.scope_, t, e, t);
				e.drafts_.set(t, n), e.copy_.add(n);
			} else e.copy_.add(t);
		}));
	}
	function i(e) {
		e.revoked_ && d(3, JSON.stringify(w(e)));
	}
	var a;
	xe[a = D] || (xe[a] = {
		proxyMap_: function(t, n) {
			let r = new e(t, n);
			return [r, r[u]];
		},
		proxySet_: function(e, t) {
			let r = new n(e, t);
			return [r, r[u]];
		},
		fixSetContents: function(e) {
			if (e.type_ === 3 && e.copy_) {
				let t = new Set(e.copy_);
				e.copy_.clear(), t.forEach((t) => {
					e.copy_.add(he(t));
				});
			}
		}
	});
})();
var B = class {
	get ready() {
		return this._ready;
	}
	set ready(e) {
		this._ready = e, this.updateState(this.$.value);
	}
	get value() {
		return this.$.getValue();
	}
	constructor(n, r, i) {
		let a;
		this.storageType = n, this.key = r, this[l] = !0, this._ready = !1, this._destroy$ = new t(), this.error$ = new e(null), a = i instanceof Map ? new Map(i) : Array.isArray(i) ? [...i] : i && typeof i == "object" ? { ...i } : i;
		try {
			this.defaultValue = this.isImmerDraftable(a) ? R(a, (e) => e) : a;
		} catch {
			this.defaultValue = a;
		}
		this.$ = new e(this.defaultValue), this.storage = We(n, r), n === "memory" ? this._ready = !0 : this.initializeFromStorage();
	}
	isImmerDraftable(e) {
		return typeof e == "object" && !!e && (Array.isArray(e) || e instanceof Map || e instanceof Set || Object.getPrototypeOf(e) === Object.prototype || !0 === e[l]);
	}
	destroy() {
		this._destroy$.next(), this._destroy$.complete(), this.$.complete(), this.error$.complete();
	}
	replace(e) {
		try {
			let t = this.isImmerDraftable(e) ? R(e, (e) => e) : e;
			this.updateState(t);
		} catch (t) {
			let n = new z(`Error replacing state in ${this.key}`, t);
			this.error$.next(n), this.updateState(e);
		}
	}
	updateState(e) {
		try {
			let t;
			t = this.isImmerDraftable(e) ? R(e, (e) => e) : e, this.$.next(t), this.storageType !== "memory" && this.persistToStorage(t).catch((e) => {
				let t = new z(`Error saving to ${this.storageType} storage for ${this.key}`, e);
				this.error$.next(t);
			});
		} catch (t) {
			let n = new z(`Error updating state in ${this.key}`, t);
			this.error$.next(n), this.$.next(e);
		}
	}
	async initializeFromStorage() {
		try {
			let e = await this.storage.load();
			if (e) {
				let t = this.processStoredValue(e);
				try {
					let e = this.isImmerDraftable(t) ? R(t, (e) => e) : t;
					this.updateState(e);
				} catch {
					this.updateState(t);
				}
			}
			this._ready = !0;
		} catch (e) {
			let t = new z(`Error loading from ${this.storageType} storage for ${this.key}`, e);
			this.error$.next(t), this._ready = !0;
		}
	}
	processStoredValue(e) {
		return e;
	}
	async persistToStorage(e) {
		return this.storage.save(e);
	}
}, Ge = class e extends B {
	static {
		this.type = "array";
	}
	static {
		this.instances = /* @__PURE__ */ new Map();
	}
	static getInstance(t, n, r = []) {
		let i = `${t}:${n}`;
		return this.instances.has(i) || this.instances.set(i, new e(t, n, r)), this.instances.get(i);
	}
	constructor(e, t, n = []) {
		super(e, t, n), e !== "memory" && this.setupPersistence();
	}
	setupPersistence() {
		this.$.pipe(s(100, void 0, {
			leading: !0,
			trailing: !0
		})).subscribe((e) => {
			this.storage.save(e).catch((e) => {
				let t = new z(`Error saving to ${this.storageType} storage for ${this.key}`, e);
				this.error$.next(t);
			});
		});
	}
	push(...e) {
		try {
			let t = R(this.value, (t) => {
				t.push(...e.map((e) => e));
			});
			this.updateState(t), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error pushing items in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	pop() {
		try {
			let e = this.value.length > 0 ? this.value[this.value.length - 1] : void 0, t = R(this.value, (e) => {
				e.pop();
			});
			return this.updateState(t), this.error$.next(null), e;
		} catch (e) {
			let t = new z(`Error popping item from ${this.key}`, e);
			this.error$.next(t);
			return;
		}
	}
	unshift(...e) {
		try {
			let t = R(this.value, (t) => {
				t.unshift(...e.map((e) => e));
			});
			this.updateState(t), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error unshifting items in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	shift() {
		try {
			let e = this.value.length > 0 ? this.value[0] : void 0, t = R(this.value, (e) => {
				e.shift();
			});
			return this.updateState(t), this.error$.next(null), e;
		} catch (e) {
			let t = new z(`Error shifting item from ${this.key}`, e);
			this.error$.next(t);
			return;
		}
	}
	set(e, t) {
		try {
			let n = R(this.value, (n) => {
				if (!(e >= 0 && e < n.length)) throw Error(`Index ${e} out of bounds (length: ${n.length})`);
				n[e] = t;
			});
			this.updateState(n), this.error$.next(null);
		} catch (t) {
			let n = new z(`Error setting item at index ${e} in ${this.key}`, t);
			this.error$.next(n);
		}
	}
	get(e) {
		return this.value[e];
	}
	splice(e, t, ...n) {
		try {
			let r = [...this.value].splice(e, t ?? 0, ...n), i = R(this.value, (r) => {
				r.splice(e, t ?? 0, ...n.map((e) => e));
			});
			return this.updateState(i), this.error$.next(null), r;
		} catch (e) {
			let t = new z(`Error splicing items in ${this.key}`, e);
			return this.error$.next(t), [];
		}
	}
	remove(e, t) {
		try {
			let n = t || ((e, t) => e === t), r = this.value.findIndex((t) => n(t, e));
			if (r !== -1) {
				let e = R(this.value, (e) => {
					e.splice(r, 1);
				});
				return this.updateState(e), this.error$.next(null), !0;
			}
			return this.error$.next(null), !1;
		} catch (e) {
			let t = new z(`Error removing item in ${this.key}`, e);
			return this.error$.next(t), !1;
		}
	}
	replace(e) {
		try {
			let t = R(e, (e) => e);
			this.updateState(t), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error replacing array in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	filter(e) {
		try {
			let t = this.value.filter(e), n = R(this.value, (e) => {
				e.length = 0, e.push(...t.map((e) => e));
			});
			this.updateState(n), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error filtering array in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	map(e) {
		return this.value.map(e);
	}
	sort(e) {
		try {
			let t = [...this.value].sort(e), n = R(this.value, (e) => {
				e.length = 0, e.push(...t.map((e) => e));
			});
			this.updateState(n), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error sorting array in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	update(e, t) {
		try {
			let n = R(this.value, (n) => {
				if (!(e >= 0 && e < n.length)) throw Error(`Index ${e} out of bounds (length: ${n.length})`);
				t(n[e]);
			});
			this.updateState(n), this.error$.next(null);
		} catch (t) {
			let n = new z(`Error updating item at index ${e} in ${this.key}`, t);
			this.error$.next(n);
		}
	}
	clear() {
		this.updateState([]);
	}
	setupDevTools() {
		typeof window < "u" && (window.__STORES__ = window.__STORES__ || {}, window.__STORES__[this.key] = {
			getState: () => this.value,
			push: this.push.bind(this),
			pop: this.pop.bind(this),
			unshift: this.unshift.bind(this),
			shift: this.shift.bind(this),
			set: this.set.bind(this),
			get: this.get.bind(this),
			splice: this.splice.bind(this),
			remove: this.remove.bind(this),
			replace: this.replace.bind(this),
			filter: this.filter.bind(this),
			map: this.map.bind(this),
			sort: this.sort.bind(this),
			update: this.update.bind(this),
			clear: this.clear.bind(this),
			subscribe: (e) => {
				let t = this.$.subscribe(e);
				return () => t.unsubscribe();
			}
		});
	}
}, Ke = class e extends B {
	static {
		this.type = "collection";
	}
	static {
		this.instances = /* @__PURE__ */ new Map();
	}
	static getInstance(t, n, r) {
		let i = `${t}:${n}`;
		return this.instances.has(i) || this.instances.set(i, new e(t, n, r)), this.instances.get(i);
	}
	set(e, t) {
		try {
			let n = R(this.value, (n) => {
				if (typeof e == "string") {
					if (t === void 0) throw Error("Value is required when setting a single key");
					n.set(e, t);
				} else if (e instanceof Map) Array.from(e.entries()).forEach(([e, t]) => {
					n.set(e, t);
				});
				else {
					if (typeof e != "object" || !e) throw Error("Invalid input: expected string key with value, Map, or object");
					Object.entries(e).forEach(([e, t]) => {
						n.set(e, t);
					});
				}
			});
			this.updateState(n), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error setting values in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	merge(e) {
		this.set(e);
	}
	delete(e) {
		try {
			let t = R(this.value, (t) => {
				t.delete(e);
			});
			this.updateState(t), this.error$.next(null);
		} catch (t) {
			let n = new z(`Error deleting key ${e} from ${this.key}`, t);
			this.error$.next(n);
		}
	}
	clear() {
		this.updateState(/* @__PURE__ */ new Map());
	}
	batchUpdate(e) {
		try {
			let t = R(this.value, (t) => {
				Object.entries(e).forEach(([e, n]) => {
					t.set(e, n);
				});
			});
			this.updateState(t), this.error$.next(null);
		} catch (e) {
			let t = new z(`Error batch updating in ${this.key}`, e);
			this.error$.next(t);
		}
	}
	update(e, t) {
		try {
			let n = R(this.value, (n) => {
				let r = n.get(e);
				r !== void 0 && t(r);
			});
			this.updateState(n), this.error$.next(null);
		} catch (t) {
			let n = new z(`Error updating item ${e} in ${this.key}`, t);
			this.error$.next(n);
		}
	}
	constructor(e, t, n) {
		super(e, t, n), e !== "memory" && this.setupPersistence();
	}
	setupPersistence() {
		this.$.pipe(s(100, void 0, {
			leading: !0,
			trailing: !0
		})).subscribe((e) => {
			this.storage.save(e).catch((e) => {
				let t = new z(`Error saving to ${this.storageType} storage for ${this.key}`, e);
				this.error$.next(t);
			});
		});
	}
	setupDevTools() {
		typeof window < "u" && (window.__STORES__ = window.__STORES__ || {}, window.__STORES__[this.key] = {
			getState: () => this.value,
			set: this.set.bind(this),
			merge: this.merge.bind(this),
			delete: this.delete.bind(this),
			clear: this.clear.bind(this),
			batchUpdate: this.batchUpdate.bind(this),
			update: this.update.bind(this),
			subscribe: (e) => {
				let t = this.$.subscribe(e);
				return () => t.unsubscribe();
			}
		});
	}
}, qe = class e extends B {
	constructor(...e) {
		super(...e), this[l] = !0;
	}
	static {
		this.type = "object";
	}
	static {
		this.instances = /* @__PURE__ */ new Map();
	}
	static getInstance(t, n, r) {
		let i = `${t}:${n}`;
		return this.instances.has(i) || this.instances.set(i, new e(t, n, r)), this.instances.get(i);
	}
	set(e, t = !0) {
		try {
			if (!this.isImmerDraftable(this.value)) {
				let n = t ? {
					...this.value,
					...e
				} : e;
				this.updateState(n), this.error$.next(null);
				return;
			}
			let n = R(this.value, (n) => {
				if (t) {
					if (e == null) return;
					try {
						Object.assign(n, e);
					} catch {
						Object.keys(e).forEach((t) => {
							n[t] = e[t];
						});
					}
				} else try {
					return e;
				} catch {
					return e;
				}
			});
			this.updateState(n), this.error$.next(null);
		} catch (n) {
			let r = new z(`Error updating store: ${this.key}`, n, {
				value: e,
				merge: t
			});
			this.error$.next(r);
			try {
				let n = t ? {
					...this.value,
					...e
				} : e;
				this.updateState(n);
			} catch {}
		}
	}
	clear() {
		try {
			if (this.isImmerDraftable(this.defaultValue)) {
				let e = R(this.defaultValue, (e) => e);
				this.set(e, !1);
			} else this.set(this.defaultValue, !1);
		} catch (e) {
			let t = new z(`Error clearing store: ${this.key}`, e);
			this.error$.next(t), this.updateState(this.defaultValue);
		}
	}
	delete(e) {
		try {
			if (!this.isImmerDraftable(this.value)) {
				let t = { ...this.value };
				delete t[e], this.updateState(t);
				return;
			}
			let t = R(this.value, (t) => {
				delete t[e];
			});
			this.updateState(t);
		} catch (t) {
			let n = new z(`Error deleting key ${String(e)} from store: ${this.key}`, t);
			this.error$.next(n);
			try {
				let t = { ...this.value };
				delete t[e], this.updateState(t);
			} catch {}
		}
	}
	setPath(e, t) {
		try {
			if (!e) return;
			if (!this.isImmerDraftable(this.value)) {
				let n = e.split("."), r = { ...this.value }, i = r;
				for (let e = 0; e < n.length - 1; e++) {
					let t = n[e];
					i[t] === void 0 ? i[t] = {} : typeof i[t] == "object" && i[t] !== null || (i[t] = {}), i = i[t];
				}
				i[n[n.length - 1]] = t, this.updateState(r);
				return;
			}
			let n = R(this.value, (n) => {
				let r = e.split("."), i = n;
				for (let e = 0; e < r.length - 1; e++) {
					let t = r[e];
					i[t] === void 0 ? i[t] = {} : typeof i[t] == "object" && i[t] !== null || (i[t] = {}), i = i[t];
				}
				let a = r[r.length - 1];
				try {
					i[a] = t;
				} catch {
					i[a] = t;
				}
			});
			this.updateState(n), this.error$.next(null);
		} catch (n) {
			let r = new z(`Error setting path ${e} in ${this.key}`, n);
			this.error$.next(r);
			try {
				let n = e.split("."), r = { ...this.value }, i = r;
				for (let e = 0; e < n.length - 1; e++) {
					let t = n[e];
					i[t] === void 0 ? i[t] = {} : typeof i[t] == "object" && i[t] !== null || (i[t] = {}), i = i[t];
				}
				i[n[n.length - 1]] = t, this.updateState(r);
			} catch {}
		}
	}
	processStoredValue(e) {
		try {
			return this.isImmerDraftable(this.defaultValue) && this.isImmerDraftable(e) ? R(this.defaultValue, (t) => {
				Object.assign(t, e);
			}) : {
				...this.defaultValue,
				...e
			};
		} catch {
			return e;
		}
	}
	setupDevTools() {
		typeof window < "u" && (window.__STORES__ = window.__STORES__ || {}, window.__STORES__[this.key] = {
			getState: () => this.value,
			set: this.set.bind(this),
			delete: this.delete.bind(this),
			clear: this.clear.bind(this),
			setPath: this.setPath.bind(this),
			subscribe: (e) => {
				let t = this.$.subscribe(e);
				return () => t.unsubscribe();
			}
		});
	}
	isImmerDraftable(e) {
		return typeof e == "object" && !!e && (super.isImmerDraftable(e) || !0 === e[l]);
	}
};
function Je(e, t, n) {
	try {
		t === "indexeddb" && (t = "local"), ((i = e) === null || typeof i != "object" || Array.isArray(i) || i instanceof Map || i instanceof Set || i instanceof Date || i instanceof RegExp || Object.getPrototypeOf(i) !== Object.prototype) && (e = { ...e });
		let a = qe.getInstance(t, n, e);
		return typeof (r = a.value) == "object" && r !== null && Object.keys(r).length === 0 && a.set({ ...e }), a;
	} catch {
		return qe.getInstance("memory", `${n}-fallback`, e);
	}
	var r, i;
}
function Ye(e, t, n) {
	try {
		let r = Ge.getInstance(t, n, e);
		return r.value.length || r.replace([...e]), r;
	} catch {
		return Ge.getInstance("memory", `${n}-fallback`, [...e]);
	}
}
function Xe(e, t, n) {
	try {
		return e ??= n.includes("collection") || n.includes("map") ? /* @__PURE__ */ new Map() : n.includes("array") || n.includes("list") ? [] : {}, e instanceof Map ? function(e, t, n) {
			try {
				let r = Ke.getInstance(t, n, e);
				return r.value.size || r.replace(new Map(e)), r;
			} catch {
				return Ke.getInstance("memory", `${n}-fallback`, new Map(e));
			}
		}(e, t, n) : function(e) {
			return Array.isArray(e);
		}(e) ? Ye(e, t, n) : Je(typeof e == "object" ? e : { value: e }, t, n);
	} catch {
		return Je(typeof e == "object" && e ? { ...e } : { value: e }, "memory", `emergency-fallback-${n}`);
	}
}
function Ze(e = [], t, n = "local") {
	try {
		return Xe(e, n, t);
	} catch {
		return Ye(e, "memory", `${t}-fallback`);
	}
}
function Qe(e = [], t = "test-array") {
	try {
		return Xe(e, "memory", t);
	} catch {
		return Ye(e, "memory", `${t}-emergency-fallback`);
	}
}
var $e = (e, t) => {
	if (!t) return e;
	let n = t.split("."), r = e;
	for (let e of n) {
		if (r == null) return;
		r = r[e];
	}
	return r;
}, et = (e) => {
	if (!e || e.length < 2) return [];
	let t = [];
	for (let n = 0; n < e.length - 1; n++) t.push(e.substring(n, n + 2).toLowerCase());
	return t;
}, tt = (e, t) => {
	if (!e || !t) return 0;
	let n = e.toLowerCase().trim(), r = t.toLowerCase().trim();
	if (n === r) return 1;
	let i = +!!n.includes(r), a = ((e, t) => {
		if (!e) return !0;
		if (!t) return !1;
		let n = 0, r = 0;
		for (; n < e.length && r < t.length;) e[n].toLowerCase() === t[r].toLowerCase() && n++, r++;
		return n === e.length;
	})(r, n) ? .8 : 0, o = ((e, t) => {
		if (!e) return !0;
		if (!t) return !1;
		let n = (e) => e.toLowerCase().split("").reduce((e, t) => (e[t] = (e[t] || 0) + 1, e), {}), r = n(e), i = n(t);
		return Object.keys(r).every((e) => (i[e] || 0) >= r[e]);
	})(r, n) ? .7 : 0, s = ((e, t) => {
		if (!e || !t || e.length < 2 || t.length < 2) return 0;
		let n = et(e), r = et(t);
		if (n.length === 0 || r.length === 0) return 0;
		let i = 0, a = Array(r.length).fill(!1);
		for (let e of n) for (let t = 0; t < r.length; t++) if (!a[t] && r[t] === e) {
			i++, a[t] = !0;
			break;
		}
		return 2 * i / (n.length + r.length);
	})(n, r), c = Math.max(n.length, r.length), ee = c ? 1 - ((e, t) => {
		if (e === t) return 0;
		let n = Array(t.length + 1).fill(null).map((e, t) => [t]);
		for (let t = 0; t <= e.length; t++) n[0][t] = t;
		for (let r = 1; r <= t.length; r++) for (let i = 1; i <= e.length; i++) t.charAt(r - 1) === e.charAt(i - 1) ? n[r][i] = n[r - 1][i - 1] : n[r][i] = Math.min(n[r - 1][i] + 1, n[r][i - 1] + 1, n[r - 1][i - 1] + 1);
		return n[t.length][e.length];
	})(n, r) / c : 0;
	return Math.max(i, a, o, s, ee);
}, nt = (e) => e == null ? "" : String(e);
function rt(e, t, n = .3) {
	let r, i, a, o = !1;
	if (Array.isArray(t)) [r, i, a, o = !1] = t;
	else {
		if (Array.isArray(t.key)) return t.key.map((r) => rt(e, {
			...t,
			key: r
		}, n)).reduce((e, t) => t.valid && t.score > e.score ? t : e, {
			valid: !1,
			score: 0
		});
		r = t.key, i = t.operator, a = t.value, o = t.strict || !1;
	}
	if (!o && (a === "" || a == null || V(a) && a.length === 0)) return {
		valid: !0,
		score: 1
	};
	let s = $e(e, r);
	if (o) {
		if (i === "any") {
			if (typeof s != "string" || typeof a != "string") return {
				valid: !1,
				score: 0
			};
			let e = tt(s, a);
			return {
				valid: e >= n,
				score: e >= n ? e : 0
			};
		}
		{
			let e = ct(i, s, a);
			return {
				valid: e,
				score: +!!e
			};
		}
	}
	if (i === "any") {
		if (typeof s != "string" || typeof a != "string") return {
			valid: !1,
			score: 0
		};
		let e = tt(s, a);
		return e < n ? {
			valid: !1,
			score: 0
		} : {
			valid: !0,
			score: e
		};
	}
	{
		let e = ct(i, s, a);
		return {
			valid: e,
			score: +!!e
		};
	}
}
function it(e, t = [], n = .3) {
	if (!t.length) return Array.from(e.values());
	let r = [];
	for (let [i, a] of e.entries()) {
		let e = 0, i = 0, o = !0;
		for (let r of t) {
			let t = rt(a, r, n);
			if (!t.valid) {
				o = !1;
				break;
			}
			e += t.score, i++;
		}
		o && r.push({
			item: a,
			score: i > 0 ? e / i : 1
		});
	}
	return r.sort((e, t) => t.score - e.score), r.map((e) => e.item);
}
function at(e, t = [], n = .3) {
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => r.set(String(t), e)), it(r, t, n);
}
function V(e) {
	return Array.isArray(e);
}
function H(e) {
	return typeof e == "string";
}
function U(e) {
	return typeof e == "number" && !isNaN(e);
}
function W(e) {
	return e instanceof Date && !isNaN(e.getTime());
}
function ot(e) {
	return typeof e == "object" && !!e && Symbol.iterator in Object(e) && typeof e[Symbol.iterator] == "function";
}
function G(e) {
	return e instanceof Map;
}
function K(e) {
	return e instanceof Set;
}
function st(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function q(e) {
	return e == null;
}
function ct(e, t, n) {
	if (q(t) && q(n)) return !0;
	if (q(t) || q(n)) return e === "==" ? t === n : e === "!=" && t !== n;
	switch (e) {
		case "==": return t === n;
		case "!=": return t !== n;
		case ">": return U(t) && U(n) ? t > n : W(t) && W(n) ? t.getTime() > n.getTime() : !(!H(t) || !H(n)) && t.localeCompare(n) > 0;
		case "<": return U(t) && U(n) ? t < n : W(t) && W(n) ? t.getTime() < n.getTime() : !(!H(t) || !H(n)) && t.localeCompare(n) < 0;
		case ">=": return U(t) && U(n) ? t >= n : W(t) && W(n) ? t.getTime() >= n.getTime() : !(!H(t) || !H(n)) && t.localeCompare(n) >= 0;
		case "<=": return U(t) && U(n) ? t <= n : W(t) && W(n) ? t.getTime() <= n.getTime() : !(!H(t) || !H(n)) && t.localeCompare(n) <= 0;
		case "includes": return H(t) ? t.toLowerCase().includes(nt(n).toLowerCase()) : V(t) ? t.includes(n) : K(t) ? t.has(n) : !!G(t) && Array.from(t.values()).includes(n);
		case "notIncludes": return H(t) ? !t.toLowerCase().includes(nt(n).toLowerCase()) : V(t) ? !t.includes(n) : K(t) ? !t.has(n) : !G(t) || !Array.from(t.values()).includes(n);
		case "startsWith": return !(!H(t) || !H(n)) && t.toLowerCase().startsWith(n.toLowerCase());
		case "endsWith": return !(!H(t) || !H(n)) && t.toLowerCase().endsWith(n.toLowerCase());
		case "in": return V(n) ? n.includes(t) : K(n) ? n.has(t) : !!G(n) && (n.has(t) || Array.from(n.values()).includes(t));
		case "notIn": return V(n) ? !n.includes(t) : K(n) ? !n.has(t) : !G(n) || !n.has(t) && !Array.from(n.values()).includes(t);
		default: return !1;
	}
}
var lt = it, ut = at;
function J(e, t) {
	if (e === t) return !0;
	if (e instanceof Map && t instanceof Map) {
		if (e.size !== t.size) return !1;
		for (let [n, r] of e) if (!t.has(n) || !J(r, t.get(n))) return !1;
		return !0;
	}
	if (e instanceof Set && t instanceof Set) {
		if (e.size !== t.size) return !1;
		for (let n of e) if (!t.has(n)) return !1;
		return !0;
	}
	if (typeof e == "object" && e && typeof t == "object" && t) {
		let n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (let r of n) if (!J(e[r], t[r])) return !1;
		return !0;
	}
	return !1;
}
function dt(e, t) {
	return e.$.pipe(i(t), r(J), o(1));
}
function Y(e, t) {
	return e.$.pipe(i(t), r(J), o(1));
}
function ft(e) {
	return Y(e, (e) => Array.from(e.values()));
}
function pt(e, t) {
	return Y(e, (e) => e.get(t));
}
function mt(e) {
	return Y(e, (e) => Array.from(e.keys()));
}
function ht(e) {
	return Y(e, (e) => Array.from(e.entries()));
}
function gt(e, t) {
	return Y(e, (e) => Array.from(e.values()).sort(t));
}
function _t(e, t) {
	return Y(e, (e) => {
		for (let [n, r] of e.entries()) if (t(r, n)) return r;
	});
}
function vt(e, t) {
	return Y(e, (e) => Array.from(e.entries()).filter(([e, n]) => t(n, e)).map(([e, t]) => t));
}
function yt(e, t) {
	return Y(e, (e) => Array.from(e.entries()).map(([e, n]) => t(n, e)));
}
function bt(e, t) {
	return Y(e, (e) => t ? Array.from(e.entries()).filter(([e, n]) => t(n, e)).length : e.size);
}
function xt(e, t) {
	return e.$.pipe(i(t), r(J), a({
		resetOnRefCountZero: !0,
		resetOnError: !1,
		resetOnComplete: !1
	}));
}
function St(t, r, i) {
	let a = i(...t.map((e, t) => r[t](e.value))), o = {
		$: new e(a),
		error$: new e(null),
		ready: !0,
		defaultValue: a,
		get value() {
			return this.$.getValue();
		},
		set(e, t) {},
		clear() {
			this.$.next(this.defaultValue);
		},
		replace(e) {},
		delete(e) {},
		destroy() {
			this.$.complete(), this.error$.complete();
		}
	}, s = n(t.map((e, t) => e.$)).subscribe({
		next: (e) => {
			try {
				let t = i(...e.map((e, t) => r[t](e)));
				o.$.next(t);
			} catch (e) {
				let t = new z("Error in compound selector", e);
				o.error$.next(t);
			}
		},
		error: (e) => {
			let t = new z("Error in store subscription", e);
			o.error$.next(t);
		}
	}), c = o.destroy;
	return o.destroy = function() {
		s.unsubscribe(), c.call(this);
	}, o;
}
var X = Symbol("selectorCleanup"), Z = Symbol("selectorSubscriptions"), Q = Symbol("selectorInitialized"), $ = Symbol("connectedCallbackCalled");
function Ct(e, n = (e) => e, r = { required: !0 }) {
	return function(i, a, o) {
		ee({
			attribute: !1,
			type: Object
		})(i, a);
		let s = i.connectedCallback, te = i.disconnectedCallback;
		i.connectedCallback = function() {
			var i;
			(i = this)[X] && !i[X].closed || (i[X] = new t()), i[Z] || (i[Z] = /* @__PURE__ */ new Map()), i[Q] || (i[Q] = /* @__PURE__ */ new Set());
			let o = function(e) {
				return "set" in e && typeof e.set == "function" && e.value instanceof Map;
			}(e) ? Y(e, n) : dt(e, n);
			r.required || this[$] || (s?.call(this), this[$] = !0), this[Z].has(a) && (this[Z].get(a)?.unsubscribe(), this[Z].delete(a)), r.debug;
			let ee = o.pipe(c(this[X])).subscribe({
				next: (e) => {
					let t = r.deepClone ? structuredClone(e) : e;
					r.debug, r.updateOnly || (this[a] = t), this.requestUpdate?.(), r.required && !this[Q].has(a) && t !== void 0 && (this[Q].add(a), this[$] || (r.debug, s?.call(this), this[$] = !0));
				},
				error: (e) => {
					this.isConnected && setTimeout(() => {
						this.isConnected && (r.debug, this.connectedCallback?.());
					}, 1e3);
				}
			});
			this[Z].set(a, ee);
		}, i.disconnectedCallback = function() {
			var e;
			te?.call(this), r.debug, (e = this)[X] && (e[X].next(), e[X].complete(), e[X] = void 0), e[Z] && (e[Z].forEach((e) => e.unsubscribe()), e[Z].clear(), e[Z] = void 0), e[Q] && (e[Q].clear(), e[Q] = void 0), e[$] = void 0;
		};
	};
}
function wt(e, t, n = { required: !0 }) {
	return function(r, i, a) {
		Ct(e, function(e) {
			let n = t(this);
			return n ? e.get(n) : void 0;
		}, n)(r, i);
	};
}
export { H as A, He as B, W as C, U as D, q as E, Ge as F, z as H, B as I, Ue as L, Xe as M, Qe as N, st as O, qe as P, Ve as R, V as S, G as T, We as V, ut as _, bt as a, it as b, _t as c, mt as d, yt as f, ct as g, gt as h, St as i, Ze as j, K as k, pt as l, dt as m, wt as n, ht as o, xt as p, Y as r, vt as s, Ct as t, ft as u, at as v, ot as w, $e as x, lt as y, Be as z };
