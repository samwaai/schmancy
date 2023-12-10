declare const SchmancyTheme: {
    sys: {
        color: {
            surface: {
                default: string;
                low: string;
                high: string;
                highest: string;
                lowest: string;
                on: string;
                onVariant: string;
            };
            primary: {
                default: string;
                on: string;
                container: string;
                onContainer: string;
            };
            secondary: {
                default: string;
                on: string;
                container: string;
                onContainer: string;
            };
            tertiary: {
                default: string;
                on: string;
                container: string;
                onContainer: string;
            };
            error: {
                default: string;
                on: string;
                container: string;
                onContainer: string;
            };
            success: {
                default: string;
                on: string;
                container: string;
                onContainer: string;
            };
        };
    };
};
export type TSchmancyTheme = (typeof SchmancyTheme)[keyof typeof SchmancyTheme];
export { SchmancyTheme };
