import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { CancelPipeRequest } from "../../../shared/pipes/cancel.pipe";


export class CancelListener {

    private endpoint: PipeEndpoint<CancelPipeRequest, {}, 'cancel'>;
    private callbacks = new Set<() => void>();

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private cancelPipe: Pipe<CancelPipeRequest, {}, 'cancel'>,
    ) {
        this.endpoint = this.webviewEndpoint.createFromPipe(this.cancelPipe);
    }

    listen() {
        this.endpoint.listenSetRequest(
            _request => true,
            (_cancel, _true) => {
                this.callbacks.forEach(cb => cb());
            },
        );
    }

    addCallback(callback: () => void) {
        this.callbacks.add(callback);
    }

    removeCallback(callback: () => void) {
        this.callbacks.delete(callback);
    }

}
