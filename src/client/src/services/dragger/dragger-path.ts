import { Dragger } from "./dragger.interface";
import { Zoom } from "../zoom/zoom";
import { PathPoints } from "../path/path-directives";


export class DraggerPath implements Dragger {

    private store = new Map<SVGElement, [number, number]>();

    constructor(
        public zoom: Zoom,
    ) {}

    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        this.store.set(
            element,
            [clientX, clientY],
        );
    }

    onMousemove(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        const [pcX, pcY] = this.store.get(element)!;
        const dX = clientX - pcX;
        const dY = clientY - pcY;
        const points = new PathPoints(element.getAttribute('d')!).parseStr();
        const newPoints = points.map(([command, coords]) => {
            switch (command) {
                case 'M':
                case 'L':
                    const [x, y] = coords.split(/\s/);
                    const { value: zoomValue } = this.zoom;
                    return `${ command } ${ parseInt(x) + dX / zoomValue } ${ parseInt(y) + dY / zoomValue }`;
                case 'Z':
                    return command;
                default:
                    return `${ command } ${ coords }`;
            }
        }).join(' ');
        element.setAttribute('d', newPoints);
        this.store.set(
            element,
            [clientX, clientY],
        );
    }

    onMouseup(
        element: SVGElement,
        _clientX: number,
        _clientY: number,
    ) {
        this.store.delete(element);
    }

}
