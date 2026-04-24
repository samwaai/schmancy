import { Observable } from 'rxjs';
/**
 * Swipe-to-dismiss gesture for sheet-layout overlays.
 *
 * RxJS-native (rxjs skill principle 3: every async source is an Observable).
 * Returns an Observable that emits `'dismiss'` when the gesture passes the
 * distance/velocity threshold. Caller maps emissions to teardown.
 *
 * Thresholds are policy constants, not magic numbers.
 */
/** Distance beyond which the gesture dismisses, in px. */
export declare const DISMISS_DISTANCE_PX = 80;
/** Distance beyond which the gesture dismisses, as a fraction of sheet height. */
export declare const DISMISS_DISTANCE_FRACTION = 0.3;
/** Velocity beyond which the gesture dismisses, in px per ms. */
export declare const DISMISS_VELOCITY_PX_PER_MS = 0.5;
/** Drag only starts if touchstart is within this top-px band (unless a drag handle is used). */
export declare const DRAG_START_TOP_PX = 40;
/** Snap-back spring duration when gesture doesn't pass threshold. */
export declare const SNAP_BACK_MS = 300;
export interface SwipeInputs {
    /** The surface element to track gestures on. */
    surface: HTMLElement;
    /** Optional drag handle. When provided, drag can start from anywhere on
     *  the handle; without it, drag must start in the top DRAG_START_TOP_PX band. */
    dragHandle?: HTMLElement | null;
    /** Completes the gesture stream (component disconnect / layout change). */
    until$: Observable<unknown>;
}
/**
 * Returns an Observable that emits exactly once when the user commits to
 * dismissing the sheet (threshold passed). The gesture is owned by the
 * caller — teardown fires on unsubscribe.
 *
 * During an in-progress drag, the surface's `transform` is updated
 * directly for 1:1 tracking. On release-but-not-dismissed, the surface
 * snaps back via a CSS transition.
 */
export declare function swipeToDismiss$(inputs: SwipeInputs): Observable<'dismiss'>;
