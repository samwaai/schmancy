import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-CszkJuNl.js";
import { t as n } from "./tslib.es6-DMzzJKHV.js";
import { customElement as r, property as i, state as a } from "lit/decorators.js";
import { LitElement as o, html as s, noChange as c } from "lit";
import { repeat as l } from "lit/directives/repeat.js";
import { AsyncDirective as u } from "lit/async-directive.js";
import { PartType as d, directive as f } from "lit/directive.js";
import { property as p } from "lit/decorators/property.js";
var m = class extends t() {
	constructor(...e) {
		super(...e), this.columns = [], this.cols = this.columns.map(() => "1fr").join(" ");
	}
	renderCell(e) {
		if (e.render) return s`
				<div class="overflow-hidden text-ellipsis">
					<schmancy-typography align="${e.align || "left"}" maxLines="2" weight="${e.weight || "normal"}">
						${e.render(this.item)}
					</schmancy-typography>
				</div>
			`;
		let t = e.key ? this.item[e.key] : "";
		return s`
			<div class="overflow-hidden text-ellipsis">
				<schmancy-typography align="${e.align || "left"}" maxLines="2" weight="${e.weight || "normal"}">
					${t}
				</schmancy-typography>
			</div>
		`;
	}
	render() {
		return s`
			<schmancy-list-item class="w-full">
				<schmancy-grid .cols=${this.cols} align="center" gap="md">
					${this.columns.map((e) => this.renderCell(e))}
				</schmancy-grid>
			</schmancy-list-item>
		`;
	}
};
e([i({
	type: Array,
	attribute: !1
})], m.prototype, "columns", void 0), e([i({
	type: Object,
	attribute: !1
})], m.prototype, "item", void 0), e([i({ type: String })], m.prototype, "cols", void 0), m = e([r("schmancy-table-row")], m);
var h = class e extends Event {
	constructor(t) {
		super(e.eventName, { bubbles: !1 }), this.first = t.first, this.last = t.last;
	}
};
h.eventName = "rangeChanged";
var g = class e extends Event {
	constructor(t) {
		super(e.eventName, { bubbles: !1 }), this.first = t.first, this.last = t.last;
	}
};
g.eventName = "visibilityChanged";
var _ = class e extends Event {
	constructor() {
		super(e.eventName, { bubbles: !1 });
	}
};
_.eventName = "unpinned";
var v, y = class {
	constructor(e) {
		this._element = null;
		let t = e ?? window;
		this._node = t, e && (this._element = e);
	}
	get element() {
		return this._element || document.scrollingElement || document.documentElement;
	}
	get scrollTop() {
		return this.element.scrollTop || window.scrollY;
	}
	get scrollLeft() {
		return this.element.scrollLeft || window.scrollX;
	}
	get scrollHeight() {
		return this.element.scrollHeight;
	}
	get scrollWidth() {
		return this.element.scrollWidth;
	}
	get viewportHeight() {
		return this._element ? this._element.getBoundingClientRect().height : window.innerHeight;
	}
	get viewportWidth() {
		return this._element ? this._element.getBoundingClientRect().width : window.innerWidth;
	}
	get maxScrollTop() {
		return this.scrollHeight - this.viewportHeight;
	}
	get maxScrollLeft() {
		return this.scrollWidth - this.viewportWidth;
	}
}, b = class extends y {
	constructor(e, t) {
		super(t), this._clients = /* @__PURE__ */ new Set(), this._retarget = null, this._end = null, this.t = null, this.correctingScrollError = !1, this._checkForArrival = this._checkForArrival.bind(this), this._updateManagedScrollTo = this._updateManagedScrollTo.bind(this), this.scrollTo = this.scrollTo.bind(this), this.scrollBy = this.scrollBy.bind(this);
		let n = this._node;
		this._originalScrollTo = n.scrollTo, this._originalScrollBy = n.scrollBy, this._originalScroll = n.scroll, this._attach(e);
	}
	get _destination() {
		return this.t;
	}
	get scrolling() {
		return this._destination !== null;
	}
	scrollTo(e, t) {
		let n = typeof e == "number" && typeof t == "number" ? {
			left: e,
			top: t
		} : e;
		this._scrollTo(n);
	}
	scrollBy(e, t) {
		let n = typeof e == "number" && typeof t == "number" ? {
			left: e,
			top: t
		} : e;
		n.top !== void 0 && (n.top += this.scrollTop), n.left !== void 0 && (n.left += this.scrollLeft), this._scrollTo(n);
	}
	_nativeScrollTo(e) {
		this._originalScrollTo.bind(this._element || window)(e);
	}
	_scrollTo(e, t = null, n = null) {
		this._end !== null && this._end(), e.behavior === "smooth" ? (this._setDestination(e), this._retarget = t, this._end = n) : this._resetScrollState(), this._nativeScrollTo(e);
	}
	_setDestination(e) {
		let { top: t, left: n } = e;
		return t = t === void 0 ? void 0 : Math.max(0, Math.min(t, this.maxScrollTop)), n = n === void 0 ? void 0 : Math.max(0, Math.min(n, this.maxScrollLeft)), (this._destination === null || n !== this._destination.left || t !== this._destination.top) && (this.t = {
			top: t,
			left: n,
			behavior: "smooth"
		}, !0);
	}
	_resetScrollState() {
		this.t = null, this._retarget = null, this._end = null;
	}
	_updateManagedScrollTo(e) {
		this._destination && this._setDestination(e) && this._nativeScrollTo(this._destination);
	}
	managedScrollTo(e, t, n) {
		return this._scrollTo(e, t, n), this._updateManagedScrollTo;
	}
	correctScrollError(e) {
		this.correctingScrollError = !0, requestAnimationFrame(() => requestAnimationFrame(() => this.correctingScrollError = !1)), this._nativeScrollTo(e), this._retarget && this._setDestination(this._retarget()), this._destination && this._nativeScrollTo(this._destination);
	}
	_checkForArrival() {
		if (this._destination !== null) {
			let { scrollTop: e, scrollLeft: t } = this, { top: n, left: r } = this._destination;
			n = Math.min(n || 0, this.maxScrollTop), r = Math.min(r || 0, this.maxScrollLeft);
			let i = Math.abs(n - e), a = Math.abs(r - t);
			i < 1 && a < 1 && (this._end && this._end(), this._resetScrollState());
		}
	}
	detach(e) {
		return this._clients.delete(e), this._clients.size === 0 && (this._node.scrollTo = this._originalScrollTo, this._node.scrollBy = this._originalScrollBy, this._node.scroll = this._originalScroll, this._node.removeEventListener("scroll", this._checkForArrival)), null;
	}
	_attach(e) {
		this._clients.add(e), this._clients.size === 1 && (this._node.scrollTo = this.scrollTo, this._node.scrollBy = this.scrollBy, this._node.scroll = this.scrollTo, this._node.addEventListener("scroll", this._checkForArrival));
	}
}, x = typeof window < "u" ? window.ResizeObserver : void 0, S = Symbol("virtualizerRef"), C = "virtualizer-sizer", w = class {
	constructor(e) {
		if (this._benchmarkStart = null, this._layout = null, this._clippingAncestors = [], this._scrollSize = null, this._scrollError = null, this._childrenPos = null, this._childMeasurements = null, this._toBeMeasured = /* @__PURE__ */ new Map(), this._rangeChanged = !0, this._itemsChanged = !0, this._visibilityChanged = !0, this._scrollerController = null, this._isScroller = !1, this._sizer = null, this._hostElementRO = null, this._childrenRO = null, this._mutationObserver = null, this._scrollEventListeners = [], this._scrollEventListenerOptions = { passive: !0 }, this._loadListener = this._childLoaded.bind(this), this._scrollIntoViewTarget = null, this._updateScrollIntoViewCoordinates = null, this._items = [], this._first = -1, this._last = -1, this._firstVisible = -1, this._lastVisible = -1, this._scheduled = /* @__PURE__ */ new WeakSet(), this._measureCallback = null, this._measureChildOverride = null, this._layoutCompletePromise = null, this._layoutCompleteResolver = null, this._layoutCompleteRejecter = null, this._pendingLayoutComplete = null, this._layoutInitialized = null, this._connected = !1, !e) throw Error("Virtualizer constructor requires a configuration object");
		if (!e.hostElement) throw Error("Virtualizer configuration requires the \"hostElement\" property");
		this._init(e);
	}
	set items(e) {
		Array.isArray(e) && e !== this._items && (this._itemsChanged = !0, this._items = e, this._schedule(this._updateLayout));
	}
	_init(e) {
		this._isScroller = !!e.scroller, this._initHostElement(e);
		let t = e.layout || {};
		this._layoutInitialized = this._initLayout(t);
	}
	_initObservers() {
		this._mutationObserver = new MutationObserver(this._finishDOMUpdate.bind(this)), this._hostElementRO = new x(() => this._hostElementSizeChanged()), this._childrenRO = new x(this._childrenSizeChanged.bind(this));
	}
	_initHostElement(e) {
		let t = this._hostElement = e.hostElement;
		this._applyVirtualizerStyles(), t[S] = this;
	}
	connected() {
		this._initObservers();
		let e = this._isScroller;
		this._clippingAncestors = function(e, t = !1) {
			let n = !1;
			return function(e, t = !1) {
				let n = [], r = t ? e : E(e);
				for (; r !== null;) n.push(r), r = E(r);
				return n;
			}(e, t).filter((e) => {
				if (n) return !1;
				let t = getComputedStyle(e);
				return n = t.position === "fixed", t.overflow !== "visible";
			});
		}(this._hostElement, e), this._scrollerController = new b(this, this._clippingAncestors[0]), this._schedule(this._updateLayout), this._observeAndListen(), this._connected = !0;
	}
	_observeAndListen() {
		this._mutationObserver.observe(this._hostElement, { childList: !0 }), this._hostElementRO.observe(this._hostElement), this._scrollEventListeners.push(window), window.addEventListener("scroll", this, this._scrollEventListenerOptions), this._clippingAncestors.forEach((e) => {
			e.addEventListener("scroll", this, this._scrollEventListenerOptions), this._scrollEventListeners.push(e), this._hostElementRO.observe(e);
		}), this._hostElementRO.observe(this._scrollerController.element), this._children.forEach((e) => this._childrenRO.observe(e)), this._scrollEventListeners.forEach((e) => e.addEventListener("scroll", this, this._scrollEventListenerOptions));
	}
	disconnected() {
		this._scrollEventListeners.forEach((e) => e.removeEventListener("scroll", this, this._scrollEventListenerOptions)), this._scrollEventListeners = [], this._clippingAncestors = [], this._scrollerController?.detach(this), this._scrollerController = null, this._mutationObserver?.disconnect(), this._mutationObserver = null, this._hostElementRO?.disconnect(), this._hostElementRO = null, this._childrenRO?.disconnect(), this._childrenRO = null, this._rejectLayoutCompletePromise("disconnected"), this._connected = !1;
	}
	_applyVirtualizerStyles() {
		let e = this._hostElement.style;
		e.display = e.display || "block", e.position = e.position || "relative", e.contain = e.contain || "size layout", this._isScroller && (e.overflow = e.overflow || "auto", e.minHeight = e.minHeight || "150px");
	}
	_getSizer() {
		let e = this._hostElement;
		if (!this._sizer) {
			let t = e.querySelector(`[${C}]`);
			t || (t = document.createElement("div"), t.setAttribute(C, ""), e.appendChild(t)), Object.assign(t.style, {
				position: "absolute",
				margin: "-2px 0 0 0",
				padding: 0,
				visibility: "hidden",
				fontSize: "2px"
			}), t.textContent = "&nbsp;", t.setAttribute(C, ""), this._sizer = t;
		}
		return this._sizer;
	}
	async updateLayoutConfig(e) {
		await this._layoutInitialized;
		let t = e.type || v;
		if (typeof t == "function" && this._layout instanceof t) {
			let t = { ...e };
			return delete t.type, this._layout.config = t, !0;
		}
		return !1;
	}
	async _initLayout(e) {
		let t, n;
		if (typeof e.type == "function") {
			n = e.type;
			let r = { ...e };
			delete r.type, t = r;
		} else t = e;
		n === void 0 && (v = n = (await import("./flow-BPDtbhLe.js")).FlowLayout), this._layout = new n((e) => this._handleLayoutMessage(e), t), this._layout.measureChildren && typeof this._layout.updateItemSizes == "function" && (typeof this._layout.measureChildren == "function" && (this._measureChildOverride = this._layout.measureChildren), this._measureCallback = this._layout.updateItemSizes.bind(this._layout)), this._layout.listenForChildLoadEvents && this._hostElement.addEventListener("load", this._loadListener, !0), this._schedule(this._updateLayout);
	}
	startBenchmarking() {
		this._benchmarkStart === null && (this._benchmarkStart = window.performance.now());
	}
	stopBenchmarking() {
		if (this._benchmarkStart !== null) {
			let e = window.performance.now(), t = e - this._benchmarkStart, n = performance.getEntriesByName("uv-virtualizing", "measure").filter((t) => t.startTime >= this._benchmarkStart && t.startTime < e).reduce((e, t) => e + t.duration, 0);
			return this._benchmarkStart = null, {
				timeElapsed: t,
				virtualizationTime: n
			};
		}
		return null;
	}
	_measureChildren() {
		let e = {}, t = this._children, n = this._measureChildOverride || this._measureChild;
		for (let r = 0; r < t.length; r++) {
			let i = t[r], a = this._first + r;
			(this._itemsChanged || this._toBeMeasured.has(i)) && (e[a] = n.call(this, i, this._items[a]));
		}
		this._childMeasurements = e, this._schedule(this._updateLayout), this._toBeMeasured.clear();
	}
	_measureChild(e) {
		let { width: t, height: n } = e.getBoundingClientRect();
		return Object.assign({
			width: t,
			height: n
		}, function(e) {
			let t = window.getComputedStyle(e);
			return {
				marginTop: T(t.marginTop),
				marginRight: T(t.marginRight),
				marginBottom: T(t.marginBottom),
				marginLeft: T(t.marginLeft)
			};
		}(e));
	}
	async _schedule(e) {
		this._scheduled.has(e) || (this._scheduled.add(e), await Promise.resolve(), this._scheduled.delete(e), e.call(this));
	}
	async _updateDOM(e) {
		this._scrollSize = e.scrollSize, this._adjustRange(e.range), this._childrenPos = e.childPositions, this._scrollError = e.scrollError || null;
		let { _rangeChanged: t, _itemsChanged: n } = this;
		this._visibilityChanged &&= (this._notifyVisibility(), !1), (t || n) && (this._notifyRange(), this._rangeChanged = !1), this._finishDOMUpdate();
	}
	_finishDOMUpdate() {
		this._connected && (this._children.forEach((e) => this._childrenRO.observe(e)), this._checkScrollIntoViewTarget(this._childrenPos), this._positionChildren(this._childrenPos), this._sizeHostElement(this._scrollSize), this._correctScrollError(), this._benchmarkStart && "mark" in window.performance && window.performance.mark("uv-end"));
	}
	_updateLayout() {
		this._layout && this._connected && (this._layout.items = this._items, this._updateView(), this._childMeasurements !== null && (this._measureCallback && this._measureCallback(this._childMeasurements), this._childMeasurements = null), this._layout.reflowIfNeeded(), this._benchmarkStart && "mark" in window.performance && window.performance.mark("uv-end"));
	}
	_handleScrollEvent() {
		if (this._benchmarkStart && "mark" in window.performance) {
			try {
				window.performance.measure("uv-virtualizing", "uv-start", "uv-end");
			} catch {}
			window.performance.mark("uv-start");
		}
		!1 === this._scrollerController.correctingScrollError && this._layout?.unpin(), this._schedule(this._updateLayout);
	}
	handleEvent(e) {
		e.type === "scroll" && (e.currentTarget === window || this._clippingAncestors.includes(e.currentTarget)) && this._handleScrollEvent();
	}
	_handleLayoutMessage(e) {
		e.type === "stateChanged" ? this._updateDOM(e) : e.type === "visibilityChanged" ? (this._firstVisible = e.firstVisible, this._lastVisible = e.lastVisible, this._notifyVisibility()) : e.type === "unpinned" && this._hostElement.dispatchEvent(new _());
	}
	get _children() {
		let e = [], t = this._hostElement.firstElementChild;
		for (; t;) t.hasAttribute(C) || e.push(t), t = t.nextElementSibling;
		return e;
	}
	_updateView() {
		let e = this._hostElement, t = this._scrollerController?.element, n = this._layout;
		if (e && t && n) {
			let r, i, a, o, s = e.getBoundingClientRect();
			r = 0, i = 0, a = window.innerHeight, o = window.innerWidth;
			let c = this._clippingAncestors.map((e) => e.getBoundingClientRect());
			c.unshift(s);
			for (let e of c) r = Math.max(r, e.top), i = Math.max(i, e.left), a = Math.min(a, e.bottom), o = Math.min(o, e.right);
			let l = t.getBoundingClientRect(), u = {
				left: s.left - l.left,
				top: s.top - l.top
			}, d = {
				width: t.scrollWidth,
				height: t.scrollHeight
			}, f = r - s.top + e.scrollTop, p = i - s.left + e.scrollLeft, m = Math.max(0, a - r);
			n.viewportSize = {
				width: Math.max(0, o - i),
				height: m
			}, n.viewportScroll = {
				top: f,
				left: p
			}, n.totalScrollSize = d, n.offsetWithinScroller = u;
		}
	}
	_sizeHostElement(e) {
		let t = 82e5, n = e && e.width !== null ? Math.min(t, e.width) : 0, r = e && e.height !== null ? Math.min(t, e.height) : 0;
		if (this._isScroller) this._getSizer().style.transform = `translate(${n}px, ${r}px)`;
		else {
			let e = this._hostElement.style;
			e.minWidth = n ? `${n}px` : "100%", e.minHeight = r ? `${r}px` : "100%";
		}
	}
	_positionChildren(e) {
		e && e.forEach(({ top: e, left: t, width: n, height: r, xOffset: i, yOffset: a }, o) => {
			let s = this._children[o - this._first];
			s && (s.style.position = "absolute", s.style.boxSizing = "border-box", s.style.transform = `translate(${t}px, ${e}px)`, n !== void 0 && (s.style.width = n + "px"), r !== void 0 && (s.style.height = r + "px"), s.style.left = i === void 0 ? null : i + "px", s.style.top = a === void 0 ? null : a + "px");
		});
	}
	async _adjustRange(e) {
		let { _first: t, _last: n, _firstVisible: r, _lastVisible: i } = this;
		this._first = e.first, this._last = e.last, this._firstVisible = e.firstVisible, this._lastVisible = e.lastVisible, this._rangeChanged = this._rangeChanged || this._first !== t || this._last !== n, this._visibilityChanged = this._visibilityChanged || this._firstVisible !== r || this._lastVisible !== i;
	}
	_correctScrollError() {
		if (this._scrollError) {
			let { scrollTop: e, scrollLeft: t } = this._scrollerController, { top: n, left: r } = this._scrollError;
			this._scrollError = null, this._scrollerController.correctScrollError({
				top: e - n,
				left: t - r
			});
		}
	}
	element(e) {
		return e === Infinity && (e = this._items.length - 1), this._items?.[e] === void 0 ? void 0 : { scrollIntoView: (t = {}) => this._scrollElementIntoView({
			...t,
			index: e
		}) };
	}
	_scrollElementIntoView(e) {
		if (e.index >= this._first && e.index <= this._last) this._children[e.index - this._first].scrollIntoView(e);
		else if (e.index = Math.min(e.index, this._items.length - 1), e.behavior === "smooth") {
			let t = this._layout.getScrollIntoViewCoordinates(e), { behavior: n } = e;
			this._updateScrollIntoViewCoordinates = this._scrollerController.managedScrollTo(Object.assign(t, { behavior: n }), () => this._layout.getScrollIntoViewCoordinates(e), () => this._scrollIntoViewTarget = null), this._scrollIntoViewTarget = e;
		} else this._layout.pin = e;
	}
	_checkScrollIntoViewTarget(e) {
		let { index: t } = this._scrollIntoViewTarget || {};
		t && e?.has(t) && this._updateScrollIntoViewCoordinates(this._layout.getScrollIntoViewCoordinates(this._scrollIntoViewTarget));
	}
	_notifyRange() {
		this._hostElement.dispatchEvent(new h({
			first: this._first,
			last: this._last
		}));
	}
	_notifyVisibility() {
		this._hostElement.dispatchEvent(new g({
			first: this._firstVisible,
			last: this._lastVisible
		}));
	}
	get layoutComplete() {
		return this._layoutCompletePromise ||= new Promise((e, t) => {
			this._layoutCompleteResolver = e, this._layoutCompleteRejecter = t;
		}), this._layoutCompletePromise;
	}
	_rejectLayoutCompletePromise(e) {
		this._layoutCompleteRejecter !== null && this._layoutCompleteRejecter(e), this._resetLayoutCompleteState();
	}
	_scheduleLayoutComplete() {
		this._layoutCompletePromise && this._pendingLayoutComplete === null && (this._pendingLayoutComplete = requestAnimationFrame(() => requestAnimationFrame(() => this._resolveLayoutCompletePromise())));
	}
	_resolveLayoutCompletePromise() {
		this._layoutCompleteResolver !== null && this._layoutCompleteResolver(), this._resetLayoutCompleteState();
	}
	_resetLayoutCompleteState() {
		this._layoutCompletePromise = null, this._layoutCompleteResolver = null, this._layoutCompleteRejecter = null, this._pendingLayoutComplete = null;
	}
	_hostElementSizeChanged() {
		this._schedule(this._updateLayout);
	}
	_childLoaded() {}
	_childrenSizeChanged(e) {
		if (this._layout?.measureChildren) {
			for (let t of e) this._toBeMeasured.set(t.target, t.contentRect);
			this._measureChildren();
		}
		this._scheduleLayoutComplete(), this._itemsChanged = !1, this._rangeChanged = !1;
	}
};
function T(e) {
	let t = e ? parseFloat(e) : NaN;
	return Number.isNaN(t) ? 0 : t;
}
function E(e) {
	if (e.assignedSlot !== null) return e.assignedSlot;
	if (e.parentElement !== null) return e.parentElement;
	let t = e.parentNode;
	return t && t.nodeType === Node.DOCUMENT_FRAGMENT_NODE && t.host || null;
}
var D = (e) => e, O = (e, t) => s`${t}: ${JSON.stringify(e, null, 2)}`, k = f(class extends u {
	constructor(e) {
		if (super(e), this._virtualizer = null, this._first = 0, this._last = -1, this._renderItem = (e, t) => O(e, t + this._first), this._keyFunction = (e, t) => D(e, this._first), this._items = [], e.type !== d.CHILD) throw Error("The virtualize directive can only be used in child expressions");
	}
	render(e) {
		e && this._setFunctions(e);
		let t = [];
		if (this._first >= 0 && this._last >= this._first) for (let e = this._first; e <= this._last; e++) t.push(this._items[e]);
		return l(t, this._keyFunction, this._renderItem);
	}
	update(e, [t]) {
		this._setFunctions(t);
		let n = this._items !== t.items;
		return this._items = t.items || [], this._virtualizer ? this._updateVirtualizerConfig(e, t) : this._initialize(e, t), n ? c : this.render();
	}
	async _updateVirtualizerConfig(e, t) {
		if (!await this._virtualizer.updateLayoutConfig(t.layout || {})) {
			let n = e.parentNode;
			this._makeVirtualizer(n, t);
		}
		this._virtualizer.items = this._items;
	}
	_setFunctions(e) {
		let { renderItem: t, keyFunction: n } = e;
		t && (this._renderItem = (e, n) => t(e, n + this._first)), n && (this._keyFunction = (e, t) => n(e, t + this._first));
	}
	_makeVirtualizer(e, t) {
		this._virtualizer && this._virtualizer.disconnected();
		let { layout: n, scroller: r, items: i } = t;
		this._virtualizer = new w({
			hostElement: e,
			layout: n,
			scroller: r
		}), this._virtualizer.items = i, this._virtualizer.connected();
	}
	_initialize(e, t) {
		let n = e.parentNode;
		n && n.nodeType === 1 && (n.addEventListener("rangeChanged", (e) => {
			this._first = e.first, this._last = e.last, this.setValue(this.render());
		}), this._makeVirtualizer(n, t));
	}
	disconnected() {
		this._virtualizer?.disconnected();
	}
	reconnected() {
		this._virtualizer?.connected();
	}
}), A = class extends o {
	constructor() {
		super(...arguments), this.items = [], this.renderItem = O, this.keyFunction = D, this.layout = {}, this.scroller = !1;
	}
	createRenderRoot() {
		return this;
	}
	render() {
		let { items: e, renderItem: t, keyFunction: n, layout: r, scroller: i } = this;
		return s`${k({
			items: e,
			renderItem: t,
			keyFunction: n,
			layout: r,
			scroller: i
		})}`;
	}
	element(e) {
		return this[S]?.element(e);
	}
	get layoutComplete() {
		return this[S]?.layoutComplete;
	}
	scrollToIndex(e, t = "start") {
		this.element(e)?.scrollIntoView({ block: t });
	}
};
n([p({ attribute: !1 })], A.prototype, "items", void 0), n([p()], A.prototype, "renderItem", void 0), n([p()], A.prototype, "keyFunction", void 0), n([p({ attribute: !1 })], A.prototype, "layout", void 0), n([p({
	reflect: !0,
	type: Boolean
})], A.prototype, "scroller", void 0), customElements.define("lit-virtualizer", A);
var j = class extends t() {
	constructor() {
		super(), this.columns = [], this.data = [], this.keyField = "id", this.cols = "1fr", this.sortable = !1, this.sortColumn = null, this.sortDirection = null, this.filteredData = [], this.filteredData = this.data;
	}
	willUpdate(e) {
		(e.has("data") || e.has("sortColumn") || e.has("sortDirection")) && this.processData();
	}
	isDate(e) {
		return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
	}
	processData() {
		let e = [...this.data];
		if (this.sortable && this.sortColumn && this.sortDirection) {
			let t = this.columns.find((e) => e.key === this.sortColumn);
			e.sort((e, n) => {
				let r, i;
				if (t && t.value ? (r = t.value(e), i = t.value(n)) : (r = e[this.sortColumn], i = n[this.sortColumn]), r == null) return this.sortDirection === "asc" ? 1 : -1;
				if (i == null) return this.sortDirection === "asc" ? -1 : 1;
				if (typeof r == "number" && typeof i == "number") return this.sortDirection === "asc" ? r - i : i - r;
				let a = typeof r == "string" && !isNaN(Number(r)), o = typeof i == "string" && !isNaN(Number(i));
				if (a && o) {
					let e = parseFloat(r), t = parseFloat(i);
					return this.sortDirection === "asc" ? e - t : t - e;
				}
				if (this.isDate(r) && this.isDate(i)) return this.sortDirection === "asc" ? r.getTime() - i.getTime() : i.getTime() - r.getTime();
				let s = String(r), c = String(i);
				return this.sortDirection === "asc" ? s.localeCompare(c) : c.localeCompare(s);
			});
		}
		this.filteredData = e;
	}
	toggleSort(e) {
		if (!e.key || !1 === e.sortable) return;
		let t = e.key;
		t === this.sortColumn ? this.sortDirection === "asc" ? this.sortDirection = "desc" : this.sortDirection === "desc" ? this.sortDirection = null : this.sortDirection = "asc" : (this.sortColumn = t, this.sortDirection = "asc"), this.dispatchEvent(new CustomEvent("sort-change", {
			detail: {
				column: this.sortColumn,
				direction: this.sortDirection
			},
			bubbles: !0,
			composed: !0
		}));
	}
	renderSortIndicator(e) {
		return this.sortable && !1 !== e.sortable && e.key && e.key === this.sortColumn ? s`
			<span class="ml-1">
				${this.sortDirection === "asc" ? s`<schmancy-icon size="16px">arrow_upward</schmancy-icon>` : this.sortDirection === "desc" ? s`<schmancy-icon size="16px">arrow_downward</schmancy-icon>` : null}
			</span>
		` : null;
	}
	render() {
		let e = (e) => ({
			"flex items-center": !0,
			"cursor-pointer gap-1": this.sortable && !1 !== e.sortable && e.key
		});
		return s`
			<schmancy-grid class="h-full w-full" cols="1fr" rows="auto 1fr">
				<schmancy-surface rounded="top" elevation="1" type="glass" class="sticky top-0 z-10">
					<schmancy-grid align="center" class="px-4 py-3" .cols=${this.cols} gap="md" rows="1fr">
						${this.columns.map((t) => s`
								<div
									class=${this.classMap(e(t))}
									@click=${() => this.sortable && !1 !== t.sortable ? this.toggleSort(t) : null}
								>
									<schmancy-typography align=${t.align ?? "left"} weight=${t.weight ?? "bold"}>
										${t.name}
									</schmancy-typography>
									${this.renderSortIndicator(t)}
								</div>
							`)}
					</schmancy-grid>
				</schmancy-surface>

				${this.filteredData.length > 0 ? s`
							<lit-virtualizer
								scroller
								class="w-full h-full relative overflow-auto"
								.items=${this.filteredData}
								.keyFunction=${(e, t) => {
			let n = e?.[this.keyField];
			return n == null ? t : typeof n == "string" || typeof n == "number" ? n : String(n);
		}}
								.renderItem=${(e, t) => s`
										<schmancy-table-row
											class="w-full border-b border-solid border-outlineVariant"
											.columns=${this.columns}
											.item=${e}
											cols=${this.cols}
											@click=${() => {
			let n = {
				item: e,
				index: t
			};
			this.dispatchEvent(new CustomEvent("click", {
				detail: n,
				bubbles: !0,
				composed: !0
			}));
		}}
										></schmancy-table-row>
									`}
							></lit-virtualizer>
						` : s`
							<div class="flex items-center justify-center w-full h-full p-8 text-center">
								<schmancy-typography type="body" token="lg"> No data available </schmancy-typography>
							</div>
						`}
			</schmancy-grid>
		`;
	}
};
e([i({
	type: Array,
	attribute: !1
})], j.prototype, "columns", void 0), e([i({
	type: Array,
	attribute: !1
})], j.prototype, "data", void 0), e([i({ type: String })], j.prototype, "keyField", void 0), e([i({ type: String })], j.prototype, "cols", void 0), e([i({ type: Boolean })], j.prototype, "sortable", void 0), e([a()], j.prototype, "sortColumn", void 0), e([a()], j.prototype, "sortDirection", void 0), e([a()], j.prototype, "filteredData", void 0), j = e([r("schmancy-table")], j);
export { m as n, j as t };
