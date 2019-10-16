import { artboard } from "@/webview/services/artboard";
import { draggerDelegate } from "@/webview/draggers";
import { moverDelegate } from "@/webview/movers";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export class GFigure implements Figure<SVGGElement> {

    readonly name = 'g';

    readonly ctor = SVGGElement;

    public readonly drag = draggerDelegate;
    public readonly move = moverDelegate;

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
