import { BaseBoxEditor } from "./base.box-editor";
import { artboardMove } from "../services/artboard-move";
// import { zoom } from "../services/zoom";


export class PolyBoxEditor extends BaseBoxEditor {

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
        const { top, left, width, height } = element.getBoundingClientRect();
        const { top: mtop, left: mleft } = artboardMove;
        const rtop = top - mtop;
        const rleft = left - mleft;
        // const { value: zoomValue } = zoom;
        const pointsAttr = element.getAttribute('points')!;
        const absPoints = pointsAttr
        .split(/[,\s]+/)
        .map(c => parseFloat(c))
        // .map(c => c * zoomValue)
        .reduce((acc, coord, index) => {
            if (index % 2 === 0) {
                acc.push([coord, NaN]);
            } else {
                acc[acc.length - 1][1] = coord;
            }
            return acc;
        }, Array<[number, number]>());
        const relPoints = absPoints.map(([x, y]) => [x - rleft, y - rtop]);
        const [ dx, dy ] = delta;
        const kw = (width + dx) / width;
        const kh = (height + dy) / height;
        const newRelPoints = relPoints.map(([x, y]) => [x * kw, y * kh]);
        const newAbsPoints = newRelPoints.map(([x, y]) => [x + rleft, y + rtop]);
        const newPoints = newAbsPoints.map(pair => pair.join(',')).join(' ');
        element.setAttribute('points', newPoints);
    }

}
