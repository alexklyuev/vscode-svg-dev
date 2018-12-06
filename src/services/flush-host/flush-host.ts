import { WebviewPanel } from "vscode";


export class FlushHost {

    getContent(panel: WebviewPanel) {
        return new Promise<string>(resolve => {
            const listen = panel.webview.onDidReceiveMessage((data) => {
                if ('responseContent' in data) {
                    listen.dispose();
                    resolve(data.responseContent as string);
                }
            });
            panel.webview.postMessage({
                requestContent: true,
            });
        });
    }

}
