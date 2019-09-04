import { findIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { Spawn } from "@/dom/spawner/spawn";
import { Hints } from "../services/hints/hints";
import { Zoom } from "../services/zoom/zoom";
import { Appearance } from "../services/appearance/appearance";
import { Guides } from "../services/guides/guides";


export class RectPointsEditor {

    constructor(
        private hints: Hints,
        private zoom: Zoom,
        private appearance: Appearance,
        private spawn: Spawn,
        private guides: Guides,
    ) {}

    edit(element: SVGRectElement) {
        this.hints.setHint('finishEdit');
        // this.userEventMan.mode = 'interactive';
        const pseudoEls = Array<SVGElement>();
        const returnables = Array<AsyncIterableIterator<MouseEvent>>();
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
                 this.guides.guidesContainer! .appendChild(circle);
                 pseudoEls.push(circle);
                 let vx = 0;
                 let vy = 0;
                 let ax = cx;
                 let ay = cy;
                 let rx = cx;
                 let ry = cy;
                 const circleMouseDown = fromDomEvent<MouseEvent>(circle, 'mousedown');
                 returnables.push(circleMouseDown);
                 (async () => {
                     for await (const circleDownEvent of circleMouseDown) {
                        circleDownEvent.stopPropagation();
                        this.guides.removeSelection();
                        const {
                            clientX,
                            clientY,
                        } = circleDownEvent;
                        vx = clientX;
                        vy = clientY;
                        ax = rx;
                        ay = ry;
                        const circleMouseMove = fromDomEvent<MouseEvent>(circle, 'mousemove');
                        const circleMouseUp = fromDomEvent<MouseEvent>(circle, 'mouseup');
                        (async () => {
                            for await (const circleMoveEvent of circleMouseMove) {
                                console.log('MOVE');
                                circleMoveEvent.stopPropagation();
                                const { clientX, clientY} = circleMoveEvent;
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
                            }
                        })();
                        (async () => {
                            for await (const circleUpEvent of circleMouseUp) {
                                circleUpEvent.stopPropagation();
                                circleMouseMove.return!();
                                circleMouseUp.return!();
                                redraw();
                            }
                        })();
                     }
                 })();
            });
        };

        const undraw = () => {
            pseudoEls.forEach(circle => this.guides.guidesContainer!. removeChild(circle));
            pseudoEls.length = 0;
            // returnables.forEach(returnable => returnable.return!());
            // returnables.length = 0;
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
            [
                zoomIter,
                mouseDownIter,
                mouseMoveIter,
                mouseUpIter,
            ]
            .filter(iter => iter)
            .forEach(iter => {
                iter.return!();
            });
            undraw();
        };

        return cancel;
    }

}
