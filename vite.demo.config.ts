/** @type {import('vite').UserConfig} */

import { resolve } from 'path'
import { defineConfig } from 'vite'
import webfontDownload from 'vite-plugin-webfont-dl'

// https://vitejs.dev/config/
export default defineConfig({
	root: resolve(__dirname),
	publicDir: resolve(__dirname, 'public'),
	resolve: {
		alias: {
			'@schmancy': resolve(__dirname, './src'),
			'@mixins': resolve(__dirname, './mixins'),
		},
	},
	server: {
		cors: true,
		port: 5174,
	},
	envDir: resolve(__dirname + '/.env'),
	build: {
		sourcemap: false,
		outDir: resolve(__dirname, './dist'),
		rollupOptions: {
			output: {
				manualChunks: {
					rxjs: ['rxjs', 'rxjs/ajax'],
					lit: [
						'lit',
						'lit/decorators.js',
						'lit/directives/class-map.js',
						'lit/directives/style-map.js',
						'lit/directives/repeat.js',
						'lit/directives/when.js',
						'lit/directives/live.js',
						'lit/directives/if-defined.js',
						'lit/directives/guard.js',
						'lit/directives/unsafe-html.js',
						'lit/directives/unsafe-svg.js',
						'lit/directives/cache.js',
					],
				},
			},
		},
	},
	plugins: [webfontDownload(['https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap'])],
})
