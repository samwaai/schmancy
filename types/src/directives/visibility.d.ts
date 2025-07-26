import { ReactiveController, ReactiveControllerHost } from 'lit';
export default class VisibilityController implements ReactiveController {
    host: ReactiveControllerHost & HTMLElement;
    magicKey: string;
    toggler: ' ' | 'ctrl+space' | string;
    disconnecting: any;
    constructor(host: ReactiveControllerHost | HTMLElement, magicKey: string, toggler: string, defaultVisibility?: 'visible' | 'hidden');
    hostConnected(): void;
    hostDisconnected(): void;
}
