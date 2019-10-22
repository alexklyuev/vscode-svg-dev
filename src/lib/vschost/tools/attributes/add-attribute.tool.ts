import { Tool } from "../../models/tool.model";


export class AddAttributeTool implements Tool {

    command = {
        title: 'Add attribute',
        command: 'svgDevAddAttribute',
    };

}
