import * as vscode from 'vscode';
import { WebviewPanel } from 'vscode';
import { ContextManager } from './context-manager';
import { AppContext } from '../app-context.type';
import { Template } from '../models/template.model';
import { HostEndpoint } from './host-endpoint/host-endpoint';
import { ConnectionsManager } from './connection/connections-manager';
import { History } from '../svgdev/common/services/history/history';


export class Editor {

    private webviewPanel: WebviewPanel | null = null;

    private histories = new Map<WebviewPanel, History>();
    private history$: History | null = null;

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
    create() {
        this.webviewPanel = vscode.window.createWebviewPanel(
            this.viewType,
            this.title,
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            },
        );
        let maxLength = this.config.get('history.maxLength') as number;
        maxLength = ( typeof maxLength === 'number' && !!maxLength && maxLength > 0 && Number.isFinite(maxLength) ) ? maxLength : 24;
        this.histories.set(this.webviewPanel, new History(maxLength));
        return this.webviewPanel;
    }

    /**
     * 
     */
    activate(webviewPanel: WebviewPanel, doc: string = this.template.defaultDocument) {
        webviewPanel.webview.html = this.template.render(doc);
        webviewPanel.onDidDispose(() => {
            this.contextManager.setMulti({
                svgDevOpen: false,
                svgDevActive: false,
            });
        });
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
