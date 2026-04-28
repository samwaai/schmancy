/**
 * Agent bundle entry — the single-URL ESM distribution.
 *
 * Importing this module side-effect-registers every `<schmancy-*>` custom
 * element and exposes the imperative service surface ($dialog, sheet,
 * $notify, etc.). The import is meant for standalone HTML files and
 * one-page demos that want schmancy without a bundler.
 *
 * **Not** an agent-introspection runtime. Earlier versions installed a
 * `window.schmancy` object with `help()` / `tokens()` / `findFor()` for
 * a hypothetical "live agent in a browser" consumer that never materialised
 * in any shipping product. AI consumers (Claude Design's source ingestion,
 * IDE tooling, build pipelines) read the static manifest at
 * `dist/agent/schmancy.manifest.json` — that's the actual integration point.
 *
 * The bundle stays as a distribution convenience; the runtime introspection
 * surface was removed in favour of static-data consumption.
 */
import '../index'

export {
	$dialog,
	$notify,
	sheet,
	SchmancySheetPosition,
	schmancyContentDrawer,
	theme,
	area,
	lazy,
	createContext,
	select,
	selectItem,
} from '../index'
export { $LitElement } from '../../mixins/index'
