import { PipeEndpoint, Pipe } from "../../../shared/services/pipe/pipe";
import { ElementCommand } from "../../../shared/pipes/element.pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";


export class ElementListener {
    private elementReceiver: PipeEndpoint<ElementCommand, {}, 'element'>;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private elementPipe: Pipe<ElementCommand, {}, 'element'>,
        private holder: ElementHolder,
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
                this.holder.elements = [];
            },
        );
    }

    @setState
    applyCommand(command: ElementCommand, element: SVGElement) {
        switch (command) {
            case 'delete': element.remove(); break;
        }
    }


}