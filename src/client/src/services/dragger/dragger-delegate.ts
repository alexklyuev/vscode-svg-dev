import { Dragger } from "./dragger.interface";
import { FiguresCollection } from "../../figures/figures-collection";


export class DraggerDelegate implements Dragger {

    constructor(
        private figuresCollection: FiguresCollection,
    ) {}

    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMousedown(child as SVGElement, clientX, clientY);
            }
        });
    }

    onMousemove(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMousemove(child as SVGElement, clientX, clientY);
            }
        });
    }

    onMouseup(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMouseup(child as SVGElement, clientX, clientY);
            }
        });
    }

}
