import { WebviewPanel } from "vscode";


export class Rect {

    add(panel: WebviewPanel) {
        panel.webview.postMessage({
            rect: true,
        });
    }

}
