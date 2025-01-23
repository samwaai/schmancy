import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readdir } from 'fs/promises'
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import webfontDownload from 'vite-plugin-webfont-dl'
import tailwindcss from '@tailwindcss/vite'

const getDirectories = async source =>
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
	plugins: [webfontDownload(['https://ticket.funkhaus-berlin.net/assets/GT-Eesti-Pro-Display-Regular-Czpp09nv.woff'])],
	build: {
		lib: {
			entry: components.reduce(
				(acc, current) => ({
					...acc,
					[current]: resolve(__dirname, `./src/${current}/index.ts`),
				}),
				{
					index: resolve(__dirname, './src/index.ts'),
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
					functions: ['console.log', 'assert.*', 'debug', 'alert'],
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
					// Copy the mixins folder into dist/mixins
					targets: [
						{
							src: resolve(__dirname, 'mixins') + '/**/*',
							dest: resolve(__dirname, 'dist/mixins'),
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
