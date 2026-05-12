/**
 * Beta directive — gates content behind a configurable predicate.
 *
 * The consumer app registers a predicate (e.g. "user belongs to internal org")
 * via `setBetaPredicate(...)`. Until then, `isBeta()` returns `false` and the
 * directive renders the fallback.
 *
 * Usage:
 * ```typescript
 * import { beta, setBetaPredicate } from '@mhmo91/schmancy'
 *
 * // App boot — wire the predicate
 * setBetaPredicate(() => currentUser.email.endsWith('@example.com'))
 *
 * // Templates — renders nothing for non-beta users
 * ${beta(html`<my-beta-feature></my-beta-feature>`)}
 *
 * // With fallback
 * ${beta(html`<beta-ui></beta-ui>`, html`<coming-soon></coming-soon>`)}
 *
 * // Imperative check
 * if (isBeta()) { ... }
 * ```
 */
import { nothing, type TemplateResult } from 'lit'

type Content = TemplateResult | typeof nothing | string | unknown

let predicate: () => boolean = () => false

/** Register a predicate that decides whether the current user has beta access. */
export function setBetaPredicate(fn: () => boolean): void {
	predicate = fn
}

/** Returns true if the current user has beta access. */
export function isBeta(): boolean {
	return predicate()
}

/** Render content only for beta users, otherwise render fallback (default: nothing). */
export function beta(content: Content, fallback: Content = nothing): Content {
	return isBeta() ? content : fallback
}
