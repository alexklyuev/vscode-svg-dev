import { Pipe } from "../services/pipe/pipe";

export type ElementCommand =
    'delete'
;

export const elementPipe = new Pipe<ElementCommand, {}, 'element'>('element');