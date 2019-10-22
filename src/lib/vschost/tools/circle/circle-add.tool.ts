import { Command } from 'vscode';
import { Tool } from '../../models/tool.model';


export class CircleAdd implements Tool {

    command: Command = {
        title: 'Add Circle',
        command: 'svgDevAdd',
        arguments: ['circle']
    };

}
