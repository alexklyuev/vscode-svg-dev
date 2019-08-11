import { Artboard } from "../../services/artboard/artboard";
import { EventBus, connectEvent } from "../../../../lib/common/events";
import { makeIterator } from "../../iterators";


/**
 * 
 */
const enum ZoomEvents {
    valueChange = 'valueChange',
}

/**
 * 
 */
export class Zoom {

    private zoom = 1;

    public readonly [ZoomEvents.valueChange] = new EventBus<number>();

    constructor(
        private artboard: Artboard,
    ) {}

    /**
     * zoom value getter
     */
    get value(): number {
        return this.zoom;
    }

    /**
     * update zoom value by relative (delta) value or to absolute (abs) value
     */
    @makeIterator
    @connectEvent(ZoomEvents.valueChange)
    update(delta: number | undefined, abs: number | undefined): number {
        if (delta) {
            this.zoom += delta;
        }
        if (abs) {
            this.zoom = abs;
        }
        Object.assign(this.artboard.box.style, {
            transform: `scale(${this.zoom})`,
        });
        return this.zoom;
    }

}
