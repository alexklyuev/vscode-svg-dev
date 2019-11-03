import { draggerLeftTop } from "@/webview/draggers";
import { moverLeftTop } from "@/webview/movers";
import { rectPointsEditor } from "@/webview/points-editor";
import { Sprite } from "@/webview/models/sprite.model";
import { rectBoxEditor } from "@/webview/box-editor";
import { rectCreateOperator } from "@/webview/creators";
import { baseCopyOperator } from "@/webview/copiers";


export class RectSprite implements Sprite<SVGRectElement> {

    readonly name = 'rect';

    readonly ctor = SVGRectElement;

    operators = {
        createOperator: rectCreateOperator,
        dragOperator: draggerLeftTop,
        moveOperator: moverLeftTop,
        editPointsOperator: rectPointsEditor,
        editBoxOperator: rectBoxEditor,
        copyOperator: baseCopyOperator,
    };

}
