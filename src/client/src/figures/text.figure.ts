import { PipeEndpoint } from "@/common/pipe/pipe";
import { Appearance } from "@/webview/services/appearance/appearance";
import { artboard } from "@/webview/services/artboard";

import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { Mover } from "../services/mover/mover.model";


export class TextFigure implements Figure<SVGTextElement> {

    readonly name = 'text';

    readonly ctor = SVGTextElement;

    constructor(
        public drag: DraggerValue,
        public readonly move: Mover,
        private appearance: Appearance,
        private textReverseEndpoint: PipeEndpoint<{}, {text: string}, 'text-reverse'>,
    ) {}

    @setState
    async create(_elementName: string, attributes: {[K: string]: string}) {
        const { innerText } = attributes;
        if (!innerText) {
            const { text } = await this.textReverseEndpoint.makeGetRequest({});
            Object.assign(attributes, { innerText: text });
        }
        const svg = artboard.svg;
        const text = document.createElementNS('http://www.w3.org/2000/svg', this.name) as SVGTextElement;
        svg.appendChild(text);
        text.setAttribute('x', '50');
        text.setAttribute('y', '50');
        text.setAttribute('fill', this.appearance.fill);
        text.setAttribute('stroke', this.appearance.stroke);
        // text.setAttribute('style', 'font-family: sans-serif; font-size: 20px');
        text.setAttribute('font-size', '21');
        text.setAttribute('font-family', 'sans-serif');
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
