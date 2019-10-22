import * as vscode from 'vscode';
import { RemoteAttribute } from "../remote-attribute/remote-attribute";
import { PipeEndpoint } from "../../lib/common/pipe/pipe";
import { RemoteAttributeRequest, RemoteAttributeResponse } from "../../lib/shared/pipes/remote-attribute.pipe";
import { QuickPickItem } from 'vscode';


export class RemoteAttributeInput<Attribute extends string> {

    private remoteAttribute: RemoteAttribute<Attribute>;

    constructor(
        private hostEndpoint: PipeEndpoint<RemoteAttributeRequest, RemoteAttributeResponse, 'remoteAttribute'>,
        private attribute: Attribute,
    ) {
        this.remoteAttribute = new RemoteAttribute(this.hostEndpoint, this.attribute);
    }

    async changeByInput() {
        const { value } = await this.remoteAttribute.get();
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
        const newValue = await vscode.window.showInputBox({value: value || ''});
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
        this.remoteAttribute.set(newValue || '');
    }

    async changeByPick(items: string[] | Thenable<string[]>) {
        const { value } = await this.remoteAttribute.get();
        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
        const quickPickItems: QuickPickItem[] = (await items).map(item => ({
            label: item,
            picked: item === value,
        }));
        const pick = await vscode.window.showQuickPick(quickPickItems);
        if (pick) {
            const newValue = pick.label;
            await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
            this.remoteAttribute.set(newValue || '');
        }
    }

}