import { $LitElement } from '../../mixins'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

@customElement('schmancy-boat')
export default class SchmancyBoat extends $LitElement(css`
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
    state: 'hidden' | 'minimized' | 'expanded' = 'hidden'

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
            'shadow-2xl h-auto z-[100] w-[100vw] md:w-[70vw] lg:w-[60vw] xl:w-[40vw] max-h-[80vh] fixed bottom-0 right-0 transition-all duration-300 ease-in-out transform-gpu overflow-y-auto':
                true,
            'translate-y-full-minus-64': this.state === 'minimized',
            'translate-y-full': this.state === 'hidden',
            'translate-y-0': this.state === 'expanded',
        }
        return html`
            <schmancy-grid rows="auto 1fr" class="${this.classMap(classes)}">
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
                        <schmancy-grid
                            cols="auto 1fr auto auto"
                            content="center"
                            justify="stretch"
                            class="sticky top-0 px-4 py-3"
                            gap="md"
                        >
                            <slot name="header"></slot>
                            <span></span>

                            <schmancy-button
                                variant="filled tonal"
                                @click=${(e: Event) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    this.toggleState()
                                }}
                            >
                                ${when(
                                    this.state === 'minimized',
                                    () => html`<schmancy-icon>expand</schmancy-icon>`,
                                    () => html`<schmancy-icon>hide</schmancy-icon>`,
                                )}
                            </schmancy-button>
                        </schmancy-grid>
                    </schmancy-surface>
                </section>
                <schmancy-surface .hidden=${this.state !== 'expanded'} type="containerLow" class="z-0 flex-1">
                    <slot></slot>
                </schmancy-surface>
            </schmancy-grid>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat
    }
}