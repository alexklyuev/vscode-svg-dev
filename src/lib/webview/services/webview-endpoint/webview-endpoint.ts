import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { host } from "@/webview/services/host-api";


export class WebviewEndpoint {

    createFromPipe<Req, Res, Tag extends string>(pipe: Pipe<Req, Res, Tag>): PipeEndpoint<Req, Res, Tag> {
        return pipe.createEndpoint(
            fn => {
                const listener = ({data}: MessageEvent) => fn(data);
                window.addEventListener('message', listener);
                return () => window.removeEventListener('message', listener);
            },
            data => host.api.postMessage(data),
        );
    }

}