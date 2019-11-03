import { BaseBoxEditor } from "./base.box-editor";
import { spawner } from "@/dom/spawner";


export class LineBoxEditor extends BaseBoxEditor {

    /**
     * @override
     */
    onMove(
        element: SVGElement,
        controlIndex: number,
        _event: MouseEvent,
        delta: [number, number],
        mirror: [boolean, boolean],
    ) {
        const x1 = parseFloat( element.getAttribute('x1') ! );
        const y1 = parseFloat( element.getAttribute('y1') ! );
        const x2 = parseFloat( element.getAttribute('x2') ! );
        const y2 = parseFloat( element.getAttribute('y2') ! );
        const attrs = {
            x1, y1, x2, y2,
        };
        const [ dx, dy ] = delta;

        const [ mx, my ] = mirror;




        switch (controlIndex) {
            case 0:
                attrs[x1 < x2 || mx ? 'x1' : 'x2'] += dx;
                attrs[y1 < y2 || my ? 'y1' : 'y2'] += dy;
                break;
            case 1:
                attrs[y1 < y2 || my ? 'y1' : 'y2'] += dy;
                break;
            case 2:
                attrs[x1 < x2 || mx ? 'x2' : 'x1'] += dx;
                attrs[y1 < y2 || my ? 'y1' : 'y2'] += dy;
                break;
            case 3:
                attrs[x1 < x2 || mx ? 'x2' : 'x1'] += dx;
                break;
            case 4:
                attrs[x1 < x2 || mx ? 'x2' : 'x1'] += dx;
                attrs[y1 < y2 || my ? 'y2' : 'y1'] += dy;
                break;
            case 5:
                attrs[y1 < y2 || my ? 'y2' : 'y1'] += dy;
                break;
            case 6:
                attrs[x1 < x2 || mx ? 'x1' : 'x2'] += dx;
                attrs[y1 < y2 || my ? 'y2' : 'y1'] += dy;
                break;
            case 7:
                attrs[x1 < x2 || mx ? 'x1' : 'x2'] += dx;
                break;
        }
        spawner.svg.update(element, {
            x1: `${ attrs.x1 }`,
            y1: `${ attrs.y1 }`,
            x2: `${ attrs.x2 }`,
            y2: `${ attrs.y2 }`,
        });
    }

}
