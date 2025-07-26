import { Directive, ElementPart, ElementPartInfo } from 'lit/directive.js';
declare class TooltipDirective extends Directive {
    constructor(partInfo: ElementPartInfo);
    render(text: string, options?: {
        position?: 'top' | 'right' | 'bottom' | 'left';
        delay?: number;
        showArrow?: boolean;
    }): {
        text: string;
        options: {
            position?: "top" | "right" | "bottom" | "left";
            delay?: number;
            showArrow?: boolean;
        };
    };
    update(part: ElementPart, [text, options]: [string, any]): {
        text: string;
        options: any;
    };
    disconnected(part: ElementPart): void;
}
export declare const tooltip: (text: string, options?: {
    position?: "top" | "right" | "bottom" | "left";
    delay?: number;
    showArrow?: boolean;
}) => import("lit-html/directive").DirectiveResult<typeof TooltipDirective>;
export {};
