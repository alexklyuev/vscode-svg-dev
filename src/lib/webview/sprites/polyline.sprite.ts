import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";
import { polylineCreateOperator } from "../creators";


export class PolylineSprite extends PolySprite implements Sprite<SVGPolylineElement> {

    readonly name = 'polyline';
    readonly ctor = SVGPolylineElement;

    readonly createOperator = polylineCreateOperator;

    stroke = '#777';
    fill = 'none';

}
