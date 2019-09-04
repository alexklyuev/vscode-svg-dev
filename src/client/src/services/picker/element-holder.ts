import { makeIterator } from "@/common/iterators";


export class ElementHolder {

    private box = Array<SVGElement>();

    get elements(): SVGElement[] {
        return this.box;
    }

    set elements(val: SVGElement[]) {
        this.box = val;
        this.fireElements(val);
    }

    @makeIterator()
    fireElements(elements: SVGElement[]): SVGElement[] {
        return elements;
    }

}
