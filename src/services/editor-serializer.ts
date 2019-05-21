import { WebviewPanelSerializer, WebviewPanel } from "vscode";
import { Editor } from "./editor";
import { HostEndpoint } from "./host-endpoint/host-endpoint";
import { ConnectionsManager } from "./connection/connections-manager";


export class EditorSerializer implements WebviewPanelSerializer {

    constructor(
        private editor: Editor,
        private connectiosManager: ConnectionsManager,
    ) {}

    async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: string): Promise<void> {
        this.editor.activate(webviewPanel, state);
        const hostEndpoint = new HostEndpoint(webviewPanel);
        this.connectiosManager.each(connection => connection.connect(hostEndpoint));
    }
}
