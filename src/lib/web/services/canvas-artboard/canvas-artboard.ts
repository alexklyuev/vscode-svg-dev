import { LayerComponent } from "@/webapp/components/layer.component";


export class CanvasArtboard {

    constructor(
        private artboardLayer: LayerComponent,
    ) {
    }

    get svg(): SVGSVGElement {
        return this.artboardLayer.svg;
    }

    get box(): HTMLElement {
        return this.artboardLayer.div;
    }

    get width(): number {
        const widthAttr = this.artboardLayer.svg.getAttribute('width');
        return parseFloat( widthAttr ! );
    }

    get height(): number {
        const heightAttr = this.artboardLayer.svg.getAttribute('height');
        return parseFloat( heightAttr ! );
    }

}
