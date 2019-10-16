import { artboard } from "@/webview/services/artboard";
import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";
import { PointConcerns } from "@/webview/models/point-concerns.model";
import { artboardMove } from "@/webview/services/artboard-move";
import { draggerDouble } from "@/webview/draggers";
import { moverLine } from "@/webview/movers";
import { userEventMan } from "@/webview/services/user-event";
import { coordinator } from "@/webview/services/coordinator";
import { appearance } from "@/webview/services/appearance";
import { cancelListener } from "@/webview/listeners";
import { guides } from "@/webview/services/guides";
import { hints } from "@/webview/services/hints";
import { zoom } from "@/webview/services/zoom";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export class LineFigure implements Figure<SVGLineElement> {

    readonly name = 'line';
    readonly ctor = SVGLineElement;
    public drag = draggerDouble;
    public readonly move = moverLine;

    testByElement(element: any): element is SVGLineElement {
        return element instanceof SVGLineElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}) {
        let points = Array<PointConcerns>();
        artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let {
                clientX,
                clientY,
                shiftKey,
            } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMove.left, artboardMove.top],
                board: [artboard.width, artboard.height],
                zoom: zoom.value,
            };
            if (points.length === 1 && shiftKey) {
                const [ curX, curY ] = coordinator.renderPointConcerns(point, true);
                const [ prevX, prevY ] = coordinator.renderPointConcerns(points[0], true);
                const absDeltaX = Math.abs(curX - prevX);
                const absDeltaY = Math.abs(curY - prevY);
                if (absDeltaX < absDeltaY) {
                    point.client[0] = points[0].client[0];
                } else {
                    point.client[1] = points[0].client[1];
                }
            }
            points.push(point);
            if (points.length === 1) {
                tempDestroyer = this.createEditingSelection(points[0]);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points.map(point => coordinator.renderPointConcerns(point, true));
                const attrs: {[K: string]: number} = { x1, y1, x2, y2 };
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Object.keys(attrs).forEach(key => {
                    const value = attrs[key];
                    line.setAttribute(key, `${ value }`);
                });
                line.setAttribute('stroke', appearance.stroke);
                line.setAttribute('fill', appearance.fill);
                artboard.svg.appendChild(line);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            // cancelListener.keyEvent.off(cancel);
            cancelEvents.return! ();
            artboard.box.classList.remove('interactive-points');
            if (tempDestroyer instanceof Function) {
                tempDestroyer();
            }
            userEventMan.mode = 'pick';
        };
        // cancelListener.keyEvent.on(cancel);
        (async () => {
            for await (const _key of cancelEvents) {
                cancel();
            }
        })();
    }

    createEditingSelection(point: PointConcerns): () => void {
        const [ cx, cy ] = coordinator.renderPointConcerns(point,false);
        const pseudoPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const pseudoLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        pseudoPoint.setAttribute('fill', 'none');
        pseudoPoint.setAttribute('stroke', '#777');
        pseudoPoint.setAttribute('stroke-dasharray', '1');
        pseudoPoint.setAttribute('r', '3');
        pseudoPoint.setAttribute('cx', `${ cx }`);
        pseudoPoint.setAttribute('cy', `${ cy }`);
        pseudoLine.setAttribute('x1', `${ cx }`);
        pseudoLine.setAttribute('y1', `${ cy }`);
        pseudoLine.setAttribute('x2', `${ cx }`);
        pseudoLine.setAttribute('y2', `${ cy }`);
        pseudoLine.setAttribute('stroke', '#777');
        pseudoLine.setAttribute('stroke-dasharray', '1');
        guides.guidesContainer!.appendChild(pseudoLine);
        guides.guidesContainer!.appendChild(pseudoPoint);
        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = coordinator.renderPointConcerns({...point, client: [clientX, clientY]}, false);
            if (shiftKey) {
                const absDeltaX = Math.abs(x2 - cx);
                const absDeltaY = Math.abs(y2 - cy);
                if (absDeltaX < absDeltaY) {
                    x2 = cx;
                } else {
                    y2 = cy;
                }
            }
            pseudoLine.setAttribute('x2', `${ x2 }`);
            pseudoLine.setAttribute('y2', `${ y2 }`);
        };
        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);
        return () => {
            guides.guidesContainer!.removeChild(pseudoLine);
            guides.guidesContainer!.removeChild(pseudoPoint);
        };
    }

    edit(element: SVGLineElement) {
        hints.setHint('finishEdit');
        // userEventMan.mode = 'interactive';
        guides.removeSelection();
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            const x1 = element.getAttribute('x1')!;
            const y1 = element.getAttribute('y1')!;
            const x2 = element.getAttribute('x2')!;
            const y2 = element.getAttribute('y2')!;
            [[x1, y1], [x2, y2]].forEach((coords, pairIndex) => {
                const [cx, cy] = coords.map(c => parseFloat(c));
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                guides.guidesContainer!.appendChild(circle);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-dasharray', '1');
                circle.setAttribute('cx', `${ cx * zoom.value }`);
                circle.setAttribute('cy', `${ cy * zoom.value }`);
                circle.setAttribute('r', '10');
                circle.style.pointerEvents = 'fill';
                
                const x1$ = parseFloat(element.getAttribute('x1')!);
                const y1$ = parseFloat(element.getAttribute('y1')!);
                const x2$ = parseFloat(element.getAttribute('x2')!);
                const y2$ = parseFloat(element.getAttribute('y2')!);
                let x = 0;
                let y = 0;
                let curCx = cx;
                let curCy = cy;
                let rcx = cx;
                let rcy = cy;
                const onMouseMove = (event: MouseEvent) => {
                    event.stopPropagation();
                    const { clientX, clientY} = event;
                    const dx = (clientX - x) / zoom.value;
                    const dy = (clientY - y) / zoom.value;
                    curCx = rcx + dx;
                    curCy = rcy + dy;
                    circle.setAttribute('cx', `${ curCx * zoom.value }`);
                    circle.setAttribute('cy', `${ curCy * zoom.value }`);
                    if (pairIndex === 0) {
                        element.setAttribute('x1', `${ x1$ + dx }`);
                        element.setAttribute('y1', `${ y1$ + dy }`);
                    }
                    if (pairIndex === 1) {
                        element.setAttribute('x2', `${ x2$ + dx }`);
                        element.setAttribute('y2', `${ y2$ + dy }`);
                    }
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
                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                    const {
                        clientX,
                        clientY,
                    } = event;
                    x = clientX;
                    y = clientY;
                    rcx = curCx;
                    rcy = curCy;
                };
                circle.addEventListener('mousedown', onMouseDown);
                pseudoEls.push(circle);
            });
        };

        const undraw = () => {
            pseudoEls.forEach(circle => guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };

        const redraw = () => {
            undraw();
            draw();
        };

        draw();

        const zoomIter = findMethodIterator<number>(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                console.log('redraw line edit by zoom');
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
        };

        return cancel;
    }

}