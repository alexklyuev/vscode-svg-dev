import { PartialOperators } from "@/webview/operators/all-operators";


export interface Sprite<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    // createOperator?: CreateOperator;

    // dragOperator: Dragger;

    // moveOperator?: Mover;

    // editPointsOperator?: EditOperator;

    // editBoxOperator?: EditOperator;

    operators: PartialOperators;

}
