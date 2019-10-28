import { draggerLeftTop } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { textCreateOperator } from "../creators";


export class TextSprite implements Sprite<SVGTextElement> {

    readonly name = 'text';

    readonly ctor = SVGTextElement;

    public readonly createOperator = textCreateOperator;
    public readonly dragOperator = draggerLeftTop;
    public readonly moveOperator = moverPath;

    // @setState
    // async create(_elementName: string, attributes: {[K: string]: string}) {
    //     const { innerText } = attributes;
    //     if (!innerText) {
    //         const { text } = await textReverseEndpoint.makeGetRequest({});
    //         Object.assign(attributes, { innerText: text });
    //     }
    //     const svg = artboard.svg;
    //     const text = document.createElementNS('http://www.w3.org/2000/svg', this.name) as SVGTextElement;
    //     svg.appendChild(text);
    //     text.setAttribute('x', '50');
    //     text.setAttribute('y', '50');
    //     text.setAttribute('fill', appearance.fill);
    //     text.setAttribute('stroke', appearance.stroke);
    //     // text.setAttribute('style', 'font-family: sans-serif; font-size: 20px');
    //     text.setAttribute('font-size', '21');
    //     text.setAttribute('font-family', 'sans-serif');
    //     Object.keys(attributes).forEach(attrName => {
    //         const attrValue = attributes[attrName];
    //         switch (attrName) {
    //             case 'innerText': text.innerHTML = attrValue; break;
    //             default: text.setAttribute(attrName, attrValue); break;
    //         }
    //     });
    // }

}
