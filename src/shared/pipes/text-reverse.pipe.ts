import { Pipe } from "../services/pipe/pipe";

export const textReversePipe = new Pipe<{}, {text: string}, 'text-reverse'>('text-reverse');
