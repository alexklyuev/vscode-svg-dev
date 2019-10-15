import { WebviewPanel } from "vscode";

export interface Template {
    defaultDocument: string;
    render(webviewPanel: WebviewPanel, doc: string): string;
}
