import { Pipe } from "../services/pipe/pipe";


export type ArrangePipeRequest = 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward';
export const arrangePipe = new Pipe<ArrangePipeRequest, {}, 'arrange'>('arrange');
