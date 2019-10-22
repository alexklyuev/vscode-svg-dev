import { Tool } from "../../models/tool.model";


export class StrokeWidth implements Tool {

    command = {title: 'Width', command: 'svgDevRemoteAttributeInput', arguments: ['stroke-width']};

}