import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart } from 'lit/directive.js';
export type AnimationType = 'typewriter' | 'fade-up' | 'word-reveal' | 'blur-reveal' | 'cyber-glitch';
export type AnimationPresetName = 'smooth' | 'snappy' | 'bouncy' | 'gentle';
export interface AnimateTextOptions {
    animation: AnimationType;
    delay?: number;
    duration?: number;
    stagger?: number;
    preset?: AnimationPresetName;
    /**
     * Provide text explicitly instead of reading from element.textContent.
     * REQUIRED when the element contains Lit bindings (${...}), because
     * animateText replaces innerHTML which destroys Lit's ChildPart markers.
     */
    text?: string;
    /** Re-animate every time the element re-enters the viewport (default: false) */
    restart?: boolean;
}
declare class AnimateTextDirective extends AsyncDirective {
    private element;
    private originalContent;
    private animations;
    private disconnecting$;
    private initialized;
    render(_options: AnimateTextOptions): symbol;
    update(part: ElementPart, [options]: [AnimateTextOptions]): symbol;
    disconnected(): void;
    reconnected(): void;
    private initialize;
    private cleanup;
    /** Cancel all running Web Animation API animations. */
    private cancelAnimations;
    /** Cancel running animations and reset element to pre-animation state. */
    private resetToInitial;
    /**
     * Calculate accumulated opacity by walking up DOM tree.
     * CSS opacity doesn't inherit as computed value - must multiply ancestors.
     * Also handles shadow DOM: when slotted, checks the slot's container opacity.
     * NOTE: Skips the element itself since we intentionally set its opacity to 0.
     */
    private getAccumulatedOpacity;
    /**
     * Walk up from a slot element through its shadow DOM ancestors.
     * Stops when parentElement is null (shadow root boundary).
     */
    private getSlotAncestorOpacity;
    private createVisibilityObservable$;
    private runAnimation$;
    private animateFadeUp$;
    /**
     * Walk childNodes: wrap text nodes as word-spans, preserve element children in place.
     * Returns the ordered list of HTMLElements to animate (one per word + one per child element).
     * Element children are MOVED (not cloned) to preserve Lit directive bindings.
     */
    private wrapTextNodes;
    private animateBlurReveal$;
    private animateWordReveal$;
    /**
     * Cyber-glitch: Futuristic character-by-character reveal with scale + blur
     * Each character pops in with overshoot spring physics
     */
    private animateCyberGlitch$;
    private animateTypewriter$;
}
export declare const animateText: (_options: AnimateTextOptions) => import("lit-html/directive").DirectiveResult<typeof AnimateTextDirective>;
export {};
