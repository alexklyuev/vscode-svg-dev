import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { Appearance } from "../services/appearance/appearance";


export class TextFigure implements Figure<SVGTextElement> {

    readonly name = 'text';

    readonly ctor = SVGTextElement;

    constructor(
        public drag: DraggerValue,
        private artboard: Artboard,
        private appearance: Appearance,
    ) {}

    @setState
    create(_elementName: string, attributes: {[K: string]: string}): void {
        const svg = this.artboard.svg;
        const text = document.createElementNS('http://www.w3.org/2000/svg', this.name) as SVGTextElement;
        svg.appendChild(text);
        text.setAttribute('x', '50');
        text.setAttribute('y', '50');
        text.setAttribute('fill', this.appearance.fill);
        text.setAttribute('stroke', this.appearance.stroke);
        text.setAttribute('style', 'font-family: sans-serif; font-size: 20px');
        Object.keys(attributes).forEach(attrName => {
            const attrValue = attributes[attrName];
            switch (attrName) {
                case 'innerText': text.innerHTML = attrValue; break;
                default: text.setAttribute(attrName, attrValue); break;
            }
        });
    }

    testByElement(element: any): element is SVGTextElement {
        return element instanceof this.ctor;
    }

}
