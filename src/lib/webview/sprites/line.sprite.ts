import { draggerDouble } from "@/webview/draggers";
import { moverLine } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { linePointsEditor } from "../points-editor";
import { lineCreateOperator } from "../creators";
import { lineBoxEditor } from "../box-editor";
import { baseCopyOperator } from "@/webview/copiers";


export class LineSprite implements Sprite<SVGLineElement> {

    readonly name = 'line';
    readonly ctor = SVGLineElement;

    operators = {
        createOperator: lineCreateOperator,
        dragOperator: draggerDouble,
        moveOperator: moverLine,
        editPointsOperator: linePointsEditor,
        editBoxOperator: lineBoxEditor,
        copyOperator: baseCopyOperator,
    };

}
