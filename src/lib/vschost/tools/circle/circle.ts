import { WebviewPanel } from "vscode";


export class Circle {

    add(panel: WebviewPanel) {
        panel.webview.postMessage({
            circle: true,
        });
    }

}
