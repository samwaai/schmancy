export type MetricTrend = 'up' | 'down' | 'neutral';
export type MetricSize = 'sm' | 'md' | 'lg';
declare const SchmancyMetric_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * KPI metric — a label + value pair for dashboards, with optional trend + delta indicators.
 *
 * @element schmancy-metric
 * @summary The building block of dashboards and meta bars. Pass `label` + `value` for a basic stat; add `trend` / `delta` for the delta-from-last-period pattern. Use multiple metrics side-by-side with Tailwind flex/grid utilities.
 * @example
 * <schmancy-metric label="In flight" value="4"></schmancy-metric>
 * <schmancy-metric label="Open value" value="€165,900" trend="up" delta="+12%"></schmancy-metric>
 * <schmancy-metric label="Error rate" value="0.3%" trend="down" delta="-0.1%"></schmancy-metric>
 * @platform div - Styled `<div>` with two text lines + optional trend arrow. Degrades to a plain div+spans if the tag never registers.
 * @slot - Optional custom value rendering (overrides the `value` attribute if present).
 * @slot label - Optional custom label rendering (overrides the `label` attribute if present).
 * @csspart label - The label line.
 * @csspart value - The value line.
 * @csspart delta - The delta pill (only when `delta` is set).
 */
export declare class SchmancyMetric extends SchmancyMetric_base {
    /** Upper-case caption shown above the value. */
    label: string;
    /** Primary metric value, rendered large. Pre-format numbers/currency yourself. */
    value: string;
    /** Optional trend direction. Controls the color + arrow on the delta pill. */
    trend?: MetricTrend;
    /** Optional delta copy displayed in a pill next to the value (e.g. `+12%`). */
    delta?: string;
    /** Size scale affecting label + value typography. */
    size: MetricSize;
    private _arrowFor;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-metric': SchmancyMetric;
    }
}
export {};
