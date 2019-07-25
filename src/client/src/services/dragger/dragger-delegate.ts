import { Dragger } from "./dragger.interface";
import { FiguresCollection } from "../../figures/figures-collection";


export class DraggerDelegate implements Dragger {

    constructor(
        private figuresCollection: FiguresCollection,
    ) {}

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMousedown(child as SVGElement, event);
            }
        });
    }

    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMousemove(child as SVGElement, event);
            }
        });
    }

    onMouseup(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = this.figuresCollection.delegate(child);
            if (delegate) {
                delegate.drag.onMouseup(child as SVGElement, event);
            }
        });
    }

}
