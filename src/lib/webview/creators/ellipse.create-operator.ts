import { BaseCreateOperator } from "./base.create-operator";
import { PointConcerns } from "../models/point-concerns.model";
import { artboard } from "@/web/init";
import { userEventMan } from "../services/user-event";
import { artboardMove } from '@/web/init';
import { zoom } from "@/web/init";
import { coordinator } from "../services/coordinator";
import { appearance } from "../services/appearance";
import { findMethodIterator } from "@/common/iterators";
import { cancelListener } from "../listeners";
import { guides } from "@/web/init";
import { spawner } from "@/dom/spawner";


export class EllipseCreateOperator extends BaseCreateOperator {

    /**
     * //
     */
    makeElement() {
        return new Promise<SVGEllipseElement>(resolve => {
            let points = Array<PointConcerns>();
            artboard.box.style.cursor = 'crosshair';
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
                    const element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                    this.renderCoordsAttributes(element, [x1, y1], [x2, y2], shiftKey);
                    element.setAttribute('stroke', appearance.stroke);
                    element.setAttribute('fill', appearance.fill);
                    artboard.svg.appendChild(element);
                    resolve(element);
                }
            };
            window.addEventListener('click', pointsListener);
            const cancelEvents = findMethodIterator(cancelListener.eventReceived);
            const cancel = () => {
                window.removeEventListener('click', pointsListener);
                // cancelListener.keyEvent.off(cancel);
                cancelEvents.return! ();
                artboard.box.style.cursor = 'default';
                if (pseudoElement) {
                    guides.guidesContainer!.removeChild(pseudoElement);
                }
                userEventMan.mode = 'pick';
            };
            // cancelListener.keyEvent.on(cancel);
            (async () => {
                for await (const _event of cancelEvents) {
                    cancel();
                    cancelEvents.return! ();
                }
            })();
        });
    }

    /**
     * //
     */
    createEditingSelection(point: PointConcerns) {
        const { client, scroll, margin, board, zoom } = point;
        const [x1, y1] = coordinator.render2d(client, scroll, margin, board, zoom, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
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
    }


}