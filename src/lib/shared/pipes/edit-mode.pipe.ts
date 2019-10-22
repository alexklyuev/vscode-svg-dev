import { Pipe } from "@/common/pipe/pipe";

export type EditMode = 'off' | 'points';
export type EditModeRequest = {mode: EditMode};
export type EditModeResponse = {};
export const editModePipe = new Pipe<EditModeRequest, EditModeResponse, 'edit-mode'>('edit-mode');
