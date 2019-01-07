import { WebviewPanel } from "vscode";
import { Pipe, PipeEndpoint } from "../../shared/services/pipe/pipe";
import { TypedSocket, TypedSocketEndpoint } from "../../shared/services/typed-socket/typed-socket";


export class HostEndpoint {

    constructor(
        private panel: WebviewPanel,
    ) {}

    /**
     * Create host endpoint from pipe
     * with host specific listener and sender functions
     */
    createFromPipe<Req, Res, Tag extends string>(pipe: Pipe<Req, Res, Tag>): PipeEndpoint<Req, Res, Tag> {
        return pipe.createEndpoint(
            fn => {
                const disposable = this.panel!.webview.onDidReceiveMessage(fn);
                return () => disposable.dispose();
            },
            data => this.panel!.webview.postMessage(data),
        );
    }

    /**
     * Create host typed socket endpoint
     * with host specific listener and sender functions
     */
    createFromTypedSocket<Tag extends string, Req, Res>(typedSocket: TypedSocket<Tag, Req, Res>): TypedSocketEndpoint<Tag, Req, Res> {
        return typedSocket.createEndpoint(
            fn => {
                const disposable = this.panel!.webview.onDidReceiveMessage(fn);
                return () => disposable.dispose();
            },
            data => this.panel!.webview.postMessage(data),
        );
    }

}
