import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { artboard } from "@/web/init";

import { ArrangePipeRequest } from "@/shared/pipes/arrange.pipe";
import { ElementHolder } from "@/webview/services/holder/element-holder";
import { setState } from "&resolve/decorators/set-state.decorator";
import { Listener } from "../../models/listener.model";


export class ArrangeListener implements Listener {
    private arrangeClient: PipeEndpoint<ArrangePipeRequest, {}, 'arrange'>;

    constructor(
        private arrangePipe: Pipe<ArrangePipeRequest, {}, 'arrange'>,
        private readonly holder: ElementHolder,
    ) {
        this.arrangeClient = webviewEndpoint.createFromPipe(this.arrangePipe);
    }

    listen() {
        this.arrangeClient.listenSetRequest(
            _request => this.holder.elements,
            (request, elements) => {
                elements.forEach(element => {
                    this.arrange(element, request);
                });
            },
        );
    }

    @setState
    arrange(element: SVGElement, request: ArrangePipeRequest) {
        switch (request) {
            case 'bringToFront': 
                artboard.svg.appendChild(element);
                break;
            case 'sendToBack':
                const { firstChild } = artboard.svg;
                if (firstChild) {
                    artboard.svg.insertBefore(element, firstChild);
                }
                break;
            case 'moveForward':
                const { childNodes: childNodes1 } = artboard.svg;
                const selfIndex1 = Array.from(childNodes1).reduce((akk, child, index) => {
                    return child === element ? index : akk;
                }, -1);
                const anchorIndex = selfIndex1 + 2;
                const anchor = childNodes1[anchorIndex];
                if (anchor) {
                    artboard.svg.insertBefore(element, anchor);
                } else {
                    artboard.svg.appendChild(element);
                }
                break;
            case 'moveBackward':
                const { childNodes: childNodes2 } = artboard.svg;
                const selfIndex2 = Array.from(childNodes2).reduce((akk, child, index) => {
                    return child === element ? index : akk;
                }, -1);
                const prevIndex = selfIndex2 - 1;
                const prev = childNodes2[prevIndex];
                if (prev) {
                    artboard.svg.insertBefore(element, prev);
                }
                break;
        }
    }

}
