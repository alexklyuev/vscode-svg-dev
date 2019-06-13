import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Dragger } from "../services/dragger/dragger.interface";


export class PathFigure implements Figure<SVGPathElement> {

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    constructor(
        public drag: Dragger,
        private artboard: Artboard,
    ) {}

    @setState
    create(_elementName: string, attributes: {[K: string]: string}): void {
        const { svg } = this.artboard;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(path);
        Object.keys(attributes).forEach(key => {
            path.setAttribute(key, attributes[key]);
        });
    }

    testByElement(element: any): element is SVGPathElement {
        return element instanceof SVGPathElement;
    }

}
