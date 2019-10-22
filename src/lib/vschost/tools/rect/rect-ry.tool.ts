import { Tool } from "../../models/tool.model";


export class RectRyTool implements Tool {

    label = 'ry';

    command = {title: 'ry', command: 'svgDevRemoteAttributeInput', arguments: ['ry']};

}
