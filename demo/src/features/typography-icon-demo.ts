import { $LitElement } from '@mixins/index'
import '@schmancy/typography'
import '@schmancy/icons'
import '@schmancy/surface'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Demo component for testing typography with nested elements like icons
 */
@customElement('typography-icon-demo')
export class TypographyIconDemo extends $LitElement() {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <h2 class="text-xl font-bold mb-4">Typography with Nested Icons Demo</h2>
        
        <div class="flex flex-col gap-4">
          <!-- Example from user request -->
          <schmancy-surface type="surfaceBright" elevation="1" rounded="all" class="p-4">
            <schmancy-typography type="label" token="sm" class="text-on-surface-variant flex items-center justify-center gap-1">
              Displayed Transactions
              <schmancy-icon class="text-on-surface-variant text-sm">info</schmancy-icon>
            </schmancy-typography>
          </schmancy-surface>
          
          <!-- Other examples -->
          <schmancy-surface type="surfaceBright" elevation="1" rounded="all" class="p-4">
            <schmancy-typography type="body" token="md" class="flex items-center gap-2">
              <schmancy-icon>check_circle</schmancy-icon>
              Text with preceding icon
            </schmancy-typography>
          </schmancy-surface>
          
          <schmancy-surface type="surfaceBright" elevation="1" rounded="all" class="p-4">
            <schmancy-typography type="headline" token="md" class="flex items-center gap-2">
              Icons on both sides
              <schmancy-icon>arrow_forward</schmancy-icon>
            </schmancy-typography>
          </schmancy-surface>
          
          <schmancy-surface type="surfaceBright" elevation="1" rounded="all" class="p-4">
            <schmancy-typography type="title" token="lg" class="flex items-center justify-between">
              <span>Justified between</span>
              <schmancy-icon>settings</schmancy-icon>
            </schmancy-typography>
          </schmancy-surface>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'typography-icon-demo': TypographyIconDemo
  }
}