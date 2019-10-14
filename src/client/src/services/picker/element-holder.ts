import { makeMethodIterator } from "@/common/iterators";


export class ElementHolder {

    private box = Array<SVGElement>();

    get elements(): SVGElement[] {
        return this.box;
    }

    set elements(val: SVGElement[]) {
        this.box = val;
        this.elementsHasBeenSet(val);
    }

    @makeMethodIterator()
    elementsHasBeenSet(elements: SVGElement[]): SVGElement[] {
        return elements;
    }

}
