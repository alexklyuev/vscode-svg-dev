import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewPanel, ExtensionContext } from 'vscode';
import { ContextManager } from './context-manager';
import { AppContext } from '../../../app-context.type';
import { Template } from '../models/template.model';
import { HostEndpoint } from './host-endpoint/host-endpoint';
import { ConnectionsManager } from './connection/connections-manager';
// import { StateHistory } from '../lib/common/state-history/state-history';
import { StateHistory } from "../../common/state-history/state-history";


export class Editor {

    private webviewPanel: WebviewPanel | null = null;

    private histories = new Map<WebviewPanel, StateHistory>();
    private history$: StateHistory | null = null;

    public readonly viewType = 'svgDevPanel';

    public title = 'SVG';

    constructor(
        private readonly template: Template,
        private readonly contextManager: ContextManager<AppContext>,
        private readonly connectionsMan: ConnectionsManager,
        private readonly config: vscode.WorkspaceConfiguration,
    ) {}

    /**
     * 
     */
    create(context: ExtensionContext) {
        this.webviewPanel = vscode.window.createWebviewPanel(
            this.viewType,
            this.title,
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out', 'client', 'build'))],
            },
        );
        return this.webviewPanel;
    }

    /**
     * 
     */
    activate(webviewPanel: WebviewPanel, doc: string = this.template.defaultDocument) {
        webviewPanel.webview.html = this.template.render(webviewPanel, doc);
        webviewPanel.onDidDispose(() => {
            this.contextManager.setMulti({
                svgDevOpen: false,
                svgDevActive: false,
            });
        });

        let maxLength = this.config.get('history.maxLength') as number;
        maxLength = ( typeof maxLength === 'number' && !!maxLength && maxLength > 0 && Number.isFinite(maxLength) ) ? maxLength : 24;
        this.histories.set(webviewPanel, new StateHistory(maxLength));

        webviewPanel.onDidChangeViewState(_event => {
            this.contextManager.set('svgDevActive', webviewPanel!.active);
            if (webviewPanel.active) {
                const hostEndpoint = new HostEndpoint(webviewPanel);
                this.connectionsMan.each(connection => connection.connect(hostEndpoint));
                this.history$ = this.histories.get(webviewPanel) || null;
            }
        });
        return this.contextManager.setMulti({
            svgDevOpen: true,
            svgDevActive: true,
        });
    }

    /**
     * //
     */
    dispose() {
        if (this.webviewPanel) {
            this.histories.delete(this.webviewPanel);
            this.webviewPanel.dispose();
        }
    }

    /**
     * public entry for webview panel
     */
    public get panel() {
        return this.webviewPanel;
    }

    public get history() {
        return this.history$;
    }

}
