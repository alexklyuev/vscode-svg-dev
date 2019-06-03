import { Artboard } from "../../services/artboard/artboard";
import { ClientEvent } from "../../entities/client-event";
import { connectEvent } from "../../decorators/connect-event.decorator";


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

    public readonly [ZoomEvents.valueChange] = new ClientEvent<number>();

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
