import { Pipe } from "@/common/pipe/pipe";

export type AlignRequest = {
    x: 'center' | 'left' | 'right';
    y: 'middle' | 'top' | 'bottom';
};
export type AlignResponse = {};
export const alignPipe = new Pipe<AlignRequest, AlignResponse, 'align'>('align');
