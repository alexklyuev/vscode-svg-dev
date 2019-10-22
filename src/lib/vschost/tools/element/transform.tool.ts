import { Tool } from "../../models/tool.model";


export class TransformTool implements Tool {

    command = {
        title: 'Transform',
        command: 'svgDevRemoteAttributeInput',
        arguments: ['transform'],
    };

}
