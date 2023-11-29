import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

@customElement('schmancy-sheet-content')
export default class SchmancySheetContent extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
    inset: 0;
    max-width: 100vw;
    max-height: 100vh;
  }
`) {
  /**
   * Should the close button be displayed
   * @type {boolean}
   * @attr
   * @default true
   */
  @property({ type: Boolean }) closeButton = true

  /**
   * color of the component
   * @type {'primary' | 'secondary'}
   * @attr
   * @default 'primary'
   * @description primary: white background, secondary: grey background
   */
  @property({ type: String }) color: 'primary' | 'secondary' = 'primary'

  render() {
    return html`
      ${when(
        this.closeButton,
        () =>
          html` <div class="absolute right-2 top-2  z-10">
            <button
              class="relative transition-all w-8 h-8 hover:scale-110 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full  shadow-gray-500 shadow-sm   "
              @click=${() => {
                this.dispatchEvent(
                  new CustomEvent('bottomSheetCloseRequested', {
                    bubbles: true,
                    composed: true
                  })
                )
              }}
            >
              <span class="text-md">✕</span>
            </button>
          </div>`
      )}
      <div class="bg-neutral-50 shadow-md  rounded-md overflow-scroll" tabindex="0">
        <slot></slot>
      </div>
    `
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'schmancy-sheet-content': SchmancySheetContent
  }
}
