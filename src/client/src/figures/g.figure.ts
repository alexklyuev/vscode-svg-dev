import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerDelegate } from "../services/dragger/dragger-delegate";

export class GFigure implements Figure<SVGGElement> {

    readonly name = 'g';

    readonly ctor = SVGGElement;


    constructor(
        public drag: DraggerDelegate,
        private artboard: Artboard,
    ) {}

    /**
     * 
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const { svg } = this.artboard;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.appendChild(g);
    }

    testByElement(element: any): element is SVGGElement {
        return element instanceof SVGGElement;
    }

}
