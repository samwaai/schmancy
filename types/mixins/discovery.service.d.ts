import { Observable } from 'rxjs';
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
