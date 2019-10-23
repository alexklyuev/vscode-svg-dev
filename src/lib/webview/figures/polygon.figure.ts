import { PolyFigure } from "./poly.abstract.figure";
import { Sprite } from "../models/sprite.model";


export class PolygonFigure extends PolyFigure implements Sprite<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    stroke = '#777';
    fill = '#555';

    testByElement(element: any): element is SVGPolygonElement {
        return element instanceof this.ctor;
    }

}
