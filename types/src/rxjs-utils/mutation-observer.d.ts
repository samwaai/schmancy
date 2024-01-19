import { Observable } from 'rxjs';
declare const mutationObserver: (target: HTMLElement, config?: MutationObserverInit) => Observable<MutationRecord[]>;
export default mutationObserver;
