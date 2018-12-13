import { Tool } from "../../models/tool.model";

export class IdTool implements Tool {

    command = {title: 'Id', command: 'svgDevRemoteAttributeInput', arguments: ['id']};

}