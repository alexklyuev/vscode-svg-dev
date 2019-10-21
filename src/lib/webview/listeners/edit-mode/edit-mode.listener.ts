import { webviewEndpoint } from "@/webview/services/webview-endpoint";
import { editPointsHub } from "@/webview/services/edit-points-hub";
import { editModePipe } from "../../../../shared/pipes/edit-mode.pipe";


export class EditModeListener {
    private editModeClient = webviewEndpoint.createFromPipe(editModePipe);

    listen() {
        this.editModeClient.listenSetRequest(
            _request => true,
            (request, _true) => {
                const { mode } = request;
                switch (mode) {
                    case 'off':
                        editPointsHub.editOnPick = false;
                        break;
                    case 'points':
                        editPointsHub.editOnPick = true;
                }
            },
        );
    }
}
