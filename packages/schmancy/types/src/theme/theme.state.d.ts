/**
 * Material Design 3 State Layer System
 * Interactive state layers and opacity values following M3 specifications
 * @see https://m3.material.io/foundations/interaction-states
 */
export interface M3StateOpacity {
    hover: number;
    focus: number;
    pressed: number;
    dragged: number;
    disabled: number;
    disabledContainer: number;
    selected: number;
}
export interface M3StateLayer {
    opacity: M3StateOpacity;
    duration: {
        enter: string;
        exit: string;
    };
    easing: {
        enter: string;
        exit: string;
    };
}
/**
 * Material Design 3 State Opacity Values
 * Standard opacity values for interactive states
 */
export declare const M3StateOpacity: M3StateOpacity;
/**
 * Material Design 3 State Layer Configuration
 * Complete configuration for state layers including timing
 */
export declare const M3StateLayerConfig: M3StateLayer;
/**
 * Component-specific state configurations
 * Maps components to their state layer behaviors
 */
export declare const M3ComponentStates: {
    button: {
        filled: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        outlined: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
        text: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        elevated: {
            hover: {
                opacity: number;
                color: string;
                elevation: number;
            };
            focus: {
                opacity: number;
                color: string;
                elevation: number;
            };
            pressed: {
                opacity: number;
                color: string;
                elevation: number;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                elevation: number;
            };
        };
        tonal: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
    };
    iconButton: {
        standard: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        filled: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        tonal: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        outlined: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
    };
    card: {
        filled: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            dragged: {
                opacity: number;
                color: string;
                elevation: number;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        elevated: {
            hover: {
                opacity: number;
                color: string;
                elevation: number;
            };
            focus: {
                opacity: number;
                color: string;
                elevation: number;
            };
            pressed: {
                opacity: number;
                color: string;
                elevation: number;
            };
            dragged: {
                opacity: number;
                color: string;
                elevation: number;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                elevation: number;
            };
        };
        outlined: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            dragged: {
                opacity: number;
                color: string;
                elevation: number;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
    };
    listItem: {
        hover: {
            opacity: number;
            color: string;
        };
        focus: {
            opacity: number;
            color: string;
        };
        pressed: {
            opacity: number;
            color: string;
        };
        selected: {
            opacity: number;
            color: string;
        };
        disabled: {
            opacity: number;
            contentOpacity: number;
        };
    };
    chip: {
        assist: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
        filter: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
        input: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
        suggestion: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
                borderOpacity: number;
            };
        };
    };
    navigation: {
        item: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        rail: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
    };
    tab: {
        primary: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
        secondary: {
            hover: {
                opacity: number;
                color: string;
            };
            focus: {
                opacity: number;
                color: string;
            };
            pressed: {
                opacity: number;
                color: string;
            };
            selected: {
                opacity: number;
                color: string;
            };
            disabled: {
                opacity: number;
                contentOpacity: number;
            };
        };
    };
};
/**
 * Generate CSS custom properties for state layers
 */
export declare function generateStateCSS(): string;
/**
 * State layer utility functions
 */
export declare const state: {
    /**
     * Get state opacity value
     */
    getOpacity(stateName: keyof M3StateOpacity): number;
    /**
     * Create state layer overlay
     */
    createOverlay(stateName: keyof M3StateOpacity, color?: string, shape?: string): string;
    /**
     * Create ripple effect
     */
    createRipple(color?: string, duration?: string): string;
    /**
     * Apply state transition
     */
    applyTransition(properties?: string[]): string;
    /**
     * Get component state configuration
     */
    getComponentState(component: keyof typeof M3ComponentStates, variant?: string, stateName?: string): any;
    /**
     * Create focus indicator
     */
    createFocusIndicator(color?: string, width?: string, offset?: string): string;
    /**
     * Create disabled state
     */
    createDisabledState(contentOpacity?: number, containerOpacity?: number): string;
    /**
     * Create selected state
     */
    createSelectedState(color?: string, opacity?: number): string;
};
