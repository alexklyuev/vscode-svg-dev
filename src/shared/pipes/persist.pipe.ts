import { Pipe } from "../services/pipe/pipe";

export type PersistPipeRequest = {state: string};

export const persistPipe = new Pipe<PersistPipeRequest, {}, 'persist'>('persist');