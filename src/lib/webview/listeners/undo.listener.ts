import { makeMethodIterator } from "@/common/iterators";
import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";
import { artboard } from "@/webview/services/artboard";

import { UndoRequest, UndoResponse } from '../../../shared/pipes/undo.pipe';
import { ElementHolder } from "../services/holder/element-holder";


export class UndoListener {
    private client: PipeEndpoint<UndoRequest, UndoResponse, 'undo'>;

    // public readonly renderStateEvent = new EventBus<string>();

    constructor(
        private undoPipe: Pipe<UndoRequest, UndoResponse, 'undo'>,
        private holder: ElementHolder,
    ) {
        this.client = webviewEndpoint.createFromPipe(this.undoPipe);
    }

    listen() {
        this.client.listenSetRequest(
            _request => artboard,
            ({ state }) => {
                this.renderState(state);
            },
        );
    }

    // @connectEvent('renderStateEvent')
    @makeMethodIterator()
    renderState(state: string) {
        try {
            artboard.box.innerHTML = state;
        } catch {}
        artboard.clearCache();
        this.holder.elements = [];
        return state;
    }

}