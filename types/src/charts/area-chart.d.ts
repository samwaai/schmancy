import { PropertyValues } from 'lit';
import type { ChartDataPoint, ChartTheme } from './types';
declare const SchmancyAreaChart_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyAreaChart extends SchmancyAreaChart_base {
    /** Chart data points */
    data: ChartDataPoint[];
    /** Chart height in pixels */
    height: number;
    /** Show grid lines */
    showGrid: boolean;
    /** Show x-axis labels */
    showLabels: boolean;
    /** Enable tooltips */
    showTooltip: boolean;
    /** Number of peaks to highlight */
    peakCount: number;
    /** Animation duration in milliseconds */
    animationDuration: number;
    /** Enable entrance animation */
    animated: boolean;
    /** Prefix for values (e.g., "EUR ") */
    valuePrefix: string;
    /** Suffix for values (e.g., "%") */
    valueSuffix: string;
    /** Decimal places for value display */
    valueDecimals: number;
    /** Theme overrides */
    theme: Partial<ChartTheme>;
    private tooltipData;
    private animationProgress;
    private isVisible;
    private canvasRef;
    private containerRef;
    private animationFrameId;
    private observer;
    private processedData;
    private resizeObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cleanup;
    private setupIntersectionObserver;
    protected updated(changedProperties: PropertyValues): void;
    private startAnimation;
    private processData;
    private getThemeValue;
    private drawChart;
    private formatValue;
    private handlePointerMove;
    private handlePointerLeave;
    private renderMetadata;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area-chart': SchmancyAreaChart;
    }
}
export {};
