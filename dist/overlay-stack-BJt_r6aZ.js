var e = class e {
	constructor() {
		this.counter = 0, this.BASE_Z_INDEX = 1e4, this.idMap = /* @__PURE__ */ new Map();
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
	getNextZIndex() {
		return this.counter++, this.BASE_Z_INDEX + this.counter;
	}
	release() {
		this.counter = Math.max(0, this.counter - 1);
	}
	get activeCount() {
		return this.counter;
	}
	assignZIndex(e) {
		let t = this.idMap.get(e);
		if (t !== void 0) return t;
		this.counter++;
		let n = this.BASE_Z_INDEX + this.counter;
		return this.idMap.set(e, n), n;
	}
	bringToFront(e) {
		this.counter++;
		let t = this.BASE_Z_INDEX + this.counter;
		return this.idMap.set(e, t), t;
	}
	releaseId(e) {
		this.idMap.delete(e);
	}
	getZIndex(e) {
		return this.idMap.get(e);
	}
	getStackOrder() {
		return [...this.idMap.entries()].sort(([, e], [, t]) => e - t).map(([e]) => e);
	}
}.getInstance();
export { e as t };
