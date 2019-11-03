// import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";
import { polylineCreateOperator } from "../creators";
import { draggerPoints } from "@/webview/draggers";
import { moverPoints } from "@/webview/movers";
import { polyPointsEditor } from "@/webview/points-editor";
import { polyBoxEditor } from "@/webview/box-editor";
import { baseCopyOperator } from "@/webview/copiers";


export class PolylineSprite implements Sprite<SVGPolylineElement> {

    readonly name = 'polyline';
    readonly ctor = SVGPolylineElement;

    // stroke = '#777';
    // fill = 'none';

    operators = {
        createOperator: polylineCreateOperator,
        dragOperator: draggerPoints,
        moveOperator: moverPoints,
        editPointsOperator: polyPointsEditor,
        editBoxOperator: polyBoxEditor,
        copyOperator: baseCopyOperator,
    };


}
