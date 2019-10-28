import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";
import { polygonCreateOperator } from "../creators";


export class PolygonSprite extends PolySprite implements Sprite<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    readonly createOperator = polygonCreateOperator;

    stroke = '#777';
    fill = '#555';

}
