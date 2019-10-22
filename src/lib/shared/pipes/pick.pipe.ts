import { Pipe } from "@/common/pipe/pipe";


export const pickPipe = new Pipe<{html: string | null}, {}, 'pick'>('pick');
