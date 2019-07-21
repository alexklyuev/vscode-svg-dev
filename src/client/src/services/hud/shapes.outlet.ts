import { Shape } from "./shapes/shape";
import { connectEvent, ClientEvent } from "../../entities/client-event";


export class ShapesOutlet {

    public readonly createShapeEvent = new ClientEvent<string>();

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
