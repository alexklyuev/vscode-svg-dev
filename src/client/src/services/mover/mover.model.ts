export interface Mover {
    by(
        element: SVGElement,
        values: {x: number; y: number},
    ): void;
    byKey(
        element: SVGElement,
        key: 'left' | 'up' | 'right' | 'down',
        shift: boolean,
    ): void;
}
