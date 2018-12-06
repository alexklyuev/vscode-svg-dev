export interface Messenger {
    postMessage(data: any): void;
    setState(state: any): void;
}

export interface HostApi {
    api: Messenger;
}
