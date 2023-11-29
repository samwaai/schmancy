import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
export type SchmancyOptionChangeEvent = CustomEvent<{
  value: string
  label: string
}>
@customElement('schmancy-option')
export default class SchmancyOption extends TailwindElement() {
  @property({ type: String, reflect: true }) value: string = ''
  @property({ type: String, reflect: true }) label: string | undefined
  @property({ type: Boolean }) selected: boolean = false

  handleOptionClick(option: string) {
    this.value = option
    this.dispatchEvent(
      new CustomEvent('click', {
        detail: { value: option, label: this.label ?? this.innerText },
        bubbles: true,
        composed: true
      }) as SchmancyOptionChangeEvent
    )
  }

  protected render(): unknown {
    const selectedClass = {
      'font-semibold': true
    }
    return html` <li
      tabindex="0"
      class="relative cursor-pointer py-2 pl-3 pr-9 text-gray-900  hover:bg-gray-100 ${this.classMap(
        selectedClass
      )}"
      role="option"
      @click=${(e) => {
        e.stopPropagation()
        e.preventDefault()
        this.handleOptionClick(this.value)
      }}
      @keydown=${(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation()
          e.preventDefault()
          this.handleOptionClick(this.value)
        }
      }}
    >
      <slot></slot>
    </li>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-option': SchmancyOption
  }
}
