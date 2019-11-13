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

export const zoom = new CanvasZoom();
export const artboard = new CanvasArtboard(artboardLayer);
export const artboardMove = new CanvasMove(artboardLayer);
export const guides = new CanvasGuides(guidesLayer, artboardLayer);

export const app = new AppComponent(
    artboardLayer,
    guidesLayer,
    zoom,
    artboard,
    artboardMove,
    guides,
);

Object.assign(window, {
    svgdev: {
        zoom: zoom,
        artboard: artboard,
        move: artboardMove,
        guides: guides,
    },
});
