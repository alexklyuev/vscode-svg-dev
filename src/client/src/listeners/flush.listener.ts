import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../lib/common/pipe/pipe";
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
                const content = this.format(svg.outerHTML);
                return { content };
            },
        );
    }

    format(html: string): string {
        const tab = '  ';
        let repeat = 0;
        return html.replace(/\<\/?/g, (search) => {
            switch (search) {
                case '<': return `\n${ tab.repeat(repeat++) }${ search }`;
                case '</': return `\n${ tab.repeat(--repeat) }${ search }`;
                default: return '';
            }
        }).trim();
    }

}
