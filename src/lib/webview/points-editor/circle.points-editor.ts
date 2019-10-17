import { spawner } from "@/dom/spawner";
import { BasePointsEditor } from "./base.points-editor";


export class CirclePointsEditor extends BasePointsEditor<SVGCircleElement> {

    getPoints(element: SVGCircleElement) { 
        const cx = parseFloat(element.getAttribute('cx')!);
        const cy = parseFloat(element.getAttribute('cy')!);
        const r = parseFloat(element.getAttribute('r')!);
        const points = Array<[number, number]>(
            [cx + r, cy],
        );
        return points;
    }

    onMove(
        element: SVGCircleElement,
        _circleIndex: number,
        relDelta: [number, number],
        mirror: [boolean, boolean],
    ) {
        const [ relDeltaX, ] = relDelta;
        const [ horizontalInvert, ] = mirror;
        let r$ = parseFloat( element.getAttribute('r')! );
        r$ += relDeltaX * (horizontalInvert ? -1 : 1);
        if (r$ < 0) {
            r$ *= -1;
            mirror[0] = !horizontalInvert;
        }
        spawner.svg.update(element, {
            r: `${ r$ }`,
        });
    }

}
