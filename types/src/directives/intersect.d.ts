/**
 * Intersect Directive - Simplified IntersectionObserver for Lit
 *
 * Automatically handles observer setup and cleanup. Replaces manual
 * IntersectionObserver management across the codebase.
 *
 * @example
 * ```ts
 * // Basic - callback when visible
 * html`<div ${intersect(() => this.loadData())}>Lazy content</div>`
 *
 * // Once mode - fires only once then disconnects
 * html`<img ${intersect(() => this.loadImage(), { once: true })} />`
 *
 * // With options
 * html`<div ${intersect(
 *   (isVisible) => isVisible && this.playAnimation(),
 *   { threshold: 0.5, rootMargin: '100px' }
 * )}>Animated content</div>`
 *
 * // Enter/exit callbacks
 * html`<video ${intersect({
 *   onEnter: () => this.play(),
 *   onExit: () => this.pause()
 * })}>Video</video>`
 * ```
 */
import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart } from 'lit';
export interface IntersectOptions {
    /** Fire callback only once then disconnect (default: false) */
    once?: boolean;
    /** IntersectionObserver threshold (default: 0) */
    threshold?: number | number[];
    /** IntersectionObserver rootMargin (default: '0px') */
    rootMargin?: string;
    /** Delay in ms before triggering callback (default: 0) */
    delay?: number;
}
export interface IntersectCallbacks {
    /** Called when element enters viewport */
    onEnter?: () => void;
    /** Called when element exits viewport */
    onExit?: () => void;
    /** IntersectionObserver options */
    options?: IntersectOptions;
}
type IntersectCallback = (isVisible: boolean, entry: IntersectionObserverEntry) => void;
declare class IntersectDirective extends AsyncDirective {
    private state;
    render(_callbackOrOptions: IntersectCallback | IntersectCallbacks, _options?: IntersectOptions): symbol;
    update(part: ElementPart, [callbackOrOptions, options]: [IntersectCallback | IntersectCallbacks, IntersectOptions?]): symbol;
    private triggerCallback;
    private cleanup;
    private pause;
    disconnected(): void;
    reconnected(): void;
}
export declare const intersect: (_callbackOrOptions: IntersectCallbacks | IntersectCallback, _options?: IntersectOptions) => import("lit-html/directive").DirectiveResult<typeof IntersectDirective>;
export {};
