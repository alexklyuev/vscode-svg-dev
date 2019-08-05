import { Pipe } from "../../lib/common/pipe/pipe";


export type UndoRequest = {state: string};
export type UndoResponse = {};
export const undoPipe = new Pipe<UndoRequest, UndoResponse, 'undo'>('undo');

