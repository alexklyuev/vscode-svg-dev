import { zoom } from "@/web/init";
import { Dragger } from "@/webview/models/operators/drag-operator.model";


export class DraggerPoints implements Dragger {

    private pointsStore = new Map<SVGElement, {points: number[][], initial: [number, number]}>();

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        const { clientX, clientY } = event;
        const points = element.getAttribute('points')!
        .split(/\s/)
        .map(
            pair => pair
                .trim()
                .split(',')
                .map(val => parseFloat(val))
        )
        .map(([pX, pY]) => [
            Math.round(clientX - (pX * zoom.value)),
            Math.round(clientY - (pY * zoom.value)),
        ]);
        this.pointsStore.set(
            element,
            {points, initial: [clientX, clientY]},
        );
    }

    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ) {
        let { clientX, clientY, shiftKey } = event;
        const storeValue = this.pointsStore.get(element)!;
        const { points, initial: [initialX, initialY] } = storeValue;
        if (shiftKey) {
            const absDX = Math.abs(clientX - initialX);
            const absDY = Math.abs(clientY - initialY);
            if (absDX > absDY) {
                clientY = initialY;
            } else {
                clientX = initialX;
            }
        }
        const newPoints = points
        .map(([sX, sY]) => [
            Math.round((clientX - sX) / zoom.value),
            Math.round((clientY - sY) / zoom.value),
        ])
        .map(pair => pair.join(','))
        .join(' ');
        element.setAttribute('points', newPoints);
    }

    onMouseup(
        element: SVGElement,
        _event: MouseEvent,
    ) {
        this.pointsStore.delete(element);
    }

}
