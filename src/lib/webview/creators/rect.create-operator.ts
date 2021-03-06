import { BaseCreateOperator } from "./base.create-operator";
import { PointConcerns } from "../models/point-concerns.model";
import { artboard } from "@/web/init";
import { userEventMan } from "../services/user-event";
import { artboardMove } from '@/web/init';
import { zoom } from "@/web/init";
import { coordinator } from "../services/coordinator";
import { findMethodIterator } from "@/common/iterators";
import { cancelListener } from "../listeners";
import { guides } from "@/web/init";
import { appearance } from "../services/appearance";
import { spawner } from "@/dom/spawner";
import { setState } from "&resolve/decorators/set-state.decorator";


export class RectCreateOperator extends BaseCreateOperator {

    makeElement() {
        return new Promise<SVGRectElement>(resolve => {
            const points = Array<PointConcerns>();
            artboard.box.style.cursor = 'crosshair';
            let tempDestroyer: (() => void) | null = null;
            userEventMan.mode = 'interactive';
            const pointsListener = (event: MouseEvent) => {
                const {
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
                    const deltaX = curX - prevX;
                    const deltaY = curY - prevY;
                    const absDeltaX = Math.abs(deltaX);
                    const absDeltaY = Math.abs(deltaY);
                    if (absDeltaX < absDeltaY) {
                        point.client[0] = points[0].client[0] + deltaY;
                    } else {
                        point.client[1] = points[0].client[1] + deltaX;
                    }
                }
                points.push(point);
                if (points.length === 1) {
                    tempDestroyer = this.renderTemp(points[0]);
                }
                if (points.length >= 2) {
                    cancel();
                    const element = this.renderFinal(points);
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
                if (tempDestroyer instanceof Function) {
                    tempDestroyer();
                }
                userEventMan.mode = 'pick';
            };
            // cancelListener.keyEvent.on(cancel);
            (async () => {
                for await (const _key of cancelEvents) {
                    cancel();
                    cancelEvents.return! ();
                }
            })();
        });
    }

    /**
     * 
     */
    renderTemp(point: PointConcerns): () => void {
        const [ x1, y1 ] = coordinator.renderPointConcerns(point, false);

        const element = spawner.svg.rect({
            fill: 'none',
            stroke: '#777',
            'stroke-dasharray': '1',
        });
        guides.guidesContainer! .appendChild(element);

        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = coordinator.renderPointConcerns({...point, client: [clientX, clientY]}, false);
            if (shiftKey) {
                const deltaX = x2 - x1;
                const deltaY = y2 - y1;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                if (absDeltaX < absDeltaY) {
                    x2 = x1 + deltaY;
                } else {
                    y2 = y1 + deltaX;
                }
            }
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
    @setState
    renderFinal(points: PointConcerns[]) {
        const { svg } = artboard;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svg.appendChild(element);

        element.setAttribute('fill', appearance.fill);
        element.setAttribute('stroke', appearance.stroke);

        const [ [x1, y1], [x2, y2] ] = points.map(point => coordinator.renderPointConcerns(point, true));
        this.renderCoordAttributes(element, [x1, y1], [x2, y2]);
        return element;
    }

    /**
     * //
     */
    renderCoordAttributes(
        element: SVGRectElement,
        [x1, y1]: [number, number],
        [x2, y2]: [number, number],
    ) {
        const x = x1 < x2 ? x1 : x2;
        const y = y1 < y2 ? y1 : y2;
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        spawner.svg.update(element, {
            'x': `${ x }`,
            'y': `${ y }`,
            'width': `${ width }`,
            'height': `${ height }`,
        });
    }

}
