import { Tool } from "../../models/tool.model";


export class StrokeLinejoin implements Tool {

    label = 'Linejoin';

    command = {
        title: 'Linejoin',
        command: 'svgDevRemoteAttributePick',
        arguments: [
            'stroke-linejoin',
            [
                'miter',
                'round',
                'bevel',
            ],
        ],
    };

}
