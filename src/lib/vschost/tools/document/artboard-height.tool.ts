import { Tool } from "../../models/tool.model";


export class ArtboardHeight implements Tool {

    label = 'Height';

    command = {title: 'Height', command: 'svgDevArtboardHeight'};

}