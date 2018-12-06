import { Tool } from "../../models/tool.model";


export class CircleRadiusTool implements Tool {

    command = {title: 'Radius', command: 'svgDevRemoteAttributeInput', arguments: ['r']};

}
