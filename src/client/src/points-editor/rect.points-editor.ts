import { findIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { spawn } from "@/dom/spawner";

import { zoom } from "../../src/services/zoom";
import { appearance } from "../../src/services/appearance";
import { guides } from "../../src/services/guides";


export class RectPointsEditor {

    cancelation = () => {};

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
                },
                {
                    pointerEvents: 'fill',
                }
            );
            guides.appendControlPoint(circle);
            return circle;
        });
    }

    destroyCircles(circles: Array<SVGElement>) {
        circles.forEach(circle => guides.guidesContainer!. removeChild(circle));
        circles.length = 0;
    }

    destroyReturnables(returnables: AsyncIterableIterator<MouseEvent>[]) {
        returnables.forEach(r => r.return! ());
        returnables.length = 0;
    }

    updateCircles(
        element: SVGRectElement,
        circles: SVGCircleElement[],
        returnables: AsyncIterableIterator<MouseEvent>[],
    ) {
        // const { value: zoomValue } = zoom;
        // const points = this.getPoints(element);
        // points.forEach((point, pointIndex) => {
        //     const [ cx, cy ] = point;
        //     const circle = circles[pointIndex];
        //     spawn.svg.update(circle).attributes({
        //         cx: `${ cx * zoomValue }`,
        //         cy: `${ cy * zoomValue }`,
        //     });
        // });
        this.destroyCircles(circles);
        this.destroyReturnables(returnables);

        const points = this.getPoints(element);
        const newCircles = this.createCircles(points);

        let horizontalInvert = false;
        let verticalInvert = false;

        const newReturnables = newCircles.map((circle, pointIndex) => {
            const circleMouseDown = fromDomEvent<MouseEvent>(circle, 'mousedown');
            // returnables.push(circleMouseDown);
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
                const circleMouseMove = fromDomEvent<MouseEvent>(window, 'mousemove');
                const circleMouseUp = fromDomEvent<MouseEvent>(window, 'mouseup');
                let usedDeltaX = 0;
                let usedDeltaY = 0;
                (async () => {
                    for await (const circleMoveEvent of circleMouseMove) {
                        circleMoveEvent.stopPropagation();
                        const { clientX, clientY } = circleMoveEvent;
                        const { value: zoomValue } = zoom;
                        const absDeltaX = (clientX - downX) / zoomValue;
                        const absDeltaY = (clientY - downY) / zoomValue;
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
                        // circleMouseDown.return! ();
                        this.updateCircles(element, circles, returnables);
                    }
                })();
                }
            })();
            return circleMouseDown;
        });
        circles.push(...newCircles);
        returnables.push(...newReturnables);
    }

    edit(element: SVGRectElement) {
        const returnables = Array<AsyncIterableIterator<MouseEvent>>();
        const circles = Array<SVGCircleElement>();
        this.updateCircles(element, circles, returnables);
        const zoomIter = findIterator<number>(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                this.updateCircles(element, circles, returnables);
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
                    for await (const _move of mouseMoveIter) {
                        this.updateCircles(element, circles, returnables);
                    }
                })();
                (async () => {
                    for await (const _up of mouseUpIter) {
                        mouseUpIter.return! ();
                        mouseMoveIter.return! ();
                        this.updateCircles(element, circles, returnables);
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
            this.destroyCircles(circles);
            this.destroyReturnables(returnables);
            console.log('CANCELED');
        };

        return cancel;
    }

}
