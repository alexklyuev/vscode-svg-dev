import { Tool } from "../../models/tool.model";
import { Command } from "vscode";


export class RectAddTool implements Tool {

    command: Command = {
        title: 'Add',
        command: 'svgDevAdd',
        arguments: ['rect']
    };

}
