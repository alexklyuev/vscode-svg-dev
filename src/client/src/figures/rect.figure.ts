import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { PointConcerns } from "./models/point-concerns.model";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Zoom } from "../services/zoom/zoom";
import { Guides } from "../services/guides/guides";
import { Coorinator } from "../services/coordinator/coordinator";
import { CancelListener } from "../listeners/cancel.listener";
import { Appearance } from "../services/appearance/appearance";
import { Mover } from "../services/mover/mover.model";
import { Hints } from "../services/hints/hints";
import { Spawn } from "../../../lib/dom/spawner/spawn";
import { findIterator, makeIterator } from "../../src/iterators";
import { fromDomEvent } from "@/dom/iterators";


export class RectFigure implements Figure<SVGRectElement> {

    readonly name = 'rect';

    readonly ctor = SVGRectElement;

    constructor(
        public readonly drag: DraggerValue,
        public readonly move: Mover,
        private artboard: Artboard,
        private userEventMan: UserEventManager,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private guides: Guides,
        private coords: Coorinator,
        private cancelListener: CancelListener,
        private appearance: Appearance,
        private hints: Hints,
        private spawn: Spawn,
    ) {}

    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
            if (points.length === 1 && shiftKey) {
                const [ curX, curY ] = this.coords.renderPointConcerns(point, true);
                const [ prevX, prevY ] = this.coords.renderPointConcerns(points[0], true);
                const deltaX = curX - prevX;
                const deltaY = curY - prevY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                if (absDeltaX < absDeltaY) {
                    point.client[0] = points[0].client[0] + deltaY;
                } else {
                    point.client[1] = points[0].client[1] + deltaX;
                }
            }
            points.push(point);
            if (points.length === 1) {
                tempDestroyer = this.renderTemp(points[0]);
            }
            if (points.length >= 2) {
                cancel();
                this.renderFinal(points);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.keyEvent.off(cancel);
            this.artboard.box.classList.remove('interactive-points');
            if (tempDestroyer instanceof Function) {
                tempDestroyer();
            }
            this.userEventMan.mode = 'pick';
        };
        this.cancelListener.keyEvent.on(cancel);
    }

    /**
     * 
     */
    renderTemp(point: PointConcerns): () => void {
        const [ x1, y1 ] = this.coords.renderPointConcerns(point, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.guides.guidesContainer!.appendChild(element);

        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', '#777');
        element.setAttribute('stroke-dasharray', '1');

        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = this.coords.renderPointConcerns({...point, client: [clientX, clientY]}, false);
            if (shiftKey) {
                const deltaX = x2 - x1;
                const deltaY = y2 - y1;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                if (absDeltaX < absDeltaY) {
                    x2 = x1 + deltaY;
                } else {
                    y2 = y1 + deltaX;
                }
            }
            this.renderCoordAttributes(element, [x1, y1], [x2, y2]);
        };

        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);

        return () => {
            this.guides.guidesContainer!.removeChild(element);
        };
    }

    /**
     * 
     */
    @setState
    renderFinal(points: PointConcerns[]): void {
        const { svg } = this.artboard;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svg.appendChild(element);

        element.setAttribute('fill', this.appearance.fill);
        element.setAttribute('stroke', this.appearance.stroke);

        const [ [x1, y1], [x2, y2] ] = points.map(point => this.coords.renderPointConcerns(point, true));
        this.renderCoordAttributes(element, [x1, y1], [x2, y2]);
    }

    /**
     * //
     */
    renderCoordAttributes(
        element: SVGRectElement,
        [x1, y1]: [number, number],
        [x2, y2]: [number, number],
    ) {
        const x = x1 < x2 ? x1 : x2;
        const y = y1 < y2 ? y1 : y2;
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        this.spawn.svg.update(element, {
            'x': `${ x }`,
            'y': `${ y }`,
            'width': `${ width }`,
            'height': `${ height }`,
        });
        // element.setAttribute('x', `${ x }`);
        // element.setAttribute('y', `${ y }`);
        // element.setAttribute('width', `${ width }`);
        // element.setAttribute('height', `${ height }`);
    }

    testByElement(element: any): element is SVGRectElement {
        return element instanceof SVGRectElement;
    }

    edit(element: SVGRectElement) {
        this.hints.setHint('finishEdit');
        // this.userEventMan.mode = 'interactive';
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            const width = parseFloat(element.getAttribute('width')!);
            const height = parseFloat(element.getAttribute('height')!);
            const x = parseFloat(element.getAttribute('x')!);
            const y = parseFloat(element.getAttribute('y')!);
            const points = Array<[number, number]>(
                [x, y],
                [x + width, y],
                [x + width, y + height],
                [x, y + height],
            );
            points.forEach((point, pointIndex) => {
                const [ cx, cy ] = point;
                const { value: zoom } = this.zoom;
                const circle = this.spawn.svg.circle(
                    {
                        cx: `${ cx * zoom }`,
                        cy: `${ cy * zoom }`,
                        fill: this.appearance.editControlPointFill,
                        stroke: this.appearance.editControlPointStroke,
                        'stroke-dasharray': this.appearance.editControlPointStrokeDasharray,
                        r: this.appearance.editControlPointRadius,
                    },
                    {
                        pointerEvents: 'fill',
                    }
                 );
                 this.guides.guidesContainer!.appendChild(circle);
                 let vx = 0;
                 let vy = 0;
                 let ax = cx;
                 let ay = cy;
                 let rx = cx;
                 let ry = cy;
                 const onMouseMove = (event: MouseEvent) => {
                    event.stopPropagation();
                    const { clientX, clientY} = event;
                    const dx = (clientX - vx) / this.zoom.value;
                    const dy = (clientY - vy) / this.zoom.value;
                    rx = ax + dx;
                    ry = ay + dy;
                    const nx = rx * this.zoom.value;
                    const ny = ry * this.zoom.value;
                    this.spawn.svg.update(circle, {
                        cx: `${ nx }`,
                        cy: `${ ny }`,
                    });
                    let x$ = x;
                    let y$ = y;
                    let width$ = width;
                    let height$ = height;
                    switch (pointIndex) {
                        case 0:
                            x$ = cx + dx;
                            y$ = cy + dy;
                            width$ = width - dx;
                            height$ = height - dy;
                            break;
                        case 1:
                            y$ = cy + dy;
                            width$ =  width + dx;
                            height$ = height - dy;
                            break;
                        case 2:
                            width$ = width + dx;
                            height$ = height + dy;
                            break;
                        case 3:
                            x$ = cx + dx;
                            width$ = width - dx;
                            height$ = height + dy;
                            break;
                    }
                    if (width$ < 0) {
                        width$ = -width$;
                        x$ -= width$;
                    }
                    if (height$ < 0) {
                        height$ = -height$;
                        y$ -= height$;
                    }
                    this.spawn.svg.update(element, {
                        x: `${ x$ }`,
                        y: `${ y$ }`,
                        width: `${ width$ }`,
                        height: `${ height$ }`,
                    });
                    redraw();
                 };
                 const onMouseUp = (event: MouseEvent) => {
                    event.stopPropagation();
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    redraw();
                 };
                 const onMouseDown = (event: MouseEvent) => {
                    event.stopPropagation();
                    this.guides.removeSelection();
                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                    const {
                        clientX,
                        clientY,
                    } = event;
                    vx = clientX;
                    vy = clientY;
                    ax = rx;
                    ay = ry;
                 };
                 circle.addEventListener('mousedown', onMouseDown);
                 pseudoEls.push(circle);
            });
        };

        const undraw = () => {
            pseudoEls.forEach(circle => this.guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };

        const redraw = () => {
            undraw();
            draw();
        };

        draw();

        const zoomIter = findIterator<number>(this.zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                redraw();
            }
        })();

        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            for await (const _down of mouseDownIter) {
                mouseMoveIter = fromDomEvent(element, 'mousemove');
                mouseUpIter = fromDomEvent(element, 'mouseup');
                (async () => {
                    for await (const _event of mouseMoveIter) {
                        redraw();
                    }
                })();
                (async () => {
                    for await (const _up of mouseUpIter) {
                        mouseUpIter.return!();
                        mouseMoveIter.return!();
                    }
                })();
            }
        })();

        const cancel = () => {
            undraw();
            zoomIter.return!();
            mouseDownIter.return!();
            mouseMoveIter.return!();
            mouseUpIter.return!();
            this.editFinish(element);
        };

        return cancel;
    }

    @makeIterator<SVGElement>()
    editFinish(element: SVGElement) {
        return element;
    }

}
