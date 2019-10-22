import { WebviewPanel } from "vscode";


export class RemoteProperty<C extends string> {

    constructor(
        private panel: WebviewPanel,
        private property: C,
    ) {}

    get() {
        return new Promise<{[K in C]: string}>((resolve, reject) => {
            const listener = this.panel.webview.onDidReceiveMessage(data => {
                if ('remoteProperty' in data && this.property in data['remoteProperty']) {
                    listener.dispose();
                    resolve({
                        [this.property]: data.remoteProperty[this.property],
                    } as {[K in C]: string});
                }
                if ('remotePropertyError' in data) {
                    listener.dispose();
                    reject(data.remotePropertyError);
                }
            });
            this.panel.webview.postMessage({
                getRemoteProperty: {
                    property: this.property,
                },
            });
        });
    }

    set(value: string) {
        this.panel.webview.postMessage({
            setRemoteProperty: {
                property: this.property,
                value,
            }
        });
    }

}
