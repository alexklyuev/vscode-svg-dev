import { Tool } from '../models/tool.model';
import { EventEmitter } from 'vscode';
import { ToolGroup } from '../entities/tool-group';


export class Toolbox {
    private map = new Map<ToolGroup, Tool[]>();

    public changeEventEmitter = new EventEmitter<null>();

    register(group: ToolGroup, ...tools: Tool[]) {
        if (!this.map.has(group)) {
            this.map.set(group, new Array<Tool>(...tools));
        } else {
            this.map.set(group, this.map.get(group)!.concat(tools));
        }
        this.changeEventEmitter.fire();
    }

    getKeys(): ToolGroup[] {
        return Array.from(this.map.keys());
    }

    getByKey(key: ToolGroup): Tool[] {
        return this.map.get(key) || [];
    }

}
