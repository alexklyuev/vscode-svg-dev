import { Pipe } from "../../lib/common/pipe/pipe";


export const pickPipe = new Pipe<{html: string | null}, {}, 'pick'>('pick');
