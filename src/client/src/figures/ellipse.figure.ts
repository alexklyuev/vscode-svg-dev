import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";

export class EllipseFigure implements Figure<SVGEllipseElement> {

    readonly name = 'ellipse';

    readonly ctor = SVGEllipseElement;

    constructor(
        public readonly drag: DraggerValue,
        private artboard: Artboard,
    ) {
    }

    testByElement(element: any): element is SVGEllipseElement {
        return element instanceof SVGEllipseElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const svg = this.artboard.svg;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse') as SVGEllipseElement;
        svg.appendChild(circle);
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('rx', '20');
        circle.setAttribute('ry', '40');
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('fill', '#ccc');
    }

}
