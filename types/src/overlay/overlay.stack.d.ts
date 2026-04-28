import { Observable } from 'rxjs';
import type { OverlayEntry } from './overlay.types';
/** Public read-only stream of the current stack. Emits on every push/pop. */
export declare const stack$: Observable<readonly OverlayEntry[]>;
/** Synchronous snapshot. Use only when a component can't subscribe. */
export declare function currentStack(): readonly OverlayEntry[];
/** Append an entry (top of stack). */
export declare function pushEntry(entry: OverlayEntry): void;
/** Remove by id. No-op if the id is not in the stack. */
export declare function removeEntry(id: string): void;
/** Clear the entire stack. Used by dismissAll(). */
export declare function clearStack(): void;
/** Top entry (LIFO). Undefined when stack is empty. */
export declare function topEntry(): OverlayEntry | undefined;
export declare function markModal(id: string, hostContainer: HTMLElement): void;
export declare function unmarkModal(id: string): void;
/**
 * Returns an Observable of `tagName` elements currently in the stack.
 * The overlayEvents public helper composes `fromEvent` over this stream
 * via switchMap to tap events without owning the overlay lifecycle.
 *
 * Stays alive across open/close cycles — the caller owns completion via
 * `takeUntil(this.disconnecting)`, matching the house rxjs convention.
 */
export declare function elementsByTag$(tagName: string): Observable<readonly HTMLElement[]>;
