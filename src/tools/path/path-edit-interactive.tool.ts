import { Tool } from "../../models/tool.model";


export class PathEditInteractive implements Tool {

    command = {
        title: 'Edit points visually',
        command: 'svgDevEdit',
    };

}
