import { Subject } from 'rxjs';
declare const $newSchmancyTheme: Subject<string>;
declare const $schmancyTheme: Subject<Partial<{
    sys: {
        color: {
            scrim: string;
            outline: string;
            outlineVariant: string;
            surface: {
                default: string;
                dim: string;
                bright: string;
                container: string;
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
        elevation: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
        };
        outline: {
            1: string;
        };
    };
}>>;
export { $schmancyTheme, $newSchmancyTheme };
