import { Tool } from "../../models/tool.model";


export class NewDocument implements Tool {

    label = 'New';

    command = {title: 'New', command: 'svgDevNew'};

}