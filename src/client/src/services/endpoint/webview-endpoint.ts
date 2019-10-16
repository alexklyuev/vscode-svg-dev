import { PipeEndpoint, Pipe } from "../../../../lib/common/pipe/pipe";
import { HostApi } from "@/webview/services/host-api/host-api.interface";


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