import { Tool } from "../../models/tool.model";

export class UngroupTool implements Tool {

    command = {title: 'Ungroup', command: 'svgDevGroup', arguments: ['ungroup']};

}
