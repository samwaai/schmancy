import { TailwindElement } from '@mixins/index';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
  }
  
  summary::-webkit-details-marker {
    display: none;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .content-animated {
    animation: slideDown 0.2s ease-out;
  }
  
  :host([variant="outlined"]) details {
    border: 1px solid var(--schmancy-sys-color-outline);
  }
  
  :host([variant="filled"]) details {
    background-color: var(--schmancy-sys-color-surface-container);
  }
  
  :host([variant="elevated"]) details {
    background-color: var(--schmancy-sys-color-surface-container);
    box-shadow: var(--schmancy-sys-elevation-1);
  }
  
  :host([variant="elevated"]) details[open] {
    box-shadow: var(--schmancy-sys-elevation-2);
  }
`) {
  @property() summary = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) variant: 'default' | 'outlined' | 'filled' | 'elevated' = 'default';
  
  render() {
    return html`
      <details 
        ?open=${this.open} 
        @toggle=${this._handleToggle}
        class="w-full rounded-lg">
        <summary class="cursor-pointer select-none p-3 px-4 list-none flex items-center gap-3 transition-all duration-200 rounded-lg text-surface-on hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary-default focus-visible:outline-offset-2">
          <span class="inline-flex items-center justify-center w-5 h-5 transition-transform duration-200 flex-shrink-0 ${this.open ? 'rotate-90' : ''}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="flex-1 font-medium">
            <slot name="summary">${this.summary}</slot>
          </span>
        </summary>
        <div class="px-4 pb-4 pl-12 text-surface-onVariant content-animated">
          <slot></slot>
        </div>
      </details>
    `;
  }
  
  private _handleToggle(e: Event) {
    const details = e.target as HTMLDetailsElement;
    this.open = details.open;
    this.dispatchEvent(new CustomEvent('toggle', { 
      detail: { open: this.open },
      bubbles: true,
      composed: true 
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-details': SchmancyDetails;
  }
}