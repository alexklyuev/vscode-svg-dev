import * as vscode from 'vscode';
import { WebappTemplate } from './services/webapp-template';
import { AssetsManager } from './services/assets-manager';
import { Editor } from './services/editor';
import { ContextManager } from './services/context-manager';
import { AppContext } from './app-context.type';
import { ToolsTreeProvider } from './services/tools-tree-provider';
import { RemoteAttributeInput } from './services/inputs/remote-attribute-input';
import { HostEndpoint } from './services/host-endpoint/host-endpoint';
import { CreatePipeRequest, ElementsDict } from './shared/pipes/create.pipe';
import { EditorSerializer } from './services/editor-serializer';
import { ArrangePipeRequest } from './shared/pipes/arrange.pipe';
import { ElementCommand } from './shared/pipes/element.pipe';
import { StatusBarItem, StatusBarAlignment } from 'vscode';
import { BaseInput } from './services/inputs/base-input';


import { toolbox } from './tools';

import {
    connectionsManager,
    pickConnection,
    loggerConnection,
    artboardConnection,
    artboardStyleConnection,
    artboardMoveConnection,
    flushConnection,
    createConnection,
    cancelConnection,
    zoomConnection,
    remoteAttributeConnnection,
    arrangeConnection,
    elementConnection,
    groupConnection,
    editConnection,
    appearanceConnection,
    artboardInverseConnection,
} from './services/connection';
import { CancelKeys } from './shared/pipes/cancel.pipe';


export function activate(context: vscode.ExtensionContext) {

    // TODO: isolate
    let statusBarItem: StatusBarItem | null = null;
    pickConnection.onConnected(endpoint => {
        endpoint.listenSetRequest(
            _request => true,
            ({ html: message }, _true) => {
                if (statusBarItem) {
                    statusBarItem.hide();
                    statusBarItem.dispose();
                    statusBarItem = null;
                }
                if (message) {
                    statusBarItem = vscode.window.createStatusBarItem(StatusBarAlignment.Right);
                    statusBarItem.text = message;
                    statusBarItem.show();
                }
            },
        );
    });

    appearanceConnection.onConnected(endpoint => {
        endpoint.listenGetRequest(
            _request => true,
            async (request, _true) => {
                const { name, value } = request;
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const newValue = await vscode.window.showInputBox({ value });
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                return {name, value: newValue!};
            },
        );
    });

    artboardInverseConnection.onConnected(endpoint => {
        endpoint.listenGetRequest(
            _request => true,
            async (request, _true) => {
                const { property, value } = request;
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const newValue = await vscode.window.showInputBox({ value, prompt: property });
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                return {value: (newValue || value)!};
            },
        );
    });

    const contextManager = new ContextManager<AppContext>();
    const assetsManager = new AssetsManager(context.extensionPath);
    const webappTemplate = new WebappTemplate(assetsManager);
    const editor = new Editor(webappTemplate, contextManager, connectionsManager);

    assetsManager.addScript('out', 'client', 'build', 'main.js');
    assetsManager.addStyle('out', 'client', 'build', 'artboard.css');

    vscode.window.registerTreeDataProvider(
        'svgDevToolsTreeView',
        new ToolsTreeProvider(toolbox),
    );

    vscode.window.registerWebviewPanelSerializer(
        editor.viewType,
        new EditorSerializer(editor, connectionsManager),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('svgDevNew', async () => {
            const panel = editor.create();
            await editor.activate(panel);
            const hostEndpoint = new HostEndpoint(panel);
            connectionsManager.each(connection => connection.connect(hostEndpoint));
            // @deprecated
            loggerConnection.ifConnected(hostLogger => {
                hostLogger.listenSetRequest(
                    _request => true,
                    request => {
                        if (request.log) {console.log('===>>>', request.log);}
                        if (request.warn) {console.warn('===>>>', request.warn);}
                        if (request.error) {console.error('===>>>', request.error);}
                    },
                );
                editor.panel!.onDidDispose(() => hostLogger.removeListeners());
            });
        }),
        vscode.commands.registerCommand('svgDevFromOpen', async () => {
            const { activeTextEditor } = vscode.window;
            if (activeTextEditor) {
                const content = activeTextEditor.document.getText();
                const panel = editor.create();
                await editor.activate(panel, content);
                const hostEndpoint = new HostEndpoint(panel);
                connectionsManager.each(connection => connection.connect(hostEndpoint));
            }
        }),
        vscode.commands.registerCommand('svgDevArtboardViewBox', async () => {
            artboardConnection.ifConnected(async viewBoxHost => {
                const { value } = await viewBoxHost.makeGetRequest({property: 'viewBox'});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const newValue = await vscode.window.showInputBox({value: value!});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                if (newValue) {
                    viewBoxHost.makeSetRequest({property: 'viewBox', value: newValue});
                }
            });
        }),
        vscode.commands.registerCommand('svgDevFlush', async () => {
            flushConnection.ifConnected(async endpoint => {
                const { content } = await endpoint.makeGetRequest({});
                if (content) {
                    const document = await vscode.workspace.openTextDocument({content});
                    vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
                }
            });
        }),
        vscode.commands.registerCommand('svgDevAdd', (name: keyof ElementsDict, attributes = {}) => {
            createConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest(
                    new CreatePipeRequest(name, attributes),
                );
            });
        }),
        vscode.commands.registerCommand('svgDevEdit', () => {
            editConnection.ifConnected(endpoint => {
                vscode.commands.executeCommand('setContext', 'svgDevAddInteractive', true);
                endpoint.makeSetRequest({});
            });
        }),
        vscode.commands.registerCommand('svgDevAddText', async () => {
            await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
            const innerText = await vscode.window.showInputBox();
            await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
            if (innerText) {
                vscode.commands.executeCommand('svgDevAdd', 'text', {innerText});
            }
        }),
        vscode.commands.registerCommand('svgDevAddInteractive', (name: keyof ElementsDict, attributes = {}) => {
            vscode.commands.executeCommand('setContext', 'svgDevAddInteractive', true);
            vscode.commands.executeCommand('svgDevAdd', name, attributes);
        }),
        vscode.commands.registerCommand('svgDevCancel', (key: CancelKeys) => {
            cancelConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest(key);
            });
            vscode.commands.executeCommand('setContext', 'svgDevAddInteractive', false);
        }),
        vscode.commands.registerCommand('svgDevZoom', () => {
            zoomConnection.ifConnected(async endpoint => {
                const input = new BaseInput();
                const value = await input.get({prompt: 'Set value in percents'});
                const abs = (parseInt(value!) || 100) / 100;
                endpoint.makeSetRequest({abs});
            });
        }),
        vscode.commands.registerCommand('svgDevZoomIn', () => {
            zoomConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest({delta: +0.1});
            });
        }),
        vscode.commands.registerCommand('svgDevZoomOut', () => {
            zoomConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest({delta: -0.1});
            });
        }),
        vscode.commands.registerCommand('svgDevDefaultZoom', () => {
            zoomConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest({abs: 1.0});
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardWidth', async () => {
            artboardConnection.ifConnected(async artboardHost => {
                const { value } = await artboardHost.makeGetRequest({property: 'width'});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const newValue = await vscode.window.showInputBox({value: value!});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                if (newValue) {
                    artboardHost.makeSetRequest({property: 'width', value: newValue});
                }
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardHeight', async () => {
            artboardConnection.ifConnected(async artboardHost => {
                const { value } = await artboardHost.makeGetRequest({property: 'height'});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const newValue = await vscode.window.showInputBox({value: value!});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                if (newValue) {
                    artboardHost.makeSetRequest({property: 'height', value: newValue});
                }
            });
        }),
        vscode.commands.registerCommand('svgDevRemoteAttributeInput', async (attribute: string) => {
            await remoteAttributeConnnection.ifConnected(async remoteAttributeHost => {
                const remote = new RemoteAttributeInput(remoteAttributeHost, attribute);
                await remote.changeByInput();
            });
        }),
        vscode.commands.registerCommand('svgDevRemoteAttributePick', async (attribute: string, items: string[]) => {
            await remoteAttributeConnnection.ifConnected(async remoteAttributeHost => {
                const remote = new RemoteAttributeInput(remoteAttributeHost, attribute);
                await remote.changeByPick(items);
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardStyleAdd', async () => {
            artboardStyleConnection.ifConnected(async artboardStyleHost => {
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const styleDirective = await vscode.window.showInputBox({prompt: 'Css directive - `name: value`'});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                const [ styleName, styleValue ] = styleDirective!.split(':').map(str => str.trim());
                artboardStyleHost.makeSetRequest({styleName, styleValue});
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardStyleBackground', async () => {
            artboardStyleConnection.ifConnected(async host => {
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const color = await vscode.window.showInputBox();
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                if (color) {
                    host.makeSetRequest({styleName: 'background', styleValue: color});
                }
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardMoveOn', () => {
            artboardMoveConnection.ifConnected(async host => {
                host.makeSetRequest(true);
            });
        }),
        vscode.commands.registerCommand('svgDevArtboardMoveOff', () => {
            artboardMoveConnection.ifConnected(async host => {
                host.makeSetRequest(false);
            });
        }),
        vscode.commands.registerCommand('svgDevStyleAdd', async () => {
            remoteAttributeConnnection.ifConnected(async endpoint => {
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                const directive = await vscode.window.showInputBox({prompt: 'Css directive - `name: value`'});
                await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                if (directive && directive.indexOf(':') > -1) {
                    const {value: style} = await endpoint.makeGetRequest({ attribute: 'style' });
                    if (style) {
                        const trimmedStyle = style.trim();
                        const newStyle = trimmedStyle[trimmedStyle.length - 1] === ';' ? `${trimmedStyle} ${directive}` : `${trimmedStyle}; ${directive}`;
                        endpoint.makeSetRequest({ attribute: 'style', value: newStyle });
                    } else {
                        endpoint.makeSetRequest({ attribute: 'style', value: directive });
                    }
                }
            });
        }),
        vscode.commands.registerCommand('svgDevStyleEdit', async () => {
            remoteAttributeConnnection.ifConnected(async endpoint => {
                const { value } = await endpoint.makeGetRequest({ attribute: 'style' });
                if (value) {
                    const rules = value.split(';')
                    .map(t => t.trim())
                    .filter(t => !!t)
                    .filter(t => t.indexOf(':') > -1)
                    .map(t => t.split(':', 2).map(t => t.trim()));
                    await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                    const picked = await vscode.window.showQuickPick(rules.map(([label, detail]) => {
                        return {label, detail};
                    }));
                    await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                    if (picked) {
                        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                        const newValue = await vscode.window.showInputBox({value: picked.detail});
                        await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                        const newRules = rules.map(([label, detail]) => {
                            if (label === picked.label && detail === picked.detail) {
                                return [label, newValue];
                            } else {
                                return [label, detail];
                            }
                        }).map(pair => pair.join(': ')).join('; ');
                        endpoint.makeSetRequest({attribute: 'style', value: newRules});
                    }
                } else {
                    vscode.commands.executeCommand('svgDevStyleAdd');
                }
            });
        }),
        vscode.commands.registerCommand('svgDevStyleRemove', async () => {
            remoteAttributeConnnection.ifConnected(async endpoint => {
                const { value } = await endpoint.makeGetRequest({attribute: 'style'});
                if (value) {
                    const rules = value.split(';')
                    .map(t => t.trim())
                    .filter(t => !!t)
                    .filter(t => t.indexOf(':') > -1)
                    .map(t => t.split(':', 2).map(t => t.trim()));
                    await vscode.commands.executeCommand('setContext', 'svgDevHostInput', true);
                    const picked = await vscode.window.showQuickPick(rules.map(([label, detail]) => {
                        return {label, detail};
                    }));
                    await vscode.commands.executeCommand('setContext', 'svgDevHostInput', false);
                    if (picked) {
                        const newRules = rules
                        .map(([label, detail]) => {
                            if (label === picked.label && detail === picked.detail) {
                                return null;
                            } else {
                                return [label, detail];
                            }
                        })
                        .filter(item => item !== null)
                        .map(pair => pair!.join(': ')).join('; ');
                        endpoint.makeSetRequest({attribute: 'style', value: newRules});
                    }
                }
            });
        }),
        vscode.commands.registerCommand('svgDevArrange', async (command: ArrangePipeRequest) => {
            arrangeConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest(command);
            });
        }),
        vscode.commands.registerCommand('svgDevElementCommand', async (command: ElementCommand) => {
            elementConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest(command);
            });
        }),
        vscode.commands.registerCommand('svgDevElementCommandDelete', () => {
            return vscode.commands.executeCommand('svgDevElementCommand', 'delete');
        }),
        vscode.commands.registerCommand('svgDevGroup', async (command: 'group' | 'ungroup') => {
            groupConnection.ifConnected(endpoint => {
                endpoint.makeSetRequest(command);
            });
        }),
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}
