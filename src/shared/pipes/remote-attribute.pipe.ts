import { Pipe } from "../../lib/common/pipe/pipe";

/**
 * Remote attribute
 */
export type RemoteAttributeRequest = {attribute: string; value?: string};
export type RemoteAttributeResponse = {value: string | null};
export const remoteAttributePipe = new Pipe<RemoteAttributeRequest, RemoteAttributeResponse, 'remoteAttribute'>('remoteAttribute');
