import { artboard } from "@/webview/services/artboard";

import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { DraggerDelegate } from "../services/dragger/dragger-delegate";
import { Mover } from "../services/mover/mover.model";

export class GFigure implements Figure<SVGGElement> {

    readonly name = 'g';

    readonly ctor = SVGGElement;


    constructor(
        public readonly drag: DraggerDelegate,
        public readonly move: Mover,
    ) {}

    /**
     * 
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const { svg } = artboard;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.appendChild(g);
    }

    testByElement(element: any): element is SVGGElement {
        return element instanceof SVGGElement;
    }

}
