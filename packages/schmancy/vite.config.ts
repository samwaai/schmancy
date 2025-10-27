import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readdir } from 'fs/promises'
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import webfontDownload from 'vite-plugin-webfont-dl'
import tailwindcss from '@tailwindcss/vite'

const getDirectories = async (source: string) =>
	(await readdir(source, { withFileTypes: true })).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

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
	// @ts-ignore
	test: {
		// Vitest configuration options
		globals: true,
		environment: 'happy-dom',
		coverage: {
			provider: 'c8',
			reporter: ['text', 'json', 'html'],
		},
		exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**'],
	},
	plugins: [
		webfontDownload(['https://ticket.funkhaus-berlin.net/assets/GT-Eesti-Pro-Display-Regular-Czpp09nv.woff']),
		tailwindcss(),
	],
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
		sourcemap: true,
		rollupOptions: {
			external: /^(lit|rxjs|animejs|moment|@floating-ui)/,
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
					// Copy the ai folder into dist
					targets: [
						{
							src: resolve(__dirname, 'ai') + '/**/*',
							dest: resolve(__dirname, 'dist/ai'),
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
