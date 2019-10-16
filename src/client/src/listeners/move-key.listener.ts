import { makeMethodIterator } from "@/common/iterators";
import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { MoveKeyRequest } from "../../../shared/pipes/move-key.pipe";
import { ElementHolder } from "../services/picker/element-holder";
import { FiguresCollection } from "../figures/figures-collection";


export class MoveKeyListener {
    private moveKeyClient: PipeEndpoint<MoveKeyRequest, {}, 'move-key'>;

    constructor(
        private moveKeyPipe: Pipe<MoveKeyRequest, {}, 'move-key'>,
        private holder: ElementHolder,
        private figuresCollection: FiguresCollection,
    ) {
        this.moveKeyClient = webviewEndpoint.createFromPipe(this.moveKeyPipe);
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

    // @connectEvent('moveEvent')
    @makeMethodIterator()
    fireMoveEvent(key: 'left' | 'up' | 'right' | 'down') {
        return key;
    }

}
