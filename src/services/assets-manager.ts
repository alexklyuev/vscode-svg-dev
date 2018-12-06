import * as path from 'path';
import { Uri } from 'vscode';


export class AssetsManager {
    private scripts = Array<string[]>();
    private styles = Array<string[]>();

    constructor(
        private extensionPath: string,
    ) {}

    addScript(...asset: string[]) {
        this.addAsset(this.scripts, asset);
    }

    addStyle(...asset: string[]) {
        return this.addAsset(this.styles, asset);
    }

    getScriptsUris(): Uri[] {
        return this.getAssetsUris(this.scripts);
    }

    getStylesUris(): Uri[] {
        return this.getAssetsUris(this.styles);
    }

    private addAsset(collection: string[][], asset: string[]) {
        return collection.push(asset);
    }

    private getAssetsUris(collection: string[][]): Uri[] {
        return (
            collection
            .map(rel => Uri.file(path.join(this.extensionPath, ...rel)))
            .map(uri => uri.with({ scheme: 'vscode-resource' }))
        );
    }

}
