import { PipeEndpoint, Pipe } from "../../../shared/services/pipe/pipe";
import { ElementCommand } from "../../../shared/pipes/element.pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";
import { FiguresCollection } from "../figures/figures-collection";
import { connectEvent, ClientEvent } from "../entities/client-event";


export class ElementListener {
    private elementReceiver: PipeEndpoint<ElementCommand, {}, 'element'>;

    public readonly copyElementEvent = new ClientEvent<SVGElement>();

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private elementPipe: Pipe<ElementCommand, {}, 'element'>,
        private holder: ElementHolder,
        private figuresCollection: FiguresCollection,
    ) {
        this.elementReceiver = this.webviewEndpoint.createFromPipe(this.elementPipe);
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

    @setState
    @connectEvent('copyElementEvent')
    copyInPlaceElement(element: SVGElement) {
        const elHtml = element.outerHTML;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.innerHTML = elHtml;
        const copy = g.children[0] as SVGElement;
        element.insertAdjacentElement('afterend', copy);
        this.holder.elements = [copy];
        g.remove();
        return copy;
    }


}