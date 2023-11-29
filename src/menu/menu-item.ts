import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { fromEvent } from 'rxjs'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends TailwindElement() {
  connectedCallback(): void {
    super.connectedCallback()
    fromEvent(this, 'click').subscribe((e) => {
      e.stopPropagation()
      this.dispatchEvent(
        new CustomEvent('schmancy-menu-item-click', {
          bubbles: true,
          composed: true
        })
      )
    })
  }
  protected render(): unknown {
    return html`
      <a
        href="javascript:void(0)"
        class="block px-3 py-1 text-sm leading-6 text-gray-900  hover:bg-gray-100"
        role="menuitem"
        tabindex="0"
      >
        <slot></slot>
      </a>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-menu-item': SchmancyMenuItem
  }
}
