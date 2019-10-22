

import { 
    TreeDataProvider,
    TreeItem,
    ProviderResult,
    TreeItemCollapsibleState,
    Event,
} from 'vscode';
import { Tool } from '../models/tool.model';
import { Toolbox } from './toobox';
import { ToolGroup } from '../entities/tool-group';


type Entry = ToolGroup | Tool;


export class ToolsTreeProvider implements TreeDataProvider<Entry> {

    constructor(
        private toolbox: Toolbox,
    ) {}

    public onDidChangeTreeData: Event<null> = this.toolbox.changeEventEmitter.event;

    getTreeItem(element: Entry): TreeItem | Thenable<TreeItem> {
        const collapsibleState = (element instanceof ToolGroup 
            ? TreeItemCollapsibleState.Collapsed 
            : TreeItemCollapsibleState.None
        );
        const item = new TreeItem(
            element instanceof ToolGroup ? element.label : element.command.title,
            collapsibleState,
        );
        if ('command' in element) {
            item.command = element.command;
        }
        return item;
    }

    getChildren(element?: Entry): ProviderResult<Entry[]> {
        if (!element) {
            return this.toolbox.getKeys();
        } else if (element instanceof ToolGroup) {
            return this.toolbox.getByKey(element);
        } else {
            return null;
        }
    }

    getParent(_element: Entry) {
        return null;
    }

}
