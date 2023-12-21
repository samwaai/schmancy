/// <reference types="node" />
export type RouteAction = {
    component: CustomElementConstructor | string | Promise<NodeModule>;
    area: string;
    state?: object;
    historyStrategy?: HISTORY_STRATEGY;
};
export type ActiveRoute = {
    component: string;
    area: string;
    state?: object;
};
export declare enum HISTORY_STRATEGY {
    push = "push",
    replace = "replace",
    pop = "pop",
    silent = "silent"
}
