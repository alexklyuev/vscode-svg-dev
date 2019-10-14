import { Pipe, PipeEndpoint } from "../../../lib/common/pipe/pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { CancelPipeRequest, CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { makeMethodIterator } from "../../../lib/common/iterators";


export class CancelListener {

    private endpoint: PipeEndpoint<CancelPipeRequest, {}, 'cancel'>;

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
                this.eventReceived(key);
            },
        );
    }

    @makeMethodIterator()
    eventReceived(key: CancelKeys): CancelKeys {
        return key;
    }

}
