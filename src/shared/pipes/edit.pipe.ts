import { Pipe } from "../../lib/common/pipe/pipe";

export type EditRequest = {};
export type EditResponse = {};
export const editPipe = new Pipe<EditRequest, EditResponse, 'edit'>('edit');
