import { Tool } from "../../models/tool.model";


export class RectHeightTool implements Tool {

    label = 'Height';

    command = {title: 'Height', command: 'svgDevRemoteAttributeInput', arguments: ['height']};

}
