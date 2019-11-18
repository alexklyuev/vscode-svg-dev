import { editHub } from "@/webview/services/edit-hub";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { EditRequest, editPipe } from "@/shared/pipes/edit.pipe";
import { holder } from "@/webview/services/holder";
import { EditMode } from "@/shared/pipes/edit-mode.pipe";
import { sprites } from "@/webview/services/sprites";
import { EditOperator } from "@/webview/models/operators/edit-operator.model";


export class EditListener {
    private editClient: PipeEndpoint<EditRequest, {}, "edit">;

    constructor(
    ) {
        this.editClient = webviewEndpoint.createFromPipe(editPipe);
    }

    listen() {
        this.editClient.listenSetRequest(
            _request => holder.elements.length,
            ({ mode }, _length) => {
                this.editElement(mode);
            },
        );
    }

    editElement(mode: EditMode) {
        // editHub.editMode = 'off';
        // editHub.startEditing(element);
        const element = holder.elements[0];
        if (element) {
            const sprite = sprites.resolve(element);
            if (sprite) {
                let operator: EditOperator | undefined | null = null;
                switch (mode) {
                    case 'points':
                        operator = sprite.operators.editPointsOperator;
                        break;
                    case 'box':
                        operator = sprite.operators.editBoxOperator;
                        break;
                }
                if (operator) {
                    const eject = operator.edit(element);
                    editHub.takeActiveElement(element);
                    editHub.takeCancelationFn(eject);
                }
            }
        }
    }

}
