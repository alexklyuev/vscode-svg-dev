import { makeMethodIterator } from "@/common/iterators";


export class CanvasZoom {

    private zoomValue = 1;

    get zoom() {
        return this.zoomValue;
    }

    get value() {
        return this.zoomValue;
    }

    @makeMethodIterator()
    update(values: {delta?: number, abs?: number}): number {
        const { delta, abs } = values;
        if (abs !== void 0) {
            this.zoomValue = abs;
        }
        if (delta !== void 0) {
            this.zoomValue += delta;
        }
        return this.zoomValue;
    }

}
