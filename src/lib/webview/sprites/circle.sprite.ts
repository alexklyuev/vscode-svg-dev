import { draggerCenter } from "@/webview/draggers";
import { moverCenter } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { circlePointsEditor } from "@/webview/points-editor";
import { circleCreateOperator } from "@/webview/creators";
import { baseCopyOperator } from "@/webview/copiers";


export class CircleSprite implements Sprite<SVGCircleElement> {

    readonly name = 'circle';

    readonly ctor = SVGCircleElement;

    operators = {
        createOperator: circleCreateOperator,
        dragOperator: draggerCenter,
        moveOperator: moverCenter,
        editPointsOperator: circlePointsEditor,
        copyOperator: baseCopyOperator,
    };

}
