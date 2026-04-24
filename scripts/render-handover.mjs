#!/usr/bin/env node
/**
 * Substitute `{{version}}` in handover/**\/*.md against package.json's
 * current version, writing rendered copies to dist/handover/. The source
 * stays templated so the next publish re-renders automatically; the
 * rendered copies ship via the `dist` entry in package.json's `files`.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

const SRC = join(ROOT, 'handover')
const DEST = join(ROOT, 'dist', 'handover')

function* walkMd(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) yield* walkMd(path)
		else if (name.endsWith('.md')) yield path
	}
}

mkdirSync(DEST, { recursive: true })
let count = 0
for (const src of walkMd(SRC)) {
	const rel = src.slice(SRC.length + 1)
	const dest = join(DEST, rel)
	mkdirSync(dirname(dest), { recursive: true })
	const rendered = readFileSync(src, 'utf8').replace(/\{\{version\}\}/g, version)
	writeFileSync(dest, rendered)
	count++
}
console.log(`render-handover: ${count} file(s) → dist/handover/ (v${version})`)
