import { Figure } from "./figure.model";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";
import { Dragger } from "../services/dragger/dragger.interface";
import { UserEventManager } from "../services/user-event/user-event-manager";
import { ArtboardMove } from "../services/artboard/artboard-move";
import { Zoom } from "../services/zoom/zoom";
import { CancelListener } from "../listeners/cancel.listener";
import { Guides } from "../services/guides/guides";
import { CancelKeys } from "../../../shared/pipes/cancel.pipe";
import { PathPoints } from "../services/path/path-points";
import { PointConcerns, PointSharedConcerns } from "./models/point-concerns.model";
import { Coorinator } from "../services/coordinator/coordinator";
import { Hud } from "../services/hud/hud";
import { Appearance } from "../services/appearance/appearance";


export class PathFigure implements Figure<SVGPathElement> {

    stroke = 'white';
    fill = 'none';

    strokeTemp = '#666';
    fillTemp = 'none';

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    constructor(
        public readonly drag: Dragger,
        private artboard: Artboard,
        private artboardMove: ArtboardMove,
        private zoom: Zoom,
        private cancelListener: CancelListener,
        private userEventMan: UserEventManager,
        private guides: Guides,
        private pathPoints: PathPoints,
        private coords: Coorinator,
        private hud: Hud,
        private appearance: Appearance,
    ) {}

    /**
     * //
     */
    testByElement(element: any): element is SVGPathElement {
        return element instanceof SVGPathElement;
    }

    /**
     * //
     */
    @setState
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        this.artboard.box.classList.add('interactive-points');
        let destroyTempRenderFn: Function | null = null;
        this.userEventMan.mode = 'interactive';
        const { svg } = this.artboard;
        const aX = parseFloat( svg.getAttribute('width')! );
        const aY = parseFloat( svg.getAttribute('height')! );
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const { left: artboardMarginLeft, top: artboardMarginTop } = this.artboardMove;
        const { value: zoom } = this.zoom;
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMarginLeft, artboardMarginTop],
                board: [aX, aY],
                zoom,
            };
            points.push(point);
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
            }
            destroyTempRenderFn = this.renderTemp(
                points,
                {
                    scroll: [scrollLeft, scrollTop],
                    margin: [artboardMarginLeft, artboardMarginTop],
                    board: [aX, aY],
                    zoom,
                },
            );
        };
        const subpointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            points[points.length - 1].client2 = [clientX, clientY];
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
            }
            destroyTempRenderFn = this.renderTemp(
                points,
                {
                    scroll: [scrollLeft, scrollTop],
                    margin: [artboardMarginLeft, artboardMarginTop],
                    board: [aX, aY],
                    zoom,
                },
            );
        };
        const pointsListenerEvent = 'mousedown';
        const subpointsListenerEvent = 'mouseup';
        window.addEventListener(pointsListenerEvent, pointsListener);
        window.addEventListener(subpointsListenerEvent, subpointsListener);
        this.hud.hintOutlet.hint = `Press 'esc' to finish with open path and 'enter' to finish with closed path`;
        const stop = (key: CancelKeys) => {
            this.hud.hintOutlet.hint = null;
            window.removeEventListener(pointsListenerEvent, pointsListener);
            window.removeEventListener(subpointsListenerEvent, subpointsListener);
            this.cancelListener.keyEvent.off(stop);
            this.artboard.box.classList.remove('interactive-points');
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
                destroyTempRenderFn = null;
            }
            this.userEventMan.mode = 'pick';
            this.renderFinal(points, key === 'enter');
        };
        this.cancelListener.keyEvent.on(stop);
    }

    renderTemp(pointsConcerns: PointConcerns[], pointSharedConcerns: PointSharedConcerns): Function {
        const parent = this.guides.guidesContainer!;
        const attributes: {[K: string]: string} = {
            stroke: this.strokeTemp,
            fill: this.fillTemp,
            'stroke-dasharray': '1',
        };
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
        const points = [...pointsConcerns];
        const dAttr = this.renderPointsC(points, false);
        element.setAttribute('d', dAttr);
        const circles = points.map(point => {
            const [cx, cy] = this.coords.renderPointConcerns(point, false);
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            el.setAttribute('cx', `${cx}`);
            el.setAttribute('cy', `${cy}`);
            el.setAttribute('fill', 'none');
            el.setAttribute('stroke', `${this.strokeTemp}`);
            el.setAttribute('stroke-dasharray', '1');
            el.setAttribute('r', '3');
            this.guides.guidesContainer!.appendChild(el);
            return el;
        });
        const edge = points[points.length - 1];
        const { scroll, margin, board, zoom } = pointSharedConcerns;
        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const clientPoint: [number, number] = [clientX, clientY];
            const [x, y] = this.coords.render2d(clientPoint, scroll, margin, board, zoom, false);
            if (edge.client2) {
                const newPoint = `L ${ x } ${ y }`;
                element.setAttribute('d', `${ dAttr } ${ newPoint }`);
            } else {
                const commandIndex = dAttr.lastIndexOf('C');
                const d = dAttr.slice(0, commandIndex);
                const remainCoords = dAttr.slice(commandIndex + 1).trim();
                const [ , , [px, py]] = remainCoords.split(',').map(pair => pair.trim().split(' ').map(s => s.trim()));
                const prev = points[points.length - 2];
                const [x1, y1] = this.coords.render2d(prev.client, scroll, margin, board, zoom, false);
                const tempC = `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ px } ${ py }`;
                element.setAttribute('d', `${ d } ${ tempC }`);
            }
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            this.guides.guidesContainer!.removeChild(element);
            circles.forEach(circle => this.guides!.guidesContainer!.removeChild(circle));
        };
    }

    /**
     * //
     */
    renderFinal(pointsConcerns: PointConcerns[], closed: boolean) {
        const parent = this.artboard.svg;
        const attributes: {[K: string]: string} = {
            stroke: this.appearance.stroke,
            fill: this.appearance.fill,
        };
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
        const dAbs = this.renderPointsC(pointsConcerns, true);
        const dRel = this.pathPoints.setPointsRelative(dAbs + (closed ? ' Z' : ''));
        element.setAttribute('d', dRel);
    }

    renderPointsS(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = this.coords.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0 || !client2 || client2.every((i, k) => i === client[k])) {
                return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
            } else {
                const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, useZoom);
                return `S ${ x2 } ${ y2 }, ${ x } ${ y }`;
            }
        }).join(' ');
    }

    renderPointsC(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = this.coords.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0) {
                return `M ${ x } ${ y }`;
            } else {
                const prev = pointsConcerns[index - 1];
                const [x1, y1] = this.coords.render2d(prev.client, prev.scroll, prev.margin, prev.board, prev.zoom, useZoom);
                if (!client2) {
                    return `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ x } ${ y }`;
                } else {
                    const [x2, y2] = this.coords.render2d(client2, scroll, margin, board, zoom, useZoom);
                    return `C ${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x } ${ y }`;
                }
            }
        }).join(' ');
    }

    /**
     * //
     */
    edit(element: SVGPathElement) {
        let d = element.getAttribute('d');
        if (d) {
            this.hud.hintOutlet.hint = `Press 'esc' or 'enter' to finish editing`;

            const newD = this.pathPoints.setPointsAbsolute(d);
            element.setAttribute('d', newD);

            this.userEventMan.mode = 'interactive';
            this.guides.removeSelection();
            
            const pseudoEls = Array<SVGElement>();
            
            const draw = () => {
                d = element.getAttribute('d')!;
                const points = this.pathPoints.parseStr(d);
                const allDims = this.pathPoints.getAllAbsCoords(points);
                allDims.forEach((point, pointIndex$, $points) => {
                    point.forEach((pair, pairIndex, $pairs) => {
                        let [ cx, cy ] = pair;
                        const isPoint = pairIndex === (point.length - 1);
                        const selfControl = isPoint ? false : (pairIndex === $pairs.length - 2);
                        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        this.guides.guidesContainer!.appendChild(circle);
                        circle.setAttribute('fill', isPoint ? 'none' : 'red');
                        circle.setAttribute('stroke', isPoint ? '#666' : 'red');
                        circle.setAttribute('stroke-dasharray', '1');
                        circle.setAttribute('cx', `${ cx * this.zoom.value }`);
                        circle.setAttribute('cy', `${ cy * this.zoom.value }`);
                        circle.setAttribute('r', isPoint ? '10' : '3');
                        circle.style.pointerEvents = 'fill';
                        circle.setAttribute('data-type', `${ isPoint ? 'point' : 'control' }`);
                        pseudoEls.push(circle);

                        let d0 = element.getAttribute('d')!;
                        let x = 0;
                        let y = 0;
                        let curCx = cx;
                        let curCy = cy;
                        let rcx = cx;
                        let rcy = cy;
                        const onMouseMove = (event: MouseEvent) => {
                            const {
                                clientX,
                                clientY,
                                altKey,
                            } = event;
                            const dx = (clientX - x) / this.zoom.value;
                            const dy = (clientY - y) / this.zoom.value;
                            curCx = rcx + dx;
                            curCy = rcy + dy;
                            circle.setAttribute('cx', `${ curCx * this.zoom.value }`);
                            circle.setAttribute('cy', `${ curCy * this.zoom.value }`);
                            const points = this.pathPoints.parseStr(d0)
                            .map(([command, coords], pointIndex) => {
                                if (pointIndex !== pointIndex$) {
                                    return `${ command } ${ coords }`;
                                } else {
                                    let newCoords = coords.split(this.pathPoints.delimeter).map(c => parseFloat(c));
                                    if (!isPoint) {
                                        if (selfControl) {
                                            newCoords[newCoords.length - 4] += dx;
                                            newCoords[newCoords.length - 3] += dy;
                                        } else {
                                            newCoords[newCoords.length - 6] += dx;
                                            newCoords[newCoords.length - 5] += dy;
                                        }
                                    } else {
                                        if (altKey) {
                                            newCoords = newCoords.map((c, ci) => c + [dx, dy][ci % 2]);
                                        } else {
                                            newCoords[newCoords.length - 2] += dx;
                                            newCoords[newCoords.length - 1] += dy;
                                        }
                                    }
                                    return `${ command } ${ newCoords.join(' ') }`;
                                }
                            })
                            .join(' ');
                            element.setAttribute('d', points);
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
                            d0 = element.getAttribute('d')!;
                        };
                        circle.addEventListener('mousedown', onMouseDown);
                        if (!isPoint) {
                            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                            line.setAttribute('stroke', 'red');
                            line.setAttribute('stroke-dasharray', '1');
                            const $prevPairs = $points[pointIndex$ - 1];
                            const $pair = (pairIndex === $pairs.length - 2) ? $pairs[$pairs.length - 1] : $prevPairs[$prevPairs.length -1];
                            const [ $x, $y ] = $pair;
                            line.setAttribute('x1', `${ cx * this.zoom.value }`);
                            line.setAttribute('y1', `${ cy * this.zoom.value }`);
                            line.setAttribute('x2', `${ $x * this.zoom.value }`);
                            line.setAttribute('y2', `${ $y * this.zoom.value }`);
                            this.guides.guidesContainer!.appendChild(line);
                            pseudoEls.push(line);
                        }
                    });
                });
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

}
