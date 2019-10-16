import { CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { artboard } from "@/webview/services/artboard";
import { findMethodIterator } from "@/common/iterators";
import { artboardMove } from "@/webview/services/artboard-move";

import { PointConcerns } from "@/webview/models/point-concerns.model";
import { draggerPoints } from "@/webview/draggers";
import { moverPoints } from "@/webview/movers";
import { userEventMan } from "@/webview/services/user-event";
import { cancelListener } from "@/webview/listeners";
import { zoom } from "@/webview/services/zoom";
import { appearance } from "@/webview/services/appearance";
import { hints } from "@/webview/services/hints";
import { guides } from "@/webview/services/guides";
import { Figure } from "@/webview/models/figure.model";
import { setState } from "@/webview/decorators/set-state.decorator";


export abstract class PolyFigure implements Figure<SVGElement> {

    abstract readonly name: string;
    abstract readonly ctor = SVGElement;

    abstract stroke: string;
    abstract fill: string;
    public readonly drag = draggerPoints;
    public readonly move = moverPoints;

    abstract testByElement(element: any): element is SVGElement;

    @setState
    create(_elementName: string, _attributest: {[K: string]: string}) {
        // let points = Array<[[number, number], [number, number]]>();
        let cpoints = Array<PointConcerns>();
        artboard.box.classList.add('interactive-points');
        let toolsSvgRemover: null | (() => void) = null;
        userEventMan.mode = 'interactive';
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
                margin: [artboardMove.left, artboardMove.top],
                board: [artboard.width, artboard.height],
                zoom: zoom.value,
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
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
        const stop = (_key: CancelKeys) => {
            window.removeEventListener('click', pointsListener);
            // cancelListener.keyEvent.off(stop);
            cancelEvents.return! ();
            artboard.box.classList.remove('interactive-points');
            if (toolsSvgRemover instanceof Function) {
                toolsSvgRemover();
                toolsSvgRemover = null;
            }
            userEventMan.mode = 'pick';
            this.render(cpoints);
        };
        // cancelListener.keyEvent.on(stop);
        (async () => {
            for await (const key of cancelEvents) {
                stop(key);
            }
        })();
    }

    render(points: Array<PointConcerns>) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        element.setAttribute('stroke', appearance.stroke);
        element.setAttribute('fill', appearance.fill);
        // element.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {
        //     return `${(cX + sX) / zoom.value},${(cY + sY) / zoom.value}`;
        // }).join(' '));
        element.setAttribute('points', points.map(({ client, scroll, margin, board, zoom }) => {
            const [x, y] = [0, 1].map(dim => {
                return (client[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2) / zoom;
            });
            return `${ x },${ y }`;
        }).join(' '));
        artboard.svg.appendChild(element);
    }

    renderTools(points: Array<PointConcerns>) {
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const artboardBox = artboard.svg.getBoundingClientRect();
        const artboardWidth = parseInt(artboard.svg.getAttribute('width')!);
        const artboardHeight = parseInt(artboard.svg.getAttribute('height')!);
        svg.setAttribute('width', String(zoom.value * artboardWidth));
        svg.setAttribute('height', String(zoom.value * artboardHeight));
        Object.assign(svg.style, {
            position: 'absolute',
            top: artboardBox.top + scrollTop + 'px',
            left: artboardBox.left + scrollLeft + 'px',
        });
        artboard.tools.appendChild(svg);
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
            artboard.tools.removeChild(svg);
        };
    }

    edit(element: SVGElement) {
        let points = element.getAttribute('points');
        hints.setHint('finishEdit');
        // userEventMan.mode = 'interactive';
        guides.removeSelection();
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
                guides.guidesContainer!.appendChild(circle);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-dasharray', '1');
                circle.setAttribute('cx', `${ cx * zoom.value }`);
                circle.setAttribute('cy', `${ cy * zoom.value }`);
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
                    event.stopPropagation();
                    const { clientX, clientY} = event;
                    const dx = (clientX - x) / zoom.value;
                    const dy = (clientY - y) / zoom.value;
                    curCx = rcx + dx;
                    curCy = rcy + dy;
                    circle.setAttribute('cx', `${ curCx * zoom.value }`);
                    circle.setAttribute('cy', `${ curCy * zoom.value }`);
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
                const onMouseUp = (event: MouseEvent) => {
                    event.stopPropagation();
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    redraw();
                };
                const onMouseDown = (event: MouseEvent) => {
                    event.stopPropagation();
                    guides.removeSelection();
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
            pseudoEls.forEach(circle => guides.guidesContainer!.removeChild(circle));
            pseudoEls.length = 0;
        };

        const redraw = () => {
            undraw();
            draw();
        };

        draw();

        // zoom.valueChange.on(redraw);

        const elementOnMouseMove = (_event: MouseEvent) => {
            redraw();
        };
        element.addEventListener('mousemove', elementOnMouseMove);

        const cancel = () => {
            // userEventMan.mode = 'pick';
            // guides.drawSelection([element]);
            undraw();
            // zoom.valueChange.off(redraw);
            // cancelListener.keyEvent.off(cancel);
            element.removeEventListener('mousemove', elementOnMouseMove);
        };

        // cancelListener.keyEvent.on(cancel);
        return cancel;
    }

}
