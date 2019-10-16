import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { CreatePipeRequest, ElementsDict } from "../../../shared/pipes/create.pipe";
import { FiguresCollection } from "../figures/figures-collection";
import { setState } from "../decorators/set-state.decorator";


export class CreateListener {
    private createClient: PipeEndpoint<CreatePipeRequest<keyof ElementsDict>, {}, "create">;

    constructor(
        private createPipe: Pipe<CreatePipeRequest<keyof ElementsDict>, {}, 'create'>,
        private figuresCollection: FiguresCollection,
    ) {
        this.createClient = webviewEndpoint.createFromPipe(this.createPipe);
    }

    listen() {
        this.createClient.listenSetRequest(
            _request => true,
            ({elementName, attributes}, _true) => {
                this.createElement(elementName, attributes);
            },
        );
    }

    @setState
    createElement(elementName: keyof ElementsDict, attributes: {}) {
        const delegate = this.figuresCollection.delegate(elementName);
        if (delegate) {
            delegate.create(elementName, attributes);
        }
    }

}
