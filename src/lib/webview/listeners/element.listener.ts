import { spawner } from "@/dom/spawner";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ElementCommand, elementPipe } from "../../../shared/pipes/element.pipe";
import { setState } from "../decorators/set-state.decorator";
import { holder } from "../services/holder";
import { figuresCollection } from "../services/figures-collection";


export class ElementListener {
    private elementReceiver: PipeEndpoint<ElementCommand, {}, 'element'>;

    constructor(
    ) {
        this.elementReceiver = webviewEndpoint.createFromPipe(elementPipe);
    }

    listen() {
        this.elementReceiver.listenSetRequest(
            _request => holder.elements,
            (command, elements) => {
                elements.forEach(element => {
                    this.applyCommand(command, element);
                });
            },
        );
    }

    applyCommand(command: ElementCommand, element: SVGElement) {
        switch (command) {
            case 'delete':
                this.deleteElement(element);
                break;
            case 'copy':
                this.copyElement(element);
                break;
            case 'copy-in-place':
                this.copyInPlaceElement(element);
                break;
        }
    }

    @makeMethodIterator()
    @setState
    deleteElement(element: SVGElement) {
        element.remove();
        holder.elements = [];
    }

    @setState
    copyElement(element: SVGElement) {
        const newEl = this.copyInPlaceElement(element);
        const delegate = figuresCollection.delegate(newEl);
        if (delegate && delegate.move) {
            delegate.move.by(newEl, {x: 20, y: 20});
        }
        return newEl;
    }

    @makeMethodIterator()
    @setState
    copyInPlaceElement(element: SVGElement) {
        const elHtml = element.outerHTML;
        const g = spawner.svg.create('g');
        g.innerHTML = elHtml;
        const copy = g.children[0] as SVGElement;
        element.insertAdjacentElement('afterend', copy);
        holder.elements = [copy];
        g.remove();
        copy.removeAttribute('id');
        return copy;
    }


}