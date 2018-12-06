import { PipeEndpoint, Pipe } from "../../../../shared/services/pipe/pipe";
import { HostApi } from "../host-api/host-api.interface";


export class WebviewEndpoint {

    constructor(
        private host: HostApi,
    ) {}

    createFromPipe<Req, Res, Tag extends string>(pipe: Pipe<Req, Res, Tag>): PipeEndpoint<Req, Res, Tag> {
        return pipe.createEndpoint(
            fn => {
                const listener = ({data}: MessageEvent) => fn(data);
                window.addEventListener('message', listener);
                return () => window.removeEventListener('message', listener);
            },
            data => this.host.api.postMessage(data),
        );
    }

}