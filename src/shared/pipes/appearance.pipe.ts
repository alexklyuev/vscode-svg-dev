import { Pipe } from "../../lib/common/pipe/pipe";

export type AppearanceRequest = {name: string; value: string};
export type AppearanceResponse = {name: string; value: string};
export const appearancePipe = new Pipe<AppearanceRequest, AppearanceResponse, 'appearance'>('appearance');
