import { Tool } from "../../models/tool.model";


export class StrokeLinecap implements Tool {

    label = 'Linecap';

    command = {
        title: 'Linecap',
        command: 'svgDevRemoteAttributePick',
        arguments: [
            'stroke-linecap',
            [
                'butt',
                'round',
                'square',
            ],
        ],
    };

}
