import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Guides } from "../services/guides/guides";
import { PointConcerns } from "./models/point-concerns.model";
import { Coorinator } from "../services/coordinator/coordinator";
import { Appearance } from "../services/appearance/appearance";

export class EllipseFigure implements Figure<SVGEllipseElement> {

    readonly name = 'ellipse';

    readonly ctor = SVGEllipseElement;

    constructor(
        public readonly drag: DraggerValue,
        public readonly artboard: Artboard,
        public readonly artboardMove: ArtboardMove,
        public readonly zoom: Zoom,
        public readonly cancelListener: CancelListener,
        public readonly userEventMan: UserEventManager,
        public readonly guides: Guides,
        private coords: Coorinator,
        private appearance: Appearance,
    ) {
    }

    testByElement(element: any): element is SVGEllipseElement {
        return element instanceof SVGEllipseElement;
    }

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        let points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let pseudoElement: SVGEllipseElement | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            points.push({
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            });
            if (points.length === 1) {
                pseudoElement = this.createEditingSelection(points[0]);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points.map(({ client, scroll, margin, board, zoom }) => {
                    return this.coords.render2d(client, scroll, margin, board, zoom, true);
                });
                const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
                this.renderCoordsAttributes(element, [x1, y1], [x2, y2], shiftKey);                
                element.setAttribute('stroke', this.appearance.stroke);
                element.setAttribute('fill', this.appearance.fill);
                this.artboard.svg.appendChild(element);
            }
        };
        window.addEventListener('click', pointsListener);
        const cancel = () => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.keyEvent.off(cancel);
            this.artboard.box.classList.remove('interactive-points');
            if (pseudoElement) {
                this.guides.guidesContainer!.removeChild(pseudoElement);
            }
            this.userEventMan.mode = 'pick';
        };
        this.cancelListener.keyEvent.on(cancel);
    }

    /**
     * //
     */
    createEditingSelection(point: PointConcerns) {
        const { client, scroll, margin, board, zoom } = point;
        const [x1, y1] = this.coords.render2d(client, scroll, margin, board, zoom, false);
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', '#777');
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke-dasharray', '1');
        this.guides.guidesContainer!.appendChild(element);
        const onMousemove = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const client2: [number, number] = [clientX, clientY];
            const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, false);
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
        element.setAttribute('cx', `${ cx }`);
        element.setAttribute('cy', `${ cy }`);
        element.setAttribute('rx', `${ rx }`);
        element.setAttribute('ry', `${ ry }`);
    }

}
