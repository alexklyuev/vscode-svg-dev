export class ElementHolder {

    private box = Array<SVGElement>();

    private callbacks = new Set<(element: SVGElement[]) => void>();

    get elements(): SVGElement[] {
        return this.box;
    }

    set elements(val: SVGElement[]) {
        this.box = val;
        this.callbacks.forEach(callback => callback(val));
    }

    addListener(callback: (element: SVGElement[]) => void) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

}
