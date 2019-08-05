import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../lib/common/pipe/pipe";
import { ArtboardRequest, ArtboardResponse } from "../../../shared/pipes/artboard.pipe";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { ClientEvent, connectEvent } from "../entities/client-event";


const enum ArtboardListenerEvents {
    changeProperty = 'changeProperty',
}


export class ArtboardListener {
    private artboardClient: PipeEndpoint<ArtboardRequest, ArtboardResponse, 'artboard'>;

    public readonly [ArtboardListenerEvents.changeProperty] = new ClientEvent<{property: string, value: string}>();

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private artboardPipe: Pipe<ArtboardRequest, ArtboardResponse, 'artboard'>,
        private artboard: Artboard,
    ) {
        this.artboardClient = this.webviewEndpoint.createFromPipe(this.artboardPipe);
    }

    listen() {
        this.artboardClient.listenGetRequest(
            _request => this.artboard.svg,
            (request, svg) => {
                const { property } = request;
                return {value: svg.getAttribute(property)};
            },
        );
        this.artboardClient.listenSetRequest(
            _request => this.artboard.svg,
            ({ property, value }, svg) => {
                this.updateAttributes(svg, property, value!);
            },
        );
    }

    @setState
    @connectEvent(ArtboardListenerEvents.changeProperty)
    updateAttributes(svg: SVGElement, property: string, value: string) {
        svg.setAttribute(property, value!);
        if (property === 'width' || property === 'height') {
            let [,, width, height] = svg.getAttribute('viewBox')!.split(' ');
            if (property === 'width') {
                width = value!;
            }
            if (property === 'height') {
                height = value!;
            }
            svg.setAttribute('viewBox', [0, 0, width, height].join(' '));
        }
        return {property, value};
    }

}