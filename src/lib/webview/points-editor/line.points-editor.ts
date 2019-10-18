import { BasePointsEditor } from "@/webview/points-editor/base.points-editor";
import { spawner } from "@/dom/spawner";


export class LinePointsEditor extends BasePointsEditor<SVGLineElement> {

    getPoints(element: SVGLineElement): Array<[number, number]> {
        const x1 = parseFloat( element.getAttribute('x1')! );
        const y1 = parseFloat( element.getAttribute('y1')! );
        const x2 = parseFloat( element.getAttribute('x2')! );
        const y2 = parseFloat( element.getAttribute('y2')! );
        return Array<[number, number]>(
            [x1, y1],
            [x2, y2],
        );
    }

    onMove(
        element: SVGLineElement,
        circleIndex: number,
        relDelta: [number, number],
        _mirror: [boolean, boolean],
        _event: MouseEvent,
    ) {
        let x1 = parseFloat( element.getAttribute('x1')! );
        let y1 = parseFloat( element.getAttribute('y1')! );
        let x2 = parseFloat( element.getAttribute('x2')! );
        let y2 = parseFloat( element.getAttribute('y2')! );
        const [ dx, dy ] = relDelta;
        switch (circleIndex) {
            case 0:
                x1 += dx;
                y1 += dy;
                break;
            case 1:
                x2 += dx;
                y2 += dy;
                break;
        }
        spawner.svg.update(element, {
            x1: `${ x1 }`,
            y1: `${ y1 }`,
            x2: `${ x2 }`,
            y2: `${ y2 }`,
        });
    }

}
