/**
 * Theme discovery event system.
 *
 * These events facilitate communication between theme components and consumers,
 * allowing components to discover the nearest theme provider in the DOM hierarchy.
 */

/**
 * Event dispatched by components to discover the nearest theme provider.
 * Theme components listen for this event and respond with ThemeHereIAmEvent.
 *
 * @event ThemeWhereAreYouEvent
 * @type {CustomEvent<void>}
 *
 * @example
 * ```typescript
 * // Dispatch discovery request
 * window.dispatchEvent(
 *   new CustomEvent('theme-where-are-you', {
 *     bubbles: true,
 *     composed: true
 *   })
 * )
 * ```
 */
export type ThemeWhereAreYouEvent = CustomEvent<void>

/**
 * Event name constant for theme discovery request.
 * @const {string}
 */
export const ThemeWhereAreYou = 'theme-where-are-you'

/**
 * Event dispatched by theme components in response to discovery requests.
 * Contains reference to the theme component element.
 *
 * @event ThemeHereIAmEvent
 * @type {CustomEvent<{theme: HTMLElement}>}
 * @property {HTMLElement} detail.theme - The theme component element
 *
 * @example
 * ```typescript
 * // Listen for theme response
 * window.addEventListener('theme-here-i-am', (event: ThemeHereIAmEvent) => {
 *   const themeComponent = event.detail.theme
 *   console.log('Found theme component:', themeComponent)
 * })
 * ```
 */
export type ThemeHereIAmEvent = CustomEvent<{
	theme: HTMLElement
}>

/**
 * Event name constant for theme discovery response.
 * @const {string}
 */
export const ThemeHereIAm = 'theme-here-i-am'