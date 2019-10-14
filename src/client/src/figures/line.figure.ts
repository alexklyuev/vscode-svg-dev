import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { DraggerValue } from "../services/dragger/dragger-value";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { PointConcerns } from "./models/point-concerns.model";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Coorinator } from "../services/coordinator/coordinator";
import { Guides } from "../services/guides/guides";
import { Appearance } from "../services/appearance/appearance";
import { Mover } from "../services/mover/mover.model";
import { Hints } from "../services/hints/hints";
import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";


export class LineFigure implements Figure<SVGLineElement> {

    readonly name = 'line';
    readonly ctor = SVGLineElement;

    constructor(
        public drag: DraggerValue,
        public readonly move: Mover,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
        private coords: Coorinator,
        private guides: Guides,
        private appearance: Appearance,
        private hints: Hints,
    ) {}

    testByElement(element: any): element is SVGLineElement {
        return element instanceof SVGLineElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}) {
        let points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        this.userEventMan.mode = 'interactive';
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
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
            if (points.length === 1 && shiftKey) {
                const [ curX, curY ] = this.coords.renderPointConcerns(point, true);
                const [ prevX, prevY ] = this.coords.renderPointConcerns(points[0], true);
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
                const [ [x1, y1], [x2, y2] ] = points.map(point => this.coords.renderPointConcerns(point, true));
                const attrs: {[K: string]: number} = { x1, y1, x2, y2 };
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Object.keys(attrs).forEach(key => {
                    const value = attrs[key];
                    line.setAttribute(key, `${ value }`);
                });
                line.setAttribute('stroke', this.appearance.stroke);
                line.setAttribute('fill', this.appearance.fill);
                this.artboard.svg.appendChild(line);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancelEvents = findMethodIterator(this.cancelListener.eventReceived);
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

    createEditingSelection(point: PointConcerns): () => void {
        const [ cx, cy ] = this.coords.renderPointConcerns(point,false);
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
        this.guides.guidesContainer!.appendChild(pseudoLine);
        this.guides.guidesContainer!.appendChild(pseudoPoint);
        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = this.coords.renderPointConcerns({...point, client: [clientX, clientY]}, false);
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
            this.guides.guidesContainer!.removeChild(pseudoLine);
            this.guides.guidesContainer!.removeChild(pseudoPoint);
        };
    }

    edit(element: SVGLineElement) {
        this.hints.setHint('finishEdit');
        // this.userEventMan.mode = 'interactive';
        this.guides.removeSelection();
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            const x1 = element.getAttribute('x1')!;
            const y1 = element.getAttribute('y1')!;
            const x2 = element.getAttribute('x2')!;
            const y2 = element.getAttribute('y2')!;
            [[x1, y1], [x2, y2]].forEach((coords, pairIndex) => {
                const [cx, cy] = coords.map(c => parseFloat(c));
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                this.guides.guidesContainer!.appendChild(circle);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-dasharray', '1');
                circle.setAttribute('cx', `${ cx * this.zoom.value }`);
                circle.setAttribute('cy', `${ cy * this.zoom.value }`);
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
                    const dx = (clientX - x) / this.zoom.value;
                    const dy = (clientY - y) / this.zoom.value;
                    curCx = rcx + dx;
                    curCy = rcy + dy;
                    circle.setAttribute('cx', `${ curCx * this.zoom.value }`);
                    circle.setAttribute('cy', `${ curCy * this.zoom.value }`);
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
            pseudoEls.forEach(circle => this.guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };

        const redraw = () => {
            undraw();
            draw();
        };

        draw();

        const zoomIter = findMethodIterator<number>(this.zoom.update);
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
