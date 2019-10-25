import { PolySprite } from "./poly.abstract.sprite";
import { Sprite } from "../models/sprite.model";


export class PolylineSprite extends PolySprite implements Sprite<SVGPolylineElement> {

    readonly name = 'polyline';
    readonly ctor = SVGPolylineElement;

    stroke = '#777';
    fill = 'none';

    testByElement(element: any): element is SVGPolylineElement {
        return element instanceof this.ctor;
    }

}
