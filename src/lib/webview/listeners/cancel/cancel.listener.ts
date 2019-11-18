import { webviewEndpoint } from "&resolve/webview-endpoint";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { CancelPipeRequest, CancelKeys, cancelPipe } from "@/shared/pipes/cancel.pipe";
import { Listener } from "@/webview/models/listener.model";


export class CancelListener implements Listener {

    private endpoint: PipeEndpoint<CancelPipeRequest, {}, 'cancel'>;

    constructor() {
        this.endpoint = webviewEndpoint.createFromPipe(cancelPipe);
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
