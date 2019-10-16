import { spawn } from "@/dom/spawner";
import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { makeMethodIterator } from "@/common/iterators";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ElementCommand } from "../../../shared/pipes/element.pipe";
import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";
import { FiguresCollection } from "../figures/figures-collection";


export class ElementListener {
    private elementReceiver: PipeEndpoint<ElementCommand, {}, 'element'>;

    constructor(
        private elementPipe: Pipe<ElementCommand, {}, 'element'>,
        private holder: ElementHolder,
        private figuresCollection: FiguresCollection,
    ) {
        this.elementReceiver = webviewEndpoint.createFromPipe(this.elementPipe);
    }

    listen() {
        this.elementReceiver.listenSetRequest(
            _request => this.holder.elements,
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
        this.holder.elements = [];
    }

    @setState
    copyElement(element: SVGElement) {
        const newEl = this.copyInPlaceElement(element);
        const delegate = this.figuresCollection.delegate(newEl);
        if (delegate && delegate.move) {
            delegate.move.by(newEl, {x: 20, y: 20});
        }
        return newEl;
    }

    @makeMethodIterator()
    @setState
    copyInPlaceElement(element: SVGElement) {
        const elHtml = element.outerHTML;
        const g = spawn.svg.create('g');
        g.innerHTML = elHtml;
        const copy = g.children[0] as SVGElement;
        element.insertAdjacentElement('afterend', copy);
        this.holder.elements = [copy];
        g.remove();
        copy.removeAttribute('id');
        return copy;
    }


}