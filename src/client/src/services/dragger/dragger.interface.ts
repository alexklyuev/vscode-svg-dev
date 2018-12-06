export interface Dragger {
    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ): void;
    onMousemove(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ): void;
    onMouseup(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ): void;
}