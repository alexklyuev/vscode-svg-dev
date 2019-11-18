import { BaseCreateOperator } from "./base.create-operator";
import { setState } from "&resolve/decorators/set-state.decorator";

import { textReverseEndpoint } from "../producers/text-reverse.producer";
import { artboard } from "@/web/init";
import { appearance } from "../services/appearance";


export class TextCreateOperator extends BaseCreateOperator {

    /**
     * @override
     */
    @setState
    async create(_name: string, attributes: {[K: string]: string}) {
        const { innerText } = attributes;
        if (!innerText) {
            const { text } = await textReverseEndpoint.makeGetRequest({});
            Object.assign(attributes, { innerText: text });
        }
        const text = await this.makeElement();
        if (text instanceof SVGElement) {
            Object.keys(attributes).forEach(attrName => {
                const attrValue = attributes[attrName];
                switch (attrName) {
                    case 'innerText': text.innerHTML = attrValue; break;
                    default: text.setAttribute(attrName, attrValue); break;
                }
            });
        }
    }

    async makeElement() {
        const svg = artboard.svg;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svg.appendChild(text);
        text.setAttribute('x', '50');
        text.setAttribute('y', '50');
        text.setAttribute('fill', appearance.fill);
        text.setAttribute('stroke', appearance.stroke);
        text.setAttribute('font-size', '21');
        text.setAttribute('font-family', 'sans-serif');

        return text;
    }

}
