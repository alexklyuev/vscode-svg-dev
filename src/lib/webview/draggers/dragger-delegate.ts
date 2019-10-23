import { sprites } from "@/webview/services/sprites";
import { Dragger } from "@/webview/draggers/dragger.interface";


export class DraggerDelegate implements Dragger {

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        Array.from(element.children).forEach(child => {
            const delegate = sprites.resolve(child);
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
            const delegate = sprites.resolve(child);
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
            const delegate = sprites.resolve(child);
            if (delegate) {
                delegate.drag.onMouseup(child as SVGElement, event);
            }
        });
    }

}
