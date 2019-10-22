import { PipeEndpoint } from "../../../common/pipe/pipe";
import { RemoteAttributeRequest, RemoteAttributeResponse } from "../../../shared/pipes/remote-attribute.pipe";


export class RemoteAttribute<Attribute extends string> {

    constructor(
        private hostEndpoint: PipeEndpoint<RemoteAttributeRequest, RemoteAttributeResponse, 'remoteAttribute'>,
        private attribute: Attribute,
    ) {}

    get() {
        return this.hostEndpoint.makeGetRequest({attribute: this.attribute});
    }

    set(value: string) {
        return this.hostEndpoint.makeSetRequest({attribute: this.attribute, value});
    }

}
