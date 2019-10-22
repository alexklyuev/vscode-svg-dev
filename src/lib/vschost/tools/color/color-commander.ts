import * as vscode from 'vscode';
import { WebviewPanel } from "vscode";


export class ColorCommander {

    async change(property: string, panel: WebviewPanel) {
        const info = await this.getInfo(panel);
        if (info && property in info) {
            const value = info[property];
            const newValue = await vscode.window.showInputBox({value});
            panel.webview.postMessage({changeColor: {[property]: newValue}});
        }
    }

    // async changeFill(panel: WebviewPanel) {
    //     const { fill: value } = await this.getInfo(panel);
    //     const fill = await vscode.window.showInputBox({value});
    //     panel.webview.postMessage({changeColor: {fill}});
    // }

    // async changeStroke(panel: WebviewPanel) {
    //     const { stroke: value } = await this.getInfo(panel);
    //     const stroke = await vscode.window.showInputBox({value});
    //     panel.webview.postMessage({changeColor: {stroke}});
    // }

    getInfo(panel: WebviewPanel) {
        return new Promise<{[K: string]: string}>(resolve => {
            const listener = panel.webview.onDidReceiveMessage(data => {
                if ('colorInfo' in data) {
                    listener.dispose();
                    resolve(data.colorInfo as {[K: string]: string});
                }
            });
            panel.webview.postMessage({requestColorInfo: true});
        });
    }

}
