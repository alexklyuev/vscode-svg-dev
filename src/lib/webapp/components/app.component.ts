import { artboard } from "@/webview/services/artboard";
import { guides } from "@/webview/services/guides";
import { artboardMove } from "@/webview/services/artboard-move";
import { zoom } from "@/webview/services/zoom";
import { LayerComponent } from "./layer.component";
import { CanvasArtboard } from "@/web/services/canvas-artboard/canvas-artboard";
import { CanvasZoom } from "@/web/services/canvas-zoom/canvas-zoom";
import { CanvasMove } from "@/web/services/canvas-move/canvas-move";


export class AppComponent extends HTMLElement {

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        const div = document.createElement('div');
        shadow.appendChild(div);

        const artboardLayer = new LayerComponent();
        const toolsLayer = new LayerComponent();

        div.appendChild(artboardLayer);
        div.appendChild(toolsLayer);

        artboardLayer.id = 'workareaLayer';
        toolsLayer.id = 'toolsLayer';

        const canvasZoom = new CanvasZoom();
        const canvasArtboard = new CanvasArtboard(artboardLayer);
        const canvasMove = new CanvasMove(artboardLayer);



        guides.setContainer(toolsLayer.svg);
        guides.setContainerStyles();

        artboardMove.target = artboardLayer.div;
        artboardMove.initPosition();
        artboardMove.on();

        zoom.target = artboardLayer.div;

        setTimeout(() => {
            Object.assign(artboard.box.style, {
                position: 'absolute',
            });
            Object.assign(artboard.svg, {
                position: 'relative',
                top: '0px',
                left: '0px',
            });
            guides.setContainerStyles();
        }, 0);

    }

}
