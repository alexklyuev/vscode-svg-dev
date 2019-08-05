import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Zoom } from "../services/zoom/zoom";
import { Artboard } from "../services/artboard/artboard";
import { Pipe, PipeEndpoint } from "../../../lib/common/pipe/pipe";
import { ZoomRequest } from "../../../shared/pipes/zoom.pipe";
// import { updateSelection } from "../decorators/update-selection.decorator";


export class ZoomListener {
    private zoomer: PipeEndpoint<ZoomRequest, {}, "zoom">;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private zoomPipe: Pipe<ZoomRequest, {}, 'zoom'>,
        private artboard: Artboard,
        private zoom: Zoom,
    ) {
        this.zoomer = this.webviewEndpoint.createFromPipe(this.zoomPipe);
    }

    listen() {
        this.zoomer.listenSetRequest(
            _request => this.artboard.box,
            (request, _box) => {
                const { delta, abs } = request;
                // this.zoom.update(delta, abs);
                this.updateZoom(delta, abs);
            },
        );
    }

    // @updateSelection
    updateZoom(delta: number | undefined, abs: number | undefined) {
        this.zoom.update(delta, abs);
    }

}
