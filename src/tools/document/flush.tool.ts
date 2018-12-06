import { Tool } from "../../models/tool.model";


export class FlushTool implements Tool {

    label = 'Flush';

    command = {title: 'Flush', command: 'svgDevFlush'};

}
