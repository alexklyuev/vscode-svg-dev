import * as vscode from 'vscode';
import { RemoteAttribute } from "../remote-attribute/remote-attribute";
import { PipeEndpoint } from "../../shared/services/pipe/pipe";
import { RemoteAttributeRequest, RemoteAttributeResponse } from "../../shared/pipes/remote-attribute.pipe";


export class RemoteAttributeInput<Attribute extends string> {

    private remoteAttribute: RemoteAttribute<Attribute>;

    constructor(
        private hostEndpoint: PipeEndpoint<RemoteAttributeRequest, RemoteAttributeResponse, 'remoteAttribute'>,
        private attribute: Attribute,
    ) {
        this.remoteAttribute = new RemoteAttribute(this.hostEndpoint, this.attribute);
    }

    async change() {
        const { value } = await this.remoteAttribute.get();
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
        const newValue = await vscode.window.showInputBox({value: value || ''});
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
        this.remoteAttribute.set(newValue || '');
    }

}