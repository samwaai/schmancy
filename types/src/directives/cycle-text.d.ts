import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart } from 'lit/directive.js';
export type CycleTransition = 'fade' | 'slide' | 'typewriter';
export interface CycleTextOptions {
    /** Transition between items (default: 'fade') */
    transition?: CycleTransition;
    /** Default hold duration per item in ms (default: 2000). Overridden by child data-hold. */
    hold?: number;
    /** Transition duration in ms (default: 300) */
    duration?: number;
    /** Initial delay before first cycle in ms (default: 0) */
    delay?: number;
    /** 'replace' cycles one at a time; 'add' accumulates items then resets (default: 'replace') */
    mode?: 'replace' | 'add';
    /** Separator between accumulated items in add mode (default: ', ') */
    separator?: string;
}
declare class CycleTextDirective extends AsyncDirective {
    private element;
    private items;
    private subscription;
    private typewriterSub;
    private currentAnimation;
    private addDisplayEl;
    private disconnecting$;
    private initialized;
    render(_options?: CycleTextOptions): symbol;
    update(part: ElementPart, [options]: [CycleTextOptions?]): symbol;
    disconnected(): void;
    reconnected(): void;
    private startCycling;
    private startReplaceCycling;
    private startAddCycling;
    /** Types text character by character, appending to existing content. Completes after all chars typed. */
    private typewriterAdd;
    private transitionItems;
    private fadeTransition;
    /** Counter-style slide: both animate simultaneously in same grid cell */
    private slideTransition;
    private typewriterTransition;
    private cleanup;
}
export declare const cycleText: (_options?: CycleTextOptions) => import("lit-html/directive").DirectiveResult<typeof CycleTextDirective>;
export {};
