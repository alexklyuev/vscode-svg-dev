import { Pipe } from "../../lib/common/pipe/pipe";

/**
 * Artboard attributes
 */
export type ArtboardRequest = {property: string; value?: string};
export type ArtboardResponse = {value: string | null};
export const artboardPipe = new Pipe<ArtboardRequest, ArtboardResponse, 'artboard'>('artboard');

export const artboardInversePipe = new Pipe<ArtboardRequest, ArtboardResponse, 'artboard-inverse'>('artboard-inverse');
