import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { toClient, toHost } from "@/webapp/event-emitter";


export class HostEndpoint {

    createFromPipe<Req, Res, Tag extends string>(pipe: Pipe<Req, Res, Tag>): PipeEndpoint<Req, Res, Tag> {
        return pipe.createEndpoint(
            fn => {
                toHost.on(fn);
                return () => toHost.off(fn);
            },
            data => {
                toClient.emit(data);
            },
        );
    }

}
