import { Dragger } from "./dragger.interface";
import { Zoom } from "../zoom/zoom";
import { PathPoints } from "../path/path-points";


export class DraggerPath implements Dragger {

    private store = new Map<SVGElement, [number, number, number, number]>();

    constructor(
        public zoom: Zoom,
        public pathPoints: PathPoints
    ) {}

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        const { clientX, clientY } = event;
        /**
         * ensure path points are relative,
         * absolute points would cause mishaping of path while moving
         */
        const d = element.getAttribute('d')!;
        const dRel = this.pathPoints.setPointsRelative(d);
        element.setAttribute('d', dRel);

        this.store.set(
            element,
            [clientX, clientY, clientX, clientY],
        );
    }

    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ) {
        let { clientX, clientY, shiftKey } = event;
        const [pcX, pcY, absSX, absSY] = this.store.get(element)!;
        if (shiftKey) {
            const absDX = Math.abs(clientX - absSX);
            const absDY = Math.abs(clientY - absSY);
            if (absDX > absDY) {
                clientY = absSY;
            } else {
                clientX = absSX;
            }
        }
        const dX = clientX - pcX;
        const dY = clientY - pcY;
        const points = this.pathPoints.parseStr(element.getAttribute('d')!);
        const newPoints = points.map(([command, coords]) => {
            switch (command) {
                case 'M':
                    const [x, y] = coords.split(/\s/).map(c => parseFloat(c));
                    const { value: zoomValue } = this.zoom;
                    const nX = x + dX / zoomValue;
                    const nY = y + dY / zoomValue;
                    return `${ command } ${ nX } ${ nY}`;
                case 'Z':
                    return command;
                default:
                    return `${ command } ${ coords }`;
            }
        }).join(' ');
        element.setAttribute('d', newPoints);
        this.store.set(
            element,
            [clientX, clientY, absSX, absSY],
        );
    }

    onMouseup(
        element: SVGElement,
        _event: MouseEvent,
    ) {
        this.store.delete(element);
    }

}
