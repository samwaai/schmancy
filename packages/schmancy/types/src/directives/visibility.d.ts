import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Subject } from 'rxjs';
export default class VisibilityController implements ReactiveController {
    host: ReactiveControllerHost & HTMLElement;
    magicKey: string;
    toggler: ' ' | 'ctrl+space' | string;
    disconnecting: Subject<void>;
    constructor(host: ReactiveControllerHost | HTMLElement, magicKey: string, toggler: string, defaultVisibility?: 'visible' | 'hidden');
    hostConnected(): void;
    hostDisconnected(): void;
}
