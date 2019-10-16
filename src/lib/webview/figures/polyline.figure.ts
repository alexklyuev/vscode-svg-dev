import { PolyFigure } from "./poly.abstract.figure";
import { Figure } from "../models/figure.model";


export class PolylineFigure extends PolyFigure implements Figure<SVGPolylineElement> {

    readonly name = 'polyline';
    readonly ctor = SVGPolylineElement;

    stroke = '#777';
    fill = 'none';

    testByElement(element: any): element is SVGPolylineElement {
        return element instanceof this.ctor;
    }

}
