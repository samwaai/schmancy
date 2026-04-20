import { LitElement } from 'lit';
import type { Constructor } from '../../mixins/constructor';
import type { IBaseMixin } from '../../mixins/baseElement';
export interface DialogPosition {
    x: number;
    y: number;
}
export interface VirtualReference {
    getBoundingClientRect: () => DOMRect;
}
/**
 * Interface for the DialogBase mixin methods
 */
export interface IDialogBaseMixin {
    position: DialogPosition;
    isMobile: boolean;
    dragOffset: number;
    show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean>;
    hide(result?: boolean): Promise<void>;
    isCentered(): boolean;
    isAnimating(): boolean;
}
/**
 * Dialog mixin with smart positioning using Floating UI.
 *
 * On mobile (< 640px), automatically switches to bottom sheet mode
 * with swipe-to-dismiss gesture. On tablet/desktop, if content exceeds
 * a viewport-dependent threshold, also opens as bottom sheet.
 */
export declare const DialogBase: <T extends Constructor<LitElement & IBaseMixin>>(superClass: T) => Constructor<IDialogBaseMixin> & T;
