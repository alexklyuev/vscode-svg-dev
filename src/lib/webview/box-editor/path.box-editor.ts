import { BaseBoxEditor } from "@/webview/box-editor/base.box-editor";
import { pathPoints } from "@/webview/services/path";
import { artboardMove } from "@/webview/services/artboard-move";
import { zoom } from "@/webview/services/zoom";
import { artboard } from "@/webview/services/artboard";


/**
 * @todo mind scrolling
 * @todo mirroring
 */
export class PathBoxEditor extends BaseBoxEditor {

    ensureAbsolute(element: SVGElement) {
        const d = element.getAttribute('d') ! ;
        const newD = pathPoints.setPointsAbsolute(d);
        element.setAttribute('d', newD);
    }

    /**
     * @override
     */
    edit(element: SVGElement) {
        this.ensureAbsolute(element);
        return super.edit(element);
    }

    /**
     * @override
     */
    onMove(
        element: SVGElement,
        controlIndex: number,
        _event: MouseEvent,
        delta: [number, number],
        _mirror: [boolean, boolean],
    ) {
        this.ensureAbsolute(element);

        const { value: zv } = zoom;

        const clientRect  = element.getBoundingClientRect();
        const { width, height } = clientRect;
        let { left, top, right, bottom } = clientRect;

        left = left - artboardMove.left + artboard.width * (zv - 1)/2;
        right = right - artboardMove.left + artboard.width * (zv - 1)/2;
        top = top - artboardMove.top + artboard.height * (zv - 1)/2;
        bottom = bottom - artboardMove.top + artboard.height * (zv - 1)/2;

        const [ dx, dy ] = delta;

        const kw = (width + dx*zv) / width;
        const kh = (height + dy*zv) / height;

        const d = element.getAttribute('d') ! ;
        const points = pathPoints.parseStr(d);
        const dirs = pathPoints.getAllAbsCoords(points);

        const newD = dirs.map((group, groupIndex) => {
            const newGroup = group.map(point => {
                let [ x, y ] = point;
                switch (controlIndex) {
                    case 0:
                        x = ((x * zv - right) / kw + right) / zv;
                        y = ((y * zv - bottom) / kh + bottom) / zv;
                        break;
                    case 1:
                        y = ((y * zv - bottom) / kh + bottom) / zv;
                        break;
                    case 2:
                        x = ((x * zv - left) * kw + left) / zv;
                        y = ((y * zv - bottom) / kh + bottom) / zv;
                        break;
                    case 3:
                        x = ((x * zv - left) * kw + left) / zv;
                        break;
                    case 4:
                        x = ((x * zv - left) * kw + left) / zv;
                        y = (((y * zv - top) * kh + top)) / zv;
                        break;
                    case 5:
                        y = ((y * zv - top) * kh + top) / zv;
                        break;
                    case 6:
                        x = ((x * zv - right) / kw + right) / zv;
                        y = ((y * zv - top) * kh + top) / zv;
                        break;
                    case 7:
                        x = ((x * zv - right) / kw + right) / zv;
                        break;
                }
                return [x, y].join(' ');
            });
            const newDir = `${ points[groupIndex][0] } ${ newGroup.join(' ') }`;
            return newDir;
        }).join(' ');
        element.setAttribute('d', newD);
    }

}
