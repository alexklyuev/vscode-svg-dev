import { Zoom } from "../zoom/zoom";
import { Dragger } from "./dragger.interface";


export class DraggerValue implements Dragger {

    private attrsStore = new Map<SVGElement, {[K: string]: number}>();

    constructor(
        private xAttrs: string[],
        private yAttrs: string[],
        private zoom: Zoom,
    ) {}

    onMousedown(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        this.attrsStore.set(
            element,
            Object.assign(
                {},
                this.xAttrs.reduce((akk, key) => {
                    akk[key] = this.getValueAttr(element, key, clientX);
                    return akk;
                }, {} as {[K: string]: number}),
                this.yAttrs.reduce((akk, key) => {
                    akk[key] = this.getValueAttr(element, key, clientY);
                    return akk;
                }, {} as {[K: string]: number}),
            ),
        );
    }

    onMousemove(
        element: SVGElement,
        clientX: number,
        clientY: number,
    ) {
        const storeVals = this.attrsStore.get(element)!;
        this.xAttrs.forEach(key => {
            const val = Math.round((clientX - storeVals[key]) / this.zoom.value);
            element.setAttribute(key, `${val}`);
        });
        this.yAttrs.forEach(key => {
            const val = Math.round((clientY - storeVals[key]) / this.zoom.value);
            element.setAttribute(key, `${val}`);
        });
    }

    onMouseup(
        element: SVGElement,
        _clientX: number,
        _clientY: number,
    ) {
        this.attrsStore.delete(element);
    }

    getValueAttr(
        element: SVGElement,
        key: string,
        clientVal: number,
    ) {
        return Math.round(clientVal - (parseInt(element.getAttribute(key)!) || 0) * this.zoom.value);
    }

    setValueAttr(
        element: SVGElement,
        key: string,
        storeValue: number,
        clientVal: number
    ) {
        const val = Math.round((clientVal - storeValue) / this.zoom.value);
        element.setAttribute(key, `${val}`);
    }

}
