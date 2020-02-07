import { Sprite } from "../models/sprite.model";
import { draggerPath } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { baseCopyOperator } from "@/webview/copiers";


export class ArrowSprite implements Sprite<SVGPathElement> {

    readonly name = 'svgdev-arrow';

    readonly ctor = null;

    readonly typeAttribute = 'arrow';

    operators = {
        dragOperator: draggerPath,
        moveOperator: moverPath,
        copyOperator: baseCopyOperator,
    };

}
