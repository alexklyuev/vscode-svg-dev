import * as vscode from 'vscode';
import { PipeEndpoint } from "../../../common/pipe/pipe";


export class PipeInput<Req, Res, Tag extends string> {

    constructor(
        private endpoint: PipeEndpoint<Req, Res, Tag>,
    ) {}

    async change(
        request: Req,
        valueGetter: (response: Res) => string,
        valuePacker: (newValue: string | undefined, oldValue: string) => Req,
    ) {
        const res = await this.endpoint.makeGetRequest(request);
        const currentValue = valueGetter(res);
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
        const newValue = await vscode.window.showInputBox({value: currentValue});
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
        const setRequest = valuePacker(newValue, currentValue);
        this.endpoint.makeSetRequest(setRequest);
    }

}