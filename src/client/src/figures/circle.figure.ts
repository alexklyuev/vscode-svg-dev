import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";

export class CircleFigure implements Figure<SVGCircleElement> {

    readonly name = 'circle';

    readonly ctor = SVGCircleElement;

    constructor(
        public readonly drag: DraggerValue,
        private artboard: Artboard,
    ) {}

    testByElement(element: any): element is SVGCircleElement {
        return element instanceof SVGCircleElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const svg = this.artboard.svg;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGCircleElement;
        svg.appendChild(circle);
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '30');
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('fill', '#ccc');
    }

}