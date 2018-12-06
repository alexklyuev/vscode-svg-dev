import { WebviewPanelSerializer, WebviewPanel } from "vscode";
import { Editor } from "./editor";
import { Connection } from "./connection/connection";
import { HostEndpoint } from "./host-endpoint/host-endpoint";


export class EditorSerializer implements WebviewPanelSerializer {

    constructor(
        private editor: Editor,
        private connections: Connection<any, any, any>[],
    ) {}

    async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: string): Promise<void> {
        this.editor.activate(webviewPanel, state);
        const hostEndpoint = new HostEndpoint(webviewPanel);
        this.connections.forEach(con => con.connect(hostEndpoint));
    }
}
