import { Observable } from 'rxjs';
/**
 * Swipe-to-dismiss gesture for sheet-layout overlays.
 *
 * Pointer-event based — a single pipeline covers touch, mouse, pen, and
 * any future pointer source. Without a visible drag handle, the gesture
 * only starts within the top DRAG_START_TOP_PX band of the surface (a
 * standard pull-to-dismiss convention). Escape + backdrop click cover
 * the non-pointer dismiss paths via the component's modal-tier listeners.
 *
 * RxJS-native (rxjs skill principle 3: every async source is an Observable).
 * Thresholds are policy constants, not magic numbers.
 */
/** Distance (px) past which the gesture dismisses. */
export declare const DISMISS_DISTANCE_PX = 80;
/** Distance as fraction of sheet height past which the gesture dismisses. */
export declare const DISMISS_DISTANCE_FRACTION = 0.25;
/** Velocity (px/ms) past which the gesture dismisses even short of distance. */
export declare const DISMISS_VELOCITY_PX_PER_MS = 0.4;
/** Drag only starts if pointerdown is within this top band (unless a drag handle is used). */
export declare const DRAG_START_TOP_PX = 40;
/** Snap-back animation duration when gesture doesn't pass threshold. */
export declare const SNAP_BACK_MS = 300;
/**
 * Logarithmic rubber-band damping for upward (negative) drag past the
 * top detent. Pulled from Vaul — `8 * (log(v + 1) - 2)` — diminishing
 * returns that feel physical, unlike the linear × 0.2 this replaces.
 *
 * Applied only to upward motion; downward drag tracks 1:1.
 */
export declare function logDamp(delta: number): number;
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
 * Emits exactly once when the user commits to dismissing the sheet
 * (distance OR velocity threshold passed). Works for touch, mouse, and
 * pen via the Pointer Events API. During an in-progress drag the
 * surface's `transform` is updated directly for 1:1 tracking. On
 * release-but-not-dismissed, the surface snaps back via a CSS transition.
 */
export declare function swipeToDismiss$(inputs: SwipeInputs): Observable<'dismiss'>;
