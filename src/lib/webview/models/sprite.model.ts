import { Dragger } from "@/webview/draggers/dragger.interface";
import { Mover } from "@/webview/movers/mover.model";


export interface Sprite<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    drag: Dragger;

    move?: Mover;

    create(elementName: string, attributes: {[K: string]: string}): void;

    edit?(element: SVGElement): void | (() => void);

    editBox?(element: SVGElement): () => void;

    // testByElement(element: any): element is Ctor;

}
