/**
 * Lazy loading for Schmancy Area components
 * Similar to React.lazy() but adapted for Web Components
 */
type CustomElementConstructor = typeof HTMLElement;
/**
 * LazyComponent interface with preload capability
 */
export interface LazyComponent<T extends CustomElementConstructor = CustomElementConstructor> {
    (): Promise<{
        default: T;
    }>;
    preload(): Promise<void>;
    _promise?: Promise<{
        default: T;
    }>;
    _module?: {
        default: T;
    };
}
/**
 * Create a lazy-loaded component that will be imported on demand
 *
 * @example
 * ```typescript
 * const LazyProfile = lazy(() => import('./profile'))
 *
 * // Use with area.push
 * area.push({
 *   component: LazyProfile,
 *   area: 'main'
 * })
 *
 * // Preload on hover
 * element.addEventListener('mouseenter', () => LazyProfile.preload())
 * ```
 *
 * @param loader - Dynamic import function that returns a module with default export
 * @returns LazyComponent function compatible with area.push()
 */
export declare function lazy<T extends CustomElementConstructor>(loader: () => Promise<{
    default: T;
}>): LazyComponent<T>;
export {};
