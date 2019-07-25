import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { MoveKeyRequest } from "../../../shared/pipes/move-key.pipe";
import { ElementHolder } from "../services/picker/element-holder";
import { FiguresCollection } from "../figures/figures-collection";
import { ClientEvent, connectEvent } from "../entities/client-event";


export class MoveKeyListener {
    private moveKeyClient: PipeEndpoint<MoveKeyRequest, {}, 'move-key'>;

    public readonly moveEvent = new ClientEvent<'left' | 'up' | 'right' | 'down'>();
    
    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private moveKeyPipe: Pipe<MoveKeyRequest, {}, 'move-key'>,
        private holder: ElementHolder,
        private figuresCollection: FiguresCollection,
    ) {
        this.moveKeyClient = this.webviewEndpoint.createFromPipe(this.moveKeyPipe);
    }

    listen() {
        this.moveKeyClient.listenSetRequest(
            _request => this.holder.elements.length > 0,
            (request, _true) => {
                const { key, shift } = request;
                this.holder.elements.forEach(element => {
                    const delegate = this.figuresCollection.delegate(element);
                    if (delegate && delegate.move) {
                        delegate.move.byKey(element, key, shift);
                        this.fireMoveEvent(key);
                    }
                });
            },
        );
    }

    @connectEvent('moveEvent')
    fireMoveEvent(key: 'left' | 'up' | 'right' | 'down') {
        return key;
    }

}
