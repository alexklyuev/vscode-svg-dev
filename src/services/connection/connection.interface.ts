import { HostEndpoint } from "../host-endpoint/host-endpoint";


export interface Connection<T> {
    connect(hostEndpoint: HostEndpoint): void;
    onConnected(callback: (endpoint: T) => void): void;
    ifConnected(fn: (endpoint: T) => void): void;
}
