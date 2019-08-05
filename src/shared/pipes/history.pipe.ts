import { Pipe } from "../../lib/common/pipe/pipe";


export type HistoryRequest = {state: string};
export type HistoryResponse = {};
export const historyPipe = new Pipe<HistoryRequest, HistoryResponse, 'history'>('history');
