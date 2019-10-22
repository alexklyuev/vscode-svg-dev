import { WebviewPanelSerializer, WebviewPanel, WorkspaceConfiguration } from "vscode";
import { Editor } from "./editor";
import { HostEndpoint } from "./host-endpoint/host-endpoint";
import { ConnectionsManager } from "./connection/connections-manager";
import { PipeConnection } from "./connection/pipe-connection";
import { ConfigRequest, ConfigResponse } from "../lib/shared/pipes/config.pipe";


export class EditorSerializer implements WebviewPanelSerializer {

    constructor(
        private editor: Editor,
        private connectiosManager: ConnectionsManager,
        private config: WorkspaceConfiguration,
        private configConnection: PipeConnection<ConfigRequest, ConfigResponse, 'config'>,
    ) {}

    async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: string): Promise<void> {
        this.editor.activate(webviewPanel, state);
        const hostEndpoint = new HostEndpoint(webviewPanel);
        this.connectiosManager.each(connection => connection.connect(hostEndpoint));
        this.configConnection.ifConnected(endpoint => {
            endpoint.makeSetRequest(this.config);
        });
    }
}
