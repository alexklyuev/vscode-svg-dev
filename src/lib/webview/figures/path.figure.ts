import { CancelKeys } from "../../shared/pipes/cancel.pipe";

import { findMethodIterator } from "@/common/iterators";
import { PointConcerns, PointSharedConcerns } from "@/webview/models/point-concerns.model";
import { draggerPath } from "@/webview/draggers";
import { moverPath } from "@/webview/movers";
import { artboard } from "@/webview/services/artboard";
import { userEventMan } from "@/webview/services/user-event";
import { hints } from "@/webview/services/hints";
import { cancelListener } from "@/webview/listeners";
import { guides } from "@/webview/services/guides";
import { coordinator } from "@/webview/services/coordinator";
import { appearance } from "@/webview/services/appearance";
import { pathPoints } from "@/webview/services/path";
import { zoom } from "@/webview/services/zoom";
import { artboardMove } from "@/webview/services/artboard-move";
import { Sprite } from "@/webview/models/sprite.model";
import { setState } from "@/webview/decorators/set-state.decorator";
import { pathPointsEditor } from "../points-editor";
import { BaseBoxEditor } from "../box-editor/base.box-editor";


export class PathFigure implements Sprite<SVGPathElement> {

    stroke = 'white';
    fill = 'none';

    strokeTemp = '#666';
    fillTemp = 'none';

    readonly name = 'path';

    readonly ctor = SVGPathElement;

    public readonly drag = draggerPath;
    public readonly move = moverPath;

    /**
     * //
     */
    testByElement(element: any): element is SVGPathElement {
        return element instanceof SVGPathElement;
    }

    /**
     * //
     */
    create(_elementName: string, _attributes: {[K: string]: string}): void {
        const points = Array<PointConcerns>();
        artboard.box.classList.add('interactive-points');
        let destroyTempRenderFn: Function | null = null;
        userEventMan.mode = 'interactive';
        const { svg } = artboard;
        const aX = parseFloat( svg.getAttribute('width')! );
        const aY = parseFloat( svg.getAttribute('height')! );
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const { left: artboardMarginLeft, top: artboardMarginTop } = artboardMove;
        const { value: zoomValue } = zoom;
        const pointsListener = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const point: PointConcerns = {
                client: [clientX, clientY],
                scroll: [scrollLeft, scrollTop],
                margin: [artboardMarginLeft, artboardMarginTop],
                board: [aX, aY],
                zoom: zoomValue,
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
                    zoom: zoomValue,
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
                    zoom: zoomValue,
                },
            );
        };
        const pointsListenerEvent = 'mousedown';
        const subpointsListenerEvent = 'mouseup';
        window.addEventListener(pointsListenerEvent, pointsListener);
        window.addEventListener(subpointsListenerEvent, subpointsListener);
        hints.setHint('finishCreate');
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
        const stop = (key: CancelKeys) => {
            window.removeEventListener(pointsListenerEvent, pointsListener);
            window.removeEventListener(subpointsListenerEvent, subpointsListener);
            // cancelListener.keyEvent.off(stop);
            cancelEvents.return! ();
            artboard.box.classList.remove('interactive-points');
            if (destroyTempRenderFn instanceof Function) {
                destroyTempRenderFn();
                destroyTempRenderFn = null;
            }
            userEventMan.mode = 'pick';
            this.renderFinal(points, key === 'enter');
        };
        // cancelListener.keyEvent.on(stop);
        (async () => {
            for await (const key of cancelEvents) {
                stop(key);
            }
        })();
    }

    renderTemp(pointsConcerns: PointConcerns[], pointSharedConcerns: PointSharedConcerns): Function {
        const parent = guides.guidesContainer!;
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
            const [cx, cy] = coordinator.renderPointConcerns(point, false);
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            el.setAttribute('cx', `${cx}`);
            el.setAttribute('cy', `${cy}`);
            el.setAttribute('fill', 'none');
            el.setAttribute('stroke', `${this.strokeTemp}`);
            el.setAttribute('stroke-dasharray', '1');
            el.setAttribute('r', '3');
            guides.guidesContainer!.appendChild(el);
            return el;
        });
        const edge = points[points.length - 1];
        const { scroll, margin, board, zoom } = pointSharedConcerns;
        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const clientPoint: [number, number] = [clientX, clientY];
            const [x, y] = coordinator.render2d(clientPoint, scroll, margin, board, zoom, false);
            if (edge.client2) {
                const newPoint = `L ${ x } ${ y }`;
                element.setAttribute('d', `${ dAttr } ${ newPoint }`);
            } else {
                const commandIndex = dAttr.lastIndexOf('C');
                const d = dAttr.slice(0, commandIndex);
                const remainCoords = dAttr.slice(commandIndex + 1).trim();
                const [ , , [px, py]] = remainCoords.split(',').map(pair => pair.trim().split(' ').map(s => s.trim()));
                const prev = points[points.length - 2];
                const [x1, y1] = coordinator.render2d(prev.client, scroll, margin, board, zoom, false);
                const tempC = `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ px } ${ py }`;
                element.setAttribute('d', `${ d } ${ tempC }`);
            }
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            guides.guidesContainer!.removeChild(element);
            circles.forEach(circle => guides!.guidesContainer!.removeChild(circle));
        };
    }

    /**
     * //
     */
    @setState
    renderFinal(pointsConcerns: PointConcerns[], closed: boolean) {
        const parent = artboard.svg;
        const attributes: {[K: string]: string} = {
            stroke: appearance.stroke,
            fill: appearance.fill,
        };
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
        parent.appendChild(element);
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
        const dAbs = this.renderPointsC(pointsConcerns, true);
        const dRel = pathPoints.setPointsRelative(dAbs + (closed ? ' Z' : ''));
        element.setAttribute('d', dRel);
    }

    renderPointsS(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = coordinator.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0 || !client2 || client2.every((i, k) => i === client[k])) {
                return `${ index === 0 ? 'M' : 'L' } ${ x } ${ y }`;
            } else {
                const [x2, y2] = coordinator.render2d(client2, scroll, margin, board, zoom, useZoom);
                return `S ${ x2 } ${ y2 }, ${ x } ${ y }`;
            }
        }).join(' ');
    }

    renderPointsC(pointsConcerns: PointConcerns[], useZoom: boolean): string {
        return pointsConcerns.map(({ client, scroll, margin, board, zoom, client2 }, index) => {
            const [x, y] = coordinator.render2d(client, scroll, margin, board, zoom, useZoom);
            if (index === 0) {
                return `M ${ x } ${ y }`;
            } else {
                const prev = pointsConcerns[index - 1];
                const [x1, y1] = coordinator.render2d(prev.client, prev.scroll, prev.margin, prev.board, prev.zoom, useZoom);
                if (!client2) {
                    return `C ${ x1 } ${ y1 }, ${ x } ${ y }, ${ x } ${ y }`;
                } else {
                    const [x2, y2] = coordinator.render2d(client2, scroll, margin, board, zoom, useZoom);
                    return `C ${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x } ${ y }`;
                }
            }
        }).join(' ');
    }

    edit(element: SVGPathElement) {
        hints.setHint('finishEdit');
        return pathPointsEditor.edit(element);
    }

    editBox(element: SVGPathElement) {
        return new BaseBoxEditor() .editBox(element);
    }

}
