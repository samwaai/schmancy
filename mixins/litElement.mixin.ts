import { CSSResult, LitElement } from 'lit'
import { IBaseMixin } from './baseElement'
import { Constructor } from './constructor'
import { SchmancyElement } from './SchmancyElement'

/**
 * @deprecated Extend `SchmancyElement` directly and declare `static styles`.
 *
 *   Before: extends $LitElement(css`...`)
 *   After:  extends SchmancyElement { static styles = [css`...`] }
 *
 * Kept as a thin alias for the migration window; will be removed in the next
 * major Schmancy release. The returned class extends `SchmancyElement` so
 * runtime semantics (Tailwind injection, `disconnecting` Subject,
 * `disconnectedSignal` AbortSignal, SignalWatcher) match exactly.
 */
export const $LitElement = <T extends CSSResult>(componentStyle?: T) => {
	class LegacyAlias extends SchmancyElement {
		static override styles = componentStyle ? [componentStyle] : []
	}
	return LegacyAlias as CustomElementConstructor &
		Constructor<LitElement> &
		Constructor<IBaseMixin>
}
