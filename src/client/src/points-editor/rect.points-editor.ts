import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { spawn } from "@/dom/spawner";

import { zoom } from "../../src/services/zoom";
import { appearance } from "../../src/services/appearance";
import { guides } from "../../src/services/guides";
import { artboard } from "../../src/services/artboard";


/**
 * refactor to Sets
 */
type ControlPointsCollection = SVGCircleElement[];
type ReturnablesCollection = AsyncIterableIterator<MouseEvent>[];


export class RectPointsEditor {

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
            const { value: zoomValue } = zoom;
            const circle = spawn.svg.circle(
                {
                    cx: `${ cx * zoomValue }`,
                    cy: `${ cy * zoomValue }`,
                    fill: appearance.editControlPointFill,
                    stroke: appearance.editControlPointStroke,
                    'stroke-dasharray': appearance.editControlPointStrokeDasharray,
                    r: appearance.editControlPointRadius,
                    id: `controlPoint__${ Math.random().toString().slice(2) }`,
                },
                {
                    pointerEvents: 'fill',
                }
            );
            guides.appendControlPoint(circle);
            return circle;
        });
    }

    destroyCircles(circles: ControlPointsCollection) {
        circles.forEach(circle => guides.guidesContainer!. removeChild(circle));
        circles.length = 0;
    }

    destroyReturnables(returnables: ReturnablesCollection) {
        returnables.forEach(r => r.return! ());
        returnables.length = 0;
    }

    updateCircles(
        element: SVGRectElement,
        circles: ControlPointsCollection,
        returnables: ReturnablesCollection,
    ) {
        this.destroyCircles(circles);
        this.destroyReturnables(returnables);

        const points = this.getPoints(element);
        const newCircles = this.createCircles(points);

        circles.push(...newCircles);

        newCircles.forEach((circle, circleIndex) => {
            let horizontalInvert = false;
            let verticalInvert = false;
            const circleMouseDown = fromDomEvent<MouseEvent>(circle, 'mousedown');
            returnables.push(circleMouseDown);
            (async () => {
                for await (const circleDownEvent of circleMouseDown) {
                    circleDownEvent.stopPropagation();
                    guides.removeSelection();
                    const {
                        clientX,
                        clientY,
                    } = circleDownEvent;
                    const downX = clientX;
                    const downY = clientY;
                    const listeningElement = window;
                    const circleMouseMove = fromDomEvent<MouseEvent>(listeningElement, 'mousemove');
                    const circleMouseUp = fromDomEvent<MouseEvent>(listeningElement, 'mouseup');
                    let usedDeltaX = 0;
                    let usedDeltaY = 0;
                    (async () => {
                        for await (const circleMoveEvent of circleMouseMove) {
                            // circleMoveEvent.stopPropagation();
                            const {
                                clientX,
                                clientY,
                            } = circleMoveEvent;
                            const { value: zoomValue } = zoom;
                            const absDeltaX = (clientX - downX) / zoomValue;
                            const absDeltaY = (clientY - downY) / zoomValue;
                            const relDeltaX = absDeltaX - usedDeltaX;
                            const relDeltaY = absDeltaY - usedDeltaY;
                            usedDeltaX += relDeltaX;
                            usedDeltaY += relDeltaY;
                            let x$ = parseFloat( element.getAttribute('x')! );
                            let y$ = parseFloat( element.getAttribute('y')! );
                            let width$ = parseFloat( element.getAttribute('width')! );
                            let height$ = parseFloat( element.getAttribute('height')! );
                            const cond = (horizontalInvert || verticalInvert) && !(horizontalInvert && verticalInvert);
                            switch (circleIndex) {
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
                            spawn.svg.update(element, {
                                x: `${ x$ }`,
                                y: `${ y$ }`,
                                width: `${ width$ }`,
                                height: `${ height$ }`,
                            });
                            this.updateCircles(element, circles, returnables);
                        }
                    })();
                    (async () => {
                        for await (const circleUpEvent of circleMouseUp) {
                            circleUpEvent.stopPropagation();
                            circleMouseMove.return! ();
                            circleMouseUp.return! ();
                            this.updateCircles(element, circles, returnables);
                        }
                    })();
                }
            })();
        });
    }

    edit(element: SVGRectElement) {
        const returnables: ReturnablesCollection = Array<AsyncIterableIterator<MouseEvent>>();
        const circles: ControlPointsCollection = Array<SVGCircleElement>();
        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            console.log('listener set');
            for await (const _down of mouseDownIter) {
                // const listeningTarget = element.parentElement!;
                const listeningTarget = artboard.svg;
                mouseMoveIter = fromDomEvent(listeningTarget, 'mousemove');
                mouseUpIter = fromDomEvent(listeningTarget, 'mouseup');
                (async () => {
                    for await (const _moveEvent of mouseMoveIter) {
                        this.updateCircles(element, circles, returnables);
                    }
                })();
                (async () => {
                    for await (const _upEvent of mouseUpIter) {
                        mouseUpIter.return! ();
                        mouseMoveIter.return! ();
                        this.updateCircles(element, circles, returnables);
                    }
                })();
            }
        })();

        this.updateCircles(element, circles, returnables);
        const zoomIter = findMethodIterator(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                this.updateCircles(element, circles, returnables);
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
            this.destroyCircles(circles);
            this.destroyReturnables(returnables);
        };
        return cancel;
    }

}
