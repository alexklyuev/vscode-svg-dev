import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { CreatePipeRequest, ElementsDict, createPipe } from "../../shared/pipes/create.pipe";
import { setState } from "../decorators/set-state.decorator";
import { sprites } from "../services/sprites";


export class CreateListener {
    private createClient: PipeEndpoint<CreatePipeRequest<keyof ElementsDict>, {}, "create">;

    constructor(
    ) {
        this.createClient = webviewEndpoint.createFromPipe(createPipe);
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
        const delegate = sprites.resolve(elementName);
        if (delegate) {
            delegate.create(elementName, attributes);
        }
    }

}
