import { Dragger } from "../services/dragger/dragger.interface";

export interface Figure<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    drag: Dragger;

    testByElement(element: any): element is Ctor;

    create(elementName: string, attributes: {[K: string]: string}): void;

    edit?(element: SVGElement): void;

}
