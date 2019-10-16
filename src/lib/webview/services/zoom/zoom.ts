import { makeMethodIterator } from "@/common/iterators";
import { artboard } from "@/webview/services/artboard";


/**
 * controls artboard zoom
 */
export class Zoom {

    private zoom = 1;

    /**
     * zoom value getter
     */
    get value(): number {
        return this.zoom;
    }

    /**
     * update zoom value by relative (delta) value or to absolute (abs) value
     */
    @makeMethodIterator()
    update(delta: number | undefined, abs: number | undefined): number {
        if (delta) {
            this.zoom += delta;
        }
        if (abs) {
            this.zoom = abs;
        }
        Object.assign(artboard.box.style, {
            transform: `scale(${ this.zoom })`,
        });
        return this.zoom;
    }

}
