import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Project, type ClassDeclaration, type SourceFile } from 'ts-morph'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:schmancy-manifest'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID

type Attribute = {
	name: string
	description?: string
	type?: { text: string }
	default?: string
	/** Extracted enum of string-literal union members, e.g. `['filled', 'tonal', ...]`. */
	values?: string[]
}
type Event = { name: string; description?: string; type?: { text: string } }
type Slot = { name: string; description?: string }
type CssProp = { name: string; description?: string; syntax?: string }
type CssPart = { name: string; description?: string }
type Context = { name: string; kind: 'provide' | 'consume' }

type ElementDeclaration = {
	kind: 'class'
	name: string
	tagName: string
	description?: string
	summary?: string
	attributes?: Attribute[]
	events?: Event[]
	slots?: Slot[]
	cssProperties?: CssProp[]
	cssParts?: CssPart[]
	examples?: string[]
	whenToUse?: string
	platformPrimitive?: { tag: string; mode?: string; note?: string }
	contexts?: Context[]
}

type ServiceDeclaration = {
	kind: 'variable'
	name: string
	description?: string
	summary?: string
	service: true
	methods?: Array<{ signature: string; summary?: string }>
}

type Declaration = ElementDeclaration | ServiceDeclaration
type Module = { kind: 'javascript-module'; path: string; declarations: Declaration[] }
type Manifest = {
	schemaVersion: '1.0.0'
	readme?: string
	modules: Module[]
	tokens: string[]
	conventions: string[]
}

const CONVENTIONS: string[] = [
	'Every component extends `$LitElement`, not raw `LitElement`. Use the mixin from `@mhmo91/schmancy/mixins`.',
	'RxJS subscriptions inside a component must end with `.pipe(takeUntil(this.disconnecting))` for automatic cleanup on disconnect.',
	'Theme must wrap a surface: `<schmancy-theme>` provides design tokens, `<schmancy-surface>` paints the background and inherits text color.',
	'Use `repeat()` from `lit/directives/repeat.js` for dynamic lists — never `.map()` inside `html\`\``.',
	'Prefer `fromEvent(target, type).pipe(takeUntil(this.disconnecting))` over raw `addEventListener` inside components.',
]

function stripStars(raw: string): string {
	return raw
		.split('\n')
		.map(line => line.replace(/^\s*\*\s?/, '').trim())
		.filter(Boolean)
		.join(' ')
		.trim()
}

function getJsDocTags(node: { getLeadingCommentRanges(): ReturnType<ClassDeclaration['getLeadingCommentRanges']> }) {
	const comments = node.getLeadingCommentRanges()
	const result: { description: string; tags: Array<{ name: string; text: string }> } = {
		description: '',
		tags: [],
	}
	if (!comments.length) return result
	const last = comments[comments.length - 1].getText()
	if (!last.startsWith('/**')) return result
	const body = last.slice(3, -2)
	const lines = body.split('\n')
	const descLines: string[] = []
	let currentTag: { name: string; text: string } | null = null
	for (const raw of lines) {
		const line = raw.replace(/^\s*\*\s?/, '')
		const tagMatch = line.match(/^@(\w+)\s*(.*)$/)
		if (tagMatch) {
			if (currentTag) result.tags.push(currentTag)
			currentTag = { name: tagMatch[1], text: tagMatch[2] ?? '' }
		} else if (currentTag) {
			// Preserve newlines so multi-line @example bodies keep their HTML
			// shape; single-line parsers still work because they trim/split first.
			currentTag.text = currentTag.text ? currentTag.text + '\n' + line : line
		} else {
			descLines.push(line)
		}
	}
	if (currentTag) result.tags.push(currentTag)
	result.description = descLines.join(' ').trim()
	return result
}

function flatten(text: string): string {
	return text.replace(/\s+/g, ' ').trim()
}

function parseSlotTag(text: string): Slot {
	const m = flatten(text).match(/^(\S+)?\s*-?\s*(.*)$/)
	if (!m) return { name: '' }
	const raw = m[1] ?? ''
	const desc = (m[2] ?? '').trim()
	const name = raw === '-' || raw === '' ? '' : raw
	return desc ? { name, description: desc } : { name }
}

function parseFiresTag(text: string): Event {
	const t = flatten(text)
	const typed = t.match(/^\{([^}]+)\}\s*(\S+)\s*-?\s*(.*)$/)
	if (typed) return { name: typed[2], type: { text: typed[1] }, ...(typed[3] ? { description: typed[3].trim() } : {}) }
	const simple = t.match(/^(\S+)\s*-?\s*(.*)$/)
	if (!simple) return { name: t }
	return simple[2] ? { name: simple[1], description: simple[2].trim() } : { name: simple[1] }
}

function parseCssPropTag(text: string): CssProp {
	const m = flatten(text).match(/^(\S+)\s*-?\s*(.*)$/)
	if (!m) return { name: text }
	return m[2] ? { name: m[1], description: m[2].trim() } : { name: m[1] }
}

function parseCssPartTag(text: string): CssPart {
	return parseCssPropTag(text)
}

function cleanExampleBlock(raw: string): string {
	// Strip Markdown fencing and drop empty leading/trailing lines.
	const withoutFences = raw
		.split('\n')
		.map(line => line.replace(/^\s*```(html|ts|typescript|js|javascript)?\s*$/i, ''))
		.join('\n')
	return withoutFences.trim()
}

function parseAttrTag(text: string): Attribute {
	const m = flatten(text).match(/^(\S+)\s*-?\s*(.*)$/)
	if (!m) return { name: text }
	return m[2] ? { name: m[1], description: m[2].trim() } : { name: m[1] }
}

function parsePlatformTag(text: string): ElementDeclaration['platformPrimitive'] {
	const m = flatten(text).match(/^(\S+)\s*(\S+)?\s*-?\s*(.*)$/)
	if (!m) return undefined
	const out: { tag: string; mode?: string; note?: string } = { tag: m[1] }
	if (m[2]) out.mode = m[2]
	if (m[3]) out.note = m[3].trim()
	return out
}

function extractElement(cls: ClassDeclaration): ElementDeclaration | null {
	const decorator = cls.getDecorator('customElement')
	if (!decorator) return null
	const arg = decorator.getArguments()[0]
	if (!arg) return null
	const tagName = arg.getText().replace(/^['"`]|['"`]$/g, '')
	if (!tagName.startsWith('schmancy-') && !tagName.startsWith('sch-')) return null

	const { description, tags } = getJsDocTags(cls)
	const attributes: Attribute[] = []
	const events: Event[] = []
	const slots: Slot[] = []
	const cssProperties: CssProp[] = []
	const cssParts: CssPart[] = []
	const examples: string[] = []
	const declaration: ElementDeclaration = {
		kind: 'class',
		name: cls.getName() ?? tagName,
		tagName,
	}
	if (description) declaration.description = description

	for (const tag of tags) {
		switch (tag.name) {
			case 'slot':
				slots.push(parseSlotTag(tag.text))
				break
			case 'fires':
			case 'event':
				events.push(parseFiresTag(tag.text))
				break
			case 'cssprop':
			case 'cssproperty':
				cssProperties.push(parseCssPropTag(tag.text))
				break
			case 'csspart':
			case 'part':
				cssParts.push(parseCssPartTag(tag.text))
				break
			case 'attr':
			case 'attribute':
				attributes.push(parseAttrTag(tag.text))
				break
			case 'example': {
				const cleaned = cleanExampleBlock(tag.text)
				if (cleaned) examples.push(cleaned)
				break
			}
			case 'summary':
				declaration.summary = tag.text
				break
			case 'whenToUse':
				declaration.whenToUse = tag.text
				break
			case 'platform':
			case 'platformPrimitive': {
				const pp = parsePlatformTag(tag.text)
				if (pp) declaration.platformPrimitive = pp
				break
			}
		}
	}

	const propertyDecls: Attribute[] = []
	for (const prop of cls.getProperties()) {
		const propDecorator = prop.getDecorators().find(d => d.getName() === 'property')
		if (!propDecorator) continue
		const attrName = readAttributeName(propDecorator, prop.getName())
		if (attrName === false) continue
		const attr: Attribute = { name: attrName }
		const propType = prop.getType()
		const typeText = propType.getText(prop)
		if (typeText) attr.type = { text: typeText }
		const literals = extractStringLiteralUnion(propType)
		if (literals) attr.values = literals
		const initializer = prop.getInitializer()
		if (initializer) attr.default = initializer.getText()
		const propJsDoc = getJsDocTags(prop)
		if (propJsDoc.description) attr.description = propJsDoc.description
		propertyDecls.push(attr)
	}

	const contexts: Context[] = []
	for (const prop of cls.getProperties()) {
		for (const dec of prop.getDecorators()) {
			const name = dec.getName()
			if (name !== 'provide' && name !== 'consume') continue
			const arg = dec.getArguments()[0]
			if (!arg) continue
			const text = arg.getText()
			const keyMatch = text.match(/context\s*:\s*([A-Za-z0-9_$.]+)/)
			const key = keyMatch ? keyMatch[1] : text
			contexts.push({ name: key, kind: name as 'provide' | 'consume' })
		}
	}

	const mergedAttrs = [...propertyDecls, ...attributes.filter(a => !propertyDecls.find(p => p.name === a.name))]
	if (mergedAttrs.length) declaration.attributes = mergedAttrs
	if (events.length) declaration.events = events
	if (slots.length) declaration.slots = slots
	if (cssProperties.length) declaration.cssProperties = cssProperties
	if (cssParts.length) declaration.cssParts = cssParts
	if (examples.length) declaration.examples = examples
	if (contexts.length) declaration.contexts = contexts

	return declaration
}

function extractStringLiteralUnion(type: import('ts-morph').Type): string[] | undefined {
	const nonNullable = type.getNonNullableType()
	if (nonNullable.isStringLiteral()) {
		const v = nonNullable.getLiteralValue()
		return typeof v === 'string' ? [v] : undefined
	}
	if (!nonNullable.isUnion()) return undefined
	const values: string[] = []
	for (const member of nonNullable.getUnionTypes()) {
		const m = member.getNonNullableType()
		if (!m.isStringLiteral()) return undefined
		const v = m.getLiteralValue()
		if (typeof v !== 'string') return undefined
		values.push(v)
	}
	return values.length ? values : undefined
}

function readAttributeName(decorator: { getArguments(): Array<{ getText(): string }> }, fallback: string): string | false {
	const arg = decorator.getArguments()[0]
	if (!arg) return fallback
	const text = arg.getText()
	if (/attribute\s*:\s*false/.test(text)) return false
	const m = text.match(/attribute\s*:\s*['"]([^'"]+)['"]/)
	if (m) return m[1]
	return fallback
}

function extractServices(src: SourceFile): ServiceDeclaration[] {
	const out: ServiceDeclaration[] = []
	for (const decl of src.getVariableDeclarations()) {
		if (!decl.isExported()) continue
		const name = decl.getName()
		const statement = decl.getVariableStatement()
		if (!statement) continue
		const { description, tags } = getJsDocTags(statement)
		const hasServiceTag = tags.some(t => t.name === 'service')
		if (!hasServiceTag) continue
		const service: ServiceDeclaration = { kind: 'variable', name, service: true }
		if (description) service.description = description
		const methods: Array<{ signature: string; summary?: string }> = []
		for (const tag of tags) {
			if (tag.name === 'summary') service.summary = flatten(tag.text)
			else if (tag.name === 'method') {
				const flat = flatten(tag.text)
				const m = flat.match(/^(\S+\([^)]*\)(?:\s*:\s*\S+)?)\s*-?\s*(.*)$/)
				if (m) methods.push(m[2] ? { signature: m[1], summary: m[2].trim() } : { signature: m[1] })
				else methods.push({ signature: flat })
			}
		}
		if (methods.length) service.methods = methods
		out.push(service)
	}
	return out
}

function extractTokens(srcDir: string): string[] {
	const tokens = new Set<string>()
	const iface = readIfExists(resolve(srcDir, 'theme/theme.interface.ts'))
	if (iface) {
		for (const m of iface.matchAll(/var\(--(schmancy-sys-[a-zA-Z0-9-]+)\)/g)) {
			tokens.add(m[1])
		}
	}
	const css = readIfExists(resolve(srcDir, 'theme/theme.style.css'))
	if (css) {
		for (const m of css.matchAll(/--(schmancy-[a-zA-Z0-9-]+)\s*:/g)) {
			tokens.add(m[1])
		}
	}
	return Array.from(tokens).sort()
}

function readIfExists(path: string): string | null {
	try {
		return readFileSync(path, 'utf8')
	} catch {
		return null
	}
}

function buildManifest(project: Project, srcDir: string, readme: string | null): Manifest {
	const modules: Module[] = []
	const sources = project
		.getSourceFiles()
		.filter(f => f.getFilePath().startsWith(srcDir) && !f.getFilePath().endsWith('.d.ts'))

	for (const src of sources) {
		const declarations: Declaration[] = []
		for (const cls of src.getClasses()) {
			const element = extractElement(cls)
			if (element) declarations.push(element)
		}
		for (const svc of extractServices(src)) declarations.push(svc)
		if (declarations.length) {
			modules.push({
				kind: 'javascript-module',
				path: src.getFilePath().slice(srcDir.length + 1),
				declarations,
			})
		}
	}

	return {
		schemaVersion: '1.0.0',
		...(readme ? { readme } : {}),
		modules,
		tokens: extractTokens(srcDir),
		conventions: CONVENTIONS,
	}
}

export interface SchmancyManifestPluginOptions {
	/** Absolute path to packages/schmancy (defaults to plugin invocation cwd). */
	root?: string
}

export default function schmancyManifestPlugin(options: SchmancyManifestPluginOptions = {}): Plugin {
	const root = options.root ?? process.cwd()
	const srcDir = resolve(root, 'src')
	const tsConfigFilePath = resolve(root, 'tsconfig.json')
	let project: Project | null = null
	let cachedManifest: Manifest | null = null

	function ensureProject(): Project {
		if (!project) {
			project = new Project({ tsConfigFilePath, skipAddingFilesFromTsConfig: false })
		}
		return project
	}

	function compute(): Manifest {
		const p = ensureProject()
		const readme = readIfExists(resolve(root, 'README.md'))
		cachedManifest = buildManifest(p, srcDir, readme)
		return cachedManifest
	}

	return {
		name: 'schmancy-manifest',
		enforce: 'post',

		buildStart() {
			compute()
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
			return null
		},

		load(id) {
			if (id !== RESOLVED_VIRTUAL_ID) return null
			const manifest = cachedManifest ?? compute()
			return `export default ${JSON.stringify(manifest)};`
		},

		generateBundle() {
			const manifest = cachedManifest ?? compute()
			this.emitFile({
				type: 'asset',
				fileName: 'schmancy.manifest.json',
				source: JSON.stringify(manifest, null, 2),
			})
		},
	}
}
