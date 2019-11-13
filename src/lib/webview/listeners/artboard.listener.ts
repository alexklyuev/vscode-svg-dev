import { artboard } from "@/web/init";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ArtboardRequest, ArtboardResponse, artboardPipe } from "../../shared/pipes/artboard.pipe";
import { setState } from "../decorators/set-state.decorator";


export class ArtboardListener {
    private artboardClient: PipeEndpoint<ArtboardRequest, ArtboardResponse, 'artboard'>;

    constructor(
    ) {
        this.artboardClient = webviewEndpoint.createFromPipe(artboardPipe);
    }

    listen() {
        this.artboardClient.listenGetRequest(
            _request => artboard.svg,
            (request, svg) => {
                const { property } = request;
                return {value: svg.getAttribute(property)};
            },
        );
        this.artboardClient.listenSetRequest(
            _request => artboard.svg,
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