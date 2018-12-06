import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";


export class RectFigure implements Figure<SVGRectElement> {

    readonly name = 'rect';

    readonly ctor = SVGRectElement;

    constructor(
        public drag: DraggerValue,
        private artboard: Artboard,
    ) {}

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const svg = this.artboard.svg;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement;
        svg.appendChild(rect);
        rect.setAttribute('x', '50');
        rect.setAttribute('y', '50');
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '50');
        rect.setAttribute('stroke', '#ffffff');
        rect.setAttribute('fill', '#ccc');
    }

    testByElement(element: any): element is SVGRectElement {
        return element instanceof SVGRectElement;
    }

}