/**
 * Lazy loading for Schmancy Area components
 * Similar to React.lazy() but adapted for Web Components
 */

// Type definition for custom element constructors
type CustomElementConstructor = typeof HTMLElement

/**
 * LazyComponent interface with preload capability
 */
export interface LazyComponent<T extends CustomElementConstructor = CustomElementConstructor> {
  (): Promise<{ default: T }>
  preload(): Promise<void>
  _promise?: Promise<{ default: T }>
  _module?: { default: T }
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
export function lazy<T extends CustomElementConstructor>(
  loader: () => Promise<{ default: T }>
): LazyComponent<T> {

  // Create the lazy component function
  const lazyComponent = function(): Promise<{ default: T }> {
    // Return cached promise if already loading/loaded
    if (lazyComponent._promise) {
      return lazyComponent._promise
    }

    // Return cached module if already loaded
    if (lazyComponent._module) {
      return Promise.resolve(lazyComponent._module)
    }

    // Start loading and cache the promise
    lazyComponent._promise = loader()
      .then(module => {
        // Cache the loaded module
        lazyComponent._module = module
        return module
      })
      .catch(error => {
        // Clear promise on error to allow retry
        lazyComponent._promise = undefined
        throw error
      })

    return lazyComponent._promise
  } as LazyComponent<T>

  // Add preload method for manual preloading
  lazyComponent.preload = async function(): Promise<void> {
    try {
      await lazyComponent()
    } catch (error) {
      console.error('Failed to preload component:', error)
    }
  }

  return lazyComponent
}


