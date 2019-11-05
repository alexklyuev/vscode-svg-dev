import { Pipe } from "@/common/pipe/pipe";
import { EditMode } from "@/shared/pipes/edit-mode.pipe";


export type EditRequest = {mode: EditMode};
export type EditResponse = {};
export const editPipe = new Pipe<EditRequest, EditResponse, 'edit'>('edit');
