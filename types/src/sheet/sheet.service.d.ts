import { Subject } from 'rxjs';
import SchmancySheet from './sheet';
export declare enum SchmancySheetPosition {
    Side = "side",
    Bottom = "bottom"
}
type BottomSheeetTarget = {
    component: HTMLElement;
    uid?: string;
    position?: SchmancySheetPosition;
    persist?: boolean;
    close?: () => void;
    lock?: boolean;
    handleHistory?: boolean;
    title?: string;
    header?: 'hidden' | 'visible';
};
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
    bottomSheet: Subject<BottomSheeetTarget>;
    $dismiss: Subject<string>;
    private activeSheets;
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
}
export declare const sheet: BottomSheetService;
export {};
