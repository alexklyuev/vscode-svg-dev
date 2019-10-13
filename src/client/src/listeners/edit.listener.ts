import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../lib/common/pipe/pipe";
import { EditRequest } from "../../../shared/pipes/edit.pipe";
import { FiguresCollection } from "../figures/figures-collection";
import { ElementHolder } from "../services/picker/element-holder";
import { EditPointsHub } from "../services/cancel-hub/cancel-hub";


export class EditListener {
    private editClient: PipeEndpoint<EditRequest, {}, "edit">;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private editPipe: Pipe<EditRequest, {}, 'edit'>,
        private figuresCollection: FiguresCollection,
        private holder: ElementHolder,
        private cancelHub: EditPointsHub,
    ) {
        this.editClient = this.webviewEndpoint.createFromPipe(this.editPipe);
    }

    listen() {
        this.editClient.listenSetRequest(
            _request => this.holder.elements.length,
            ({}, _length) => {
                this.editElement();
            },
        );
    }

    editElement() {
        const element = this.holder.elements[0];
        if (!this.cancelHub.isSameElement(element)) {
            const delegate = this.figuresCollection.delegate(element);
            if (delegate && delegate.edit instanceof Function) {
                const cancelFn = delegate.edit(element);
                if (cancelFn instanceof Function) {
                    this.cancelHub.take(element, cancelFn);
                }
            }
        }
    }

}
