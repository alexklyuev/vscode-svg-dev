import { appearance } from "@/webview/services/appearance";
import { artboard } from "@/webview/services/artboard";
import { findMethodIterator } from "@/common/iterators";
import { zoom } from "@/webview/services/zoom";
import { PointConcerns } from "@/webview/models/point-concerns.model";
import { artboardMove } from "@/webview/services/artboard-move";
import { draggerCenter } from "@/webview/draggers";
import { moverCenter } from "@/webview/movers";
import { userEventMan } from "@/webview/services/user-event";
import { cancelListener } from "@/webview/listeners";
import { coordinator } from "@/webview/services/coordinator";
import { guides } from "@/webview/services/guides";
import { Sprite } from "@/webview/models/sprite.model";
import { setState } from "@/webview/decorators/set-state.decorator";
import { circlePointsEditor } from "@/webview/points-editor";



export class CircleSprite implements Sprite<SVGCircleElement> {

    readonly name = 'circle';

    readonly ctor = SVGCircleElement;

    public readonly dragOperator = draggerCenter;
    public readonly moveOperator = moverCenter;
    public readonly editPointsOperator = circlePointsEditor;

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
                cancelEvents.return! ();
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

}