import { PipeEndpoint, Pipe } from "../../../shared/services/pipe/pipe";
import { ListAttributesRequest, ListAttributesResponse } from "../../../shared/pipes/list-attributes.pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { ElementHolder } from "../services/picker/element-holder";


export class ListAttributesListener {
    private client: PipeEndpoint<ListAttributesRequest, ListAttributesResponse, 'list-attributes'>;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private listAttributesPipe: Pipe<ListAttributesRequest, ListAttributesResponse, 'list-attributes'>,
        private holder: ElementHolder,
    ) {
        this.client = this.webviewEndpoint.createFromPipe(this.listAttributesPipe);
    }

    listen() {
        this.client.listenGetRequest(
            _request => this.holder.elements.length > 0,
            (_request, _true) => {
                const element = this.holder.elements[0];
                return (element as any).getAttributeNames();
            },
        );
    }

}