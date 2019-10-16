import { appearance } from "@/webview/services/appearance";
import { artboard } from "@/webview/services/artboard";
import { findMethodIterator } from "@/common/iterators";
import { zoom } from "@/webview/services/zoom";
import { spawner } from "@/dom/spawner";
import { PointConcerns } from "@/webview/models/point-concerns.model";
import { artboardMove } from "@/webview/services/artboard-move";
import { draggerCenter } from "@/webview/draggers";
import { moverCenter } from "@/webview/movers";
import { userEventMan } from "@/webview/services/user-event";
import { cancelListener } from "@/webview/listeners";
import { coordinator } from "@/webview/services/coordinator";
import { guides } from "@/webview/services/guides";
import { hints } from "@/webview/services/hints";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";



export class CircleFigure implements Figure<SVGCircleElement> {

    readonly name = 'circle';

    readonly ctor = SVGCircleElement;

    public readonly drag = draggerCenter;
    public readonly move = moverCenter;

    testByElement(element: any): element is SVGCircleElement {
        return element instanceof SVGCircleElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
            } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMove.left, artboardMove.top],
                board: [artboard.width, artboard.height],
                zoom: zoom.value,
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
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            // this.cancelListener.keyEvent.off(cancel);
            cancelEvents.return! ();
            artboard.box.classList.remove('interactive-points');
            if (tempDestroyer instanceof Function) {
                tempDestroyer();
            }
            userEventMan.mode = 'pick';
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
        const [ x1, y1 ] = coordinator.renderPointConcerns(point, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        guides.guidesContainer!.appendChild(element);

        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', '#777');
        element.setAttribute('stroke-dasharray', '1');

        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
            } = event;
            let [ x2, y2 ] = coordinator.renderPointConcerns({...point, client: [clientX, clientY]}, false);
            this.renderCoordAttributes(element, [x1, y1], [x2, y2]);
        };

        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);

        return () => {
            guides.guidesContainer!.removeChild(element);
        };
    }

    /**
     * 
     */
    renderFinal(points: PointConcerns[]): void {
        const { svg } = artboard;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svg.appendChild(element);

        element.setAttribute('fill', appearance.fill);
        element.setAttribute('stroke', appearance.stroke);

        const [ [x1, y1], [x2, y2] ] = points.map(point => coordinator.renderPointConcerns(point, true));
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
        hints.setHint('finishEdit');
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
                const { value: zoomValue } = zoom;
                const circle = spawner.svg.circle(
                    {
                        cx: `${ cx$ * zoomValue }`,
                        cy: `${ cy$ * zoomValue }`,
                        fill: appearance.editControlPointFill,
                        stroke: appearance.editControlPointStroke,
                        'stroke-dasharray': appearance.editControlPointStrokeDasharray,
                        r: appearance.editControlPointRadius,
                    },
                    {
                        pointerEvents: 'fill',
                    },
                );
                guides.guidesContainer! .appendChild(circle);
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
                    const dx = (clientX - vx) / zoom.value;
                    const dy = (clientY - vy) / zoom.value;
                    lx = ax + dx;
                    ly = ay + dy;
                    const nx = lx * zoom.value;
                    const ny = ly * zoom.value;
                    spawner.svg.update(circle, {
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
                    spawner.svg.update(element, {
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
                    guides.removeSelection();
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
            pseudoEls.forEach(circle => guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };
        const redraw = () => {
            undraw();
            draw();
        };
        draw();
        // zoom.valueChange.on(redraw);
        const elementOnMouseMove = (_event: MouseEvent) => {
            redraw();
        };
        element.addEventListener('mousemove', elementOnMouseMove);
        return () => {
            undraw();
            // zoom.valueChange.off(redraw);
            element.removeEventListener('mousemove', elementOnMouseMove);
        };
    }


}