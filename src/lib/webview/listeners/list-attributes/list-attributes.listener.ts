import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { ListAttributesRequest, ListAttributesResponse } from "@/shared/pipes/list-attributes.pipe";
import { ElementHolder } from "@/webview/services/holder/element-holder";
import { Listener } from "@/webview/models/listener.model";


export class ListAttributesListener implements Listener {
    private client: PipeEndpoint<ListAttributesRequest, ListAttributesResponse, 'list-attributes'>;

    constructor(
        private listAttributesPipe: Pipe<ListAttributesRequest, ListAttributesResponse, 'list-attributes'>,
        private holder: ElementHolder,
    ) {
        this.client = webviewEndpoint.createFromPipe(this.listAttributesPipe);
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
