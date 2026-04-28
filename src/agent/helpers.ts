import manifest from 'virtual:schmancy-manifest'

export type Manifest = typeof manifest

export type ElementEntry = {
	kind: 'class'
	name: string
	tagName?: string
	description?: string
	summary?: string
	attributes?: Array<{
		name: string
		description?: string
		type?: { text?: string }
		default?: string
		values?: string[]
	}>
	events?: Array<{ name: string; description?: string; type?: { text?: string } }>
	slots?: Array<{ name: string; description?: string }>
	cssProperties?: Array<{ name: string; description?: string }>
	cssParts?: Array<{ name: string; description?: string }>
	examples?: string[]
	whenToUse?: string
	platformPrimitive?: { tag: string; mode?: string; note?: string }
	contexts?: { provides?: string[]; consumes?: string[] }
}

export type ServiceEntry = {
	kind: 'variable'
	name: string
	description?: string
	summary?: string
	service: true
	methods?: Array<{ signature: string; summary?: string }>
}

type Declaration = ElementEntry | ServiceEntry | { kind: string; name: string; [key: string]: unknown }

function allDeclarations(): Declaration[] {
	const out: Declaration[] = []
	for (const mod of manifest.modules ?? []) {
		const decls = (mod as unknown as { declarations?: Declaration[] }).declarations ?? []
		for (const decl of decls) out.push(decl)
	}
	return out
}

function elements(): ElementEntry[] {
	return allDeclarations().filter(
		(d): d is ElementEntry => d.kind === 'class' && typeof (d as ElementEntry).tagName === 'string',
	)
}

function services(): ServiceEntry[] {
	return allDeclarations().filter((d): d is ServiceEntry => d.kind === 'variable' && (d as ServiceEntry).service === true)
}

export function help(tag?: string): unknown {
	if (!tag) {
		return {
			elements: elements().map(e => ({ tag: e.tagName, summary: e.summary ?? e.description })),
			services: services().map(s => ({ name: s.name, summary: s.summary ?? s.description })),
		}
	}
	const el = elements().find(e => e.tagName === tag)
	if (el) return el
	const svc = services().find(s => s.name === tag)
	if (svc) return svc
	return null
}

export function tokens(): string[] {
	return (manifest as { tokens?: string[] }).tokens ?? []
}

// --- findFor: keyword search over the manifest -------------------------------

/**
 * Stopwords stripped from both query and document tokens. Kept short on
 * purpose — over-aggressive stopword lists hurt recall on short queries
 * like "use". Word "use" stays in because of "use case" matches.
 */
const STOPWORDS = new Set([
	'a', 'an', 'and', 'or', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
	'is', 'it', 'this', 'that', 'these', 'those', 'be', 'by', 'as', 'are', 'was',
	'i', 'you', 'we', 'my', 'your',
])

function tokenize(text: string): Set<string> {
	const out = new Set<string>()
	for (const t of text.toLowerCase().match(/[a-z][a-z0-9]+/g) ?? []) {
		if (t.length >= 2 && !STOPWORDS.has(t)) out.add(t)
	}
	return out
}

type IndexEntry = {
	entry: ElementEntry
	body: Set<string>      // tokens from summary + description + examples
	tagTokens: Set<string> // tokens derived from the tag name itself
}

let _searchIndex: IndexEntry[] | null = null

function buildSearchIndex(): IndexEntry[] {
	return elements().map(entry => {
		const tagTokens = tokenize((entry.tagName ?? '').replace(/-/g, ' '))
		const body = tokenize(
			[
				entry.tagName ?? '',
				entry.summary ?? '',
				entry.description ?? '',
				entry.whenToUse ?? '',
				(entry.examples ?? []).join(' '),
			].join(' '),
		)
		return { entry, body, tagTokens }
	})
}

export type FindForResult = {
	tag: string
	score: number
	summary?: string
	examples?: string[]
}

/**
 * Keyword search over the component manifest. Tokenizes the query the same
 * way each component's `summary + description + examples` were tokenized,
 * and returns the components with the most overlap. Tag-name token matches
 * count for 3× a body-text match.
 *
 * Designed to catch the "I'm reaching for a custom component, what does
 * schmancy ship?" gap without bringing in a vector-embedding dependency.
 *
 * @example
 * window.schmancy.findFor('status pill')
 * // → [{ tag: 'schmancy-badge', score: 4, summary: '…', examples: [...] }]
 *
 * window.schmancy.findFor('initials avatar')
 * // → [{ tag: 'schmancy-avatar', score: 5, ... }]
 *
 * window.schmancy.findFor('xyz123nonexistent') // → []
 */
export function findFor(query: string, limit = 5): FindForResult[] {
	if (!_searchIndex) _searchIndex = buildSearchIndex()
	const queryTokens = tokenize(query)
	if (queryTokens.size === 0) return []

	const scored: Array<{ entry: ElementEntry; score: number }> = []
	for (const ix of _searchIndex) {
		let score = 0
		for (const qt of queryTokens) {
			if (ix.tagTokens.has(qt)) score += 3
			else if (ix.body.has(qt)) score += 1
		}
		if (score > 0) scored.push({ entry: ix.entry, score })
	}
	scored.sort((a, b) => b.score - a.score)
	return scored.slice(0, limit).map(({ entry, score }) => ({
		tag: entry.tagName ?? '',
		score,
		summary: entry.summary,
		examples: entry.examples,
	}))
}

export function platformPrimitive(tag: string): ElementEntry['platformPrimitive'] | null {
	return elements().find(e => e.tagName === tag)?.platformPrimitive ?? null
}

export function registeredTags(): string[] {
	return elements()
		.map(e => e.tagName!)
		.filter(tag => typeof customElements.get(tag) !== 'undefined')
}

export function a11yAudit(): Array<{
	tag: string
	role: string | null
	ariaLabel: string | null
	hasShadowRoot: boolean
	formAssociated: boolean
}> {
	const tags = new Set(elements().map(e => e.tagName!))
	const report: Array<{
		tag: string
		role: string | null
		ariaLabel: string | null
		hasShadowRoot: boolean
		formAssociated: boolean
	}> = []
	const all = document.querySelectorAll('*')
	for (const node of Array.from(all)) {
		const tag = node.tagName.toLowerCase()
		if (!tags.has(tag)) continue
		const ctor = customElements.get(tag) as (CustomElementConstructor & { formAssociated?: boolean }) | undefined
		report.push({
			tag,
			role: node.getAttribute('role'),
			ariaLabel: node.getAttribute('aria-label'),
			hasShadowRoot: Boolean((node as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot),
			formAssociated: Boolean(ctor?.formAssociated),
		})
	}
	return report
}

export type Capabilities = {
	popover: boolean
	declarativeShadowDom: boolean
	scopedRegistries: boolean
	trustedTypes: boolean
	cssRegisteredProperties: boolean
	elementInternalsAria: boolean
	formAssociated: boolean
	adoptedStyleSheets: boolean
}

/**
 * Runtime feature probe. Tells an agent which platform capabilities the
 * current sandbox exposes, so it can adapt without assuming the sandbox CSP
 * or browser version. Every check is feature-detect, not UA-sniff.
 */
export function capabilities(): Capabilities {
	const anyTemplate = typeof HTMLTemplateElement !== 'undefined' ? HTMLTemplateElement.prototype : null
	const anyElInternals = typeof ElementInternals !== 'undefined' ? ElementInternals.prototype : null
	return {
		popover: typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype,
		declarativeShadowDom: Boolean(anyTemplate && 'shadowRootMode' in anyTemplate),
		scopedRegistries: (() => {
			try {
				// Native scoped registries require a constructible CustomElementRegistry.
				// Pre-Safari-26/Chrome-146, the constructor throws Illegal constructor.
				new (window as { CustomElementRegistry?: new () => unknown }).CustomElementRegistry!()
				return true
			} catch {
				return false
			}
		})(),
		trustedTypes: typeof (globalThis as { trustedTypes?: unknown }).trustedTypes !== 'undefined',
		cssRegisteredProperties: typeof (window as { CSS?: { registerProperty?: unknown } }).CSS?.registerProperty === 'function',
		elementInternalsAria: Boolean(anyElInternals && 'role' in anyElInternals),
		formAssociated: typeof ElementInternals !== 'undefined',
		adoptedStyleSheets: typeof Document !== 'undefined' && 'adoptedStyleSheets' in Document.prototype,
	}
}

export function manifestUrl(): string {
	const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' })
	return URL.createObjectURL(blob)
}

export { manifest }
