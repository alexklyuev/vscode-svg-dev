import { WebviewPanel } from "vscode";

/**
 * Logger
 */
export class BackOffice {

    listen(panel: WebviewPanel): void{
        panel.webview.onDidReceiveMessage((data) => {
            if ('logger' in data) {
                console.log('->', data.logger);
            }
        });
    }

    write(...messages: string[]) {
        console.log(...messages);
    }

}
