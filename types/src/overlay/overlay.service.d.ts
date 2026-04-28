import { Observable } from 'rxjs';
import type { CloseReason, OverlayConfirmOptions, Content, OverlayEntry, OverlayPromptOptions, ShowOptions } from './overlay.types';
/**
 * Public read-only stream of the current overlay stack. Subscribe to
 * observe stack changes — e.g. to update a breadcrumb, show a "close
 * all" button, or gate another action while any overlay is open.
 *
 * Emits synchronously with the current snapshot on subscribe. Never
 * completes — the caller owns teardown via `takeUntil(this.disconnecting)`.
 */
export declare const openOverlays$: Observable<readonly OverlayEntry[]>;
/**
 * Open an overlay containing `content`. Returns a cold Observable — the
 * overlay mounts on subscribe and dismisses on unsubscribe. Emits at
 * most one value (the result from content's `close` event) then completes.
 *
 * The subscription IS the overlay lifecycle. `takeUntil(this.disconnecting)`
 * on the caller's side means the overlay auto-dismisses when the caller
 * unmounts — no handles to track, no leaks.
 *
 * **Anchored is the novel default.** When triggered by a user event, pass
 * it as `anchor` — the overlay blooms from the point of attention. Falls
 * back to centered or sheet when the viewport / content makes that the
 * better layout (see overlay.layout.ts).
 *
 * @example
 * show(MyEditor, { props: { id }, anchor: event })
 *   .pipe(takeUntil(this.disconnecting))
 *   .subscribe(saved => saved && this.store.persist(saved))
 */
export declare function show<T = void>(content: Content, options?: ShowOptions): Observable<T | undefined>;
/**
 * Yes/no confirmation dialog. Returns a Promise that resolves with the
 * user's choice. `variant: 'danger'` flips to destructive styling and
 * `role="alertdialog"`.
 */
export declare function confirm(options?: OverlayConfirmOptions): Promise<boolean>;
/**
 * Input prompt dialog. Returns the entered string, or `null` if the user
 * cancels or dismisses.
 */
export declare function prompt(options?: OverlayPromptOptions): Promise<string | null>;
/**
 * Subscribe to custom events emitted from any currently-open overlay
 * whose content matches `tagName`. Inspired by `area.on(name)` — keyed
 * by tag name (stable across HMR / lazy chunks) rather than a uid or
 * class reference.
 *
 * The returned Observable never completes on its own — the caller owns
 * teardown via `takeUntil(this.disconnecting)`. During gaps where no
 * matching overlay is open, no events are emitted; when an instance
 * mounts, events flow.
 *
 * Stacked instances of the same content merge their event streams.
 */
export declare function overlayEvents<E extends Event = CustomEvent>(tagName: string, eventName: string): Observable<E>;
/**
 * Close every currently-open overlay. LIFO order. Imperative — use for
 * app-level flows like logout or route reset.
 */
export declare function dismissAll(): void;
export type { CloseReason };
