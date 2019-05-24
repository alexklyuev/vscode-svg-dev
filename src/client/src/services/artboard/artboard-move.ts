import { Artboard } from "./artboard";


export class ArtboardMove {

    private bindedOnMouseDown: (event: MouseEvent) => void;
    private bindedOnMouseMove: (event: MouseEvent) => void;
    private bindedOnMouseUp: (event: MouseEvent) => void;

    private onMouseDownCallbacks = new Set<(event: MouseEvent) => void>();
    private onMouseMoveCallbacks = new Set<(event: MouseEvent) => void>();
    private onMouseUpCallbacks = new Set<(event: MouseEvent) => void>();

    private coords: {clientX: number, clientY: number} = {clientX: 0, clientY: 0};

    private marginLeft = 0;
    private marginTop = 0;

    constructor(
        private artboard: Artboard,
    ) {
        this.bindedOnMouseDown = this.onMouseDown.bind(this);
        this.bindedOnMouseMove = this.onMouseMove.bind(this);
        this.bindedOnMouseUp = this.onMouseUp.bind(this);

        const box = this.artboard.box;
        box.style.position = 'absolute';
        box.style.top = '0px';
        box.style.left = '0px';
    }

    get left(): number {
        return this.marginLeft;
    }

    get top(): number {
        return this.marginTop;
    }

    on() {
        window.addEventListener('mousedown', this.bindedOnMouseDown);
    }

    off() {
        window.removeEventListener('mousedown', this.bindedOnMouseDown);
    }

    
    onMouseDown(event: MouseEvent) {
        const { clientX, clientY } = event;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        Object.assign(this.coords, { clientX: deltaX, clientY: deltaY });
        this.controlPropagation(event);
        window.addEventListener('mousemove', this.bindedOnMouseMove);
        window.addEventListener('mouseup', this.bindedOnMouseUp);
        this.onMouseDownCallbacks.forEach(cb => cb(event));
    }

    onMouseMove(event: MouseEvent) {
        const { clientX, clientY } = event;
        const box = this.artboard.box;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        this.marginLeft = deltaX;
        this.marginTop = deltaY;
        box.style.top = `${ this.marginTop }px`;
        box.style.left = `${ this.marginLeft }px`;
        this.controlPropagation(event);
        this.onMouseMoveCallbacks.forEach(cb => cb(event));
    }

    onMouseUp(event: MouseEvent) {
        const { clientX, clientY } = event;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        Object.assign(this.coords, {clientX: deltaX, clientY: deltaY});
        this.controlPropagation(event);
        window.removeEventListener('mousemove', this.bindedOnMouseMove);
        window.removeEventListener('mouseup', this.bindedOnMouseUp);
        //
        this.onMouseUpCallbacks.forEach(cb => cb(event));
    }

    controlPropagation(_event: MouseEvent): void {
        // event.stopPropagation();
    }

    addOnMouseDownCallback(cb: (event: MouseEvent) => void) {
        this.onMouseDownCallbacks.add(cb);
    }

    addOnMouseMoveCallback(cb: (event: MouseEvent) => void) {
        this.onMouseMoveCallbacks.add(cb);
    }

    addOnMouseUpCallback(cb: (event: MouseEvent) => void) {
        this.onMouseUpCallbacks.add(cb);
    }

}
