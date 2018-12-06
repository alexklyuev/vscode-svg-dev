import { Command } from 'vscode';
import { Toolbox } from '../services/toobox';


export interface ToolCtor<T> {
    new (
        toolbox: Toolbox,
    ): T;
}

export interface Tool {
    command: Command;
}
