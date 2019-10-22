import { Tool } from "../../models/tool.model";

export class DeleteTool implements Tool {

    command = {
        title: 'Delete',
        command: 'svgDevElementCommand',
        arguments: ['delete'],
    };

}
