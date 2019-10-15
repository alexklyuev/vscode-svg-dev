import { makeMethodIterator } from "@/common/iterators";
import { Shape } from "./shapes/shape";
// import { EventBus, connectEvent } from "../../../../lib/common/events";
import { Outlet } from "./models/outlet.model";


export class ShapesOutlet implements Outlet {

    // public readonly createShapeEvent = new EventBus<string>();

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

    // @connectEvent('createShapeEvent')
    @makeMethodIterator()
    createShape(name: string) {
        return name;
    }

}
