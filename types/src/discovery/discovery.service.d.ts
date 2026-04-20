import { Observable } from 'rxjs';
/**
 * Global discovery event names
 */
declare const DISCOVER_EVENT = "schmancy-discover";
declare const DISCOVER_RESPONSE_EVENT = "schmancy-discover-response";
/**
 * Discovery request detail
 */
interface DiscoverRequest {
    selector: string;
    requestId: string;
}
/**
 * Discovery response detail
 */
interface DiscoverResponse {
    requestId: string;
    element: HTMLElement;
}
/**
 * Discover a component in the DOM using the WhereAreYou/HereIAm pattern.
 *
 * @param componentTag - The tag name of the component to discover (e.g., 'schmancy-navigation-rail')
 * @param timeout - How long to wait for a response in milliseconds (default: 100)
 * @returns Observable that emits the discovered component or null if not found
 */
export declare function discoverComponent<T extends HTMLElement>(componentTag: string, timeout?: number): Observable<T | null>;
/**
 * Discover any of multiple components using race.
 * Returns the first component that responds.
 *
 * @param componentTags - Array of component tag names to discover
 * @returns Observable that emits the first discovered component or null if none found
 */
export declare function discoverAnyComponent<T extends HTMLElement>(...componentTags: string[]): Observable<T | null>;
/**
 * Universal element discovery - finds ANY element by CSS selector across shadow DOM boundaries.
 * Uses event-based discovery pattern - no DOM traversal needed.
 *
 * How it works:
 * 1. Broadcasts a discovery request event on window
 * 2. All $LitElement components receive this event and check their shadow DOM
 * 3. If a match is found, they respond with the element
 *
 * @param selector - CSS selector (e.g., '#my-id', '.my-class', '[data-attr]')
 * @param timeout - How long to wait for a response in milliseconds (default: 150)
 * @returns Observable that emits the discovered element or null if not found
 *
 * @example
 * ```typescript
 * // Find element by ID across shadow boundaries
 * discoverElement('#app-card-melanie').subscribe(el => {
 *   if (el) console.log('Found:', el)
 * })
 *
 * // Find element by class
 * discoverElement('.special-button').subscribe(el => {...})
 * ```
 */
export declare function discoverElement<T extends HTMLElement>(selector: string, timeout?: number): Observable<T | null>;
/**
 * Discover multiple elements matching a selector.
 * Collects all responses within the timeout period.
 *
 * @param selector - CSS selector
 * @param timeout - How long to collect responses (default: 150ms)
 * @returns Observable that emits array of discovered elements
 */
export declare function discoverAllElements<T extends HTMLElement>(selector: string, timeout?: number): Observable<T[]>;
/**
 * Smart discovery - automatically detects if input is a CSS selector or component tag.
 *
 * @param query - CSS selector (starts with #, ., [) OR component tag name
 * @param timeout - How long to wait (default: 150ms)
 * @returns Observable that emits the discovered element or null
 *
 * @example
 * ```typescript
 * // CSS selector - uses discoverElement
 * discover('#my-element').subscribe(...)
 *
 * // Component tag - uses discoverComponent
 * discover('schmancy-fancy').subscribe(...)
 * ```
 */
export declare function discover<T extends HTMLElement>(query: string, timeout?: number): Observable<T | null>;
export { DISCOVER_EVENT, DISCOVER_RESPONSE_EVENT };
export type { DiscoverRequest, DiscoverResponse };
