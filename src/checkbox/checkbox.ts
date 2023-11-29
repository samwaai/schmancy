import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import TailwindElement from '../mixin/tailwind/tailwind.mixin'

export type schmancyCheckBoxChangeEvent = CustomEvent<{
  value: boolean
}>

/**
 * @element sizekick-checkbox
 * @slot - The label for the checkbox.
 * @fires valueChange - Event fired when the checkbox value changes.
 **/

@customElement('schmancy-checkbox')
export class SizekickCheckbox extends TailwindElement() {
  /**
   * @attr {boolean} value - The value of the checkbox.
   */
  @property({ type: Boolean })
  value = false

  /**
   * @attr {boolean} disabled - The disabled state of the checkbox.
   */
  @property({ type: Boolean })
  disabled = false

  /**
   * @attr {boolean} required - The required state of the checkbox.
   */
  @property({ type: Boolean })
  required = false

  /**
   * @attr {string} name - The name of the checkbox.
   */
  @property({ type: String })
  name = 'checkbox-' + Math.random().toString(36)

  /**
   * @attr {string} id - The id of the checkbox.
   */
  @property({ type: String })
  id = 'checkbox-' + Math.random().toString(36)

  /**
   * @attr {sm | md | lg } size - The size of the checkbox.
   */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md'

  render() {
    const inputClasses = {
      'text-sm': this.size === 'sm',
      'text-base': this.size === 'md',
      'text-lg': this.size === 'lg',
      'h-4 w-4': this.size === 'sm',
      'h-6 w-6': this.size === 'md',
      'h-8 w-8': this.size === 'lg'
    }
    return html`
      <div class="relative flex items-start">
        <div class="flex  items-center">
          <input
            @change=${(e: any) => {
              this.dispatchEvent(
                new CustomEvent('change', {
                  detail: {
                    value: e.target.checked
                  }
                })
              )
            }}
            id=${this.id}
            aria-describedby="comments-description"
            name=${this.name}
            type="checkbox"
            class="rounded border-gray-300 text-secondary-key focus:text-secondary-key ${classMap(
              inputClasses
            )}"
            value=${this.value}
            .checked=${this.value}
          />
        </div>
        <div class="ml-3 text-sm">
          <label for=${this.id} class="font-medium text-gray-700">
            <slot></slot>
          </label>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sizekick-checkbox': SizekickCheckbox
  }
}
