import { Figure } from "./figure.model";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { DraggerValue } from "../services/dragger/dragger-value";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Guides } from "../services/guides/guides";

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
    ) {
    }

    testByElement(element: any): element is SVGEllipseElement {
        return element instanceof SVGEllipseElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        let points = Array<[number, number]>();
        this.artboard.box.classList.add('interactive-points');
        let pseudoElement: SVGEllipseElement | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            // const { top: moveTop, left: moveLeft } = this.artboardMove;
            if (points.length === 1 && shiftKey) {
                let [ [prevX, prevY] ] = points;
                prevX -= scrollLeft;
                prevY -= scrollTop;
                const absDeltaX = Math.abs(clientX - prevX);
                const absDeltaY = Math.abs(clientY - prevY);
                if (absDeltaX < absDeltaY) {
                    clientX = points[0][0] - scrollLeft;
                } else {
                    clientY = points[0][1] - scrollTop;
                }
            }
            points.push([
                clientX + scrollLeft - this.artboardMove.left,
                clientY + scrollTop - this.artboardMove.top,
            ]);
            if (points.length === 1) {
                pseudoElement = this.createEditingSelection(points);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points;
                const ellipse = document.createElementNS('http://www.w3.org/2000/svg', this.name);
                ellipse.setAttribute('cx', `${ (x2 - x1) / 2 + x1 }`);
                ellipse.setAttribute('cy', `${ (y2 - y1) / 2 + y1 }`);
                ellipse.setAttribute('rx', `${ (x2 - x1) / 2 }`);
                ellipse.setAttribute('ry', `${ (y2 - y1) / 2 }`);
                ellipse.setAttribute('stroke', '#ffffff');
                ellipse.setAttribute('fill', '#ccc');
                this.artboard.svg.appendChild(ellipse);
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

    createEditingSelection(points: [number, number][]) {
        const [ [x1, y1] ] = points;
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', '#777');
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke-dasharray', '1');
        this.guides.guidesContainer!.appendChild(element);
        const onMousemove = (event: MouseEvent) => {
            let { clientX, clientY, } = event;
            const x2 = clientX + scrollLeft - this.artboardMove.left;
            const y2 = clientY + scrollTop - this.artboardMove.top;
            element.setAttribute('cx', `${ (x2 - x1) / 2 + x1 }`);
            element.setAttribute('cy', `${ (y2 - y1) / 2 + y1 }`);
            element.setAttribute('rx', `${ (x2 - x1) / 2 }`);
            element.setAttribute('ry', `${ (y2 - y1) / 2 }`);
        };
        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);
        return element;
    }

}
