import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";
import { artboard } from "@/web/init";
import { ZoomRequest } from "@/shared/pipes/zoom.pipe";
import { CanvasZoom } from "@/web/services/canvas-zoom/canvas-zoom";


export class ZoomListener {
    private zoomer: PipeEndpoint<ZoomRequest, {}, "zoom">;

    constructor(
        private zoomPipe: Pipe<ZoomRequest, {}, 'zoom'>,
        private zoom: CanvasZoom,
    ) {
        this.zoomer = webviewEndpoint.createFromPipe(this.zoomPipe);
    }

    listen() {
        this.zoomer.listenSetRequest(
            _request => artboard.box,
            (request, _box) => {
                const { delta, abs } = request;
                // this.zoom.update(delta, abs);
                this.updateZoom(delta, abs);
            },
        );
    }

    updateZoom(delta: number | undefined, abs: number | undefined) {
        this.zoom.update({delta, abs});
    }

}
