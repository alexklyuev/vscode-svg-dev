import { PolyFigure } from "./poly.abstract.figure";
import { Figure } from "./figure.model";


export class PolygonFigure extends PolyFigure implements Figure<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    stroke = '#777';
    fill = '#555';

    testByElement(element: any): element is SVGPolygonElement {
        return element instanceof this.ctor;
    }

}
