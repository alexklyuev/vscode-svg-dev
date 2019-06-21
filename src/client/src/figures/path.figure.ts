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


type UserPoint = [
    [number, number, number],
    [number, number, number]
];


export class PathFigure implements Figure<SVGPathElement> {

    stroke = 'white';
    fill = 'none';

    strokeTemp = 'blue';
    fillTemp = 'none';

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    constructor(
        public drag: Dragger,
        private artboard: Artboard,
        public readonly artboardMove: ArtboardMove,
        public readonly zoom: Zoom,
        public readonly cancelListener: CancelListener,
        public readonly userEventMan: UserEventManager,
        public readonly guides: Guides,
        public readonly pathPoints: PathPoints,
    ) {}

    /**
     * //
     */
    @setState
    create(_elementName: string, attributes: {[K: string]: string}): void {
        let points = Array<UserPoint>();
        this.artboard.box.classList.add('interactive-points');
        let destroyTempRenderFn: Function | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const { left: artboardMarginLeft, top: artboardMarginTop } = this.artboardMove;
            const point: UserPoint = [
                [clientX, scrollLeft, artboardMarginLeft],
                [clientY, scrollTop, artboardMarginTop],
            ];
            points.push(point);
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
            }
            destroyTempRenderFn = this.renderTemp(points);
        };
        window.addEventListener('click', pointsListener);
        const stop = (key: CancelKeys) => {
            window.removeEventListener('click', pointsListener);
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
    render(
        points: Array<UserPoint>,
        parent: Element,
        attributes: {[K: string]: string},
        zoomed: boolean,
    ): SVGPathElement {
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
        const { value: zoom } = this.zoom;
        const { svg } = this.artboard;
        const aX = parseInt(svg.getAttribute('width')!);
        const aY = parseInt(svg.getAttribute('height')!);
        element.setAttribute('d', points.map(([[cX, sX, mX], [cY, sY, mY]], index) => {
            const x = (cX + sX - mX + aX*(zoom - 1)/2) / (zoomed ? zoom : 1);
            const y = (cY + sY - mY + aY*(zoom - 1)/2) / (zoomed ? zoom : 1);
            return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
        }).join(' '));
        return element;
    }

    /**
     * //
     */
    renderTemp(points: Array<UserPoint>): Function {
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
        const { value: zoom } = this.zoom;
        const { svg } = this.artboard;
        const aX = parseInt(svg.getAttribute('width')!);
        const aY = parseInt(svg.getAttribute('height')!);
        const d = points.map(([[cX, sX, mX], [cY, sY, mY]], index) => {
            const x = cX + sX - mX + aX * (zoom - 1) / 2;
            const y = cY + sY - mY + aY * (zoom - 1) / 2;
            return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
        }).join(' ');
        element.setAttribute('d', d);
        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const { scrollLeft: sX, scrollTop: sY } = document.scrollingElement!;
            const { left: mX, top: mY } = this.artboardMove;
            const x = clientX + sX - mX + aX * (zoom - 1) / 2;
            const y = clientY + sY - mY + aY * (zoom - 1) / 2;
            const newPoint = `L ${ x } ${ y }`;
            element.setAttribute('d', `${ d } ${ newPoint }`);
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
    renderFinal(points: Array<UserPoint>, closed: boolean) {
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
        const { value: zoom } = this.zoom;
        const { svg } = this.artboard;
        const aX = parseInt(svg.getAttribute('width')!);
        const aY = parseInt(svg.getAttribute('height')!);
        const dAbs = points.map(([[cX, sX, mX], [cY, sY, mY]], index) => {
            const x = (cX + sX - mX + aX*(zoom - 1)/2)/zoom;
            const y = (cY + sY - mY + aY*(zoom - 1)/2)/zoom;
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
