import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

@customElement('schmancy-progress')
export default class SchmancyProgress extends TailwindElement(css`
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

  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md'

  @property({ type: String, reflect: true })
  color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' = 'primary'

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
      'bg-surface-container': true,
      'h-0.5': this.size === 'sm',
      'h-1': this.size === 'md',
      'h-2': this.size === 'lg'
    }

    const barClasses = {
      'h-full': true,
      'rounded-full': true,
      'transition-all': true,
      'duration-300': true,
      'ease-in-out': true,
      'bg-primary-default': this.color === 'primary',
      'bg-secondary-default': this.color === 'secondary',
      'bg-tertiary-default': this.color === 'tertiary',
      'bg-error-default': this.color === 'error',
      'bg-success-default': this.color === 'success',
      'w-[30%]': this.indeterminate,
      'absolute': this.indeterminate,
      'indeterminate-animation': this.indeterminate
    }

    const barStyles = this.indeterminate 
      ? {} 
      : { width: `${this.percentage}%` }

    return html`
      <div class="${classMap(containerClasses)}">
        <div 
          class="${classMap(barClasses)}"
          style="${styleMap(barStyles)}"
          role="progressbar"
          aria-valuenow="${this.value}"
          aria-valuemin="0"
          aria-valuemax="${this.max}"
        ></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-progress': SchmancyProgress
  }
}