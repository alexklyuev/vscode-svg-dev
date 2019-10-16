import { MoverAbstract } from "./mover-abstract";

export class MoverValue extends MoverAbstract {

    constructor(
        private xAttrs: string[],
        private yAttrs: string[],
    ) {
        super();
    }

    by(element: SVGElement, {x, y}: {x: number, y: number}) {
        if (x) {
            this.xAttrs.forEach(attr => {
                const val = element.getAttribute(attr);
                if (val) {
                    const numVal = parseFloat(val);
                    element.setAttribute(attr, `${ numVal + x }`);
                }
            });
        }
        if (y) {
            this.yAttrs.forEach(attr => {
                const val = element.getAttribute(attr);
                if (val) {
                    const numVal = parseFloat(val);
                    element.setAttribute(attr, `${ numVal + y }`);
                }
            });
        }
    }

}
