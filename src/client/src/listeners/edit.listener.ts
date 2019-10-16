import { editPointsHub } from "@/webview/services/edit-points-hub";
import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { EditRequest } from "../../../shared/pipes/edit.pipe";
import { FiguresCollection } from "../figures/figures-collection";
import { ElementHolder } from "../services/picker/element-holder";


export class EditListener {
    private editClient: PipeEndpoint<EditRequest, {}, "edit">;

    constructor(
        private editPipe: Pipe<EditRequest, {}, 'edit'>,
        public figuresCollection: FiguresCollection,
        private holder: ElementHolder,
    ) {
        this.editClient = webviewEndpoint.createFromPipe(this.editPipe);
    }

    listen() {
        this.editClient.listenSetRequest(
            _request => this.holder.elements.length,
            ({}, _length) => {
                this.editElement();
            },
        );
    }

    private editElement() {
        const element = this.holder.elements[0];
        editPointsHub.startEditing(element);
    }

}
