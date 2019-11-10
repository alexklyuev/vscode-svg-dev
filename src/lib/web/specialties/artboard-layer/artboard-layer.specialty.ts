import { findMethodIterator } from "@/common/iterators";
import { LayerComponent } from "@/webapp/components/layer.component";
import { CanvasZoom } from "@/web/services/canvas-zoom/canvas-zoom";


export class ArtboardLayerSpecialty {

    constructor(
        artboardLayer: LayerComponent,
        canvasZoom: CanvasZoom,
    ) {
        /**
         * apply zoom to active artboard
         */
        (async () => {
            const zoomUpdates = findMethodIterator(canvasZoom.update);
            for await (const zoom of zoomUpdates) {
                Object.assign(artboardLayer.div.style, {
                    transform: `scale(${ zoom })`,
                });
            }
        })();
    }

}
