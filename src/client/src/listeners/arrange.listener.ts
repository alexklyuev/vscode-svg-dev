import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { ArrangePipeRequest } from "../../../shared/pipes/arrange.pipe";
import { Artboard } from "../services/artboard/artboard";
import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";


export class ArrangeListener {
    private arrangeClient: PipeEndpoint<ArrangePipeRequest, {}, 'arrange'>;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private arrangePipe: Pipe<ArrangePipeRequest, {}, 'arrange'>,
        private artboard: Artboard,
        private readonly holder: ElementHolder,
    ) {
        this.arrangeClient = this.webviewEndpoint.createFromPipe(this.arrangePipe);
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
                this.artboard.svg.appendChild(element);
                break;
            case 'sendToBack':
                const { firstChild } = this.artboard.svg;
                if (firstChild) {
                    this.artboard.svg.insertBefore(element, firstChild);
                }
                break;
            case 'moveForward':
                const { childNodes: childNodes1 } = this.artboard.svg;
                const selfIndex1 = Array.from(childNodes1).reduce((akk, child, index) => {
                    return child === element ? index : akk;
                }, -1);
                const anchorIndex = selfIndex1 + 2;
                const anchor = childNodes1[anchorIndex];
                if (anchor) {
                    this.artboard.svg.insertBefore(element, anchor);
                } else {
                    this.artboard.svg.appendChild(element);
                }
                break;
            case 'moveBackward':
                const { childNodes: childNodes2 } = this.artboard.svg;
                const selfIndex2 = Array.from(childNodes2).reduce((akk, child, index) => {
                    return child === element ? index : akk;
                }, -1);
                const prevIndex = selfIndex2 - 1;
                const prev = childNodes2[prevIndex];
                if (prev) {
                    this.artboard.svg.insertBefore(element, prev);
                }
                break;
        }
    }

}
