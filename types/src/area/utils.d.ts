import { RouteComponent } from './route.component';
import { RouteAction, ActiveRoute } from './router.types';
/**
 * Compare two custom element constructors for equality
 * @param constructor1 First constructor to compare
 * @param constructor2 Second constructor to compare
 * @returns true if constructors are functionally equivalent
 */
export declare function compareCustomElementConstructors(constructor1: CustomElementConstructor | Function, constructor2: CustomElementConstructor | Function): boolean;
/**
 * Normalize a component tag name for comparison
 * @param tagName Tag name to normalize
 * @returns Normalized tag name
 */
export declare function normalizeTagName(tagName: string): string;
/**
 * Get tag name from a component
 * @param component Component to get tag name from
 * @returns Tag name or null if unable to determine
 */
export declare function getTagName(component: RouteComponent): string | null;
/**
 * Deep merge two objects
 * @param target Target object
 * @param source Source object to merge
 * @returns Merged object
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
/**
 * Check if value is a plain object
 * @param obj Value to check
 * @returns true if value is a plain object
 */
export declare function isObject(obj: any): obj is Record<string, any>;
/**
 * Debounce a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Create a URL-safe string from route state
 * @param state Route state object
 * @returns URL-safe encoded string
 */
export declare function encodeRouteState(state: Record<string, unknown>): string;
/**
 * Decode a URL-safe string to route state
 * @param encoded Encoded string
 * @returns Decoded route state or empty object
 */
export declare function decodeRouteState(encoded: string): Record<string, unknown>;
/**
 * Compare two route actions for equality
 * @param a First route action
 * @param b Second route action
 * @returns true if route actions are equal
 */
export declare function compareRouteActions(a: RouteAction, b: RouteAction): boolean;
/**
 * Compare two active routes for equality
 * @param a First active route
 * @param b Second active route
 * @returns true if active routes are equal
 */
export declare function compareActiveRoutes(a: ActiveRoute, b: ActiveRoute): boolean;
/**
 * Create a cache key from a route action
 * @param route Route action
 * @returns Cache key string
 */
export declare function createRouteCacheKey(route: RouteAction): string;
/**
 * Sanitize route state to remove sensitive data
 * @param state Route state
 * @param keysToRemove Keys to remove from state
 * @returns Sanitized state
 */
export declare function sanitizeRouteState(state: Record<string, unknown>, keysToRemove?: string[]): Record<string, unknown>;
/**
 * Extract query parameters from URL
 * @param url URL string or URLSearchParams
 * @returns Object with query parameters
 */
export declare function extractQueryParams(url?: string | URLSearchParams): Record<string, string>;
/**
 * Build query string from parameters object
 * @param params Parameters object
 * @returns Query string with leading '?'
 */
export declare function buildQueryString(params: Record<string, string | number | boolean>): string;
