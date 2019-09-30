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

    getPoints(element: SVGRectElement) {
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
        return points;
    }

    createCircles(points: number[][]) {
        return points.map(point => {
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
            this.guides.guidesContainer!  .appendChild(circle);
            return circle;
        });
    }

    destroyCircles(pseudoEls: Array<SVGElement>) {
        pseudoEls.forEach(circle => this.guides.guidesContainer!. removeChild(circle));
        pseudoEls.length = 0;
    }

    edit(element: SVGRectElement) {
        this.hints.setHint('finishEdit');

        let pseudoEls = Array<SVGElement>();
        const returnables = Array<AsyncIterableIterator<MouseEvent>>();

        const points = this.getPoints(element);

        pseudoEls = this.createCircles(points);

        const updateCircles = () => {
            const { value: zoom } = this.zoom;
            const points = this.getPoints(element);
            points.forEach((point, pointIndex) => {
                const [ cx, cy ] = point;
                const circle = pseudoEls[pointIndex];
                this.spawn.svg.update(circle).attributes({
                    cx: `${ cx * zoom }`,
                    cy: `${ cy * zoom }`,
                });
            });
        };

        let horizontalInvert = false;
        let verticalInvert = false;

        points.forEach((_point, pointIndex) => {
            const circle = pseudoEls[pointIndex];
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
                const downX = clientX;
                const downY = clientY;
                const circleMouseMove = fromDomEvent<MouseEvent>(window, 'mousemove');
                const circleMouseUp = fromDomEvent<MouseEvent>(window, 'mouseup');
                let usedDeltaX = 0;
                let usedDeltaY = 0;
                (async () => {
                    for await (const circleMoveEvent of circleMouseMove) {
                        circleMoveEvent.stopPropagation();
                        const { clientX, clientY } = circleMoveEvent;
                        const absDeltaX = (clientX - downX) / this.zoom.value;
                        const absDeltaY = (clientY - downY) / this.zoom.value;
                        const relDeltaX = absDeltaX - usedDeltaX;
                        const relDeltaY = absDeltaY - usedDeltaY;
                        usedDeltaX += relDeltaX;
                        usedDeltaY += relDeltaY;
                        let x$ = parseFloat(element.getAttribute('x')!);
                        let y$ = parseFloat(element.getAttribute('y')!);
                        let width$ = parseFloat(element.getAttribute('width')!);
                        let height$ = parseFloat(element.getAttribute('height')!);
                        // const cond = (horizontalInvert || verticalInvert) && !(horizontalInvert && verticalInvert);
                        const cond = (horizontalInvert || verticalInvert);
                        switch (pointIndex) {
                            case 0:
                                x$ = x$ + (relDeltaX * (cond ? 0 : 1));
                                y$ = y$ + (relDeltaY * (cond ? 0 : 1));
                                width$ = width$ + (relDeltaX * (cond ? 1 : -1));
                                height$ = height$ + (relDeltaY * (cond ? 1 : -1));
                                break;
                            case 1:
                                x$ = x$ + (relDeltaX * (cond ? 1 : 0));
                                y$ = y$ + (relDeltaY * (cond ? 0 : 1));
                                width$ =  width$ + (relDeltaX * (cond ? -1 : 1));
                                height$ = height$ + (relDeltaY * (cond ? 1 : -1));
                                break;
                            case 2:
                                x$ = x$ + (relDeltaX * (cond ? 1 : 0));
                                y$ = y$ + (relDeltaY * (cond ? 1 : 0));
                                width$ = width$ + (relDeltaX * (cond ? -1 : 1));
                                height$ = height$ + (relDeltaY * (cond ? -1 : 1));
                                break;
                            case 3:
                                x$ = x$ + (relDeltaX * (cond ? 0 : 1));
                                y$ = y$ + (relDeltaY * (cond ? 1 : 0));
                                width$ = width$ + (relDeltaX * (cond ? 1 : -1));
                                height$ = height$ + (relDeltaY * (cond ? -1 : 1));
                                break;
                        }
                        if (width$ < 0) {
                            width$ = -width$;
                            x$ -= width$;
                            horizontalInvert = !horizontalInvert;
                        }
                        if (height$ < 0) {
                            height$ = -height$;
                            y$ -= height$;
                            verticalInvert = !verticalInvert;
                        }
                        this.spawn.svg.update(element, {
                            x: `${ x$ }`,
                            y: `${ y$ }`,
                            width: `${ width$ }`,
                            height: `${ height$ }`,
                        });
                        updateCircles();
                    }
                })();
                (async () => {
                    for await (const circleUpEvent of circleMouseUp) {
                        circleUpEvent.stopPropagation();
                        circleMouseMove.return!();
                        circleMouseUp.return!();
                        updateCircles();
                    }
                })();
                }
            })();
        });

        const undraw = () => {
            this.destroyCircles(pseudoEls);
            returnables.forEach(returnable => returnable.return!());
            returnables.length = 0;
        };

        const zoomIter = findIterator<number>(this.zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                updateCircles();
            }
        })();

        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            for await (const _down of mouseDownIter) {
                this.destroyCircles(pseudoEls);
                mouseMoveIter = fromDomEvent(window, 'mousemove');
                mouseUpIter = fromDomEvent(window, 'mouseup');
                (async () => {
                    for await (const _move of mouseMoveIter) {
                        console.log('mousemove window:el');
                        updateCircles();
                    }
                })();
                (async () => {
                    for await (const _up of mouseUpIter) {
                        mouseUpIter.return!();
                        mouseMoveIter.return!();
                        // pseudoEls = this.createCircles(this.getPoints(element));
                        // updateCircles();
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
