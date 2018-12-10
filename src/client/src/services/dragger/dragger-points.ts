import { Zoom } from "../zoom/zoom";
import { Dragger } from "./dragger.interface";


export class DraggerPoints implements Dragger {

    private pointsStore = new Map<SVGElement, number[][]>();

    constructor(
        private zoom: Zoom,
    ) {}

    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        this.pointsStore.set(
            element,
            element.getAttribute('points')!
            .split(/\s/)
            .map(
                pair => pair
                    .trim()
                    .split(',')
                    .map(val => parseInt(val))
            )
            .map(([pX, pY]) => [
                Math.round(clientX - (pX * this.zoom.value)),
                Math.round(clientY - (pY * this.zoom.value)),
            ])
        );
    }

    onMousemove(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        const storePoints = this.pointsStore.get(element)!;
        const newPoints = storePoints
        .map(([sX, sY]) => [
            Math.round((clientX - sX) / this.zoom.value),
            Math.round((clientY - sY) / this.zoom.value),
        ])
        .map(pair => pair.join(','))
        .join(' ');
        element.setAttribute('points', newPoints);
    }

    onMouseup(
        element: SVGElement,
        _clientX: number,
        _clientY: number,
    ) {}

}
