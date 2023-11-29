import TailwindElement from '@renderer/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-paper')
export default class SchmancyPaper extends TailwindElement() {
  protected render(): unknown {
    return html`<div class=" bg-white px-4 py-5 sm:px-6">
      <slot> </slot>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-paper': SchmancyPaper
  }
}
