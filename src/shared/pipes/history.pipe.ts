import { Pipe } from "@/common/pipe/pipe";


export type HistoryRequest = {state: string};
export type HistoryResponse = {};
export const historyPipe = new Pipe<HistoryRequest, HistoryResponse, 'history'>('history');
