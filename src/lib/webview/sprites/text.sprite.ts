import { draggerLeftTop } from "@/webview/draggers";
import { moverLeftTop } from "@/webview/movers";
import { Sprite } from "@/webview/models/sprite.model";
import { textCreateOperator } from "../creators";
import { baseCopyOperator } from "@/webview/copiers";


export class TextSprite implements Sprite<SVGTextElement> {

    readonly name = 'text';

    readonly ctor = SVGTextElement;

    operators = {
        createOperator: textCreateOperator,
        dragOperator: draggerLeftTop,
        moveOperator: moverLeftTop,
        copyOperator: baseCopyOperator,
    };

}
