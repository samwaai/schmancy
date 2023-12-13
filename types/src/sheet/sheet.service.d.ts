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
    style?: BottomSheetStyle;
    allowOverlyDismiss?: boolean;
};
export type BottomSheetStyle = {
    '--overlay-color'?: string;
    '--overlay-opacity'?: string;
    '--overlay-position'?: string;
    '--overlay-border-radius'?: string;
    '--sheet-position'?: 'absolute' | 'fixed' | 'relative';
    '--sheet-radius'?: string;
};
export type WhereAreYouRickyEvent = CustomEvent<{
    uid: string;
}>;
export declare const WhereAreYouRicky = "are-you-there-sheet";
export type HereMortyEvent = CustomEvent<{
    sheet: SchmancySheet;
}>;
export declare const HereMorty = "yes-here";
declare class BottomSheetService {
    bottomSheet: Subject<BottomSheeetTarget>;
    $dismiss: Subject<string>;
    counter: number;
    constructor();
    dismiss(uid: string): void;
    open(target: BottomSheeetTarget): void;
    close(uid?: string): void;
}
export declare const sheet: BottomSheetService;
export {};
