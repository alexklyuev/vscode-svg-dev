import { makeMethodIterator } from "@/common/iterators";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { MoveKeyRequest, moveKeyPipe } from "@/shared/pipes/move-key.pipe";
import { holder } from "@/webview/services/holder";
import { sprites } from "@/webview/services/sprites";
import { Listener } from "@/webview/models/listener.model";


export class MoveKeyListener implements Listener {
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
                    const sprite = sprites.resolve(element);
                    if (sprite && sprite.operators.moveOperator) {
                        sprite.operators.moveOperator.byKey(element, key, shift);
                        this.fireMoveEvent(key);
                    }
                });
            },
        );
    }

    @makeMethodIterator()
    fireMoveEvent(key: 'left' | 'up' | 'right' | 'down') {
        return key;
    }

}
