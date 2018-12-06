import { Pipe } from "../services/pipe/pipe";

export const groupPipe = new Pipe<'group' | 'ungroup', {}, 'group'>('group');
