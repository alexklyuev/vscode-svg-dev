interface Messenger {
    postMessage(data: any): void;
    setState(state: any): void;
}

declare const acquireVsCodeApi: () => Messenger;


export class VscodeHost {

    private vscode: Messenger | null = null;

    get api() {
        if (!this.vscode) {
            this.vscode = acquireVsCodeApi();
        }
        return this.vscode;
    }

}
