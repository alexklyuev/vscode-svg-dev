import { webviewEndpoint } from "&resolve/webview-endpoint";
import { editHub } from "@/webview/services/edit-hub";
import { editModePipe } from "../../../shared/pipes/edit-mode.pipe";
import { Listener } from "@/webview/models/listener.model";


export class EditModeListener implements Listener {
    private editModeClient = webviewEndpoint.createFromPipe(editModePipe);

    listen() {
        this.editModeClient.listenSetRequest(
            _request => true,
            (request, _true) => {
                const { mode } = request;
                editHub.dispatchEditMode(mode);
            },
        );
    }

}
