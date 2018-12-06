import { Tool } from "../../models/tool.model";


export class ZoomIn implements Tool {

    label = 'Zoom In';

    command = {
        title: 'Zoom In',
        command: 'svgDevZoomIn',
    };

}
