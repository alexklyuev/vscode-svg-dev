import { Tool } from "../../models/tool.model";


export class CopyTool implements Tool {

    command = {
        title: 'Copy',
        command: 'svgDevElementCommand',
        arguments: ['copy'],
    };

}