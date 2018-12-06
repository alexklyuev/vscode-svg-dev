import { Tool } from "../../models/tool.model";


export class RectRxTool implements Tool {

    label = 'rx';

    command = {title: 'rx', command: 'svgDevRemoteAttributeInput', arguments: ['rx']};

}
