import { BaseCreateOperator } from "./base.create-operator";
import { artboard, guides, artboardMove, zoom } from "@/web/init";
import { appearance } from "../services/appearance";
import { spawner } from "@/dom/spawner";
import { findMethodIterator } from "@/common/iterators";
import { cancelListener } from "../listeners";
import { fromDomEvent } from "@/dom/iterators";
import { PointConcerns } from "../models/point-concerns.model";
import { coordinator } from "@/webview/services/coordinator";


export class TextCreateOperator extends BaseCreateOperator {

    makeElement() {
        return new Promise<SVGElement>(resolve => {
            artboard.box.style.cursor = 'crosshair';
            const clicks: AsyncIterableIterator<MouseEvent> = fromDomEvent(artboard.svg, 'click');
            (async () => {
                for await (const clickEvent of clicks) {
                    artboard.box.style.cursor = 'default';
                    clicks.return!();
                    let {
                        clientX: clickX,
                        clientY: clickY,
                    } = clickEvent;
                    const { scrollLeft, scrollTop } = document.scrollingElement!;
                    const point: PointConcerns = {
                        client: [clickX, clickY],
                        scroll: [scrollLeft, scrollTop],
                        margin: [artboardMove.left, artboardMove.top],
                        board: [artboard.width, artboard.height],
                        zoom: zoom.value,
                    };
                    const [ x1, y1 ] = coordinator.renderPointConcerns(point, false);
                    const host = guides.div;
                    const editableDiv = spawner.html.div({
                        'contenteditable': 'true'
                    }, {
                        'position': 'absolute',
                        'left': `${ x1 }px`,
                        'top': `${ y1 }px`,
                        'z-index': '2',
                        'pointer-events': 'all',
                        'outline': '1px dotted #777',
                        'font-size': `${ appearance.textFontSize * zoom.value }px`,
                        'font-family': 'sans-serif',
                        'color': appearance.fill,
                        'word-break': 'keep-all',
                    });
                    host.appendChild(editableDiv);
                    editableDiv.innerText = 'Text';
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(editableDiv);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    const downEvents: AsyncIterableIterator<MouseEvent> = fromDomEvent(editableDiv, 'mousedown');
                    const returnables = new Set<AsyncIterableIterator<MouseEvent>>();
                    returnables.add(downEvents);
                    let moveEvents: AsyncIterableIterator<MouseEvent> | null = null;
                    let upEvents: AsyncIterableIterator<MouseEvent> | null = null;
                    (async () => {
                        for await (const downEvent of downEvents) {
                            downEvent.stopPropagation();
                            let {
                                clientX: startX,
                                clientY: startY,
                            } = downEvent;
                            moveEvents = fromDomEvent(window, 'mousemove');
                            returnables.add(moveEvents);
                            (async () => {
                                for await (const moveEvent of moveEvents) {
                                    const {
                                        clientX: moveX,
                                        clientY: moveY,
                                    } = moveEvent;
                                    const deltaX = moveX - startX;
                                    const deltaY = moveY - startY;
                                    startX += deltaX;
                                    startY += deltaY;
                                    spawner.html.update(editableDiv, {}, {
                                        left: `${ parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('left'))! + deltaX }`,
                                        top: `${ parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('top'))! + deltaY }`,
                                    });
                                }
                            })();
                            upEvents = fromDomEvent(window, 'mouseup');
                            returnables.add(upEvents);
                            (async () => {
                                for await (const _upEvent of upEvents) {
                                    upEvents.return!();
                                    moveEvents.return!();
                                }
                            })();
                        }
                    })();
                    const cancelEvents = findMethodIterator(cancelListener.eventReceived);
                    (async () => {
                        for await (const _key of cancelEvents) {
                            editableDiv.removeAttribute('contenteditable');
                            editableDiv.style.outline = 'none';
                            cancelEvents.return!();
                            returnables.forEach(r => r.return!());
                            const svg = artboard.svg;
                            let x = parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('left'))!;
                            let y = parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('top'))! + appearance.textFontSize;
                            x *= 1/zoom.value;
                            y *= 1/zoom.value;
                            const element = spawner.svg.element('text', {
                                'x': `${ x }`,
                                'y': `${ y }`,
                                'fill': appearance.fill,
                                'stroke': appearance.stroke,
                                'font-size': `${ appearance.textFontSize }`,
                                'font-family': 'sans-serif',
                            }, {
                                'user-select': 'none',
                            });
                            element.innerHTML = editableDiv.innerText.trim();
                            editableDiv.remove();
                            svg.appendChild(element);
                            resolve(element);
                        }
                    })();
                }
            })();
        });
    }

}
