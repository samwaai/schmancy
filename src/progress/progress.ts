import { $LitElement } from '@mixins/litElement.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

@customElement('schmancy-progress')
export default class SchmancyProgress extends $LitElement(css`
  :host {
    display: block;
  }

  @keyframes indeterminate {
    0% {
      left: -30%;
    }
    100% {
      left: 100%;
    }
  }

  .indeterminate-animation {
    animation: indeterminate 1.5s infinite ease-in-out;
  }
`) {
  @property({ type: Number, reflect: true })
  value = 0

  @property({ type: Number, reflect: true })
  max = 100

  @property({ type: Boolean, reflect: true })
  indeterminate = false

  // M3 aligned track heights: xs=1px, sm=2px, md=4px, lg=8px
  @property({ type: String, reflect: true })
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md'

  @property({ type: String, reflect: true })
  color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' = 'primary'

  @property({ type: Boolean, reflect: true })
  glass = false

  private get percentage(): number {
    if (this.indeterminate) return 0
    return Math.min(100, Math.max(0, (this.value / this.max) * 100))
  }

  protected render() {
    const containerClasses = {
      'w-full': true,
      'relative': true,
      'overflow-hidden': true,
      'rounded-full': true,
      'h-px': this.size === 'xs',   // 1px - M3 linear indicator track
      'h-0.5': this.size === 'sm',  // 2px
      'h-1': this.size === 'md',    // 4px - M3 default
      'h-2': this.size === 'lg',    // 8px
      // Glass effect background
      'backdrop-blur-xl': this.glass,
      'backdrop-saturate-150': this.glass,
      'bg-surface-container/20': this.glass && !this.indeterminate,
      'bg-surface-container': !this.glass,
      'shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.1)]': this.glass,
      'border': this.glass,
      'border-outline/20': this.glass
    }

    const barClasses = {
      'h-full': true,
      'rounded-full': true,
      'transition-all': true,
      'duration-300': true,
      'ease-in-out': true,
      'relative': true,
      'bg-primary-default': this.color === 'primary' && !this.glass,
      'bg-secondary-default': this.color === 'secondary' && !this.glass,
      'bg-tertiary-default': this.color === 'tertiary' && !this.glass,
      'bg-error-default': this.color === 'error' && !this.glass,
      'bg-success-default': this.color === 'success' && !this.glass,
      'w-[30%]': this.indeterminate,
      'absolute': this.indeterminate,
      'indeterminate-animation': this.indeterminate
    }

    const barStyles = this.indeterminate 
      ? {} 
      : { width: `${this.percentage}%` }

    // Glass effect bar classes
    const glassBarClasses = {
      'backdrop-blur-sm': this.glass,
      'shadow-[0_0_20px_rgba(0,0,0,0.1)]': this.glass,
      // Use semi-transparent background colors for glass effect
      'bg-primary-default/70': this.glass && this.color === 'primary',
      'bg-secondary-default/70': this.glass && this.color === 'secondary',
      'bg-tertiary-default/70': this.glass && this.color === 'tertiary',
      'bg-error-default/70': this.glass && this.color === 'error',
      'bg-success-default/70': this.glass && this.color === 'success',
    }

    return html`
      <div class="${classMap(containerClasses)}">
        <div 
          class="${classMap({...barClasses, ...glassBarClasses})}"
          style="${styleMap(barStyles)}"
          role="progressbar"
          aria-valuenow="${this.value}"
          aria-valuemin="0"
          aria-valuemax="${this.max}"
        >
          ${this.glass ? html`
            <!-- Glass shine effect -->
            <div class="absolute inset-0 bg-linear-to-b from-surface-on/20 to-transparent rounded-full"></div>
          ` : ''}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-progress': SchmancyProgress
  }
}
