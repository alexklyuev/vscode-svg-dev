import { Dragger } from "./dragger.interface";
import { Zoom } from "../zoom/zoom";



export class DraggerPath implements Dragger {

    constructor(
        private zoom: Zoom,
    ) {}

    onMousedown() {}

    onMousemove() {}

    onMouseup() {}

}
