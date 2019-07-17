import { ClientEvent, connectEvent } from "../../entities/client-event";

const enum ElementHolderEvents {
    setElements = 'setElements',
}

export class ElementHolder {

    public readonly [ElementHolderEvents.setElements] = new ClientEvent<SVGElement[]>();

    private box = Array<SVGElement>();

    private callbacks = new Set<(element: SVGElement[]) => void>();

    get elements(): SVGElement[] {
        return this.box;
    }

    set elements(val: SVGElement[]) {
        this.box = val;
        this.callbacks.forEach(callback => callback(val));
        this.fireElements(val);
    }

    @connectEvent(ElementHolderEvents.setElements)
    fireElements(elements: SVGElement[]): SVGElement[] {
        return elements;
    }

    addListener(callback: (element: SVGElement[]) => void) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

}
