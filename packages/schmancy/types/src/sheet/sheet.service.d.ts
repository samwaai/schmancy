import { Subject } from 'rxjs';
import { ComponentType } from '../area/router.types';
export declare enum SchmancySheetPosition {
    Side = "side",
    Bottom = "bottom"
}
export type SheetConfig = {
    component: ComponentType;
    uid?: string;
    position?: SchmancySheetPosition;
    persist?: boolean;
    close?: () => void;
    lock?: boolean;
    onBeforeOpen?: (component: HTMLElement) => void;
    onAfterOpen?: (component: HTMLElement) => void;
    props?: Record<string, unknown>;
};
type BottomSheeetTarget = SheetConfig;
declare class BottomSheetService {
    bottomSheet: Subject<SheetConfig>;
    private activeSheets;
    private popStateListenerActive;
    constructor();
    /**
     * Sets up the main sheet opening logic
     */
    private setupSheetOpeningLogic;
    /**
     * Sets up the popstate listener to handle browser back button
     */
    private setupPopStateListener;
    /**
     * Dismiss a sheet by uid, or dismiss the most recently opened sheet if no uid provided
     */
    dismiss(uid?: string): void;
    /**
     * Open a sheet with the given target configuration
     * @deprecated Use `push` instead for consistency with area router API
     */
    open(target: BottomSheeetTarget): void;
    /**
     * Push a component to the sheet (recommended method)
     * Follows the same API pattern as area.push for consistency
     */
    push(target: BottomSheeetTarget): void;
    /**
     * Check if a sheet is currently open by uid
     */
    isOpen(uid: string): boolean;
    /**
     * Close all open sheets
     */
    closeAll(): void;
}
export declare const sheet: BottomSheetService;
export {};
