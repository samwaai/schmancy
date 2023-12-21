import { Subject } from 'rxjs';
import { SchmancyTeleportation } from './teleport.component';
export type WhereAreYouRickyEvent = CustomEvent<{
    id: string;
    callerID: number;
}>;
export declare const WhereAreYouRicky = "whereAreYouRicky";
export type HereMortyEvent = CustomEvent<{
    component: SchmancyTeleportation;
}>;
export type FLIP_REQUEST = {
    from: HTMLElement;
    to: HTMLElement;
    stagger?: number;
    host: HTMLElement;
};
export declare const HereMorty = "hereMorty";
declare class Teleportation {
    activeTeleportations: Map<string, DOMRect>;
    flipRequests: Subject<FLIP_REQUEST>;
    constructor();
    find: (component: SchmancyTeleportation) => import("rxjs").Observable<SchmancyTeleportation>;
    flip: (request: {
        from: {
            element: HTMLElement;
            rect: DOMRect;
        };
        to: {
            element: HTMLElement;
            rect: DOMRect;
        };
        host: HTMLElement;
        i: number;
    }) => void;
}
export declare const teleport: Teleportation;
export default teleport;
