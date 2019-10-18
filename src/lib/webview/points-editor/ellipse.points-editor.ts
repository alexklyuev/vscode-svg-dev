import { BasePointsEditor } from "@/webview/points-editor/base.points-editor";
import { spawner } from "@/dom/spawner";


export class EllipsePointsEditor extends BasePointsEditor<SVGEllipseElement> {

    getPoints(element: SVGEllipseElement) {
        const cx = parseFloat( element.getAttribute('cx')! );
        const cy = parseFloat( element.getAttribute('cy')! );
        const rx = parseFloat( element.getAttribute('rx')! );
        const ry = parseFloat( element.getAttribute('ry')! );
        const points = Array<[number, number]>(
            [cx + rx, cy],
            [cx, cy + ry],
        );
        return points;
    }

    onMove(
        element: SVGEllipseElement,
        circleIndex: number,
        relDelta: [number, number],
        mirror: [boolean, boolean],
        _event: MouseEvent,
    ) {
        let rx$ = parseFloat( element.getAttribute('rx')! );
        let ry$ = parseFloat( element.getAttribute('ry')! );
        const [ relDeltaX, relDeltaY ] = relDelta;
        const [ horizontalInvert, verticalInvert ] = mirror;
        switch (circleIndex) {
            case 0:
                rx$ += relDeltaX * (horizontalInvert ? -1 : 1);
                break;
            case 1:
                ry$ += relDeltaY * (verticalInvert ? -1 : 1);
                break;
        }
        if (rx$ < 0 ) {
            rx$ = -rx$;
            mirror[0] = !horizontalInvert;
        }
        if (ry$ < 0) {
            ry$ = -ry$;
            mirror[1] = !verticalInvert;
        }
        spawner.svg.update(element, {
            rx: `${ rx$ }`,
            ry: `${ ry$ }`,
        });
    }

}
