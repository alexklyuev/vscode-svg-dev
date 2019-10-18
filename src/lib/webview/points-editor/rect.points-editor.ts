import { spawner } from "@/dom/spawner";
import { BasePointsEditor } from "@/webview/points-editor/base.points-editor";


export class RectPointsEditor extends BasePointsEditor<SVGRectElement> {

    getPoints(element: SVGRectElement) { 
        const width = parseFloat(element.getAttribute('width')!);
        const height = parseFloat(element.getAttribute('height')!);
        const x = parseFloat(element.getAttribute('x')!);
        const y = parseFloat(element.getAttribute('y')!);
        const points = Array<[number, number]>(
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height],
        );
        return points;
    }

    onMove(
        element: SVGRectElement,
        circleIndex: number,
        relDelta: [number, number],
        mirror: [boolean, boolean],
        _event: MouseEvent,
    ) {
        let x$ = parseFloat( element.getAttribute('x')! );
        let y$ = parseFloat( element.getAttribute('y')! );
        let width$ = parseFloat( element.getAttribute('width')! );
        let height$ = parseFloat( element.getAttribute('height')! );
        const [ relDeltaX, relDeltaY ] = relDelta;
        const [ horizontalInvert, verticalInvert ] = mirror;
        switch (circleIndex) {
            case 0:
                x$ = x$ + (relDeltaX * (horizontalInvert ? 0 : 1));
                y$ = y$ + (relDeltaY * (verticalInvert ? 0 : 1));
                width$ = width$ + (relDeltaX * (horizontalInvert ? 1 : -1));
                height$ = height$ + (relDeltaY * (verticalInvert ? 1 : -1));
                break;
            case 1:
                x$ = x$ + (relDeltaX * (horizontalInvert ? 1 : 0));
                y$ = y$ + (relDeltaY * (verticalInvert ? 0 : 1));
                width$ =  width$ + (relDeltaX * (horizontalInvert ? -1 : 1));
                height$ = height$ + (relDeltaY * (verticalInvert ? 1 : -1));
                break;
            case 2:
                x$ = x$ + (relDeltaX * (horizontalInvert ? 1 : 0));
                y$ = y$ + (relDeltaY * (verticalInvert ? 1 : 0));
                width$ = width$ + (relDeltaX * (horizontalInvert ? -1 : 1));
                height$ = height$ + (relDeltaY * (verticalInvert ? -1 : 1));
                break;
            case 3:
                x$ = x$ + (relDeltaX * (horizontalInvert ? 0 : 1));
                y$ = y$ + (relDeltaY * (verticalInvert ? 1 : 0));
                width$ = width$ + (relDeltaX * (horizontalInvert ? 1 : -1));
                height$ = height$ + (relDeltaY * (verticalInvert ? -1 : 1));
                break;
        }
        if (width$ < 0) {
            width$ = -width$;
            x$ -= width$;
            mirror[0] = !horizontalInvert;
        }
        if (height$ < 0) {
            height$ = -height$;
            y$ -= height$;
            mirror[1] = !verticalInvert;
        }
        spawner.svg.update(element, {
            x: `${ x$ }`,
            y: `${ y$ }`,
            width: `${ width$ }`,
            height: `${ height$ }`,
        });
    }

}
