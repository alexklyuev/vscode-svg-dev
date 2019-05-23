import { Pipe } from "../services/pipe/pipe";
import { PipeTags } from "./tags";

export type ArtboardStyleRequest = {styleName: string, styleValue?: string};
export type ArtboardStyleResponse = {styleValue: string | null};
export const artboardStylePipe = new Pipe<ArtboardStyleRequest, ArtboardStyleResponse, PipeTags.artboardStyle>(PipeTags.artboardStyle);
