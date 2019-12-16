import { PartialOperators } from "@/webview/operators/all-operators";


export interface Sprite<Ctor> {

    readonly name: string;

    readonly ctor: {new (): Ctor};

    readonly typeAttribute?: string;

    operators: PartialOperators;

}
