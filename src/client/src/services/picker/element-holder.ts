import { makeIterator } from "@/common/iterators";


export class ElementHolder {

    private box = Array<SVGElement>();

    get elements(): SVGElement[] {
        return this.box;
    }

    set elements(val: SVGElement[]) {
        this.box = val;
        this.elementsHasBeenSet(val);
    }

    @makeIterator()
    elementsHasBeenSet(elements: SVGElement[]): SVGElement[] {
        return elements;
    }

}
