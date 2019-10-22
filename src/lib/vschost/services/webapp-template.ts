import { AssetsManager } from './assets-manager';
import { Template } from '../models/template.model';
import { WebviewPanel, Uri } from 'vscode';


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
    render(webviewPanel: WebviewPanel, doc: string) {
        const mapFn = (uri: Uri) => {
            if (webviewPanel.webview.asWebviewUri instanceof Function) {
                // new way
                return webviewPanel.webview.asWebviewUri(uri);
            } else {
                // old way
                return uri.with({ scheme: 'vscode-resource' });
            }
        };
        const styles = this.assetsManager.getStylesUris().map(mapFn);
        const scripts = this.assetsManager.getScriptsUris().map(mapFn);
        return `<!DOCTYPE html>
<html>
    <head>
        <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'none'; script-src ${ webviewPanel.webview.cspSource } 'unsafe-eval'; style-src ${ webviewPanel.webview.cspSource } 'unsafe-inline';"
        />
        ${ styles.map(uri => `<link rel="stylesheet" href="${ uri }?${ Math.random().toString().slice(2) }" />`).join('') }
    </head>
    <body>
        <div id="main">
            <div id="artboard">
                ${ doc }
            </div>
            <div id="tools">
            </div>
            <div id="hud">
            </div>
        </div>
        ${ scripts.map(uri => `<script src="${ uri }?${ Math.random().toString().slice(2) }"></script>`).join('') }
    </body>
</html>`;
    }

}
