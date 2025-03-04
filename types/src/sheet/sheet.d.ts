import { SchmancySheetPosition } from './sheet.service';
declare const SchmancySheet_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * `<schmancy-sheet>` component
 *
 * A modal sheet component that can be positioned at the bottom or side of the viewport.
 * Supports customizable animations, focus management, and accessibility features.
 *
 * @element schmancy-sheet
 * @fires before-close - Fired before the sheet begins closing (cancelable)
 * @fires close - Fired when the sheet has closed
 * @fires open - Fired when the sheet has opened
 */
export default class SchmancySheet extends SchmancySheet_base {
    /** Unique identifier for the sheet */
    uid: string;
    /** Controls whether the sheet is open or closed */
    open: boolean;
    /** Controls visibility of the header section */
    header: 'hidden' | 'visible';
    /** Position of the sheet */
    position: SchmancySheetPosition;
    /** Whether the sheet persists after closing */
    persist: boolean;
    /** Whether clicking the overlay dismisses the sheet */
    allowOverlayDismiss: boolean;
    /** Prevents closing by backdrop click, even if allowOverlayDismiss is true */
    preventBackdropClick: boolean;
    /** Title displayed in the header */
    title: string;
    /** Accessible label for the sheet (for screen readers) */
    ariaLabel: string;
    /** ARIA describedby attribute value */
    ariaDescribedBy?: string;
    /** Custom selector to specify which element receives focus when opened */
    initialFocusSelector?: string;
    /** Animation duration in milliseconds */
    animationDuration: number;
    /** Animation easing function */
    animationEasing: string;
    /** Attribute to specify which element should receive focus when the sheet opens */
    focusAttribute: string;
    /** Ref to the sheet container */
    private sheet;
    /** Ref to the sheet body */
    bodyElement: HTMLElement;
    /** Collection of assigned elements */
    private assignedElements;
    /** Tracks the element that had focus before the sheet opened */
    private lastFocusedElement;
    /** For touch interactions */
    private startY;
    private currentY;
    /** ResizeObserver instance */
    private resizeObserver;
    /**
     * Lifecycle callback for when the 'open' property changes
     */
    onOpenChange(_oldValue: boolean, newValue: boolean): void;
    /**
     * Component connected to DOM
     */
    connectedCallback(): void;
    /**
     * First update lifecycle callback
     */
    firstUpdated(): void;
    /**
     * Component updated lifecycle callback
     */
    updated(changedProps: Map<string, unknown>): void;
    /**
     * Component disconnected from DOM
     */
    disconnectedCallback(): void;
    /**
     * Updates CSS custom properties
     */
    private updateCssVariables;
    /**
     * Sets up event listeners
     */
    private setupEventListeners;
    /**
     * Check if focus is within the sheet
     */
    private sheetContainsFocus;
    /**
     * Announce presence to the sheet service
     */
    private announcePresence;
    /**
     * Add focus trap to keep focus within sheet when open
     */
    private addFocusTrap;
    /**
     * Remove focus trap
     */
    private removeFocusTrap;
    /**
     * Handle focus events to trap focus
     */
    private handleFocusIn;
    /**
     * Handle scroll events
     */
    private handleScroll;
    /**
     * Updates the aria-hidden and aria-modal attributes
     */
    setIsSheetShown(isShown: boolean): void;
    /**
     * Closes the sheet
     */
    closeSheet(): void;
    /**
     * Update dimensions based on viewport
     */
    private updateSheetDimensions;
    /**
     * Find the element that should receive focus
     */
    private getFocusElement;
    /**
     * Set focus within the sheet
     */
    focus(): void;
    /**
     * Fire events with consistent format
     */
    private fireEvent;
    /**
     * Handle touch start for swipe gesture
     */
    private handleTouchStart;
    /**
     * Handle touch move for swipe gesture
     */
    private handleTouchMove;
    /**
     * Handle touch end for swipe gesture
     */
    private handleTouchEnd;
    /**
     * Render the component
     */
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet': SchmancySheet;
    }
}
export {};
