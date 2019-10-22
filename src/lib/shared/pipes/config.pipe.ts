import { Pipe } from "@/common/pipe/pipe";


export type ConfigRequest = {[K: string]: any};
export type ConfigResponse = {};
export const configPipe = new Pipe<ConfigRequest, ConfigResponse, 'config'>('config');
