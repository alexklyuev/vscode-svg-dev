import { Dragger } from "@/webview/models/operators/drag-operator.model";
import { Mover } from "@/webview/models/operators/move-operator.model";
import { EditOperator } from "@/webview/models/operators/edit-operator.model";
import { CreateOperator } from "./operators/create-operator.model";


export interface Sprite<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    createOperator?: CreateOperator;

    dragOperator: Dragger;

    moveOperator?: Mover;

    editPointsOperator?: EditOperator;

    editBoxOperator?: EditOperator;

    // create(elementName: string, attributes: {[K: string]: string}): void;

    // edit?(element: SVGElement): void | (() => void);

    // editBox?(element: SVGElement): () => void;

}
