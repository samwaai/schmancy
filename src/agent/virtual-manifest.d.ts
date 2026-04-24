declare module 'virtual:schmancy-manifest' {
	type ManifestModule = { kind: 'javascript-module'; path: string; declarations: Array<Record<string, unknown>> }
	const manifest: {
		schemaVersion: '1.0.0'
		readme?: string
		modules: ManifestModule[]
		tokens: string[]
	}
	export default manifest
}
