import { PolyFigure } from "./poly.abstract.figure";
import { Sprite } from "../models/sprite.model";


export class PolylineFigure extends PolyFigure implements Sprite<SVGPolylineElement> {

    readonly name = 'polyline';
    readonly ctor = SVGPolylineElement;

    stroke = '#777';
    fill = 'none';

    testByElement(element: any): element is SVGPolylineElement {
        return element instanceof this.ctor;
    }

}
