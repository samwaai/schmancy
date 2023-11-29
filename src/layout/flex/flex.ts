import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import Layout from '../layout/layout'
import style from './flex.scss?inline'
@customElement('schmancy-flex')
export class SchmancyFlex extends Layout {
  static styles = [Layout.styles, unsafeCSS(style)]
  layout = true
  @property({ type: String, reflect: true }) flow: 'row' | 'row-reverse' | 'col' | 'col-reverse' =
    'row'
  @property({ type: String, reflect: true }) wrap: 'wrap' | 'nowrap' | 'wrap-reverse' = 'wrap'
  @property({ type: String, reflect: true }) align:
    | 'start'
    | 'center'
    | 'end'
    | 'stretch'
    | 'baseline' = 'start'
  @property({ type: String, reflect: true }) justify: 'start' | 'center' | 'end' | 'stretch' =
    'start'
  @property({ type: String, reflect: true }) gap: string | undefined

  render() {
    const classes = {
      flex: true,
      // Direction
      'flex-col': this.flow === 'row',
      'flex-col-reverse': this.flow === 'row-reverse',
      'flex-row': this.flow === 'col',
      'flex-row-reverse': this.flow === 'col-reverse',
      // Wrap
      'flex-wrap': this.wrap === 'wrap',
      'flex-wrap-reverse': this.wrap === 'wrap-reverse',
      'flex-nowrap': this.wrap === 'nowrap',
      // Justify
      'items-start': this.justify === 'start',
      'items-center': this.justify === 'center',
      'items-end': this.justify === 'end',
      'items-stretch': this.justify === 'stretch',

      // Align
      'justify-center': this.align === 'center',
      'justify-end': this.align === 'end',
      'justify-start': this.align === 'start',
      'justify-stretch': this.align === 'stretch',
      'justify-baseline': this.align === 'baseline'
    }

    const styles = {
      gap: this.gap
    }
    return html`
      <section class=${classMap(classes)} style=${styleMap(styles)}>
        <slot></slot>
      </section>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-flex': SchmancyFlex
  }
}
