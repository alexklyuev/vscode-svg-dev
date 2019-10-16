import { findMethodIterator } from "@/common/iterators";
import { spawner } from "@/dom/spawner";
import { zoom } from "@/webview/services/zoom";
import { artboard } from "@/webview/services/artboard";
import { artboardMove } from "@/webview/services/artboard-move";
import { appearance } from "@/webview/services/appearance";
import { userEventMan } from "@/webview/services/user-event";
import { PointConcerns } from "@/webview/models/point-concerns.model";
import { draggerCenter } from "@/webview/draggers";
import { moverCenter } from "@/webview/movers";
import { coordinator } from "@/webview/services/coordinator";
import { cancelListener } from "@/webview/listeners";
import { guides } from "@/webview/services/guides";
import { hints } from "@/webview/services/hints";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export class EllipseFigure implements Figure<SVGEllipseElement> {

    readonly name = 'ellipse';

    readonly ctor = SVGEllipseElement;

    public readonly drag = draggerCenter;
    public readonly move = moverCenter;

    testByElement(element: any): element is SVGEllipseElement {
        return element instanceof SVGEllipseElement;
    }

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        let points = Array<PointConcerns>();
        artboard.box.classList.add('interactive-points');
        let pseudoElement: SVGEllipseElement | null = null;
        userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            points.push({
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMove.left, artboardMove.top],
                board: [artboard.width, artboard.height],
                zoom: zoom.value,
            });
            if (points.length === 1) {
                pseudoElement = this.createEditingSelection(points[0]);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points.map(({ client, scroll, margin, board, zoom }) => {
                    return coordinator.render2d(client, scroll, margin, board, zoom, true);
                });
                const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
                this.renderCoordsAttributes(element, [x1, y1], [x2, y2], shiftKey);
                element.setAttribute('stroke', appearance.stroke);
                element.setAttribute('fill', appearance.fill);
                artboard.svg.appendChild(element);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            // cancelListener.keyEvent.off(cancel);
            cancelEvents.return! ();
            artboard.box.classList.remove('interactive-points');
            if (pseudoElement) {
                guides.guidesContainer!.removeChild(pseudoElement);
            }
            userEventMan.mode = 'pick';
        };
        // cancelListener.keyEvent.on(cancel);
        (async () => {
            for await (const _event of cancelEvents) {
                cancel();
            }
        })();
    }

    /**
     * //
     */
    createEditingSelection(point: PointConcerns) {
        const { client, scroll, margin, board, zoom } = point;
        const [x1, y1] = coordinator.render2d(client, scroll, margin, board, zoom, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', '#777');
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke-dasharray', '1');
        guides.guidesContainer!.appendChild(element);
        const onMousemove = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const client2: [number, number] = [clientX, clientY];
            const [x2, y2] = coordinator.render2d(client2, scroll, margin, board, zoom, false);
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
        spawner.svg.update(element, {
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
        hints.setHint('finishEdit');
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
                    spawner.svg.update(element, {
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
