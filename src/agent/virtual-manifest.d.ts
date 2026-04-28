declare module 'virtual:schmancy-manifest' {
	type ManifestModule = { kind: 'javascript-module'; path: string; declarations: Array<Record<string, unknown>> }
	type ManifestRule = {
		id: string
		scope: 'global' | 'tag' | 'token' | 'attribute' | 'workflow'
		applies?: string[]
		rule: string
		severity: 'error' | 'warn' | 'hint'
		validator?: string
	}
	const manifest: {
		/** '1.1.0' adds the structured `rules` array. `conventions` stays for back-compat. */
		schemaVersion: '1.1.0'
		readme?: string
		modules: ManifestModule[]
		tokens: string[]
		conventions: string[]
		rules: ManifestRule[]
	}
	export default manifest
}
