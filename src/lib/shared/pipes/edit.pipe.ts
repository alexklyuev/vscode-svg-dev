import { Pipe } from "@/common/pipe/pipe";


export type EditRequest = {};
export type EditResponse = {};
export const editPipe = new Pipe<EditRequest, EditResponse, 'edit'>('edit');
