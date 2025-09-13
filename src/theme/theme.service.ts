import {
  BehaviorSubject,
  Observable,
  fromEvent,
  timer,
  map,
  takeUntil,
  defaultIfEmpty,
  distinctUntilChanged,
  shareReplay,
  tap,
  switchMap,
  of
} from 'rxjs'
import { ThemeHereIAm, ThemeHereIAmEvent, ThemeWhereAreYou } from './theme.events'
import type { SchmancyThemeComponent } from './theme.component'
import type { TSchmancyTheme } from './theme.interface'

/**
 * Theme Service - Provides centralized theme management for Schmancy components.
 *
 * This service acts as a singleton interface to interact with the theme system,
 * providing reactive observables for theme state and methods to control theming.
 *
 * @example
 * ```typescript
 * import { theme } from '@schmancy/theme'
 *
 * // Subscribe to theme changes
 * theme.scheme$.subscribe(scheme => {
 *   console.log('Current scheme:', scheme) // 'light' | 'dark' | 'auto'
 * })
 *
 * // Get current values synchronously
 * const currentScheme = theme.scheme
 * const currentColor = theme.color
 *
 * // Toggle between light and dark mode
 * theme.toggleScheme()
 *
 * // Set specific scheme
 * theme.setScheme('dark')
 *
 * // Check if dark mode is active
 * theme.isDarkMode().subscribe(isDark => {
 *   console.log('Is dark mode:', isDark)
 * })
 * ```
 */
class ThemeService {
  private static instance: ThemeService

  // Observable properties for theme values
  private _scheme$ = new BehaviorSubject<'dark' | 'light' | 'auto'>('auto')
  private _color$ = new BehaviorSubject<string>('#6200ee')
  private _theme$ = new BehaviorSubject<Partial<TSchmancyTheme>>({})
  private _themeComponent$ = new BehaviorSubject<SchmancyThemeComponent | null>(null)

  // Public observables
  public readonly scheme$ = this._scheme$.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  public readonly color$ = this._color$.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  public readonly theme$ = this._theme$.asObservable().pipe(
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    shareReplay(1)
  )

  public readonly themeComponent$ = this._themeComponent$.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  // Getters for synchronous access to current values
  get scheme(): 'dark' | 'light' | 'auto' {
    return this._scheme$.getValue()
  }

  get color(): string {
    return this._color$.getValue()
  }

  get theme(): Partial<TSchmancyTheme> {
    return this._theme$.getValue()
  }

  get themeComponent(): SchmancyThemeComponent | null {
    return this._themeComponent$.getValue()
  }

  // Computed observable for actual scheme (resolving 'auto')
  public readonly resolvedScheme$ = this.scheme$.pipe(
    switchMap(scheme => {
      if (scheme === 'auto') {
        // Listen to system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        return new Observable<'dark' | 'light'>(subscriber => {
          const handler = (e: MediaQueryListEvent) => {
            subscriber.next(e.matches ? 'dark' : 'light')
          }
          mediaQuery.addEventListener('change', handler)

          // Emit initial value
          subscriber.next(mediaQuery.matches ? 'dark' : 'light')

          // Cleanup
          return () => mediaQuery.removeEventListener('change', handler)
        })
      }
      return of(scheme as 'dark' | 'light')
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  constructor() {
    this.discoverTheme()
  }

  /**
   * Discover the nearest theme component in the DOM.
   * This method can be called to refresh the theme discovery process.
   *
   * @returns {Observable<SchmancyThemeComponent | null>} Observable that emits the discovered theme component or null
   *
   * @example
   * ```typescript
   * theme.discoverTheme().subscribe(component => {
   *   if (component) {
   *     console.log('Theme component found:', component)
   *   } else {
   *     console.log('No theme component found')
   *   }
   * })
   * ```
   */
  public discoverTheme(): Observable<SchmancyThemeComponent | null> {
    // Dispatch discovery event and wait for response
    return fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm).pipe(
      takeUntil(timer(100)), // Wait up to 100ms for response
      map(e => e.detail.theme as SchmancyThemeComponent),
      defaultIfEmpty(null),
      tap(themeComponent => {
        if (themeComponent) {
          this.registerThemeComponent(themeComponent)
        }
      })
    ).pipe(
      tap(() => {
        // Trigger theme discovery
        window.dispatchEvent(
          new CustomEvent(ThemeWhereAreYou, {
            bubbles: true,
            composed: true,
          })
        )
      }),
      switchMap(() =>
        fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm).pipe(
          takeUntil(timer(100)),
          map(e => e.detail.theme as SchmancyThemeComponent),
          defaultIfEmpty(null),
          tap(themeComponent => {
            if (themeComponent) {
              this.registerThemeComponent(themeComponent)
            }
          })
        )
      )
    )
  }

  /**
   * Register a theme component and subscribe to its changes.
   * This is typically called internally by theme components when they mount or update.
   *
   * @param {SchmancyThemeComponent} component - The theme component to register
   *
   * @internal
   */
  public registerThemeComponent(component: SchmancyThemeComponent): void {
    this._themeComponent$.next(component)

    // Update values from the component
    this._scheme$.next(component.scheme)
    this._color$.next(component.color)
    this._theme$.next(component.theme)
  }

  /**
   * Update theme values. Usually called internally by theme components.
   *
   * @param {Object} values - Theme values to update
   * @param {'dark' | 'light' | 'auto'} [values.scheme] - Color scheme to set
   * @param {string} [values.color] - Primary color in hex format
   * @param {Partial<TSchmancyTheme>} [values.theme] - Theme configuration object
   *
   * @internal
   */
  public updateTheme(values: {
    scheme?: 'dark' | 'light' | 'auto'
    color?: string
    theme?: Partial<TSchmancyTheme>
  }): void {
    if (values.scheme !== undefined) {
      this._scheme$.next(values.scheme)
    }
    if (values.color !== undefined) {
      this._color$.next(values.color)
    }
    if (values.theme !== undefined) {
      this._theme$.next(values.theme)
    }
  }

  /**
   * Set the color scheme for the application.
   *
   * @param {'dark' | 'light' | 'auto'} scheme - The color scheme to set
   *
   * @example
   * ```typescript
   * // Set to dark mode
   * theme.setScheme('dark')
   *
   * // Set to auto (follows system preference)
   * theme.setScheme('auto')
   * ```
   */
  public setScheme(scheme: 'dark' | 'light' | 'auto'): void {
    const component = this.themeComponent
    if (component) {
      component.scheme = scheme
      this._scheme$.next(scheme)
    } else {
      console.warn('No theme component found. Scheme change may not persist.')
      this._scheme$.next(scheme)
    }
  }

  /**
   * Set the primary color for the theme.
   *
   * @param {string} color - Primary color in hex format (e.g., '#6200ee')
   *
   * @example
   * ```typescript
   * // Set primary color to purple
   * theme.setColor('#6200ee')
   *
   * // Set primary color to blue
   * theme.setColor('#2196f3')
   * ```
   */
  public setColor(color: string): void {
    const component = this.themeComponent
    if (component) {
      component.color = color
      this._color$.next(color)
    } else {
      console.warn('No theme component found. Color change may not persist.')
      this._color$.next(color)
    }
  }

  /**
   * Check if dark mode is currently active.
   * This resolves 'auto' scheme to the actual value based on system preference.
   *
   * @returns {Observable<boolean>} Observable that emits true if dark mode is active, false otherwise
   *
   * @example
   * ```typescript
   * theme.isDarkMode().subscribe(isDark => {
   *   if (isDark) {
   *     console.log('Dark mode is active')
   *   } else {
   *     console.log('Light mode is active')
   *   }
   * })
   * ```
   */
  public isDarkMode(): Observable<boolean> {
    return this.resolvedScheme$.pipe(
      map(scheme => scheme === 'dark')
    )
  }

  /**
   * Toggle between light and dark mode.
   * If currently in 'auto' mode, defaults to 'light'.
   *
   * @example
   * ```typescript
   * // Toggle theme on button click
   * button.addEventListener('click', () => {
   *   theme.toggleScheme()
   * })
   * ```
   */
  public toggleScheme(): void {
    const currentScheme = this.scheme
    const newScheme = currentScheme === 'dark' ? 'light' :
                     currentScheme === 'light' ? 'dark' :
                     'light' // If 'auto', default to 'light'
    this.setScheme(newScheme)
  }

  /**
   * Get the current value of a CSS variable from the theme.
   *
   * @param {string} variableName - Name of the CSS variable (without '--schmancy-' prefix)
   * @returns {string} The CSS variable value or empty string if not found
   *
   * @example
   * ```typescript
   * // Get primary color variable
   * const primaryColor = theme.getCSSVariable('color-primary')
   *
   * // Get surface color
   * const surfaceColor = theme.getCSSVariable('color-surface')
   * ```
   */
  public getCSSVariable(variableName: string): string {
    const component = this.themeComponent
    if (component) {
      const host = component.root ? document.body : (component.shadowRoot?.host as HTMLElement)
      if (host) {
        return getComputedStyle(host).getPropertyValue(`--schmancy-${variableName}`).trim()
      }
    }
    return ''
  }

  /**
   * Subscribe to changes of a specific CSS variable.
   *
   * @param {string} variableName - Name of the CSS variable to watch (without '--schmancy-' prefix)
   * @returns {Observable<string>} Observable that emits the CSS variable value when it changes
   *
   * @example
   * ```typescript
   * // Watch for primary color changes
   * theme.watchCSSVariable('color-primary').subscribe(color => {
   *   console.log('Primary color changed to:', color)
   * })
   *
   * // Watch for surface color changes
   * theme.watchCSSVariable('color-surface').subscribe(color => {
   *   console.log('Surface color changed to:', color)
   * })
   * ```
   */
  public watchCSSVariable(variableName: string): Observable<string> {
    return this.theme$.pipe(
      map(() => this.getCSSVariable(variableName)),
      distinctUntilChanged()
    )
  }

  /**
   * Get the singleton instance of ThemeService.
   *
   * @returns {ThemeService} The singleton ThemeService instance
   *
   * @internal
   */
  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService()
    }
    return ThemeService.instance
  }
}

// Export singleton instance
export const theme = ThemeService.getInstance()
export default theme