import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readdir } from 'fs/promises'
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

/** Directories under src/ that are developer/test scaffolding, not shipped
 *  in dist. Kept out of the entry map so the library build doesn't fail on
 *  missing index files. */
const NON_SHIPPED = new Set(['test-utils'])

const getDirectories = async (source: string) =>
	(await readdir(source, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
		.filter(name => !NON_SHIPPED.has(name))

const components = await getDirectories(resolve(__dirname, './src/'))

export default defineConfig({
	root: resolve(__dirname),
	publicDir: resolve(__dirname, './public'),
	resolve: {
		alias: {
			'@schmancy': resolve(__dirname, '/src'),
			'@mixins': resolve(__dirname, '/mixins'),
		},
	},
	plugins: [tailwindcss()],
	build: {
		lib: {
			entry: components.reduce(
				(acc, current) => ({
					...acc,
					[current]: resolve(__dirname, `./src/${current}/index.ts`),
				}),
				{
					index: resolve(__dirname, './src/index.ts'),
					mixins: resolve(__dirname, './mixins/index.ts'),
				},
			),
		},
		sourcemap: 'hidden',
		rollupOptions: {
			external: /^(lit|rxjs|animejs|moment|@floating-ui|highlight\.js|jsqr)/,
			output: {
				dir: resolve(__dirname, './dist'),
				globals: {
					lit: 'lit',
					'lit/decorators.js': 'lit/decorators.js',
				},
			},
			plugins: [
				strip({
					include: '**/*.(ts|js)',
					functions: ['console.log', 'assert.*', 'debug'],
					sourceMap: true,
				}),
				terser({
					compress: {
						drop_console: true,
					},
					format: {
						comments: false,
					},
					mangle: {
						properties: {
							regex: /^__/,
						},
					},
				}),
				copy({
					// Copy Claude Code plugin assets + docs into dist
					targets: [
						{
							src: resolve(__dirname, '.claude-plugin') + '/**/*',
							dest: resolve(__dirname, 'dist/.claude-plugin'),
						},
						{
							src: resolve(__dirname, 'skills') + '/**/*',
							dest: resolve(__dirname, 'dist/skills'),
						},
					],
					// Ensures it runs after everything else is bundled
					hook: 'writeBundle',
				}),
				// existing plugins...
				// dts({
				// 	// e.g., if your TS build outputs to `dist/types`
				// 	tsconfig: resolve(__dirname, 'tsconfig.json'),
				// }),
			],
		},
	},
})
