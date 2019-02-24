import { WebviewPanel } from "vscode";
import { Pipe, PipeEndpoint } from "../../shared/services/pipe/pipe";
import { TypedWire, TypedWireEndpoint } from "../../shared/services/typed-wire/typed-wire";


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
    createFromTypedWire<Tag extends string, Req, Res>(typedWire: TypedWire<Tag, Req, Res>): TypedWireEndpoint<Tag, Req, Res> {
        return typedWire.createEndpoint(
            fn => {
                const disposable = this.panel!.webview.onDidReceiveMessage(fn);
                return () => disposable.dispose();
            },
            data => this.panel!.webview.postMessage(data),
        );
    }

}
