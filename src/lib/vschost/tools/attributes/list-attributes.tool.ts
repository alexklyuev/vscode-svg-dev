import { Tool } from "../../models/tool.model";


export class ListAttributesTool implements Tool {

    command = {
        title: 'Change attribute',
        command: 'svgDevListAttributes',
    };

}
