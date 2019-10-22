import { spawner } from "@/dom/spawner";
import { guides } from "../services/guides";
import { artboardMove } from "../services/artboard-move";
import { artboard } from "../services/artboard";
import { zoom } from "../services/zoom";
import { findMethodIterator } from "@/common/iterators";
import { fromDomEvent } from "@/dom/iterators";


export class BaseBoxEditor {

    controlPointWidth = 10;
    controlPointHeight = 10;

    editBox(element: SVGRectElement) {
        const controls = Array(8).fill(null)
        .map(() => {
            const control = spawner.svg.rect({
                width: `${ this.controlPointWidth }`,
                height: `${ this.controlPointHeight }`,
                fill: 'blue',
            }, {
                pointerEvents: 'fill',
            });
            guides.guidesContainer! .appendChild(control);
            return control;
        });
        this.updateControls(element, controls);
        const zoomIter = findMethodIterator(zoom.update);
        (async () => {
            for await (const _value of zoomIter) {
                this.updateControls(element, controls);
            }
        })();
        let mouseMoveIter: AsyncIterableIterator<MouseEvent>;
        let mouseUpIter: AsyncIterableIterator<MouseEvent>;
        const mouseDownIter = fromDomEvent(element, 'mousedown');
        (async () => {
            for await (const _downEvent of mouseDownIter) {
                const listeningTarget = artboard.svg;
                mouseMoveIter = fromDomEvent(listeningTarget, 'mousemove');
                mouseUpIter = fromDomEvent(listeningTarget, 'mouseup');
                (async () => {
                    for await (const _moveEvent of mouseMoveIter) {
                        this.updateControls(element, controls);
                    }
                })();
                (async () => {
                    for await (const _upEvent of mouseUpIter) {
                        mouseUpIter.return! ();
                        mouseMoveIter.return! ();
                        this.updateControls(element, controls);
                    }
                })();
            }
        })();
        return () => {
            controls.forEach(control => control.remove());
            [
                zoomIter,
                mouseDownIter,
                mouseMoveIter,
                mouseUpIter,
            ]
            .filter(iter => iter)
            .forEach(iter => iter.return!());
        }; 
    }

    updateControls(element: SVGElement, controls: SVGElement[]) {
        const points = this.getPoints(element);
        controls.forEach((control, index) => {
            const point = points[index];
            const [ x, y ] = this.render2d(point);
            spawner.svg.update(control, {
                x: `${ x  - this.controlPointWidth/2 }`,
                y: `${ y  - this.controlPointHeight/2 }`,
            });
        });
    }

    getPoints(element: SVGElement) {
        const clientRect: ClientRect = element.getBoundingClientRect();
        const {
            top,
            left,
            bottom,
            right,
            width,
            height
        } = clientRect;
        const points = Array<[number, number]>(
            [left, top],
            [left + width/2, top],
            [right, top],
            [right, top + height/2],
            [right, bottom],
            [left + width/2, bottom],
            [left, bottom],
            [left, top + height/2],
        );
        return points;
    }

    render2d([x, y]: [number, number]) {
        const { value: zoomValue } = zoom;
        const { scrollLeft, scrollTop } = document.scrollingElement!;
        const {
            top: marginTop,
            left: marginLeft,
        } = artboardMove;
        const {
            width: artboardWidth,
            height: artboardHeight,
        } = artboard;
        return [
            this.render1d(x, scrollLeft, marginLeft, artboardWidth, zoomValue),
            this.render1d(y, scrollTop, marginTop, artboardHeight, zoomValue),
        ];
    }

    render1d(
        dval: number,
        scroll: number,
        margin: number,
        board: number,
        zoomK: number,
    ) {
        return dval + scroll - margin + board * (zoomK - 1) / 2;
    }

}
