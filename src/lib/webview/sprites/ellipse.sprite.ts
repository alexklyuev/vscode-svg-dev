import { draggerCenter } from "@/webview/draggers";
import { moverCenter } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { ellipsePointsEdtitor } from "../points-editor";
import { ellipseCreateOperator } from "../creators";
import { baseCopyOperator } from "@/webview/copiers";
import { ellipseBoxEditor } from "@/webview/box-editor";


export class EllipseSprite implements Sprite<SVGEllipseElement> {

    readonly name = 'ellipse';

    readonly ctor = SVGEllipseElement;

    operators = {
        createOperator: ellipseCreateOperator,
        dragOperator: draggerCenter,
        moveOperator: moverCenter,
        editPointsOperator: ellipsePointsEdtitor,
        editBoxOperator: ellipseBoxEditor,
        copyOperator: baseCopyOperator,
    };

}
