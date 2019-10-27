import { sprites } from "@/webview/services/sprites";
import { Dragger } from "@/webview/models/operators/drag-operator.model";


export class DraggerDelegate implements Dragger {

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = sprites.resolve(child);
            if (delegate) {
                delegate.dragOperator.onMousedown(child as SVGElement, event);
            }
        });
    }

    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = sprites.resolve(child);
            if (delegate) {
                delegate.dragOperator.onMousemove(child as SVGElement, event);
            }
        });
    }

    onMouseup(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = sprites.resolve(child);
            if (delegate) {
                delegate.dragOperator.onMouseup(child as SVGElement, event);
            }
        });
    }

}
