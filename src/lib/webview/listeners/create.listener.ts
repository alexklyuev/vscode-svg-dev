import { webviewEndpoint } from "@/webview/services/webview-endpoint";
import { ElementsDict, createPipe } from "@/shared/pipes/create.pipe";
import { setState } from "@/webview/decorators/set-state.decorator";
import { sprites } from "@/webview/services/sprites";


export class CreateListener {

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
