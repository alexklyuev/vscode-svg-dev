import { BaseBoxEditor } from "@/webview/box-editor/base.box-editor";
import { spawner } from "@/dom/spawner";


export class EllipseBoxEditor  extends BaseBoxEditor {

    onMove(
        element: SVGElement,
        controlIndex: number,
        _event: MouseEvent,
        delta: [number, number],
        mirror: [boolean, boolean],
    ) {
        let cx = parseFloat( element.getAttribute('cx') ! );
        let cy = parseFloat( element.getAttribute('cy') ! );
        let rx = parseFloat( element.getAttribute('rx') ! );
        let ry = parseFloat( element.getAttribute('ry') ! );
        const [ dx, dy ] = delta;
        const [ mx, my ] = mirror;
        switch (controlIndex) {
            case 0:
                cx += dx/2;
                rx += dx/2 * (mx ? 1 : -1);
                cy += dy/2;
                ry += dy/2 * (my ? 1 : -1);
                break;
            case 1:
                cy += dy/2;
                ry += dy/2 * (my ? 1 : -1);
                break;
            case 2:
                cx += dx/2;
                rx += dx/2 * (mx ? -1 : 1);
                cy += dy/2;
                ry += dy/2 * (my ? 1 : -1);
                break;
            case 3:
                cx += dx/2;
                rx += dx/2 * (mx ? -1 : 1);
                break;
            case 4:
                cx += dx/2;
                rx += dx/2 * (mx ? -1 : 1);
                cy += dy/2;
                ry += dy/2 * (my ? -1 : 1);
                break;
            case 5:
                cy += dy/2;
                ry += dy/2 * (my ? -1 : 1);
                break;
            case 6:
                cx += dx/2;
                rx += dx/2 * (mx ? 1 : -1);
                cy += dy/2;
                ry += dy/2 * (my ? -1 : 1);
                break;
            case 7:
                cx += dx/2;
                rx += dx/2 * (mx ? 1 : -1);
                break;
        }
        if (rx < 0) {
            rx = -rx;
            mirror[0] = ! mx;
        }
        if (ry < 0) {
            ry = -ry;
            mirror[1] = ! my;
        }
        spawner.svg.update(element, {
            cx: `${ cx }`,
            cy: `${ cy }`,
            rx: `${ rx }`,
            ry: `${ ry }`,
        });
    }

}
