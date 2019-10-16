import { webviewEndpoint } from "@/webview/services/webview-endpoint";
import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";

import { CancelPipeRequest, CancelKeys } from "../../../shared/pipes/cancel.pipe";


export class CancelListener {

    private endpoint: PipeEndpoint<CancelPipeRequest, {}, 'cancel'>;

    constructor(
        private cancelPipe: Pipe<CancelPipeRequest, {}, 'cancel'>,
    ) {
        this.endpoint = webviewEndpoint.createFromPipe(this.cancelPipe);
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
