import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { TailwindElement } from '@mixins/tailwind.mixin'

type BoatState = 'hidden' | 'minimized' | 'expanded'

@customElement('schmancy-boat')
export default class SchmancyBoat extends TailwindElement(css`
    @media (min-width: 1024px) {
        .translate-y-full-minus-64 {
            /* translate to left 0 */
            transform: translateY(calc(100% - 64px)) !important;
        }
    }
    @media (max-width: 1024px) {
        .translate-y-full-minus-64 {
            /* translate to left 0 */
            transform: translateY(calc(100% - 64px)) !important;
        }
    }

    .translate-y-full-minus-64 {
        transform: translateY(calc(100% - 64px)) !important;
        -webkit-transform: translateY(calc(100% - 64px)) !important;
    }

    .translate-y-full {
        transform: translateY(100%) !important;
        -webkit-transform: translateY(100%) !important;
    }

    .translate-y-0 {
        transform: translateY(0) !important;
        -webkit-transform: translateY(0) !important;
    }
`) {
    @property({
        type: String,
        reflect: true,
    })
    state: BoatState = 'hidden'

    toggleState() {
        this.state = this.state === 'minimized' ? 'expanded' : 'minimized'
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: this.state,
                bubbles: true,
                composed: true,
            }),
        )
    }

    protected render(): unknown {
        const classes = {
            'shadow-2xl h-auto z-[100] w-[100vw] md:w-[70vw] lg:w-[60vw] xl:w-[40vw] max-h-[80vh] fixed bottom-0 right-0 transition-all duration-300 ease-in-out transform-gpu overflow-y-auto flex flex-col':
                true,
            'translate-y-full-minus-64': this.state === 'minimized',
            'translate-y-full': this.state === 'hidden',
            'translate-y-0': this.state === 'expanded',
        }
        return html`
            <div class="${this.classMap(classes)}">
                <section class="sticky top-0 z-10">
                    <schmancy-surface
                        elevation="4"
                        class="cursor-pointer"
                        @click=${() => {
                            this.state = this.state === 'minimized' ? 'expanded' : 'minimized'
                            this.dispatchEvent(
                                new CustomEvent('change', {
                                    detail: this.state,
                                    bubbles: true,
                                    composed: true,
                                }),
                            )
                        }}
                        rounded="top"
                        elevation="1"
                        type="containerLowest"
                    >
                        <div class="sticky top-0 px-4 py-3 flex items-center justify-between gap-4">
                            <div class="flex-1 flex items-center">
                                <slot name="header"></slot>
                            </div>

                            <div class="flex items-center gap-2">
                                <schmancy-icon-button
                                    variant="filled tonal"
                                    @click=${(e: Event) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.toggleState()
                                    }}
                                    title=${this.state === 'minimized' ? 'Expand' : 'Minimize'}
                                >
                                    ${when(
                                        this.state === 'minimized',
                                        () => html`expand`,
                                        () => html`minimize`,
                                    )}
                                </schmancy-icon-button>
                                
                                <schmancy-icon-button
                                    variant="text"
                                    @click=${(e: Event) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.state = 'hidden'
                                        this.dispatchEvent(
                                            new CustomEvent('change', {
                                                detail: this.state,
                                                bubbles: true,
                                                composed: true,
                                            }),
                                        )
                                    }}
                                    title="Close"
                                >
                                    close
                                </schmancy-icon-button>
                            </div>
                        </div>
                    </schmancy-surface>
                </section>
                <schmancy-surface .hidden=${this.state !== 'expanded'} type="containerLow" class="z-0 flex-1">
                    <slot></slot>
                </schmancy-surface>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat
    }
}