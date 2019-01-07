import { WebviewPanelSerializer, WebviewPanel } from "vscode";
import { Editor } from "./editor";
import { PipeConnection } from "./connection/pipe-connection";
import { HostEndpoint } from "./host-endpoint/host-endpoint";


export class EditorSerializer implements WebviewPanelSerializer {

    constructor(
        private editor: Editor,
        private connections: PipeConnection<any, any, any>[],
    ) {}

    async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: string): Promise<void> {
        this.editor.activate(webviewPanel, state);
        const hostEndpoint = new HostEndpoint(webviewPanel);
        this.connections.forEach(con => con.connect(hostEndpoint));
    }
}
