import { Tool } from "../../models/tool.model";


export class StrokeDasharray implements Tool {

    label = 'Dasharray';

    command = {
        title: 'Dasharray',
        command: 'svgDevRemoteAttributeInput',
        arguments: ['stroke-dasharray'],
    };

}
