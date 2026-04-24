import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import schmancyManifestPlugin from './plugins/vite-plugin-schmancy-manifest'

const root = __dirname

export default defineConfig({
	root,
	plugins: [tailwindcss(), schmancyManifestPlugin({ root })],
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
		'process.env': JSON.stringify({ NODE_ENV: 'production' }),
		'process.platform': JSON.stringify('browser'),
	},
	build: {
		emptyOutDir: true,
		outDir: resolve(root, 'dist/agent'),
		sourcemap: 'hidden',
		lib: {
			entry: resolve(root, 'src/agent/agent-entry.ts'),
			formats: ['es'],
			fileName: () => 'schmancy.agent.js',
		},
		rollupOptions: {
			external: [],
			output: {
				// Split the heaviest vendor deps into separate chunks so the
				// primary bundle (first parse cost) stays lean. Each chunk still
				// loads when a consuming tag is instantiated — native ESM resolves
				// the sibling URLs automatically, so the agent still writes exactly
				// one <script type="module">.
				manualChunks(id) {
					if (id.includes('highlight.js')) return 'vendor-highlight'
					if (id.includes('jsqr')) return 'vendor-jsqr'
					if (id.includes('@material/material-color-utilities')) return 'vendor-material-color'
					return undefined
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
					mangle: { properties: { regex: /^__/ } },
				}),
			],
		},
	},
})
