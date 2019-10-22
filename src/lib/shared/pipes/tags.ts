export enum PipeTags {
    artboardStyle = 'artboard-style',
    artboardMove = 'artboard-move',
}

export type X = {[K in PipeTags]: any};
