import { Directive } from 'lit/directive.js';
declare class TooltipDirective extends Directive {
    render(text: string): (part: any) => void;
}
export declare const tooltip: (text: string) => import("lit-html/directive").DirectiveResult<typeof TooltipDirective>;
export {};
