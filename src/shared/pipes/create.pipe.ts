import { Pipe } from "../../lib/common/pipe/pipe";

export type ColorAttrs = {
    fill: string;
    stroke: string;
};

export type ElementsDict = {
    circle: {
        cx: string;
        cy: string;
        r: string;
    } & ColorAttrs,
    ellipse: {
        cx: string,
        cy: string,
        rx: string,
        ry: string,
    } & ColorAttrs,
    rect: {
        x: string;
        y: string;
        width: string;
        height: string;
    } & ColorAttrs,
    text: {
        x: string;
        y: string;
    } & ColorAttrs,
    line: {
        x1: string,
        x2: string,
        y1: string,
        y2: string,
    } & ColorAttrs,
    polygon: {} & ColorAttrs,
    polyline: {} & ColorAttrs,
};

export class CreatePipeRequest<T extends keyof ElementsDict> {
    constructor(
        public readonly elementName: T,
        public readonly attributes: {[K in keyof ElementsDict[T]]?: ElementsDict[T][K]},
        public readonly interactive = false,
    ) {}
}

export const createPipe = new Pipe<CreatePipeRequest<keyof ElementsDict>, {}, 'create'>('create');
