import { makeMethodIterator } from "@/common/iterators";
import { userEventMan } from "@/webview/services/user-event";
import { LayerComponent } from "@/webapp/components/layer.component";



const initialX = 50;
const initialY = 100;


export class CanvasMove {

    private bindedOnMouseDown: (event: MouseEvent) => void;
    private bindedOnMouseMove: (event: MouseEvent) => void;
    private bindedOnMouseUp: (event: MouseEvent) => void;

    private coords: {clientX: number, clientY: number} = {clientX: initialX, clientY: initialY};

    private marginLeft = initialX;
    private marginTop = initialY;

    public readonly initialX = initialX;
    public readonly initialY = initialY;

    // target: HTMLElement = artboard.box;

    constructor(
        private artboardLayer: LayerComponent,
    ) {
        this.bindedOnMouseDown = this.onMouseDown.bind(this);
        this.bindedOnMouseMove = this.onMouseMove.bind(this);
        this.bindedOnMouseUp = this.onMouseUp.bind(this);
    }

    get left(): number {
        return this.marginLeft;
    }

    get top(): number {
        return this.marginTop;
    }

    initPosition() {
        Object.assign(this.artboardLayer.div.style, {
            position: 'absolute',
            top: `${ initialY }px`,
            left: `${ initialX }px`,
        });
    }

    on() {
        window.addEventListener('mousedown', this.bindedOnMouseDown);
    }

    off() {
        window.removeEventListener('mousedown', this.bindedOnMouseDown);
    }

    
    @makeMethodIterator()
    onMouseDown(event: MouseEvent) {
        if (userEventMan.mode === 'interactive') {
            return event;
        }
        const { clientX, clientY } = event;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        Object.assign(this.coords, { clientX: deltaX, clientY: deltaY });
        this.controlPropagation(event);
        window.addEventListener('mousemove', this.bindedOnMouseMove);
        window.addEventListener('mouseup', this.bindedOnMouseUp);
        return event;
    }

    @makeMethodIterator()
    onMouseMove(event: MouseEvent) {
        const { clientX, clientY } = event;
        const box = this.artboardLayer.div;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        this.marginLeft = deltaX;
        this.marginTop = deltaY;
        box.style.top = `${ this.marginTop }px`;
        box.style.left = `${ this.marginLeft }px`;
        this.controlPropagation(event);
        return {left: this.marginLeft, top: this.marginTop, event};
    }

    @makeMethodIterator()
    onMouseUp(event: MouseEvent) {
        const { clientX, clientY } = event;
        const deltaX = clientX - this.coords.clientX;
        const deltaY = clientY - this.coords.clientY;
        Object.assign(this.coords, {clientX: deltaX, clientY: deltaY});
        this.controlPropagation(event);
        window.removeEventListener('mousemove', this.bindedOnMouseMove);
        window.removeEventListener('mouseup', this.bindedOnMouseUp);
        return event;
    }

    controlPropagation(_event: MouseEvent): void {
        // event.stopPropagation();
    }

}
