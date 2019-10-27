import { artboard } from "@/webview/services/artboard";
import { draggerDelegate } from "@/webview/draggers";
import { moverDelegate } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export class GSprite implements Sprite<SVGGElement> {

    readonly name = 'g';

    readonly ctor = SVGGElement;

    public readonly dragOperator = draggerDelegate;
    public readonly moveOperator = moverDelegate;

    /**
     * 
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const { svg } = artboard;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.appendChild(g);
    }

}
