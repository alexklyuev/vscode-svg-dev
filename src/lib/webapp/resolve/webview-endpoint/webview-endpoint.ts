import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { toClient, toHost } from "@/webapp/event-emitter";


export class WebviewEndpoint {

    createFromPipe<Req, Res, Tag extends string>(pipe: Pipe<Req, Res, Tag>): PipeEndpoint<Req, Res, Tag> {
        return pipe.createEndpoint(
            fn => {
                toClient.on(fn);
                return () => toClient.off(fn);
            },
            data => {
                toHost.emit(data);
            },
        );
    }

}
