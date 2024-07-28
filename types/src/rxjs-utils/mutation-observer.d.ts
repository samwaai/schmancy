import { Observable } from 'rxjs';
export declare const mutationObserver: (target: HTMLElement, config?: MutationObserverInit) => Observable<MutationRecord[]>;
export default mutationObserver;
