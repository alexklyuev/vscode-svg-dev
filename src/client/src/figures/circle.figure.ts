import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { PointConcerns } from "./models/point-concerns.model";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Zoom } from "../services/zoom/zoom";
import { Coorinator } from "../services/coordinator/coordinator";
import { CancelListener } from "../listeners/cancel.listener";
import { Guides } from "../services/guides/guides";
import { Appearance } from "../services/appearance/appearance";
import { Mover } from "../services/mover/mover.model";
import { Hints } from "../services/hints/hints";
import { Spawn } from "../../../lib/dom/spawner/spawn";
import { findIterator } from "../../../lib/common/iterators";


export class CircleFigure implements Figure<SVGCircleElement> {

    readonly name = 'circle';

    readonly ctor = SVGCircleElement;

    constructor(
        public readonly drag: DraggerValue,
        public readonly move: Mover,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        private userEventMan: UserEventManager,
        private zoom: Zoom,
        private coords: Coorinator,
        private cancelListener: CancelListener,
        private guides: Guides,
        private appearance: Appearance,
        private hints: Hints,
        private spawn: Spawn,
    ) {}

    testByElement(element: any): element is SVGCircleElement {
        return element instanceof SVGCircleElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
            } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
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
        const cancelEvents = findIterator(this.cancelListener.eventReceived);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            // this.cancelListener.keyEvent.off(cancel);
            cancelEvents.return! ();
            this.artboard.box.classList.remove('interactive-points');
            if (tempDestroyer instanceof Function) {
                tempDestroyer();
            }
            this.userEventMan.mode = 'pick';
        };
        // this.cancelListener.keyEvent.on(cancel);
        (async () => {
            for await (const _key of cancelEvents) {
                cancel();
            }
        })();
    }

    /**
     * 
     */
    renderTemp(point: PointConcerns): () => void {
        const [ x1, y1 ] = this.coords.renderPointConcerns(point, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.guides.guidesContainer!.appendChild(element);

        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', '#777');
        element.setAttribute('stroke-dasharray', '1');

        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
            } = event;
            let [ x2, y2 ] = this.coords.renderPointConcerns({...point, client: [clientX, clientY]}, false);
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
    renderFinal(points: PointConcerns[]): void {
        const { svg } = this.artboard;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
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
        element: SVGCircleElement,
        [x1, y1]: [number, number],
        [x2, y2]: [number, number],
    ) {
        const rx = Math.abs(x2 - x1) / 2;
        const ry = Math.abs(y2 - y1) / 2;
        const r = rx > ry ? rx : ry;
        const cx = (x1 < x2 ? x1 : x2) + r;
        const cy = (y1 < y2 ? y1 : y2) + r;

        element.setAttribute('cx', `${ cx }`);
        element.setAttribute('cy', `${ cy }`);
        element.setAttribute('r', `${ r }`);
    }

    edit(element: SVGEllipseElement) {
        this.hints.setHint('finishEdit');
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            const cx = parseFloat(element.getAttribute('cx')!);
            const cy = parseFloat(element.getAttribute('cy')!);
            const r = parseFloat(element.getAttribute('r')!);
            const points = Array<[number, number]>(
                [cx + r, cy],
            );
            points.forEach((point, pointIndex) => {
                const [ cx$, cy$ ] = point;
                const { value: zoom } = this.zoom;
                const circle = this.spawn.svg.circle(
                    {
                        cx: `${ cx$ * zoom }`,
                        cy: `${ cy$ * zoom }`,
                        fill: this.appearance.editControlPointFill,
                        stroke: this.appearance.editControlPointStroke,
                        'stroke-dasharray': this.appearance.editControlPointStrokeDasharray,
                        r: this.appearance.editControlPointRadius,
                    },
                    {
                        pointerEvents: 'fill',
                    },
                );
                this.guides.guidesContainer! .appendChild(circle);
                pseudoEls.push(circle);
                let vx = 0;
                let vy = 0;
                let ax = cx;
                let ay = cy;
                let lx = cx;
                let ly = cy;
                const onMouseMove = (event: MouseEvent) => {
                    event.stopPropagation();
                    const { clientX, clientY} = event;
                    const dx = (clientX - vx) / this.zoom.value;
                    const dy = (clientY - vy) / this.zoom.value;
                    lx = ax + dx;
                    ly = ay + dy;
                    const nx = lx * this.zoom.value;
                    const ny = ly * this.zoom.value;
                    this.spawn.svg.update(circle, {
                        cx: `${ pointIndex === 0 ? nx : lx }`,
                        cy: `${ pointIndex === 1 ? ny : ly }`,
                    });
                    let r$ = r;
                    switch (pointIndex) {
                        case 0:
                            r$ = r + dx;
                            break;
                    }
                    if (r$ < 0 ) {
                        r$ = -r$;
                    }
                    this.spawn.svg.update(element, {
                        r: `${ r$ }`,
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
                    ax = lx;
                    ay = ly;
                 };
                 circle.addEventListener('mousedown', onMouseDown);
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
        // this.zoom.valueChange.on(redraw);
        const elementOnMouseMove = (_event: MouseEvent) => {
            redraw();
        };
        element.addEventListener('mousemove', elementOnMouseMove);
        return () => {
            undraw();
            // this.zoom.valueChange.off(redraw);
            element.removeEventListener('mousemove', elementOnMouseMove);
        };
    }


}