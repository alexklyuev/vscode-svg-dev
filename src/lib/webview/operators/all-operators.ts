import { CreateOperator } from "@/webview/models/operators/create-operator.model";
import { Dragger } from "@/webview/models/operators/drag-operator.model";
import { Mover } from "@/webview/models/operators/move-operator.model";
import { EditOperator } from "@/webview/models/operators/edit-operator.model";
import { CopyOperator } from "@/webview/models/operators/copy-operator.model";


interface Operators {
    createOperator: CreateOperator;
    dragOperator: Dragger;
    moveOperator: Mover;
    editPointsOperator: EditOperator;
    editBoxOperator: EditOperator;
    copyOperator: CopyOperator;
}

export type PartialOperators = Partial<Operators>;

