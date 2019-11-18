import { webviewEndpoint } from "&resolve/webview-endpoint";
import { ElementsDict, createPipe } from "@/shared/pipes/create.pipe";
import { setState } from "&resolve/decorators/set-state.decorator";
import { sprites } from "@/webview/services/sprites";
import { Listener } from "@/webview/models/listener.model";


export class CreateListener implements Listener {

    private createClient = webviewEndpoint.createFromPipe(createPipe);

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
        const sprite = sprites.resolve(elementName);
        if (sprite) {
            const { createOperator } = sprite.operators;
            if (createOperator) {
                createOperator.create(elementName, attributes);
            }
        }
    }

}
