import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { DraggerValue } from "../services/dragger/dragger-value";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { PointConcerns } from "./models/point-concerns.model";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Coorinator } from "../services/coordinator/coordinator";
import { Guides } from "../services/guides/guides";


export class LineFigure implements Figure<SVGLineElement> {

    readonly name = 'line';
    readonly ctor = SVGLineElement;

    constructor(
        public drag: DraggerValue,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
        private coords: Coorinator,
        private guides: Guides,
    ) {}

    testByElement(element: any): element is SVGLineElement {
        return element instanceof SVGLineElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}) {
        let points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let tempDestroyer: (() => void) | null = null;
        this.userEventMan.mode = 'interactive';
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
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
            if (points.length === 1 && shiftKey) {
                const [ curX, curY ] = this.coords.renderPointConcerns(point, true);
                const [ prevX, prevY ] = this.coords.renderPointConcerns(points[0], true);
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
                const [ [x1, y1], [x2, y2] ] = points.map(point => this.coords.renderPointConcerns(point, true));
                const attrs: {[K: string]: number} = { x1, y1, x2, y2 };
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Object.keys(attrs).forEach(key => {
                    const value = attrs[key];
                    line.setAttribute(key, `${ value }`);
                });
                line.setAttribute('stroke', '#777');
                this.artboard.svg.appendChild(line);
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

    createEditingSelection(point: PointConcerns): () => void {
        const [ cx, cy ] = this.coords.renderPointConcerns(point,false);
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
        this.guides.guidesContainer!.appendChild(pseudoLine);
        this.guides.guidesContainer!.appendChild(pseudoPoint);
        const onMousemove = (event: MouseEvent) => {
            const {
                clientX,
                clientY,
                shiftKey,
            } = event;
            let [ x2, y2 ] = this.coords.renderPointConcerns({...point, client: [clientX, clientY]}, false);
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
            this.guides.guidesContainer!.removeChild(pseudoLine);
            this.guides.guidesContainer!.removeChild(pseudoPoint);
        };
    }

}
