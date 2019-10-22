import { Pipe } from "@/common/pipe/pipe";

export type ElementCommand =
    'delete' | 'copy' | 'copy-in-place'
;

export const elementPipe = new Pipe<ElementCommand, {}, 'element'>('element');