import { ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Observable } from 'rxjs';
/**
 * RxJS wrapper for ResizeObserver - auto-cleans on unsubscribe
 */
export declare function fromResizeObserver(element: Element): Observable<ResizeObserverEntry[]>;
/**
 * fullHeight directive - fills remaining viewport space
 *
 * Reactive sources:
 * - Parent ResizeObserver (layout shifts)
 * - Window resize / visualViewport (viewport changes)
 * - Orientation change (device rotation)
 * - Focus out (mobile keyboard dismiss)
 * - Theme fullscreen toggle
 *
 * Performance:
 * - distinctUntilChanged prevents redundant style writes
 * - debounceTime(16) batches rapid events (~60fps)
 * - Single shared stream for global events
 */
declare class FullHeight extends AsyncDirective {
    private element;
    private disconnecting$;
    private calculateHeight;
    private applyStyles;
    private setupHeightStream;
    render(): void;
    update(part: ElementPart): void;
    disconnected(): void;
    reconnected(): void;
}
export declare const fullHeight: () => import("lit-html/directive").DirectiveResult<typeof FullHeight>;
/**
 * fullWidth directive - fills remaining horizontal viewport space
 *
 * Reactive sources:
 * - Element ResizeObserver (detects when element moves/resizes)
 * - Parent ResizeObserver (layout shifts, e.g., sidebar)
 * - Window resize / visualViewport (viewport changes)
 * - Orientation change (device rotation)
 * - Theme fullscreen toggle (sidebar visibility)
 *
 * Performance:
 * - distinctUntilChanged prevents redundant style writes
 * - debounceTime(16) batches rapid events (~60fps)
 * - Single shared stream for global events
 */
declare class FullWidth extends AsyncDirective {
    private element;
    private disconnecting$;
    private calculateWidth;
    private applyStyles;
    private setupWidthStream;
    render(): void;
    update(part: ElementPart): void;
    disconnected(): void;
    reconnected(): void;
}
export declare const fullWidth: () => import("lit-html/directive").DirectiveResult<typeof FullWidth>;
export {};
