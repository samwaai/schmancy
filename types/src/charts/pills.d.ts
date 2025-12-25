import { PropertyValues } from 'lit';
import type { PillDataPoint } from './types';
declare const SchmancyPills_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyPills extends SchmancyPills_base {
    /** Chart data points */
    data: PillDataPoint[];
    /** Prefix for values (e.g., "EUR ") */
    valuePrefix: string;
    /** Suffix for values (e.g., "%") */
    valueSuffix: string;
    /** Decimal places for value display */
    valueDecimals: number;
    /** Show medals for top 3 */
    showMedals: boolean;
    /** Show legend for segments */
    showLegend: boolean;
    /** Animation duration in milliseconds */
    animationDuration: number;
    /** Enable entrance animation */
    animated: boolean;
    /** Label column width (Tailwind class) */
    labelWidth: string;
    /** Value column width (Tailwind class) */
    valueWidth: string;
    private animationProgress;
    private isVisible;
    private categoryColorMap;
    private observer;
    private animationFrameId;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cleanup;
    private setupIntersectionObserver;
    protected firstUpdated(): void;
    protected updated(changedProperties: PropertyValues): void;
    private startAnimation;
    private initializeCategoryColors;
    private getSegmentColor;
    private formatValue;
    private getMedalEmoji;
    private getMaxValue;
    private renderBar;
    private renderLegend;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-pills': SchmancyPills;
    }
}
export {};
