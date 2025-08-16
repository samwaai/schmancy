import { TailwindElement } from '@mixins/index';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
  }
  
  details {
    width: 100%;
  }
  
  summary {
    cursor: pointer;
    user-select: none;
    padding: 0.75rem 1rem;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
    border-radius: 0.5rem;
    color: var(--schmancy-sys-color-surface-on);
  }
  
  summary:hover {
    background-color: var(--schmancy-sys-color-surface-container);
  }
  
  summary:focus-visible {
    outline: 2px solid var(--schmancy-sys-color-primary-default);
    outline-offset: 2px;
  }
  
  .chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  
  details[open] .chevron {
    transform: rotate(90deg);
  }
  
  summary::-webkit-details-marker {
    display: none;
  }
  
  .summary-content {
    flex: 1;
    font-weight: 500;
  }
  
  .content {
    padding: 0 1rem 1rem 3rem;
    color: var(--schmancy-sys-color-surface-onVariant);
    animation: slideDown 0.2s ease-out;
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
  
  :host([variant="outlined"]) details {
    border: 1px solid var(--schmancy-sys-color-outline);
    border-radius: 0.5rem;
  }
  
  :host([variant="filled"]) details {
    background-color: var(--schmancy-sys-color-surface-container);
    border-radius: 0.5rem;
  }
  
  :host([variant="elevated"]) details {
    background-color: var(--schmancy-sys-color-surface-container);
    box-shadow: var(--schmancy-sys-elevation-1);
    border-radius: 0.5rem;
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
      <details ?open=${this.open} @toggle=${this._handleToggle}>
        <summary>
          <span class="chevron">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="summary-content">
            <slot name="summary">${this.summary}</slot>
          </span>
        </summary>
        <div class="content">
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