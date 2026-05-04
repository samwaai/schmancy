import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readdir } from 'fs/promises'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const labRoot = resolve(__dirname)
const labSrc = resolve(labRoot, 'src')

const getDirectories = async (source: string) =>
	(await readdir(source, { withFileTypes: true }))
		.filter(d => d.isDirectory())
		.map(d => d.name)

const components = await getDirectories(labSrc)

export default defineConfig({
	root: labRoot,
	resolve: {
		alias: {
			'@schmancy': resolve(labRoot, '../src'),
			'@mixins': resolve(labRoot, '../mixins'),
		},
	},
	plugins: [tailwindcss()],
	build: {
		emptyOutDir: true,
		lib: {
			entry: components.reduce(
				(acc, current) => ({
					...acc,
					[current]: resolve(labSrc, current, 'index.ts'),
				}),
				{
					index: resolve(labSrc, 'index.ts'),
				},
			),
		},
		sourcemap: 'hidden',
		rollupOptions: {
			// Externalize core schmancy + every transitive runtime so the lab
			// bundle stays a thin layer over peer deps; consumers install lab
			// alongside @mhmo91/schmancy.
			external:
				/^(@mhmo91\/schmancy|lit|rxjs|jsqr|@floating-ui|@lit-labs\/signals|@lit-labs\/motion|@lit-labs\/virtualizer|@lit\/context|signal-polyfill)/,
			output: {
				dir: resolve(labRoot, 'dist'),
				globals: {
					lit: 'lit',
					'lit/decorators.js': 'lit/decorators.js',
					'@mhmo91/schmancy': '@mhmo91/schmancy',
				},
			},
			plugins: [
				strip({
					include: '**/*.(ts|js)',
					functions: ['console.log', 'assert.*', 'debug'],
					sourceMap: true,
				}),
				terser({
					compress: { drop_console: true },
					format: { comments: false },
				}),
			],
		},
	},
})
