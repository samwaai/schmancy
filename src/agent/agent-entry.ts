// Single-URL bundle for sandboxed-iframe agents (Claude Design, Artifacts,
// any host that can only write HTML and consume one esm.sh URL). Side-effect
// import of the root registers every `<schmancy-*>` tag; re-exporting the
// root gives in-page script code the full library surface from the same URL.
//
// `SchmancyElement` is re-exported from `../../mixins/index` because the
// root index doesn't currently surface mixins. The deprecated `$LitElement`
// alias is intentionally NOT re-exported here — agent contexts get the
// canonical base class.
import '../index'

export * from '../index'
export { SchmancyElement } from '../../mixins/index'
