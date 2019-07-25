export interface Dragger {
    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ): void;
    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ): void;
    onMouseup(
        element: SVGElement,
        event: MouseEvent,
    ): void;
}