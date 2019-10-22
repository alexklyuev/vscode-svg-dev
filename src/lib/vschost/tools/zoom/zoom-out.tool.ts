import { Tool } from "../../models/tool.model";


export class ZoomOut implements Tool {

    label = 'Zoom Out';

    command = {
        title: 'Zoom Out',
        command: 'svgDevZoomOut',
    };

}
