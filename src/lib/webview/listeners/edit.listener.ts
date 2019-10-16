import { editPointsHub } from "@/webview/services/edit-points-hub";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { EditRequest, editPipe } from "../../../shared/pipes/edit.pipe";
import { holder } from "../services/holder";


export class EditListener {
    private editClient: PipeEndpoint<EditRequest, {}, "edit">;

    constructor(
    ) {
        this.editClient = webviewEndpoint.createFromPipe(editPipe);
    }

    listen() {
        this.editClient.listenSetRequest(
            _request => holder.elements.length,
            ({}, _length) => {
                this.editElement();
            },
        );
    }

    private editElement() {
        const element = holder.elements[0];
        editPointsHub.startEditing(element);
    }

}
