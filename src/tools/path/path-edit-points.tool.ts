import { Tool } from "../../models/tool.model";


export class PathEditTool implements Tool {

    command = {
        title: 'Edit points attribute',
        command: 'svgDevRemoteAttributeInput',
        arguments: ['d']
    };

}
