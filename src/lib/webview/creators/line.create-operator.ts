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


export class LineCreateOperator extends BaseCreateOperator {

    makeElement() {
        return new Promise<SVGLineElement>(resolve => {
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
                    resolve(line);
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
                    cancelEvents.return! ();
                }
            })();
        });
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


}