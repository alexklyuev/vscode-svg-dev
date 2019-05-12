import { Pipe } from "../services/pipe/pipe";

export type ArtboardStyleRequest = {styleName: string, styleValue?: string};
export type ArtboardStyleResponse = {styleValue: string | null};
export const artboardStylePipe = new Pipe<ArtboardStyleRequest, ArtboardStyleResponse, 'artboard-style'>('artboard-style');
