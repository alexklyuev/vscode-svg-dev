import * as vscode from 'vscode';
import { InputBoxOptions } from 'vscode';


export class BaseInput {

    async get(options: InputBoxOptions) {
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
        const result = vscode.window.showInputBox(options);
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
        return result;
    }

}
