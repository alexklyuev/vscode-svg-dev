import * as vscode from 'vscode';


export class ContextManager<Context extends object> {

    set<K extends keyof Context>(key: K, val: Context[K]) {
        return vscode.commands.executeCommand('setContext', key, val);
    }

    setMulti(keyvals: Partial<Context>) {
        return Promise.all(Object.keys(keyvals).map(key => {
            const val = keyvals[key as keyof Context];
            return vscode.commands.executeCommand('setContext', key, val);
        }));
    }

}
