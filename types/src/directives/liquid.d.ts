/**
 * Liquid Glass Directive — Apple WWDC 2025 Liquid Glass
 *
 * Pure CSS, zero DOM mutation. Applies only inline styles to the host element:
 * - backdrop-filter: blur + saturate + brightness (glass material)
 * - background: semi-transparent tint (glass visibility layer)
 * - box-shadow: Fresnel edge glow (inset) + depth shadow (outer)
 * - border: thin luminous edge
 *
 * Does NOT insert any child elements, so it's safe on flex/grid containers.
 *
 * Usage:
 * ```ts
 * html`<div ${liquid()}>Content</div>`
 * html`<div ${liquid({ intensity: 'strong' })}>Thick glass</div>`
 * html`<div ${liquid({ active: false })}>No glass</div>`
 * ```
 */
import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart } from 'lit';
export interface LiquidOptions {
    /** Whether the effect is active. Default: true */
    active?: boolean;
    /** Glass thickness. Default: 'medium' */
    intensity?: 'light' | 'medium' | 'strong';
}
declare class LiquidDirective extends AsyncDirective {
    private state;
    render(_options?: LiquidOptions): symbol;
    update(part: ElementPart, [options]: [LiquidOptions?]): symbol;
    private activate;
    private applyStyles;
    private cleanup;
    disconnected(): void;
    reconnected(): void;
}
export declare const liquid: (_options?: LiquidOptions) => import("lit-html/directive").DirectiveResult<typeof LiquidDirective>;
export {};
