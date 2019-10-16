import { artboard } from "@/webview/services/artboard";
import { draggerPath } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { textReverseEndpoint } from "@/webview/producers/text-reverse.producer";
import { appearance } from "@/webview/services/appearance";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export class TextFigure implements Figure<SVGTextElement> {

    readonly name = 'text';

    readonly ctor = SVGTextElement;

    public readonly drag = draggerPath;
    public readonly move = moverPath;

    @setState
    async create(_elementName: string, attributes: {[K: string]: string}) {
        const { innerText } = attributes;
        if (!innerText) {
            const { text } = await textReverseEndpoint.makeGetRequest({});
            Object.assign(attributes, { innerText: text });
        }
        const svg = artboard.svg;
        const text = document.createElementNS('http://www.w3.org/2000/svg', this.name) as SVGTextElement;
        svg.appendChild(text);
        text.setAttribute('x', '50');
        text.setAttribute('y', '50');
        text.setAttribute('fill', appearance.fill);
        text.setAttribute('stroke', appearance.stroke);
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
