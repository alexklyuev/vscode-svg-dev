import { Pipe } from "../../lib/common/pipe/pipe";


export type ArrangePipeRequest = 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward';
export const arrangePipe = new Pipe<ArrangePipeRequest, {}, 'arrange'>('arrange');
