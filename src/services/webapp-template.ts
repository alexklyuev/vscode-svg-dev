import { AssetsManager } from './assets-manager';
import { Template } from '../models/template.model';


export class WebappTemplate implements Template {

    public readonly defaultDocument = `
        <svg width="300px" height="400px" viewBox="0 0 300 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        </svg>
    `;

    constructor(
        private assetsManager: AssetsManager,
    ) {}

    /**
     * 
     */
    render(doc: string) {
        return `<!DOCTYPE html>
<html>
    <head>
        ${ this.assetsManager.getStylesUris().map(uri => `<link rel="stylesheet" href="${ uri }?${ Math.random().toString().slice(2) }" />`).join('') }
    </head>
    <body>
        <div id="main">
            <div id="artboard">
                ${doc}
            </div>
            <div id="tools">
            </div>
            <div id="hud">
            </div>
        </div>
        ${ this.assetsManager.getScriptsUris().map(uri => `<script src="${ uri }?${ Math.random().toString().slice(2) }"></script>`).join('') }
    </body>
</html>`;
    }

}
