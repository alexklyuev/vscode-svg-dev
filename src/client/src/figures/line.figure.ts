import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { DraggerValue } from "../services/dragger/dragger-value";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";


export class LineFigure implements Figure<SVGLineElement> {

    readonly name = 'line';
    readonly ctor = SVGLineElement;

    constructor(
        public drag: DraggerValue,
        private artboard: Artboard,
        private zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
    ) {}

    testByElement(element: any): element is SVGLineElement {
        return element instanceof SVGLineElement;
    }

    @setState
    create(_elementName: string, _attributes: {[K: string]: string}) {
        let points = Array<[number, number]>();
        this.artboard.box.classList.add('interactive-points');
        let toolsSvg: SVGSVGElement | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
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
                clientX + scrollLeft,
                clientY + scrollTop,
            ]);
            if (points.length === 1) {
                const [ [cx, cy] ] = points;
                toolsSvg = this.createEditingSelection(cx, cy);
            }
            if (points.length >= 2) {
                cancel();
                const [ [x1, y1], [x2, y2] ] = points;
                const attrs: {[K: string]: number} = {x1, y1, x2, y2};
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Object.keys(attrs).forEach(key => {
                    const value = attrs[key];
                    line.setAttribute(key, `${Math.round(value / this.zoom.value)}`);
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
            if (toolsSvg) {
                this.artboard.tools.removeChild(toolsSvg);
            }
            this.userEventMan.mode = 'pick';
        };
        this.cancelListener.keyEvent.on(cancel);
    }

    createEditingSelection(cx: number, cy: number) {
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const pseudoPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const pseudoLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const artboardBox = this.artboard.svg.getBoundingClientRect();
        const artboardWidth = parseInt(this.artboard.svg.getAttribute('width')!);
        const artboardHeight = parseInt(this.artboard.svg.getAttribute('height')!);
        svg.setAttribute('width', String(this.zoom.value * artboardWidth));
        svg.setAttribute('height', String(this.zoom.value * artboardHeight));
        pseudoPoint.setAttribute('fill', 'none');
        pseudoPoint.setAttribute('stroke', '#777');
        pseudoPoint.setAttribute('stroke-dasharray', '1');
        pseudoPoint.setAttribute('r', '3');
        pseudoPoint.setAttribute('cx', `${cx}`);
        pseudoPoint.setAttribute('cy', `${cy}`);
        pseudoLine.setAttribute('x1', `${cx}`);
        pseudoLine.setAttribute('y1', `${cy}`);
        pseudoLine.setAttribute('x2', `${cx}`);
        pseudoLine.setAttribute('y2', `${cy}`);
        pseudoLine.setAttribute('stroke', '#777');
        pseudoLine.setAttribute('stroke-dasharray', '1');
        const onMousemove = (event: MouseEvent) => {
            let { clientX, clientY, shiftKey } = event;
            const prevX = cx - scrollLeft;
            const prevY = cy - scrollTop;
            const absDeltaX = Math.abs(clientX - prevX);
            const absDeltaY = Math.abs(clientY - prevY);
            if (shiftKey) {
                if (absDeltaX < absDeltaY) {
                    clientX = cx - scrollLeft;
                } else {
                    clientY = cy - scrollTop;
                }
            }
            pseudoLine.setAttribute('x2', `${clientX + scrollLeft}`);
            pseudoLine.setAttribute('y2', `${clientY + scrollTop}`);
        };
        const onClick = (_click: MouseEvent) => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('click', onClick);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('click', onClick);
        Object.assign(svg.style, {
            position: 'absolute',
            top: artboardBox.top + scrollTop + 'px',
            left: artboardBox.left + scrollLeft + 'px',
        });
        this.artboard.tools.appendChild(svg);
        svg.appendChild(pseudoPoint);
        svg.appendChild(pseudoLine);
        return svg;
    }

}
