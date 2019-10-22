import { makeMethodIterator } from "@/common/iterators";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { MoveKeyRequest, moveKeyPipe } from "../../shared/pipes/move-key.pipe";
import { holder } from "../services/holder";
import { figuresCollection } from "../services/figures-collection";


export class MoveKeyListener {
    private moveKeyClient: PipeEndpoint<MoveKeyRequest, {}, 'move-key'>;

    constructor() {
        this.moveKeyClient = webviewEndpoint.createFromPipe(moveKeyPipe);
    }

    listen() {
        this.moveKeyClient.listenSetRequest(
            _request => holder.elements.length > 0,
            (request, _true) => {
                const { key, shift } = request;
                holder.elements.forEach(element => {
                    const delegate = figuresCollection.delegate(element);
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
