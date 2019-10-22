import { Tool } from "../../models/tool.model";


export class Stroke implements Tool {

    label = 'Stroke';

    command = {
        title: 'Stroke',
        command: 'svgDevRemoteAttributeInput',
        arguments: ['stroke'],
    };

}
