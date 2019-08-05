import { Pipe } from "../../lib/common/pipe/pipe";

export type FlushPayload = {content?: string};
export const flushPipe = new Pipe<FlushPayload, FlushPayload, 'flush'>('flush');
