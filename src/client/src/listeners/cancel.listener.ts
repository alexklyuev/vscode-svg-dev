import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { CancelPipeRequest, CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { ClientEvent } from "../entities/client-event";
import { connectEvent } from "../decorators/connect-event.decorator";


const enum CancelEvents {
    keyEvent = 'keyEvent',
}

export class CancelListener {

    private endpoint: PipeEndpoint<CancelPipeRequest, {}, 'cancel'>;

    public readonly [CancelEvents.keyEvent] = new ClientEvent<CancelKeys>();

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private cancelPipe: Pipe<CancelPipeRequest, {}, 'cancel'>,
    ) {
        this.endpoint = this.webviewEndpoint.createFromPipe(this.cancelPipe);
    }

    listen() {
        this.endpoint.listenSetRequest(
            _request => true,
            (key, _true) => {
                this.spawnEvent(key);
            },
        );
    }

    @connectEvent(CancelEvents.keyEvent)
    spawnEvent(key: CancelKeys): CancelKeys {
        return key;
    }

}
