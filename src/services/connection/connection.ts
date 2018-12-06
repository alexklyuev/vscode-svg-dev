import { Pipe, PipeEndpoint } from "../../shared/services/pipe/pipe";
import { HostEndpoint } from "../host-endpoint/host-endpoint";


export class Connection<Req, Res, Tag extends string> {

    private endpoint: PipeEndpoint<Req, Res, Tag> | null = null;

    // TODO: Set
    private callbacks = Array<(endpoint: PipeEndpoint<Req, Res, Tag>) => void>();

    constructor(
        private pipe: Pipe<Req, Res, Tag>,
    ) {}

    connect(hostEndpoint: HostEndpoint) {
        if (this.endpoint) {
            this.endpoint.removeListeners();
        }
        this.endpoint = hostEndpoint.createFromPipe(this.pipe);
        this.callbacks.forEach(cb => cb(this.endpoint!));
    }

    onConnected(callback: (endpoint: PipeEndpoint<Req, Res, Tag>) => void) {
        this.callbacks.push(callback);
    }

    ifConnected(fn: (endpoint: PipeEndpoint<Req, Res, Tag>) => void) {
        if (this.endpoint) {
            fn(this.endpoint);
        }
    }

}
