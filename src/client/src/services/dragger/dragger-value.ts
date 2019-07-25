import { Zoom } from "../zoom/zoom";
import { Dragger } from "./dragger.interface";


export class DraggerValue implements Dragger {

    private attrsStore = new Map<SVGElement, {keys: {[K: string]: number}, initial: [number, number]}>();

    constructor(
        private xAttrs: string[],
        private yAttrs: string[],
        private zoom: Zoom,
    ) {}

    onMousedown(
        element: SVGElement,
        event: MouseEvent,
    ) {
        const { clientX, clientY } = event;
        this.attrsStore.set(
            element,
            {
                keys: Object.assign(
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
                initial: [clientX, clientY],
            }

        );
    }

    onMousemove(
        element: SVGElement,
        event: MouseEvent,
    ) {
        let { clientX, clientY, shiftKey } = event;
        const storeVals = this.attrsStore.get(element)!;
        const { keys, initial: [ initialX, initialY ] } = storeVals;
        if (shiftKey) {
            const absDX = Math.abs(clientX - initialX);
            const absDY = Math.abs(clientY - initialY);
            if (absDX > absDY) {
                clientY = initialY;
            } else {
                clientX = initialX;
            }
        }
        this.xAttrs.forEach(key => {
            const val = ((clientX - keys[key]) / this.zoom.value);
            element.setAttribute(key, `${ val }`);
        });
        this.yAttrs.forEach(key => {
            const val = ((clientY - keys[key]) / this.zoom.value);
            element.setAttribute(key, `${ val }`);
        });
    }

    onMouseup(
        element: SVGElement,
        _event: MouseEvent,
    ) {
        this.attrsStore.delete(element);
    }

    getValueAttr(
        element: SVGElement,
        key: string,
        clientVal: number,
    ) {
        return (clientVal - (parseFloat(element.getAttribute(key)!) || 0) * this.zoom.value);
    }

    setValueAttr(
        element: SVGElement,
        key: string,
        storeValue: number,
        clientVal: number
    ) {
        const val = ((clientVal - storeValue) / this.zoom.value);
        element.setAttribute(key, `${val}`);
    }

}
