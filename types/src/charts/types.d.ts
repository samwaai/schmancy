/**
 * Data point for charts
 */
export interface ChartDataPoint {
    /** X-axis label (e.g., "9 AM", "Mon") */
    label: string;
    /** Primary numeric value */
    value: number;
    /** Optional metadata for tooltips */
    metadata?: Record<string, unknown>;
}
/**
 * Theme configuration for charts
 */
export interface ChartTheme {
    /** Primary color - defaults to --schmancy-sys-color-primary */
    primaryColor?: string;
    /** Gradient opacity [top, bottom] - defaults to [0.4, 0.05] */
    gradientOpacity?: [number, number];
    /** Line stroke width - defaults to 2 */
    strokeWidth?: number;
    /** Normal point radius - defaults to 4 */
    pointRadius?: number;
    /** Peak point radius - defaults to 6 */
    peakRadius?: number;
}
/** Internal processed data point with position */
export interface ProcessedDataPoint extends ChartDataPoint {
    x: number;
    y: number;
    isPeak: boolean;
}
/**
 * Segment within a pill bar (for stacked bars)
 */
export interface PillSegment {
    /** Segment label (e.g., "Pizza", "Drinks") */
    label: string;
    /** Segment value */
    value: number;
    /** CSS color class (e.g., "bg-primary", "bg-secondary") */
    color?: string;
}
/**
 * Data point for pills chart (horizontal bar)
 */
export interface PillDataPoint {
    /** Row label (e.g., "9 AM", "Monday") */
    label: string;
    /** Primary value (used if no segments) */
    value: number;
    /** Optional segments for stacked bar */
    segments?: PillSegment[];
    /** Whether this is a peak/highlighted row */
    isPeak?: boolean;
    /** Whether this is a low/muted row */
    isLow?: boolean;
    /** Optional rank (1, 2, 3 for medals) */
    rank?: number;
    /** Optional metadata for tooltips */
    metadata?: Record<string, unknown>;
}
