import { Subject } from 'rxjs';
import SchmancySheet from './sheet';
export declare enum SchmancySheetPosition {
    Side = "side",
    Bottom = "bottom",
    /**
     *  @deprecated use bottom instead
     */
    BottomCenter = "bottom-center",
    /**
     *  @deprecated use side instead
     */
    TopRight = "top-right",
    /**
     *  @deprecated use side instead
     */
    BottomRight = "bottom-right"
}
type BottomSheeetTarget = {
    component: HTMLElement;
    uid?: string;
    position?: SchmancySheetPosition;
    persist?: boolean;
    close?: () => void;
    allowOverlyDismiss?: boolean;
    title?: string;
    header?: 'hidden' | 'visible';
};
export type SheetWhereAreYouRickyEvent = CustomEvent<{
    uid: string;
}>;
export declare const SheetWhereAreYouRicky = "are-you-there-sheet";
export type SheetHereMortyEvent = CustomEvent<{
    sheet: SchmancySheet;
}>;
export declare const SheetHereMorty = "yes-here";
declare class BottomSheetService {
    bottomSheet: Subject<BottomSheeetTarget>;
    $dismiss: Subject<string>;
    constructor();
    dismiss(uid: string): void;
    open(target: BottomSheeetTarget): void;
}
export declare const sheet: BottomSheetService;
export {};
