import { Tool } from "../../models/tool.model";

export class GroupTool implements Tool {

    command = {title: 'Group selection', command: 'svgDevGroup', arguments: ['group']};

}