import { Pipe } from "@/common/pipe/pipe";


export const textReversePipe = new Pipe<{}, {text: string}, 'text-reverse'>('text-reverse');
