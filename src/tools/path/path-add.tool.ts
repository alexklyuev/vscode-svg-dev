import { Tool } from "../../models/tool.model";


export class PathAddTool implements Tool {

    command = {
        title: 'Add Path',
        command: 'svgDevAddInteractive',
        arguments: [
            'path',
            {
                stroke: 'white',
                d: 'M10 10 l 50 50 l 0 -50 Z'
            },
        ],
    };

}
