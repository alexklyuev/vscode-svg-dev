import { Pipe } from "../../lib/common/pipe/pipe";

export type CancelKeys = 'enter' | 'escape';


export type CancelPipeRequest = CancelKeys;
export const cancelPipe = new Pipe<CancelKeys, {}, 'cancel'>('cancel');
