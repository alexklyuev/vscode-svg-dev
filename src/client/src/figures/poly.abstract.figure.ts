import { Figure } from "./figure.model";
import { Dragger } from "../services/dragger/dragger.interface";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { setState } from "../decorators/set-state.decorator";
import { CancelKeys } from "../../../shared/pipes/cancel.pipe";


// type UserPoint = [
//     [number, number, number],
//     [number, number, number]
// ];


export abstract class PolyFigure implements Figure<SVGElement> {

    abstract readonly name: string;
    abstract readonly ctor = SVGElement;

    abstract stroke: string;
    abstract fill: string;

    constructor(
        public drag: Dragger,
        private artboard: Artboard,
        public zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
    ) {}

    abstract testByElement(element: any): element is SVGElement;

    @setState
    create(_elementName: string, _attributest: {[K: string]: string}) {
        let points = Array<[[number, number], [number, number]]>();
        this.artboard.box.classList.add('interactive-points');
        let toolsSvgRemover: null | (() => void) = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            const point: [[number, number], [number, number]] = [
                [clientX, scrollLeft],
                [clientY, scrollTop],
            ];
            if (points.length > 0 && shiftKey) {
                const [[cx,], [cy,]] = points[points.length - 1];
                const deltax = Math.abs(clientX - cx);
                const deltay = Math.abs(clientY - cy);
                if (deltax < deltay) {
                    point[0] = [cx, scrollLeft];
                } else {
                    point[1] = [cy, scrollTop];
                }
            }
            points.push(point);
            if (toolsSvgRemover instanceof Function) {
                toolsSvgRemover();
                toolsSvgRemover = null;
            }
            toolsSvgRemover = this.renderTools(points);
        };
        window.addEventListener('click', pointsListener);
        const stop = (_key: CancelKeys) => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.keyEvent.off(stop);
            this.artboard.box.classList.remove('interactive-points');
            if (toolsSvgRemover instanceof Function) {
                toolsSvgRemover();
                toolsSvgRemover = null;
            }
            this.userEventMan.mode = 'pick';
            this.render(points);
        };
        this.cancelListener.keyEvent.on(stop);
    }

    render(points: Array<[[number, number], [number, number]]>) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', this.stroke);
        element.setAttribute('fill', this.fill);
        element.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {
            return `${(cX + sX) / this.zoom.value},${(cY + sY) / this.zoom.value}`;
        }).join(' '));
        this.artboard.svg.appendChild(element);
    }

    renderTools(points: Array<[[number, number], [number, number]]>) {
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const artboardBox = this.artboard.svg.getBoundingClientRect();
        const artboardWidth = parseInt(this.artboard.svg.getAttribute('width')!);
        const artboardHeight = parseInt(this.artboard.svg.getAttribute('height')!);
        svg.setAttribute('width', String(this.zoom.value * artboardWidth));
        svg.setAttribute('height', String(this.zoom.value * artboardHeight));
        Object.assign(svg.style, {
            position: 'absolute',
            top: artboardBox.top + scrollTop + 'px',
            left: artboardBox.left + scrollLeft + 'px',
        });
        this.artboard.tools.appendChild(svg);
        points.forEach(([[cX, sX], [cY, sY]], index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', `${cX + sX}`);
            circle.setAttribute('cy', `${cY + sY}`);
            circle.setAttribute('r', `${3}`);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#777');
            circle.setAttribute('stroke-dasharray', '1');
            svg.appendChild(circle);
            if (index > 0) {
                const [[cXprev, sXprev], [cYprev, sYprev]] = points[index - 1];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const attrs: {[K: string]: string} = {
                    'stroke': '#777',
                    'stroke-dasharray': '1',
                    'x1': `${cXprev + sXprev}`,
                    'y1': `${cYprev + sYprev}`,
                    'x2': `${cX + sX}`,
                    'y2': `${cY + sY}`,
                };
                Object.keys(attrs).forEach(key => {
                    const val = attrs[key];
                    line.setAttribute(key, val);
                });
                svg.appendChild(line);
            }
        });
        let mousemoveRemover = () => {};
        if (points.length > 0) {
            const [[cX, sX], [cY, sY]] = points[points.length - 1];
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svg.appendChild(line);
            const attrs: {[K: string]: string} = {
                'stroke': '#777',
                'stroke-dasharray': '1',
                'x1': `${cX + sX}`,
                'y1': `${cY + sY}`,
                'x2': `${cX + sX}`,
                'y2': `${cY + sY}`,
            };
            Object.keys(attrs).forEach(key => {
                const val = attrs[key];
                line.setAttribute(key, val);
            });
            const onMousemove = (event: MouseEvent) => {
                const { clientX, clientY, shiftKey } = event;
                const { scrollLeft, scrollTop } = document.scrollingElement!;
                const points: {[K: string]: string} = {
                    'x2': `${clientX + scrollLeft}`,
                    'y2': `${clientY + scrollTop}`,
                };
                if (shiftKey) {
                    const absDeltaX = Math.abs(clientX - cX);
                    const absDeltaY = Math.abs(clientY - cY);
                    if (absDeltaX < absDeltaY) {
                        points.x2 = `${cX + sX}`;
                    } else {
                        points.y2 = `${cY + sY}`;
                    }
                }
                Object.keys(points).forEach(key => {
                    const val = points[key];
                    line.setAttribute(key, val);
                });
            };
            window.addEventListener('mousemove', onMousemove);
            mousemoveRemover = () => window.removeEventListener('mousemove', onMousemove);
        }
        return () => {
            mousemoveRemover();
            this.artboard.tools.removeChild(svg);
        };
    }

}
