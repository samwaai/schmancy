/**
 * Reveal Directive - Animated show/hide with zero layout shift
 *
 * Uses Blackbird spring physics for natural, organic motion.
 * Element stays in DOM to prevent layout shift.
 *
 * Usage:
 * ```ts
 * // Basic - uses 'smooth' preset
 * html`<div ${reveal(this.isVisible)}>Content</div>`
 *
 * // With preset - 'snappy' for quick interactions
 * html`<div ${reveal(this.isVisible, { preset: 'snappy' })}>Content</div>`
 *
 * // With custom max height
 * html`<div ${reveal(this.items.length > 1, { maxHeight: '200px' })}>Content</div>`
 *
 * // Bouncy for playful UI
 * html`<div ${reveal(this.showCelebration, { preset: 'bouncy' })}>🎉 Congrats!</div>`
 * ```
 *
 * Presets:
 * - 'smooth' (default): Apple-style, subtle overshoot - 500ms
 * - 'snappy': Quick with minimal overshoot - 300ms
 * - 'bouncy': Playful with noticeable overshoot - 600ms
 * - 'gentle': Slow, smooth, no overshoot - 700ms
 *
 * @see packages/schmancy/src/utils/animation.ts for Blackbird system
 */
import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart, PartInfo } from 'lit/directive.js';
export type RevealPreset = 'smooth' | 'snappy' | 'bouncy' | 'gentle';
export interface RevealOptions {
    /** Animation preset (default: 'smooth') */
    preset?: RevealPreset;
    /** Max height when revealed (default: '10rem') */
    maxHeight?: string;
    /** Custom duration override in ms (uses preset duration if not specified) */
    duration?: number;
    /** Custom easing override (uses preset easing if not specified) */
    easing?: string;
}
declare class RevealDirective extends AsyncDirective {
    private initialized;
    private element;
    constructor(partInfo: PartInfo);
    render(_show?: boolean, _options?: RevealOptions): symbol;
    update(part: ElementPart, [show, options]: [boolean | undefined, RevealOptions?]): symbol;
    private setupElement;
    disconnected(): void;
    reconnected(): void;
}
export declare const reveal: (_show?: boolean, _options?: RevealOptions) => import("lit-html/directive").DirectiveResult<typeof RevealDirective>;
export {};
