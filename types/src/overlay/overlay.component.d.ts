import { type TemplateResult } from 'lit';
import type { CloseReason, Content, OverlayLayout, ShowOptions } from './overlay.types';
declare const SchmancyOverlay_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * The single overlay element. Hosts a native `<dialog>` in its shadow
 * root for centered/sheet layouts; for anchored, we stay modeless by
 * using `<dialog>` with .show() (non-modal) + explicit positioning.
 *
 * Public lifecycle: the service calls `open()` to mount content and
 * animate in, `close(reason)` to animate out and dismiss. The element
 * dispatches `overlay-close` when closed; the service listens and
 * resolves the caller's Observable.
 */
export declare class SchmancyOverlay extends SchmancyOverlay_base {
    layout: OverlayLayout;
    dismissable: boolean;
    modal: boolean;
    private _dialog;
    private _surface;
    /** Close trigger for the service; emits the reason + detail payload. */
    private readonly _closed$;
    private _mounted;
    private _closing;
    /** Service subscribes to this to know when the overlay dismissed. */
    get closed$(): import('rxjs').Observable<{
        reason: CloseReason;
        result?: unknown;
    }>;
    /**
     * Mount content and animate in. Called by the service after the
     * element is attached to the DOM. Returns a promise that resolves
     * when the entrance animation completes.
     */
    open(content: Content, options: ShowOptions): Promise<void>;
    /** Play exit animations then close the native dialog. */
    close(reason: CloseReason, result?: unknown): Promise<void>;
    private wireCloseTriggers;
    private positionAnchored;
    private playEnterAnimations;
    private playExitAnimations;
    protected render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-overlay': SchmancyOverlay;
    }
}
export {};
