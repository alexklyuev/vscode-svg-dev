import { BaseBoxEditor } from "@/webview/box-editor/base.box-editor";
import { spawner } from "@/dom/spawner";


export class CircleBoxEditor  extends BaseBoxEditor {

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
        let cx = parseFloat( element.getAttribute('cx') ! );
        let cy = parseFloat( element.getAttribute('cy') ! );
        let r = parseFloat( element.getAttribute('r') ! );
        let [ dx, dy ] = delta;
        let [ sx, sy ] = delta.map(c => c === 0 ? 0 : c / Math.abs(c) );
        const [ mx, my ] = mirror;

        /**
         *    ---0---
         *    |     |
         *    |     |
         *    |     |
         *    ---0---
         */
        if (controlIndex === 1 || controlIndex === 5) {
            dx = 0;
        }

        /**
         *    -------
         *    |     |
         *    0     0
         *    |     |
         *    -------
         */
        if (controlIndex === 3 || controlIndex === 7) {
            dy = 0;
        }

        const hd = Math.sqrt(dx**2 + dy**2);

        switch (controlIndex) {
            case 0:
                cx += hd * (sx || sy) / 2;
                cy += hd * (sx || sy) / 2;
                r += hd * (sx || sy) / 2 * (mx || my ? 1 : -1);
                break;
            case 1:
                cy += hd * sy / 2;
                r += hd * sy / 2 * (my ? 1 : -1);
                break;
            case 2:
                cx -= hd * sy / 2;
                cy += hd * sy / 2;
                r += hd * sy / 2 * (mx || my ? 1 : -1);
                break;
            case 3:
                cx += hd * sx / 2;
                r += hd * sx / 2 * (mx ? -1 : 1);
                break;
            case 4:
                cx += hd * (sx || sy) / 2;
                cy += hd * (sx || sy) / 2;
                r += hd * (sx || sy) / 2 * (mx || my ? -1 : 1);
                break;
            case 5:
                cy += hd * sy / 2;
                r += hd * sy / 2 * (my ? -1 : 1);
                break;
            case 6:
                cx -= hd * sy / 2;
                cy += hd * sy / 2;
                r += hd * sy / 2 * (mx || my ? -1 : 1);
                break;
            case 7:
                cx += hd * sx / 2;
                r += hd * sx / 2 * (mx ? 1 : -1);
                break;
        }
        if (r < 0) {
            r *= -1;
            switch (controlIndex) {
                case 0:
                    mirror[0] = ! mx;
                    mirror[1] = ! my;
                    break;
                case 1:
                    mirror[1] = ! my;
                    break;
                case 2:
                    mirror[0] = ! mx;
                    mirror[1] = ! my;
                    break;
                case 3:
                    mirror[0] = ! mx;
                    break;
                case 4:
                    mirror[0] = ! mx;
                    mirror[1] = ! my;
                    break;
                case 5: 
                    mirror[1] = ! my;
                    break;
                case 6:
                    mirror[0] = ! mx;
                    mirror[1] = ! my;
                    break;
                case 7:
                    mirror[0] = ! mx;
                    break;
            }
        }
        spawner.svg.update(element, {
            cx: `${ cx }`,
            cy: `${ cy }`,
            r: `${ r }`,
        });
    }

}
