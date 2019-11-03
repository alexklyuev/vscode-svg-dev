import { draggerPath } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { pathPointsEditor } from "../points-editor";
import { BaseBoxEditor } from "../box-editor/base.box-editor";
import { pathCreateOperator } from "../creators";
import { baseCopyOperator } from "@/webview/copiers";


export class PathSprite implements Sprite<SVGPathElement> {

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    operators = {
        createOperator: pathCreateOperator,
        dragOperator: draggerPath,
        moveOperator: moverPath,
        editPointsOperator: pathPointsEditor,
        editBoxOperator: new BaseBoxEditor(),
        copyOperator: baseCopyOperator,
    };

}
