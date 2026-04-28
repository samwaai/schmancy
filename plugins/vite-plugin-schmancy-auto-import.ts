/**
 * Vite plugin — auto-inject `@mhmo91/schmancy/<subpath>` side-effect
 * imports per source file based on which `<schmancy-*>` tags appear in
 * its `html\`\`` templates.
 *
 * Schmancy's components self-register via `customElements.define`, and
 * the package has no `sideEffects: false`. A wholesale
 * `import '@mhmo91/schmancy'` therefore keeps every component in the
 * consumer bundle. This plugin reads the package's own
 * `custom-elements.json` once at startup, scans every non-
 * `node_modules` `.ts` / `.tsx` file in the consumer at transform
 * time, extracts the `<schmancy-*>` tags from its templates, and
 * prepends `import '@mhmo91/schmancy/<subpath>';` for the matching
 * subpaths. Vite splits each subpath into its own chunk; unused
 * subpaths fall out of the bundle. Consumers keep clean source files
 * (no per-file boilerplate, no maintained registration list) while
 * the bundler sees explicit, narrow imports.
 *
 * Tags whose source path doesn't resolve to a top-level dist entry
 * (`schmancy-avatar`, `schmancy-skill`, …) fall through silently —
 * the consumer is expected to register those eagerly in its app
 * entry. `schmancy-splash-screen` is the typical eager case in
 * single-page apps because it usually appears in `index.html`, which
 * the plugin doesn't scan.
 *
 * The transform regex matches any opening `<schmancy-foo` token,
 * including occurrences inside JS comments. Comment-only mentions
 * cause a small over-import (one extra subpath) but never a missing
 * one.
 *
 * Usage in `vite.config.ts`:
 *
 *   import { schmancyAutoImport } from '@mhmo91/schmancy/vite';
 *   export default defineConfig({
 *     plugins: [schmancyAutoImport()],
 *   });
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Structural plugin shape — avoids importing vite's `Plugin` type, whose
// deep generic graph triggers a TS2321 "Excessive stack depth" error
// when the consumer's vite installation differs from schmancy's. Vite
// accepts any object that matches this shape structurally.
type VitePlugin = {
	name: string
	enforce?: 'pre' | 'post'
	transform?: (code: string, id: string) => { code: string; map: null } | null
}

interface SchmancyAutoImportOptions {
	/** Override the schmancy `custom-elements.json` location. */
	manifestPath?: string
	/** Override the schmancy `dist/` directory used to filter unmapped tags. */
	distDir?: string
	/** Override the package specifier used in injected imports. */
	packageName?: string
	/** Override the tag prefix to scan for. */
	tagPrefix?: string
	/**
	 * Optional substring required in the file `id` for the transform to
	 * apply. Useful in monorepos to restrict scans to a specific source
	 * root (e.g. `'/web/src/'`). When omitted, every non-`node_modules`
	 * `.ts` / `.tsx` file is scanned.
	 */
	includeRoot?: string
}

interface SchmancyManifestTag {
	name: string
	path: string
}

interface SchmancyManifest {
	version: string
	tags: SchmancyManifestTag[]
}

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_MANIFEST = path.resolve(HERE, '../custom-elements.json')
const DEFAULT_DIST = path.resolve(HERE, '../dist')

const TAG_RE = /<\s*(schmancy-[a-z][a-z0-9-]*)/g
// dist filenames look like `name-HASH.js` for code-split chunks vs
// `name.js` for named entries. Eight or more chars of hex/base64 after a
// dash distinguishes a chunk hash from a hyphenated entry like
// `content-drawer.js`.
const HASH_CHUNK_RE = /-[A-Za-z0-9_-]{8,}\.js$/

function manifestPathToSubpath(p: string): string {
	const noPrefix = p.replace(/^\.\/src\//, '')
	return noPrefix.includes('/') ? (noPrefix.split('/')[0] ?? '') : noPrefix.replace(/\.tsx?$/, '')
}

export function schmancyAutoImport(options: SchmancyAutoImportOptions = {}): VitePlugin {
	const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST
	const distDir = options.distDir ?? DEFAULT_DIST
	const packageName = options.packageName ?? '@mhmo91/schmancy'
	const tagPrefix = options.tagPrefix ?? 'schmancy-'
	const includeRoot = options.includeRoot

	const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as SchmancyManifest
	const distEntries = new Set(
		readdirSync(distDir)
			.filter(f => f.endsWith('.js'))
			.filter(f => !HASH_CHUNK_RE.test(f))
			.map(f => f.replace(/\.js$/, '')),
	)

	const tagToSubpath = new Map<string, string>()
	for (const tag of manifest.tags) {
		if (!tag.name.startsWith(tagPrefix)) continue
		const sub = manifestPathToSubpath(tag.path)
		if (distEntries.has(sub)) tagToSubpath.set(tag.name, sub)
	}

	return {
		name: 'vite-plugin-schmancy-auto-import',
		enforce: 'pre',
		transform(code, id) {
			if (!id.endsWith('.ts') && !id.endsWith('.tsx')) return null
			if (id.includes('/node_modules/')) return null
			if (includeRoot && !id.includes(includeRoot)) return null

			const subpaths = new Set<string>()
			TAG_RE.lastIndex = 0
			let match: RegExpExecArray | null
			while ((match = TAG_RE.exec(code))) {
				const sub = tagToSubpath.get(match[1]!)
				if (sub) subpaths.add(sub)
			}
			if (subpaths.size === 0) return null

			const banner = [...subpaths]
				.toSorted()
				.map(s => `import '${packageName}/${s}';`)
				.join('\n')

			return { code: `${banner}\n${code}`, map: null }
		},
	}
}
