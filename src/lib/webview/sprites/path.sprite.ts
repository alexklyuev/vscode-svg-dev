import { draggerPath } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { pathPointsEditor } from "../points-editor";
import { pathCreateOperator } from "../creators";
import { baseCopyOperator } from "@/webview/copiers";
import { pathBoxEditor } from "@/webview/box-editor";


export class PathSprite implements Sprite<SVGPathElement> {

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    operators = {
        createOperator: pathCreateOperator,
        dragOperator: draggerPath,
        moveOperator: moverPath,
        editPointsOperator: pathPointsEditor,
        editBoxOperator: pathBoxEditor,
        copyOperator: baseCopyOperator,
    };

}
