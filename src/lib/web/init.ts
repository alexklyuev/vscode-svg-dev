import { LayerComponent } from "@/web/components/layer.component";
import { CanvasZoom } from "@/web/services/canvas-zoom/canvas-zoom";
import { CanvasArtboard } from "@/web/services/canvas-artboard/canvas-artboard";
import { CanvasMove } from "@/web/services/canvas-move/canvas-move";
import { CanvasGuides } from "@/web/services/canvas-guides/canvas-guides";
import { AppComponent } from "@/web/components/app.component";


customElements.define('svgdev-app', AppComponent);
customElements.define('svgdev-layer', LayerComponent);

export const artboardLayer = new LayerComponent();
export const guidesLayer = new LayerComponent();

artboardLayer.id = 'artboardLayer';
guidesLayer.id = 'guidesLayer';

export const canvasZoom = new CanvasZoom();
export const canvasArtboard = new CanvasArtboard(artboardLayer);
export const canvasMove = new CanvasMove(artboardLayer);
export const canvasGuides = new CanvasGuides(guidesLayer, artboardLayer);

export const app = new AppComponent(
    artboardLayer,
    guidesLayer,
    canvasZoom,
    canvasArtboard,
    canvasMove,
    canvasGuides,
);

Object.assign(window, {
    svgdev: {
        zoom: canvasZoom,
        artboard: canvasArtboard,
        move: canvasMove,
        guides: canvasGuides,
    },
});
