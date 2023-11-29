import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'
import style from './menu.scss?inline'
import anime from 'animejs'

@customElement('schmancy-menu')
export default class SchmancyMenu extends TailwindElement(style) {
  @state() open = false
  @queryAssignedElements({ flatten: true, slot: 'button' }) buttonElement!: Array<HTMLElement>
  @query('#menu') menuElement!: HTMLElement
  openMenu() {
    this.open = true
    anime({
      targets: [this.menuElement],
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 100,
      easing: 'easeInQuad',
      begin: () => {
        this.open = true
      }
    })
  }
  closeMenu() {
    anime({
      targets: [this.menuElement],
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 75,
      easing: 'easeInQuad',
      complete: () => {
        this.open = false
      }
    })
  }

  protected firstUpdated(): void {
    fromEvent(this.buttonElement, 'click')
      .pipe(takeUntil(this.disconnecting))
      .subscribe(() => {
        this.openMenu()
      })

    fromEvent(this, 'schmancy-menu-item-click')
      .pipe(takeUntil(this.disconnecting))
      .subscribe((e) => {
        e.stopPropagation()
        this.closeMenu()
      })
  }

  render() {
    return html` <div class="relative flex-none">
      <slot name="button">
        <button
          slot="button"
          type="button"
          class="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 hover:rounded-full"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
            />
          </svg>
        </button>
      </slot>
      <div class="fixed inset-0 z-10" .hidden=${!this.open} @click=${this.closeMenu}></div>
      <div
        id="menu"
        .hidden=${!this.open}
        class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu-4-button"
        tabindex="-1"
      >
        <slot></slot>
      </div>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-menu': SchmancyMenu
  }
}
