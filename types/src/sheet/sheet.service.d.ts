import SchmancySheet from './sheet';
export declare enum SchmancySheetPosition {
    Side = "side",
    Bottom = "bottom"
}
/**
 * Configuration options for opening a sheet
 */
export interface SheetConfig<T extends HTMLElement = HTMLElement> {
    /** The component to display in the sheet. Can be an instance or a factory function */
    component: T | (() => T);
    /** Unique identifier for the sheet. Defaults to component's tagName */
    uid?: string;
    /** Position of the sheet. Defaults to responsive (side on desktop, bottom on mobile) */
    position?: SchmancySheetPosition;
    /** Whether to keep the sheet in DOM after closing. Defaults to false */
    persist?: boolean;
    /** @deprecated Use onBeforeOpen to add close handlers */
    close?: () => void;
    /** Prevents dismissal via ESC or overlay click. Defaults to false */
    lock?: boolean;
    /** Whether to integrate with browser history. Defaults to true */
    handleHistory?: boolean;
    /** Title displayed in the sheet header */
    title?: string;
    /** Header visibility. Defaults to 'visible' */
    header?: 'hidden' | 'visible';
    /** Callback invoked before the sheet opens, useful for component setup */
    onBeforeOpen?: (component: T) => void;
    /** Callback invoked after the sheet opens and becomes visible */
    onAfterOpen?: (component: T) => void;
}
interface SheetDiscoveryDetail {
    uid: string;
}
interface SheetResponseDetail {
    sheet?: SchmancySheet;
    theme?: HTMLElement;
}
export type SheetWhereAreYouRickyEvent = CustomEvent<SheetDiscoveryDetail>;
export declare const SheetWhereAreYouRicky = "are-you-there-sheet";
export type SheetHereMortyEvent = CustomEvent<SheetResponseDetail>;
export declare const SheetHereMorty = "yes-here";
/**
 * Service for managing sheet components throughout the application.
 * Handles sheet lifecycle, history integration, and component reuse.
 *
 * @example
 * ```typescript
 * // Simple usage
 * sheet.open({
 *   component: document.createElement('my-form'),
 *   title: 'My Form'
 * });
 *
 * // With callbacks
 * sheet.open({
 *   component: () => {
 *     const form = document.createElement('employee-form');
 *     form.addEventListener('save', () => sheet.dismiss('employee-form'));
 *     return form;
 *   },
 *   uid: 'employee-form',
 *   onBeforeOpen: (form) => {
 *     form.data = employeeData;
 *   }
 * });
 * ```
 */
declare class SheetService {
    private readonly openSheet$;
    private readonly dismissSheet$;
    private readonly activeSheets;
    private readonly sheetComponents;
    private readonly sheetElements;
    private popStateListenerActive;
    constructor();
    /**
     * Initializes the reactive event streams for sheet operations
     */
    private initializeEventStreams;
    /**
     * Creates or retrieves a component instance from the configuration
     */
    private resolveComponent;
    /**
     * Calculates the unique identifier for a sheet
     */
    private calculateUid;
    /**
     * Discovers existing sheet container or creates a new one
     */
    private discoverOrCreateSheet;
    /**
     * Applies configuration to a sheet element
     */
    private configureSheet;
    /**
     * Handles the sheet opening logic
     */
    private setupOpenStream;
    /**
     * Sets up the close event listener for a sheet
     */
    private setupCloseListener;
    /**
     * Sets up the sheet dismissal logic
     */
    private setupDismissStream;
    /**
     * Sets up browser history integration for back button support
     */
    private setupHistoryManagement;
    /**
     * Opens a sheet with the specified configuration
     * @param config - Configuration options for the sheet
     * @example
     * ```typescript
     * sheet.open({
     *   component: document.createElement('my-form'),
     *   uid: 'my-form-sheet',
     *   title: 'Edit Form',
     *   onBeforeOpen: (component) => {
     *     component.data = formData;
     *   }
     * });
     * ```
     */
    open<T extends HTMLElement = HTMLElement>(config: SheetConfig<T>): void;
    /**
     * Dismisses a sheet by its unique identifier
     * @param uid - The unique identifier of the sheet to dismiss. If not provided, dismisses the most recent sheet.
     */
    dismiss(uid?: string): void;
    /**
     * Gets the component instance for a given sheet
     * @param uid - The unique identifier of the sheet
     * @returns The component instance, or undefined if not found
     */
    getComponent<T extends HTMLElement = HTMLElement>(uid: string): T | undefined;
    /**
     * Checks if a sheet is currently open
     * @param uid - The unique identifier of the sheet
     * @returns True if the sheet is open, false otherwise
     */
    isOpen(uid: string): boolean;
    /**
     * Closes all currently open sheets
     */
    closeAll(): void;
    /**
     * Gets the sheet element for a given uid
     * @param uid - The unique identifier of the sheet
     * @returns The sheet element, or undefined if not found
     */
    getSheetElement(uid: string): SchmancySheet | undefined;
}
export declare const sheet: SheetService;
export {};
