/**
 * Catmull-Rom spline interpolation for smooth curves
 * Returns the interpolated point between p1 and p2
 */
export declare function catmullRomSpline(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/**
 * Converts hex or rgb color to rgba string
 */
export declare function hexToRgba(color: string, alpha: number): string;
/**
 * Cubic ease-out animation function
 */
export declare function easeOutCubic(t: number): number;
