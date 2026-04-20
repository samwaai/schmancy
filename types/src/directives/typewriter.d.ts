/**
 * Typewriter Directive - RxJS-based typing animation
 *
 * Creates a smooth typewriter effect with automatic cycling through phrases.
 * Uses RxJS for precise timing and clean reactive patterns.
 *
 * @example
 * ```ts
 * // Simple cycling through words
 * html`<div ${typewriter(['Trustless', 'Permissionless', 'Transparent'])}>
 *   <span class="typed"></span>
 * </div>`
 *
 * // Custom speeds and pauses
 * html`<div ${typewriter(['Fast', 'Typing'], { typeSpeed: 50, pauseDuration: 1000 })}>
 *   <span class="typed"></span>
 * </div>`
 *
 * // One-time typing (no loop)
 * html`<div ${typewriter(['Hello World'], { loop: false })}>
 *   <span class="typed"></span>
 * </div>`
 * ```
 */
import type { ElementPart } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
export interface TypewriterOptions {
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseDuration?: number;
    loop?: boolean;
    selector?: string;
    cursor?: boolean;
    finalMessage?: string;
    sound?: boolean;
    volume?: number;
}
declare class TypewriterDirective extends AsyncDirective {
    private state;
    private soundEngine;
    render(_phrases: string[], _options?: TypewriterOptions): symbol;
    update(part: ElementPart, [phrases, options]: [string[], TypewriterOptions]): symbol;
    private startTyping;
    private getTextNode;
    private cleanup;
    disconnected(): void;
    reconnected(): void;
}
export declare const typewriter: (_phrases: string[], _options?: TypewriterOptions) => import("lit-html/directive").DirectiveResult<typeof TypewriterDirective>;
export {};
