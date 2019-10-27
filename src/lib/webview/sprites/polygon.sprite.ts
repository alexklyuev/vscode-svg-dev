import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";


export class PolygonSprite extends PolySprite implements Sprite<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    stroke = '#777';
    fill = '#555';

}
