import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdir } from 'fs/promises'
import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import Sitemap from 'vite-plugin-sitemap'
import webfontDownload from 'vite-plugin-webfont-dl'

const getDirectories = async source =>
	(await readdir(source, { withFileTypes: true })).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
const components = await getDirectories(resolve(__dirname, './src/')) // |> ["animate", "teleport"]
// https://vitejs.dev/config/
export default defineConfig({
	root: resolve(__dirname),
	publicDir: resolve(__dirname, './public'),
	resolve: {
		alias: {
			'@schmancy': resolve(__dirname, '/src'),
		},
	},
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
			external: /^(lit|rxjs|animejs)/,
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
			],
		},
	},
	plugins: [
		// VitePWA({
		//   ...basePWAConfig,
		// }),
		webfontDownload(['https://ticket.funkhaus-berlin.net/assets/GT-Eesti-Pro-Display-Regular-Czpp09nv.woff']),
		// Sitemap({
		// 	generateRobotsTxt: true,
		// 	outDir: resolve(__dirname, './public'),
		// 	// hostname: 'https://lit-kit.web.app/',
		// }),
	],
})
