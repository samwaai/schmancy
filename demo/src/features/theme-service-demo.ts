import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { theme } from '../../../src/theme'
import { takeUntil } from 'rxjs'
import { $LitElement } from '@mixins/litElement.mixin'

@customElement('theme-service-demo')
export class ThemeServiceDemo extends $LitElement(css`
  :host {
    display: block;
    padding: 2rem;
  }
`) {
  @state() private currentScheme: 'dark' | 'light' | 'auto' = 'auto'
  @state() private currentColor: string = '#6200ee'
  @state() private resolvedScheme: 'dark' | 'light' = 'light'
  @state() private isDark: boolean = false

  connectedCallback() {
    super.connectedCallback()

    // Subscribe to theme changes
    theme.scheme$.pipe(takeUntil(this.disconnecting)).subscribe(scheme => {
      this.currentScheme = scheme
    })

    theme.color$.pipe(takeUntil(this.disconnecting)).subscribe(color => {
      this.currentColor = color
    })

    theme.resolvedScheme$.pipe(takeUntil(this.disconnecting)).subscribe(scheme => {
      this.resolvedScheme = scheme
    })

    theme.isDarkMode().pipe(takeUntil(this.disconnecting)).subscribe(isDark => {
      this.isDark = isDark
    })
  }

  private handleColorChange(e: Event) {
    const input = e.target as HTMLInputElement
    theme.setColor(input.value)
  }

  private handleSchemeChange(scheme: 'dark' | 'light' | 'auto') {
    theme.setScheme(scheme)
  }

  private toggleTheme() {
    theme.toggleScheme()
  }

  render() {
    return html`
      <schmancy-surface elevation="2" rounded="all" class="p-6 space-y-6">
        <schmancy-typography type="headline" size="lg">
          Theme Service Demo
        </schmancy-typography>

        <div class="space-y-4">
          <schmancy-typography type="headline" size="sm">
            Current Theme Values
          </schmancy-typography>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <schmancy-typography type="label" class="mb-1">
                Scheme Setting:
              </schmancy-typography>
              <schmancy-badge color="primary">
                ${this.currentScheme}
              </schmancy-badge>
            </div>

            <div>
              <schmancy-typography type="label" class="mb-1">
                Resolved Scheme:
              </schmancy-typography>
              <schmancy-badge color="secondary">
                ${this.resolvedScheme}
              </schmancy-badge>
            </div>

            <div>
              <schmancy-typography type="label" class="mb-1">
                Is Dark Mode:
              </schmancy-typography>
              <schmancy-badge color="${this.isDark ? 'success' : 'warning'}">
                ${this.isDark ? 'Yes' : 'No'}
              </schmancy-badge>
            </div>

            <div>
              <schmancy-typography type="label" class="mb-1">
                Primary Color:
              </schmancy-typography>
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded border border-outline"
                  style="background-color: ${this.currentColor}"
                ></div>
                <schmancy-typography type="body" size="sm">
                  ${this.currentColor}
                </schmancy-typography>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <schmancy-typography type="headline" size="sm">
            Theme Controls
          </schmancy-typography>

          <div class="space-y-3">
            <div>
              <schmancy-typography type="label" class="mb-2">
                Color Scheme
              </schmancy-typography>
              <div class="flex gap-2">
                <schmancy-button
                  variant="${this.currentScheme === 'light' ? 'filled' : 'outlined'}"
                  @click="${() => this.handleSchemeChange('light')}"
                >
                  Light
                </schmancy-button>
                <schmancy-button
                  variant="${this.currentScheme === 'dark' ? 'filled' : 'outlined'}"
                  @click="${() => this.handleSchemeChange('dark')}"
                >
                  Dark
                </schmancy-button>
                <schmancy-button
                  variant="${this.currentScheme === 'auto' ? 'filled' : 'outlined'}"
                  @click="${() => this.handleSchemeChange('auto')}"
                >
                  Auto
                </schmancy-button>
              </div>
            </div>

            <div>
              <schmancy-typography type="label" class="mb-2">
                Primary Color
              </schmancy-typography>
              <div class="flex gap-2 items-center">
                <input
                  type="color"
                  .value="${this.currentColor}"
                  @change="${this.handleColorChange}"
                  class="w-20 h-10 rounded cursor-pointer"
                />
                  variant="tonal"
                  @click="${() => theme.setColor('#6200ee')}"
                >
                  Reset to Default
                </schmancy-button>
              </div>
            </div>

            <div>
              <schmancy-button
                variant="filled"
                @click="${this.toggleTheme}"
              >
                Toggle Theme
              </schmancy-button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <schmancy-typography type="headline" size="sm">
            Usage Example
          </schmancy-typography>

          <schmancy-surface type="containerLow" rounded="all" class="p-4">
            <schmancy-code-preview language="typescript">
${`import { theme } from '@schmancy/theme';

// Get current values
console.log(theme.scheme); // 'light' | 'dark' | 'auto'
console.log(theme.color); // '#6200ee'

// Subscribe to changes
theme.scheme$.subscribe(scheme => {
  console.log('Scheme changed:', scheme);
});

theme.color$.subscribe(color => {
  console.log('Color changed:', color);
});

// Check if dark mode is active
theme.isDarkMode().subscribe(isDark => {
  console.log('Is dark mode:', isDark);
});

// Set values
theme.setScheme('dark');
theme.setColor('#ff5722');
theme.toggleScheme();

// Get CSS variables
const primaryColor = theme.getCSSVariable('sys-color-primary-default');`}
            </schmancy-code-preview>
          </schmancy-surface>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-service-demo': ThemeServiceDemo
  }
}