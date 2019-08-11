import { Shape } from "./shapes/shape";
import { EventBus, connectEvent } from "../../../../lib/common/events";


export class ShapesOutlet {

    public readonly createShapeEvent = new EventBus<string>();

    private el: HTMLElement;
    private shapes: Shape[];
    
    constructor(
        ...shapes: Shape[]
    ) {
        this.shapes = shapes;
        this.el = document.createElement('div');
        Object.assign(this.el.style, {
            display: 'inline-block',
            'user-select': 'none',
        });
        this.shapes.forEach(shape => {
            shape.appendTo(this.el);
            shape.createEvent.on(_event => {
                this.createShape(shape.name);
            });
        });
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.el);
    }

    @connectEvent('createShapeEvent')
    createShape(name: string) {
        return name;
    }

}
