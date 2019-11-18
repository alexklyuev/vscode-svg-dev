import { LayerComponent } from "@/web/components/layer.component";


export class CanvasArtboard {

    constructor(
        private artboardLayer: LayerComponent,
    ) {
        Object.assign(this.box.style, {
            position: 'absolute',
        });
        // Object.assign(this.svg.style, {
        //     position: 'relative',
        //     top: '0px',
        //     left: '0px',
        // });
    }

    get svg(): SVGSVGElement {
        return this.artboardLayer.svg;
    }

    get box(): HTMLElement {
        return this.artboardLayer.div;
    }

    get width(): number {
        const widthAttr = this.artboardLayer.svg.getAttribute('width');
        if (widthAttr) {
            return parseFloat( widthAttr ! );
        } else {
            console.warn('Artboard has no width set');
            const { width } = this.artboardLayer.svg.getBoundingClientRect();
            return width;
        }
    }

    get height(): number {
        const heightAttr = this.artboardLayer.svg.getAttribute('height');
        if (heightAttr) {
            return parseFloat( heightAttr ! );
        } else {
            console.warn('Artboard has no height set');
            const { height } = this.artboardLayer.svg.getBoundingClientRect();
            return height;
        }
    }

}
