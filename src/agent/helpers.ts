import manifest from 'virtual:schmancy-manifest'

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
				void new (window as { CustomElementRegistry?: new () => unknown }).CustomElementRegistry!()
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
