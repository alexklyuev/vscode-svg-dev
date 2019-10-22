import { Tool } from "../../models/tool.model";


export class CopyInPlaceTool implements Tool {

    command = {
        title: 'Copy in place',
        command: 'svgDevElementCommand',
        arguments: ['copy-in-place'],
    };

}
