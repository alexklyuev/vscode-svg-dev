import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { spawner } from "@/dom/spawner";
import { pathPoints } from "@/webview/services/path";
import { artboard } from "@/web/init";
import { zoom } from "@/web/init";
import { guides } from "@/web/init";
import { appearance } from "@/webview/services/appearance";


/**
 * refactor to Sets
 */
type ControlPointsCollection = SVGElement[];
type ReturnablesCollection = AsyncIterableIterator<MouseEvent>[];


export class PathPointsEditor {

    /**
     *
     */
    edit(element: SVGPathElement) {
        // const d = element.getAttribute('d')!;
        // const newD = pathPoints.setPointsAbsolute(d);
        // element.setAttribute('d', newD);
        const returnables: ReturnablesCollection = Array<AsyncIterableIterator<MouseEvent>>();
        const controls: ControlPointsCollection = Array<SVGCircleElement>();
        this.update(element, controls, returnables, true);

        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            for await (const _down of mouseDownIter) {
                // this.ensureRelative(element);
                const listeningTarget = artboard.svg;
                mouseMoveIter = fromDomEvent(listeningTarget, 'mousemove');
                mouseUpIter = fromDomEvent(listeningTarget, 'mouseup');
                (async () => {
                    for await (const _moveEvent of mouseMoveIter) {
                        this.update(element, controls, returnables, false);
                    }
                })();
                (async () => {
                    for await (const _upEvent of mouseUpIter) {
                        mouseUpIter.return! ();
                        mouseMoveIter.return! ();
                        this.update(element, controls, returnables, true);
                    }
                })();
            }
        })();
        const zoomIter = findMethodIterator(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                this.update(element, controls, returnables, true);
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

    /**
     *
     */
    destroyControls(controls: ControlPointsCollection) {
        controls.forEach(c => c.remove());
        controls.length = 0;
    }

    /**
     *
     */
    destroyReturnables(returnables: ReturnablesCollection) {
        returnables.forEach(r => r.return! ());
        returnables.length = 0;
    }

    /**
     *
     */
    update(
        element: SVGPathElement,
        controls: SVGElement[],
        returnables: AsyncIterableIterator<MouseEvent>[],
        pathPointsAbsolutMode: boolean,
    ) {
        this.destroyControls(controls);
        this.destroyReturnables(returnables);

        // this.ensureAbsolute(element);
        pathPointsAbsolutMode ? this.ensureAbsolute(element) : this.ensureRelative(element);

        const controlPoints = Array<SVGElement>();
        const controlBeziers = Array<SVGElement>();
        const controlLines = Array<SVGElement>();

        const d = element.getAttribute('d')!;
        const points = pathPoints.parseStr(d);
        const allDims = pathPoints.getAllAbsCoords(points);
        allDims.forEach((point, pointIndex$, $points) => {
            point.forEach((pair, pairIndex, $pairs) => {
                let [ cx, cy ] = pair;
                const isPoint = pairIndex === (point.length - 1);
                const selfControl = isPoint ? false : (pairIndex === $pairs.length - 2);

                const control = spawner.svg.circle(
                    {
                        cx: `${ cx * zoom.value }`,
                        cy: `${ cy * zoom.value }`,
                        fill: isPoint ? appearance.editControlPointFill : appearance.editBezierPointFill,
                        stroke: isPoint ? appearance.editControlPointStroke : appearance.editBezierPointFill,
                        'stroke-dasharray': isPoint ? appearance.editControlPointStrokeDasharray : appearance.editBezierPointStrokeDasharray,
                        r: isPoint ? appearance.editControlPointRadius : appearance.editBezierPointRadius,
                    },
                    {
                        pointerEvents: 'fill',
                    },
                );

                (isPoint ? controlPoints : controlBeziers).push(control);

                if (!isPoint) {
                    const $prevPairs = $points[pointIndex$ - 1];
                    const $pair = (pairIndex === $pairs.length - 2) ? $pairs[$pairs.length - 1] : $prevPairs[$prevPairs.length -1];
                    const [ x2, y2 ] = $pair;
                    const line = spawner.svg.element('line', {
                        'x1': `${ cx * zoom.value }`,
                        'y1': `${ cy * zoom.value }`,
                        'x2': `${ x2 * zoom.value }`,
                        'y2': `${ y2 * zoom.value }`,
                        stroke: appearance.editBezierPointLineStroke,
                        'stroke-dasharray': appearance.editBezierPointLineStrokeDasharray,
                    }, {});
                    controlLines.push(line);
                }

                Array<SVGElement[]>(
                    controlPoints,
                    controlLines,
                    controlBeziers,
                ).forEach(collection => {
                    collection.forEach(item => {
                        guides.guidesContainer! .appendChild(item);
                        controls.push(item);
                    });
                });

                let d0 = element.getAttribute('d')!;
                let x = 0;
                let y = 0;
                let curCx = cx;
                let curCy = cy;
                let rcx = cx;
                let rcy = cy;

                const controlMouseDown = fromDomEvent<MouseEvent>(control, 'mousedown');
                returnables.push(controlMouseDown);
                (async () => {
                    for await (const downEvent of controlMouseDown) {
                        downEvent.stopPropagation();
                        const {
                            clientX,
                            clientY,
                        } = downEvent;
                        x = clientX;
                        y = clientY;
                        rcx = curCx;
                        rcy = curCy;
                        d0 = element.getAttribute('d')!;
                        const listeningElement = window;
                        const controlMouseMove = fromDomEvent<MouseEvent>(listeningElement, 'mousemove');
                        const controlMouseUp = fromDomEvent<MouseEvent>(listeningElement, 'mouseup');
                        (async () => {
                            for await (const moveEvent of controlMouseMove) {
                                moveEvent.stopPropagation();
                                const {
                                    clientX,
                                    clientY,
                                    altKey,
                                } = moveEvent;
                                const dx = (clientX - x) / zoom.value;
                                const dy = (clientY - y) / zoom.value;
                                curCx = rcx + dx;
                                curCy = rcy + dy;
                                control.setAttribute('cx', `${ curCx * zoom.value }`);
                                control.setAttribute('cy', `${ curCy * zoom.value }`);
                                const points = pathPoints.parseStr(d0)
                                .map(([command, coords], pointIndex) => {
                                    if (pointIndex !== pointIndex$) {
                                        return `${ command } ${ coords }`;
                                    } else {
                                        let newCoords = coords.split(pathPoints.delimeter).map(c => parseFloat(c));
                                        if (!isPoint) {
                                            if (selfControl) {
                                                newCoords[newCoords.length - 4] += dx;
                                                newCoords[newCoords.length - 3] += dy;
                                            } else {
                                                newCoords[newCoords.length - 6] += dx;
                                                newCoords[newCoords.length - 5] += dy;
                                            }
                                        } else {
                                            if (altKey) {
                                                newCoords = newCoords.map((c, ci) => c + [dx, dy][ci % 2]);
                                            } else {
                                                newCoords[newCoords.length - 2] += dx;
                                                newCoords[newCoords.length - 1] += dy;
                                            }
                                        }
                                        return `${ command } ${ newCoords.join(' ') }`;
                                    }
                                })
                                .join(' ');
                                element.setAttribute('d', points);
                                this.update(element, controls, returnables, true);
                            }
                        })();
                        (async () => {
                            for await (const upEvent of controlMouseUp) {
                                upEvent.stopPropagation();
                                controlMouseMove.return! ();
                                controlMouseUp.return! ();
                                this.update(element, controls, returnables, true);
                            }
                        })();
                    }
                })();

            });
        });
        guides.setSelectionStyles([element]);
    }

    ensureAbsolute(element: SVGElement) {
        const d = element.getAttribute('d') ! ;
        const newD = pathPoints.setPointsAbsolute(d);
        element.setAttribute('d', newD);
    }

    ensureRelative(element: SVGElement) {
        const d = element.getAttribute('d') ! ;
        const dRel = pathPoints.setPointsRelative(d);
        element.setAttribute('d', dRel);
    }

}
