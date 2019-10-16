import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { appearancePipe } from "../../../shared/pipes/appearance.pipe";


export const appearanceEndpoint = webviewEndpoint.createFromPipe(appearancePipe);
