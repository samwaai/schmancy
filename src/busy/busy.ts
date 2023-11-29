import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-busy')
export default class SchmancyBusy extends TailwindElement(css`
  :host {
    display: inline;
    position: absolute;
    inset: 0;
  }
`) {
  protected render(): unknown {
    return html`
      <div class="absolute inset-0 flex justify-center items-center">
        <!-- glass window -->
        <div
          class="absolute transform-gpu inset-0 rounded-[inherit] blur-3xl bg-slate-300 opacity-50"
        ></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-busy': SchmancyBusy
  }
}
