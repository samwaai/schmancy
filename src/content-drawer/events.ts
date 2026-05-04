/**
 * Internal event protocol between `<schmancy-content-drawer>` and its child
 * `<schmancy-content-drawer-sheet>`. Bubbling + composed so the parent can
 * listen on itself even when the child is in a deeper shadow tree.
 */
export const OVERLAY_DISMISS_EVENT = 'schmancy-content-drawer-overlay-dismiss'
