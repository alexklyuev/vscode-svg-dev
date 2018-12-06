import { Tool } from "../../models/tool.model";


export class RectWidthTool implements Tool {

    label = 'Width';

    command = {title: 'Width', command: 'svgDevRemoteAttributeInput', arguments: ['width']};

}
