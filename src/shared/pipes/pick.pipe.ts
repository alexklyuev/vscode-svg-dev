import { Pipe } from "../services/pipe/pipe";


export const pickPipe = new Pipe<{html: string | null}, {}, 'pick'>('pick');
