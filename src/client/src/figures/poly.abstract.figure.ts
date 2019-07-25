import { Figure } from "./figure.model";
import { Dragger } from "../services/dragger/dragger.interface";
import { Artboard } from "../services/artboard/artboard";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { setState } from "../decorators/set-state.decorator";
import { CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { PointConcerns } from "./models/point-concerns.model";
import { Guides } from "../services/guides/guides";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Appearance } from "../services/appearance/appearance";
import { Hud } from "../services/hud/hud";
import { MoverPoints } from "../services/mover/mover-points";


export abstract class PolyFigure implements Figure<SVGElement> {

    abstract readonly name: string;
    abstract readonly ctor = SVGElement;

    abstract stroke: string;
    abstract fill: string;

    constructor(
        public readonly drag: Dragger,
        public readonly move: MoverPoints,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        public zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
        public guides: Guides,
        private appearance: Appearance,
        private hud: Hud,
    ) {}

    abstract testByElement(element: any): element is SVGElement;

    @setState
    create(_elementName: string, _attributest: {[K: string]: string}) {
        // let points = Array<[[number, number], [number, number]]>();
        let cpoints = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let toolsSvgRemover: null | (() => void) = null;
        this.userEventMan.mode = 'interactive';
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY, shiftKey } = event;
            const { scrollLeft, scrollTop } = document.scrollingElement!;
            // const point: [[number, number], [number, number]] = [
            //     [clientX, scrollLeft],
            //     [clientY, scrollTop],
            // ];
            const cpoint: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [this.artboardMove.left, this.artboardMove.top],
                board: [this.artboard.width, this.artboard.height],
                zoom: this.zoom.value,
            };
            if (cpoints.length > 0 && shiftKey) {
                // const [[cx,], [cy,]] = points[points.length - 1];
                const { client: [cx, cy] } = cpoints[cpoints.length - 1];
                const deltax = Math.abs(clientX - cx);
                const deltay = Math.abs(clientY - cy);
                if (deltax < deltay) {
                    cpoint.client[0] = cx;
                } else {
                    cpoint.client[1] = cy;
                }
            }
            cpoints.push(cpoint);
            if (toolsSvgRemover instanceof Function) {
                toolsSvgRemover();
                toolsSvgRemover = null;
            }
            toolsSvgRemover = this.renderTools(cpoints);
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
            this.render(cpoints);
        };
        this.cancelListener.keyEvent.on(stop);
    }

    render(points: Array<PointConcerns>) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', this.appearance.stroke);
        element.setAttribute('fill', this.appearance.fill);
        // element.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {
        //     return `${(cX + sX) / this.zoom.value},${(cY + sY) / this.zoom.value}`;
        // }).join(' '));
        element.setAttribute('points', points.map(({ client, scroll, margin, board, zoom }) => {
            const [x, y] = [0, 1].map(dim => {
                return (client[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2) / zoom;
            });
            return `${ x },${ y }`;
        }).join(' '));
        this.artboard.svg.appendChild(element);
    }

    renderTools(points: Array<PointConcerns>) {
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
        points.forEach(({ client, scroll, margin, board, zoom }, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const [cx, cy] = [0, 1].map(d => {
                return client[d] + scroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
            });
            circle.setAttribute('cx', `${cx}`);
            circle.setAttribute('cy', `${cy}`);
            circle.setAttribute('r', `${3}`);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#777');
            circle.setAttribute('stroke-dasharray', '1');
            svg.appendChild(circle);
            if (index > 0) {
                const {
                    client: pclient,
                    scroll: pscroll,
                    margin: pmargin,
                    board: pboard,
                    zoom: pzoom,
                } = points[index - 1];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const [x1, y1] = [0, 1].map(d => {
                    return pclient[d] + pscroll[d] - pmargin[d] + pboard[d] * (pzoom - 1) / 2;
                });
                const attrs: {[K: string]: string} = {
                    'stroke': '#777',
                    'stroke-dasharray': '1',
                    'x1': `${x1}`,
                    'y1': `${y1}`,
                    'x2': `${cx}`,
                    'y2': `${cy}`,
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
            // const [[cX, sX], [cY, sY]] = points[points.length - 1];
            const {
                client,
                scroll,
                margin,
                board,
                zoom,
            } = points[points.length - 1];
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svg.appendChild(line);
            const [x, y] = [0, 1].map(d => {
                return client[d] + scroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
            });
            const attrs: {[K: string]: string} = {
                'stroke': '#777',
                'stroke-dasharray': '1',
                'x1': `${x}`,
                'y1': `${y}`,
                'x2': `${x}`,
                'y2': `${y}`,
            };
            Object.keys(attrs).forEach(key => {
                const val = attrs[key];
                line.setAttribute(key, val);
            });
            const onMousemove = (event: MouseEvent) => {
                const { clientX, clientY, shiftKey } = event;
                const nclient = [clientX, clientY];
                const { scrollLeft, scrollTop } = document.scrollingElement!;
                const nscroll = [scrollLeft, scrollTop];
                const [x2, y2] = [0, 1].map(d => {
                    return nclient[d] + nscroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
                });
                const points: {[K: string]: string} = {
                    'x2': `${ x2 }`,
                    'y2': `${ y2 }`,
                };
                if (shiftKey) {
                    const absDeltaX = Math.abs(clientX - client[0]);
                    const absDeltaY = Math.abs(clientY - client[1]);
                    if (absDeltaX < absDeltaY) {
                        const x2 = client[0] + scroll[0] - margin[0] + board[0] * (zoom - 1) / 2;
                        points.x2 = `${ x2 }`;
                    } else {
                        const y2 = client[1] + scroll[1] - margin[1] + board[1] * (zoom - 1) / 2;
                        points.y2 = `${ y2 }`;
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

    edit(element: SVGElement) {
        let points = element.getAttribute('points');
        this.hud.hintOutlet.hint = `Press 'esc' or 'enter' to finish editing`;
        this.userEventMan.mode = 'interactive';
        this.guides.removeSelection();
        const pseudoEls = Array<SVGElement>();
        const draw = () => {
            points = element.getAttribute('points')!;
            return points.split(/[,\s]+/).map(c => parseFloat(c))
            .reduce((acc, coord, index) => {
                if (index % 2 === 0) {
                    acc.push([coord, NaN]);
                } else {
                    acc[acc.length - 1][1] = coord;
                }
                return acc;
            }, Array<[number, number]>())
            .map((pair, pairIndex) => {
                const [ cx, cy ] = pair;
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                this.guides.guidesContainer!.appendChild(circle);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-dasharray', '1');
                circle.setAttribute('cx', `${ cx * this.zoom.value }`);
                circle.setAttribute('cy', `${ cy * this.zoom.value }`);
                circle.setAttribute('r', '10');
                circle.style.pointerEvents = 'fill';

                // let d0 = element.getAttribute('d')!;
                let p0 = element.getAttribute('points')!;
                let x = 0;
                let y = 0;
                let curCx = cx;
                let curCy = cy;
                let rcx = cx;
                let rcy = cy;
                const onMouseMove = (event: MouseEvent) => {
                    const { clientX, clientY} = event;
                    const dx = (clientX - x) / this.zoom.value;
                    const dy = (clientY - y) / this.zoom.value;
                    curCx = rcx + dx;
                    curCy = rcy + dy;
                    circle.setAttribute('cx', `${ curCx * this.zoom.value }`);
                    circle.setAttribute('cy', `${ curCy * this.zoom.value }`);
                    const points$ = p0.split(/[,\s]+/).map(c => parseFloat(c))
                    .reduce((acc, coord, index) => {
                        if (index % 2 === 0) {
                            acc.push([coord, NaN]);
                        } else {
                            acc[acc.length - 1][1] = coord;
                        }
                        return acc;
                    }, Array<[number, number]>())
                    .map((pair1, pairIndex1) => {
                        if (pairIndex !== pairIndex1) {
                            return pair1.join(',');
                        } else {
                            const [x, y] = pair;
                            return [
                                x + dx,
                                y + dy,
                            ].join(',');
                        }
                    })
                    .join(' ');
                    element.setAttribute('points', points$);
                    redraw();
                };
                const onMouseUp = (_event: MouseEvent) => {
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    redraw();
                };
                const onMouseDown = (event: MouseEvent) => {
                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                    const {
                        clientX,
                        clientY,
                    } = event;
                    x = clientX;
                    y = clientY;
                    rcx = curCx;
                    rcy = curCy;
                };

                circle.addEventListener('mousedown', onMouseDown);

                return circle;
            })
            .forEach(circle => pseudoEls.push(circle));
        };

        const undraw = () => {
            pseudoEls.forEach(circle => this.guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };

        const redraw = () => {
            undraw();
            draw();
        };

        draw();

        this.zoom.valueChange.on(redraw);

        const cancel = (_key: CancelKeys) => {
            this.hud.hintOutlet.hint = null;
            this.userEventMan.mode = 'pick';
            this.guides.drawSelection([element]);
            undraw();
            this.zoom.valueChange.off(redraw);
            this.cancelListener.keyEvent.off(cancel);
        };

        this.cancelListener.keyEvent.on(cancel);
    }

}
