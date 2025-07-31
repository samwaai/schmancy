import { Subject } from 'rxjs';
import SchmancySheet from './sheet';
export declare enum SchmancySheetPosition {
    Side = "side",
    Bottom = "bottom"
}
export type SheetConfig = {
    component: HTMLElement;
    uid?: string;
    position?: SchmancySheetPosition;
    persist?: boolean;
    close?: () => void;
    lock?: boolean;
    handleHistory?: boolean;
    title?: string;
    header?: 'hidden' | 'visible';
    onBeforeOpen?: (component: HTMLElement) => void;
    onAfterOpen?: (component: HTMLElement) => void;
};
type BottomSheeetTarget = SheetConfig;
export type SheetWhereAreYouRickyEvent = CustomEvent<{
    uid: string;
}>;
export declare const SheetWhereAreYouRicky = "are-you-there-sheet";
export type SheetHereMortyEvent = CustomEvent<{
    sheet?: SchmancySheet;
    theme?: HTMLElement;
}>;
export declare const SheetHereMorty = "yes-here";
declare class BottomSheetService {
    bottomSheet: Subject<SheetConfig>;
    $dismiss: Subject<string>;
    private activeSheets;
    private sheetComponents;
    private popStateListenerActive;
    constructor();
    /**
     * Sets up the main sheet opening logic
     */
    private setupSheetOpeningLogic;
    /**
     * Sets up the sheet closing/dismissal logic
     */
    private setupSheetDismissLogic;
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
     */
    open(target: BottomSheeetTarget): void;
    /**
     * Check if a sheet is currently open by uid
     */
    isOpen(uid: string): boolean;
    /**
     * Close all open sheets
     */
    closeAll(): void;
    /**
     * Gets the component instance for a given sheet
     * @param uid - The unique identifier of the sheet
     * @returns The component instance, or undefined if not found
     */
    getComponent<T extends HTMLElement = HTMLElement>(uid: string): T | undefined;
}
export declare const sheet: BottomSheetService;
export {};
