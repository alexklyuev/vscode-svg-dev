import { Pipe } from "../services/pipe/pipe";


export type CancelPipeRequest = 'cancel';
export const cancelPipe = new Pipe<'cancel', {}, 'cancel'>('cancel');
