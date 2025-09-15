import { theme as themeService } from './theme.service'
import { combineLatest } from 'rxjs'

/**
 * Material Design Theme Stylesheet Manager
 *
 * Creates and manages a single shared CSSStyleSheet instance that maps
 * Schmancy theme CSS variables to Material Design Web component variables.
 * This approach uses Constructable Stylesheets for optimal performance,
 * with only one subscription to the theme service instead of per-component.
 */
class MDThemeStylesheetManager {
  private static instance: MDThemeStylesheetManager
  private stylesheet: CSSStyleSheet
  private initialized = false

  private constructor() {
    // Create the shared stylesheet
    this.stylesheet = new CSSStyleSheet()

    // Initialize theme subscription
    this.initializeThemeSubscription()
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): MDThemeStylesheetManager {
    if (!MDThemeStylesheetManager.instance) {
      MDThemeStylesheetManager.instance = new MDThemeStylesheetManager()
    }
    return MDThemeStylesheetManager.instance
  }

  /**
   * Get the shared stylesheet for components to adopt
   */
  public getStylesheet(): CSSStyleSheet {
    return this.stylesheet
  }

  /**
   * Initialize theme subscription and update stylesheet on changes
   */
  private initializeThemeSubscription(): void {
    if (this.initialized) return
    this.initialized = true

    // Subscribe to both theme and scheme changes
    combineLatest([
      themeService.theme$,
      themeService.resolvedScheme$
    ]).subscribe(() => {
      this.updateStylesheet()
    })

    // Initial update
    this.updateStylesheet()
  }

  /**
   * Update the stylesheet with current theme variables
   */
  private updateStylesheet(): void {
    // Get the root element to read computed styles
    const rootElement = document.documentElement
    const computedStyle = getComputedStyle(rootElement)

    // Build CSS rules for MD variable mappings
    const colorMappings = [
      // Primary colors
      ['primary-default', 'primary'],
      ['primary-on', 'on-primary'],
      ['primary-container', 'primary-container'],
      ['primary-onContainer', 'on-primary-container'],

      // Secondary colors
      ['secondary-default', 'secondary'],
      ['secondary-on', 'on-secondary'],
      ['secondary-container', 'secondary-container'],
      ['secondary-onContainer', 'on-secondary-container'],

      // Tertiary colors
      ['tertiary-default', 'tertiary'],
      ['tertiary-on', 'on-tertiary'],
      ['tertiary-container', 'tertiary-container'],
      ['tertiary-onContainer', 'on-tertiary-container'],

      // Error colors
      ['error-default', 'error'],
      ['error-on', 'on-error'],
      ['error-container', 'error-container'],
      ['error-onContainer', 'on-error-container'],

      // Surface colors
      ['surface-default', 'surface'],
      ['surface-dim', 'surface-dim'],
      ['surface-bright', 'surface-bright'],
      ['surface-container', 'surface-container'],
      ['surface-container-low', 'surface-container-low'],
      ['surface-container-high', 'surface-container-high'],
      ['surface-container-highest', 'surface-container-highest'],
      ['surface-container-lowest', 'surface-container-lowest'],
      ['surface-on', 'on-surface'],
      ['surface-onVariant', 'on-surface-variant'],

      // Outline colors
      ['outline', 'outline'],
      ['outlineVariant', 'outline-variant'],

      // Background/Scrim
      ['scrim', 'scrim'],
    ]

    // Build CSS text with all variable mappings
    let cssText = ':host {\n'

    // Map Schmancy variables to MD variables
    colorMappings.forEach(([schmancySuffix, mdSuffix]) => {
      const schmancyVar = `--schmancy-sys-color-${schmancySuffix}`
      const value = computedStyle.getPropertyValue(schmancyVar).trim()

      if (value) {
        cssText += `  --md-sys-color-${mdSuffix}: var(${schmancyVar});\n`
      }
    })

    // Add state layer opacity for MD components
    cssText += `  --md-sys-state-hover-opacity: 0.08;\n`
    cssText += `  --md-sys-state-focus-opacity: 0.12;\n`
    cssText += `  --md-sys-state-pressed-opacity: 0.12;\n`
    cssText += `  --md-sys-state-dragged-opacity: 0.16;\n`

    // Set ripple color based on primary
    cssText += `  --md-ripple-color: var(--schmancy-sys-color-primary-default);\n`

    // Set color-scheme for proper native controls theming
    const scheme = themeService.scheme === 'dark' ||
                   (themeService.scheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                   ? 'dark' : 'light'
    cssText += `  color-scheme: ${scheme};\n`

    cssText += '}'

    // Replace the stylesheet rules
    try {
      // Clear existing rules
      while (this.stylesheet.cssRules.length > 0) {
        this.stylesheet.deleteRule(0)
      }

      // Add the new rule
      this.stylesheet.insertRule(cssText, 0)
    } catch (error) {
      console.error('Failed to update MD theme stylesheet:', error)
    }
  }
}

// Export singleton instance getter
export function getMDThemeStylesheet(): CSSStyleSheet {
  return MDThemeStylesheetManager.getInstance().getStylesheet()
}