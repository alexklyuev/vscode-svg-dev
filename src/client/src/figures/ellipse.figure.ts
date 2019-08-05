import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Guides } from "../services/guides/guides";
import { PointConcerns } from "./models/point-concerns.model";
import { Coorinator } from "../services/coordinator/coordinator";
import { Appearance } from "../services/appearance/appearance";
import { Mover } from "../services/mover/mover.model";
import { Hints } from "../services/hints/hints";
import { Spawn } from "../../../shared/spawner/spawn";


export class EllipseFigure implements Figure<SVGEllipseElement> {

    readonly name = 'ellipse';

    readonly ctor = SVGEllipseElement;

    constructor(
        public readonly drag: DraggerValue,
        public readonly move: Mover,
        public readonly artboard: Artboard,
        public readonly artboardMove: ArtboardMove,
        public readonly zoom: Zoom,
        public readonly cancelListener: CancelListener,
        public readonly userEventMan: UserEventManager,
        public readonly guides: Guides,
        private coords: Coorinator,
        private appearance: Appearance,
        private hints: Hints,
        private spawn: Spawn,
    ) {
    }

    testByElement(element: any): element is SVGEllipseElement {
        return element instanceof SVGEllipseElement;
    }

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        let points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let pseudoElement: SVGEllipseElement | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            points.push({
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            });
            if (points.length === 1) {
                pseudoElement = this.createEditingSelection(points[0]);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points.map(({ client, scroll, margin, board, zoom }) => {
                    return this.coords.render2d(client, scroll, margin, board, zoom, true);
                });
                const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
                this.renderCoordsAttributes(element, [x1, y1], [x2, y2], shiftKey);                
                element.setAttribute('stroke', this.appearance.stroke);
                element.setAttribute('fill', this.appearance.fill);
                this.artboard.svg.appendChild(element);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.keyEvent.off(cancel);
            this.artboard.box.classList.remove('interactive-points');
            if (pseudoElement) {
                this.guides.guidesContainer!.removeChild(pseudoElement);
            }
            this.userEventMan.mode = 'pick';
        };
        this.cancelListener.keyEvent.on(cancel);
    }

    /**
     * //
     */
    createEditingSelection(point: PointConcerns) {
        const { client, scroll, margin, board, zoom } = point;
        const [x1, y1] = this.coords.render2d(client, scroll, margin, board, zoom, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', '#777');
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke-dasharray', '1');
        this.guides.guidesContainer!.appendChild(element);
        const onMousemove = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const client2: [number, number] = [clientX, clientY];
            const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, false);
            this.renderCoordsAttributes(element, [x1, y1], [x2, y2], shiftKey);
        };
        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);
        return element;
    }

    /**
     * //
     */
    renderCoordsAttributes(
        element: SVGEllipseElement,
        [x1, y1]: [number, number],
        [x2, y2]: [number, number],
        shiftKey: boolean,
    ): void {
        let rx = Math.abs(x2 - x1) / 2;
        let ry = Math.abs(y2 - y1) / 2;
        if (shiftKey) {
            if (rx > ry) {
                rx = ry;
            } else {
                ry = rx;
            }
        }
        const cx = rx + (x2 > x1 ? x1 : x2);
        const cy = ry + (y2 > y1 ? y1 : y2);
        this.spawn.svg.update(element, {
            'cx': `${ cx }`,
            'cy': `${ cy }`,
            'rx': `${ rx }`,
            'ry': `${ ry }`,
        });
        // element.setAttribute('cx', `${ cx }`);
        // element.setAttribute('cy', `${ cy }`);
        // element.setAttribute('rx', `${ rx }`);
        // element.setAttribute('ry', `${ ry }`);
    }

    edit(element: SVGEllipseElement) {
        this.hints.setHint('finishEdit');
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            const cx = parseFloat(element.getAttribute('cx')!);
            const cy = parseFloat(element.getAttribute('cy')!);
            const rx = parseFloat(element.getAttribute('rx')!);
            const ry = parseFloat(element.getAttribute('ry')!);
            const points = Array<[number, number]>(
                [cx + rx, cy],
                [cx, cy + ry],
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
                    let rx$ = rx;
                    let ry$ = ry;
                    switch (pointIndex) {
                        case 0:
                            rx$ = rx + dx;
                            break;
                        case 1:
                            ry$ = ry + dy;
                            break;
                    }
                    if (rx$ < 0 ) {
                        rx$ = -rx$;
                    }
                    if (ry$ < 0) {
                        ry$ = -ry$;
                    }
                    this.spawn.svg.update(element, {
                        rx: `${ rx$ }`,
                        ry: `${ ry$ }`,
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
        this.zoom.valueChange.on(redraw);
        const elementOnMouseMove = (_event: MouseEvent) => {
            redraw();
        };
        element.addEventListener('mousemove', elementOnMouseMove);
        return () => {
            undraw();
            this.zoom.valueChange.off(redraw);
            element.removeEventListener('mousemove', elementOnMouseMove);
        };
    }

}
