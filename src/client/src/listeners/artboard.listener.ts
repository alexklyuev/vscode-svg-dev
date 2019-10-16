// import { EventBus, connectEvent } from "@/common/events";
import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ArtboardRequest, ArtboardResponse } from "../../../shared/pipes/artboard.pipe";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";


export class ArtboardListener {
    private artboardClient: PipeEndpoint<ArtboardRequest, ArtboardResponse, 'artboard'>;

    constructor(
        private artboardPipe: Pipe<ArtboardRequest, ArtboardResponse, 'artboard'>,
        private artboard: Artboard,
    ) {
        this.artboardClient = webviewEndpoint.createFromPipe(this.artboardPipe);
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

    @makeMethodIterator()
    @setState
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