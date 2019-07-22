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
            margin: '10px 2px 0px 0px',
            padding: '3px 10px 3px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            'user-select': 'none',
        });
        this.el.innerHTML = `shapes: `;

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
