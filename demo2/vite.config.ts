import { basePWAConfig } from './vite.pwa-config'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import webfontDownload from 'vite-plugin-webfont-dl'
import Sitemap from 'vite-plugin-sitemap'
import { resolve } from 'path'

export default defineConfig({
	root: resolve(__dirname),
	publicDir: resolve(__dirname, 'public'),

	resolve: {
		alias: {
			src: resolve(__dirname, './src'),

			'@schmancy': resolve(__dirname, '../src'),
		},
	},
	build: {
		target: 'esnext',
	},
	plugins: [
		// VitePWA({
		//   ...basePWAConfig,
		// }),
		// @ts-ignore - vite-plugin-webfont-dl
		webfontDownload([
			'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Kanit:wght@400;700&display=swap',
		]),
		Sitemap({
			generateRobotsTxt: true,
			outDir: resolve(__dirname, './public'),
			// hostname: 'https://lit-kit.web.app/',
		}),
	],
})
