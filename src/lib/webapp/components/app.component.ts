import { LayerComponent } from "@/web/components/layer.component";
import { CanvasZoom } from "@/web/services/canvas-zoom/canvas-zoom";
import { CanvasArtboard } from "@/web/services/canvas-artboard/canvas-artboard";
import { CanvasMove } from "@/web/services/canvas-move/canvas-move";
import { CanvasGuides } from "@/web/services/canvas-guides/canvas-guides";
import { findMethodIterator } from "@/common/iterators";


export class AppComponent extends HTMLElement {

    constructor(
        public artboardLayer: LayerComponent,
        public guidesLayer: LayerComponent,
        public canvasZoom: CanvasZoom,
        public canvasArtboard: CanvasArtboard,
        public canvasMove: CanvasMove,
        public canvasGuides: CanvasGuides,
    ) {
        super();

        const shadow: ShadowRoot = this.attachShadow({mode: 'open'});

        const div = document.createElement('div');
        shadow.appendChild(div);

        div.appendChild(artboardLayer);
        div.appendChild(guidesLayer);

        canvasMove.initPosition();
        canvasMove.on();

        /**
         * 
         */
        (async () => {
            const connects = findMethodIterator(LayerComponent.prototype.connected, artboardLayer);
            for await (const _layer of connects) {
                console.log('opop', _layer);
                canvasGuides.setContainerStyles();
            }
        })();

        /**
         * 
         */
        (async () => {
            const zooms = findMethodIterator(canvasZoom.update);
            for await (const zoom of zooms) {
                Object.assign(artboardLayer.div.style, {
                    transform: `scale(${ zoom })`,
                });
                canvasGuides.setContainerStyles();
            }
        })();

        /**
         * 
         */
        (async () => {
            const moves = findMethodIterator(canvasMove.onMouseMove);
            for await (const _move of moves) {
                canvasGuides.setContainerStyles();
            }
        })();

    }

}
