import { Dragger } from "./dragger.interface";
import { Zoom } from "../zoom/zoom";
import { PathPoints } from "../path/path-points";


export class DraggerPath implements Dragger {

    private store = new Map<SVGElement, [number, number]>();

    constructor(
        public zoom: Zoom,
        public pathPoints: PathPoints
    ) {}

    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {

        /**
         * ensure path points are relative,
         * absolute points would cause mishaping of path while moving
         */
        const d = element.getAttribute('d')!;
        const dRel = this.pathPoints.setPointsRelative(d);
        element.setAttribute('d', dRel);

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
        const points = this.pathPoints.parseStr(element.getAttribute('d')!);
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


// import { Dragger } from "./dragger.interface";
// import { Zoom } from "../zoom/zoom";
// import { PathPoints } from "../path/path-points";


// interface StorePoint {
//     command: string;
//     coords: number[];
// }


// export class DraggerPath implements Dragger {

//     private store = new Map<SVGElement, StorePoint[]>();

//     constructor(
//         private readonly zoom: Zoom,
//         private readonly pathPoints: PathPoints,
//     ) {}

//     onMousedown(
//         element: SVGElement,
//         clientX: number,
//         clientY: number,
//     ) {
//         const { value: zoomValue } = this.zoom;
//         const d = element.getAttribute('d')!;
//         const points = this.pathPoints.parseStr(d);
//         const value: StorePoint[] = points.map(([command, coords]) => {
//             switch (command) {
//                 case 'M':
//                 case 'L':
//                     const [x, y] = coords.split(/\d/).map(v => parseInt(v));
//                     return {
//                         command,
//                         coords: [
//                             Math.ceil(clientX - (x * zoomValue)),
//                             Math.ceil(clientY - (y * zoomValue)),
//                         ],
//                     };
//                 case 'Z':
//                 default:
//                     return {command, coords: Array<number>()};
//             }
//         });
//         this.store.set(element, value);
//     }

//     onMousemove(
//         element: SVGElement,
//         clientX: number,
//         clientY: number,
//     ) {
//         const { value: zoomValue } = this.zoom;
//         const relPoints = this.store.get(element)!;
//         const newPoints = relPoints.map(({command, coords}) => {
//             switch (command) {
//                 case 'M':
//                 case 'L':
//                     const [sX, sY] = coords;
//                     return {
//                         command,
//                         coords: [
//                             Math.ceil((clientX - sX) / zoomValue),
//                             Math.ceil((clientY - sY) / zoomValue),
//                         ],
//                     };
//                 case 'Z':
//                 default:
//                     return {command, coords};
//             }
//         });
//         const newD = newPoints
//         .map(({command, coords}) => {
//             switch (command) {
//                 case 'M':
//                 case 'L':
//                     const [x, y] = coords;
//                     return `${ command } ${ x } ${ y }`;
//                 case 'Z':
//                 default:
//                     return `${ command } ${ coords.join(' ') }`.trim();
//             }
//         })
//         .join(' ');
//         element.setAttribute('d', newD);
//     }

//     onMouseup(
//         element: SVGElement,
//         _clientX: number,
//         _clientY: number,
//     ) {
//         this.store.delete(element);
//     }

// }

