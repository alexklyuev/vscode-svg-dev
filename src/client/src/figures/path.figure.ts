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
import { PointConcerns, PointSharedConcerns } from "./models/point-concerns.model";
import { Coorinator } from "../services/coordinator/coordinator";


export class PathFigure implements Figure<SVGPathElement> {

    stroke = 'white';
    fill = 'none';

    strokeTemp = '#666';
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
        private coords: Coorinator,
    ) {}

    /**
     * //
     */
    testByElement(element: any): element is SVGPathElement {
        return element instanceof SVGPathElement;
    }

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let destroyTempRenderFn: Function | null = null;
        this.userEventMan.mode = 'interactive';
        const { svg } = this.artboard;
        const aX = parseInt( svg.getAttribute('width')! );
        const aY = parseInt( svg.getAttribute('height')! );
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const { left: artboardMarginLeft, top: artboardMarginTop } = this.artboardMove;
        const { value: zoom } = this.zoom;
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
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

    renderTemp(pointsConcerns: PointConcerns[], pointSharedConcerns: PointSharedConcerns): Function {
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
        const points = [...pointsConcerns];
        const dAttr = this.renderPointsC(points, false);
        element.setAttribute('d', dAttr);
        const circles = points.map(point => {
            const [cx, cy] = this.coords.renderPointConcerns(point, false);
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            el.setAttribute('cx', `${cx}`);
            el.setAttribute('cy', `${cy}`);
            el.setAttribute('fill', 'none');
            el.setAttribute('stroke', `${this.strokeTemp}`);
            el.setAttribute('stroke-dasharray', '1');
            el.setAttribute('r', '3');
            this.guides.guidesContainer!.appendChild(el);
            return el;
        });
        const edge = points[points.length - 1];
        const { scroll, margin, board, zoom } = pointSharedConcerns;
        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const clientPoint: [number, number] = [clientX, clientY];
            const [x, y] = this.coords.render2d(clientPoint, scroll, margin, board, zoom, false);
            if (edge.client2) {
                const newPoint = `L ${ x } ${ y }`;
                element.setAttribute('d', `${ dAttr } ${ newPoint }`);
            } else {
                const commandIndex = dAttr.lastIndexOf('C');
                const d = dAttr.slice(0, commandIndex);
                const remainCoords = dAttr.slice(commandIndex + 1).trim();
                const [ , , [px, py]] = remainCoords.split(',').map(pair => pair.trim().split(' ').map(s => s.trim()));
                const prev = points[points.length - 2];
                const [x1, y1] = this.coords.render2d(prev.client, scroll, margin, board, zoom, false);
                const tempC = `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ px } ${ py }`;
                element.setAttribute('d', `${ d } ${ tempC }`);
            }
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            this.guides.guidesContainer!.removeChild(element);
            circles.forEach(circle => this.guides!.guidesContainer!.removeChild(circle));
        };
    }

    /**
     * //
     */
    renderFinal(pointsConcerns: PointConcerns[], closed: boolean) {
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
        const dAbs = this.renderPointsC(pointsConcerns, true);
        const dRel = this.pathPoints.setPointsRelative(dAbs + (closed ? ' Z' : ''));
        element.setAttribute('d', dRel);
    }

    renderPointsS(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = this.coords.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0 || !client2 || client2.every((i, k) => i === client[k])) {
                return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
            } else {
                const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, useZoom);
                return `S ${ x2 } ${ y2 }, ${ x } ${ y }`;
            }
        }).join(' ');
    }

    renderPointsC(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = this.coords.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0) {
                return `M ${ x } ${ y }`;
            } else {
                const prev = pointsConcerns[index - 1];
                const [x1, y1] = this.coords.render2d(prev.client, prev.scroll, prev.margin, prev.board, prev.zoom, useZoom);
                if (!client2) {
                    return `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ x } ${ y }`;
                } else {
                    const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, useZoom);
                    return `C ${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x } ${ y }`;
                }
            }
        }).join(' ');
    }

    /**
     * //
     */
    edit(element: SVGPathElement) {
        const d = element.getAttribute('d');
        if (d) {
            const points = this.pathPoints.parseStr(d);
            const coords = this.pathPoints.getAbsDims(points);
            const circles = coords.map((point) => {
                const [ cx, cy ] = point;
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                this.guides.guidesContainer!.appendChild(circle);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-dasharray', '1');
                circle.setAttribute('cx', `${cx}`);
                circle.setAttribute('cy', `${cy}`);
                circle.setAttribute('r', '3');
                return circle;
            });
            const cancel = (_key: CancelKeys) => {
                circles.forEach(circle => this.guides.guidesContainer!.removeChild(circle));
                this.cancelListener.keyEvent.off(cancel);
            };
            this.cancelListener.keyEvent.on(cancel);
        }
    }

}
