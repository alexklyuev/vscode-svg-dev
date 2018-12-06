import { Tool } from "../../models/tool.model";


export class ArtboardWidth implements Tool {

    label = 'Width';

    command = {title: 'Width', command: 'svgDevArtboardWidth'};

}
