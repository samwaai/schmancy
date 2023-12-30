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
    const classes = {
      'font-semibold relative cursor-pointer py-2 pl-3 pr-9': true,
      'bg-secondary-container text-secondery-onContainer': this.selected,
    }
    const stateLayerClasses = {
      'duration-500 transition-opacity': true,
      'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0': true,

    }

    return html` <li
      tabindex="0"
      class="${this.classMap(classes)}"
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
    <div class="${this.classMap(stateLayerClasses)}"></div> 
      <slot></slot>
    </li>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-option': SchmancyOption
  }
}
