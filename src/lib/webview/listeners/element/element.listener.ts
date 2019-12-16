import { PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { webviewEndpoint } from "&resolve/webview-endpoint";

import { ElementCommand, elementPipe } from "@/shared/pipes/element.pipe";
import { setState } from "&resolve/decorators/set-state.decorator";
import { holder } from "@/webview/services/holder";
import { sprites } from "@/webview/services/sprites";
import { Listener } from "@/webview/models/listener.model";


export class ElementListener implements Listener {
    private elementReceiver: PipeEndpoint<ElementCommand, {}, 'element'>;

    constructor(
    ) {
        this.elementReceiver = webviewEndpoint.createFromPipe(elementPipe);
    }

    listen() {
        this.elementReceiver.listenSetRequest(
            _request => holder.elements,
            (command, elements) => {
                this.applyCommand(command, elements);
            },
        );
    }

    @setState
    applyCommand(command: ElementCommand, elements: SVGElement[]) {
        switch (command) {
            case 'delete':
                this.deleteElement(elements);
                break;
            case 'copy':
                this.copyMoveElements(elements);
                break;
            case 'copy-in-place':
                this.copyInPlaceElements(elements);
                break;
        }
    }

    @makeMethodIterator()
    @setState
    deleteElement(elements: SVGElement[]) {
        // elements.remove();
        elements.forEach(el => el.remove());
        holder.elements = [];
    }

    @setState
    copyMoveElements(elements: SVGElement[]) {
        const newEls = elements
        .map(element => {
            const newEl = this.copyOneElement(element);
            if (newEl) {
                const delegate = sprites.resolve(newEl);
                if (delegate) {
                    const { moveOperator } = delegate.operators;
                    if (moveOperator) {
                        moveOperator.by(newEl, {x: 20, y: 20});
                    }
                }
            }
            return newEl;
        })
        .filter(el => el) as SVGElement[];
        holder.elements = newEls;
        return newEls;
    }

    @setState
    copyInPlaceElements(elements: SVGElement[]) {
        const newEls = elements
        .map(element => {
            const newEl = this.copyOneElement(element);
            return newEl;
        })
        .filter(el => el) as SVGElement[];
        holder.elements = newEls;
        return newEls;
    }

    @makeMethodIterator()
    @setState
    copyOneElement(element: SVGElement) {
        const sprite = sprites.resolve(element);
        if (sprite) {
            const { copyOperator } = sprite.operators;
            if (copyOperator) {
                const copy = copyOperator.copy(element);
                return copy;
            }
        }
    }


}