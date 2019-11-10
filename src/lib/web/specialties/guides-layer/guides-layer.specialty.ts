import { spawner } from "@/dom/spawner";
import { LayerComponent } from "@/webapp/components/layer.component";


export class GuidesLayerSpecialty {

    /**
     * @todo move to appearance
     */
    private readonly borderStyle = '1px dotted #666';

    constructor(
        private toolsLayer: LayerComponent,
        private artboardLayer: LayerComponent,
    ) {
    }

    updateGuidesOutline() {
        const { left, top, width, height } = this.artboardLayer.svg.getBoundingClientRect();
        spawner.svg.update(this.toolsLayer.svg, {}, {
            position: 'absolute',
            border: this.borderStyle,
            left: `${ left }px`,
            top: `${ top }px`,
            width: `${ width }px`,
            height: `${ height }px`,
        });
    }

}
