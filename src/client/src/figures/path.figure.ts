import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Dragger } from "../services/dragger/dragger.interface";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { Guides } from "../services/guides/guides";
import { CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { PathPoints } from "../services/path/path-points";


interface PointConcerns {
    client: [number, number];
    scroll: [number, number];
    margin: [number, number];
    board: [number, number];
    zoom: number;

    client2?: [number, number];
}

type PointSharedConcerns = Pick<PointConcerns, 'scroll' | 'margin' | 'board' | 'zoom'>;


export class PathFigure implements Figure<SVGPathElement> {

    stroke = 'white';
    fill = 'none';

    strokeTemp = 'blue';
    fillTemp = 'none';

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    constructor(
        public readonly drag: Dragger,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
        private guides: Guides,
        private pathPoints: PathPoints,
    ) {}

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let destroyTempRenderFn: Function | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const { left: artboardMarginLeft, top: artboardMarginTop } = this.artboardMove;
            const { svg } = this.artboard;
            const aX = parseInt( svg.getAttribute('width')! );
            const aY = parseInt( svg.getAttribute('height')! );
            const { value: zoom } = this.zoom;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMarginLeft, artboardMarginTop],
                board: [aX, aY],
                zoom,
            };
            points.push(point);
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
            }
            destroyTempRenderFn = this.renderTemp(
                points,
                {
                    scroll: [scrollLeft, scrollTop],
                    margin: [artboardMarginLeft, artboardMarginTop],
                    board: [aX, aY],
                    zoom,
                },
            );
        };
        const subpointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            points[points.length - 1].client2 = [clientX, clientY];
        };
        const pointsListenerEvent = 'mousedown';
        const subpointsListenerEvent = 'mouseup';
        window.addEventListener(pointsListenerEvent, pointsListener);
        window.addEventListener(subpointsListenerEvent, subpointsListener);
        const stop = (key: CancelKeys) => {
            window.removeEventListener(pointsListenerEvent, pointsListener);
            window.removeEventListener(subpointsListenerEvent, subpointsListener);
            this.cancelListener.keyEvent.off(stop);
            this.artboard.box.classList.remove('interactive-points');
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
                destroyTempRenderFn = null;
            }
            this.userEventMan.mode = 'pick';
            this.renderFinal(points, key === 'enter');
        };
        this.cancelListener.keyEvent.on(stop);
    }

    /**
     * //
     */
    renderTemp(
        pointsConcerns: PointConcerns[],
        pointSharedConcerns: PointSharedConcerns,
    ): Function {
        const parent = this.guides.guidesContainer!;
        const attributes: {[K: string]: string} = {
            stroke: this.strokeTemp,
            fill: this.fillTemp,
            'stroke-dasharray': '1',
        };
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });

        const dAttr = pointsConcerns.map(({ client, scroll, margin, board, zoom }, index) => {
            const [x, y] = [0, 1].map(dim => {
                return client[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2;
            });
            return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
        }).join(' ');

        element.setAttribute('d', dAttr);

        const { scroll, margin, board, zoom } = pointSharedConcerns;

        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const clientPoint = [clientX, clientY];
            const [x, y] = [0, 1].map(dim => {
                return clientPoint[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2;
            });
            const newPoint = `L ${ x } ${ y }`;
            element.setAttribute('d', `${ dAttr } ${ newPoint }`);
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            this.guides.guidesContainer!.removeChild(element);
        };
    }

    /**
     * //
     */
    renderFinal(
        pointsConcerns: PointConcerns[],
        closed: boolean,
    ) {
        const parent = this.artboard.svg;
        const attributes: {[K: string]: string} = {
            stroke: this.stroke,
            fill: this.fill,
        };
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
        // pointsConcerns.forEach(({client, client2}) => {
        //     console.log(`[${ client.join(', ') }] [${ client2 ? client2.join(', '): '--' }]`);
        // });
        const dAbs = pointsConcerns.map(({ client, scroll, margin, board, zoom }, index) => {
            const [x, y] = [0, 1].map(dim => {
                return (client[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2) / zoom;
            });
            return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
        }).join(' ') + (closed ? ' Z' : '');
        const dRel = this.pathPoints.setPointsRelative(dAbs);
        element.setAttribute('d', dRel);
    }

    /**
     * //
     */
    testByElement(element: any): element is SVGPathElement {
        return element instanceof SVGPathElement;
    }

}
