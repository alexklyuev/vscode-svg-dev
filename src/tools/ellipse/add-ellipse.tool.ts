import { Tool } from "../../models/tool.model";

export class AddEllipseTool implements Tool {

    command = {title: 'Add Ellipse', command: 'svgDevAdd', arguments: ['ellipse']};

}
