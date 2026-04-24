import { n as e, r as t, t as n } from "./rolldown-runtime-BIIoCavz.js";
var r = n((e, t) => {
	function n(e) {
		return e instanceof Map ? e.clear = e.delete = e.set = function() {
			throw Error("map is read-only");
		} : e instanceof Set && (e.add = e.clear = e.delete = function() {
			throw Error("set is read-only");
		}), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((t) => {
			let r = e[t], i = typeof r;
			i !== "object" && i !== "function" || Object.isFrozen(r) || n(r);
		}), e;
	}
	var r = class {
		constructor(e) {
			e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function a(e, ...t) {
		let n = Object.create(null);
		for (let t in e) n[t] = e[t];
		return t.forEach(function(e) {
			for (let t in e) n[t] = e[t];
		}), n;
	}
	var o = (e) => !!e.scope, s = class {
		constructor(e, t) {
			this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
		}
		addText(e) {
			this.buffer += i(e);
		}
		openNode(e) {
			if (!o(e)) return;
			let t = ((e, { prefix: t }) => {
				if (e.startsWith("language:")) return e.replace("language:", "language-");
				if (e.includes(".")) {
					let n = e.split(".");
					return [`${t}${n.shift()}`, ...n.map((e, t) => `${e}${"_".repeat(t + 1)}`)].join(" ");
				}
				return `${t}${e}`;
			})(e.scope, { prefix: this.classPrefix });
			this.span(t);
		}
		closeNode(e) {
			o(e) && (this.buffer += "</span>");
		}
		value() {
			return this.buffer;
		}
		span(e) {
			this.buffer += `<span class="${e}">`;
		}
	}, c = (e = {}) => {
		let t = { children: [] };
		return Object.assign(t, e), t;
	}, l = class e {
		constructor() {
			this.rootNode = c(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		add(e) {
			this.top.children.push(e);
		}
		openNode(e) {
			let t = c({ scope: e });
			this.add(t), this.stack.push(t);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		walk(e) {
			return this.constructor._walk(e, this.rootNode);
		}
		static _walk(e, t) {
			return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((t) => this._walk(e, t)), e.closeNode(t)), e;
		}
		static _collapse(t) {
			typeof t != "string" && t.children && (t.children.every((e) => typeof e == "string") ? t.children = [t.children.join("")] : t.children.forEach((t) => {
				e._collapse(t);
			}));
		}
	}, u = class extends l {
		constructor(e) {
			super(), this.options = e;
		}
		addText(e) {
			e !== "" && this.add(e);
		}
		startScope(e) {
			this.openNode(e);
		}
		endScope() {
			this.closeNode();
		}
		t(e, t) {
			let n = e.root;
			t && (n.scope = `language:${t}`), this.add(n);
		}
		toHTML() {
			return new s(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function d(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function f(e) {
		return h("(?=", e, ")");
	}
	function p(e) {
		return h("(?:", e, ")*");
	}
	function m(e) {
		return h("(?:", e, ")?");
	}
	function h(...e) {
		return e.map((e) => d(e)).join("");
	}
	function g(...e) {
		return "(" + (function(e) {
			let t = e[e.length - 1];
			return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
		}(e).capture ? "" : "?:") + e.map((e) => d(e)).join("|") + ")";
	}
	function _(e) {
		return RegExp(e.toString() + "|").exec("").length - 1;
	}
	var v = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
	function y(e, { joinWith: t }) {
		let n = 0;
		return e.map((e) => {
			n += 1;
			let t = n, r = d(e), i = "";
			for (; r.length > 0;) {
				let e = v.exec(r);
				if (!e) {
					i += r;
					break;
				}
				i += r.substring(0, e.index), r = r.substring(e.index + e[0].length), e[0][0] === "\\" && e[1] ? i += "\\" + String(Number(e[1]) + t) : (i += e[0], e[0] === "(" && n++);
			}
			return i;
		}).map((e) => `(${e})`).join(t);
	}
	var b = "[a-zA-Z]\\w*", x = "[a-zA-Z_]\\w*", S = "\\b\\d+(\\.\\d+)?", C = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", w = "\\b(0b[01]+)", T = {
		begin: "\\\\[\\s\\S]",
		relevance: 0
	}, E = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\n",
		contains: [T]
	}, D = {
		scope: "string",
		begin: "\"",
		end: "\"",
		illegal: "\\n",
		contains: [T]
	}, O = function(e, t, n = {}) {
		let r = a({
			scope: "comment",
			begin: e,
			end: t,
			contains: []
		}, n);
		r.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		let i = g("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return r.contains.push({ begin: h(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), r;
	}, k = O("//", "$"), A = O("/\\*", "\\*/"), j = O("#", "$"), M = {
		scope: "number",
		begin: S,
		relevance: 0
	}, N = {
		scope: "number",
		begin: C,
		relevance: 0
	}, P = {
		scope: "number",
		begin: w,
		relevance: 0
	}, F = {
		scope: "regexp",
		begin: /\/(?=[^/\n]*\/)/,
		end: /\/[gimuy]*/,
		contains: [T, {
			begin: /\[/,
			end: /\]/,
			relevance: 0,
			contains: [T]
		}]
	}, ee = {
		scope: "title",
		begin: b,
		relevance: 0
	}, te = {
		scope: "title",
		begin: x,
		relevance: 0
	}, ne = {
		begin: "\\.\\s*" + x,
		relevance: 0
	}, I = Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: E,
		BACKSLASH_ESCAPE: T,
		BINARY_NUMBER_MODE: P,
		BINARY_NUMBER_RE: w,
		COMMENT: O,
		C_BLOCK_COMMENT_MODE: A,
		C_LINE_COMMENT_MODE: k,
		C_NUMBER_MODE: N,
		C_NUMBER_RE: C,
		END_SAME_AS_BEGIN: function(e) {
			return Object.assign(e, {
				"on:begin": (e, t) => {
					t.data._beginMatch = e[1];
				},
				"on:end": (e, t) => {
					t.data._beginMatch !== e[1] && t.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: j,
		IDENT_RE: b,
		MATCH_NOTHING_RE: /\b\B/,
		METHOD_GUARD: ne,
		NUMBER_MODE: M,
		NUMBER_RE: S,
		PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ },
		QUOTE_STRING_MODE: D,
		REGEXP_MODE: F,
		RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
		SHEBANG: (e = {}) => {
			let t = /^#![ ]*\//;
			return e.binary && (e.begin = h(t, /.*\b/, e.binary, /\b.*/)), a({
				scope: "meta",
				begin: t,
				end: /$/,
				relevance: 0,
				"on:begin": (e, t) => {
					e.index !== 0 && t.ignoreMatch();
				}
			}, e);
		},
		TITLE_MODE: ee,
		UNDERSCORE_IDENT_RE: x,
		UNDERSCORE_TITLE_MODE: te
	});
	function re(e, t) {
		e.input[e.index - 1] === "." && t.ignoreMatch();
	}
	function L(e, t) {
		e.className !== void 0 && (e.scope = e.className, delete e.className);
	}
	function R(e, t) {
		t && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.i = re, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0));
	}
	function z(e, t) {
		Array.isArray(e.illegal) && (e.illegal = g(...e.illegal));
	}
	function B(e, t) {
		if (e.match) {
			if (e.begin || e.end) throw Error("begin & end are not supported with match");
			e.begin = e.match, delete e.match;
		}
	}
	function V(e, t) {
		e.relevance === void 0 && (e.relevance = 1);
	}
	var H = (e, t) => {
		if (!e.beforeMatch) return;
		if (e.starts) throw Error("beforeMatch cannot be used with starts");
		let n = Object.assign({}, e);
		Object.keys(e).forEach((t) => {
			delete e[t];
		}), e.keywords = n.keywords, e.begin = h(n.beforeMatch, f(n.begin)), e.starts = {
			relevance: 0,
			contains: [Object.assign(n, { endsParent: !0 })]
		}, e.relevance = 0, delete n.beforeMatch;
	}, ie = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	];
	function U(e, t, n = "keyword") {
		let r = Object.create(null);
		return typeof e == "string" ? i(n, e.split(" ")) : Array.isArray(e) ? i(n, e) : Object.keys(e).forEach(function(n) {
			Object.assign(r, U(e[n], t, n));
		}), r;
		function i(e, n) {
			t && (n = n.map((e) => e.toLowerCase())), n.forEach(function(t) {
				let n = t.split("|");
				r[n[0]] = [e, ae(n[0], n[1])];
			});
		}
	}
	function ae(e, t) {
		return t ? Number(t) : +!function(e) {
			return ie.includes(e.toLowerCase());
		}(e);
	}
	var W = {}, G = (e, t) => {
		W[`${e}/${t}`] || (W[`${e}/${t}`] = !0);
	}, K = /* @__PURE__ */ Error();
	function q(e, t, { key: n }) {
		let r = 0, i = e[n], a = {}, o = {};
		for (let e = 1; e <= t.length; e++) o[e + r] = i[e], a[e + r] = !0, r += _(t[e - 1]);
		e[n] = o, e[n]._emit = a, e[n]._multi = !0;
	}
	function oe(e) {
		(function(e) {
			e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
		})(e), typeof e.beginScope == "string" && (e.beginScope = { _wrap: e.beginScope }), typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }), function(e) {
			if (Array.isArray(e.begin)) {
				if (e.skip || e.excludeBegin || e.returnBegin || typeof e.beginScope != "object" || e.beginScope === null) throw K;
				q(e, e.begin, { key: "beginScope" }), e.begin = y(e.begin, { joinWith: "" });
			}
		}(e), function(e) {
			if (Array.isArray(e.end)) {
				if (e.skip || e.excludeEnd || e.returnEnd || typeof e.endScope != "object" || e.endScope === null) throw K;
				q(e, e.end, { key: "endScope" }), e.end = y(e.end, { joinWith: "" });
			}
		}(e);
	}
	function se(e) {
		function t(t, n) {
			return new RegExp(d(t), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (n ? "g" : ""));
		}
		class n {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(e, t) {
				t.position = this.position++, this.matchIndexes[this.matchAt] = t, this.regexes.push([t, e]), this.matchAt += _(e) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				let e = this.regexes.map((e) => e[1]);
				this.matcherRe = t(y(e, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			exec(e) {
				this.matcherRe.lastIndex = this.lastIndex;
				let t = this.matcherRe.exec(e);
				if (!t) return null;
				let n = t.findIndex((e, t) => t > 0 && e !== void 0), r = this.matchIndexes[n];
				return t.splice(0, n), Object.assign(t, r);
			}
		}
		class r {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(e) {
				if (this.multiRegexes[e]) return this.multiRegexes[e];
				let t = new n();
				return this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)), t.compile(), this.multiRegexes[e] = t, t;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(e, t) {
				this.rules.push([e, t]), t.type === "begin" && this.count++;
			}
			exec(e) {
				let t = this.getMatcher(this.regexIndex);
				t.lastIndex = this.lastIndex;
				let n = t.exec(e);
				if (this.resumingScanAtSamePosition() && !(n && n.index === this.lastIndex)) {
					let t = this.getMatcher(0);
					t.lastIndex = this.lastIndex + 1, n = t.exec(e);
				}
				return n && (this.regexIndex += n.position + 1, this.regexIndex === this.count && this.considerAll()), n;
			}
		}
		if (e.compilerExtensions ||= [], e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
		return e.classNameAliases = a(e.classNameAliases || {}), function n(i, o) {
			let s = i;
			if (i.isCompiled) return s;
			[
				L,
				B,
				oe,
				H
			].forEach((e) => e(i, o)), e.compilerExtensions.forEach((e) => e(i, o)), i.i = null, [
				R,
				z,
				V
			].forEach((e) => e(i, o)), i.isCompiled = !0;
			let c = null;
			return typeof i.keywords == "object" && i.keywords.$pattern && (i.keywords = Object.assign({}, i.keywords), c = i.keywords.$pattern, delete i.keywords.$pattern), c ||= /\w+/, i.keywords &&= U(i.keywords, e.case_insensitive), s.keywordPatternRe = t(c, !0), o && (i.begin ||= /\B|\b/, s.beginRe = t(s.begin), i.end || i.endsWithParent || (i.end = /\B|\b/), i.end && (s.endRe = t(s.end)), s.terminatorEnd = d(s.end) || "", i.endsWithParent && o.terminatorEnd && (s.terminatorEnd += (i.end ? "|" : "") + o.terminatorEnd)), i.illegal && (s.illegalRe = t(i.illegal)), i.contains ||= [], i.contains = [].concat(...i.contains.map(function(e) {
				return function(e) {
					return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(t) {
						return a(e, { variants: null }, t);
					})), e.cachedVariants ? e.cachedVariants : J(e) ? a(e, { starts: e.starts ? a(e.starts) : null }) : Object.isFrozen(e) ? a(e) : e;
				}(e === "self" ? i : e);
			})), i.contains.forEach(function(e) {
				n(e, s);
			}), i.starts && n(i.starts, o), s.matcher = function(e) {
				let t = new r();
				return e.contains.forEach((e) => t.addRule(e.begin, {
					rule: e,
					type: "begin"
				})), e.terminatorEnd && t.addRule(e.terminatorEnd, { type: "end" }), e.illegal && t.addRule(e.illegal, { type: "illegal" }), t;
			}(s), s;
		}(e);
	}
	function J(e) {
		return !!e && (e.endsWithParent || J(e.starts));
	}
	var ce = class extends Error {
		constructor(e, t) {
			super(e), this.name = "HTMLInjectionError", this.html = t;
		}
	}, Y = i, X = a, Z = Symbol("nomatch"), Q = function(e) {
		let t = Object.create(null), i = Object.create(null), a = [], o = !0, s = "Could not find the language '{}', did you forget to load/include a language module?", c = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		}, l = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			o: u
		};
		function d(e) {
			return l.noHighlightRe.test(e);
		}
		function _(e, t, n) {
			let r = "", i = "";
			typeof t == "object" ? (r = e, n = t.ignoreIllegals, i = t.language) : (G("10.7.0", "highlight(lang, code, ...args) has been deprecated."), G("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i = e, r = t), n === void 0 && (n = !0);
			let a = {
				code: r,
				language: i
			};
			E("before:highlight", a);
			let o = a.result ? a.result : v(a.language, a.code, n);
			return o.code = a.code, E("after:highlight", o), o;
		}
		function v(e, n, i, a) {
			let c = Object.create(null);
			function u(e, t) {
				return e.keywords[t];
			}
			function d() {
				if (!D.keywords) return void k.addText(A);
				let e = 0;
				D.keywordPatternRe.lastIndex = 0;
				let t = D.keywordPatternRe.exec(A), n = "";
				for (; t;) {
					n += A.substring(e, t.index);
					let r = w.case_insensitive ? t[0].toLowerCase() : t[0], i = u(D, r);
					if (i) {
						let [e, a] = i;
						if (k.addText(n), n = "", c[r] = (c[r] || 0) + 1, c[r] <= 7 && (j += a), e.startsWith("_")) n += t[0];
						else {
							let n = w.classNameAliases[e] || e;
							p(t[0], n);
						}
					} else n += t[0];
					e = D.keywordPatternRe.lastIndex, t = D.keywordPatternRe.exec(A);
				}
				n += A.substring(e), k.addText(n);
			}
			function f() {
				D.subLanguage == null ? d() : function() {
					if (A === "") return;
					let e = null;
					if (typeof D.subLanguage == "string") {
						if (!t[D.subLanguage]) return void k.addText(A);
						e = v(D.subLanguage, A, !0, O[D.subLanguage]), O[D.subLanguage] = e._top;
					} else e = y(A, D.subLanguage.length ? D.subLanguage : null);
					D.relevance > 0 && (j += e.relevance), k.t(e._emitter, e.language);
				}(), A = "";
			}
			function p(e, t) {
				e !== "" && (k.startScope(t), k.addText(e), k.endScope());
			}
			function m(e, t) {
				let n = 1, r = t.length - 1;
				for (; n <= r;) {
					if (!e._emit[n]) {
						n++;
						continue;
					}
					let r = w.classNameAliases[e[n]] || e[n], i = t[n];
					r ? p(i, r) : (A = i, d(), A = ""), n++;
				}
			}
			function h(e, t) {
				return e.scope && typeof e.scope == "string" && k.openNode(w.classNameAliases[e.scope] || e.scope), e.beginScope && (e.beginScope._wrap ? (p(A, w.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap), A = "") : e.beginScope._multi && (m(e.beginScope, t), A = "")), D = Object.create(e, { parent: { value: D } }), D;
			}
			function g(e, t, n) {
				let i = function(e, t) {
					let n = e && e.exec(t);
					return n && n.index === 0;
				}(e.endRe, n);
				if (i) {
					if (e["on:end"]) {
						let n = new r(e);
						e["on:end"](t, n), n.isMatchIgnored && (i = !1);
					}
					if (i) {
						for (; e.endsParent && e.parent;) e = e.parent;
						return e;
					}
				}
				if (e.endsWithParent) return g(e.parent, t, n);
			}
			function _(e) {
				return D.matcher.regexIndex === 0 ? (A += e[0], 1) : (P = !0, 0);
			}
			function b(e) {
				let t = e[0], r = n.substring(e.index), i = g(D, e, r);
				if (!i) return Z;
				let a = D;
				D.endScope && D.endScope._wrap ? (f(), p(t, D.endScope._wrap)) : D.endScope && D.endScope._multi ? (f(), m(D.endScope, e)) : a.skip ? A += t : (a.returnEnd || a.excludeEnd || (A += t), f(), a.excludeEnd && (A = t));
				do
					D.scope && k.closeNode(), D.skip || D.subLanguage || (j += D.relevance), D = D.parent;
				while (D !== i.parent);
				return i.starts && h(i.starts, e), a.returnEnd ? 0 : t.length;
			}
			let x = {};
			function S(t, a) {
				let s = a && a[0];
				if (A += t, s == null) return f(), 0;
				if (x.type === "begin" && a.type === "end" && x.index === a.index && s === "") {
					if (A += n.slice(a.index, a.index + 1), !o) {
						let t = /* @__PURE__ */ Error(`0 width match regex (${e})`);
						throw t.languageName = e, t.badRule = x.rule, t;
					}
					return 1;
				}
				if (x = a, a.type === "begin") return function(e) {
					let t = e[0], n = e.rule, i = new r(n), a = [n.i, n["on:begin"]];
					for (let n of a) if (n && (n(e, i), i.isMatchIgnored)) return _(t);
					return n.skip ? A += t : (n.excludeBegin && (A += t), f(), n.returnBegin || n.excludeBegin || (A = t)), h(n, e), n.returnBegin ? 0 : t.length;
				}(a);
				if (a.type === "illegal" && !i) {
					let e = /* @__PURE__ */ Error("Illegal lexeme \"" + s + "\" for mode \"" + (D.scope || "<unnamed>") + "\"");
					throw e.mode = D, e;
				}
				if (a.type === "end") {
					let e = b(a);
					if (e !== Z) return e;
				}
				if (a.type === "illegal" && s === "") return A += "\n", 1;
				if (N > 1e5 && N > 3 * a.index) throw Error("potential infinite loop, way more iterations than matches");
				return A += s, s.length;
			}
			let w = C(e);
			if (!w) throw s.replace("{}", e), /* @__PURE__ */ Error("Unknown language: \"" + e + "\"");
			let T = se(w), E = "", D = a || T, O = {}, k = new l.o(l);
			(function() {
				let e = [];
				for (let t = D; t !== w; t = t.parent) t.scope && e.unshift(t.scope);
				e.forEach((e) => k.openNode(e));
			})();
			let A = "", j = 0, M = 0, N = 0, P = !1;
			try {
				if (w.l) w.l(n, k);
				else {
					for (D.matcher.considerAll();;) {
						N++, P ? P = !1 : D.matcher.considerAll(), D.matcher.lastIndex = M;
						let e = D.matcher.exec(n);
						if (!e) break;
						let t = S(n.substring(M, e.index), e);
						M = e.index + t;
					}
					S(n.substring(M));
				}
				return k.finalize(), E = k.toHTML(), {
					language: e,
					value: E,
					relevance: j,
					illegal: !1,
					_emitter: k,
					_top: D
				};
			} catch (t) {
				if (t.message && t.message.includes("Illegal")) return {
					language: e,
					value: Y(n),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: t.message,
						index: M,
						context: n.slice(M - 100, M + 100),
						mode: t.mode,
						resultSoFar: E
					},
					_emitter: k
				};
				if (o) return {
					language: e,
					value: Y(n),
					illegal: !1,
					relevance: 0,
					errorRaised: t,
					_emitter: k,
					_top: D
				};
				throw t;
			}
		}
		function y(e, n) {
			n = n || l.languages || Object.keys(t);
			let r = function(e) {
				let t = {
					value: Y(e),
					illegal: !1,
					relevance: 0,
					_top: c,
					_emitter: new l.o(l)
				};
				return t._emitter.addText(e), t;
			}(e), i = n.filter(C).filter(T).map((t) => v(t, e, !1));
			i.unshift(r);
			let [a, o] = i.sort((e, t) => {
				if (e.relevance !== t.relevance) return t.relevance - e.relevance;
				if (e.language && t.language) {
					if (C(e.language).supersetOf === t.language) return 1;
					if (C(t.language).supersetOf === e.language) return -1;
				}
				return 0;
			}), s = a;
			return s.secondBest = o, s;
		}
		function b(e) {
			let t = null, n = function(e) {
				let t = e.className + " ";
				t += e.parentNode ? e.parentNode.className : "";
				let n = l.languageDetectRe.exec(t);
				if (n) {
					let e = C(n[1]);
					return e || s.replace("{}", n[1]), e ? n[1] : "no-highlight";
				}
				return t.split(/\s+/).find((e) => d(e) || C(e));
			}(e);
			if (d(n) || (E("before:highlightElement", {
				el: e,
				language: n
			}), e.dataset.highlighted)) return;
			if (e.children.length > 0 && (l.ignoreUnescapedHTML, l.throwUnescapedHTML)) throw new ce("One of your code blocks includes unescaped HTML.", e.innerHTML);
			t = e;
			let r = t.textContent, a = n ? _(r, {
				language: n,
				ignoreIllegals: !0
			}) : y(r);
			e.innerHTML = a.value, e.dataset.highlighted = "yes", function(e, t, n) {
				let r = t && i[t] || n;
				e.classList.add("hljs"), e.classList.add(`language-${r}`);
			}(e, n, a.language), e.result = {
				language: a.language,
				re: a.relevance,
				relevance: a.relevance
			}, a.secondBest && (e.secondBest = {
				language: a.secondBest.language,
				relevance: a.secondBest.relevance
			}), E("after:highlightElement", {
				el: e,
				result: a,
				text: r
			});
		}
		let x = !1;
		function S() {
			if (document.readyState === "loading") return x || window.addEventListener("DOMContentLoaded", function() {
				S();
			}, !1), void (x = !0);
			document.querySelectorAll(l.cssSelector).forEach(b);
		}
		function C(e) {
			return e = (e || "").toLowerCase(), t[e] || t[i[e]];
		}
		function w(e, { languageName: t }) {
			typeof e == "string" && (e = [e]), e.forEach((e) => {
				i[e.toLowerCase()] = t;
			});
		}
		function T(e) {
			let t = C(e);
			return t && !t.disableAutodetect;
		}
		function E(e, t) {
			let n = e;
			a.forEach(function(e) {
				e[n] && e[n](t);
			});
		}
		Object.assign(e, {
			highlight: _,
			highlightAuto: y,
			highlightAll: S,
			highlightElement: b,
			highlightBlock: function(e) {
				return G("10.7.0", "highlightBlock will be removed entirely in v12.0"), G("10.7.0", "Please use highlightElement now."), b(e);
			},
			configure: function(e) {
				l = X(l, e);
			},
			initHighlighting: () => {
				S(), G("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
			},
			initHighlightingOnLoad: function() {
				S(), G("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
			},
			registerLanguage: function(n, r) {
				let i = null;
				try {
					i = r(e);
				} catch (e) {
					if ("Language definition for '{}' could not be registered.".replace("{}", n), !o) throw e;
					i = c;
				}
				i.name ||= n, t[n] = i, i.rawDefinition = r.bind(null, e), i.aliases && w(i.aliases, { languageName: n });
			},
			unregisterLanguage: function(e) {
				delete t[e];
				for (let t of Object.keys(i)) i[t] === e && delete i[t];
			},
			listLanguages: function() {
				return Object.keys(t);
			},
			getLanguage: C,
			registerAliases: w,
			autoDetection: T,
			inherit: X,
			addPlugin: function(e) {
				(function(e) {
					e["before:highlightBlock"] && !e["before:highlightElement"] && (e["before:highlightElement"] = (t) => {
						e["before:highlightBlock"](Object.assign({ block: t.el }, t));
					}), e["after:highlightBlock"] && !e["after:highlightElement"] && (e["after:highlightElement"] = (t) => {
						e["after:highlightBlock"](Object.assign({ block: t.el }, t));
					});
				})(e), a.push(e);
			},
			removePlugin: function(e) {
				let t = a.indexOf(e);
				t !== -1 && a.splice(t, 1);
			}
		}), e.debugMode = function() {
			o = !1;
		}, e.safeMode = function() {
			o = !0;
		}, e.versionString = "11.11.1", e.regex = {
			concat: h,
			lookahead: f,
			either: g,
			optional: m,
			anyNumberOfTimes: p
		};
		for (let e in I) typeof I[e] == "object" && n(I[e]);
		return Object.assign(e, I), e;
	}, $ = Q({});
	$.newInstance = () => Q({}), t.exports = $, $.HighlightJS = $, $.default = $;
}), i = e({
	HighlightJS: () => a.default,
	default: () => o
}), a = t(r()), o = a.default, s = e({ default: () => c });
function c(e) {
	let t = e.regex, n = {}, r = {
		begin: /\$\{/,
		end: /\}/,
		contains: ["self", {
			begin: /:-/,
			contains: [n]
		}]
	};
	Object.assign(n, {
		className: "variable",
		variants: [{ begin: t.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") }, r]
	});
	let i = {
		className: "subst",
		begin: /\$\(/,
		end: /\)/,
		contains: [e.BACKSLASH_ESCAPE]
	}, a = e.inherit(e.COMMENT(), {
		match: [/(^|\s)/, /#.*$/],
		scope: { 2: "comment" }
	}), o = {
		begin: /<<-?\s*(?=\w+)/,
		starts: { contains: [e.END_SAME_AS_BEGIN({
			begin: /(\w+)/,
			end: /(\w+)/,
			className: "string"
		})] }
	}, s = {
		className: "string",
		begin: /"/,
		end: /"/,
		contains: [
			e.BACKSLASH_ESCAPE,
			n,
			i
		]
	};
	i.contains.push(s);
	let c = {
		begin: /\$?\(\(/,
		end: /\)\)/,
		contains: [
			{
				begin: /\d+#[0-9a-f]+/,
				className: "number"
			},
			e.NUMBER_MODE,
			n
		]
	}, l = e.SHEBANG({
		binary: `(${[
			"fish",
			"bash",
			"zsh",
			"sh",
			"csh",
			"ksh",
			"tcsh",
			"dash",
			"scsh"
		].join("|")})`,
		relevance: 10
	}), u = {
		className: "function",
		begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
		returnBegin: !0,
		contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
		relevance: 0
	};
	return {
		name: "Bash",
		aliases: ["sh", "zsh"],
		keywords: {
			$pattern: /\b[a-z][a-z0-9._-]+\b/,
			keyword: [
				"if",
				"then",
				"else",
				"elif",
				"fi",
				"time",
				"for",
				"while",
				"until",
				"in",
				"do",
				"done",
				"case",
				"esac",
				"coproc",
				"function",
				"select"
			],
			literal: ["true", "false"],
			built_in: /* @__PURE__ */ "break.cd.continue.eval.exec.exit.export.getopts.hash.pwd.readonly.return.shift.test.times.trap.umask.unset.alias.bind.builtin.caller.command.declare.echo.enable.help.let.local.logout.mapfile.printf.read.readarray.source.sudo.type.typeset.ulimit.unalias.set.shopt.autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp.chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes".split(".")
		},
		contains: [
			l,
			e.SHEBANG(),
			u,
			c,
			a,
			o,
			{ match: /(\/[a-z._-]+)+/ },
			s,
			{ match: /\\"/ },
			{
				className: "string",
				begin: /'/,
				end: /'/
			},
			{ match: /\\'/ },
			n
		]
	};
}
var l = e({ default: () => v }), u = "[A-Za-z$_][0-9A-Za-z$_]*", d = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), f = [
	"true",
	"false",
	"null",
	"undefined",
	"NaN",
	"Infinity"
], p = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), m = [
	"Error",
	"EvalError",
	"InternalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
], h = [
	"setInterval",
	"setTimeout",
	"clearInterval",
	"clearTimeout",
	"require",
	"exports",
	"eval",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"escape",
	"unescape"
], g = [
	"arguments",
	"this",
	"super",
	"console",
	"window",
	"document",
	"localStorage",
	"sessionStorage",
	"module",
	"global"
], _ = [].concat(h, p, m);
function v(e) {
	let t = e.regex, n = u, r = {
		begin: /<[A-Za-z0-9\\._:-]+/,
		end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
		isTrulyOpeningTag: (e, t) => {
			let n = e[0].length + e.index, r = e.input[n];
			if (r === "<" || r === ",") return void t.ignoreMatch();
			let i;
			r === ">" && (((e, { after: t }) => {
				let n = "</" + e[0].slice(1);
				return e.input.indexOf(n, t) !== -1;
			})(e, { after: n }) || t.ignoreMatch());
			let a = e.input.substring(n);
			((i = a.match(/^\s*=/)) || (i = a.match(/^\s+extends\s+/)) && i.index === 0) && t.ignoreMatch();
		}
	}, i = {
		$pattern: u,
		keyword: d,
		literal: f,
		built_in: _,
		"variable.language": g
	}, a = "[0-9](_?[0-9])*", o = `\\.(${a})`, s = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", c = {
		className: "number",
		variants: [
			{ begin: `(\\b(${s})((${o})|\\.)?|(${o}))[eE][+-]?(${a})\\b` },
			{ begin: `\\b(${s})\\b((${o})\\b|\\.)?|(${o})\\b` },
			{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
			{ begin: "\\b0[0-7]+n?\\b" }
		],
		relevance: 0
	}, l = {
		className: "subst",
		begin: "\\$\\{",
		end: "\\}",
		keywords: i,
		contains: []
	}, v = {
		begin: ".?html`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "xml"
		}
	}, y = {
		begin: ".?css`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "css"
		}
	}, b = {
		begin: ".?gql`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "graphql"
		}
	}, x = {
		className: "string",
		begin: "`",
		end: "`",
		contains: [e.BACKSLASH_ESCAPE, l]
	}, S = {
		className: "comment",
		variants: [
			e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
				relevance: 0,
				contains: [{
					begin: "(?=@[A-Za-z]+)",
					relevance: 0,
					contains: [
						{
							className: "doctag",
							begin: "@[A-Za-z]+"
						},
						{
							className: "type",
							begin: "\\{",
							end: "\\}",
							excludeEnd: !0,
							excludeBegin: !0,
							relevance: 0
						},
						{
							className: "variable",
							begin: n + "(?=\\s*(-)|$)",
							endsParent: !0,
							relevance: 0
						},
						{
							begin: /(?=[^\n])\s/,
							relevance: 0
						}
					]
				}]
			}),
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE
		]
	}, C = [
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		v,
		y,
		b,
		x,
		{ match: /\$\d+/ },
		c
	];
	l.contains = C.concat({
		begin: /\{/,
		end: /\}/,
		keywords: i,
		contains: ["self"].concat(C)
	});
	let w = [].concat(S, l.contains), T = w.concat([{
		begin: /(\s*)\(/,
		end: /\)/,
		keywords: i,
		contains: ["self"].concat(w)
	}]), E = {
		className: "params",
		begin: /(\s*)\(/,
		end: /\)/,
		excludeBegin: !0,
		excludeEnd: !0,
		keywords: i,
		contains: T
	}, D = { variants: [{
		match: [
			/class/,
			/\s+/,
			n,
			/\s+/,
			/extends/,
			/\s+/,
			t.concat(n, "(", t.concat(/\./, n), ")*")
		],
		scope: {
			1: "keyword",
			3: "title.class",
			5: "keyword",
			7: "title.class.inherited"
		}
	}, {
		match: [
			/class/,
			/\s+/,
			n
		],
		scope: {
			1: "keyword",
			3: "title.class"
		}
	}] }, O = {
		relevance: 0,
		match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
		className: "title.class",
		keywords: { _: [...p, ...m] }
	}, k = {
		variants: [{ match: [
			/function/,
			/\s+/,
			n,
			/(?=\s*\()/
		] }, { match: [/function/, /\s*(?=\()/] }],
		className: {
			1: "keyword",
			3: "title.function"
		},
		label: "func.def",
		contains: [E],
		illegal: /%/
	}, A = {
		match: t.concat(/\b/, (j = [
			...h,
			"super",
			"import"
		].map((e) => `${e}\\s*\\(`), t.concat("(?!", j.join("|"), ")")), n, t.lookahead(/\s*\(/)),
		className: "title.function",
		relevance: 0
	};
	var j;
	let M = {
		begin: t.concat(/\./, t.lookahead(t.concat(n, /(?![0-9A-Za-z$_(])/))),
		end: n,
		excludeBegin: !0,
		keywords: "prototype",
		className: "property",
		relevance: 0
	}, N = {
		match: [
			/get|set/,
			/\s+/,
			n,
			/(?=\()/
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [{ begin: /\(\)/ }, E]
	}, P = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", F = {
		match: [
			/const|var|let/,
			/\s+/,
			n,
			/\s*/,
			/=\s*/,
			/(async\s*)?/,
			t.lookahead(P)
		],
		keywords: "async",
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [E]
	};
	return {
		name: "JavaScript",
		aliases: [
			"js",
			"jsx",
			"mjs",
			"cjs"
		],
		keywords: i,
		exports: {
			PARAMS_CONTAINS: T,
			CLASS_REFERENCE: O
		},
		illegal: /#(?![$_A-z])/,
		contains: [
			e.SHEBANG({
				label: "shebang",
				binary: "node",
				relevance: 5
			}),
			{
				label: "use_strict",
				className: "meta",
				relevance: 10,
				begin: /^\s*['"]use (strict|asm)['"]/
			},
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			v,
			y,
			b,
			x,
			S,
			{ match: /\$\d+/ },
			c,
			O,
			{
				scope: "attr",
				match: n + t.lookahead(":"),
				relevance: 0
			},
			F,
			{
				begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
				keywords: "return throw case",
				relevance: 0,
				contains: [
					S,
					e.REGEXP_MODE,
					{
						className: "function",
						begin: P,
						returnBegin: !0,
						end: "\\s*=>",
						contains: [{
							className: "params",
							variants: [
								{
									begin: e.UNDERSCORE_IDENT_RE,
									relevance: 0
								},
								{
									className: null,
									begin: /\(\s*\)/,
									skip: !0
								},
								{
									begin: /(\s*)\(/,
									end: /\)/,
									excludeBegin: !0,
									excludeEnd: !0,
									keywords: i,
									contains: T
								}
							]
						}]
					},
					{
						begin: /,/,
						relevance: 0
					},
					{
						match: /\s+/,
						relevance: 0
					},
					{
						variants: [
							{
								begin: "<>",
								end: "</>"
							},
							{ match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
							{
								begin: r.begin,
								"on:begin": r.isTrulyOpeningTag,
								end: r.end
							}
						],
						subLanguage: "xml",
						contains: [{
							begin: r.begin,
							end: r.end,
							skip: !0,
							contains: ["self"]
						}]
					}
				]
			},
			k,
			{ beginKeywords: "while if switch catch for" },
			{
				begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
				returnBegin: !0,
				label: "func.def",
				contains: [E, e.inherit(e.TITLE_MODE, {
					begin: n,
					className: "title.function"
				})]
			},
			{
				match: /\.\.\./,
				relevance: 0
			},
			M,
			{
				match: "\\$" + n,
				relevance: 0
			},
			{
				match: [/\bconstructor(?=\s*\()/],
				className: { 1: "title.function" },
				contains: [E]
			},
			A,
			{
				relevance: 0,
				match: /\b[A-Z][A-Z_0-9]+\b/,
				className: "variable.constant"
			},
			D,
			N,
			{ match: /\$[(.]/ }
		]
	};
}
var y = e({ default: () => b });
function b(e) {
	let t = {
		begin: /<\/?[A-Za-z_]/,
		end: ">",
		subLanguage: "xml",
		relevance: 0
	}, n = {
		variants: [
			{
				begin: /\[.+?\]\[.*?\]/,
				relevance: 0
			},
			{
				begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
				relevance: 2
			},
			{
				begin: e.regex.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
				relevance: 2
			},
			{
				begin: /\[.+?\]\([./?&#].*?\)/,
				relevance: 1
			},
			{
				begin: /\[.*?\]\(.*?\)/,
				relevance: 0
			}
		],
		returnBegin: !0,
		contains: [
			{ match: /\[(?=\])/ },
			{
				className: "string",
				relevance: 0,
				begin: "\\[",
				end: "\\]",
				excludeBegin: !0,
				returnEnd: !0
			},
			{
				className: "link",
				relevance: 0,
				begin: "\\]\\(",
				end: "\\)",
				excludeBegin: !0,
				excludeEnd: !0
			},
			{
				className: "symbol",
				relevance: 0,
				begin: "\\]\\[",
				end: "\\]",
				excludeBegin: !0,
				excludeEnd: !0
			}
		]
	}, r = {
		className: "strong",
		contains: [],
		variants: [{
			begin: /_{2}(?!\s)/,
			end: /_{2}/
		}, {
			begin: /\*{2}(?!\s)/,
			end: /\*{2}/
		}]
	}, i = {
		className: "emphasis",
		contains: [],
		variants: [{
			begin: /\*(?![*\s])/,
			end: /\*/
		}, {
			begin: /_(?![_\s])/,
			end: /_/,
			relevance: 0
		}]
	}, a = e.inherit(r, { contains: [] }), o = e.inherit(i, { contains: [] });
	r.contains.push(o), i.contains.push(a);
	let s = [t, n];
	return [
		r,
		i,
		a,
		o
	].forEach((e) => {
		e.contains = e.contains.concat(s);
	}), s = s.concat(r, i), {
		name: "Markdown",
		aliases: [
			"md",
			"mkdown",
			"mkd"
		],
		contains: [
			{
				className: "section",
				variants: [{
					begin: "^#{1,6}",
					end: "$",
					contains: s
				}, {
					begin: "(?=^.+?\\n[=-]{2,}$)",
					contains: [{ begin: "^[=-]*$" }, {
						begin: "^",
						end: "\\n",
						contains: s
					}]
				}]
			},
			t,
			{
				className: "bullet",
				begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
				end: "\\s+",
				excludeEnd: !0
			},
			r,
			i,
			{
				className: "quote",
				begin: "^>\\s+",
				contains: s,
				end: "$"
			},
			{
				className: "code",
				variants: [
					{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
					{ begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
					{
						begin: "```",
						end: "```+[ ]*$"
					},
					{
						begin: "~~~",
						end: "~~~+[ ]*$"
					},
					{ begin: "`.+?`" },
					{
						begin: "(?=^( {4}|\\t))",
						contains: [{
							begin: "^( {4}|\\t)",
							end: "(\\n)$"
						}],
						relevance: 0
					}
				]
			},
			{
				begin: "^[-\\*]{3,}",
				end: "$"
			},
			n,
			{
				begin: /^\[[^\n]+\]:/,
				returnBegin: !0,
				contains: [{
					className: "symbol",
					begin: /\[/,
					end: /\]/,
					excludeBegin: !0,
					excludeEnd: !0
				}, {
					className: "link",
					begin: /:\s*/,
					end: /$/,
					excludeBegin: !0
				}]
			},
			{
				scope: "literal",
				match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
			}
		]
	};
}
var x = e({ default: () => j }), S = "[A-Za-z$_][0-9A-Za-z$_]*", C = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), w = [
	"true",
	"false",
	"null",
	"undefined",
	"NaN",
	"Infinity"
], T = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), E = [
	"Error",
	"EvalError",
	"InternalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
], D = [
	"setInterval",
	"setTimeout",
	"clearInterval",
	"clearTimeout",
	"require",
	"exports",
	"eval",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"escape",
	"unescape"
], O = [
	"arguments",
	"this",
	"super",
	"console",
	"window",
	"document",
	"localStorage",
	"sessionStorage",
	"module",
	"global"
], k = [].concat(D, T, E);
function A(e) {
	let t = e.regex, n = S, r = {
		begin: /<[A-Za-z0-9\\._:-]+/,
		end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
		isTrulyOpeningTag: (e, t) => {
			let n = e[0].length + e.index, r = e.input[n];
			if (r === "<" || r === ",") return void t.ignoreMatch();
			let i;
			r === ">" && (((e, { after: t }) => {
				let n = "</" + e[0].slice(1);
				return e.input.indexOf(n, t) !== -1;
			})(e, { after: n }) || t.ignoreMatch());
			let a = e.input.substring(n);
			((i = a.match(/^\s*=/)) || (i = a.match(/^\s+extends\s+/)) && i.index === 0) && t.ignoreMatch();
		}
	}, i = {
		$pattern: S,
		keyword: C,
		literal: w,
		built_in: k,
		"variable.language": O
	}, a = "[0-9](_?[0-9])*", o = `\\.(${a})`, s = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", c = {
		className: "number",
		variants: [
			{ begin: `(\\b(${s})((${o})|\\.)?|(${o}))[eE][+-]?(${a})\\b` },
			{ begin: `\\b(${s})\\b((${o})\\b|\\.)?|(${o})\\b` },
			{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
			{ begin: "\\b0[0-7]+n?\\b" }
		],
		relevance: 0
	}, l = {
		className: "subst",
		begin: "\\$\\{",
		end: "\\}",
		keywords: i,
		contains: []
	}, u = {
		begin: ".?html`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "xml"
		}
	}, d = {
		begin: ".?css`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "css"
		}
	}, f = {
		begin: ".?gql`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, l],
			subLanguage: "graphql"
		}
	}, p = {
		className: "string",
		begin: "`",
		end: "`",
		contains: [e.BACKSLASH_ESCAPE, l]
	}, m = {
		className: "comment",
		variants: [
			e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
				relevance: 0,
				contains: [{
					begin: "(?=@[A-Za-z]+)",
					relevance: 0,
					contains: [
						{
							className: "doctag",
							begin: "@[A-Za-z]+"
						},
						{
							className: "type",
							begin: "\\{",
							end: "\\}",
							excludeEnd: !0,
							excludeBegin: !0,
							relevance: 0
						},
						{
							className: "variable",
							begin: n + "(?=\\s*(-)|$)",
							endsParent: !0,
							relevance: 0
						},
						{
							begin: /(?=[^\n])\s/,
							relevance: 0
						}
					]
				}]
			}),
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE
		]
	}, h = [
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		u,
		d,
		f,
		p,
		{ match: /\$\d+/ },
		c
	];
	l.contains = h.concat({
		begin: /\{/,
		end: /\}/,
		keywords: i,
		contains: ["self"].concat(h)
	});
	let g = [].concat(m, l.contains), _ = g.concat([{
		begin: /(\s*)\(/,
		end: /\)/,
		keywords: i,
		contains: ["self"].concat(g)
	}]), v = {
		className: "params",
		begin: /(\s*)\(/,
		end: /\)/,
		excludeBegin: !0,
		excludeEnd: !0,
		keywords: i,
		contains: _
	}, y = { variants: [{
		match: [
			/class/,
			/\s+/,
			n,
			/\s+/,
			/extends/,
			/\s+/,
			t.concat(n, "(", t.concat(/\./, n), ")*")
		],
		scope: {
			1: "keyword",
			3: "title.class",
			5: "keyword",
			7: "title.class.inherited"
		}
	}, {
		match: [
			/class/,
			/\s+/,
			n
		],
		scope: {
			1: "keyword",
			3: "title.class"
		}
	}] }, b = {
		relevance: 0,
		match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
		className: "title.class",
		keywords: { _: [...T, ...E] }
	}, x = {
		variants: [{ match: [
			/function/,
			/\s+/,
			n,
			/(?=\s*\()/
		] }, { match: [/function/, /\s*(?=\()/] }],
		className: {
			1: "keyword",
			3: "title.function"
		},
		label: "func.def",
		contains: [v],
		illegal: /%/
	}, A = {
		match: t.concat(/\b/, (j = [
			...D,
			"super",
			"import"
		].map((e) => `${e}\\s*\\(`), t.concat("(?!", j.join("|"), ")")), n, t.lookahead(/\s*\(/)),
		className: "title.function",
		relevance: 0
	};
	var j;
	let M = {
		begin: t.concat(/\./, t.lookahead(t.concat(n, /(?![0-9A-Za-z$_(])/))),
		end: n,
		excludeBegin: !0,
		keywords: "prototype",
		className: "property",
		relevance: 0
	}, N = {
		match: [
			/get|set/,
			/\s+/,
			n,
			/(?=\()/
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [{ begin: /\(\)/ }, v]
	}, P = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", F = {
		match: [
			/const|var|let/,
			/\s+/,
			n,
			/\s*/,
			/=\s*/,
			/(async\s*)?/,
			t.lookahead(P)
		],
		keywords: "async",
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [v]
	};
	return {
		name: "JavaScript",
		aliases: [
			"js",
			"jsx",
			"mjs",
			"cjs"
		],
		keywords: i,
		exports: {
			PARAMS_CONTAINS: _,
			CLASS_REFERENCE: b
		},
		illegal: /#(?![$_A-z])/,
		contains: [
			e.SHEBANG({
				label: "shebang",
				binary: "node",
				relevance: 5
			}),
			{
				label: "use_strict",
				className: "meta",
				relevance: 10,
				begin: /^\s*['"]use (strict|asm)['"]/
			},
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			u,
			d,
			f,
			p,
			m,
			{ match: /\$\d+/ },
			c,
			b,
			{
				scope: "attr",
				match: n + t.lookahead(":"),
				relevance: 0
			},
			F,
			{
				begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
				keywords: "return throw case",
				relevance: 0,
				contains: [
					m,
					e.REGEXP_MODE,
					{
						className: "function",
						begin: P,
						returnBegin: !0,
						end: "\\s*=>",
						contains: [{
							className: "params",
							variants: [
								{
									begin: e.UNDERSCORE_IDENT_RE,
									relevance: 0
								},
								{
									className: null,
									begin: /\(\s*\)/,
									skip: !0
								},
								{
									begin: /(\s*)\(/,
									end: /\)/,
									excludeBegin: !0,
									excludeEnd: !0,
									keywords: i,
									contains: _
								}
							]
						}]
					},
					{
						begin: /,/,
						relevance: 0
					},
					{
						match: /\s+/,
						relevance: 0
					},
					{
						variants: [
							{
								begin: "<>",
								end: "</>"
							},
							{ match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
							{
								begin: r.begin,
								"on:begin": r.isTrulyOpeningTag,
								end: r.end
							}
						],
						subLanguage: "xml",
						contains: [{
							begin: r.begin,
							end: r.end,
							skip: !0,
							contains: ["self"]
						}]
					}
				]
			},
			x,
			{ beginKeywords: "while if switch catch for" },
			{
				begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
				returnBegin: !0,
				label: "func.def",
				contains: [v, e.inherit(e.TITLE_MODE, {
					begin: n,
					className: "title.function"
				})]
			},
			{
				match: /\.\.\./,
				relevance: 0
			},
			M,
			{
				match: "\\$" + n,
				relevance: 0
			},
			{
				match: [/\bconstructor(?=\s*\()/],
				className: { 1: "title.function" },
				contains: [v]
			},
			A,
			{
				relevance: 0,
				match: /\b[A-Z][A-Z_0-9]+\b/,
				className: "variable.constant"
			},
			y,
			N,
			{ match: /\$[(.]/ }
		]
	};
}
function j(e) {
	let t = e.regex, n = A(e), r = S, i = [
		"any",
		"void",
		"number",
		"boolean",
		"string",
		"object",
		"never",
		"symbol",
		"bigint",
		"unknown"
	], a = {
		begin: [
			/namespace/,
			/\s+/,
			e.IDENT_RE
		],
		beginScope: {
			1: "keyword",
			3: "title.class"
		}
	}, o = {
		beginKeywords: "interface",
		end: /\{/,
		excludeEnd: !0,
		keywords: {
			keyword: "interface extends",
			built_in: i
		},
		contains: [n.exports.CLASS_REFERENCE]
	}, s = {
		$pattern: S,
		keyword: C.concat([
			"type",
			"interface",
			"public",
			"private",
			"protected",
			"implements",
			"declare",
			"abstract",
			"readonly",
			"enum",
			"override",
			"satisfies"
		]),
		literal: w,
		built_in: k.concat(i),
		"variable.language": O
	}, c = {
		className: "meta",
		begin: "@" + r
	}, l = (e, t, n) => {
		let r = e.contains.findIndex((e) => e.label === t);
		if (r === -1) throw Error("can not find mode to replace");
		e.contains.splice(r, 1, n);
	};
	Object.assign(n.keywords, s), n.exports.PARAMS_CONTAINS.push(c);
	let u = n.contains.find((e) => e.scope === "attr"), d = Object.assign({}, u, { match: t.concat(r, t.lookahead(/\s*\?:/)) });
	return n.exports.PARAMS_CONTAINS.push([
		n.exports.CLASS_REFERENCE,
		u,
		d
	]), n.contains = n.contains.concat([
		c,
		a,
		o,
		d
	]), l(n, "shebang", e.SHEBANG()), l(n, "use_strict", {
		className: "meta",
		relevance: 10,
		begin: /^\s*['"]use strict['"]/
	}), n.contains.find((e) => e.label === "func.def").relevance = 0, Object.assign(n, {
		name: "TypeScript",
		aliases: [
			"ts",
			"tsx",
			"mts",
			"cts"
		]
	}), n;
}
var M = e({ default: () => N });
function N(e) {
	let t = e.regex, n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = {
		className: "symbol",
		begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
	}, i = {
		begin: /\s/,
		contains: [{
			className: "keyword",
			begin: /#?[a-z_][a-z1-9_-]+/,
			illegal: /\n/
		}]
	}, a = e.inherit(i, {
		begin: /\(/,
		end: /\)/
	}), o = e.inherit(e.APOS_STRING_MODE, { className: "string" }), s = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }), c = {
		endsWithParent: !0,
		illegal: /</,
		relevance: 0,
		contains: [{
			className: "attr",
			begin: /[\p{L}0-9._:-]+/u,
			relevance: 0
		}, {
			begin: /=\s*/,
			relevance: 0,
			contains: [{
				className: "string",
				endsParent: !0,
				variants: [
					{
						begin: /"/,
						end: /"/,
						contains: [r]
					},
					{
						begin: /'/,
						end: /'/,
						contains: [r]
					},
					{ begin: /[^\s"'=<>`]+/ }
				]
			}]
		}]
	};
	return {
		name: "HTML, XML",
		aliases: [
			"html",
			"xhtml",
			"rss",
			"atom",
			"xjb",
			"xsd",
			"xsl",
			"plist",
			"wsf",
			"svg"
		],
		case_insensitive: !0,
		unicodeRegex: !0,
		contains: [
			{
				className: "meta",
				begin: /<![a-z]/,
				end: />/,
				relevance: 10,
				contains: [
					i,
					s,
					o,
					a,
					{
						begin: /\[/,
						end: /\]/,
						contains: [{
							className: "meta",
							begin: /<![a-z]/,
							end: />/,
							contains: [
								i,
								a,
								s,
								o
							]
						}]
					}
				]
			},
			e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
			{
				begin: /<!\[CDATA\[/,
				end: /\]\]>/,
				relevance: 10
			},
			r,
			{
				className: "meta",
				end: /\?>/,
				variants: [{
					begin: /<\?xml/,
					relevance: 10,
					contains: [s]
				}, { begin: /<\?[a-z][a-z0-9]+/ }]
			},
			{
				className: "tag",
				begin: /<style(?=\s|>)/,
				end: />/,
				keywords: { name: "style" },
				contains: [c],
				starts: {
					end: /<\/style>/,
					returnEnd: !0,
					subLanguage: ["css", "xml"]
				}
			},
			{
				className: "tag",
				begin: /<script(?=\s|>)/,
				end: />/,
				keywords: { name: "script" },
				contains: [c],
				starts: {
					end: /<\/script>/,
					returnEnd: !0,
					subLanguage: [
						"javascript",
						"handlebars",
						"xml"
					]
				}
			},
			{
				className: "tag",
				begin: /<>|<\/>/
			},
			{
				className: "tag",
				begin: t.concat(/</, t.lookahead(t.concat(n, t.either(/\/>/, />/, /\s/)))),
				end: /\/?>/,
				contains: [{
					className: "name",
					begin: n,
					relevance: 0,
					starts: c
				}]
			},
			{
				className: "tag",
				begin: t.concat(/<\//, t.lookahead(t.concat(n, />/))),
				contains: [{
					className: "name",
					begin: n,
					relevance: 0
				}, {
					begin: />/,
					relevance: 0,
					endsParent: !0
				}]
			}
		]
	};
}
export { s as a, l as i, x as n, i as o, y as r, M as t };
