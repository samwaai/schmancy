import { expect, describe, it } from 'vitest';
import './button';
import type { SchmancyButton } from './button';

describe('SchmancyButton', () => {
  it('should treat "tonal" variant as "filled tonal"', () => {
    const button = document.createElement('schmancy-button') as SchmancyButton;
    button.variant = 'tonal';
    document.body.appendChild(button);

    // Force a render
    button.requestUpdate();

    // The rendered output should have the same classes as 'filled tonal'
    const shadowRoot = button.shadowRoot;
    const buttonElement = shadowRoot?.querySelector('button');

    // Check that the button has the correct tonal background class
    expect(buttonElement?.classList.contains('bg-secondary-container')).toBe(true);
    expect(buttonElement?.classList.contains('text-secondary-onContainer')).toBe(true);

    document.body.removeChild(button);
  });

  it('should still support "filled tonal" variant', () => {
    const button = document.createElement('schmancy-button') as SchmancyButton;
    button.variant = 'filled tonal';
    document.body.appendChild(button);

    // Force a render
    button.requestUpdate();

    // The rendered output should have the tonal classes
    const shadowRoot = button.shadowRoot;
    const buttonElement = shadowRoot?.querySelector('button');

    // Check that the button has the correct tonal background class
    expect(buttonElement?.classList.contains('bg-secondary-container')).toBe(true);
    expect(buttonElement?.classList.contains('text-secondary-onContainer')).toBe(true);

    document.body.removeChild(button);
  });
});