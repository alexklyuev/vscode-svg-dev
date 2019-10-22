import { Tool } from "../../models/tool.model";


export class Fill implements Tool {

    label = 'Fill';

    command = {
        title: 'Fill',
        command: 'svgDevRemoteAttributeInput',
        arguments: ['fill'],
    };

}
