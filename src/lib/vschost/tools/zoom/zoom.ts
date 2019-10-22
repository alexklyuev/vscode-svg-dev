import { WebviewPanel } from 'vscode';


export class Zoom {

    sendDelta(panel: WebviewPanel, delta: number): void {
        panel.webview.postMessage({
            zoom: {delta},
        });
    }

    sendAbs(panel: WebviewPanel, abs: number): void {
        panel.webview.postMessage({
            zoom: {abs},
        });
    }

}
