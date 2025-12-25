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
    show(positionOrEvent?: DialogPosition | MouseEvent | TouchEvent): Promise<boolean>;
    hide(result?: boolean): void;
    isCentered(): boolean;
}
/**
 * Dialog mixin with smart positioning using Floating UI.
 *
 * Uses autoPlacement to find the position with MOST available space,
 * minimizing the need for content scrolling.
 */
export declare const DialogBase: <T extends Constructor<LitElement & IBaseMixin>>(superClass: T) => Constructor<IDialogBaseMixin> & T;
