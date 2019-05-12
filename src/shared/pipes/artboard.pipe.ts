import { Pipe } from "../services/pipe/pipe";

/**
 * Artboard attributes
 */
export type ArtboardRequest = {property: string; value?: string};
export type ArtboardResponse = {value: string | null};
export const artboardPipe = new Pipe<ArtboardRequest, ArtboardResponse, 'artboard'>('artboard');
