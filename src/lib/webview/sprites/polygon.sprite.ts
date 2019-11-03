// import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";
import { polygonCreateOperator } from "../creators";
import { draggerPoints } from "@/webview/draggers";
import { moverPoints } from "@/webview/movers";
import { polyPointsEditor } from "@/webview/points-editor";
import { polyBoxEditor } from "@/webview/box-editor";
import { baseCopyOperator } from "@/webview/copiers";


export class PolygonSprite implements Sprite<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    // stroke = '#777';
    // fill = '#555';

    operators = {
        createOperator: polygonCreateOperator,
        dragOperator: draggerPoints,
        moveOperator: moverPoints,
        editPointsOperator: polyPointsEditor,
        editBoxOperator: polyBoxEditor,
        copyOperator: baseCopyOperator,
    };

}
