import SchmancyMenu from '@schmancy/menu/menu';
import moment from 'moment';
declare const SwiftHRAdminDateRange_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SwiftHRAdminDateRange extends SwiftHRAdminDateRange_base {
    type: 'date';
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
    presetRanges: Array<{
        label: string;
        range: {
            dateFrom: moment.Moment;
            dateTo: moment.Moment;
        };
    }>;
    setDateRange(fromDate: moment.Moment, toDate: moment.Moment): void;
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
