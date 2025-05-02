import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * A basic dialog content component that doesn't add any padding or styling
 * Used for rendering raw content in a dialog
 *
 * @element schmancy-dialog-content
 * @slot default - Content slot for dialog content without any styling
 */
@customElement('schmancy-dialog-content')
export class SchmancyDialogContent extends $LitElement(css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
`) {
  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-dialog-content': SchmancyDialogContent
  }
}