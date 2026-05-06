import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'
import schmancyManifestPlugin from './plugins/vite-plugin-schmancy-manifest'

/**
 * Test runner config — decoupled from the library build config so test
 * infrastructure evolves independently. Uses Vitest browser mode with the
 * Playwright provider because:
 *
 * - `adoptedStyleSheets`, `ElementInternals`, `CustomStateSet`, and
 *   form-associated custom elements need a real browser. Happy-dom and jsdom
 *   do not implement these faithfully as of April 2026.
 * - Chromium headless shell is the fastest provider and enough for unit
 *   coverage of component behavior. Add Firefox/WebKit providers when
 *   platform-specific regressions need guarding.
 */
export default defineConfig({
	resolve: {
		alias: [
			// Field-component aliases route to their new home under
			// src/form/fields/<name>/ (set BEFORE the catch-all so they win).
			...['input', 'textarea', 'select', 'autocomplete', 'checkbox', 'switch', 'radio-group', 'date-range', 'range'].flatMap(
				name => [
					{
						find: new RegExp(`^@schmancy/${name}$`),
						replacement: resolve(__dirname, `./src/form/fields/${name}/index.ts`),
					},
					{
						find: new RegExp(`^@schmancy/${name}/(.*)$`),
						replacement: resolve(__dirname, `./src/form/fields/${name}/$1`),
					},
				],
			),
			{ find: /^@schmancy\/(.*)$/, replacement: resolve(__dirname, './src/$1') },
			{ find: /^@mixins\/(.*)$/, replacement: resolve(__dirname, './mixins/$1') },
		],
	},
	plugins: [tailwindcss(), schmancyManifestPlugin({ root: __dirname })],
	test: {
		include: ['src/**/*.{test,spec}.ts', 'mixins/**/*.{test,spec}.ts'],
		// area.service.test.ts is a legacy Node-environment suite that patches
		// `global.history`/`global.location`; excluded until it is converted
		// to the browser harness.
		exclude: ['**/node_modules/**', '**/dist/**', 'src/area/area.service.test.ts'],
		globals: true,
		browser: {
			enabled: true,
			provider: playwright(),
			headless: true,
			instances: [{ browser: 'chromium' }],
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
		},
	},
})
