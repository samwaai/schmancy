import SchmancyMenu from '@schmancy/menu/menu';
declare const SwiftHRAdminDateRange_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SwiftHRAdminDateRange extends SwiftHRAdminDateRange_base {
    type: 'date' | 'datetime-local';
    dateFrom: {
        label: string;
        value: string;
    };
    dateTo: {
        label: string;
        value: string;
    };
    checkInInput: HTMLInputElement;
    checkOutInput: HTMLInputElement;
    minDate: string | undefined;
    maxDate: string | undefined;
    schmancyMenu: SchmancyMenu;
    selectedDateRange: string;
    presetRanges: Array<{
        label: string;
        range: {
            dateFrom: string;
            dateTo: string;
        };
    }>;
    connectedCallback(): void;
    setDateRange(fromDate: string, toDate: string): void;
    handlePresetChange(presetLabel: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
export type SchmancyDateRangeChangeEvent = CustomEvent<TSchmancDateRangePayload>;
type TSchmancDateRangePayload = {
    dateFrom?: string;
    dateTo?: string;
};
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-date-range': SwiftHRAdminDateRange;
    }
}
export {};
