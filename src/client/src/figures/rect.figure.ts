import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { PointConcerns } from "./models/point-concerns.model";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Zoom } from "../services/zoom/zoom";
import { Guides } from "../services/guides/guides";
import { Coorinator } from "../services/coordinator/coordinator";
import { CancelListener } from "../listeners/cancel.listener";


export class RectFigure implements Figure<SVGRectElement> {

    readonly name = 'rect';

    readonly ctor = SVGRectElement;

    constructor(
        public drag: DraggerValue,
        private artboard: Artboard,
        private userEventMan: UserEventManager,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private guides: Guides,
        private coords: Coorinator,
        private cancelListener: CancelListener,
    ) {}

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        this.userEventMan.mode = 'interactive';
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
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
            if (points.length === 1 && shiftKey) {
                const [ curX, curY ] = this.coords.renderPointConcerns(point, true);
                const [ prevX, prevY ] = this.coords.renderPointConcerns(points[0], true);
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
                this.renderFinal(points);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.keyEvent.off(cancel);
            this.artboard.box.classList.remove('interactive-points');
            if (tempDestroyer instanceof Function) {
                tempDestroyer();
            }
            this.userEventMan.mode = 'pick';
        };
        this.cancelListener.keyEvent.on(cancel);
    }

    /**
     * 
     */
    renderTemp(point: PointConcerns): () => void {
        const [ x1, y1 ] = this.coords.renderPointConcerns(point, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.guides.guidesContainer!.appendChild(element);

        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', '#777');
        element.setAttribute('stroke-dasharray', '1');

        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = this.coords.renderPointConcerns({...point, client: [clientX, clientY]}, false);
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
            this.guides.guidesContainer!.removeChild(element);
        };
    }

    /**
     * 
     */
    renderFinal(points: PointConcerns[]): void {
        const { svg } = this.artboard;
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svg.appendChild(element);

        element.setAttribute('fill', '#fff');
        element.setAttribute('stroke', '#ccc');

        const [ [x1, y1], [x2, y2] ] = points.map(point => this.coords.renderPointConcerns(point, true));
        this.renderCoordAttributes(element, [x1, y1], [x2, y2]);
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

        element.setAttribute('x', `${ x }`);
        element.setAttribute('y', `${ y }`);
        element.setAttribute('width', `${ width }`);
        element.setAttribute('height', `${ height }`);
    }

    testByElement(element: any): element is SVGRectElement {
        return element instanceof SVGRectElement;
    }

}