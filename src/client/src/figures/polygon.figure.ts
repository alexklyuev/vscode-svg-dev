import { Figure } from "./figure.model";
import { Dragger } from "../services/dragger/dragger.interface";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { setState } from "../decorators/set-state.decorator";


export class PolygonFigure implements Figure<SVGPolygonElement> {

    readonly name = 'polygon';
    readonly ctor = SVGPolygonElement;

    constructor(
        public drag: Dragger,
        private artboard: Artboard,
        public zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
    ) {}

    testByElement(element: any): element is SVGPolygonElement {
        return element instanceof SVGPolygonElement;
    }

    @setState
    create(_elementName: 'polygon', _attributest: {[K: string]: string}) {
        let points = Array<[[number, number], [number, number]]>();
        this.artboard.box.classList.add('interactive-points');
        let toolsSvg: SVGSVGElement | null = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            points.push([
                [clientX, scrollLeft],
                [clientY, scrollTop],
            ]);
            if (toolsSvg) {
                this.artboard.tools.removeChild(toolsSvg);
            }
            toolsSvg = this.renderTools(points);
        };
        window.addEventListener('click', pointsListener);
        const stop = () => {
            window.removeEventListener('click', pointsListener);
            this.cancelListener.removeCallback(stop);
            this.artboard.box.classList.remove('interactive-points');
            if (toolsSvg) {
                this.artboard.tools.removeChild(toolsSvg);
            }
            this.userEventMan.mode = 'pick';
            this.render(points);
        };
        this.cancelListener.addCallback(stop);
    }

    render(points: Array<[[number, number], [number, number]]>) {
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('stroke', '#777');
        poly.setAttribute('fill', '#555');
        poly.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {
            return `${cX + sX},${cY + sY}`;
        }).join(' '));
        this.artboard.svg.appendChild(poly);
    }

    renderTools(points: Array<[[number, number], [number, number]]>): SVGSVGElement {
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
        return svg;
    }

}
