import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readdir } from 'fs/promises'
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

/** Directories under src/ that are developer/test scaffolding, not shipped
 *  in dist by the main library build. `agent/` has its own self-contained
 *  build produced by vite.config.agent.ts and must stay out of the main
 *  build — its entry file imports `virtual:schmancy-manifest`, resolvable
 *  only when the manifest plugin is loaded. */
const NON_SHIPPED = new Set(['test-utils', 'agent'])

const getDirectories = async (source: string) =>
	(await readdir(source, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
		.filter(name => !NON_SHIPPED.has(name))

const components = await getDirectories(resolve(__dirname, './src/'))

// Watch mode keeps existing dist/ files so consumers (e.g. the parent
// monorepo's web vite server) never see a missing dist/index.js between
// rebuilds. Full builds still wipe to avoid stale outputs.
const isWatch = process.argv.includes('--watch') || process.argv.includes('-w')

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
		emptyOutDir: !isWatch,
		// Constrain rollup's watch scope so writes to dist/ (sourcemaps,
		// in-place overwrites) and copy-plugin source touches don't
		// re-trigger the build in an infinite loop. Both rollup's
		// include/exclude and chokidar's lower-level ignored list are
		// set — rollup filters which file events trigger a rebuild,
		// chokidar prevents the events from being emitted at all.
		watch: isWatch
			? {
					include: ['src/**', 'mixins/**'],
					exclude: [
						'dist/**',
						'types/**',
						'node_modules/**',
						'.claude-plugin/**',
						'skills/**',
						'public/**',
						'**/.git/**',
					],
					chokidar: {
						ignored: [
							'**/dist/**',
							'**/types/**',
							'**/node_modules/**',
							'**/.claude-plugin/**',
							'**/skills/**',
							'**/public/**',
							'**/.git/**',
						],
					},
				}
			: null,
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
			external:
				/^(lit|rxjs|animejs|moment|@floating-ui|highlight\.js|jsqr|@lit-labs\/signals|@lit-labs\/motion|@lit-labs\/virtualizer|@lit\/context|signal-polyfill)/,
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
