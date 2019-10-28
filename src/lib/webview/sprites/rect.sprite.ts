import { draggerLeftTop } from "@/webview/draggers";
import { moverLeftTop } from "@/webview/movers";
import { rectPointsEditor } from "@/webview/points-editor";
import { Sprite } from "@/webview/models/sprite.model";
import { rectBoxEditor } from "@/webview/box-editor";
import { rectCreateOperator } from "@/webview/creators";


export class RectSprite implements Sprite<SVGRectElement> {

    readonly name = 'rect';

    readonly ctor = SVGRectElement;

    public readonly createOperator = rectCreateOperator;
    public readonly dragOperator = draggerLeftTop;
    public readonly moveOperator = moverLeftTop;
    public readonly editPointsOperator = rectPointsEditor;
    public readonly editBoxOperator = rectBoxEditor;

}
