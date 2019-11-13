import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { spawner } from "@/dom/spawner";
import { appearance } from "@/webview/services/appearance";
import { artboard } from "@/web/init";
import { zoom } from "@/web/init";
import { guides } from "@/webview/services/guides";
import { EditOperator } from "../models/operators/edit-operator.model";


/**
 * refactor to Sets
 */
type ControlPointsCollection = SVGElement[];
type ReturnablesCollection = AsyncIterableIterator<MouseEvent>[];


export abstract class BasePointsEditor<E extends SVGElement> implements EditOperator {

    abstract getPoints(_element: E): [number, number][];

    abstract onMove(
        element: E,
        circleIndex: number,
        relDelta: [number, number],
        mirror: [boolean, boolean],
        event: MouseEvent,
    ): void;

    createControls(points: number[][]): SVGElement[] {
        return points.map(point => {
            const [ cx, cy ] = point;
            const { value: zoomValue } = zoom;
            const circle = spawner.svg.circle(
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

    destroyControls(circles: ControlPointsCollection) {
        circles.forEach(circle => guides.guidesContainer!. removeChild(circle));
        circles.length = 0;
    }

    destroyReturnables(returnables: ReturnablesCollection) {
        returnables.forEach(r => r.return! ());
        returnables.length = 0;
    }

    update(
        element: E,
        controls: ControlPointsCollection,
        returnables: ReturnablesCollection,
    ) {
        this.destroyControls(controls);
        this.destroyReturnables(returnables);

        const points = this.getPoints(element);
        const newCircles = this.createControls(points);

        controls.push(...newCircles);

        newCircles.forEach((circle, circleIndex) => {
            const mirror: [boolean, boolean] = [false, false];
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
                    let usedDeltaX = 0;
                    let usedDeltaY = 0;
                    const listeningElement = window;
                    const circleMouseMove = fromDomEvent<MouseEvent>(listeningElement, 'mousemove');
                    const circleMouseUp = fromDomEvent<MouseEvent>(listeningElement, 'mouseup');
                    (async () => {
                        for await (const circleMoveEvent of circleMouseMove) {
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
                            this.onMove(element, circleIndex, [relDeltaX, relDeltaY], mirror, circleMoveEvent);
                            this.update(element, controls, returnables);
                        }
                    })();
                    (async () => {
                        for await (const circleUpEvent of circleMouseUp) {
                            circleUpEvent.stopPropagation();
                            circleMouseMove.return! ();
                            circleMouseUp.return! ();
                            this.update(element, controls, returnables);
                        }
                    })();
                }
            })();
        });
    }



    edit(element: E) {
        const returnables: ReturnablesCollection = Array<AsyncIterableIterator<MouseEvent>>();
        const controls: ControlPointsCollection = Array<SVGCircleElement>();
        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            for await (const _down of mouseDownIter) {
                const listeningTarget = artboard.svg;
                mouseMoveIter = fromDomEvent(listeningTarget, 'mousemove');
                mouseUpIter = fromDomEvent(listeningTarget, 'mouseup');
                (async () => {
                    for await (const _moveEvent of mouseMoveIter) {
                        this.update(element, controls, returnables);
                    }
                })();
                (async () => {
                    for await (const _upEvent of mouseUpIter) {
                        mouseUpIter.return! ();
                        mouseMoveIter.return! ();
                        this.update(element, controls, returnables);
                    }
                })();
            }
        })();

        this.update(element, controls, returnables);

        const zoomIter = findMethodIterator(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                this.update(element, controls, returnables);
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
            this.destroyControls(controls);
            this.destroyReturnables(returnables);
        };
        return cancel;
    }

}
