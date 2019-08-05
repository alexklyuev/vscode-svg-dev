import { PipeEndpoint, Pipe } from "../../../lib/common/pipe/pipe";
import { Artboard } from "../services/artboard/artboard";
import { UndoRequest, UndoResponse } from '../../../shared/pipes/undo.pipe';
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { ElementHolder } from "../services/picker/element-holder";
import { ClientEvent, connectEvent } from "../entities/client-event";


export class UndoListener {
    private client: PipeEndpoint<UndoRequest, UndoResponse, 'undo'>;

    public readonly renderStateEvent = new ClientEvent<string>();

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private undoPipe: Pipe<UndoRequest, UndoResponse, 'undo'>,
        private artboard: Artboard,
        private holder: ElementHolder,
    ) {
        this.client = this.webviewEndpoint.createFromPipe(this.undoPipe);
    }

    listen() {
        this.client.listenSetRequest(
            _request => this.artboard,
            ({ state }) => {
                this.renderState(state);
            },
        );
    }

    @connectEvent('renderStateEvent')
    renderState(state: string) {
        try {
            this.artboard.box.innerHTML = state;
        } catch {}
        this.artboard.clearCache();
        this.holder.elements = [];
        return state;
    }

}
