import { artboard } from "@/webview/services/artboard";
import { findMethodIterator } from "@/common/iterators";
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
import { linePointsEditor } from "../points-editor";


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
        return linePointsEditor.edit(element);
    }

}
