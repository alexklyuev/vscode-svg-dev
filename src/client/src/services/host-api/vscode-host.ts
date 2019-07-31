import { HostApi, Messenger } from "./host-api.interface";


declare const acquireVsCodeApi: () => Messenger;


export class VscodeHost implements HostApi {

    private vscode: Messenger | null = null;

    get api() {
        if (!this.vscode) {
            this.vscode = acquireVsCodeApi();
        }
        return this.vscode;
    }

}
