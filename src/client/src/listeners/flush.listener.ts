import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { FlushPayload } from "../../../shared/pipes/flush.pipe";
import { Artboard } from "../services/artboard/artboard";


export class FlushListener {
    private flushEndpoint: PipeEndpoint<FlushPayload, FlushPayload, "flush">;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private flushPipe: Pipe<FlushPayload, FlushPayload, 'flush'>,
        private artboard: Artboard,
    ) {
        this.flushEndpoint = this.webviewEndpoint.createFromPipe(this.flushPipe);
    }

    listen() {
        this.flushEndpoint.listenGetRequest(
            _request => this.artboard.svg,
            ({}, svg) => {
                return {content: svg.outerHTML};
            },
        );
    }

}
