import { draggerDelegate } from "@/webview/draggers";
import { moverDelegate } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { baseCopyOperator } from "@/webview/copiers";


export class GSprite implements Sprite<SVGGElement> {

    readonly name = 'g';

    readonly ctor = SVGGElement;

    operators = {
        dragOperator: draggerDelegate,
        moveOperator: moverDelegate,
        copyOperator: baseCopyOperator,
    };

}
