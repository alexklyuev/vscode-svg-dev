import { Tool } from "../../models/tool.model";

export class DefaultZoom implements Tool {

    label = '100%';

    command = {title: '100%', command: 'svgDevDefaultZoom'};

}
