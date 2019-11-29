import { BaseCreateOperator } from "./base.create-operator";
import { artboard, guides, artboardMove } from "@/web/init";
import { appearance } from "../services/appearance";
import { spawner } from "@/dom/spawner";
import { findMethodIterator } from "@/common/iterators";
import { cancelListener } from "../listeners";
import { fromDomEvent } from "@/dom/iterators";


export class TextCreateOperator extends BaseCreateOperator {

    private fontSize = 32;

    makeElement() {
        return new Promise<SVGElement>(resolve => {
            artboard.svg.style.cursor = 'crosshair';
            const clicks: AsyncIterableIterator<MouseEvent> = fromDomEvent(artboard.svg, 'click');
            (async () => {
                for await (const clickEvent of clicks) {
                    artboard.svg.style.cursor = 'default';
                    clicks.return!();
                    let {
                        clientX: clickX,
                        clientY: clickY,
                    } = clickEvent;
                    clickX -= artboardMove.left;
                    clickY -= artboardMove.top;
                    const host = guides.div;
                    const editableDiv = spawner.html.div({
                        'contenteditable': 'true'
                    }, {
                        'position': 'absolute',
                        'left': `${ clickX }px`,
                        'top': `${ clickY }px`,
                        'z-index': '2',
                        'pointer-events': 'all',
                        'outline': '1px dotted #777',
                        'font-size': `${ this.fontSize }px`,
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
                            const x = parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('left'))!;
                            const y = parseFloat(window.getComputedStyle(editableDiv).getPropertyValue('top'))! + this.fontSize;
                            const element = spawner.svg.element('text', {
                                'x': `${ x }`,
                                'y': `${ y * .98 }`,
                                'fill': appearance.fill,
                                'stroke': appearance.stroke,
                                'font-size': `${ this.fontSize }`,
                                'font-family': 'sans-serif',
                            }, {
                                'user-select': 'none',
                            });
                            element.innerHTML = editableDiv.innerText;
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
