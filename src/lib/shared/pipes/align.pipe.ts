import { Pipe } from "@/common/pipe/pipe";

export type AlignRequest = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
export type AlignResponse = {};
export const alignPipe = new Pipe<AlignRequest, AlignResponse, 'align'>('align');
