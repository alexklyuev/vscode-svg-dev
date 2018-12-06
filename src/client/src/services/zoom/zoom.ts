import { Artboard } from "../../services/artboard/artboard";


export class Zoom {

    private zoom = 1;

    private callbacks = new Set<(value: number) => void>();

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
    update(delta: number | undefined, abs: number | undefined) {
        if (delta) {
            this.zoom += delta;
        }
        if (abs) {
            this.zoom = abs;
        }
        Object.assign(this.artboard.box.style, {
            transform: `scale(${this.zoom})`,
        });
        Object.assign(this.artboard.box.style, {
            position: `absolute`,
            top: '0',
            left: '0',
        });
        this.callbacks.forEach(cb => cb(this.value));
    }

    /**
     * add callback, it would be run on zoom value change
     */
    addCallback(callback: (value: number) => void) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

}
