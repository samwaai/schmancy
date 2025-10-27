/**
 * Material Design 3 Motion System
 * Complete motion and animation system following M3 specifications
 * @see https://m3.material.io/styles/motion
 */
export interface M3Easing {
    emphasized: string;
    emphasizedDecelerate: string;
    emphasizedAccelerate: string;
    standard: string;
    standardDecelerate: string;
    standardAccelerate: string;
    legacy: string;
    linear: string;
}
export interface M3Duration {
    short1: number;
    short2: number;
    short3: number;
    short4: number;
    medium1: number;
    medium2: number;
    medium3: number;
    medium4: number;
    long1: number;
    long2: number;
    long3: number;
    long4: number;
    extraLong1: number;
    extraLong2: number;
    extraLong3: number;
    extraLong4: number;
}
export interface M3Motion {
    easing: M3Easing;
    duration: M3Duration;
}
/**
 * Material Design 3 Easing Functions
 * Easing tokens define the acceleration curve of animations
 */
export declare const M3Easing: M3Easing;
/**
 * Material Design 3 Duration Tokens
 * Duration values in milliseconds for consistent timing
 */
export declare const M3Duration: M3Duration;
/**
 * Motion configuration combining easing and duration
 */
export declare const M3MotionConfig: M3Motion;
/**
 * Predefined motion patterns for common use cases
 */
export declare const M3MotionPatterns: {
    fadeIn: {
        easing: string;
        duration: number;
        keyframes: {
            opacity: number;
        }[];
    };
    fadeOut: {
        easing: string;
        duration: number;
        keyframes: {
            opacity: number;
        }[];
    };
    scaleUp: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    scaleDown: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    slideInFromBottom: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    slideOutToBottom: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    slideInFromRight: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    slideOutToRight: {
        easing: string;
        duration: number;
        keyframes: {
            transform: string;
        }[];
    };
    expand: {
        easing: string;
        duration: number;
        keyframes: {
            height: string;
            opacity: number;
        }[];
    };
    collapse: {
        easing: string;
        duration: number;
        keyframes: {
            height: string;
            opacity: number;
        }[];
    };
    sharedAxisX: {
        easing: string;
        duration: number;
        incoming: {
            transform: string;
            opacity: number;
        }[];
        outgoing: {
            transform: string;
            opacity: number;
        }[];
    };
    sharedAxisY: {
        easing: string;
        duration: number;
        incoming: {
            transform: string;
            opacity: number;
        }[];
        outgoing: {
            transform: string;
            opacity: number;
        }[];
    };
    sharedAxisZ: {
        easing: string;
        duration: number;
        incoming: {
            transform: string;
            opacity: number;
        }[];
        outgoing: {
            transform: string;
            opacity: number;
        }[];
    };
};
/**
 * Generate CSS custom properties for motion
 */
export declare function generateMotionCSS(): string;
/**
 * Motion utility functions
 */
export declare const motion: {
    /**
     * Create a CSS transition string
     */
    createTransition(property: string | string[], duration?: keyof M3Duration, easing?: keyof M3Easing): string;
    /**
     * Create a CSS animation string
     */
    createAnimation(name: string, duration?: keyof M3Duration, easing?: keyof M3Easing, options?: {
        delay?: keyof M3Duration;
        iterationCount?: number | "infinite";
        direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
        fillMode?: "none" | "forwards" | "backwards" | "both";
    }): string;
    /**
     * Get duration in milliseconds
     */
    getDuration(duration: keyof M3Duration): number;
    /**
     * Get easing function
     */
    getEasing(easing: keyof M3Easing): string;
    /**
     * Create staggered animations for lists
     */
    createStagger(itemCount: number, baseDelay?: keyof M3Duration, increment?: keyof M3Duration): number[];
};
