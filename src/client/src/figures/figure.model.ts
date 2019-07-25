import { Dragger } from "../services/dragger/dragger.interface";
import { Mover } from "../services/mover/mover.model";

export interface Figure<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    drag: Dragger;

    testByElement(element: any): element is Ctor;

    create(elementName: string, attributes: {[K: string]: string}): void;

    edit?(element: SVGElement): void;

    move?: Mover;

}
